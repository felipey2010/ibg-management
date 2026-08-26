import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeAll, beforeEach, describe, expect, it, vi } from "vitest";

import { PasswordResetFlow } from "@/features/auth/components/password-reset-flow";
import { resetPassword, verifyPasswordResetCode } from "@/features/auth/services/auth-client.service";

vi.mock("@/features/auth/services/auth-client.service", () => ({
  resetPassword: vi.fn(),
  verifyPasswordResetCode: vi.fn(),
}));

describe("redefinição de senha", () => {
  beforeAll(() => {
    vi.stubGlobal(
      "ResizeObserver",
      class {
        observe() {}
        unobserve() {}
        disconnect() {}
      },
    );
  });

  beforeEach(() => {
    vi.mocked(resetPassword).mockReset();
    vi.mocked(verifyPasswordResetCode).mockReset();
  });

  it("preenche o código da URL e aguarda a confirmação do usuário", async () => {
    vi.mocked(verifyPasswordResetCode).mockResolvedValueOnce({
      success: true,
      message: "Código verificado",
      data: { resetToken: "reset-token", expiresIn: "10m" },
    });
    const user = userEvent.setup();
    render(<PasswordResetFlow email="Pessoa@Example.com" code="123456" />);

    expect(screen.getByLabelText("Código de recuperação de seis dígitos")).toHaveValue("123456");
    expect(verifyPasswordResetCode).not.toHaveBeenCalled();

    await user.click(screen.getByRole("button", { name: "Verificar código" }));

    expect(verifyPasswordResetCode).toHaveBeenCalledWith({
      email: "pessoa@example.com",
      code: "123456",
    });
    expect(await screen.findByRole("heading", { name: "Crie uma nova senha" })).toBeInTheDocument();
  });

  it("mantém o OTP vazio quando a URL não contém código", () => {
    render(<PasswordResetFlow email="pessoa@example.com" />);

    expect(screen.getByLabelText("Código de recuperação de seis dígitos")).toHaveValue("");
  });
});
