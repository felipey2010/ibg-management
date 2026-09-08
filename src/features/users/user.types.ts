import type { AccountStatus } from "@/lib/auth/auth.types";

export interface AdminUser {
  id: string;
  fullName: string;
  email: string;
  status: AccountStatus;
  createdAt: string;
  updatedAt: string;
  lastLoginAt: string | null;
  roles: { id: string; name: string; code: string }[];
}

export interface UserPage {
  data: AdminUser[];
  pagination: { page: number; limit: number; total: number };
}
