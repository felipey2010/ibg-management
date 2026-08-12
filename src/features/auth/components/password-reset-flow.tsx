"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { BadgeCheck, CircleAlert, LoaderCircle, LockKeyhole } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";

import { Button } from "@/components/ui/button";
import { AuthCard } from "@/features/auth/components/auth-card";
import { FormField } from "@/features/auth/components/form-field";
import { FormMessage } from "@/features/auth/components/form-message";
import { PasswordField } from "@/features/auth/components/password-field";
import { passwordResetSchema, type PasswordResetInput } from "@/features/auth/schemas/registration.schema";
import { resetPassword, validateResetToken } from "@/features/auth/services/auth-client.service";

type ResetState = "validating" | "valid" | "invalid" | "expired" | "error" | "success";

export function PasswordResetFlow({ token }: Readonly<{ token?: string }>) {
  const [state, setState] = useState<ResetState>(token ? "validating" : "invalid");
  const [message, setMessage] = useState<string>();
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<PasswordResetInput>({
    resolver: zodResolver(passwordResetSchema),
    defaultValues: { password: "", passwordConfirmation: "" },
  });

  useEffect(() => {
    if (!token) return;
    let active = true;
    validateResetToken(token)
      .then((result) => {
        if (!active) return;
        setState(
          result.success && result.data?.valid
            ? "valid"
            : result.data?.reason === "EXPIRED"
              ? "expired"
              : "invalid",
        );
      })
      .catch(() => active && setState("error"));
    return () => {
      active = false;
    };
  }, [token]);

  async function onSubmit(input: PasswordResetInput) {
    if (!token) return;
    setMessage(undefined);
    try {
      const result = await resetPassword({ token, password: input.password });
      if (!result.success) {
        setMessage(result.message);
        return;
      }
      setState("success");
    } catch {
      setMessage("Não foi possível redefinir sua senha. Solicite um novo link.");
    }
  }

  if (state === "validating") {
    return (
      <AuthCard
        title="Validando link"
        description="Estamos verificando se este link ainda pode ser utilizado."
        icon={<LoaderCircle aria-hidden="true" className="size-5 animate-spin" />}
      >
        <p role="status" className="text-muted-foreground text-center text-xs">
          Aguarde um instante…
        </p>
      </AuthCard>
    );
  }

  if (state === "invalid" || state === "expired" || state === "error") {
    const descriptions = {
      invalid: "Este link de redefinição é inválido ou já foi utilizado.",
      expired: "Este link expirou. Solicite uma nova recuperação de senha.",
      error: "Não foi possível validar o link agora. Tente novamente ou solicite um novo.",
    } as const;

    return (
      <AuthCard
        title="Link indisponível"
        description={descriptions[state]}
        icon={<CircleAlert aria-hidden="true" className="size-5" />}
      >
        <Button
          nativeButton={false}
          render={<Link href="/recuperar-senha" />}
          size="lg"
          className="h-11 w-full"
        >
          Solicitar novo link
        </Button>
      </AuthCard>
    );
  }

  if (state === "success") {
    return (
      <AuthCard
        title="Senha redefinida"
        description="Sua nova senha foi cadastrada com sucesso. Você já pode acessar sua conta."
        icon={<BadgeCheck aria-hidden="true" className="size-5" />}
      >
        <Button nativeButton={false} render={<Link href="/login" />} size="lg" className="h-11 w-full">
          Entrar
        </Button>
      </AuthCard>
    );
  }

  return (
    <AuthCard
      title="Crie uma nova senha"
      description="Escolha uma senha segura que você ainda não tenha usado nesta conta."
      icon={<LockKeyhole aria-hidden="true" className="size-5" />}
    >
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4" noValidate>
        <FormMessage>{message}</FormMessage>
        <FormField id="new-password" label="Nova senha" error={errors.password?.message}>
          <PasswordField
            id="new-password"
            autoComplete="new-password"
            invalid={Boolean(errors.password)}
            {...register("password")}
          />
        </FormField>
        <FormField
          id="new-password-confirmation"
          label="Confirmar nova senha"
          error={errors.passwordConfirmation?.message}
        >
          <PasswordField
            id="new-password-confirmation"
            autoComplete="new-password"
            invalid={Boolean(errors.passwordConfirmation)}
            {...register("passwordConfirmation")}
          />
        </FormField>
        <Button type="submit" size="lg" className="h-11 w-full" disabled={isSubmitting}>
          {isSubmitting ? "Redefinindo…" : "Redefinir senha"}
        </Button>
      </form>
    </AuthCard>
  );
}
