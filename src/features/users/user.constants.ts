import type { AccountStatus } from "@/lib/auth/auth.types";

export const userStatusLabels: Record<AccountStatus, string> = {
  PENDING_APPROVAL: "Aguardando aprovação",
  ACTIVE: "Ativo",
  REJECTED: "Rejeitado",
  SUSPENDED: "Suspenso",
  INACTIVE: "Inativo",
};
