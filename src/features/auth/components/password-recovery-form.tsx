"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Mail, Send } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { useForm } from "react-hook-form";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { AuthCard } from "@/features/auth/components/auth-card";
import { FormField } from "@/features/auth/components/form-field";
import {
  passwordRecoverySchema,
  type PasswordRecoveryInput,
} from "@/features/auth/schemas/verification.schema";
import { requestPasswordRecovery } from "@/features/auth/services/auth-client.service";

export function PasswordRecoveryForm() {
  const [wasSubmitted, setWasSubmitted] = useState(false);
  const [submittedEmail, setSubmittedEmail] = useState("");
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<PasswordRecoveryInput>({
    resolver: zodResolver(passwordRecoverySchema),
    defaultValues: { email: "" },
  });

  async function onSubmit(input: PasswordRecoveryInput) {
    setSubmittedEmail(input.email.trim().toLowerCase());
    try {
      await requestPasswordRecovery(input.email);
    } catch {
      // Deliberately ignore the result to prevent account enumeration.
    } finally {
      // The response is intentionally identical to prevent account enumeration.
      setWasSubmitted(true);
    }
  }

  if (wasSubmitted) {
    return (
      <AuthCard
        title="Verifique seu e-mail"
        description="Se existir uma conta associada a este e-mail, enviaremos as instruções para redefinir sua senha."
        icon={<Send aria-hidden="true" className="size-5" />}
      >
        <div className="flex flex-col gap-4">
          <span className="bg-card text-muted-foreground rounded-xl border p-5 text-sm leading-6">
            Verifique também as pastas de spam e lixo eletrônico. O código será válido por 15 minutos.
          </span>
          <Button
            nativeButton={false}
            render={<Link href={`/redefinir-senha?email=${encodeURIComponent(submittedEmail)}`} />}
            size="lg"
            className="h-11 w-full"
          >
            Informar código de verificação
          </Button>
          <Button
            nativeButton={false}
            render={<Link href="/login" />}
            variant="outline"
            size="lg"
            className="h-11 w-full"
          >
            Voltar para o login
          </Button>
        </div>
      </AuthCard>
    );
  }

  return (
    <AuthCard
      title="Recuperar senha"
      description="Informe seu e-mail para receber as instruções de redefinição."
      icon={<Mail aria-hidden="true" className="size-5" />}
    >
      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-5" noValidate>
        <FormField id="recovery-email" label="E-mail" error={errors.email?.message}>
          <Input
            id="recovery-email"
            type="email"
            autoComplete="email"
            placeholder="voce@exemplo.com"
            className="h-11"
            aria-invalid={Boolean(errors.email)}
            {...register("email")}
          />
        </FormField>
        <Button type="submit" size="lg" className="h-11 w-full" disabled={isSubmitting}>
          {isSubmitting ? "Enviando…" : "Enviar instruções"}
        </Button>
      </form>
    </AuthCard>
  );
}
