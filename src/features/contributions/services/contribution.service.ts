import "server-only";

import { redirect } from "next/navigation";
import { getApiSession } from "@/lib/auth/api-session";
import { hasPermission } from "@/lib/permissions/permissions";
import type { ContributionQuery } from "../contribution.schema";
import type { ContributionCampaign, ContributionPage } from "../contribution.types";

export type ContributionResult<T = void> =
  { ok: true; data: T } | { ok: false; status: number; message: string };

export async function requireContributionPermission(permission: string) {
  const session = await getApiSession();
  if (!session) redirect("/login?error=session");
  if (!hasPermission(session.user, permission)) redirect("/");
  return session;
}

export async function requestContributionApi<T>(
  path: string,
  permission: string,
  init: RequestInit = {},
): Promise<ContributionResult<T>> {
  const session = await getApiSession();
  if (!session?.accessToken)
    return { ok: false, status: 401, message: "Sua sessão expirou. Entre novamente." };
  if (!hasPermission(session.user, permission))
    return {
      ok: false,
      status: 403,
      message: "Você não tem permissão para realizar esta operação.",
    };

  try {
    const base = process.env.API_URL ?? process.env.NEXT_PUBLIC_API_URL;
    if (!base) throw new Error("API URL missing");
    const response = await fetch(`${base.replace(/\/$/, "")}/contributions${path}`, {
      ...init,
      cache: "no-store",
      signal: AbortSignal.timeout(15_000),
      headers: {
        Authorization: `Bearer ${session.accessToken}`,
        "Content-Type": "application/json",
      },
    });
    const body = await response.json().catch(() => null);
    if (!response.ok) {
      const messages: Record<number, string> = {
        400: "Confira os campos informados.",
        401: "Sua sessão expirou. Entre novamente.",
        403: "Você não tem permissão para realizar esta operação.",
        404: "Esta campanha não está mais disponível.",
        409: body?.message ?? "A operação não pode ser concluída no estado atual.",
      };
      return {
        ok: false,
        status: response.status,
        message: messages[response.status] ?? "Não foi possível concluir a operação.",
      };
    }
    return { ok: true, data: body.data as T };
  } catch {
    return {
      ok: false,
      status: 503,
      message: "Não foi possível conectar ao servidor. Tente novamente.",
    };
  }
}

export function getContributions(query: ContributionQuery) {
  const params = new URLSearchParams({ page: String(query.page), limit: "20" });
  if (query.search) params.set("search", query.search);
  if (query.type) params.set("type", query.type);
  if (query.status) params.set("status", query.status);
  return requestContributionApi<ContributionPage>(`?${params}`, "contributions.read");
}

export const getContribution = (id: string, permission = "contributions.read") =>
  requestContributionApi<ContributionCampaign>(`/${encodeURIComponent(id)}`, permission);
