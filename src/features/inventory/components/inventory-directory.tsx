import Link from "next/link";
import { Boxes, MapPin } from "lucide-react";
import { PaginationControls } from "@/components/shared/pagination-controls";
import { Badge } from "@/components/ui/badge";
import { buttonVariants } from "@/components/ui/button";
import type { InventoryQuery } from "../inventory.schema";
import { conditionLabels, type InventoryPage } from "../inventory.types";
import { InventoryFilters } from "./inventory-filters";

const n = (v: string) => Number(v).toLocaleString("pt-BR", { maximumFractionDigits: 2 });

export function InventoryDirectory({
  page,
  query,
}: Readonly<{ page: InventoryPage; query: InventoryQuery }>) {
  const pages = Math.max(1, Math.ceil(page.pagination.total / page.pagination.limit)),
    href = (x: number) => {
      const p = new URLSearchParams({ page: String(x) });
      for (const k of ["search", "condition", "active", "lowStock"] as const)
        if (query[k]) p.set(k, query[k]);
      return `/estoque?${p}`;
    };

  return (
    <div className="space-y-5">
      <InventoryFilters query={query} />
      <section className="bg-card overflow-hidden rounded-xl border">
        <header className="border-b px-5 py-4 text-sm">
          <strong>{page.pagination.total.toLocaleString("pt-BR")}</strong>{" "}
          <span className="text-muted-foreground">itens encontrados</span>
        </header>
        {page.data.length ? (
          <ul className="divide-y">
            {page.data.map((item) => {
              const low = Number(item.quantity) <= Number(item.minimum_quantity);
              return (
                <li key={item.id} className="flex flex-col gap-4 p-5 sm:flex-row sm:items-center">
                  <div className="bg-muted flex size-11 shrink-0 items-center justify-center rounded-lg">
                    <Boxes className="size-5" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <h2 className="font-semibold">{item.name}</h2>
                      <Badge variant={low ? "destructive" : "secondary"}>
                        {low ? "Estoque baixo" : conditionLabels[item.condition]}
                      </Badge>
                      {!item.is_active ? <Badge variant="outline">Inativo</Badge> : null}
                    </div>
                    <p className="text-muted-foreground mt-2 text-xs">
                      <MapPin className="mr-1 inline size-3.5" />
                      {item.storage_locations?.name || "Local não informado"} ·{" "}
                      {item.inventory_categories?.name || "Sem categoria"}
                    </p>
                  </div>
                  <div className="sm:text-right">
                    <p className="text-xl font-semibold">
                      {n(item.quantity)} <span className="text-sm font-normal">{item.unit}</span>
                    </p>
                    <p className="text-muted-foreground text-xs">mínimo {n(item.minimum_quantity)}</p>
                  </div>
                  <Link href={`/estoque/${item.id}`} className={buttonVariants({ variant: "outline" })}>
                    Ver item
                  </Link>
                </li>
              );
            })}
          </ul>
        ) : (
          <div className="p-14 text-center">
            <Boxes className="text-muted-foreground mx-auto size-9" />
            <h2 className="mt-4 font-semibold">Nenhum item encontrado</h2>
            <p className="text-muted-foreground mt-1 text-sm">
              Ajuste os filtros ou cadastre o primeiro item.
            </p>
          </div>
        )}
        <PaginationControls
          currentPage={query.page}
          totalPages={pages}
          getPageHref={href}
          className="border-t px-5 py-4"
        />
      </section>
    </div>
  );
}
