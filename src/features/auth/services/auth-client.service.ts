import axios from "axios";

import type { OAuthProvider } from "@/features/auth/types/auth.types";

const authClient = axios.create({
  baseURL: "/api/auth",
  headers: { "Content-Type": "application/json" },
  withCredentials: true,
});

export async function login(input: { email: string; password: string }): Promise<void> {
  await authClient.post("/login", input);
}

export async function register(input: Record<string, unknown>): Promise<void> {
  await authClient.post("/register", input);
}

export async function verifyEmail(input: { email: string; code: string }): Promise<void> {
  await authClient.post("/verify-email", input);
}

export async function resendVerificationCode(email: string): Promise<void> {
  await authClient.post("/resend-code", { email });
}

export async function requestPasswordRecovery(email: string): Promise<void> {
  await authClient.post("/forgot-password", { email });
}

export async function validateResetToken(token: string): Promise<{ valid: boolean; reason?: string }> {
  const { data } = await authClient.post<{ valid: boolean; reason?: string }>("/validate-reset-token", {
    token,
  });
  return data;
}

export async function resetPassword(input: { token: string; password: string }): Promise<void> {
  await authClient.post("/reset-password", input);
}

export async function logout(): Promise<void> {
  await authClient.post("/logout");
}

export function getOAuthUrl(provider: OAuthProvider): string {
  return `/api/auth/oauth/${provider}`;
}

export function getAuthErrorMessage(error: unknown, fallback: string): string {
  if (axios.isAxiosError<{ message?: string }>(error)) {
    if (!error.response) {
      return "Não foi possível conectar ao serviço. Verifique sua conexão e tente novamente.";
    }

    if (error.response.status === 429) {
      return "Muitas tentativas foram realizadas. Aguarde um momento e tente novamente.";
    }
  }

  return fallback;
}
