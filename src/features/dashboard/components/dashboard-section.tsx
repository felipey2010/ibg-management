import Link from "next/link";

import { cn } from "@/lib/utils";

interface DashboardSectionProps {
  title: string;
  description: string;
  linkLabel: string;
  children: React.ReactNode;
  className?: string;
}

export function DashboardSection({
  title,
  description,
  linkLabel,
  children,
  className,
}: Readonly<DashboardSectionProps>) {
  return (
    <section className={cn("bg-card rounded-xl border px-5 py-5 sm:px-6", className)}>
      <header className="flex items-start justify-between gap-4 border-b pb-4">
        <div>
          <h2 className="text-sm font-semibold">{title}</h2>
          <p className="text-muted-foreground mt-1 text-xs">{description}</p>
        </div>
        <Link href="/" className="text-info shrink-0 text-xs font-medium hover:underline">
          {linkLabel}
        </Link>
      </header>
      {children}
    </section>
  );
}
