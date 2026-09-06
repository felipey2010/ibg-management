import type { ChurchSettingsValues } from "./church-settings.schema";

interface SettingsField {
  name: keyof ChurchSettingsValues;
  label: string;
  type?: "email" | "url" | "tel";
  multiline?: boolean;
  required?: boolean;
  placeholder?: string;
}

export const churchSettingsSections: { title: string; fields: SettingsField[] }[] = [
  {
    title: "Identificação",
    fields: [
      { name: "name", label: "Nome da igreja", required: true },
      { name: "description", label: "Descrição", multiline: true },
    ],
  },
  {
    title: "Contato",
    fields: [
      { name: "email", label: "E-mail", type: "email" },
      { name: "phone", label: "Telefone", type: "tel" },
    ],
  },
  {
    title: "Endereço",
    fields: [
      { name: "address_line", label: "Logradouro, número e complemento" },
      { name: "city", label: "Cidade" },
      { name: "state", label: "Estado" },
      { name: "postal_code", label: "CEP" },
      { name: "country", label: "País", required: true },
    ],
  },
  {
    title: "Site e redes sociais",
    fields: [
      { name: "website", label: "Site", type: "url", placeholder: "https://" },
      { name: "instagram_url", label: "Instagram", type: "url", placeholder: "https://www.instagram.com/" },
      { name: "facebook_url", label: "Facebook", type: "url", placeholder: "https://www.facebook.com/" },
    ],
  },
  {
    title: "Preferências regionais",
    fields: [
      { name: "default_language", label: "Idioma" },
      { name: "timezone", label: "Fuso horário", required: true, placeholder: "America/Boa_Vista" },
    ],
  },
];
