import type { Metadata } from "next";

import { AuthShell } from "@/features/auth/components/auth-shell";
import { LoginForm } from "@/features/auth/components/login-form";
import { getSession } from "@/lib/auth/session";
import { redirect } from "next/navigation";

export const metadata: Metadata = { title: "Entrar" };

interface LoginPageProps {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}

export default async function LoginPage({ searchParams }: LoginPageProps) {
  const [session, params] = await Promise.all([getSession(), searchParams]);
  if (session?.user.status === "ACTIVE") redirect("/");

  const redirectTo = typeof params.redirectTo === "string" ? params.redirectTo : undefined;
  const oauthError = typeof params.error === "string" ? params.error : undefined;

  return (
    <AuthShell showcase>
      <LoginForm redirectTo={redirectTo} oauthError={oauthError} />
    </AuthShell>
  );
}
