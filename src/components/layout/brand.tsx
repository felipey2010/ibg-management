import { Church } from "lucide-react";

import { siteConfig } from "@/config/site";

export function Brand({ compact = false }: Readonly<{ compact?: boolean }>) {
  return (
    <div className="flex min-w-0 items-center gap-3">
      <span className="bg-primary/15 text-primary flex size-9 shrink-0 items-center justify-center rounded-lg">
        <Church aria-hidden="true" className="size-5" />
      </span>
      {!compact ? (
        <span className="min-w-0">
          <span className="text-foreground block truncate text-sm font-semibold">{siteConfig.name}</span>
          <span className="text-muted-foreground block truncate text-xs">{siteConfig.description}</span>
        </span>
      ) : null}
    </div>
  );
}
