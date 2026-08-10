import { z } from "zod";

export const verificationSchema = z.object({
  code: z.string().regex(/^\d{6}$/, "Informe os seis dígitos do código."),
});

export type VerificationInput = z.infer<typeof verificationSchema>;

export const passwordRecoverySchema = z.object({
  email: z.string().trim().email("Informe um e-mail válido."),
});

export type PasswordRecoveryInput = z.infer<typeof passwordRecoverySchema>;
