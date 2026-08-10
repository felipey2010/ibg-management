import type { AccountStatus, AuthenticatedUser } from "@/lib/auth/auth.types";

export type OAuthProvider = "google" | "apple";

export interface AuthSession {
  user: AuthenticatedUser;
  expiresAt?: string;
}

export interface AuthApiResponse {
  message?: string;
  token?: string;
  accessToken?: string;
  user?: AuthenticatedUser;
  status?: AccountStatus;
  valid?: boolean;
  reason?: "INVALID" | "EXPIRED";
}

export interface AuthClientError {
  message: string;
  status: number;
}
