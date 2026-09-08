import "server-only";

import { getServerSession, type Session, type NextAuthOptions } from "next-auth";
import { cache } from "react";
import { validateToken } from "./token-lifecycle";
import { authOptions } from "@/lib/auth/auth-options";

// This callback is used only on the server; the public session never exposes API tokens.
export const getApiSession = cache(async () => {
  const options: NextAuthOptions = {
    ...authOptions,
    callbacks: {
      ...authOptions.callbacks,
      // Server Component cookie writes are unavailable. Refresh only through NextAuth's
      // session endpoint, where the rotated tokens can be persisted to the browser.
      async jwt({ token }) {
        return validateToken(token, false);
      },
      async session(params) {
        const session = await authOptions.callbacks!.session!(params);
        return { ...session, accessToken: params.token.accessToken };
      },
    },
  };

  const session = await getServerSession(options);
  if (!session || session.error || session.user.status !== "ACTIVE") return null;

  return session as (Session & { accessToken?: string }) | null;
});
