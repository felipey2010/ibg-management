import { cleanup, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterEach, describe, expect, it, vi } from "vitest";
import { MemberProfile } from "./member-profile";

const back = vi.fn();
vi.mock("next/navigation", () => ({
  useRouter: () => ({ back, push: vi.fn(), refresh: vi.fn() }),
}));
vi.mock("@/hooks/use-admin-mutation", () => ({
  useAdminMutation: () => ({ pending: false, execute: vi.fn() }),
}));

describe("member profile navigation", () => {
  afterEach(() => {
    cleanup();
    vi.clearAllMocks();
  });

  it("returns to the previous route", async () => {
    render(
      <MemberProfile
        canUpdate={false}
        canDelete={false}
        member={{
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
        }}
      />,
    );

    await userEvent.click(screen.getByRole("button", { name: "Voltar" }));
    expect(back).toHaveBeenCalledOnce();
  });
});
