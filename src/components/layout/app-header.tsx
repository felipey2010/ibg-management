import { Bell, Search } from "lucide-react";

import { ThemeToggle } from "@/components/layout/theme-toggle";
import { SidebarTrigger } from "@/components/ui/sidebar";

export function AppHeader() {
  return (
    <header className="border-border bg-background/95 sticky top-0 z-20 flex h-16 items-center gap-3 border-b px-4 backdrop-blur sm:px-6 lg:px-8">
      <SidebarTrigger aria-label="Alternar menu principal" />
      <span className="text-sm font-semibold">Painel</span>
      <div className="ml-auto flex items-center gap-2">
        <label className="border-border bg-card text-muted-foreground ml-2 hidden h-9 w-full max-w-72 items-center gap-2 rounded-md border px-3 sm:flex">
          <Search aria-hidden="true" className="size-4" />
          <span className="sr-only">Pesquisar</span>
          <input
            id="app-header-search-input"
            type="search"
            placeholder="Buscar membros, eventos, documentos"
            className="text-foreground placeholder:text-tertiary min-w-0 flex-1 bg-transparent text-xs outline-none"
          />
        </label>
        <ThemeToggle />
        <button
          type="button"
          aria-label="Notificações, uma nova"
          className="text-muted-foreground hover:bg-muted hover:text-foreground relative flex size-9 items-center justify-center rounded-md"
        >
          <Bell aria-hidden="true" className="size-4" />
          <span className="bg-warning ring-background absolute top-2 right-2 size-1.5 rounded-full ring-2" />
        </button>
      </div>
    </header>
  );
}
