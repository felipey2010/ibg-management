import { dashboardMetrics } from "@/features/dashboard/data/dashboard.mock";
import { cn } from "@/lib/utils";

const detailTone = {
  success: "text-success",
  warning: "text-warning",
  neutral: "text-muted-foreground",
} as const;

export function DashboardMetrics() {
  return (
    <section
      aria-label="Resumo administrativo"
      className="bg-card mb-6 grid overflow-hidden rounded-xl border sm:grid-cols-2 xl:grid-cols-4"
    >
      {dashboardMetrics.map((metric, index) => (
        <article
          key={metric.label}
          className={cn(
            "px-6 py-5",
            index > 0 && "border-t sm:border-t-0 sm:border-l",
            index === 2 && "sm:border-t xl:border-t-0",
          )}
        >
          <h2 className="text-tertiary text-[0.68rem] font-medium tracking-[0.06em] uppercase">
            {metric.label}
          </h2>
          <div className="mt-3 flex items-baseline gap-2">
            <strong className="text-2xl font-semibold tracking-tight">{metric.value}</strong>
            <span className={cn("text-xs", detailTone[metric.tone])}>{metric.detail}</span>
          </div>
        </article>
      ))}
    </section>
  );
}
