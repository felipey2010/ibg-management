"use client";

import { useState } from "react";

import { Button } from "@/components/ui/button";
import { loginWithProvider } from "@/features/auth/services/auth-client.service";
import type { OAuthProvider } from "@/features/auth/types/auth.types";
import { FaApple } from "react-icons/fa6";
import { FcGoogle } from "react-icons/fc";

export function SocialAuthButtons({ action = "Entrar" }: Readonly<{ action?: "Entrar" | "Cadastrar" }>) {
  const [pendingProvider, setPendingProvider] = useState<OAuthProvider>();
  const [message, setMessage] = useState<string>();

  async function authenticate(provider: OAuthProvider) {
    setPendingProvider(provider);
    setMessage(undefined);

    try {
      const result = await loginWithProvider(provider);
      if (!result.success) setMessage(result.message);
    } catch {
      setMessage("Não foi possível iniciar a autenticação com este provedor.");
    } finally {
      setPendingProvider(undefined);
    }
  }

  return (
    <div className="grid gap-3">
      <Button
        type="button"
        variant="outline"
        size="lg"
        onClick={() => authenticate("google")}
        disabled={Boolean(pendingProvider)}
      >
        <FcGoogle aria-hidden="true" size={16} />
        {pendingProvider === "google" ? "Redirecionando…" : `${action} com Google`}
      </Button>
      <Button type="button" variant="outline" size="lg" onClick={() => authenticate("apple")} disabled>
        <FaApple aria-hidden="true" size={16} />
        {pendingProvider === "apple" ? "Redirecionando…" : `${action} com Apple`}
      </Button>
      {message ? (
        <p role="alert" className="text-destructive text-center text-xs">
          {message}
        </p>
      ) : null}
    </div>
  );
}
