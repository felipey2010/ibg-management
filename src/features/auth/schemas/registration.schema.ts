import { z } from "zod";

const passwordSchema = z
  .string()
  .min(8, "Use pelo menos 8 caracteres.")
  .regex(/[A-Za-z]/, "Inclua pelo menos uma letra.")
  .regex(/[0-9]/, "Inclua pelo menos um número.");

export const registrationSchema = z
  .object({
    full_name: z.string().trim().min(2, "Informe seu nome completo."),
    username: z
      .string()
      .trim()
      .min(3, "Use pelo menos 3 caracteres.")
      .max(50, "Use no máximo 50 caracteres.")
      .regex(/^[a-zA-Z0-9._-]+$/, "Use apenas letras, números, ponto, hífen ou sublinhado."),
    email: z.string().trim().email("Informe um e-mail válido."),
    password: passwordSchema,
    passwordConfirmation: z.string().min(1, "Confirme sua senha."),
    acceptedTerms: z.boolean().refine(Boolean, "Você precisa aceitar os termos para continuar."),
  })
  .refine((data) => data.password === data.passwordConfirmation, {
    message: "As senhas não coincidem.",
    path: ["passwordConfirmation"],
  });

export type RegistrationInput = z.infer<typeof registrationSchema>;

export const passwordResetSchema = z
  .object({
    password: passwordSchema,
    passwordConfirmation: z.string().min(1, "Confirme sua nova senha."),
  })
  .refine((data) => data.password === data.passwordConfirmation, {
    message: "As senhas não coincidem.",
    path: ["passwordConfirmation"],
  });

export type PasswordResetInput = z.infer<typeof passwordResetSchema>;
