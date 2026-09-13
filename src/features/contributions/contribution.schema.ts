import { z } from "zod";
import { contributionStatuses, contributionTypes, paymentMethods } from "./contribution.types";

const optionalText = (max: number) =>
  z.union([z.string().trim().max(max), z.null()]).transform((value) => value || null);
const optionalDate = z
  .union([z.literal(""), z.string().datetime({ local: true }), z.null()])
  .transform((value) => (value ? new Date(value).toISOString() : null));

export const contributionFormSchema = z
  .object({
    title: z.string().trim().min(2, "Informe o título.").max(180),
    description: optionalText(5000),
    type: z.enum(contributionTypes),
    status: z.enum(contributionStatuses),
    starts_at: optionalDate,
    ends_at: optionalDate,
    financial_target: z
      .union([z.literal(""), z.coerce.number().positive("Informe uma meta maior que zero."), z.null()])
      .transform((value) => (value === "" ? null : value)),
  })
  .superRefine((value, context) => {
    if (value.starts_at && value.ends_at && new Date(value.ends_at) <= new Date(value.starts_at)) {
      context.addIssue({
        code: "custom",
        path: ["ends_at"],
        message: "O término deve ser posterior ao início.",
      });
    }
  });

export const financialContributionSchema = z.object({
  member_id: z.union([z.literal(""), z.string().uuid(), z.null()]).transform((value) => value || null),
  amount: z.coerce.number().positive("Informe um valor maior que zero."),
  contributed_at: z
    .string()
    .datetime({ local: true })
    .transform((value) => new Date(value).toISOString()),
  payment_method: z.enum(paymentMethods),
  reference: optionalText(255),
});

export const requiredItemSchema = z.object({
  name: z.string().trim().min(2, "Informe o item.").max(180),
  description: optionalText(1000),
  required_quantity: z.coerce.number().positive("Informe a quantidade necessária."),
  maximum_contributors: z
    .union([z.literal(""), z.coerce.number().int().positive(), z.null()])
    .transform((value) => (value === "" ? null : value)),
  unit: z.string().trim().min(1, "Informe a unidade.").max(30),
});

export const itemCommitmentSchema = z.object({
  member_id: z.string().uuid("Selecione um membro."),
  quantity: z.coerce.number().positive("Informe uma quantidade maior que zero."),
  notes: optionalText(500),
});

export const contributionQuerySchema = z.object({
  page: z.coerce.number().int().positive().catch(1),
  search: z.string().trim().max(100).catch(""),
  type: z.enum(["", ...contributionTypes]).catch(""),
  status: z.enum(["", ...contributionStatuses]).catch(""),
});

export type ContributionFormValues = z.input<typeof contributionFormSchema>;
export type ContributionFormPayload = z.output<typeof contributionFormSchema>;
export type FinancialContributionValues = z.input<typeof financialContributionSchema>;
export type FinancialContributionPayload = z.output<typeof financialContributionSchema>;
export type RequiredItemValues = z.input<typeof requiredItemSchema>;
export type RequiredItemPayload = z.output<typeof requiredItemSchema>;
export type ItemCommitmentValues = z.input<typeof itemCommitmentSchema>;
export type ItemCommitmentPayload = z.output<typeof itemCommitmentSchema>;
export type ContributionQuery = z.infer<typeof contributionQuerySchema>;
