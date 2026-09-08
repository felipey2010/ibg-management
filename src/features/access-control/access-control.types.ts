export interface Permission {
  id: string;
  code: string;
  description: string | null;
}

export interface Role {
  id: string;
  name: string;
  code: string;
  description: string | null;
  is_system_role: boolean;
  role_permissions: { permissions: Permission }[];
  _count: { user_roles: number };
}
