"use client";
import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowLeft, CalendarDays, Pencil, Trash2, Users } from "lucide-react";
import { ConfirmationDialog } from "@/components/shared/confirmation-dialog";
import { Button, buttonVariants } from "@/components/ui/button";
import { useAdminMutation } from "@/hooks/use-admin-mutation";
import { archiveAnnouncement } from "../actions";
import { announcementAudienceLabels, type Announcement } from "../announcement.types";
import { AnnouncementStatusBadge } from "./announcement-status-badge";
const date = (v: string | null) =>
  v
    ? new Intl.DateTimeFormat("pt-BR", { dateStyle: "long", timeStyle: "short" }).format(new Date(v))
    : "Não definido";
export function AnnouncementDetail({
  announcement,
  canUpdate,
  canDelete,
}: Readonly<{ announcement: Announcement; canUpdate: boolean; canDelete: boolean }>) {
  const router = useRouter(),
    { pending, execute } = useAdminMutation(),
    [confirm, setConfirm] = useState(false);
  const destination = announcement.announcement_destinations[0];
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
              <div className="flex flex-wrap items-center gap-3">
                <AnnouncementStatusBadge status={announcement.status} />
                <span className="text-muted-foreground flex items-center gap-1.5 text-xs">
                  <Users className="size-3.5" />
                  {destination?.ministries?.name ??
                    (destination ? announcementAudienceLabels[destination.type] : "Público não informado")}
                </span>
              </div>
              <h1 className="mt-4 font-serif text-2xl font-semibold sm:text-3xl">{announcement.title}</h1>
            </div>
            <div className="flex gap-2">
              {canUpdate ? (
                <Link
                  href={`/avisos/${announcement.id}/editar`}
                  className={buttonVariants({ variant: "outline" })}
                >
                  <Pencil />
                  Editar
                </Link>
              ) : null}
              {canDelete ? (
                <Button variant="destructive" onClick={() => setConfirm(true)}>
                  <Trash2 />
                  Arquivar
                </Button>
              ) : null}
            </div>
          </div>
        </header>
        <div className="p-6 sm:p-8">
          <p className="text-sm leading-7 whitespace-pre-wrap sm:text-base">{announcement.content}</p>
        </div>
        <footer className="bg-muted/20 grid gap-4 border-t p-6 text-sm sm:grid-cols-3 sm:p-8">
          <Meta label="Publicado em" value={date(announcement.published_at)} />
          <Meta label="Início da exibição" value={date(announcement.starts_at)} />
          <Meta label="Fim da exibição" value={date(announcement.ends_at)} />
        </footer>
      </article>
      <ConfirmationDialog
        open={confirm}
        onOpenChange={setConfirm}
        title={`Arquivar “${announcement.title}”?`}
        description="O aviso deixará de aparecer na listagem e não poderá ser restaurado pela interface."
        confirmLabel="Arquivar aviso"
        destructive
        pending={pending}
        onConfirm={() =>
          execute(
            () => archiveAnnouncement(announcement.id),
            "Aviso arquivado com sucesso.",
            () => router.push("/avisos"),
          )
        }
      />
    </>
  );
}
function Meta({ label, value }: Readonly<{ label: string; value: string }>) {
  return (
    <div className="flex gap-3">
      <CalendarDays className="text-muted-foreground mt-0.5 size-4" />
      <div>
        <p className="text-muted-foreground text-xs">{label}</p>
        <p className="mt-1">{value}</p>
      </div>
    </div>
  );
}
