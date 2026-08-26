"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Controller, useForm, useWatch } from "react-hook-form";

import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { FormField } from "@/features/auth/components/form-field";
import { FormMessage } from "@/features/auth/components/form-message";
import { PasswordField } from "@/features/auth/components/password-field";
import { registrationSchema, type RegistrationInput } from "@/features/auth/schemas/registration.schema";
import { checkUsername, register as registerAccount } from "@/features/auth/services/auth-client.service";

type UsernameState = "idle" | "checking" | "available" | "taken" | "error";

export function RegistrationForm() {
  const router = useRouter();
  const [message, setMessage] = useState<string>();
  const [usernameState, setUsernameState] = useState<UsernameState>("idle");
  const [checkedUsername, setCheckedUsername] = useState("");
  const {
    register,
    control,
    handleSubmit,
    setError,
    formState: { errors, isSubmitting },
  } = useForm<RegistrationInput>({
    resolver: zodResolver(registrationSchema),
    defaultValues: {
      full_name: "",
      username: "",
      email: "",
      password: "",
      passwordConfirmation: "",
      acceptedTerms: false,
    },
  });
  const username = useWatch({ control, name: "username" });
  const usernameCandidate = username.trim();
  const isUsernameCandidateValid =
    usernameCandidate.length >= 3 &&
    usernameCandidate.length <= 50 &&
    /^[a-zA-Z0-9._-]+$/.test(usernameCandidate);
  const visibleUsernameState =
    isUsernameCandidateValid && checkedUsername === usernameCandidate ? usernameState : "idle";

  useEffect(() => {
    const candidate = username.trim();
    if (candidate.length < 3 || candidate.length > 50 || !/^[a-zA-Z0-9._-]+$/.test(candidate)) {
      return;
    }

    const controller = new AbortController();
    const timer = window.setTimeout(async () => {
      setCheckedUsername(candidate);
      setUsernameState("checking");
      try {
        const result = await checkUsername(candidate, controller.signal);
        if (!result.success || !result.data) {
          setUsernameState("error");
          return;
        }
        setUsernameState(result.data.available ? "available" : "taken");
      } catch {
        if (!controller.signal.aborted) setUsernameState("error");
      }
    }, 450);

    return () => {
      controller.abort();
      window.clearTimeout(timer);
    };
  }, [username]);

  async function onSubmit(input: RegistrationInput) {
    setMessage(undefined);
    if (visibleUsernameState !== "available") {
      setError("username", { message: "Confirme um nome de usuário disponível." });
      return;
    }
    try {
      const result = await registerAccount({
        username: input.username,
        email: input.email,
        password: input.password,
        full_name: input.full_name,
      });
      if (!result.success) {
        setMessage(result.message);
        return;
      }
      router.push(`/verificar-email?email=${encodeURIComponent(input.email)}`);
    } catch {
      setMessage("Não foi possível concluir o cadastro. Tente novamente.");
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
      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4" noValidate>
        <FormMessage>{message}</FormMessage>
        <FormField id="full-name" label="Nome completo" error={errors.full_name?.message}>
          <Input
            id="full-name"
            autoComplete="name"
            className="h-11"
            aria-invalid={Boolean(errors.full_name)}
            {...register("full_name")}
          />
        </FormField>
        <div className="grid gap-4 sm:grid-cols-2">
          <FormField id="register-username" label="Nome de usuário" error={errors.username?.message}>
            <Input
              id="register-username"
              autoComplete="username"
              className="h-11"
              aria-invalid={Boolean(errors.username) || visibleUsernameState === "taken"}
              aria-describedby="username-availability"
              {...register("username")}
            />
            <p
              id="username-availability"
              role="status"
              aria-live="polite"
              className={
                visibleUsernameState === "available"
                  ? "text-xs text-emerald-700"
                  : visibleUsernameState === "taken" || visibleUsernameState === "error"
                    ? "text-destructive text-xs"
                    : "text-muted-foreground text-xs"
              }
            >
              {visibleUsernameState === "checking" && "Verificando disponibilidade…"}
              {visibleUsernameState === "available" && "Nome de usuário disponível."}
              {visibleUsernameState === "taken" && "Este nome de usuário já está em uso."}
              {visibleUsernameState === "error" && "Não foi possível verificar a disponibilidade."}
            </p>
          </FormField>
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
                  Li e concordo com os{" "}
                  <Link href="/terms" target="_blank" className="font-medium hover:underline">
                    Termos de uso
                  </Link>{" "}
                  e a{" "}
                  <Link href="/privacy" target="_blank" className="font-medium hover:underline">
                    Política de privacidade
                  </Link>
                  .
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
        <Button
          type="submit"
          size="lg"
          className="h-11 w-full"
          disabled={isSubmitting || visibleUsernameState === "checking" || visibleUsernameState === "taken"}
        >
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
