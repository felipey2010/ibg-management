import "server-only";

import { cookies } from "next/headers";

import { authEndpoints } from "@/features/auth/services/auth-endpoints";
import type { AuthApiResponse, AuthSession } from "@/features/auth/types/auth.types";
import { sessionCookieName } from "@/lib/auth/auth-cookie";

function getApiUrl(): string {
  const apiUrl = process.env.API_URL ?? process.env.NEXT_PUBLIC_API_URL;

  if (!apiUrl) {
    throw new Error("A URL da API de autenticação não foi configurada.");
  }

  return apiUrl.replace(/\/$/, "");
}

export function buildApiUrl(path: string): string {
  return `${getApiUrl()}${path}`;
}

export async function requestAuthApi(
  path: string,
  init: RequestInit = {},
  token?: string,
): Promise<Response> {
  const headers = new Headers(init.headers);
  headers.set("Accept", "application/json");

  if (init.body) {
    headers.set("Content-Type", "application/json");
  }

  if (token) {
    headers.set("Authorization", `Bearer ${token}`);
  }

  return fetch(buildApiUrl(path), {
    ...init,
    headers,
    cache: "no-store",
  });
}

export async function parseAuthResponse(response: Response): Promise<AuthApiResponse> {
  return (await response.json().catch(() => ({}))) as AuthApiResponse;
}

export async function getSession(): Promise<AuthSession | null> {
  const token = (await cookies()).get(sessionCookieName)?.value;

  if (!token) {
    return null;
  }

  try {
    const response = await requestAuthApi(authEndpoints.session, { method: "GET" }, token);

    if (!response.ok) {
      return null;
    }

    const data = await parseAuthResponse(response);
    return data.user ? { user: data.user } : null;
  } catch {
    return null;
  }
}
