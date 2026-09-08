"use server";
import { z } from "zod";
import { requestAdminApi, type AdminResult } from "@/lib/api/admin-api";
import { roleSchema, permissionSchema, rolePermissionsSchema } from "./access-control.schema";

export async function saveRole(input: unknown): Promise<AdminResult> {
  const parsed = z.object({ id: z.string().uuid().optional(), values: roleSchema }).safeParse(input);
  if (!parsed.success) return { ok: false, status: 400, message: "Confira os dados do perfil." };
  const { id, values } = parsed.data;
  return requestAdminApi(`/roles${id ? `/${id}` : ""}`, {
    method: id ? "PATCH" : "POST",
    body: JSON.stringify(values),
  });
}

export async function savePermission(input: unknown): Promise<AdminResult> {
  const parsed = z.object({ id: z.string().uuid().optional(), values: permissionSchema }).safeParse(input);
  if (!parsed.success) return { ok: false, status: 400, message: "Confira os dados da permissão." };
  const { id, values } = parsed.data;
  return requestAdminApi(`/permissions${id ? `/${id}` : ""}`, {
    method: id ? "PATCH" : "POST",
    body: JSON.stringify(values),
  });
}

export async function saveRolePermissions(input: unknown): Promise<AdminResult> {
  const parsed = rolePermissionsSchema.safeParse(input);
  if (!parsed.success) return { ok: false, status: 400, message: "Selecione até 100 permissões válidas." };
  return requestAdminApi(`/roles/${parsed.data.id}/permissions`, {
    method: "PUT",
    body: JSON.stringify({ permissionCodes: parsed.data.permissionCodes }),
  });
}

export async function deleteAccessRecord(input: unknown): Promise<AdminResult> {
  const parsed = z.object({ id: z.string().uuid(), kind: z.enum(["roles", "permissions"]) }).safeParse(input);
  if (!parsed.success) return { ok: false, status: 400, message: "Registro inválido." };
  return requestAdminApi(`/${parsed.data.kind}/${parsed.data.id}`, { method: "DELETE" });
}
