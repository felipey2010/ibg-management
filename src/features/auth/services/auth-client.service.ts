import axios from "axios";
import { signIn, signOut } from "next-auth/react";

import type {
  ApiEnvelope,
  AuthApiResponse,
  AuthClientResult,
  OAuthProvider,
} from "@/features/auth/types/auth.types";

const authClient = axios.create({
  baseURL: "/api/auth",
  headers: { "Content-Type": "application/json" },
  withCredentials: true,
});

function failure<T>(message: string): AuthClientResult<T> {
  return { success: false, message, data: null };
}

async function post<T>(path: string, body: unknown): Promise<AuthClientResult<T>> {
  try {
    const { data } = await authClient.post<ApiEnvelope<T>>(path, body);
    return { success: data.success, message: data.message, data: data.data };
  } catch (error) {
    if (axios.isAxiosError<ApiEnvelope<T>>(error)) {
      if (!error.response) {
        return failure("Não foi possível conectar ao serviço. Verifique sua conexão e tente novamente.");
      }

      if (error.response.status === 429) {
        return failure("Muitas tentativas foram realizadas. Aguarde um momento e tente novamente.");
      }

      return failure(error.response.data?.message ?? "Não foi possível concluir a solicitação.");
    }

    return failure("Ocorreu um erro inesperado. Tente novamente.");
  }
}

export async function login(input: { email: string; password: string }): Promise<AuthClientResult> {
  try {
    const result = await signIn("credentials", { ...input, redirect: false });
    return result?.ok
      ? { success: true, message: "Autenticação realizada.", data: null }
      : failure("Não foi possível entrar. Verifique suas credenciais e tente novamente.");
  } catch {
    return failure("Não foi possível conectar ao serviço de autenticação.");
  }
}

export async function loginWithProvider(provider: OAuthProvider): Promise<AuthClientResult> {
  try {
    await signIn(provider, { callbackUrl: "/dashboard" });
    return { success: true, message: "Redirecionando para autenticação.", data: null };
  } catch {
    return failure("Não foi possível iniciar a autenticação com este provedor.");
  }
}

export function register(input: Record<string, unknown>): Promise<AuthClientResult<AuthApiResponse>> {
  return post<AuthApiResponse>("/register", input);
}

export function verifyEmail(input: {
  email: string;
  code: string;
}): Promise<AuthClientResult<AuthApiResponse>> {
  return post<AuthApiResponse>("/verify-email", input);
}

export function resendVerificationCode(email: string): Promise<AuthClientResult<AuthApiResponse>> {
  return post<AuthApiResponse>("/resend-code", { email });
}

export function requestPasswordRecovery(email: string): Promise<AuthClientResult<AuthApiResponse>> {
  return post<AuthApiResponse>("/forgot-password", { email });
}

export async function validateResetToken(
  token: string,
): Promise<AuthClientResult<{ valid?: boolean; reason?: "INVALID" | "EXPIRED" }>> {
  return post("/validate-reset-token", { token });
}

export function resetPassword(input: {
  token: string;
  password: string;
}): Promise<AuthClientResult<AuthApiResponse>> {
  return post<AuthApiResponse>("/reset-password", input);
}

export async function logout(): Promise<AuthClientResult> {
  try {
    await signOut({ redirect: false });
    return { success: true, message: "Sessão encerrada.", data: null };
  } catch {
    return failure("Não foi possível encerrar a sessão corretamente.");
  }
}
