import { PageLoadError } from "@/components/shared/page-load-error";
import { buttonVariants } from "@/components/ui/button";
import { MemberDirectory } from "@/features/members/components/member-directory";
import { memberQuerySchema } from "@/features/members/member.schema";
import { getMembers, requireMemberPermission } from "@/features/members/services/member.service";
import { hasPermission } from "@/lib/permissions/permissions";
import { Plus } from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = { title: "Membros" };
export default async function MembersPage({
  searchParams,
}: Readonly<{ searchParams: Promise<Record<string, string | string[] | undefined>> }>) {
  const session = await requireMemberPermission("members.read");
  const query = memberQuerySchema.parse(await searchParams);
  const result = await getMembers(query);
  return (
    <div className="mx-auto w-full max-w-7xl px-1 sm:px-2">
      <header className="mb-7 flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
        <div>
          <h1 className="font-serif text-2xl font-semibold sm:text-3xl">Membros</h1>
          <p className="text-muted-foreground mt-2 text-sm">
            Consulte e mantenha o diretório de membros da igreja.
          </p>
        </div>
        {hasPermission(session.user, "members.create") ? (
          <Link href="/membros/novo" className={buttonVariants({ variant: "default" })}>
            <Plus />
            Cadastrar membro
          </Link>
        ) : null}
      </header>
      {result.ok ? (
        <MemberDirectory page={result.data} query={query} />
      ) : (
        <PageLoadError message={result.message} />
      )}
    </div>
  );
}
