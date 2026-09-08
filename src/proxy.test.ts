import { NextRequest } from "next/server";
import { getToken } from "next-auth/jwt";
import { beforeEach, describe, expect, it, vi } from "vitest";

import { validateToken } from "@/lib/auth/token-lifecycle";
import { proxy } from "@/proxy";

vi.mock("next-auth/jwt", () => ({ getToken: vi.fn() }));

vi.mock("@/lib/auth/token-lifecycle", () => ({ validateToken: vi.fn() }));

describe("proteção otimista do dashboard", () => {
  beforeEach(() => {
    vi.resetAllMocks();
    vi.mocked(validateToken).mockImplementation(async (token) => token);
  });

  it("redireciona visitantes sem sessão para o login", async () => {
    vi.mocked(getToken).mockResolvedValueOnce(null);
    const response = await proxy(new NextRequest("http://localhost?tab=hoje"));

    expect(response.status).toBe(307);
    expect(response.headers.get("location")).toBe(
      "http://localhost/login?redirectTo=%2F%3Ftab%3Dhoje&error=session",
    );
  });

  it("permite continuar com uma sessão ativa", async () => {
    vi.mocked(getToken).mockResolvedValueOnce({
      status: "ACTIVE",
      userId: "user-1",
      permissions: [],
      accessToken: "access",
      accessTokenExpires: Date.now() + 60_000,
    });
    const response = await proxy(new NextRequest("http://localhost/"));

    expect(response.headers.get("x-middleware-next")).toBe("1");
  });

  it("trata falhas na leitura da sessão como acesso não autenticado", async () => {
    vi.mocked(getToken).mockRejectedValueOnce(new Error("invalid token"));
    const response = await proxy(new NextRequest("http://localhost/"));

    expect(response.status).toBe(307);
  });

  it.each([
    "/login",
    "/cadastro",
    "/recuperar-senha",
    "/redefinir-senha",
    "/verificar-email",
    "/renovar-sessao",
    "/api/auth/session",
    "/_next/static/app.js",
    "/assets/images/logo.png",
    "/privacy",
  ])("keeps %s public", async (path) => {
    expect((await proxy(new NextRequest(`http://localhost${path}`))).headers.get("x-middleware-next")).toBe(
      "1",
    );
    expect(getToken).not.toHaveBeenCalled();
  });

  it("sends expired access tokens to the cookie-persisting renewal flow", async () => {
    vi.mocked(getToken).mockResolvedValue({
      status: "ACTIVE",
      userId: "user",
      permissions: [],
      accessTokenExpires: 0,
      refreshToken: "refresh",
      refreshTokenExpires: Date.now() + 60_000,
    });
    expect(
      (await proxy(new NextRequest("http://localhost/configuracoes/igreja"))).headers.get("location"),
    ).toContain("/renovar-sessao?redirectTo=");
  });

  it("redirects to login when both tokens are expired", async () => {
    vi.mocked(getToken).mockResolvedValue({
      status: "ACTIVE",
      userId: "user",
      permissions: [],
      accessTokenExpires: 0,
      refreshToken: "refresh",
      refreshTokenExpires: 0,
    });
    expect((await proxy(new NextRequest("http://localhost/"))).headers.get("location")).toContain("/login?");
  });

  it("denies direct settings-page access without backend permission", async () => {
    vi.mocked(getToken).mockResolvedValue({
      status: "ACTIVE",
      userId: "user",
      permissions: [],
      accessToken: "access",
      accessTokenExpires: Date.now() + 60_000,
    });
    expect(
      (await proxy(new NextRequest("http://localhost/configuracoes/igreja"))).headers.get("location"),
    ).toBe("http://localhost/");
  });

  it.each(["/configuracoes/usuarios", "/configuracoes/permissoes"])(
    "denies direct access to %s without system administrator permission",
    async (path) => {
      vi.mocked(getToken).mockResolvedValue({
        status: "ACTIVE",
        userId: "user",
        permissions: ["church.settings.update"],
        accessToken: "access",
        accessTokenExpires: Date.now() + 60_000,
      });
      expect((await proxy(new NextRequest(`http://localhost${path}`))).headers.get("location")).toBe(
        "http://localhost/",
      );
    },
  );

  it.each(["/configuracoes/usuarios", "/configuracoes/permissoes"])(
    "allows a system administrator to access %s",
    async (path) => {
      vi.mocked(getToken).mockResolvedValue({
        status: "ACTIVE",
        userId: "admin",
        permissions: ["*"],
        accessToken: "access",
        accessTokenExpires: Date.now() + 60_000,
      });
      expect((await proxy(new NextRequest(`http://localhost${path}`))).headers.get("x-middleware-next")).toBe(
        "1",
      );
    },
  );

  it("rejects revoked sessions even if the cookie has not expired", async () => {
    vi.mocked(getToken).mockResolvedValue({
      status: "ACTIVE",
      userId: "user",
      permissions: [],
      accessToken: "access",
      accessTokenExpires: Date.now() + 60_000,
    });
    vi.mocked(validateToken).mockResolvedValue({
      status: "INACTIVE",
      userId: "user",
      permissions: [],
      error: "SessionExpired",
    });
    expect((await proxy(new NextRequest("http://localhost/"))).headers.get("location")).toContain("/login?");
  });
});
