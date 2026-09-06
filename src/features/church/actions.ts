"use server";

import { churchSettingsSchema } from "./church-settings.schema";
import { getChurchSettings, saveChurchSettings } from "./services/church-settings.service";
import type { ChurchSettingsResult } from "./church-settings.types";

export async function reloadChurchSettings(): Promise<ChurchSettingsResult> {
  return getChurchSettings();
}

export async function updateChurchSettings(values: unknown): Promise<ChurchSettingsResult> {
  const parsed = churchSettingsSchema.safeParse(values);
  if (!parsed.success) return { ok: false, status: 400, message: "Confira os campos informados." };
  return saveChurchSettings(parsed.data);
}
