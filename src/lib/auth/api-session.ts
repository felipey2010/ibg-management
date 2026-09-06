import "server-only";

import { getServerSession, type Session } from "next-auth";
import { cache } from "react";
import { authOptions } from "@/lib/auth/auth-options";

// This callback is used only on the server; the public session never exposes API tokens.
export const getApiSession = cache(async () => {
  const session = await getServerSession({
    ...authOptions,
    callbacks: {
      ...authOptions.callbacks,
      async session(params) {
        const session = await authOptions.callbacks!.session!(params);
        return { ...session, accessToken: params.token.accessToken };
      },
    },
  });
  return session as (Session & { accessToken?: string }) | null;
});
