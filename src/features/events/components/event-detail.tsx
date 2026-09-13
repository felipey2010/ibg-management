"use client";
import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowLeft, CalendarDays, MapPin, Pencil, Trash2, Users } from "lucide-react";
import { Button, buttonVariants } from "@/components/ui/button";
import { ConfirmationDialog } from "@/components/shared/confirmation-dialog";
import { useAdminMutation } from "@/hooks/use-admin-mutation";
import type { Member } from "@/features/members/member.types";
import { deleteEvent } from "../actions";
import type { ChurchEvent } from "../event.types";
import { EventParticipants } from "./event-participants";
import { EventStatusBadge } from "./event-status-badge";
const date = (v: string | null) =>
  v
    ? new Intl.DateTimeFormat("pt-BR", { dateStyle: "long", timeStyle: "short" }).format(new Date(v))
    : "Não definido";
export function EventDetail({
  event,
  candidates,
  canUpdate,
  canDelete,
  canManage,
}: Readonly<{
  event: ChurchEvent;
  candidates: Member[];
  canUpdate: boolean;
  canDelete: boolean;
  canManage: boolean;
}>) {
  const router = useRouter(),
    { pending, execute } = useAdminMutation(),
    [confirm, setConfirm] = useState(false);
  return (
    <>
      <Button variant="ghost" className="mb-4" onClick={() => router.back()}>
        <ArrowLeft />
        Voltar
      </Button>
      <article className="bg-card overflow-hidden rounded-xl border">
        <header className="bg-muted/35 border-b p-6 sm:p-8">
          <div className="flex flex-col gap-5 sm:flex-row sm:items-start">
            <div className="min-w-0 flex-1">
              <EventStatusBadge status={event.status} />
              <h1 className="mt-4 font-serif text-2xl font-semibold sm:text-3xl">{event.title}</h1>
              <div className="text-muted-foreground mt-4 flex flex-col gap-2 text-sm sm:flex-row sm:gap-5">
                <span className="flex items-center gap-2">
                  <CalendarDays className="size-4" />
                  {date(event.start_at)}
                </span>
                <span className="flex items-center gap-2">
                  <MapPin className="size-4" />
                  {event.location || "Local não informado"}
                </span>
              </div>
            </div>
            <div className="flex gap-2">
              {canUpdate ? (
                <Link href={`/eventos/${event.id}/editar`} className={buttonVariants({ variant: "outline" })}>
                  <Pencil />
                  Editar
                </Link>
              ) : null}
              {canDelete ? (
                <Button variant="destructive" onClick={() => setConfirm(true)}>
                  <Trash2 />
                  Excluir
                </Button>
              ) : null}
            </div>
          </div>
        </header>
        <div className="p-6 sm:p-8">
          <h2 className="font-semibold">Sobre o evento</h2>
          <p className="text-muted-foreground mt-3 text-sm leading-7 whitespace-pre-wrap">
            {event.description || "Nenhuma descrição registrada."}
          </p>
          <div className="bg-muted/25 mt-6 grid gap-4 rounded-lg p-4 text-sm sm:grid-cols-3">
            <Meta icon={CalendarDays} label="Término" value={date(event.end_at)} />
            <Meta
              icon={Users}
              label="Inscrições"
              value={event.registration_enabled ? "Abertas" : "Desativadas"}
            />
            <Meta
              icon={Users}
              label="Capacidade"
              value={event.maximum_participants ? String(event.maximum_participants) : "Sem limite"}
            />
          </div>
        </div>
        <EventParticipants
          eventId={event.id}
          participants={event.event_participants ?? []}
          candidates={candidates}
          canManage={canManage}
          registrationEnabled={event.registration_enabled}
        />
      </article>
      <ConfirmationDialog
        open={confirm}
        onOpenChange={setConfirm}
        title={`Excluir “${event.title}”?`}
        description="O evento e todas as inscrições vinculadas serão removidos permanentemente."
        confirmLabel="Excluir evento"
        destructive
        pending={pending}
        onConfirm={() =>
          execute(
            () => deleteEvent(event.id),
            "Evento excluído com sucesso.",
            () => router.push("/eventos"),
          )
        }
      />
    </>
  );
}
function Meta({
  icon: Icon,
  label,
  value,
}: Readonly<{ icon: typeof CalendarDays; label: string; value: string }>) {
  return (
    <div className="flex gap-3">
      <Icon className="text-muted-foreground mt-0.5 size-4" />
      <div>
        <p className="text-muted-foreground text-xs">{label}</p>
        <p className="mt-1">{value}</p>
      </div>
    </div>
  );
}
