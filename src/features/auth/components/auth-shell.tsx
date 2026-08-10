import Link from "next/link";
import { ArrowLeft } from "lucide-react";

import { Brand } from "@/components/layout/brand";
import { ModuleShowcase } from "@/features/auth/components/module-showcase";
import { cn } from "@/lib/utils";

interface AuthShellProps {
  children: React.ReactNode;
  title?: string;
  backHref?: string;
  showcase?: boolean;
}

export function AuthShell({
  children,
  title,
  backHref = "/login",
  showcase = false,
}: Readonly<AuthShellProps>) {
  return (
    <main className={cn("bg-background min-h-dvh", showcase && "lg:grid lg:grid-cols-[1.05fr_0.95fr]")}>
      {showcase ? <ModuleShowcase /> : null}
      <section className="relative flex min-h-dvh flex-col px-5 py-5 sm:px-8">
        <header className="flex h-11 items-center justify-between">
          {title ? (
            <>
              <Link
                href={backHref}
                aria-label="Voltar"
                className="text-muted-foreground hover:bg-muted hover:text-foreground flex size-9 items-center justify-center rounded-md"
              >
                <ArrowLeft aria-hidden="true" className="size-5" />
              </Link>
              <span className="text-sm font-semibold">{title}</span>
              <span className="size-9" aria-hidden="true" />
            </>
          ) : (
            <div className="lg:hidden">
              <Brand />
            </div>
          )}
        </header>
        <div className="flex flex-1 items-center justify-center py-8">{children}</div>
      </section>
    </main>
  );
}
