import { NextResponse } from "next/server";

import { authEndpoints } from "@/features/auth/services/auth-endpoints";
import { buildApiUrl } from "@/features/auth/services/auth-server.service";
import type { OAuthProvider } from "@/features/auth/types/auth.types";

const providers: OAuthProvider[] = ["google", "apple"];

export async function GET(request: Request, context: { params: Promise<{ provider: string }> }) {
  const { provider } = await context.params;

  if (!providers.includes(provider as OAuthProvider)) {
    return NextResponse.redirect(new URL("/login?error=provider", request.url));
  }

  const callbackUrl = new URL(`/api/auth/oauth/${provider}/callback`, request.url);
  const upstreamUrl = new URL(buildApiUrl(authEndpoints.oauth(provider)));
  upstreamUrl.searchParams.set("callbackUrl", callbackUrl.toString());

  return NextResponse.redirect(upstreamUrl);
}
