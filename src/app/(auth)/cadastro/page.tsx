import type { Metadata } from "next";

import { AuthShell } from "@/features/auth/components/auth-shell";
import { RegistrationForm } from "@/features/auth/components/registration-form";

export const metadata: Metadata = { title: "Cadastro" };

export default function RegistrationPage() {
  return (
    <AuthShell title="Cadastre-se">
      <RegistrationForm />
    </AuthShell>
  );
}
