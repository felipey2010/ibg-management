import type { Metadata } from "next";
import Link from "next/link";
import { Plus } from "lucide-react";
import { PageLoadError } from "@/components/shared/page-load-error";
import { buttonVariants } from "@/components/ui/button";
import { InventoryDirectory } from "@/features/inventory/components/inventory-directory";
import { InventoryOrganizationManager } from "@/features/inventory/components/inventory-organization-manager";
import { inventoryQuerySchema } from "@/features/inventory/inventory.schema";
import {
  getInventory,
  getInventoryCategories,
  getStorageLocations,
  requireInventoryPermission,
} from "@/features/inventory/services/inventory.service";
import { hasPermission } from "@/lib/permissions/permissions";

export const metadata: Metadata = { title: "Estoque" };

export default async function InventoryPage({
  searchParams,
}: Readonly<{ searchParams: Promise<Record<string, string | string[] | undefined>> }>) {
  const session = await requireInventoryPermission("inventory.read"),
    query = inventoryQuerySchema.parse(await searchParams),
    [result, locations, categories] = await Promise.all([
      getInventory(query),
      getStorageLocations(),
      getInventoryCategories(),
    ]);

  return (
    <div className="mx-auto w-full max-w-7xl px-1 sm:px-2">
      <header className="mb-7 flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
        <div>
          <h1 className="font-serif text-2xl font-semibold sm:text-3xl">Estoque</h1>
          <p className="text-muted-foreground mt-2 text-sm">
            Controle bens, materiais, saldos e movimentações.
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          {(hasPermission(session.user, "inventory.manage_locations") ||
            hasPermission(session.user, "inventory.manage_categories")) &&
          locations.ok &&
          categories.ok ? (
            <InventoryOrganizationManager
              locations={locations.data}
              categories={categories.data}
              canManageLocations={hasPermission(session.user, "inventory.manage_locations")}
              canManageCategories={hasPermission(session.user, "inventory.manage_categories")}
            />
          ) : null}
          {hasPermission(session.user, "inventory.create") ? (
            <Link href="/estoque/novo" className={buttonVariants()}>
              <Plus /> Cadastrar item
            </Link>
          ) : null}
        </div>
      </header>
      {result.ok ? (
        <InventoryDirectory page={result.data} query={query} />
      ) : (
        <PageLoadError message={result.message} />
      )}
    </div>
  );
}
