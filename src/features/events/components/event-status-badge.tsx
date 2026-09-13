import { Badge } from "@/components/ui/badge";
import { eventStatusLabels, type EventStatus } from "../event.types";
export function EventStatusBadge({ status }: Readonly<{ status: EventStatus }>) {
  return (
    <Badge variant={status === "PUBLISHED" ? "default" : "secondary"}>{eventStatusLabels[status]}</Badge>
  );
}
