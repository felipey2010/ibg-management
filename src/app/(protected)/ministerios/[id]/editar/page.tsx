import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { PageLoadError } from "@/components/shared/page-load-error";
import { MinistryForm } from "@/features/ministries/components/ministry-form";
import { getMinistry, requireMinistryPermission } from "@/features/ministries/services/ministry.service";
export const metadata: Metadata = { title: "Editar ministério" };
export default async function EditMinistryPage({ params }: Readonly<{ params: Promise<{ id: string }> }>) {
  await requireMinistryPermission("ministries.update");
  const { id } = await params;
  const result = await getMinistry(id, "ministries.update");
  if (!result.ok && result.status === 404) notFound();
  return (
    <div className="mx-auto w-full max-w-4xl">
      <header className="mb-7">
        <h1 className="font-serif text-2xl font-semibold">Editar ministério</h1>
        <p className="text-muted-foreground mt-2 text-sm">
          Atualize as informações e a situação do ministério.
        </p>
      </header>
      {result.ok ? <MinistryForm ministry={result.data} /> : <PageLoadError message={result.message} />}
    </div>
  );
}
