import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeEach, describe, expect, it, vi } from "vitest";

import { PasswordRecoveryForm } from "@/features/auth/components/password-recovery-form";
import { requestPasswordRecovery } from "@/features/auth/services/auth-client.service";

vi.mock("@/features/auth/services/auth-client.service", () => ({
  requestPasswordRecovery: vi.fn(),
}));

describe("recuperação de senha", () => {
  beforeEach(() => vi.mocked(requestPasswordRecovery).mockReset());

  it("mantém resposta genérica mesmo quando a API rejeita a solicitação", async () => {
    vi.mocked(requestPasswordRecovery).mockRejectedValueOnce(new Error("Conta inexistente"));
    const user = userEvent.setup();
    render(<PasswordRecoveryForm />);

    await user.type(screen.getByLabelText("E-mail"), "pessoa@example.com");
    await user.click(screen.getByRole("button", { name: "Enviar instruções" }));

    expect(await screen.findByText(/Se existir uma conta associada a este e-mail/i)).toBeInTheDocument();
    expect(screen.queryByText(/Conta inexistente/i)).not.toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Informar código de verificação" })).toHaveAttribute(
      "href",
      "/redefinir-senha?email=pessoa%40example.com",
    );
  });
});
