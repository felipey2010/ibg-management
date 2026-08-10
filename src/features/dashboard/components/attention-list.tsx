import { Box, CircleCheck, CircleDollarSign, FileText } from "lucide-react";

import { DashboardSection } from "@/features/dashboard/components/dashboard-section";
import { attentionItems } from "@/features/dashboard/data/dashboard.mock";
import type { AttentionKind } from "@/features/dashboard/types/dashboard.types";
import { cn } from "@/lib/utils";

const iconByKind = {
  approval: CircleCheck,
  inventory: Box,
  campaign: CircleDollarSign,
  document: FileText,
} satisfies Record<AttentionKind, typeof CircleCheck>;

const toneByKind = {
  approval: "bg-warning/15 text-warning",
  inventory: "bg-destructive/15 text-destructive",
  campaign: "bg-warning/15 text-warning",
  document: "bg-info/15 text-info",
} satisfies Record<AttentionKind, string>;

export function AttentionList() {
  return (
    <DashboardSection
      title="Precisa de atenção"
      description="O que requer uma decisão sua hoje"
      linkLabel="Ver tudo"
    >
      <ul className="divide-y">
        {attentionItems.map((item) => {
          const Icon = iconByKind[item.kind];
          return (
            <li key={item.id} className="flex items-center gap-3 py-4">
              <span
                className={cn(
                  "flex size-8 shrink-0 items-center justify-center rounded-lg",
                  toneByKind[item.kind],
                )}
              >
                <Icon aria-hidden="true" className="size-4" />
              </span>
              <span className="min-w-0 flex-1">
                <span className="block truncate text-sm font-semibold">{item.title}</span>
                <span className="text-muted-foreground mt-0.5 block truncate text-xs">{item.detail}</span>
              </span>
              <button
                type="button"
                className="text-info hover:bg-muted hidden h-8 shrink-0 rounded-md border px-3 text-xs font-medium sm:block"
              >
                {item.action}
              </button>
            </li>
          );
        })}
      </ul>
    </DashboardSection>
  );
}
