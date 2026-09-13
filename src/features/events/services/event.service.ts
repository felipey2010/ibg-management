import "server-only";
import { redirect } from "next/navigation";
import { getApiSession } from "@/lib/auth/api-session";
import { hasPermission } from "@/lib/permissions/permissions";
import type { ChurchEvent, EventPage } from "../event.types";
import type { EventQuery } from "../event.schema";
export type EventResult<T = void> = { ok: true; data: T } | { ok: false; status: number; message: string };
export async function requireEventPermission(p: string) {
  const s = await getApiSession();
  if (!s) redirect("/login?error=session");
  if (!hasPermission(s.user, p)) redirect("/");
  return s;
}
export async function requestEventApi<T>(
  path: string,
  p: string,
  init: RequestInit = {},
): Promise<EventResult<T>> {
  const s = await getApiSession();
  if (!s?.accessToken) return { ok: false, status: 401, message: "Sua sessão expirou. Entre novamente." };
  if (!hasPermission(s.user, p))
    return { ok: false, status: 403, message: "Você não tem permissão para realizar esta operação." };
  try {
    const base = process.env.API_URL ?? process.env.NEXT_PUBLIC_API_URL;
    if (!base) throw new Error();
    const response = await fetch(`${base.replace(/\/$/, "")}/events${path}`, {
      ...init,
      cache: "no-store",
      signal: AbortSignal.timeout(15000),
      headers: { Authorization: `Bearer ${s.accessToken}`, "Content-Type": "application/json" },
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
              404: "Este evento não está mais disponível.",
              409: body?.message ?? "A operação não pode ser concluída nas condições atuais.",
            } as Record<number, string>
          )[response.status] ?? "Não foi possível concluir a operação.",
      };
    return { ok: true, data: body.data as T };
  } catch {
    return { ok: false, status: 503, message: "Não foi possível conectar ao servidor. Tente novamente." };
  }
}
export function getEvents(q: EventQuery) {
  const p = new URLSearchParams({ page: String(q.page), limit: "20" });
  if (q.search) p.set("search", q.search);
  if (q.status) p.set("status", q.status);
  if (q.period) p.set("period", q.period);
  return requestEventApi<EventPage>(`?${p}`, "events.read");
}
export const getEvent = (id: string, p = "events.read") =>
  requestEventApi<ChurchEvent>(`/${encodeURIComponent(id)}`, p);
