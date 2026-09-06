"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Mail } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { FormField } from "@/features/auth/components/form-field";
import { FormMessage } from "@/features/auth/components/form-message";
import { PasswordField } from "@/features/auth/components/password-field";
import { loginSchema, type LoginInput } from "@/features/auth/schemas/login.schema";
import { login } from "@/features/auth/services/auth-client.service";

const oauthErrors: Record<string, string> = {
  oauth: "Não foi possível concluir a autenticação com o provedor.",
  provider: "O provedor de autenticação informado não é suportado.",
  service: "O serviço de autenticação está temporariamente indisponível.",
  session: "Sua sessão expirou ou sua conta ainda não está autorizada a acessar a plataforma.",
  AccessDenied: "Esta conta não está autorizada a acessar a plataforma.",
  OAuthSignin: "Não foi possível iniciar a autenticação social.",
  OAuthCallback: "Não foi possível validar o retorno do provedor de autenticação.",
  Configuration: "O provedor de autenticação ainda não foi configurado corretamente.",
};

export function LoginForm({
  redirectTo,
  oauthError,
}: Readonly<{ redirectTo?: string; oauthError?: string }>) {
  const router = useRouter();
  const [message, setMessage] = useState(oauthError ? oauthErrors[oauthError] : undefined);
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginInput>({ resolver: zodResolver(loginSchema), defaultValues: { email: "", password: "" } });

  async function onSubmit(input: LoginInput) {
    setMessage(undefined);
    try {
      const result = await login(input);
      if (!result.success) {
        setMessage(result.message);
        return;
      }
      const destination = redirectTo?.startsWith("/") && !redirectTo.startsWith("//") ? redirectTo : "/";
      router.replace(destination);
      router.refresh();
    } catch {
      setMessage("Não foi possível conectar ao serviço de autenticação.");
    }
  }

  return (
    <div className="w-full max-w-md">
      <header className="mb-7 text-center lg:text-left">
        <p className="text-primary text-xs font-semibold tracking-[0.16em] uppercase">Bem-vindo de volta</p>
        <h1 className="mt-2 text-2xl font-semibold tracking-tight">Acesse sua conta</h1>
        <p className="text-muted-foreground mt-2 text-sm">
          Entre para continuar para o painel administrativo.
        </p>
      </header>
      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4" noValidate>
        <FormMessage>{message}</FormMessage>
        <FormField id="email" label="E-mail" error={errors.email?.message}>
          <div className="relative">
            <Mail
              aria-hidden="true"
              className="text-muted-foreground absolute top-1/2 left-3 size-4 -translate-y-1/2"
            />
            <Input
              id="email"
              type="email"
              autoComplete="email"
              placeholder="voce@exemplo.com"
              aria-invalid={Boolean(errors.email)}
              aria-describedby={errors.email ? "email-error" : undefined}
              className="h-11 pl-10"
              {...register("email")}
            />
          </div>
        </FormField>
        <FormField id="password" label="Senha" error={errors.password?.message}>
          <PasswordField
            id="password"
            autoComplete="current-password"
            placeholder="Sua senha"
            invalid={Boolean(errors.password)}
            aria-describedby={errors.password ? "password-error" : undefined}
            {...register("password")}
          />
        </FormField>
        <div className="flex justify-end">
          <Link href="/recuperar-senha" className="text-primary text-sm font-medium hover:underline">
            Esqueceu a senha?
          </Link>
        </div>
        <Button type="submit" size="lg" className="h-11 w-full" disabled={isSubmitting}>
          {isSubmitting ? "Entrando…" : "Entrar"}
        </Button>
      </form>
      <p className="text-muted-foreground mt-7 text-center text-sm">
        Ainda não possui uma conta?{" "}
        <Link href="/cadastro" className="text-primary font-semibold hover:underline">
          Cadastre-se
        </Link>
      </p>
    </div>
  );
}
