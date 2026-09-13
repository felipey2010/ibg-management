"use client";
import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowLeft, Pencil, Trash2, UsersRound } from "lucide-react";
import { Button, buttonVariants } from "@/components/ui/button";
import { ConfirmationDialog } from "@/components/shared/confirmation-dialog";
import { useAdminMutation } from "@/hooks/use-admin-mutation";
import type { Member } from "@/features/members/member.types";
import { deleteMinistry } from "../actions";
import type { Ministry } from "../ministry.types";
import { MinistryRoster } from "./ministry-roster";
import { MinistryStatusBadge } from "./ministry-status-badge";
export function MinistryProfile({
  ministry,
  candidates,
  canUpdate,
  canDelete,
  canManage,
}: Readonly<{
  ministry: Ministry;
  candidates: Member[];
  canUpdate: boolean;
  canDelete: boolean;
  canManage: boolean;
}>) {
  const router = useRouter();
  const [confirmDelete, setConfirmDelete] = useState(false);
  const { pending, execute } = useAdminMutation();
  return (
    <>
      <Button variant="ghost" className="mb-4" onClick={() => router.back()}>
        <ArrowLeft />
        Voltar
      </Button>
      <section className="bg-card overflow-hidden rounded-xl border">
        <header className="bg-muted/35 flex flex-col gap-5 border-b p-6 sm:flex-row sm:items-center">
          <div className="bg-background flex size-16 shrink-0 items-center justify-center rounded-xl shadow-sm">
            <UsersRound className="size-7" />
          </div>
          <div className="min-w-0 flex-1">
            <div className="flex flex-wrap items-center gap-3">
              <h1 className="font-serif text-2xl font-semibold">{ministry.name}</h1>
              <MinistryStatusBadge status={ministry.status} />
            </div>
            <p className="text-muted-foreground mt-2 text-sm">
              {ministry._count.ministry_members} participantes ativos
            </p>
          </div>
          <div className="flex flex-wrap gap-2">
            {canUpdate ? (
              <Link
                href={`/ministerios/${ministry.id}/editar`}
                className={buttonVariants({ variant: "outline" })}
              >
                <Pencil />
                Editar
              </Link>
            ) : null}
            {canDelete ? (
              <Button variant="destructive" onClick={() => setConfirmDelete(true)}>
                <Trash2 />
                Excluir
              </Button>
            ) : null}
          </div>
        </header>
        <div className="p-6">
          <h2 className="font-semibold">Sobre o ministério</h2>
          <p className="text-muted-foreground mt-3 text-sm leading-relaxed whitespace-pre-wrap">
            {ministry.description || "Nenhuma descrição registrada."}
          </p>
        </div>
        <MinistryRoster
          ministryId={ministry.id}
          roster={ministry.ministry_members ?? []}
          candidates={candidates}
          canManage={canManage}
        />
      </section>
      <ConfirmationDialog
        open={confirmDelete}
        onOpenChange={setConfirmDelete}
        title={`Excluir ${ministry.name}?`}
        description="O ministério e seus vínculos serão excluídos. Esta ação não poderá ser desfeita pela interface."
        confirmLabel="Excluir ministério"
        destructive
        pending={pending}
        onConfirm={() =>
          execute(
            () => deleteMinistry(ministry.id),
            "Ministério excluído com sucesso.",
            () => router.push("/ministerios"),
          )
        }
      />
    </>
  );
}
