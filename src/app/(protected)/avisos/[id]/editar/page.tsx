import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { PageLoadError } from "@/components/shared/page-load-error";
import { AnnouncementForm } from "@/features/announcements/components/announcement-form";
import {
  getAnnouncement,
  requireAnnouncementPermission,
} from "@/features/announcements/services/announcement.service";
import { getMinistries } from "@/features/ministries/services/ministry.service";
import { hasPermission } from "@/lib/permissions/permissions";
export const metadata: Metadata = { title: "Editar aviso" };
export default async function EditAnnouncementPage({
  params,
}: Readonly<{ params: Promise<{ id: string }> }>) {
  const session = await requireAnnouncementPermission("announcements.update"),
    { id } = await params;
  const [announcement, ministries] = await Promise.all([
    getAnnouncement(id, "announcements.update"),
    hasPermission(session.user, "ministries.read")
      ? getMinistries({ page: 1, search: "", status: "ACTIVE" })
      : Promise.resolve(null),
  ]);
  if (!announcement.ok && announcement.status === 404) notFound();
  return (
    <div className="mx-auto w-full max-w-4xl">
      <header className="mb-7">
        <h1 className="font-serif text-2xl font-semibold">Editar aviso</h1>
        <p className="text-muted-foreground mt-2 text-sm">
          Atualize a mensagem, o público ou o período de exibição.
        </p>
      </header>
      {announcement.ok ? (
        <AnnouncementForm
          announcement={announcement.data}
          ministries={ministries?.ok ? ministries.data.data : []}
        />
      ) : (
        <PageLoadError message={announcement.message} />
      )}
    </div>
  );
}
