import { z } from "zod";
import { announcementAudiences, announcementStatuses } from "./announcement.types";
const optionalDate = z
  .union([
    z.literal(""),
    z.string().datetime({ offset: true }),
    z.string().datetime({ local: true }),
    z.null(),
  ])
  .transform((value) => (value ? new Date(value).toISOString() : null));
export const announcementFormSchema = z
  .object({
    title: z.string().trim().min(2, "Informe o título.").max(180),
    content: z.string().trim().min(2, "Informe o conteúdo.").max(10000),
    status: z.enum(announcementStatuses),
    audience: z.enum(announcementAudiences),
    ministry_id: z
      .union([z.literal(""), z.string().uuid("Selecione um ministério válido."), z.null()])
      .optional()
      .transform((value) => value || null),
    starts_at: optionalDate,
    ends_at: optionalDate,
  })
  .superRefine((v, c) => {
    if (v.audience === "MINISTRY" && !v.ministry_id)
      c.addIssue({ code: "custom", path: ["ministry_id"], message: "Selecione o ministério." });
    if (v.starts_at && v.ends_at && new Date(v.ends_at) <= new Date(v.starts_at))
      c.addIssue({
        code: "custom",
        path: ["ends_at"],
        message: "A data final deve ser posterior à inicial.",
      });
  })
  .transform((v) => ({ ...v, ministry_id: v.audience === "MINISTRY" ? v.ministry_id : null }));
export type AnnouncementFormValues = z.input<typeof announcementFormSchema>;
export type AnnouncementFormPayload = z.output<typeof announcementFormSchema>;
export const announcementQuerySchema = z.object({
  page: z.coerce.number().int().positive().catch(1),
  search: z.string().trim().max(100).catch(""),
  status: z.enum(["", ...announcementStatuses]).catch(""),
  audience: z.enum(["", ...announcementAudiences]).catch(""),
});
export type AnnouncementQuery = z.infer<typeof announcementQuerySchema>;
