import type { Metadata } from "next";

import { AttentionList } from "@/features/dashboard/components/attention-list";
import { ContributionCampaigns } from "@/features/dashboard/components/contribution-campaigns";
import { DashboardHeader } from "@/features/dashboard/components/dashboard-header";
import { DashboardMetrics } from "@/features/dashboard/components/dashboard-metrics";
import { RecentActivityList } from "@/features/dashboard/components/recent-activity";
import { UpcomingEvents } from "@/features/dashboard/components/upcoming-events";

export const metadata: Metadata = { title: "Painel" };

export default function DashboardPage() {
  return (
    <div className="mx-auto max-w-294">
      <DashboardHeader />
      <DashboardMetrics />
      <div className="grid items-start gap-5 xl:grid-cols-[1.35fr_1fr]">
        <AttentionList />
        <UpcomingEvents />
        <RecentActivityList />
        <ContributionCampaigns />
      </div>
    </div>
  );
}
