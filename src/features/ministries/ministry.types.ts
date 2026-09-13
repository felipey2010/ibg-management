export const ministryStatuses = ["ACTIVE", "INACTIVE"] as const;
export type MinistryStatus = (typeof ministryStatuses)[number];
export type MinistryMemberRole = "LEADER" | "MEMBER";

export interface MinistryMember {
  id: string;
  member_id: string;
  role: MinistryMemberRole;
  joined_at: string;
  members: { id: string; first_name: string; last_name: string; email: string | null; phone: string | null };
}
export interface Ministry {
  id: string;
  name: string;
  description: string | null;
  status: MinistryStatus;
  created_at: string;
  updated_at: string;
  _count: { ministry_members: number };
  ministry_members?: MinistryMember[];
}
export interface MinistryPage {
  data: Ministry[];
  pagination: { page: number; limit: number; total: number };
}
export const ministryStatusLabels: Record<MinistryStatus, string> = { ACTIVE: "Ativo", INACTIVE: "Inativo" };
export const ministryRoleLabels: Record<MinistryMemberRole, string> = {
  LEADER: "Liderança",
  MEMBER: "Membro",
};
