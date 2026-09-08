// Run after `npm run build`. Uses an isolated API fixture and test-only cookies;
// never connects to the configured application API or its database.
import assert from "node:assert/strict";
import { createServer } from "node:http";
import { spawn } from "node:child_process";
import { once } from "node:events";
import { createRequire } from "node:module";
const require = createRequire(import.meta.url);
const { encode, decode } = require("next-auth/jwt");
const secret = "isolated-auth-flow-test-secret-only";
let permissions = [];
let revoked = false;
let refreshCount = 0;
let publicReads = 0;
const api = createServer(async (request, response) => {
  let data;
  let status = 200;
  if (request.url === "/auth/login" || request.url === "/auth/refresh") {
    if (revoked) status = 401;
    if (request.url === "/auth/refresh") refreshCount++;
    data = {
      accessToken: "fixture-access",
      refreshToken: "fixture-refresh",
      expiresIn: "60s",
      refreshExpiresIn: "30d",
    };
  } else if (request.url === "/auth/me") {
    if (revoked || request.headers.authorization !== "Bearer fixture-access") status = 401;
    data = {
      id: "fixture-user",
      fullName: "Fixture User",
      email: "fixture@example.com",
      status: "ACTIVE",
      permissions,
    };
  } else if (request.url === "/church/settings") {
    assert.equal(request.headers.authorization, undefined);
    publicReads++;
    data = null;
  } else status = 404;
  response.writeHead(status, { "Content-Type": "application/json" });
  response.end(JSON.stringify({ success: status === 200, message: "fixture", data }));
});
api.listen(0, "127.0.0.1");
await once(api, "listening");
const portProbe = createServer().listen(0, "127.0.0.1");
await once(portProbe, "listening");
const port = portProbe.address().port;
await new Promise((resolve) => portProbe.close(resolve));
const origin = `http://localhost:${port}`;
const next = spawn(process.execPath, ["node_modules/next/dist/bin/next", "start", "-p", String(port)], {
  windowsHide: true,
  env: {
    ...process.env,
    NODE_ENV: "production",
    NEXTAUTH_SECRET: secret,
    NEXTAUTH_URL: origin,
    API_URL: `http://127.0.0.1:${api.address().port}`,
    NEXT_PUBLIC_API_URL: `http://127.0.0.1:${api.address().port}`,
  },
  stdio: "ignore",
});
const jar = new Map();
async function visit(path, init = {}) {
  const response = await fetch(`${origin}${path}`, {
    ...init,
    redirect: "manual",
    headers: { cookie: [...jar].map(([key, value]) => `${key}=${value}`).join("; "), ...init.headers },
  });
  for (const cookie of response.headers.getSetCookie()) {
    const pair = cookie.split(";")[0];
    const index = pair.indexOf("=");
    jar.set(pair.slice(0, index), pair.slice(index + 1));
  }
  return response;
}
async function alterExpiry(both = false) {
  const token = await decode({ token: jar.get("next-auth.session-token"), secret });
  assert.ok(token);
  token.accessTokenExpires = 0;
  if (both) token.refreshTokenExpires = 0;
  jar.set("next-auth.session-token", await encode({ token, secret }));
}
try {
  for (let attempt = 0; ; attempt++) {
    try {
      await fetch(`${origin}/api/auth/csrf`);
      break;
    } catch {
      if (attempt > 80) throw new Error("Next.js did not start");
      await new Promise((resolve) => setTimeout(resolve, 250));
    }
  }
  for (const path of [
    "/login",
    "/recuperar-senha",
    "/renovar-sessao",
    "/assets/images/logo.png",
    "/api/auth/session",
  ]) {
    assert.equal((await visit(path)).status, 200, `${path} must be public`);
  }
  assert.match((await visit("/")).headers.get("location"), /\/login\?/);
  const csrf = await (await visit("/api/auth/csrf")).json();
  const login = await visit("/api/auth/callback/credentials", {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({
      csrfToken: csrf.csrfToken,
      email: "fixture@example.com",
      password: "test-password",
      json: "true",
      callbackUrl: origin,
    }),
  });
  assert.equal(login.status, 200);
  assert.ok(jar.get("next-auth.session-token"), "NextAuth must persist its session cookie");
  const session = await (await visit("/api/auth/session")).json();
  assert.equal(session.user.status, "ACTIVE");
  assert.equal(session.accessToken, undefined, "API tokens must not be exposed to the browser session");
  assert.equal(session.refreshToken, undefined);
  const dashboard = await visit("/");
  assert.equal(dashboard.status, 200);
  assert.ok(
    !(await dashboard.text()).includes('href="/configuracoes/igreja"'),
    "settings menu must be hidden",
  );
  assert.equal(
    new URL((await visit("/configuracoes/igreja")).headers.get("location"), origin).href,
    `${origin}/`,
  );
  permissions = ["church.settings.update"];
  const allowed = await visit("/configuracoes/igreja");
  assert.equal(allowed.status, 200);
  assert.match(await allowed.text(), /Salvar configura/);
  assert.ok(publicReads > 0, "settings must load without authentication headers");
  await alterExpiry();
  assert.match((await visit("/")).headers.get("location"), /\/renovar-sessao\?/);
  const renewed = await (await visit("/api/auth/session")).json();
  assert.equal(renewed.user.status, "ACTIVE");
  assert.equal(refreshCount, 1);
  assert.equal((await visit("/")).status, 200, "renewed cookie must be usable on the next request");
  const validCookie = jar.get("next-auth.session-token");
  await alterExpiry(true);
  assert.match((await visit("/")).headers.get("location"), /\/login\?/);
  assert.equal(
    (await visit("/login?error=session")).status,
    200,
    "expired sessions must not loop back to protected routes",
  );
  jar.set("next-auth.session-token", validCookie);
  revoked = true;
  assert.match((await visit("/")).headers.get("location"), /\/login\?/);
  jar.set("next-auth.session-token", "tampered");
  assert.match((await visit("/")).headers.get("location"), /\/login\?/);
  console.log(
    "PASS: public routes, login cookies, permission guards, public settings, refresh persistence, expiry redirects, revocation and tamper rejection.",
  );
} finally {
  next.kill();
  await new Promise((resolve) => api.close(resolve));
}
