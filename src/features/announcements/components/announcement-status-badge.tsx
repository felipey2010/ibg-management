import { Badge } from "@/components/ui/badge";
import { announcementStatusLabels, type AnnouncementStatus } from "../announcement.types";
export function AnnouncementStatusBadge({ status }: Readonly<{ status: AnnouncementStatus }>) {
  return (
    <Badge variant={status === "PUBLISHED" ? "default" : "secondary"}>
      {announcementStatusLabels[status]}
    </Badge>
  );
}
