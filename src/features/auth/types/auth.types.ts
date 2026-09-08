export interface AuthTokens {
  accessToken: string;
  refreshToken: string;
  expiresIn: string;
  refreshExpiresIn: string;
}

export interface AuthUserResponse {
  id: string;
  email: string;
  fullName: string;
  status: "ACTIVE";
  permissions: string[];
}

export interface RegistrationResponse {
  email: string;
}

export interface PasswordResetVerificationResponse {
  resetToken: string;
  expiresIn: string;
}

export type OAuthProvider = "google" | "apple";

export interface RegistrationRequest {
  username: string;
  email: string;
  password: string;
  full_name: string;
}

export interface UsernameAvailability {
  username: string;
  available: boolean;
}

export interface ApiEnvelope<T> {
  success: boolean;
  message: string;
  data?: T;
  errors?: Array<{ field?: string; message: string }>;
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
