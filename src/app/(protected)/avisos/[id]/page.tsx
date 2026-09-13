import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { PageLoadError } from "@/components/shared/page-load-error";
import { AnnouncementDetail } from "@/features/announcements/components/announcement-detail";
import {
  getAnnouncement,
  requireAnnouncementPermission,
} from "@/features/announcements/services/announcement.service";
import { hasPermission } from "@/lib/permissions/permissions";
export const metadata: Metadata = { title: "Detalhes do aviso" };
export default async function AnnouncementPage({ params }: Readonly<{ params: Promise<{ id: string }> }>) {
  const session = await requireAnnouncementPermission("announcements.read"),
    { id } = await params,
    result = await getAnnouncement(id);
  if (!result.ok && result.status === 404) notFound();
  return (
    <div className="mx-auto w-full max-w-5xl">
      {result.ok ? (
        <AnnouncementDetail
          announcement={result.data}
          canUpdate={hasPermission(session.user, "announcements.update")}
          canDelete={hasPermission(session.user, "announcements.delete")}
        />
      ) : (
        <PageLoadError message={result.message} />
      )}
    </div>
  );
}
