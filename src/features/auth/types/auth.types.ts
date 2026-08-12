import type { AccountStatus, AuthenticatedUser } from "@/lib/auth/auth.types";

export type OAuthProvider = "google" | "apple";

export interface AuthApiResponse {
  token?: string;
  accessToken?: string;
  user?: AuthenticatedUser;
  status?: AccountStatus;
  valid?: boolean;
  reason?: "INVALID" | "EXPIRED";
}

export interface ApiEnvelope<T> {
  success: boolean;
  message: string;
  data: T | null;
}

export interface ApiRequestResult<T> {
  ok: boolean;
  status: number;
  response: ApiEnvelope<T>;
}

export interface AuthClientResult<T = null> {
  success: boolean;
  message: string;
  data: T | null;
}
