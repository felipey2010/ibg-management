import type { Metadata } from "next";
import { Plus } from "lucide-react";
import Link from "next/link";
import { PageLoadError } from "@/components/shared/page-load-error";
import { buttonVariants } from "@/components/ui/button";
import { ContributionDirectory } from "@/features/contributions/components/contribution-directory";
import { contributionQuerySchema } from "@/features/contributions/contribution.schema";
import {
  getContributions,
  requireContributionPermission,
} from "@/features/contributions/services/contribution.service";
import { hasPermission } from "@/lib/permissions/permissions";

export const metadata: Metadata = { title: "Contribuições" };

export default async function ContributionsPage({
  searchParams,
}: Readonly<{ searchParams: Promise<Record<string, string | string[] | undefined>> }>) {
  const session = await requireContributionPermission("contributions.read");
  const query = contributionQuerySchema.parse(await searchParams);
  const result = await getContributions(query);

  return (
    <div className="mx-auto w-full max-w-7xl px-1 sm:px-2">
      <header className="mb-7 flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
        <div>
          <h1 className="font-serif text-2xl font-semibold sm:text-3xl">Contribuições</h1>
          <p className="text-muted-foreground mt-2 text-sm">
            Organize campanhas financeiras e arrecadações de itens.
          </p>
        </div>
        {hasPermission(session.user, "contributions.create") ? (
          <Link href="/contribuicoes/nova" className={buttonVariants()}>
            <Plus />
            Criar campanha
          </Link>
        ) : null}
      </header>
      {result.ok ? (
        <ContributionDirectory page={result.data} query={query} />
      ) : (
        <PageLoadError message={result.message} />
      )}
    </div>
  );
}
