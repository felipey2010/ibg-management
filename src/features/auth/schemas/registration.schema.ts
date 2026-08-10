import { z } from "zod";

const passwordSchema = z
  .string()
  .min(8, "Use pelo menos 8 caracteres.")
  .regex(/[A-Za-z]/, "Inclua pelo menos uma letra.")
  .regex(/[0-9]/, "Inclua pelo menos um número.");

export const registrationSchema = z
  .object({
    name: z.string().trim().min(3, "Informe seu nome completo."),
    email: z.string().trim().email("Informe um e-mail válido."),
    birthDate: z.string().optional(),
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
