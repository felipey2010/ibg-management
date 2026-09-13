import "server-only";
import { redirect } from "next/navigation";
import { getApiSession } from "@/lib/auth/api-session";
import { hasPermission } from "@/lib/permissions/permissions";
import type { Announcement, AnnouncementPage } from "../announcement.types";
import type { AnnouncementQuery } from "../announcement.schema";
export type AnnouncementResult<T = void> =
  { ok: true; data: T } | { ok: false; status: number; message: string };
export async function requireAnnouncementPermission(permission: string) {
  const session = await getApiSession();
  if (!session) redirect("/login?error=session");
  if (!hasPermission(session.user, permission)) redirect("/");
  return session;
}
export async function requestAnnouncementApi<T>(
  path: string,
  permission: string,
  init: RequestInit = {},
): Promise<AnnouncementResult<T>> {
  const session = await getApiSession();
  if (!session?.accessToken)
    return { ok: false, status: 401, message: "Sua sessão expirou. Entre novamente." };
  if (!hasPermission(session.user, permission))
    return { ok: false, status: 403, message: "Você não tem permissão para realizar esta operação." };
  try {
    const base = process.env.API_URL ?? process.env.NEXT_PUBLIC_API_URL;
    if (!base) throw new Error();
    const response = await fetch(`${base.replace(/\/$/, "")}/announcements${path}`, {
      ...init,
      cache: "no-store",
      signal: AbortSignal.timeout(15000),
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
              404: "Este aviso não está mais disponível.",
            } as Record<number, string>
          )[response.status] ?? "Não foi possível concluir a operação.",
      };
    return { ok: true, data: body.data as T };
  } catch {
    return { ok: false, status: 503, message: "Não foi possível conectar ao servidor. Tente novamente." };
  }
}
export function getAnnouncements(q: AnnouncementQuery) {
  const p = new URLSearchParams({ page: String(q.page), limit: "20" });
  if (q.search) p.set("search", q.search);
  if (q.status) p.set("status", q.status);
  if (q.audience) p.set("audience", q.audience);
  return requestAnnouncementApi<AnnouncementPage>(`?${p}`, "announcements.read");
}
export const getAnnouncement = (id: string, permission = "announcements.read") =>
  requestAnnouncementApi<Announcement>(`/${encodeURIComponent(id)}`, permission);
