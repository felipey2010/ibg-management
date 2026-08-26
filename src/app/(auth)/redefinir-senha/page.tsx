import type { Metadata } from "next";

import { AuthShell } from "@/features/auth/components/auth-shell";
import { PasswordResetFlow } from "@/features/auth/components/password-reset-flow";

export const metadata: Metadata = { title: "Redefinir senha" };

interface PasswordResetPageProps {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}

export default async function PasswordResetPage({ searchParams }: PasswordResetPageProps) {
  const params = await searchParams;
  const email = typeof params.email === "string" ? params.email : undefined;
  const code = typeof params.code === "string" ? params.code : undefined;
  return (
    <AuthShell title="Redefinir senha">
      <PasswordResetFlow email={email} code={code} />
    </AuthShell>
  );
}
