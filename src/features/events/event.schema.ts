import { z } from "zod";
import { eventStatuses } from "./event.types";
const date = z
    .union([z.string().datetime({ offset: true }), z.string().datetime({ local: true })])
    .transform((v) => new Date(v).toISOString()),
  optionalDate = z
    .union([
      z.literal(""),
      z.string().datetime({ offset: true }),
      z.string().datetime({ local: true }),
      z.null(),
    ])
    .transform((v) => (v ? new Date(v).toISOString() : null)),
  text = (max: number) => z.union([z.string().trim().max(max), z.null()]).transform((v) => v || null);
export const eventFormSchema = z
  .object({
    title: z.string().trim().min(2, "Informe o título.").max(180),
    description: text(5000),
    start_at: date,
    end_at: optionalDate,
    location: text(255),
    status: z.enum(eventStatuses),
    registration_enabled: z.boolean(),
    registration_deadline: optionalDate,
    maximum_participants: z
      .union([z.literal(""), z.coerce.number().int().positive().max(100000), z.null()])
      .transform((v) => (v === "" ? null : v)),
  })
  .superRefine((v, c) => {
    if (v.end_at && new Date(v.end_at) <= new Date(v.start_at))
      c.addIssue({ code: "custom", path: ["end_at"], message: "O término deve ser posterior ao início." });
    if (v.registration_deadline && new Date(v.registration_deadline) > new Date(v.start_at))
      c.addIssue({
        code: "custom",
        path: ["registration_deadline"],
        message: "O prazo deve terminar antes do evento.",
      });
  });
export type EventFormValues = z.input<typeof eventFormSchema>;
export type EventFormPayload = z.output<typeof eventFormSchema>;
export const eventQuerySchema = z.object({
  page: z.coerce.number().int().positive().catch(1),
  search: z.string().trim().max(100).catch(""),
  status: z.enum(["", ...eventStatuses]).catch(""),
  period: z.enum(["", "upcoming", "past"]).catch(""),
});
export type EventQuery = z.infer<typeof eventQuerySchema>;
