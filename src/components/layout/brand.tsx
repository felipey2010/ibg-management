import { siteConfig } from "@/config/site";
import Image from "next/image";

export function Brand({
  compact = false,
  name = siteConfig.name,
}: Readonly<{ compact?: boolean; name?: string }>) {
  return (
    <div className="flex min-w-0 items-center gap-3">
      <span className="bg-primary/15 text-primary flex size-9 shrink-0 items-center justify-center rounded-lg">
        <Image
          src="/assets/images/logo.png"
          alt={name}
          width={20}
          height={20}
          aria-hidden="true"
          className="size-5"
        />
      </span>
      {!compact ? (
        <span className="min-w-0">
          <span className="text-foreground block truncate text-sm font-semibold">{name}</span>
          <span className="text-muted-foreground block truncate text-xs">{siteConfig.description}</span>
        </span>
      ) : null}
    </div>
  );
}
