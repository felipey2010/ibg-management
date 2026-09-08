import "server-only";
import { requestAdminApi } from "@/lib/api/admin-api";
import type { Role, Permission } from "../access-control.types";

export const getRoles = () => requestAdminApi<Role[]>("/roles");
export const getPermissions = () => requestAdminApi<Permission[]>("/permissions");
