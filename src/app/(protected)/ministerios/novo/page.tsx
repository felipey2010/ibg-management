import type { Metadata } from "next";
import { MinistryForm } from "@/features/ministries/components/ministry-form";
import { requireMinistryPermission } from "@/features/ministries/services/ministry.service";
export const metadata: Metadata = { title: "Criar ministério" };
export default async function NewMinistryPage() {
  await requireMinistryPermission("ministries.create");
  return (
    <div className="mx-auto w-full max-w-4xl">
      <header className="mb-7">
        <h1 className="font-serif text-2xl font-semibold">Criar ministério</h1>
        <p className="text-muted-foreground mt-2 text-sm">
          Defina a identidade e a situação desta área de serviço.
        </p>
      </header>
      <MinistryForm />
    </div>
  );
}
