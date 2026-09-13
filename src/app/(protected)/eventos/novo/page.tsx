import type { Metadata } from "next";
import { EventForm } from "@/features/events/components/event-form";
import { requireEventPermission } from "@/features/events/services/event.service";
export const metadata: Metadata = { title: "Criar evento" };
export default async function NewEventPage() {
  await requireEventPermission("events.create");
  return (
    <div className="mx-auto w-full max-w-4xl">
      <header className="mb-7">
        <h1 className="font-serif text-2xl font-semibold">Criar evento</h1>
        <p className="text-muted-foreground mt-2 text-sm">Informe os detalhes e configure as inscrições.</p>
      </header>
      <EventForm />
    </div>
  );
}
