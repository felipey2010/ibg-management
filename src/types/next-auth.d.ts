import type { DefaultSession } from "next-auth";
import type { AccountStatus } from "@/lib/auth/auth.types";

declare module "next-auth" {
  interface Session {
    error?: "SessionExpired";
    accessTokenExpires?: number;
    user: DefaultSession["user"] & {
      id: string;
      status: AccountStatus;
      permissions: string[];
    };
  }

  interface User {
    status?: AccountStatus;
    permissions?: string[];
    accessToken?: string;
    refreshToken?: string;
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    accessToken?: string;
    refreshToken?: string;
    accessTokenExpires?: number;
    refreshTokenExpires?: number;
    error?: "SessionExpired";
    userId: string;
    status: AccountStatus;
    permissions: string[];
  }
}
