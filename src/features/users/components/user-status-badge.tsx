import { Badge } from "@/components/ui/badge";
import type { AccountStatus } from "@/lib/auth/auth.types";
import { userStatusLabels } from "../user.constants";

const styles: Record<AccountStatus, string> = {
  ACTIVE: "bg-emerald-50 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300",
  PENDING_APPROVAL: "bg-amber-50 text-amber-900 dark:bg-amber-950 dark:text-amber-300",
  REJECTED: "bg-red-50 text-red-800 dark:bg-red-950 dark:text-red-300",
  SUSPENDED: "bg-orange-50 text-orange-900 dark:bg-orange-950 dark:text-orange-300",
  INACTIVE: "bg-muted text-muted-foreground",
};

export function UserStatusBadge({ status }: Readonly<{ status: AccountStatus }>) {
  return (
    <Badge variant="secondary" className={styles[status]}>
      {userStatusLabels[status]}
    </Badge>
  );
}
