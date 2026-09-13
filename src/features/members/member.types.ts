export const memberStatuses = ["ACTIVE", "INACTIVE", "TRANSFERRED", "REMOVED"] as const;
export type MemberStatus = (typeof memberStatuses)[number];

export interface Member {
  id: string;
  user_id: string | null;
  first_name: string;
  last_name: string;
  birth_date: string | null;
  email: string | null;
  phone: string | null;
  address_line: string | null;
  city: string | null;
  state: string | null;
  postal_code: string | null;
  membership_status: MemberStatus;
  membership_date: string | null;
  notes: string | null;
  created_at: string;
  updated_at: string;
}
export interface MemberPage {
  data: Member[];
  pagination: { page: number; limit: number; total: number };
}
export const memberStatusLabels: Record<MemberStatus, string> = {
  ACTIVE: "Ativo",
  INACTIVE: "Inativo",
  TRANSFERRED: "Transferido",
  REMOVED: "Removido",
};
