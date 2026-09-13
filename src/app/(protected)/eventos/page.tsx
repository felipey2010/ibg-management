import type { Metadata } from "next";
import Link from "next/link";
import { Plus } from "lucide-react";
import { PageLoadError } from "@/components/shared/page-load-error";
import { buttonVariants } from "@/components/ui/button";
import { EventDirectory } from "@/features/events/components/event-directory";
import { eventQuerySchema } from "@/features/events/event.schema";
import { getEvents, requireEventPermission } from "@/features/events/services/event.service";
import { hasPermission } from "@/lib/permissions/permissions";
export const metadata: Metadata = { title: "Eventos" };
export default async function EventsPage({
  searchParams,
}: Readonly<{ searchParams: Promise<Record<string, string | string[] | undefined>> }>) {
  const session = await requireEventPermission("events.read"),
    query = eventQuerySchema.parse(await searchParams),
    result = await getEvents(query);
  return (
    <div className="mx-auto w-full max-w-7xl px-1 sm:px-2">
      <header className="mb-7 flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
        <div>
          <h1 className="font-serif text-2xl font-semibold sm:text-3xl">Eventos</h1>
          <p className="text-muted-foreground mt-2 text-sm">
            Planeje encontros e acompanhe inscrições e presença.
          </p>
        </div>
        {hasPermission(session.user, "events.create") ? (
          <Link href="/eventos/novo" className={buttonVariants()}>
            <Plus />
            Criar evento
          </Link>
        ) : null}
      </header>
      {result.ok ? (
        <EventDirectory page={result.data} query={query} />
      ) : (
        <PageLoadError message={result.message} />
      )}
    </div>
  );
}
