import "server-only";

import type { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";

import { authEndpoints } from "@/features/auth/services/auth-endpoints";
import { requestAuthApi } from "@/features/auth/services/auth-server.service";
import type { AuthTokens, AuthUserResponse } from "@/features/auth/types/auth.types";
import type { AuthenticatedUser } from "@/lib/auth/auth.types";
import { sanitizeEmail } from "@/features/auth/services/auth-input-sanitizer";

import { expiresAt, invalidateToken, validateToken } from "./token-lifecycle";

interface PlatformUser extends AuthenticatedUser {
  accessToken: string;
  refreshToken: string;
  accessTokenExpires: number;
  refreshTokenExpires: number;
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

          const result = await requestAuthApi<AuthTokens>(authEndpoints.login, {
            method: "POST",
            body: JSON.stringify({ email: sanitizeEmail(credentials.email), password: credentials.password }),
          });
          const tokens = result.response.data;
          if (!result.ok || !tokens) return null;

          const currentUser = await requestAuthApi<AuthUserResponse>(
            authEndpoints.me,
            { method: "GET" },
            tokens.accessToken,
          );
          const user = currentUser.response.data;
          if (!currentUser.ok || !user || user.status !== "ACTIVE" || !Array.isArray(user.permissions))
            return null;

          return {
            id: user.id,
            name: user.fullName,
            email: user.email,
            status: "ACTIVE",
            permissions: user.permissions,
            accessToken: tokens.accessToken,
            refreshToken: tokens.refreshToken,
            accessTokenExpires: expiresAt(tokens.expiresIn),
            refreshTokenExpires: expiresAt(tokens.refreshExpiresIn),
          };
        } catch {
          return null;
        }
      },
    }),
  ],
  callbacks: {
    async signIn({ user, account }) {
      try {
        if (!account) return false;

        if (account.provider !== "credentials") return false;
        const platformUser = user as PlatformUser;
        return Boolean(platformUser.accessToken && platformUser.refreshToken);
      } catch {
        return false;
      }
    },
    async jwt({ token, user }) {
      try {
        if (user) {
          const platformUser = user as PlatformUser;
          token.accessToken = platformUser.accessToken;
          token.refreshToken = platformUser.refreshToken;
          token.accessTokenExpires = platformUser.accessTokenExpires;
          token.refreshTokenExpires = platformUser.refreshTokenExpires;
          token.error = undefined;
          token.userId = platformUser.id;
          token.status = platformUser.status;
          token.permissions = platformUser.permissions;
        }
        return await validateToken(token, true);
      } catch {
        return invalidateToken(token);
      }
    },
    async session({ session, token }) {
      try {
        session.error = token.error;
        session.accessTokenExpires = token.accessTokenExpires;
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
        if (token?.refreshToken) {
          await requestAuthApi(authEndpoints.logout, {
            method: "POST",
            body: JSON.stringify({ refreshToken: token.refreshToken }),
          });
        }
      } catch {
        // NextAuth must still remove its local session if API revocation is unavailable.
      }
    },
  },
};
