import { notFound } from "next/navigation";
import { PageLoadError } from "@/components/shared/page-load-error";
import { InventoryDetail } from "@/features/inventory/components/inventory-detail";
import {
  getInventoryItem,
  requireInventoryPermission,
} from "@/features/inventory/services/inventory.service";
import { hasPermission } from "@/lib/permissions/permissions";

export default async function InventoryItemPage({ params }: Readonly<{ params: Promise<{ id: string }> }>) {
  const s = await requireInventoryPermission("inventory.read"),
    { id } = await params,
    r = await getInventoryItem(id);

  if (!r.ok && r.status === 404) notFound();

  return (
    <div className="mx-auto max-w-5xl">
      {r.ok ? (
        <InventoryDetail
          item={r.data}
          canUpdate={hasPermission(s.user, "inventory.update")}
          canDelete={hasPermission(s.user, "inventory.delete")}
          canMove={hasPermission(s.user, "inventory.manage_movements")}
        />
      ) : (
        <PageLoadError message={r.message} />
      )}
    </div>
  );
}
