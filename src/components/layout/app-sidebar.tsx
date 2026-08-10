import { Brand } from "@/components/layout/brand";
import { SidebarNavigation } from "@/components/layout/sidebar-navigation";
import { LogoutButton } from "@/features/auth/components/logout-button";

export function AppSidebar() {
  return (
    <aside className="border-sidebar-border bg-sidebar fixed inset-y-0 left-0 z-30 hidden w-64 flex-col border-r lg:flex">
      <div className="border-sidebar-border flex h-16 items-center border-b px-4">
        <Brand />
      </div>
      <div className="flex-1 overflow-y-auto px-4 py-6">
        <SidebarNavigation />
      </div>
      <div className="border-sidebar-border flex items-center gap-3 border-t px-4 py-4">
        <span className="border-border bg-surface-elevated flex size-8 items-center justify-center rounded-full border text-xs font-semibold">
          DF
        </span>
        <span className="min-w-0 flex-1">
          <span className="block truncate text-xs font-semibold">Philip Akpanyi</span>
          <span className="text-muted-foreground block truncate text-[0.68rem]">Administrador</span>
        </span>
        <LogoutButton />
      </div>
    </aside>
  );
}
