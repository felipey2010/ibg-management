import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { PageLoadError } from "@/components/shared/page-load-error";
import { ContributionDetail } from "@/features/contributions/components/contribution-detail";
import {
  getContribution,
  requireContributionPermission,
} from "@/features/contributions/services/contribution.service";
import { getActiveMemberOptions } from "@/features/members/services/member.service";
import { hasPermission } from "@/lib/permissions/permissions";

export const metadata: Metadata = { title: "Detalhes da campanha" };

export default async function ContributionPage({ params }: Readonly<{ params: Promise<{ id: string }> }>) {
  const session = await requireContributionPermission("contributions.read");
  const { id } = await params;
  const result = await getContribution(id);

  if (!result.ok && result.status === 404) notFound();
  if (!result.ok)
    return (
      <div className="mx-auto max-w-5xl">
        <PageLoadError message={result.message} />
      </div>
    );

  const canRecord = hasPermission(session.user, "contributions.record");
  const canReadMembers = hasPermission(session.user, "members.read");
  const membersResult = canRecord && canReadMembers ? await getActiveMemberOptions() : null;

  return (
    <div className="mx-auto w-full max-w-5xl">
      <ContributionDetail
        campaign={result.data}
        members={membersResult?.ok ? membersResult.data.data : []}
        canUpdate={hasPermission(session.user, "contributions.update")}
        canDelete={hasPermission(session.user, "contributions.delete")}
        canRecord={canRecord}
      />
    </div>
  );
}
