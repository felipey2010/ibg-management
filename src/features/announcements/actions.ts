"use server";
import { revalidatePath } from "next/cache";
import { z } from "zod";
import { announcementFormSchema } from "./announcement.schema";
import { requestAnnouncementApi, type AnnouncementResult } from "./services/announcement.service";
import type { Announcement } from "./announcement.types";
export async function saveAnnouncement(input: unknown): Promise<AnnouncementResult<Announcement>> {
  const p = z.object({ id: z.string().uuid().optional(), values: announcementFormSchema }).safeParse(input);
  if (!p.success) return { ok: false, status: 400, message: "Confira os dados do aviso." };
  const { id, values } = p.data;
  const result = await requestAnnouncementApi<Announcement>(
    id ? `/${id}` : "",
    id ? "announcements.update" : "announcements.create",
    { method: id ? "PUT" : "POST", body: JSON.stringify(values) },
  );
  if (result.ok) revalidatePath("/avisos");
  return result;
}
export async function archiveAnnouncement(id: string): Promise<AnnouncementResult> {
  if (!z.string().uuid().safeParse(id).success) return { ok: false, status: 400, message: "Aviso inválido." };
  const result = await requestAnnouncementApi<void>(`/${id}`, "announcements.delete", { method: "DELETE" });
  if (result.ok) revalidatePath("/avisos");
  return result;
}
