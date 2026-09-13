import "server-only";
import { redirect } from "next/navigation";
import { getApiSession } from "@/lib/auth/api-session";
import { hasPermission } from "@/lib/permissions/permissions";
import type { InventoryItem, InventoryOption, InventoryOptions, InventoryPage } from "../inventory.types";
import type { InventoryQuery } from "../inventory.schema";

export type InventoryResult<T = void> =
  { ok: true; data: T } | { ok: false; status: number; message: string };

export async function requireInventoryPermission(p: string) {
  const s = await getApiSession();
  if (!s) redirect("/login?error=session");
  if (!hasPermission(s.user, p)) redirect("/");
  return s;
}

export async function requestInventoryApi<T>(
  path: string,
  p: string,
  init: RequestInit = {},
): Promise<InventoryResult<T>> {
  const s = await getApiSession();
  if (!s?.accessToken) return { ok: false, status: 401, message: "Sua sessão expirou. Entre novamente." };
  if (!hasPermission(s.user, p))
    return { ok: false, status: 403, message: "Você não tem permissão para realizar esta operação." };
  try {
    const base = process.env.API_URL ?? process.env.NEXT_PUBLIC_API_URL;
    if (!base) throw new Error();
    const r = await fetch(`${base.replace(/\/$/, "")}/inventory${path}`, {
      ...init,
      cache: "no-store",
      signal: AbortSignal.timeout(15000),
      headers: { Authorization: `Bearer ${s.accessToken}`, "Content-Type": "application/json" },
    });
    if (r.status === 204) return { ok: true, data: undefined as T };
    const body = await r.json().catch(() => null);
    if (!r.ok)
      return {
        ok: false,
        status: r.status,
        message:
          r.status === 409
            ? (body?.message ?? "Movimento não permitido.")
            : r.status === 404
              ? "Item não encontrado."
              : r.status === 403
                ? "Você não tem permissão para esta operação."
                : "Não foi possível concluir a operação.",
      };
    return { ok: true, data: body.data as T };
  } catch {
    return { ok: false, status: 503, message: "Não foi possível conectar ao servidor." };
  }
}

export function getInventory(q: InventoryQuery) {
  const p = new URLSearchParams({ page: String(q.page), limit: "20" });
  if (q.search) p.set("search", q.search);
  if (q.condition) p.set("condition", q.condition);
  if (q.active) p.set("active", q.active);
  if (q.lowStock) p.set("lowStock", q.lowStock);
  return requestInventoryApi<InventoryPage>(`?${p}`, "inventory.read");
}

export const getInventoryItem = (id: string, p = "inventory.read") =>
  requestInventoryApi<InventoryItem>(`/${id}`, p);

export const getInventoryOptions = () => requestInventoryApi<InventoryOptions>("/options", "inventory.read");

export const getStorageLocations = () =>
  requestInventoryApi<InventoryOption[]>("/locations", "inventory.read");

export const getInventoryCategories = () =>
  requestInventoryApi<InventoryOption[]>("/categories", "inventory.read");
