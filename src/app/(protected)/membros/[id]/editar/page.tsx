import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { PageLoadError } from "@/components/shared/page-load-error";
import { MemberForm } from "@/features/members/components/member-form";
import { getMember, requireMemberPermission } from "@/features/members/services/member.service";
import { hasPermission } from "@/lib/permissions/permissions";
import { redirect } from "next/navigation";
export const metadata: Metadata = { title: "Editar membro" };
export default async function EditMemberPage({ params }: Readonly<{ params: Promise<{ id: string }> }>) {
  const session = await requireMemberPermission("members.read");
  if (!hasPermission(session.user, "members.update")) redirect("/");
  const { id } = await params;
  const result = await getMember(id);
  if (!result.ok && result.status === 404) notFound();
  return (
    <div className="mx-auto w-full max-w-4xl">
      <header className="mb-7">
        <h1 className="font-serif text-2xl font-semibold">Editar membro</h1>
        <p className="text-muted-foreground mt-2 text-sm">
          Atualize os dados cadastrais e a situação do membro.
        </p>
      </header>
      {result.ok ? <MemberForm member={result.data} /> : <PageLoadError message={result.message} />}
    </div>
  );
}
