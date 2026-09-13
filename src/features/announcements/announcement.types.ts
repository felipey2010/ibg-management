export const announcementStatuses = ["DRAFT", "PUBLISHED", "ARCHIVED"] as const;
export type AnnouncementStatus = (typeof announcementStatuses)[number];
export const announcementAudiences = [
  "ALL_MEMBERS",
  "VISITORS",
  "CHURCH_LEADERS",
  "MINISTRY",
  "ALL_USERS",
] as const;
export type AnnouncementAudience = (typeof announcementAudiences)[number];
export interface AnnouncementDestination {
  id: string;
  type: AnnouncementAudience;
  ministry_id: string | null;
  ministries: { id: string; name: string } | null;
}
export interface Announcement {
  id: string;
  title: string;
  content: string;
  status: AnnouncementStatus;
  published_at: string | null;
  starts_at: string | null;
  ends_at: string | null;
  created_at: string;
  updated_at: string;
  announcement_destinations: AnnouncementDestination[];
}
export interface AnnouncementPage {
  data: Announcement[];
  pagination: { page: number; limit: number; total: number };
}
export const announcementStatusLabels: Record<AnnouncementStatus, string> = {
  DRAFT: "Rascunho",
  PUBLISHED: "Publicado",
  ARCHIVED: "Arquivado",
};
export const announcementAudienceLabels: Record<AnnouncementAudience, string> = {
  ALL_MEMBERS: "Todos os membros",
  VISITORS: "Visitantes",
  CHURCH_LEADERS: "Liderança da igreja",
  MINISTRY: "Ministério específico",
  ALL_USERS: "Todos os usuários",
};
