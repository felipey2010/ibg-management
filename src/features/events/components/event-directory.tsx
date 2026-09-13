import Link from "next/link";
import { CalendarDays, MapPin, Users } from "lucide-react";
import { PaginationControls } from "@/components/shared/pagination-controls";
import { buttonVariants } from "@/components/ui/button";
import type { EventQuery } from "../event.schema";
import type { EventPage } from "../event.types";
import { EventFilters } from "./event-filters";
import { EventStatusBadge } from "./event-status-badge";
const date = (v: string) =>
  new Intl.DateTimeFormat("pt-BR", { dateStyle: "medium", timeStyle: "short" }).format(new Date(v));
export function EventDirectory({ page, query }: Readonly<{ page: EventPage; query: EventQuery }>) {
  const pages = Math.max(1, Math.ceil(page.pagination.total / page.pagination.limit)),
    href = (n: number) => {
      const p = new URLSearchParams({ page: String(n) });
      if (query.search) p.set("search", query.search);
      if (query.status) p.set("status", query.status);
      if (query.period) p.set("period", query.period);
      return `/eventos?${p}`;
    };
  return (
    <div className="space-y-5">
      <EventFilters query={query} />
      {page.data.length ? (
        <div className="grid gap-4 lg:grid-cols-2">
          {page.data.map((e) => (
            <article key={e.id} className="bg-card flex flex-col rounded-xl border p-5">
              <div className="flex items-start justify-between gap-3">
                <div className="bg-primary/10 text-primary flex size-11 items-center justify-center rounded-lg">
                  <CalendarDays className="size-5" />
                </div>
                <EventStatusBadge status={e.status} />
              </div>
              <h2 className="mt-5 text-lg font-semibold">{e.title}</h2>
              <p className="text-muted-foreground mt-2 line-clamp-2 text-sm">
                {e.description || "Sem descrição."}
              </p>
              <div className="text-muted-foreground mt-5 space-y-2 text-xs">
                <p className="flex items-center gap-2">
                  <CalendarDays className="size-3.5" />
                  {date(e.start_at)}
                </p>
                <p className="flex items-center gap-2">
                  <MapPin className="size-3.5" />
                  {e.location || "Local não informado"}
                </p>
                {e.registration_enabled ? (
                  <p className="flex items-center gap-2">
                    <Users className="size-3.5" />
                    {e._count.event_participants}
                    {e.maximum_participants ? ` de ${e.maximum_participants}` : ""} inscritos
                  </p>
                ) : null}
              </div>
              <Link
                href={`/eventos/${e.id}`}
                className={buttonVariants({ variant: "outline", className: "mt-5 w-full sm:w-fit" })}
              >
                Ver evento
              </Link>
            </article>
          ))}
        </div>
      ) : (
        <div className="bg-card rounded-xl border border-dashed p-14 text-center">
          <CalendarDays className="text-muted-foreground mx-auto size-9" />
          <h2 className="mt-4 font-semibold">Nenhum evento encontrado</h2>
          <p className="text-muted-foreground mt-1 text-sm">Ajuste os filtros ou crie o primeiro evento.</p>
        </div>
      )}
      <PaginationControls
        currentPage={query.page}
        totalPages={pages}
        getPageHref={href}
        className="bg-card mt-5 rounded-xl border px-5 py-4"
      />
    </div>
  );
}
