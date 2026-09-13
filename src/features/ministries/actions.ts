"use server";
import { revalidatePath } from "next/cache";
import { z } from "zod";
import { ministryFormSchema } from "./ministry.schema";
import { requestMinistryApi, type MinistryResult } from "./services/ministry.service";
import type { Ministry, MinistryMember } from "./ministry.types";

export async function saveMinistry(input: unknown): Promise<MinistryResult<Ministry>> {
  const parsed = z.object({ id: z.string().uuid().optional(), values: ministryFormSchema }).safeParse(input);
  if (!parsed.success) return { ok: false, status: 400, message: "Confira os dados do ministério." };
  const { id, values } = parsed.data;
  const result = await requestMinistryApi<Ministry>(
    id ? `/${id}` : "",
    id ? "ministries.update" : "ministries.create",
    { method: id ? "PUT" : "POST", body: JSON.stringify(values) },
  );
  if (result.ok) revalidatePath("/ministerios");
  return result;
}
export async function deleteMinistry(id: string): Promise<MinistryResult> {
  if (!z.string().uuid().safeParse(id).success)
    return { ok: false, status: 400, message: "Ministério inválido." };
  const result = await requestMinistryApi<void>(`/${id}`, "ministries.delete", { method: "DELETE" });
  if (result.ok) revalidatePath("/ministerios");
  return result;
}
const membershipSchema = z.object({
  ministryId: z.string().uuid(),
  memberId: z.string().uuid(),
  role: z.enum(["LEADER", "MEMBER"]),
});
export async function addMinistryMember(input: unknown): Promise<MinistryResult<MinistryMember>> {
  const parsed = membershipSchema.safeParse(input);
  if (!parsed.success) return { ok: false, status: 400, message: "Confira os dados da participação." };
  const { ministryId, ...body } = parsed.data;
  const result = await requestMinistryApi<MinistryMember>(
    `/${ministryId}/members`,
    "ministries.manage_members",
    { method: "POST", body: JSON.stringify(body) },
  );
  if (result.ok) revalidatePath(`/ministerios/${ministryId}`);
  return result;
}
export async function updateMinistryMember(input: unknown): Promise<MinistryResult<MinistryMember>> {
  const parsed = membershipSchema.safeParse(input);
  if (!parsed.success) return { ok: false, status: 400, message: "Confira os dados da participação." };
  const { ministryId, memberId, role } = parsed.data;
  const result = await requestMinistryApi<MinistryMember>(
    `/${ministryId}/members/${memberId}`,
    "ministries.manage_members",
    { method: "PUT", body: JSON.stringify({ role }) },
  );
  if (result.ok) revalidatePath(`/ministerios/${ministryId}`);
  return result;
}
export async function removeMinistryMember(input: unknown): Promise<MinistryResult> {
  const parsed = z.object({ ministryId: z.string().uuid(), memberId: z.string().uuid() }).safeParse(input);
  if (!parsed.success) return { ok: false, status: 400, message: "Participação inválida." };
  const result = await requestMinistryApi<void>(
    `/${parsed.data.ministryId}/members/${parsed.data.memberId}`,
    "ministries.manage_members",
    { method: "DELETE" },
  );
  if (result.ok) revalidatePath(`/ministerios/${parsed.data.ministryId}`);
  return result;
}
