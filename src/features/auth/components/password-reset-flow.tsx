"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { REGEXP_ONLY_DIGITS } from "input-otp";
import { BadgeCheck, CircleAlert, KeyRound, LockKeyhole } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { Controller, useForm } from "react-hook-form";

import { Button } from "@/components/ui/button";
import { InputOTP, InputOTPGroup, InputOTPSlot } from "@/components/ui/input-otp";
import { AuthCard } from "@/features/auth/components/auth-card";
import { FormField } from "@/features/auth/components/form-field";
import { FormMessage } from "@/features/auth/components/form-message";
import { PasswordField } from "@/features/auth/components/password-field";
import { passwordResetSchema, type PasswordResetInput } from "@/features/auth/schemas/registration.schema";
import { verificationSchema, type VerificationInput } from "@/features/auth/schemas/verification.schema";
import { resetPassword, verifyPasswordResetCode } from "@/features/auth/services/auth-client.service";

type ResetStep = "code" | "password" | "success";

interface PasswordResetFlowProps {
  email?: string;
  code?: string;
}

export function PasswordResetFlow({ email, code }: Readonly<PasswordResetFlowProps>) {
  const normalizedEmail = email?.trim().toLowerCase();
  const initialCode = code && /^\d{6}$/.test(code) ? code : "";
  const [step, setStep] = useState<ResetStep>("code");
  const [resetToken, setResetToken] = useState("");
  const [message, setMessage] = useState<string>();
  const codeForm = useForm<VerificationInput>({
    resolver: zodResolver(verificationSchema),
    defaultValues: { code: initialCode },
  });
  const passwordForm = useForm<PasswordResetInput>({
    resolver: zodResolver(passwordResetSchema),
    defaultValues: { password: "", passwordConfirmation: "" },
  });

  async function submitCode(input: VerificationInput) {
    if (!normalizedEmail) return;
    setMessage(undefined);
    const result = await verifyPasswordResetCode({ email: normalizedEmail, code: input.code });
    if (!result.success || !result.data?.resetToken) {
      setMessage(result.message);
      return;
    }
    setResetToken(result.data.resetToken);
    setStep("password");
  }

  async function submitPassword(input: PasswordResetInput) {
    if (!normalizedEmail || !resetToken) return;
    setMessage(undefined);
    const result = await resetPassword({
      email: normalizedEmail,
      resetToken,
      newPassword: input.password,
    });
    if (!result.success) {
      setMessage(result.message);
      return;
    }
    setStep("success");
  }

  if (!normalizedEmail) {
    return (
      <AuthCard
        title="E-mail não informado"
        description="Solicite novamente a recuperação para continuar com segurança."
        icon={<CircleAlert aria-hidden="true" className="size-5" />}
      >
        <Button
          nativeButton={false}
          render={<Link href="/recuperar-senha" />}
          size="lg"
          className="h-11 w-full"
        >
          Solicitar recuperação
        </Button>
      </AuthCard>
    );
  }

  if (step === "success") {
    return (
      <AuthCard
        title="Senha redefinida"
        description="Sua senha foi alterada e as sessões anteriores foram encerradas."
        icon={<BadgeCheck aria-hidden="true" className="size-5" />}
      >
        <Button nativeButton={false} render={<Link href="/login" />} size="lg" className="h-11 w-full">
          Entrar com a nova senha
        </Button>
      </AuthCard>
    );
  }

  if (step === "password") {
    return (
      <AuthCard
        title="Crie uma nova senha"
        description="O código foi confirmado. Defina sua nova senha para concluir."
        icon={<LockKeyhole aria-hidden="true" className="size-5" />}
      >
        <form onSubmit={passwordForm.handleSubmit(submitPassword)} className="flex flex-col gap-4" noValidate>
          <FormMessage>{message}</FormMessage>
          <FormField
            id="new-password"
            label="Nova senha"
            error={passwordForm.formState.errors.password?.message}
          >
            <PasswordField
              id="new-password"
              autoComplete="new-password"
              invalid={Boolean(passwordForm.formState.errors.password)}
              {...passwordForm.register("password")}
            />
          </FormField>
          <FormField
            id="new-password-confirmation"
            label="Confirmar nova senha"
            error={passwordForm.formState.errors.passwordConfirmation?.message}
          >
            <PasswordField
              id="new-password-confirmation"
              autoComplete="new-password"
              invalid={Boolean(passwordForm.formState.errors.passwordConfirmation)}
              {...passwordForm.register("passwordConfirmation")}
            />
          </FormField>
          <Button
            type="submit"
            size="lg"
            className="h-11 w-full"
            disabled={passwordForm.formState.isSubmitting}
          >
            {passwordForm.formState.isSubmitting ? "Redefinindo…" : "Redefinir senha"}
          </Button>
        </form>
      </AuthCard>
    );
  }

  return (
    <AuthCard
      title="Informe o código"
      description={`Digite o código de seis dígitos enviado para ${normalizedEmail}.`}
      icon={<KeyRound aria-hidden="true" className="size-5" />}
    >
      <form onSubmit={codeForm.handleSubmit(submitCode)} className="flex flex-col gap-5" noValidate>
        <FormMessage>{message}</FormMessage>
        <Controller
          control={codeForm.control}
          name="code"
          render={({ field }) => (
            <div className="flex flex-col items-center gap-2">
              <InputOTP
                maxLength={6}
                pattern={REGEXP_ONLY_DIGITS}
                value={field.value}
                onChange={field.onChange}
                aria-label="Código de recuperação de seis dígitos"
                aria-invalid={Boolean(codeForm.formState.errors.code)}
              >
                <InputOTPGroup>
                  {Array.from({ length: 6 }, (_, index) => (
                    <InputOTPSlot key={index} index={index} className="size-11 text-base sm:size-12" />
                  ))}
                </InputOTPGroup>
              </InputOTP>
              {codeForm.formState.errors.code ? (
                <p role="alert" className="text-destructive text-xs">
                  {codeForm.formState.errors.code.message}
                </p>
              ) : null}
            </div>
          )}
        />
        <Button type="submit" size="lg" className="h-11 w-full" disabled={codeForm.formState.isSubmitting}>
          {codeForm.formState.isSubmitting ? "Verificando…" : "Verificar código"}
        </Button>
        <Link href="/recuperar-senha" className="text-muted-foreground text-center text-sm hover:underline">
          Solicitar um novo código
        </Link>
      </form>
    </AuthCard>
  );
}
