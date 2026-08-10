export type MetricTone = "success" | "warning" | "neutral";

export interface DashboardMetric {
  label: string;
  value: string;
  detail: string;
  tone: MetricTone;
}

export type AttentionKind = "approval" | "inventory" | "campaign" | "document";

export interface AttentionItem {
  id: string;
  kind: AttentionKind;
  title: string;
  detail: string;
  action: string;
}

export interface UpcomingEvent {
  id: string;
  day: string;
  weekday: string;
  title: string;
  location: string;
  time: string;
  isToday?: boolean;
}

export interface RecentActivity {
  id: string;
  description: string;
  timeAgo: string;
  highlighted?: boolean;
}

export interface ContributionCampaign {
  id: string;
  title: string;
  type: "Financeira" | "Itens";
  summary: string;
  progress: number;
  footerStart: string;
  footerEnd: string;
  tone: "brand" | "success";
}
