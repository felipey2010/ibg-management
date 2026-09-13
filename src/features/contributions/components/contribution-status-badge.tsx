import { Badge } from "@/components/ui/badge";
import { contributionStatusLabels, type ContributionStatus } from "../contribution.types";

const variants: Record<ContributionStatus, "secondary" | "default" | "outline" | "destructive"> = {
  DRAFT: "secondary",
  ACTIVE: "default",
  CLOSED: "outline",
  ARCHIVED: "outline",
};

export function ContributionStatusBadge({ status }: Readonly<{ status: ContributionStatus }>) {
  return <Badge variant={variants[status]}>{contributionStatusLabels[status]}</Badge>;
}
