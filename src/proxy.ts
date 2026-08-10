import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

import { sessionCookieName } from "@/lib/auth/auth-cookie";

export function proxy(request: NextRequest) {
  if (request.cookies.has(sessionCookieName)) {
    return NextResponse.next();
  }

  const loginUrl = new URL("/login", request.url);
  loginUrl.searchParams.set("redirectTo", `${request.nextUrl.pathname}${request.nextUrl.search}`);
  return NextResponse.redirect(loginUrl);
}

export const config = {
  matcher: ["/dashboard/:path*"],
};
