import { z } from "zod";

const text = z.string().trim();
const url = text
  .url("Informe um endereço válido.")
  .refine((value) => /^https?:\/\//i.test(value), "Use HTTP ou HTTPS.")
  .or(z.literal(""));

export const churchSettingsSchema = z.object({
  name: text.min(1, "Informe o nome da igreja."),
  description: text,
  email: text.email("Informe um e-mail válido.").or(z.literal("")),
  phone: text,
  address_line: text,
  city: text,
  state: text,
  postal_code: text,
  country: text.min(1, "Informe o país."),
  website: url,
  instagram_url: url,
  facebook_url: url,
  default_language: z.literal("pt-BR"),
  timezone: text.refine((value) => {
    try {
      new Intl.DateTimeFormat("pt-BR", { timeZone: value });
      return true;
    } catch {
      return false;
    }
  }, "Informe um fuso horário válido, como America/Boa_Vista."),
});

export type ChurchSettingsValues = z.infer<typeof churchSettingsSchema>;
