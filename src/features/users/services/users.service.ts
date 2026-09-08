import "server-only";
import { requestAdminApi } from "@/lib/api/admin-api";
import type { UserPage } from "../user.types";
import type { UserQuery } from "../user.schema";

export function getUsers(query: UserQuery) {
  const params = new URLSearchParams({ page: String(query.page), limit: "20" });

  if (query.search) params.set("search", query.search);
  if (query.status) params.set("status", query.status);

  return requestAdminApi<UserPage>(`/users?${params}`);
}
