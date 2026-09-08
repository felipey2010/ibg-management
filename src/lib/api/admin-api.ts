import "server-only";
import { redirect } from "next/navigation";
import { getApiSession } from "@/lib/auth/api-session";

export type AdminResult<T = void> = { ok: true; data: T } | { ok: false; status: number; message: string };

export async function requireAdminSession() {
  const session = await getApiSession();
  if (!session) redirect("/login?error=session");
  if (!session.user.permissions.includes("*")) redirect("/");
  return session;
}

export async function requestAdminApi<T = void>(
  path: string,
  init: RequestInit = {},
): Promise<AdminResult<T>> {
  const session = await getApiSession();

  if (!session?.accessToken)
    return { ok: false, status: 401, message: "Sua sessão expirou. Entre novamente." };

  if (!session.user.permissions.includes("*"))
    return { ok: false, status: 403, message: "Acesso restrito a administradores do sistema." };

  try {
    const url = process.env.API_URL ?? process.env.NEXT_PUBLIC_API_URL;
    if (!url) throw new Error("API URL missing");

    const response = await fetch(`${url.replace(/\/$/, "")}/admin${path}`, {
      ...init,
      cache: "no-store",
      signal: AbortSignal.timeout(15_000),
      headers: { Authorization: `Bearer ${session.accessToken}`, "Content-Type": "application/json" },
    });

    if (response.status === 204) return { ok: true, data: undefined as T };

    const body = await response.json().catch(() => null);
    if (!response.ok) {
      const messages: Record<number, string> = {
        400: "Confira os campos informados e tente novamente.",
        401: "Sua sessão expirou. Entre novamente.",
        403: "Você não pode realizar esta ação. Perfis do sistema são protegidos.",
        404: "Este registro não está mais disponível. Atualize a página.",
        409: path.includes("/users/")
          ? "Não foi possível alterar o acesso: preserve o último administrador ativo e evite atribuir um perfil já existente."
          : "Este código já existe ou o registro ainda está em uso. Confira antes de tentar novamente.",
      };
      return {
        ok: false,
        status: response.status,
        message: messages[response.status] ?? "Não foi possível concluir a operação. Tente novamente.",
      };
    }

    if (!body || body.success !== true || !("data" in body)) throw new Error("Invalid API response");

    return { ok: true, data: body.data as T };
  } catch {
    return { ok: false, status: 503, message: "Não foi possível conectar ao servidor. Tente novamente." };
  }
}
