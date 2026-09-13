"use server";
import { revalidatePath } from "next/cache";
import { z } from "zod";
import { eventFormSchema } from "./event.schema";
import { requestEventApi, type EventResult } from "./services/event.service";
import type { ChurchEvent, EventParticipant } from "./event.types";
export async function saveEvent(input: unknown): Promise<EventResult<ChurchEvent>> {
  const p = z.object({ id: z.string().uuid().optional(), values: eventFormSchema }).safeParse(input);
  if (!p.success) return { ok: false, status: 400, message: "Confira os dados do evento." };
  const { id, values } = p.data,
    r = await requestEventApi<ChurchEvent>(id ? `/${id}` : "", id ? "events.update" : "events.create", {
      method: id ? "PUT" : "POST",
      body: JSON.stringify(values),
    });
  if (r.ok) revalidatePath("/eventos");
  return r;
}
export async function deleteEvent(id: string): Promise<EventResult> {
  if (!z.string().uuid().safeParse(id).success)
    return { ok: false, status: 400, message: "Evento inválido." };
  const r = await requestEventApi<void>(`/${id}`, "events.delete", { method: "DELETE" });
  if (r.ok) revalidatePath("/eventos");
  return r;
}
export async function addEventParticipant(input: unknown): Promise<EventResult<EventParticipant>> {
  const p = z.object({ eventId: z.string().uuid(), memberId: z.string().uuid() }).safeParse(input);
  if (!p.success) return { ok: false, status: 400, message: "Participante inválido." };
  const r = await requestEventApi<EventParticipant>(
    `/${p.data.eventId}/participants`,
    "events.manage_participants",
    { method: "POST", body: JSON.stringify({ memberId: p.data.memberId }) },
  );
  if (r.ok) revalidatePath(`/eventos/${p.data.eventId}`);
  return r;
}
export async function updateEventParticipant(input: unknown): Promise<EventResult<EventParticipant>> {
  const p = z
    .object({
      eventId: z.string().uuid(),
      memberId: z.string().uuid(),
      status: z.enum(["REGISTERED", "CANCELED", "ATTENDED", "ABSENT"]),
    })
    .safeParse(input);
  if (!p.success) return { ok: false, status: 400, message: "Participação inválida." };
  const r = await requestEventApi<EventParticipant>(
    `/${p.data.eventId}/participants/${p.data.memberId}`,
    "events.manage_participants",
    { method: "PUT", body: JSON.stringify({ status: p.data.status }) },
  );
  if (r.ok) revalidatePath(`/eventos/${p.data.eventId}`);
  return r;
}
