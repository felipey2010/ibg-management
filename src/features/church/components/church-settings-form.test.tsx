import { cleanup, render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { ChurchSettingsProvider, useChurchSettings } from "./church-settings-provider";
import { ChurchSettingsForm } from "./church-settings-form";
import { defaultChurchSettings } from "../church-settings.defaults";
import { reloadChurchSettings, updateChurchSettings } from "../actions";
import { toast } from "@/components/ui/toast";

vi.mock("../actions", () => ({ reloadChurchSettings: vi.fn(), updateChurchSettings: vi.fn() }));
vi.mock("@/components/ui/toast", () => ({ toast: { success: vi.fn(), error: vi.fn() } }));

function Consumer() {
  return <output aria-label="Nome compartilhado">{useChurchSettings().settings.name}</output>;
}

function setup(canEdit = true) {
  render(
    <ChurchSettingsProvider initialResult={{ ok: true, settings: defaultChurchSettings }}>
      <Consumer />
      <ChurchSettingsForm canEdit={canEdit} />
    </ChurchSettingsProvider>,
  );
  return userEvent.setup();
}

describe("church settings", () => {
  afterEach(cleanup);
  beforeEach(() => vi.resetAllMocks());

  it("shows defaults and publishes saved values to other consumers", async () => {
    const user = setup();
    expect(screen.getByText(/valores padrão estão em uso/)).toBeInTheDocument();
    const input = screen.getByLabelText("Nome da igreja *");
    await user.clear(input);
    await user.type(input, "Comunidade Esperança");
    vi.mocked(updateChurchSettings).mockResolvedValue({
      ok: true,
      settings: { ...defaultChurchSettings, id: "church", name: "Comunidade Esperança" },
    });
    await user.click(screen.getByRole("button", { name: "Salvar configurações" }));
    await waitFor(() => expect(toast.success).toHaveBeenCalledWith("Configurações salvas com sucesso."));
    expect(screen.getByLabelText("Nome compartilhado")).toHaveTextContent("Comunidade Esperança");
    expect(screen.queryByText(/valores padrão estão em uso/)).not.toBeInTheDocument();
  });

  it("does not submit invalid input", async () => {
    const user = setup();
    await user.clear(screen.getByLabelText("Nome da igreja *"));
    await user.click(screen.getByRole("button", { name: "Salvar configurações" }));
    expect(await screen.findByText("Informe o nome da igreja.")).toBeInTheDocument();
    expect(updateChurchSettings).not.toHaveBeenCalled();
  });

  it("preserves input on save failure", async () => {
    const user = setup();
    await user.type(screen.getByLabelText("E-mail"), "contato@example.com");
    vi.mocked(updateChurchSettings).mockResolvedValue({
      ok: false,
      status: 503,
      message: "Tente novamente.",
    });
    await user.click(screen.getByRole("button", { name: "Salvar configurações" }));
    await waitFor(() => expect(toast.error).toHaveBeenCalledWith("Tente novamente."));
    expect(screen.getByLabelText("E-mail")).toHaveValue("contato@example.com");
  });

  it("makes settings read-only without edit permission", () => {
    setup(false);
    expect(screen.getByLabelText("Nome da igreja *")).toBeDisabled();
    expect(screen.queryByRole("button", { name: "Salvar configurações" })).not.toBeInTheDocument();
  });

  it("retries failed loading without silently treating it as missing settings", async () => {
    const user = userEvent.setup();
    render(
      <ChurchSettingsProvider initialResult={{ ok: false, status: 503, message: "Falha ao carregar." }}>
        <Consumer />
      </ChurchSettingsProvider>,
    );
    expect(screen.queryByLabelText("Nome compartilhado")).not.toBeInTheDocument();
    vi.mocked(reloadChurchSettings).mockResolvedValue({
      ok: true,
      settings: defaultChurchSettings,
    });
    await user.click(screen.getByRole("button", { name: "Tentar novamente" }));
    await waitFor(() =>
      expect(screen.getByLabelText("Nome compartilhado")).toHaveTextContent(defaultChurchSettings.name),
    );
  });
});
