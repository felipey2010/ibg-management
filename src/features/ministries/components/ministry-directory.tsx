import { PaginationControls } from "@/components/shared/pagination-controls";
import { buttonVariants } from "@/components/ui/button";
import { UsersRound } from "lucide-react";
import Link from "next/link";
import type { MinistryQuery } from "../ministry.schema";
import type { MinistryPage } from "../ministry.types";
import { MinistryFilters } from "./ministry-filters";
import { MinistryStatusBadge } from "./ministry-status-badge";
export function MinistryDirectory({ page, query }: Readonly<{ page: MinistryPage; query: MinistryQuery }>) {
  const totalPages = Math.max(1, Math.ceil(page.pagination.total / page.pagination.limit));
  const href = (number: number) => {
    const p = new URLSearchParams({ page: String(number) });
    if (query.search) p.set("search", query.search);
    if (query.status) p.set("status", query.status);
    return `/ministerios?${p}`;
  };
  return (
    <div className="space-y-5">
      <MinistryFilters query={query} />
      <section className="bg-card overflow-hidden rounded-xl border" aria-label="Diretório de ministérios">
        <header className="border-b px-5 py-4 text-sm">
          <strong>{page.pagination.total.toLocaleString("pt-BR")}</strong>{" "}
          <span className="text-muted-foreground">ministérios encontrados</span>
        </header>
        {page.data.length ? (
          <ul className="divide-y">
            {page.data.map((ministry) => (
              <li
                key={ministry.id}
                className="hover:bg-muted/25 flex flex-col gap-4 p-5 transition-colors sm:flex-row sm:items-center"
              >
                <div className="bg-muted flex size-11 shrink-0 items-center justify-center rounded-lg">
                  <UsersRound className="size-5" aria-hidden />
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <h2 className="font-semibold">{ministry.name}</h2>
                    <MinistryStatusBadge status={ministry.status} />
                  </div>
                  <p className="text-muted-foreground mt-1 line-clamp-2 text-sm">
                    {ministry.description || "Sem descrição."}
                  </p>
                  <p className="text-muted-foreground mt-2 text-xs">
                    {ministry._count.ministry_members}{" "}
                    {ministry._count.ministry_members === 1 ? "participante" : "participantes"}
                  </p>
                </div>
                <Link href={`/ministerios/${ministry.id}`} className={buttonVariants({ variant: "outline" })}>
                  Ver ministério
                </Link>
              </li>
            ))}
          </ul>
        ) : (
          <div className="p-14 text-center">
            <UsersRound className="text-muted-foreground mx-auto size-9" />
            <h2 className="mt-4 font-semibold">Nenhum ministério encontrado</h2>
            <p className="text-muted-foreground mt-1 text-sm">
              Ajuste os filtros ou cadastre o primeiro ministério.
            </p>
          </div>
        )}
        <PaginationControls
          currentPage={query.page}
          totalPages={totalPages}
          getPageHref={href}
          className="border-t px-5 py-4"
        />
      </section>
    </div>
  );
}
