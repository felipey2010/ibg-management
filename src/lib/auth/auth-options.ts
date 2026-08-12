import "server-only";

import type { Account, NextAuthOptions, User } from "next-auth";
import AppleProvider from "next-auth/providers/apple";
import CredentialsProvider from "next-auth/providers/credentials";
import GoogleProvider from "next-auth/providers/google";

import { authEndpoints } from "@/features/auth/services/auth-endpoints";
import { requestAuthApi } from "@/features/auth/services/auth-server.service";
import type { AuthApiResponse, OAuthProvider } from "@/features/auth/types/auth.types";
import type { AuthenticatedUser } from "@/lib/auth/auth.types";

interface PlatformUser extends AuthenticatedUser {
  accessToken: string;
}

function toPlatformUser(data: AuthApiResponse | null): PlatformUser | null {
  const accessToken = data?.accessToken ?? data?.token;
  if (!accessToken || !data?.user) return null;
  return { ...data.user, accessToken };
}

async function authenticateWithProvider(
  provider: OAuthProvider,
  user: User,
  account: Account,
): Promise<PlatformUser | null> {
  const result = await requestAuthApi<AuthApiResponse>(authEndpoints.oauth(provider), {
    method: "POST",
    body: JSON.stringify({
      provider,
      providerAccountId: account.providerAccountId,
      accessToken: account.access_token,
      idToken: account.id_token,
      email: user.email,
      name: user.name,
    }),
  });

  return result.ok ? toPlatformUser(result.response.data) : null;
}

export const authOptions: NextAuthOptions = {
  secret: process.env.NEXTAUTH_SECRET,
  session: { strategy: "jwt", maxAge: 60 * 60 * 24 * 7 },
  pages: { signIn: "/login", error: "/login" },
  providers: [
    CredentialsProvider({
      name: "Credenciais",
      credentials: {
        email: { label: "E-mail", type: "email" },
        password: { label: "Senha", type: "password" },
      },
      async authorize(credentials) {
        try {
          if (!credentials?.email || !credentials.password) return null;

          const result = await requestAuthApi<AuthApiResponse>(authEndpoints.login, {
            method: "POST",
            body: JSON.stringify({ email: credentials.email, password: credentials.password }),
          });

          return result.ok ? toPlatformUser(result.response.data) : null;
        } catch {
          return null;
        }
      },
    }),
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID ?? "",
      clientSecret: process.env.GOOGLE_CLIENT_SECRET ?? "",
    }),
    AppleProvider({
      clientId: process.env.APPLE_CLIENT_ID ?? "",
      clientSecret: process.env.APPLE_CLIENT_SECRET ?? "",
    }),
  ],
  callbacks: {
    async signIn({ user, account }) {
      try {
        if (!account) return false;

        if (account.provider === "credentials") {
          const platformUser = user as PlatformUser;
          return Boolean(platformUser.accessToken) && platformUser.status === "ACTIVE";
        }

        if (account.provider !== "google" && account.provider !== "apple") return false;
        const platformUser = await authenticateWithProvider(account.provider, user, account);
        if (!platformUser) return false;

        Object.assign(user, platformUser);
        return platformUser.status === "ACTIVE";
      } catch {
        return false;
      }
    },
    async jwt({ token, user }) {
      try {
        if (user) {
          const platformUser = user as PlatformUser;
          token.accessToken = platformUser.accessToken;
          token.userId = platformUser.id;
          token.status = platformUser.status;
          token.permissions = platformUser.permissions;
        }
        return token;
      } catch {
        return token;
      }
    },
    async session({ session, token }) {
      try {
        if (session.user) {
          session.user.id = token.userId;
          session.user.status = token.status;
          session.user.permissions = token.permissions;
        }
        return session;
      } catch {
        return session;
      }
    },
  },
  events: {
    async signOut({ token }) {
      try {
        if (token?.accessToken) {
          await requestAuthApi(authEndpoints.logout, { method: "POST" }, token.accessToken);
        }
      } catch {
        // NextAuth must still remove its local session if API revocation is unavailable.
      }
    },
  },
};
