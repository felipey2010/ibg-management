import { cleanup, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";
import { AccessControlWorkspace } from "./access-control-workspace";

vi.mock("next/navigation", () => ({ useRouter: () => ({ refresh: vi.fn() }) }));

describe("system profile management", () => {
  afterEach(cleanup);

  it("allows editing details and permissions while keeping deletion disabled", () => {
    render(
      <AccessControlWorkspace
        permissions={[]}
        roles={[
          {
            id: crypto.randomUUID(),
            name: "Administrador do sistema",
            code: "SYSTEM_ADMIN",
            description: null,
            is_system_role: true,
            role_permissions: [],
            _count: { user_roles: 1 },
          },
        ]}
      />,
    );

    expect(screen.getByRole("button", { name: "Editar" })).toBeEnabled();
    expect(screen.getByRole("button", { name: "Gerenciar permissões" })).toBeEnabled();
    expect(screen.getByRole("button", { name: "Excluir perfil Administrador do sistema" })).toBeDisabled();
  });
});
