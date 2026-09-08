import "server-only";

import type { JWT } from "next-auth/jwt";
import { requestAuthApi } from "@/features/auth/services/auth-server.service";
import type { AuthTokens, AuthUserResponse } from "@/features/auth/types/auth.types";

export function expiresAt(duration: string): number {
  const match = /^(\d+)([smhd])$/.exec(duration);
  if (!match) return 0;
  const units = { s: 1000, m: 60_000, h: 3_600_000, d: 86_400_000 } as const;
  return Date.now() + Number(match[1]) * units[match[2] as keyof typeof units];
}

export function invalidateToken(token: JWT): JWT {
  return {
    ...token,
    accessToken: undefined,
    refreshToken: undefined,
    accessTokenExpires: 0,
    refreshTokenExpires: 0,
    status: "INACTIVE",
    permissions: [],
    error: "SessionExpired",
  };
}

export async function validateToken(token: JWT, allowRefresh: boolean): Promise<JWT> {
  let current = { ...token };
  if (current.error || current.status !== "ACTIVE") return invalidateToken(current);
  if (!current.accessToken || !current.accessTokenExpires || current.accessTokenExpires <= Date.now()) {
    if (
      !allowRefresh ||
      !current.refreshToken ||
      !current.refreshTokenExpires ||
      current.refreshTokenExpires <= Date.now()
    ) {
      return invalidateToken(current);
    }
    const refreshed = await requestAuthApi<AuthTokens>("/auth/refresh", {
      method: "POST",
      body: JSON.stringify({ refreshToken: current.refreshToken }),
    });

    const tokens = refreshed.response.data;
    if (!refreshed.ok || !tokens?.accessToken || !tokens.refreshToken || !tokens.refreshExpiresIn)
      return invalidateToken(current);
    current = {
      ...current,
      accessToken: tokens.accessToken,
      refreshToken: tokens.refreshToken,
      accessTokenExpires: expiresAt(tokens.expiresIn),
      refreshTokenExpires: expiresAt(tokens.refreshExpiresIn),
    };
    if (current.accessTokenExpires! <= Date.now()) return invalidateToken(current);
  }

  const result = await requestAuthApi<AuthUserResponse>("/auth/me", { method: "GET" }, current.accessToken);
  const user = result.response.data;
  if (
    !result.ok ||
    !user ||
    user.id !== current.userId ||
    user.status !== "ACTIVE" ||
    !Array.isArray(user.permissions)
  ) {
    return invalidateToken(current);
  }

  return {
    ...current,
    name: user.fullName,
    email: user.email,
    permissions: user.permissions,
    error: undefined,
  };
}
