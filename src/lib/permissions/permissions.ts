import type { AuthenticatedUser } from "@/lib/auth/auth.types";

export function hasPermission(
  user: Pick<AuthenticatedUser, "status" | "permissions"> | null,
  permission: string,
): boolean {
  return (
    user?.status === "ACTIVE" && (user.permissions.includes("*") || user.permissions.includes(permission))
  );
}
