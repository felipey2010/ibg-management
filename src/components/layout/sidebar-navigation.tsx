import Link from "next/link";

import { navigationGroups } from "@/config/navigation";
import { cn } from "@/lib/utils";

export function SidebarNavigation({ onNavigate }: Readonly<{ onNavigate?: () => void }>) {
  return (
    <nav aria-label="Navegação principal" className="flex flex-col gap-6">
      {navigationGroups.map((group) => (
        <section key={group.label} aria-labelledby={`nav-${group.label}`}>
          <h2
            id={`nav-${group.label}`}
            className="text-tertiary mb-2 px-1 text-[0.68rem] font-medium tracking-[0.11em] uppercase"
          >
            {group.label}
          </h2>
          <ul className="flex flex-col gap-1">
            {group.items.map((item) => {
              const Icon = item.icon;
              const isActive = item.href === "/dashboard";

              return (
                <li key={item.href}>
                  <Link
                    href={item.available ? item.href : "/dashboard"}
                    onClick={onNavigate}
                    aria-current={isActive ? "page" : undefined}
                    aria-disabled={!item.available}
                    title={!item.available ? `${item.label} — disponível em breve` : undefined}
                    className={cn(
                      "flex min-h-10 items-center gap-3 rounded-md px-3 text-sm transition-colors",
                      isActive
                        ? "bg-sidebar-accent text-sidebar-accent-foreground font-medium"
                        : "text-muted-foreground hover:bg-sidebar-accent/60 hover:text-sidebar-foreground",
                      !item.available && "cursor-not-allowed opacity-80",
                    )}
                  >
                    <Icon aria-hidden="true" className="size-4 shrink-0" />
                    <span className="min-w-0 flex-1 truncate">{item.label}</span>
                    {"badge" in item ? (
                      <span className="bg-warning/15 text-warning rounded-full px-2 py-0.5 text-[0.68rem] font-semibold">
                        {item.badge}
                      </span>
                    ) : null}
                  </Link>
                </li>
              );
            })}
          </ul>
        </section>
      ))}
    </nav>
  );
}
