import { NextResponse } from "next/server";

import { authEndpoints } from "@/features/auth/services/auth-endpoints";
import { parseAuthResponse, requestAuthApi } from "@/features/auth/services/auth-server.service";
import type { OAuthProvider } from "@/features/auth/types/auth.types";
import { sessionCookieName, sessionCookieOptions } from "@/lib/auth/auth-cookie";

const providers: OAuthProvider[] = ["google", "apple"];

export async function GET(request: Request, context: { params: Promise<{ provider: string }> }) {
  const { provider } = await context.params;
  const requestUrl = new URL(request.url);

  if (!providers.includes(provider as OAuthProvider)) {
    return NextResponse.redirect(new URL("/login?error=provider", request.url));
  }

  try {
    const endpoint = `${authEndpoints.oauthCallback(provider)}${requestUrl.search}`;
    const upstream = await requestAuthApi(endpoint, { method: "GET" });
    const data = await parseAuthResponse(upstream);
    const token = data.accessToken ?? data.token;

    if (!upstream.ok || !token) {
      return NextResponse.redirect(new URL("/login?error=oauth", request.url));
    }

    const response = NextResponse.redirect(new URL("/dashboard", request.url));
    response.cookies.set(sessionCookieName, token, sessionCookieOptions);
    return response;
  } catch {
    return NextResponse.redirect(new URL("/login?error=service", request.url));
  }
}
