import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { PageLoadError } from "@/components/shared/page-load-error";
import { EventDetail } from "@/features/events/components/event-detail";
import { getEvent, requireEventPermission } from "@/features/events/services/event.service";
import { getActiveMemberOptions } from "@/features/members/services/member.service";
import { hasPermission } from "@/lib/permissions/permissions";
export const metadata: Metadata = { title: "Detalhes do evento" };
export default async function EventPage({ params }: Readonly<{ params: Promise<{ id: string }> }>) {
  const session = await requireEventPermission("events.read"),
    { id } = await params,
    result = await getEvent(id);
  if (!result.ok && result.status === 404) notFound();
  if (!result.ok)
    return (
      <div className="mx-auto max-w-5xl">
        <PageLoadError message={result.message} />
      </div>
    );
  const canManage = hasPermission(session.user, "events.manage_participants"),
    canReadMembers = hasPermission(session.user, "members.read"),
    members = canManage && canReadMembers ? await getActiveMemberOptions() : null;
  return (
    <div className="mx-auto w-full max-w-5xl">
      <EventDetail
        event={result.data}
        candidates={members?.ok ? members.data.data : []}
        canUpdate={hasPermission(session.user, "events.update")}
        canDelete={hasPermission(session.user, "events.delete")}
        canManage={canManage && canReadMembers}
      />
    </div>
  );
}
