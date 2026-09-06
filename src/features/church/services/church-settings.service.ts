import "server-only";

import { cache } from "react";
import { getApiSession } from "@/lib/auth/api-session";
import { resolveChurchSettings } from "../church-settings.defaults";
import type { ChurchSettings, ChurchSettingsResult } from "../church-settings.types";
import type { ChurchSettingsValues } from "../church-settings.schema";

async function requestSettings(values?: ChurchSettingsValues): Promise<ChurchSettingsResult> {
  const session = await getApiSession();
  if (!session?.accessToken || session.user.status !== "ACTIVE") {
    return { ok: false, status: 401, message: "Sua sessão expirou. Entre novamente." };
  }
  try {
    const baseUrl = process.env.API_URL ?? process.env.NEXT_PUBLIC_API_URL;
    if (!baseUrl) throw new Error("API URL missing");
    const response = await fetch(`${baseUrl.replace(/\/$/, "")}/church/settings`, {
      method: values ? "PUT" : "GET",
      headers: { Authorization: `Bearer ${session.accessToken}`, "Content-Type": "application/json" },
      body: values ? JSON.stringify(values) : undefined,
      cache: "no-store",
      signal: AbortSignal.timeout(15_000),
    });
    if (!response.ok) {
      const message =
        response.status === 401
          ? "Sua sessão expirou. Entre novamente."
          : response.status === 403
            ? "Você não tem permissão para alterar as configurações."
            : response.status === 400
              ? "Confira os campos informados e tente novamente."
              : "Não foi possível carregar ou salvar as configurações. Tente novamente.";
      return { ok: false, status: response.status, message };
    }
    const body = (await response.json()) as {
      success?: boolean;
      data?: Partial<ChurchSettings> | null;
      canEdit?: boolean;
    };
    if (!body.success || body.data === undefined || (values && !body.data))
      throw new Error("Invalid settings response");
    if (
      body.data !== null &&
      (typeof body.data !== "object" ||
        Array.isArray(body.data) ||
        typeof body.data.id !== "string" ||
        typeof body.data.name !== "string")
    )
      throw new Error("Invalid settings record");
    return {
      ok: true,
      settings: resolveChurchSettings(body.data),
      canEdit: values ? true : body.canEdit === true,
    };
  } catch {
    return { ok: false, status: 503, message: "Não foi possível conectar ao servidor. Tente novamente." };
  }
}

export const getChurchSettings = cache(() => requestSettings());
export const saveChurchSettings = (values: ChurchSettingsValues) => requestSettings(values);
