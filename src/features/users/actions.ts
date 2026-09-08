"use server";
import { requestAdminApi, type AdminResult } from "@/lib/api/admin-api";
import { userMutationSchema } from "./user.schema";

export async function updateUserAccess(input: unknown): Promise<AdminResult> {
  const parsed = userMutationSchema.safeParse(input);

  if (!parsed.success) return { ok: false, status: 400, message: "Confira os dados da alteração." };
  const mutation = parsed.data;
  const path = `/users/${mutation.id}`;

  switch (mutation.action) {
    case "status":
      return requestAdminApi(`${path}/status`, {
        method: "PATCH",
        body: JSON.stringify({ status: mutation.status }),
      });
    case "revoke":
      return requestAdminApi(`${path}/revoke-sessions`, { method: "POST" });
    case "assign":
      return requestAdminApi(`${path}/roles`, {
        method: "POST",
        body: JSON.stringify({ roleCode: mutation.roleCode }),
      });
    case "remove":
      return requestAdminApi(`${path}/roles/${encodeURIComponent(mutation.roleCode)}`, { method: "DELETE" });
  }
}
