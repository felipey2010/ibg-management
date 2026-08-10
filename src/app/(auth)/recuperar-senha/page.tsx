import type { Metadata } from "next";

import { AuthShell } from "@/features/auth/components/auth-shell";
import { PasswordRecoveryForm } from "@/features/auth/components/password-recovery-form";

export const metadata: Metadata = { title: "Recuperar senha" };

export default function PasswordRecoveryPage() {
  return (
    <AuthShell title="Recuperar senha">
      <PasswordRecoveryForm />
    </AuthShell>
  );
}
