import { cleanup, render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterEach, describe, expect, it, vi } from "vitest";
import { saveMember } from "../actions";
import { MemberForm } from "./member-form";

const push = vi.fn();
vi.mock("next/navigation", () => ({ useRouter: () => ({ push, back: vi.fn(), refresh: vi.fn() }) }));
vi.mock("../actions", () => ({ saveMember: vi.fn() }));
vi.mock("@/components/ui/toast", () => ({ toast: { success: vi.fn(), error: vi.fn() } }));

describe("member form", () => {
  afterEach(() => {
    cleanup();
    vi.clearAllMocks();
  });

  it("validates and submits a new member", async () => {
    const user = userEvent.setup();
    vi.mocked(saveMember).mockResolvedValue({
      ok: true,
      data: {
        id: crypto.randomUUID(),
        user_id: null,
        first_name: "Maria",
        last_name: "Silva",
        birth_date: null,
        email: null,
        phone: null,
        address_line: null,
        city: null,
        state: null,
        postal_code: null,
        membership_status: "ACTIVE",
        membership_date: null,
        notes: null,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      },
    });
    render(<MemberForm />);
    await user.type(screen.getByLabelText("Primeiro nome *"), "Maria");
    await user.type(screen.getByLabelText("Sobrenome *"), "Silva");
    await user.click(screen.getByRole("button", { name: "Cadastrar membro" }));

    await waitFor(() => expect(saveMember).toHaveBeenCalledOnce());
    expect(saveMember).toHaveBeenCalledWith(
      expect.objectContaining({
        values: expect.objectContaining({ first_name: "Maria", last_name: "Silva" }),
      }),
    );
    expect(push).toHaveBeenCalledWith("/membros");
  });
});
