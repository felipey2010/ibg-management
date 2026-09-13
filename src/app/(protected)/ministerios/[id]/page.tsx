import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { PageLoadError } from "@/components/shared/page-load-error";
import { MinistryProfile } from "@/features/ministries/components/ministry-profile";
import { getMinistry, requireMinistryPermission } from "@/features/ministries/services/ministry.service";
import { getActiveMemberOptions } from "@/features/members/services/member.service";
import { hasPermission } from "@/lib/permissions/permissions";
export const metadata: Metadata = { title: "Detalhes do ministério" };
export default async function MinistryPage({ params }: Readonly<{ params: Promise<{ id: string }> }>) {
  const session = await requireMinistryPermission("ministries.read");
  const { id } = await params;
  const result = await getMinistry(id);
  if (!result.ok && result.status === 404) notFound();
  if (!result.ok)
    return (
      <div className="mx-auto w-full max-w-5xl">
        <PageLoadError message={result.message} />
      </div>
    );
  const canManage = hasPermission(session.user, "ministries.manage_members");
  const canReadMembers = hasPermission(session.user, "members.read");
  const memberResult = canManage && canReadMembers ? await getActiveMemberOptions() : null;
  return (
    <div className="mx-auto w-full max-w-5xl">
      <MinistryProfile
        ministry={result.data}
        candidates={memberResult?.ok ? memberResult.data.data : []}
        canUpdate={hasPermission(session.user, "ministries.update")}
        canDelete={hasPermission(session.user, "ministries.delete")}
        canManage={canManage && canReadMembers}
      />
    </div>
  );
}
