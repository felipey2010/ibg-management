import { InventoryForm } from "@/features/inventory/components/inventory-form";
import {
  getInventoryOptions,
  requireInventoryPermission,
} from "@/features/inventory/services/inventory.service";

export default async function NewInventoryPage() {
  await requireInventoryPermission("inventory.create");
  const o = await getInventoryOptions();

  return (
    <div className="mx-auto max-w-4xl">
      <h1 className="mb-7 font-serif text-2xl font-semibold">Cadastrar item</h1>
      <InventoryForm options={o.ok ? o.data : { categories: [], locations: [] }} />
    </div>
  );
}
