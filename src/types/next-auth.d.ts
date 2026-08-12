import type { DefaultSession } from "next-auth";
import type { AccountStatus } from "@/lib/auth/auth.types";

declare module "next-auth" {
  interface Session {
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
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    accessToken?: string;
    userId: string;
    status: AccountStatus;
    permissions: string[];
  }
}
