import type { Metadata } from "next";
import { MemberForm } from "@/features/members/components/member-form";
import { requireMemberPermission } from "@/features/members/services/member.service";
export const metadata: Metadata = { title: "Cadastrar membro" };
export default async function NewMemberPage() {
  await requireMemberPermission("members.create");
  return (
    <div className="mx-auto w-full max-w-4xl">
      <header className="mb-7">
        <h1 className="font-serif text-2xl font-semibold">Cadastrar membro</h1>
        <p className="text-muted-foreground mt-2 text-sm">
          Registre os dados pessoais e o vínculo com a igreja.
        </p>
      </header>
      <MemberForm />
    </div>
  );
}
