import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { PageLoadError } from "@/components/shared/page-load-error";
import { ContributionForm } from "@/features/contributions/components/contribution-form";
import {
  getContribution,
  requireContributionPermission,
} from "@/features/contributions/services/contribution.service";

export const metadata: Metadata = { title: "Editar campanha" };

export default async function EditContributionPage({
  params,
}: Readonly<{ params: Promise<{ id: string }> }>) {
  await requireContributionPermission("contributions.update");
  const { id } = await params;
  const result = await getContribution(id, "contributions.update");

  if (!result.ok && result.status === 404) notFound();

  return (
    <div className="mx-auto w-full max-w-4xl">
      <header className="mb-7">
        <h1 className="font-serif text-2xl font-semibold">Editar campanha</h1>
        <p className="text-muted-foreground mt-2 text-sm">
          Atualize os dados, o período e o status da campanha.
        </p>
      </header>
      {result.ok ? <ContributionForm campaign={result.data} /> : <PageLoadError message={result.message} />}
    </div>
  );
}
