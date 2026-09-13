"use client";
import AvatarPhoto from "@/components/shared/avatar-photo";
import { ConfirmationDialog } from "@/components/shared/confirmation-dialog";
import { Button, buttonVariants } from "@/components/ui/button";
import { useAdminMutation } from "@/hooks/use-admin-mutation";
import { ArrowLeft, CalendarDays, Mail, MapPin, Pencil, Phone, Trash2 } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { deleteMember } from "../actions";
import type { Member } from "../member.types";
import { MemberStatusBadge } from "./member-status-badge";

const formatDate = (value: string | null) =>
  value ? new Intl.DateTimeFormat("pt-BR", { timeZone: "UTC" }).format(new Date(value)) : "Não informada";

export function MemberProfile({
  member,
  canUpdate,
  canDelete,
}: Readonly<{ member: Member; canUpdate: boolean; canDelete: boolean }>) {
  const [confirmDelete, setConfirmDelete] = useState(false);
  const { pending, execute } = useAdminMutation();
  const router = useRouter();
  const name = `${member.first_name} ${member.last_name}`;
  const address = [member.address_line, member.city, member.state, member.postal_code]
    .filter(Boolean)
    .join(", ");

  return (
    <>
      <Button variant="ghost" className="mb-4" onClick={() => router.back()}>
        <ArrowLeft aria-hidden />
        Voltar
      </Button>
      <section className="bg-card overflow-hidden rounded-xl border">
        <header className="bg-muted/35 flex flex-col gap-5 border-b p-6 sm:flex-row sm:items-center">
          <AvatarPhoto name={name} className="size-20 shrink-0" fallbackClassName="text-xl" />
          <div className="min-w-0 flex-1">
            <div className="flex flex-wrap items-center gap-3">
              <h1 className="font-serif text-2xl font-semibold">{name}</h1>
              <MemberStatusBadge status={member.membership_status} />
            </div>
            <p className="text-muted-foreground mt-2 text-sm">
              Membro desde {formatDate(member.membership_date)}
            </p>
          </div>
          <div className="flex flex-wrap gap-2">
            {canUpdate ? (
              <Link href={`/membros/${member.id}/editar`} className={buttonVariants({ variant: "outline" })}>
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
        <div className="grid gap-8 p-6 lg:grid-cols-2">
          <InfoSection title="Contato">
            <Info icon={Mail} label="E-mail" value={member.email} />
            <Info icon={Phone} label="Telefone" value={member.phone} />
            <Info icon={MapPin} label="Endereço" value={address || null} />
          </InfoSection>
          <InfoSection title="Dados do membro">
            <Info icon={CalendarDays} label="Nascimento" value={formatDate(member.birth_date)} />
            <Info icon={CalendarDays} label="Data de membresia" value={formatDate(member.membership_date)} />
          </InfoSection>
          <section className="lg:col-span-2">
            <h2 className="font-semibold">Observações</h2>
            <p className="text-muted-foreground mt-3 text-sm leading-relaxed whitespace-pre-wrap">
              {member.notes || "Nenhuma observação registrada."}
            </p>
          </section>
        </div>
      </section>
      <ConfirmationDialog
        open={confirmDelete}
        onOpenChange={setConfirmDelete}
        title={`Excluir ${name}?`}
        description="O membro será removido do diretório. O histórico será preservado e esta ação não poderá ser desfeita pela interface."
        confirmLabel="Excluir membro"
        destructive
        pending={pending}
        onConfirm={() =>
          execute(
            () => deleteMember(member.id),
            "Membro excluído com sucesso.",
            () => router.push("/membros"),
          )
        }
      />
    </>
  );
}

function InfoSection({ title, children }: Readonly<{ title: string; children: React.ReactNode }>) {
  return (
    <section className="space-y-4">
      <h2 className="font-semibold">{title}</h2>
      <dl className="space-y-4">{children}</dl>
    </section>
  );
}

function Info({
  icon: Icon,
  label,
  value,
}: Readonly<{ icon: typeof Mail; label: string; value: string | null }>) {
  return (
    <div className="flex gap-3">
      <Icon className="text-muted-foreground mt-0.5 size-4 shrink-0" aria-hidden />
      <div>
        <dt className="text-muted-foreground text-xs">{label}</dt>
        <dd className="mt-0.5 text-sm wrap-break-word">{value || "Não informado"}</dd>
      </div>
    </div>
  );
}
