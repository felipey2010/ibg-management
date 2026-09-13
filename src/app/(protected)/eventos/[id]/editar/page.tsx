import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { PageLoadError } from "@/components/shared/page-load-error";
import { EventForm } from "@/features/events/components/event-form";
import { getEvent, requireEventPermission } from "@/features/events/services/event.service";
export const metadata: Metadata = { title: "Editar evento" };
export default async function EditEventPage({ params }: Readonly<{ params: Promise<{ id: string }> }>) {
  await requireEventPermission("events.update");
  const { id } = await params,
    result = await getEvent(id, "events.update");
  if (!result.ok && result.status === 404) notFound();
  return (
    <div className="mx-auto w-full max-w-4xl">
      <header className="mb-7">
        <h1 className="font-serif text-2xl font-semibold">Editar evento</h1>
        <p className="text-muted-foreground mt-2 text-sm">Atualize os detalhes e as regras de inscrição.</p>
      </header>
      {result.ok ? <EventForm event={result.data} /> : <PageLoadError message={result.message} />}
    </div>
  );
}
