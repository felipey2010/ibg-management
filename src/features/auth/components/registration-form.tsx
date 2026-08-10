"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Controller, useForm } from "react-hook-form";

import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { FormField } from "@/features/auth/components/form-field";
import { FormMessage } from "@/features/auth/components/form-message";
import { PasswordField } from "@/features/auth/components/password-field";
import { SocialAuthButtons } from "@/features/auth/components/social-auth-buttons";
import { registrationSchema, type RegistrationInput } from "@/features/auth/schemas/registration.schema";
import {
  getAuthErrorMessage,
  register as registerAccount,
} from "@/features/auth/services/auth-client.service";

export function RegistrationForm() {
  const router = useRouter();
  const [message, setMessage] = useState<string>();
  const {
    register,
    control,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<RegistrationInput>({
    resolver: zodResolver(registrationSchema),
    defaultValues: {
      name: "",
      email: "",
      birthDate: "",
      password: "",
      passwordConfirmation: "",
      acceptedTerms: false,
    },
  });

  async function onSubmit(input: RegistrationInput) {
    setMessage(undefined);
    try {
      await registerAccount({
        name: input.name,
        email: input.email,
        birthDate: input.birthDate || undefined,
        password: input.password,
      });
      router.push(`/verificar-email?email=${encodeURIComponent(input.email)}`);
    } catch (error) {
      setMessage(getAuthErrorMessage(error, "Não foi possível concluir o cadastro. Tente novamente."));
    }
  }

  return (
    <div className="w-full max-w-lg">
      <header className="mb-6 text-center">
        <h1 className="text-xl font-semibold tracking-tight">Crie sua conta</h1>
        <p className="text-muted-foreground mt-2 text-sm">
          Seu cadastro será analisado pela administração da igreja.
        </p>
      </header>
      <SocialAuthButtons action="Cadastrar" />
      <div className="text-tertiary before:bg-border after:bg-border my-6 flex items-center gap-3 text-xs before:h-px before:flex-1 after:h-px after:flex-1">
        ou
      </div>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4" noValidate>
        <FormMessage>{message}</FormMessage>
        <FormField id="name" label="Nome completo" error={errors.name?.message}>
          <Input
            id="name"
            autoComplete="name"
            className="h-11"
            aria-invalid={Boolean(errors.name)}
            {...register("name")}
          />
        </FormField>
        <div className="grid gap-4 sm:grid-cols-2">
          <FormField id="register-email" label="E-mail" error={errors.email?.message}>
            <Input
              id="register-email"
              type="email"
              autoComplete="email"
              className="h-11"
              aria-invalid={Boolean(errors.email)}
              {...register("email")}
            />
          </FormField>
          <FormField id="birthDate" label="Data de nascimento (opcional)" error={errors.birthDate?.message}>
            <Input
              id="birthDate"
              type="date"
              autoComplete="bday"
              className="h-11"
              {...register("birthDate")}
            />
          </FormField>
        </div>
        <div className="grid gap-4 sm:grid-cols-2">
          <FormField id="register-password" label="Senha" error={errors.password?.message}>
            <PasswordField
              id="register-password"
              autoComplete="new-password"
              invalid={Boolean(errors.password)}
              {...register("password")}
            />
          </FormField>
          <FormField
            id="passwordConfirmation"
            label="Confirmar senha"
            error={errors.passwordConfirmation?.message}
          >
            <PasswordField
              id="passwordConfirmation"
              autoComplete="new-password"
              invalid={Boolean(errors.passwordConfirmation)}
              {...register("passwordConfirmation")}
            />
          </FormField>
        </div>
        <Controller
          control={control}
          name="acceptedTerms"
          render={({ field }) => (
            <div>
              <label className="text-muted-foreground flex items-start gap-3 text-sm leading-5">
                <Checkbox
                  checked={field.value}
                  onCheckedChange={field.onChange}
                  aria-invalid={Boolean(errors.acceptedTerms)}
                  className="mt-0.5"
                />
                <span>
                  Li e concordo com os <span className="text-foreground font-medium">Termos de uso</span> e a{" "}
                  <span className="text-foreground font-medium">Política de privacidade</span>.
                </span>
              </label>
              {errors.acceptedTerms ? (
                <p role="alert" className="text-destructive mt-1 text-xs">
                  {errors.acceptedTerms.message}
                </p>
              ) : null}
            </div>
          )}
        />
        <Button type="submit" size="lg" className="h-11 w-full" disabled={isSubmitting}>
          {isSubmitting ? "Enviando cadastro…" : "Cadastrar"}
        </Button>
      </form>
      <p className="text-muted-foreground mt-6 text-center text-sm">
        Já possui uma conta?{" "}
        <Link href="/login" className="text-primary font-semibold hover:underline">
          Entrar
        </Link>
      </p>
    </div>
  );
}
