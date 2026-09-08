import { NextResponse, type NextRequest } from "next/server";
import { getToken } from "next-auth/jwt";
import { validateToken } from "@/lib/auth/token-lifecycle";

const protectedRoots = [
  "membros",
  "ministerios",
  "avisos",
  "eventos",
  "estoque",
  "contribuicoes",
  "estudos-biblicos",
  "documentos",
  "configuracoes",
];

export async function proxy(request: NextRequest) {
  const { pathname, search } = request.nextUrl;
  if (
    pathname !== "/" &&
    !protectedRoots.some((root) => pathname === `/${root}` || pathname.startsWith(`/${root}/`))
  )
    return NextResponse.next();

  const destination = `${pathname}${search}`;
  const loginUrl = new URL("/login", request.url);
  loginUrl.searchParams.set("redirectTo", destination);
  loginUrl.searchParams.set("error", "session");
  try {
    const token = await getToken({ req: request, secret: process.env.NEXTAUTH_SECRET });
    if (!token || token.error || token.status !== "ACTIVE") return NextResponse.redirect(loginUrl);

    if (!token.accessToken || !token.accessTokenExpires || token.accessTokenExpires <= Date.now()) {
      if (token.refreshToken && token.refreshTokenExpires && token.refreshTokenExpires > Date.now()) {
        const renewUrl = new URL("/renovar-sessao", request.url);
        renewUrl.searchParams.set("redirectTo", destination);
        return NextResponse.redirect(renewUrl);
      }
      return NextResponse.redirect(loginUrl);
    }

    const verified = await validateToken(token, false);
    if (verified.error) return NextResponse.redirect(loginUrl);

    if (
      (pathname === "/configuracoes/igreja" || pathname.startsWith("/configuracoes/igreja/")) &&
      !verified.permissions.some(
        (permission) => permission === "*" || permission === "church.settings.update",
      )
    ) {
      return NextResponse.redirect(new URL("/", request.url));
    }
    if (
      (pathname === "/configuracoes/usuarios" ||
        pathname.startsWith("/configuracoes/usuarios/") ||
        pathname === "/configuracoes/permissoes" ||
        pathname.startsWith("/configuracoes/permissoes/")) &&
      !verified.permissions.includes("*")
    ) {
      return NextResponse.redirect(new URL("/", request.url));
    }
    return NextResponse.next();
  } catch {
    return NextResponse.redirect(loginUrl);
  }
}

export const config = {
  matcher: [
    "/",
    "/membros/:path*",
    "/ministerios/:path*",
    "/avisos/:path*",
    "/eventos/:path*",
    "/estoque/:path*",
    "/contribuicoes/:path*",
    "/estudos-biblicos/:path*",
    "/documentos/:path*",
    "/configuracoes/:path*",
  ],
};
