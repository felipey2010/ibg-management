"use server";
import { revalidatePath } from "next/cache";
import { z } from "zod";
import { memberFormSchema } from "./member.schema";
import { requestMemberApi, type MemberResult } from "./services/member.service";
import type { Member } from "./member.types";

export async function saveMember(input: unknown): Promise<MemberResult<Member>> {
  const parsed = z.object({ id: z.string().uuid().optional(), values: memberFormSchema }).safeParse(input);
  if (!parsed.success) return { ok: false, status: 400, message: "Confira os dados do membro." };
  const { id, values } = parsed.data;
  const result = await requestMemberApi<Member>(
    id ? `/${id}` : "",
    id ? "members.update" : "members.create",
    {
      method: id ? "PUT" : "POST",
      body: JSON.stringify(values),
    },
  );
  if (result.ok) revalidatePath("/membros");
  return result;
}

export async function deleteMember(input: unknown): Promise<MemberResult> {
  const parsed = z.string().uuid().safeParse(input);
  if (!parsed.success) return { ok: false, status: 400, message: "Membro inválido." };
  const result = await requestMemberApi<void>(`/${parsed.data}`, "members.delete", { method: "DELETE" });
  if (result.ok) revalidatePath("/membros");
  return result;
}
