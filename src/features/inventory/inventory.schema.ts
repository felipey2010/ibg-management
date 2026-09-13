import { z } from "zod";
import { itemConditions } from "./inventory.types";
const nullableId = z.union([z.literal(""), z.string().uuid(), z.null()]).transform((v) => v || null),
  text = (n: number) => z.union([z.string().trim().max(n), z.null()]).transform((v) => v || null),
  number = z.coerce.number().nonnegative();

export const inventoryFormSchema = z.object({
  name: z.string().trim().min(2, "Informe o nome.").max(180),
  description: text(2000),
  category_id: nullableId,
  storage_location_id: nullableId,
  quantity: number,
  minimum_quantity: number,
  unit: z.string().trim().min(1, "Informe a unidade.").max(30),
  condition: z.enum(itemConditions),
  is_active: z.boolean(),
});

export type InventoryFormValues = z.input<typeof inventoryFormSchema>;
export type InventoryFormPayload = z.output<typeof inventoryFormSchema>;

export const movementSchema = z.object({
  type: z.enum(["ENTRY", "REMOVAL", "ADJUSTMENT"]),
  quantity: z.coerce.number().positive("Informe uma quantidade maior que zero."),
  resulting_quantity: z.coerce.number().nonnegative().optional(),
  reason: z.string().trim().min(2, "Informe o motivo.").max(500),
});

export type MovementValues = z.infer<typeof movementSchema>;

export const inventoryQuerySchema = z.object({
  page: z.coerce.number().int().positive().catch(1),
  search: z.string().trim().max(100).catch(""),
  condition: z.enum(["", ...itemConditions]).catch(""),
  active: z.enum(["", "true", "false"]).catch(""),
  lowStock: z.enum(["", "true"]).catch(""),
});

export type InventoryQuery = z.infer<typeof inventoryQuerySchema>;
