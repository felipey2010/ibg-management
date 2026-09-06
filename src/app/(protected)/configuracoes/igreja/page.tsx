import type { Metadata } from "next";
import { ChurchSettingsForm } from "@/features/church/components/church-settings-form";

export const metadata: Metadata = { title: "Configurações da igreja" };

export default function ChurchSettingsPage() {
  return (
    <div className="max-w-294 px-4">
      <header className="mb-8">
        <h1 className="font-serif text-2xl font-semibold tracking-tight">Configurações da igreja</h1>
        <p className="text-muted-foreground mt-2 text-sm">Defina os dados e as preferências da sua igreja.</p>
      </header>
      <ChurchSettingsForm />
    </div>
  );
}
