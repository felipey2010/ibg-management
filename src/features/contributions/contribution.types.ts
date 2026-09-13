export const contributionTypes = ["FINANCIAL", "ITEM"] as const;
export const contributionStatuses = ["DRAFT", "ACTIVE", "CLOSED", "ARCHIVED"] as const;
export const paymentMethods = ["CASH", "PIX", "BANK_TRANSFER", "CARD", "OTHER"] as const;

export type ContributionType = (typeof contributionTypes)[number];
export type ContributionStatus = (typeof contributionStatuses)[number];
export type PaymentMethod = (typeof paymentMethods)[number];

export interface FinancialContribution {
  id: string;
  amount: string | number;
  contributed_at: string;
  payment_method: PaymentMethod | null;
  reference: string | null;
  members: { id: string; first_name: string; last_name: string } | null;
}

export interface ItemCommitment {
  id: string;
  quantity: string | number;
  status: "PENDING" | "APPROVED" | "CANCELED" | "FULFILLED";
  members: { id: string; first_name: string; last_name: string };
}

export interface RequiredContributionItem {
  id: string;
  name: string;
  description: string | null;
  required_quantity: string | number;
  maximum_contributors: number | null;
  unit: string;
  item_commitments: ItemCommitment[];
}

export interface ContributionCampaign {
  id: string;
  title: string;
  description: string | null;
  type: ContributionType;
  status: ContributionStatus;
  event_id: string | null;
  starts_at: string | null;
  ends_at: string | null;
  financial_target: string | number | null;
  closed_at: string | null;
  created_at: string;
  updated_at: string;
  events: { id: string; title: string } | null;
  financial_contributions: FinancialContribution[];
  required_contribution_items: RequiredContributionItem[];
}

export interface ContributionPage {
  data: ContributionCampaign[];
  pagination: { page: number; limit: number; total: number };
}

export const contributionTypeLabels: Record<ContributionType, string> = {
  FINANCIAL: "Financeira",
  ITEM: "Itens",
};

export const contributionStatusLabels: Record<ContributionStatus, string> = {
  DRAFT: "Rascunho",
  ACTIVE: "Ativa",
  CLOSED: "Encerrada",
  ARCHIVED: "Arquivada",
};

export const paymentMethodLabels: Record<PaymentMethod, string> = {
  CASH: "Dinheiro",
  PIX: "Pix",
  BANK_TRANSFER: "Transferência",
  CARD: "Cartão",
  OTHER: "Outro",
};
