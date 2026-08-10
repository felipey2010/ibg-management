import { describe, expect, it } from "vitest";

import { loginSchema } from "@/features/auth/schemas/login.schema";
import { passwordResetSchema, registrationSchema } from "@/features/auth/schemas/registration.schema";
import { verificationSchema } from "@/features/auth/schemas/verification.schema";

describe("schemas de autenticação", () => {
  it("rejeita credenciais de login incompletas", () => {
    expect(loginSchema.safeParse({ email: "email-invalido", password: "" }).success).toBe(false);
  });

  it("aceita um cadastro válido", () => {
    const result = registrationSchema.safeParse({
      name: "Maria da Silva",
      email: "maria@example.com",
      birthDate: "1990-05-12",
      password: "senha123",
      passwordConfirmation: "senha123",
      acceptedTerms: true,
    });

    expect(result.success).toBe(true);
  });

  it("rejeita senhas diferentes na redefinição", () => {
    const result = passwordResetSchema.safeParse({
      password: "senha123",
      passwordConfirmation: "outra456",
    });

    expect(result.success).toBe(false);
  });

  it("aceita somente OTP numérico de seis dígitos", () => {
    expect(verificationSchema.safeParse({ code: "123456" }).success).toBe(true);
    expect(verificationSchema.safeParse({ code: "12345a" }).success).toBe(false);
  });
});
