import "server-only";

import type { ApiEnvelope, ApiRequestResult } from "@/features/auth/types/auth.types";

function getApiUrl(): string | null {
  const apiUrl = process.env.API_URL ?? process.env.NEXT_PUBLIC_API_URL;
  return apiUrl ? apiUrl.replace(/\/$/, "") : null;
}

function errorEnvelope<T>(message: string): ApiEnvelope<T> {
  return { success: false, message };
}

function isApiEnvelope<T>(value: unknown): value is ApiEnvelope<T> {
  if (!value || typeof value !== "object") return false;
  const candidate = value as Record<string, unknown>;
  return typeof candidate.success === "boolean" && typeof candidate.message === "string";
}

export async function requestAuthApi<T>(
  path: string,
  init: RequestInit = {},
  token?: string,
): Promise<ApiRequestResult<T>> {
  try {
    const apiUrl = getApiUrl();
    if (!apiUrl) {
      return { ok: false, status: 500, response: errorEnvelope("Serviço não configurado.") };
    }

    const headers = new Headers(init.headers);
    headers.set("Accept", "application/json");

    if (init.body) headers.set("Content-Type", "application/json");
    if (token) headers.set("Authorization", `Bearer ${token}`);

    const upstream = await fetch(`${apiUrl}${path}`, {
      ...init,
      headers,
      cache: "no-store",
      signal: init.signal ?? AbortSignal.timeout(15_000),
    });
    const body: unknown = await upstream.json().catch(() => null);

    if (!isApiEnvelope<T>(body)) {
      return { ok: false, status: 502, response: errorEnvelope("Resposta inválida do serviço.") };
    }

    return {
      ok: upstream.ok && body.success,
      status: upstream.status,
      response: body,
    };
  } catch {
    return {
      ok: false,
      status: 503,
      response: errorEnvelope("Não foi possível conectar ao serviço de autenticação."),
    };
  }
}
