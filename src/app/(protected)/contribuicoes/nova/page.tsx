import type { Metadata } from "next";
import { ContributionForm } from "@/features/contributions/components/contribution-form";
import { requireContributionPermission } from "@/features/contributions/services/contribution.service";

export const metadata: Metadata = { title: "Criar campanha" };

export default async function NewContributionPage() {
  await requireContributionPermission("contributions.create");

  return (
    <div className="mx-auto w-full max-w-4xl">
      <header className="mb-7">
        <h1 className="font-serif text-2xl font-semibold">Criar campanha</h1>
        <p className="text-muted-foreground mt-2 text-sm">
          Configure uma campanha financeira ou uma arrecadação de itens.
        </p>
      </header>
      <ContributionForm />
    </div>
  );
}
