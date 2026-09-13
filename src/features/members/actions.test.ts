import { beforeEach, describe, expect, it, vi } from "vitest";
import { revalidatePath } from "next/cache";
import { saveMember } from "./actions";
import { requestMemberApi } from "./services/member.service";

vi.mock("next/cache", () => ({ revalidatePath: vi.fn() }));
vi.mock("./services/member.service", () => ({ requestMemberApi: vi.fn() }));

describe("member actions", () => {
  beforeEach(() => vi.clearAllMocks());

  it("accepts the normalized null values produced by the member form", async () => {
    const saved = {
      id: crypto.randomUUID(),
      first_name: "Maria",
      last_name: "Silva",
    };
    vi.mocked(requestMemberApi).mockResolvedValue({ ok: true, data: saved });

    const result = await saveMember({
      values: {
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
        status_reason: null,
      },
    });

    expect(result.ok).toBe(true);
    expect(requestMemberApi).toHaveBeenCalledWith(
      "",
      "members.create",
      expect.objectContaining({ method: "POST" }),
    );
    expect(revalidatePath).toHaveBeenCalledWith("/membros");
  });
});
