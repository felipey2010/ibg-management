import { describe, expect, it } from "vitest";
import { memberFormSchema, memberQuerySchema } from "./member.schema";

describe("member validation", () => {
  it("normalizes optional fields and the state code", () => {
    const result = memberFormSchema.parse({
      first_name: " Maria ",
      last_name: " Silva ",
      birth_date: "",
      email: "",
      phone: "",
      address_line: "",
      city: "Manaus",
      state: "am",
      postal_code: "",
      membership_status: "ACTIVE",
      membership_date: "2026-09-12",
      notes: "",
    });
    expect(result).toEqual(expect.objectContaining({ first_name: "Maria", state: "AM", email: null }));
    expect(memberFormSchema.safeParse(result).success).toBe(true);
  });

  it("rejects invalid dates and status values", () => {
    const values = {
      first_name: "Maria",
      last_name: "Silva",
      birth_date: "12/09/2026",
      email: "",
      phone: "",
      address_line: "",
      city: "",
      state: "",
      postal_code: "",
      membership_status: "UNKNOWN",
      membership_date: "",
      notes: "",
    };
    expect(memberFormSchema.safeParse(values).success).toBe(false);
  });

  it("falls back to the first page for invalid query values", () => {
    expect(memberQuerySchema.parse({ page: "invalid", status: "invalid" })).toEqual({
      page: 1,
      search: "",
      status: "",
    });
  });
});
