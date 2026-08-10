export const accountStatuses = ["PENDING_APPROVAL", "ACTIVE", "REJECTED", "SUSPENDED", "INACTIVE"] as const;

export type AccountStatus = (typeof accountStatuses)[number];

export interface AuthenticatedUser {
  id: string;
  name: string;
  email: string;
  status: AccountStatus;
  permissions: string[];
}
