"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { REGEXP_ONLY_DIGITS } from "input-otp";
import { BadgeCheck, MailCheck } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";

import { Button } from "@/components/ui/button";
import { InputOTP, InputOTPGroup, InputOTPSlot } from "@/components/ui/input-otp";
import { AuthCard } from "@/features/auth/components/auth-card";
import { FormMessage } from "@/features/auth/components/form-message";
import { verificationSchema, type VerificationInput } from "@/features/auth/schemas/verification.schema";
import { resendVerificationCode, verifyEmail } from "@/features/auth/services/auth-client.service";

export function VerificationCodeForm({ email }: Readonly<{ email: string }>) {
  const [isVerified, setIsVerified] = useState(false);
  const [message, setMessage] = useState<string>();
  const [isResending, setIsResending] = useState(false);
  const [resendSeconds, setResendSeconds] = useState(0);
  const {
    control,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<VerificationInput>({ resolver: zodResolver(verificationSchema), defaultValues: { code: "" } });

  useEffect(() => {
    if (resendSeconds <= 0) return;

    const timer = window.setInterval(() => {
      setResendSeconds((seconds) => (seconds > 0 ? seconds - 1 : 0));
    }, 1_000);

    return () => window.clearInterval(timer);
  }, [resendSeconds]);

  async function onSubmit(input: VerificationInput) {
    setMessage(undefined);
    try {
      const result = await verifyEmail({ email, code: input.code });
      if (!result.success) {
        setMessage(result.message);
        return;
      }
      setIsVerified(true);
    } catch {
      setMessage("O código informado é inválido ou expirou.");
    }
  }

  async function resend() {
    setIsResending(true);
    setMessage(undefined);
    try {
      const result = await resendVerificationCode(email);
      if (!result.success) {
        setMessage(result.message);
        return;
      }
      setMessage("Enviamos um novo código para o seu e-mail.");
      setResendSeconds(60);
    } catch {
      setMessage("Não foi possível reenviar o código agora.");
    } finally {
      setIsResending(false);
    }
  }

  if (isVerified) {
    return (
      <AuthCard
        title="E-mail verificado"
        description="Seu cadastro foi confirmado e agora aguarda a aprovação da administração."
        icon={<BadgeCheck aria-hidden="true" className="size-5" />}
      >
        <span className="bg-card text-muted-foreground rounded-xl border p-5 text-sm leading-6">
          Você receberá um e-mail quando um administrador aprovar sua solicitação. Depois disso, poderá
          acessar a plataforma normalmente.
        </span>
        <Button nativeButton={false} render={<Link href="/login" />} size="lg" className="mt-5 h-11 w-full">
          Voltar para o login
        </Button>
      </AuthCard>
    );
  }

  return (
    <AuthCard
      title="Verifique seu e-mail"
      description={`Enviamos um código de seis dígitos para ${email}.`}
      icon={<MailCheck aria-hidden="true" className="size-5" />}
    >
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-5" noValidate>
        <FormMessage>{message}</FormMessage>
        <Controller
          control={control}
          name="code"
          render={({ field }) => (
            <div className="flex flex-col items-center gap-2">
              <InputOTP
                maxLength={6}
                pattern={REGEXP_ONLY_DIGITS}
                value={field.value}
                onChange={field.onChange}
                aria-label="Código de verificação de seis dígitos"
                aria-invalid={Boolean(errors.code)}
              >
                <InputOTPGroup>
                  {Array.from({ length: 6 }, (_, index) => (
                    <InputOTPSlot key={index} index={index} className="size-11 text-base sm:size-12" />
                  ))}
                </InputOTPGroup>
              </InputOTP>
              {errors.code ? (
                <p role="alert" className="text-destructive text-xs">
                  {errors.code.message}
                </p>
              ) : null}
            </div>
          )}
        />
        <Button type="submit" size="lg" className="h-11 w-full" disabled={isSubmitting}>
          {isSubmitting ? "Verificando…" : "Verificar código"}
        </Button>
      </form>
      <div className="text-muted-foreground mt-5 flex flex-col items-center gap-2 text-sm">
        <button
          type="button"
          onClick={resend}
          disabled={isResending || resendSeconds > 0}
          className="text-primary font-medium hover:underline disabled:opacity-50"
        >
          {isResending
            ? "Reenviando…"
            : resendSeconds > 0
              ? `Reenviar em ${resendSeconds}s`
              : "Reenviar código"}
        </button>
        <Link href="/cadastro" className="hover:text-foreground hover:underline">
          Corrigir e-mail
        </Link>
      </div>
    </AuthCard>
  );
}
