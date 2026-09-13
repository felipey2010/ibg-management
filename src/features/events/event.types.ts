export const eventStatuses = ["DRAFT", "PUBLISHED", "CANCELED", "COMPLETED"] as const;
export type EventStatus = (typeof eventStatuses)[number];
export type ParticipationStatus = "REGISTERED" | "CANCELED" | "ATTENDED" | "ABSENT";
export interface EventParticipant {
  id: string;
  member_id: string;
  status: ParticipationStatus;
  registered_at: string;
  checked_in_at: string | null;
  members: { id: string; first_name: string; last_name: string; email: string | null; phone: string | null };
}
export interface ChurchEvent {
  id: string;
  title: string;
  description: string | null;
  start_at: string;
  end_at: string | null;
  location: string | null;
  status: EventStatus;
  registration_enabled: boolean;
  registration_deadline: string | null;
  maximum_participants: number | null;
  created_at: string;
  updated_at: string;
  _count: { event_participants: number };
  event_participants?: EventParticipant[];
}
export interface EventPage {
  data: ChurchEvent[];
  pagination: { page: number; limit: number; total: number };
}
export const eventStatusLabels: Record<EventStatus, string> = {
  DRAFT: "Rascunho",
  PUBLISHED: "Publicado",
  CANCELED: "Cancelado",
  COMPLETED: "Concluído",
};
export const participationStatusLabels: Record<ParticipationStatus, string> = {
  REGISTERED: "Inscrito",
  CANCELED: "Cancelado",
  ATTENDED: "Presente",
  ABSENT: "Ausente",
};
