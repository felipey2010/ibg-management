import { DashboardSection } from "@/features/dashboard/components/dashboard-section";
import { upcomingEvents } from "@/features/dashboard/data/dashboard.mock";
import { cn } from "@/lib/utils";

export function UpcomingEvents() {
  return (
    <DashboardSection title="Próximos eventos" description="Próximos 7 dias" linkLabel="Ver calendário">
      <ul className="divide-y">
        {upcomingEvents.map((event) => (
          <li key={event.id} className="flex items-center gap-3 py-3">
            <time
              className={cn(
                "bg-surface-elevated flex size-10 shrink-0 flex-col items-center justify-center rounded-lg",
                event.isToday && "bg-primary/15 text-primary",
              )}
            >
              <span className="text-sm leading-none font-semibold">{event.day}</span>
              <span className="mt-1 text-[0.55rem] leading-none uppercase">{event.weekday}</span>
            </time>
            <span className="min-w-0 flex-1">
              <span className="block truncate text-sm font-semibold">{event.title}</span>
              <span className="text-muted-foreground mt-0.5 block truncate text-xs">{event.location}</span>
            </span>
            <time className="text-info text-xs font-medium">{event.time}</time>
          </li>
        ))}
      </ul>
    </DashboardSection>
  );
}
