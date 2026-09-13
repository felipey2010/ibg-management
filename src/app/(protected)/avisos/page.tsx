import type { Metadata } from "next";
import Link from "next/link";
import { Plus } from "lucide-react";
import { PageLoadError } from "@/components/shared/page-load-error";
import { buttonVariants } from "@/components/ui/button";
import { AnnouncementDirectory } from "@/features/announcements/components/announcement-directory";
import { announcementQuerySchema } from "@/features/announcements/announcement.schema";
import {
  getAnnouncements,
  requireAnnouncementPermission,
} from "@/features/announcements/services/announcement.service";
import { hasPermission } from "@/lib/permissions/permissions";
export const metadata: Metadata = { title: "Avisos" };
export default async function AnnouncementsPage({
  searchParams,
}: Readonly<{ searchParams: Promise<Record<string, string | string[] | undefined>> }>) {
  const session = await requireAnnouncementPermission("announcements.read"),
    query = announcementQuerySchema.parse(await searchParams),
    result = await getAnnouncements(query);
  return (
    <div className="mx-auto w-full max-w-7xl px-1 sm:px-2">
      <header className="mb-7 flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
        <div>
          <h1 className="font-serif text-2xl font-semibold sm:text-3xl">Avisos</h1>
          <p className="text-muted-foreground mt-2 text-sm">
            Prepare e publique comunicados para a comunidade.
          </p>
        </div>
        {hasPermission(session.user, "announcements.create") ? (
          <Link href="/avisos/novo" className={buttonVariants()}>
            <Plus />
            Criar aviso
          </Link>
        ) : null}
      </header>
      {result.ok ? (
        <AnnouncementDirectory page={result.data} query={query} />
      ) : (
        <PageLoadError message={result.message} />
      )}
    </div>
  );
}
