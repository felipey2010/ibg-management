import { siteConfig } from "@/config/site";
import type { ChurchSettings } from "./church-settings.types";

export const defaultChurchSettings: ChurchSettings = {
  id: null,
  name: siteConfig.name,
  description: "",
  logo_file_id: null,
  email: "",
  phone: "",
  address_line: "",
  city: "",
  state: "",
  postal_code: "",
  country: "Brazil",
  website: "",
  instagram_url: "",
  facebook_url: "",
  default_language: "pt-BR",
  timezone: "America/Boa_Vista",
};

export function resolveChurchSettings(settings: Partial<ChurchSettings> | null): ChurchSettings {
  if (!settings) return { ...defaultChurchSettings };
  return Object.fromEntries(
    Object.entries(defaultChurchSettings).map(([key, fallback]) => [
      key,
      settings[key as keyof ChurchSettings] ?? fallback,
    ]),
  ) as ChurchSettings;
}
