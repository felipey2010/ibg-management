import { describe, expect, it } from "vitest";

import { sanitizeEmail, sanitizeText, sanitizeUsername } from "@/features/auth/services/auth-input-sanitizer";

describe("sanitização de dados de autenticação", () => {
  it("remove delimitadores HTML e caracteres de controle de textos", () => {
    expect(sanitizeText("  <script>Maria\u0000</script>  ")).toBe("scriptMaria/script");
  });

  it("normaliza e converte e-mails para minúsculas", () => {
    expect(sanitizeEmail("  MARIA@EXAMPLE.COM  ")).toBe("maria@example.com");
  });

  it("normaliza nomes de usuário sem alterar caracteres permitidos", () => {
    expect(sanitizeUsername("  maria.silva_01  ")).toBe("maria.silva_01");
  });
});
