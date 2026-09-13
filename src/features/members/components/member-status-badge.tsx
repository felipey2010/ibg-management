import { Badge } from "@/components/ui/badge";
import { memberStatusLabels, type MemberStatus } from "../member.types";

const variants: Record<MemberStatus, string> = {
  ACTIVE: "border-emerald-600/25 bg-emerald-600/10 text-emerald-700 dark:text-emerald-400",
  INACTIVE: "border-slate-500/25 bg-slate-500/10 text-slate-700 dark:text-slate-300",
  TRANSFERRED: "border-blue-600/25 bg-blue-600/10 text-blue-700 dark:text-blue-400",
  REMOVED: "border-destructive/25 bg-destructive/10 text-destructive",
};

export function MemberStatusBadge({ status }: Readonly<{ status: MemberStatus }>) {
  return (
    <Badge variant="outline" className={variants[status]}>
      {memberStatusLabels[status]}
    </Badge>
  );
}
