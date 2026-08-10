import type { AuthenticatedUser } from "@/lib/auth/auth.types";

export function hasPermission(user: AuthenticatedUser | null, permission: string): boolean {
  return user?.status === "ACTIVE" && user.permissions.includes(permission);
}
