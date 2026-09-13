import Link from "next/link";
import { Megaphone, Users } from "lucide-react";
import { PaginationControls } from "@/components/shared/pagination-controls";
import { buttonVariants } from "@/components/ui/button";
import type { AnnouncementQuery } from "../announcement.schema";
import { announcementAudienceLabels, type AnnouncementPage } from "../announcement.types";
import { AnnouncementFilters } from "./announcement-filters";
import { AnnouncementStatusBadge } from "./announcement-status-badge";

const formatDate = (v: string | null) =>
  v ? new Intl.DateTimeFormat("pt-BR", { dateStyle: "medium" }).format(new Date(v)) : null;

export function AnnouncementDirectory({
  page,
  query,
}: Readonly<{ page: AnnouncementPage; query: AnnouncementQuery }>) {
  const pages = Math.max(1, Math.ceil(page.pagination.total / page.pagination.limit));
  const href = (n: number) => {
    const p = new URLSearchParams({ page: String(n) });
    if (query.search) p.set("search", query.search);
    if (query.status) p.set("status", query.status);
    if (query.audience) p.set("audience", query.audience);
    return `/avisos?${p}`;
  };

  return (
    <div className="space-y-5">
      <AnnouncementFilters query={query} />
      <section aria-label="Lista de avisos">
        <div className="mb-3 flex items-center justify-between text-sm">
          <span className="text-muted-foreground">
            <strong className="text-foreground">{page.pagination.total.toLocaleString("pt-BR")}</strong>{" "}
            avisos encontrados
          </span>
        </div>
        {page.data.length ? (
          <div className="grid gap-4 lg:grid-cols-2">
            {page.data.map((item) => {
              const destination = item.announcement_destinations[0];
              return (
                <article
                  key={item.id}
                  className="group bg-card flex min-h-56 flex-col rounded-xl border p-5 transition-shadow hover:shadow-sm"
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="bg-primary/10 text-primary flex size-10 items-center justify-center rounded-lg">
                      <Megaphone className="size-5" />
                    </div>
                    <AnnouncementStatusBadge status={item.status} />
                  </div>
                  <h2 className="mt-5 text-lg leading-snug font-semibold">{item.title}</h2>
                  <p className="text-muted-foreground mt-2 line-clamp-3 text-sm leading-relaxed">
                    {item.content}
                  </p>
                  <div className="text-muted-foreground mt-auto flex flex-wrap items-center gap-x-4 gap-y-2 pt-5 text-xs">
                    <span className="flex items-center gap-1.5">
                      <Users className="size-3.5" />
                      {destination?.ministries?.name ??
                        (destination
                          ? announcementAudienceLabels[destination.type]
                          : "Público não informado")}
                    </span>
                    {item.published_at ? <span>Publicado em {formatDate(item.published_at)}</span> : null}
                  </div>
                  <Link
                    href={`/avisos/${item.id}`}
                    className={buttonVariants({ variant: "outline", className: "mt-4 w-full sm:w-fit" })}
                  >
                    Ver aviso
                  </Link>
                </article>
              );
            })}
          </div>
        ) : (
          <div className="bg-card rounded-xl border border-dashed p-14 text-center">
            <Megaphone className="text-muted-foreground mx-auto size-9" />
            <h2 className="mt-4 font-semibold">Nenhum aviso encontrado</h2>
            <p className="text-muted-foreground mt-1 text-sm">
              Ajuste os filtros ou prepare o primeiro aviso.
            </p>
          </div>
        )}
        <PaginationControls
          currentPage={query.page}
          totalPages={pages}
          getPageHref={href}
          className="bg-card mt-5 rounded-xl border px-5 py-4"
        />
      </section>
    </div>
  );
}
