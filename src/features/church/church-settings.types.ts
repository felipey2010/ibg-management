import type { ChurchSettingsValues } from "./church-settings.schema";

export type ChurchSettings = ChurchSettingsValues & {
  id: string | null;
  logo_file_id: string | null;
};

export type ChurchSettingsResult =
  { ok: true; settings: ChurchSettings } | { ok: false; message: string; status: number };
