import "server-only";
import { redirect } from "next/navigation";
import { getApiSession } from "@/lib/auth/api-session";
import { hasPermission } from "@/lib/permissions/permissions";
import type { Ministry, MinistryPage } from "../ministry.types";
import type { MinistryQuery } from "../ministry.schema";

export type MinistryResult<T = void> = { ok: true; data: T } | { ok: false; status: number; message: string };
export async function requireMinistryPermission(permission: string) {
  const session = await getApiSession();
  if (!session) redirect("/login?error=session");
  if (!hasPermission(session.user, permission)) redirect("/");
  return session;
}
export async function requestMinistryApi<T>(
  path: string,
  permission: string,
  init: RequestInit = {},
): Promise<MinistryResult<T>> {
  const session = await getApiSession();
  if (!session?.accessToken)
    return { ok: false, status: 401, message: "Sua sessão expirou. Entre novamente." };
  if (!hasPermission(session.user, permission))
    return { ok: false, status: 403, message: "Você não tem permissão para realizar esta operação." };
  try {
    const baseUrl = process.env.API_URL ?? process.env.NEXT_PUBLIC_API_URL;
    if (!baseUrl) throw new Error("API URL missing");
    const response = await fetch(`${baseUrl.replace(/\/$/, "")}/ministries${path}`, {
      ...init,
      cache: "no-store",
      signal: AbortSignal.timeout(15_000),
      headers: { Authorization: `Bearer ${session.accessToken}`, "Content-Type": "application/json" },
    });
    if (response.status === 204) return { ok: true, data: undefined as T };
    const body = await response.json().catch(() => null);
    if (!response.ok)
      return {
        ok: false,
        status: response.status,
        message:
          (
            {
              400: "Confira os campos informados.",
              401: "Sua sessão expirou. Entre novamente.",
              403: "Você não tem permissão para realizar esta operação.",
              404: "Este ministério não está mais disponível.",
              409: "Esta operação conflita com os dados atuais.",
            } as Record<number, string>
          )[response.status] ?? "Não foi possível concluir a operação.",
      };
    if (!body?.success || !("data" in body)) throw new Error("Invalid response");
    return { ok: true, data: body.data as T };
  } catch {
    return { ok: false, status: 503, message: "Não foi possível conectar ao servidor. Tente novamente." };
  }
}
export function getMinistries(query: MinistryQuery) {
  const params = new URLSearchParams({ page: String(query.page), limit: "20" });
  if (query.search) params.set("search", query.search);
  if (query.status) params.set("status", query.status);
  return requestMinistryApi<MinistryPage>(`?${params}`, "ministries.read");
}
export const getMinistry = (id: string, permission = "ministries.read") =>
  requestMinistryApi<Ministry>(`/${encodeURIComponent(id)}`, permission);
