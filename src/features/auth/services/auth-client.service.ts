import axios from "axios";
import { signIn, signOut } from "next-auth/react";

import type {
  ApiEnvelope,
  AuthClientResult,
  OAuthProvider,
  PasswordResetVerificationResponse,
  RegistrationRequest,
  RegistrationResponse,
  UsernameAvailability,
} from "@/features/auth/types/auth.types";
import { authEndpoints } from "@/features/auth/services/auth-endpoints";
import { sanitizeEmail, sanitizeText, sanitizeUsername } from "@/features/auth/services/auth-input-sanitizer";

const authClient = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
  headers: { "Content-Type": "application/json" },
  withCredentials: true,
});

function failure<T>(message: string): AuthClientResult<T> {
  return { success: false, message, data: null };
}

async function post<T>(path: string, body: unknown): Promise<AuthClientResult<T>> {
  try {
    const { data } = await authClient.post<ApiEnvelope<T>>(path, body);
    return { success: data.success, message: data.message, data: data.data ?? null };
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
    const result = await signIn("credentials", {
      email: sanitizeEmail(input.email),
      password: input.password,
      redirect: false,
    });
    return result?.ok
      ? { success: true, message: "Autenticação realizada.", data: null }
      : failure("Não foi possível entrar. Verifique suas credenciais e tente novamente.");
  } catch {
    return failure("Não foi possível conectar ao serviço de autenticação.");
  }
}

export async function loginWithProvider(_provider: OAuthProvider): Promise<AuthClientResult> {
  void _provider;
  return failure("A autenticação social ainda não é oferecida pelo serviço de autenticação.");
}

export function register(input: RegistrationRequest): Promise<AuthClientResult<RegistrationResponse>> {
  return post<RegistrationResponse>(authEndpoints.register, {
    username: sanitizeUsername(input.username),
    email: sanitizeEmail(input.email),
    password: input.password,
    full_name: sanitizeText(input.full_name),
  });
}

export async function checkUsername(
  username: string,
  signal?: AbortSignal,
): Promise<AuthClientResult<UsernameAvailability>> {
  const sanitizedUsername = sanitizeUsername(username);
  try {
    const { data } = await authClient.get<ApiEnvelope<UsernameAvailability>>(authEndpoints.checkUsername, {
      params: { username: sanitizedUsername },
      signal,
    });
    return { success: data.success, message: data.message, data: data.data ?? null };
  } catch (error) {
    if (axios.isCancel(error)) throw error;
    return failure("Não foi possível verificar o nome de usuário agora.");
  }
}

export function verifyEmail(input: { email: string; code: string }): Promise<AuthClientResult> {
  return post<null>(authEndpoints.verifyEmail, {
    email: sanitizeEmail(input.email),
    code: sanitizeText(input.code),
  });
}

export function resendVerificationCode(email: string): Promise<AuthClientResult> {
  return post<null>(authEndpoints.resendVerificationCode, { email: sanitizeEmail(email) });
}

export function requestPasswordRecovery(email: string): Promise<AuthClientResult> {
  return post<null>(authEndpoints.forgotPassword, { email: sanitizeEmail(email) });
}

export function verifyPasswordResetCode(input: {
  email: string;
  code: string;
}): Promise<AuthClientResult<PasswordResetVerificationResponse>> {
  return post<PasswordResetVerificationResponse>(authEndpoints.verifyResetCode, {
    email: sanitizeEmail(input.email),
    code: sanitizeText(input.code),
  });
}

export function resetPassword(input: {
  email: string;
  resetToken: string;
  newPassword: string;
}): Promise<AuthClientResult> {
  return post<null>(authEndpoints.resetPassword, {
    email: sanitizeEmail(input.email),
    resetToken: sanitizeText(input.resetToken),
    newPassword: input.newPassword,
  });
}

export async function logout(): Promise<AuthClientResult> {
  try {
    await signOut({ redirect: false });
    return { success: true, message: "Sessão encerrada.", data: null };
  } catch {
    return failure("Não foi possível encerrar a sessão corretamente.");
  }
}
