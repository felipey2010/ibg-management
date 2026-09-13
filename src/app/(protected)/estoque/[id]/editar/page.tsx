import { notFound } from "next/navigation";
import { PageLoadError } from "@/components/shared/page-load-error";
import { InventoryForm } from "@/features/inventory/components/inventory-form";
import {
  getInventoryItem,
  getInventoryOptions,
  requireInventoryPermission,
} from "@/features/inventory/services/inventory.service";

export default async function EditInventoryPage({ params }: Readonly<{ params: Promise<{ id: string }> }>) {
  await requireInventoryPermission("inventory.update");
  const { id } = await params,
    [r, o] = await Promise.all([getInventoryItem(id, "inventory.update"), getInventoryOptions()]);
  if (!r.ok && r.status === 404) notFound();

  return (
    <div className="mx-auto max-w-4xl">
      <h1 className="mb-7 font-serif text-2xl font-semibold">Editar item</h1>
      {r.ok ? (
        <InventoryForm item={r.data} options={o.ok ? o.data : { categories: [], locations: [] }} />
      ) : (
        <PageLoadError message={r.message} />
      )}
    </div>
  );
}
