"use server";
import { revalidatePath } from "next/cache";
import { z } from "zod";
import { inventoryFormSchema, movementSchema } from "./inventory.schema";
import { requestInventoryApi, type InventoryResult } from "./services/inventory.service";
import type { InventoryItem, InventoryOption } from "./inventory.types";

export async function saveInventoryItem(input: unknown): Promise<InventoryResult<InventoryItem>> {
  const p = z.object({ id: z.string().uuid().optional(), values: inventoryFormSchema }).safeParse(input);
  if (!p.success) return { ok: false, status: 400, message: "Confira os dados do item." };
  const { id, values } = p.data,
    payload = id ? Object.fromEntries(Object.entries(values).filter(([key]) => key !== "quantity")) : values,
    r = await requestInventoryApi<InventoryItem>(
      id ? `/${id}` : "",
      id ? "inventory.update" : "inventory.create",
      { method: id ? "PUT" : "POST", body: JSON.stringify(payload) },
    );
  if (r.ok) revalidatePath("/estoque");
  return r;
}

export async function deactivateInventoryItem(id: string): Promise<InventoryResult<InventoryItem>> {
  if (!z.string().uuid().safeParse(id).success) return { ok: false, status: 400, message: "Item inválido." };
  const r = await requestInventoryApi<InventoryItem>(`/${id}`, "inventory.delete", { method: "DELETE" });
  if (r.ok) revalidatePath("/estoque");
  return r;
}

export async function createInventoryMovement(input: unknown): Promise<InventoryResult<InventoryItem>> {
  const p = z.object({ id: z.string().uuid(), values: movementSchema }).safeParse(input);
  if (!p.success) return { ok: false, status: 400, message: "Confira os dados da movimentação." };
  const r = await requestInventoryApi<InventoryItem>(
    `/${p.data.id}/movements`,
    "inventory.manage_movements",
    { method: "POST", body: JSON.stringify(p.data.values) },
  );
  if (r.ok) revalidatePath(`/estoque/${p.data.id}`);
  return r;
}

const storageLocationSchema = z.object({
  name: z.string().trim().min(2, "Informe o nome do local.").max(120),
  description: z
    .string()
    .trim()
    .max(500)
    .transform((value) => value || null),
  is_active: z.boolean(),
});

export async function saveStorageLocation(input: unknown): Promise<InventoryResult<InventoryOption>> {
  const parsed = z
    .object({ id: z.string().uuid().optional(), values: storageLocationSchema })
    .safeParse(input);
  if (!parsed.success)
    return { ok: false, status: 400, message: "Confira os dados do local de armazenamento." };
  const { id, values } = parsed.data;
  const result = await requestInventoryApi<InventoryOption>(
    id ? `/locations/${id}` : "/locations",
    "inventory.manage_locations",
    { method: id ? "PUT" : "POST", body: JSON.stringify(values) },
  );
  if (result.ok) revalidatePath("/estoque");
  return result;
}

export async function deactivateStorageLocation(id: string): Promise<InventoryResult<InventoryOption>> {
  if (!z.string().uuid().safeParse(id).success) return { ok: false, status: 400, message: "Local inválido." };
  const result = await requestInventoryApi<InventoryOption>(
    `/locations/${id}`,
    "inventory.manage_locations",
    {
      method: "DELETE",
    },
  );
  if (result.ok) revalidatePath("/estoque");
  return result;
}

export async function saveInventoryCategory(input: unknown): Promise<InventoryResult<InventoryOption>> {
  const parsed = z
    .object({ id: z.string().uuid().optional(), values: storageLocationSchema })
    .safeParse(input);
  if (!parsed.success) return { ok: false, status: 400, message: "Confira os dados da categoria." };
  const { id, values } = parsed.data;
  const result = await requestInventoryApi<InventoryOption>(
    id ? `/categories/${id}` : "/categories",
    "inventory.manage_categories",
    { method: id ? "PUT" : "POST", body: JSON.stringify(values) },
  );
  if (result.ok) revalidatePath("/estoque");
  return result;
}
