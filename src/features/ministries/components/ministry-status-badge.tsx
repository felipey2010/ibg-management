import { Badge } from "@/components/ui/badge";
import { ministryStatusLabels, type MinistryStatus } from "../ministry.types";
export function MinistryStatusBadge({ status }: Readonly<{ status: MinistryStatus }>) {
  return (
    <Badge variant={status === "ACTIVE" ? "default" : "secondary"}>{ministryStatusLabels[status]}</Badge>
  );
}
