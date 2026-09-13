import { z } from "zod";
import { ministryStatuses } from "./ministry.types";

export const ministryFormSchema = z.object({
  name: z.string().trim().min(2, "Informe o nome do ministério.").max(120),
  description: z
    .string()
    .trim()
    .max(2000)
    .transform((value) => value || null),
  status: z.enum(ministryStatuses),
});
export type MinistryFormValues = z.input<typeof ministryFormSchema>;
export type MinistryFormPayload = z.output<typeof ministryFormSchema>;
export const ministryQuerySchema = z.object({
  page: z.coerce.number().int().positive().catch(1),
  search: z.string().trim().max(100).catch(""),
  status: z.enum(["", ...ministryStatuses]).catch(""),
});
export type MinistryQuery = z.infer<typeof ministryQuerySchema>;
