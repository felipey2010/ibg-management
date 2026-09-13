import type { Metadata } from "next";
import Link from "next/link";
import { Plus } from "lucide-react";
import { buttonVariants } from "@/components/ui/button";
import { PageLoadError } from "@/components/shared/page-load-error";
import { MinistryDirectory } from "@/features/ministries/components/ministry-directory";
import { ministryQuerySchema } from "@/features/ministries/ministry.schema";
import { getMinistries, requireMinistryPermission } from "@/features/ministries/services/ministry.service";
import { hasPermission } from "@/lib/permissions/permissions";
export const metadata: Metadata = { title: "Ministérios" };
export default async function MinistriesPage({
  searchParams,
}: Readonly<{ searchParams: Promise<Record<string, string | string[] | undefined>> }>) {
  const session = await requireMinistryPermission("ministries.read");
  const query = ministryQuerySchema.parse(await searchParams);
  const result = await getMinistries(query);
  return (
    <div className="mx-auto w-full max-w-7xl px-1 sm:px-2">
      <header className="mb-7 flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
        <div>
          <h1 className="font-serif text-2xl font-semibold sm:text-3xl">Ministérios</h1>
          <p className="text-muted-foreground mt-2 text-sm">
            Organize equipes, lideranças e áreas de serviço da igreja.
          </p>
        </div>
        {hasPermission(session.user, "ministries.create") ? (
          <Link href="/ministerios/novo" className={buttonVariants()}>
            <Plus />
            Criar ministério
          </Link>
        ) : null}
      </header>
      {result.ok ? (
        <MinistryDirectory page={result.data} query={query} />
      ) : (
        <PageLoadError message={result.message} />
      )}
    </div>
  );
}
