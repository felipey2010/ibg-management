import { DashboardSection } from "@/features/dashboard/components/dashboard-section";
import { recentActivities } from "@/features/dashboard/data/dashboard.mock";
import { cn } from "@/lib/utils";

export function RecentActivityList() {
  return (
    <DashboardSection
      title="Atividade recente"
      description="Últimas ações administrativas"
      linkLabel="Ver histórico"
    >
      <ol className="divide-y">
        {recentActivities.map((activity) => (
          <li key={activity.id} className="relative py-3 pl-7">
            <span
              className={cn(
                "bg-tertiary absolute top-[1.15rem] left-1.5 size-1.5 rounded-full",
                activity.highlighted && "bg-primary",
              )}
            />
            <p className="text-muted-foreground text-xs leading-5">{activity.description}</p>
            <time className="text-tertiary mt-0.5 block text-[0.68rem]">{activity.timeAgo}</time>
          </li>
        ))}
      </ol>
    </DashboardSection>
  );
}
