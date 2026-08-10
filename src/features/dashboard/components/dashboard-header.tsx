import { Plus } from "lucide-react";

import { Button } from "@/components/ui/button";
import { formatLongDate } from "@/lib/utils/format-date";

export function DashboardHeader() {
  const referenceDate = new Date(2026, 7, 8);

  return (
    <header className="mb-6 flex flex-col justify-between gap-5 sm:flex-row sm:items-center">
      <div>
        <h1 className="font-serif text-2xl font-semibold tracking-tight sm:text-[1.7rem]">Bom dia, Philip</h1>
        <p className="text-muted-foreground mt-1.5 text-sm">{formatLongDate(referenceDate)}</p>
        <span className="from-warning mt-3 block h-0.5 w-12 bg-linear-to-r to-transparent" />
      </div>
      <Button className="w-fit gap-2 px-4" size="lg">
        <Plus aria-hidden="true" className="size-4" />
        Novo aviso
      </Button>
    </header>
  );
}
