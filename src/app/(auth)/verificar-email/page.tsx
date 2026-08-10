import type { Metadata } from "next";

import { AuthShell } from "@/features/auth/components/auth-shell";
import { VerificationCodeForm } from "@/features/auth/components/verification-code-form";

export const metadata: Metadata = { title: "Verificar e-mail" };

interface VerifyEmailPageProps {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}

export default async function VerifyEmailPage({ searchParams }: VerifyEmailPageProps) {
  const params = await searchParams;
  const email = typeof params.email === "string" ? params.email : "seu e-mail";
  return (
    <AuthShell title="Verificar e-mail" backHref="/cadastro">
      <VerificationCodeForm email={email} />
    </AuthShell>
  );
}
