import { z } from "zod";
import { accountStatuses } from "@/lib/auth/auth.types";

export const userQuerySchema = z.object({
  page: z.coerce.number().int().positive().catch(1),
  search: z.string().trim().max(100).catch(""),
  status: z.enum(["", ...accountStatuses]).catch(""),
});

export type UserQuery = z.infer<typeof userQuerySchema>;

export const userMutationSchema = z.discriminatedUnion("action", [
  z.object({ action: z.literal("status"), id: z.string().uuid(), status: z.enum(accountStatuses) }),
  z.object({ action: z.literal("revoke"), id: z.string().uuid() }),
  z.object({
    action: z.literal("assign"),
    id: z.string().uuid(),
    roleCode: z.string().regex(/^[A-Z][A-Z0-9_]*$/),
  }),
  z.object({
    action: z.literal("remove"),
    id: z.string().uuid(),
    roleCode: z.string().regex(/^[A-Z][A-Z0-9_]*$/),
  }),
]);

export type UserMutation = z.infer<typeof userMutationSchema>;
