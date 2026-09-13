import type { Metadata } from "next";
import { AnnouncementForm } from "@/features/announcements/components/announcement-form";
import { requireAnnouncementPermission } from "@/features/announcements/services/announcement.service";
import { getMinistries } from "@/features/ministries/services/ministry.service";
import { hasPermission } from "@/lib/permissions/permissions";
export const metadata: Metadata = { title: "Criar aviso" };
export default async function NewAnnouncementPage() {
  const session = await requireAnnouncementPermission("announcements.create");
  const result = hasPermission(session.user, "ministries.read")
    ? await getMinistries({ page: 1, search: "", status: "ACTIVE" })
    : null;
  return (
    <div className="mx-auto w-full max-w-4xl">
      <header className="mb-7">
        <h1 className="font-serif text-2xl font-semibold">Criar aviso</h1>
        <p className="text-muted-foreground mt-2 text-sm">
          Defina a mensagem, o público e o período de exibição.
        </p>
      </header>
      <AnnouncementForm ministries={result?.ok ? result.data.data : []} />
    </div>
  );
}
