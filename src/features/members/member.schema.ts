import { z } from "zod";
import { memberStatuses } from "./member.types";

const nullableText = (max: number) =>
  z.union([z.string().trim().max(max), z.null()]).transform((value) => value || null);
const optionalDate = z
  .union([z.literal(""), z.string().date(), z.null()])
  .transform((value) => value || null);

export const memberFormSchema = z.object({
  first_name: z.string().trim().min(1, "Informe o primeiro nome.").max(100),
  last_name: z.string().trim().min(1, "Informe o sobrenome.").max(100),
  birth_date: optionalDate,
  email: z
    .union([z.literal(""), z.string().email("Informe um e-mail válido.").max(254), z.null()])
    .transform((value) => value || null),
  phone: nullableText(30),
  address_line: nullableText(255),
  city: nullableText(100),
  state: z.union([z.string().trim().max(2), z.null()]).transform((value) => value?.toUpperCase() || null),
  postal_code: nullableText(20),
  membership_status: z.enum(memberStatuses),
  membership_date: optionalDate,
  notes: nullableText(2000),
  status_reason: nullableText(500).optional(),
});
export type MemberFormValues = z.input<typeof memberFormSchema>;
export type MemberFormPayload = z.output<typeof memberFormSchema>;

export const memberQuerySchema = z.object({
  page: z.coerce.number().int().positive().catch(1),
  search: z.string().trim().max(100).catch(""),
  status: z.enum(["", ...memberStatuses]).catch(""),
});
export type MemberQuery = z.infer<typeof memberQuerySchema>;
