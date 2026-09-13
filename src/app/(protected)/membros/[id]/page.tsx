import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { PageLoadError } from "@/components/shared/page-load-error";
import { MemberProfile } from "@/features/members/components/member-profile";
import { getMember, requireMemberPermission } from "@/features/members/services/member.service";
import { hasPermission } from "@/lib/permissions/permissions";
export const metadata: Metadata = { title: "Perfil do membro" };
export default async function MemberPage({ params }: Readonly<{ params: Promise<{ id: string }> }>) {
  const session = await requireMemberPermission("members.read");
  const { id } = await params;
  const result = await getMember(id);
  if (!result.ok && result.status === 404) notFound();
  return (
    <div className="mx-auto w-full max-w-5xl">
      {result.ok ? (
        <MemberProfile
          member={result.data}
          canUpdate={hasPermission(session.user, "members.update")}
          canDelete={hasPermission(session.user, "members.delete")}
        />
      ) : (
        <PageLoadError message={result.message} />
      )}
    </div>
  );
}
