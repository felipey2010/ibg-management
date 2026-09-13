import { describe, expect, it } from "vitest";
import { announcementFormSchema } from "./announcement.schema";

const validValues = {
  title: "Culto especial",
  content: "Participe conosco neste domingo.",
  status: "PUBLISHED" as const,
  audience: "ALL_MEMBERS" as const,
  ministry_id: "",
  starts_at: "",
  ends_at: "",
};

describe("announcement validation", () => {
  it("accepts the values produced by the form resolver in the server action", () => {
    const payload = announcementFormSchema.parse(validValues);

    expect(payload).toEqual(
      expect.objectContaining({
        ministry_id: null,
        starts_at: null,
        ends_at: null,
      }),
    );
    expect(announcementFormSchema.safeParse(payload).success).toBe(true);
  });

  it("normalizes local dates and validates their order", () => {
    const payload = announcementFormSchema.parse({
      ...validValues,
      starts_at: "2026-09-13T18:00",
      ends_at: "2026-09-13T20:00",
    });

    expect(payload.starts_at).toMatch(/^2026-09-13T/);
    expect(
      announcementFormSchema.safeParse({
        ...validValues,
        starts_at: "2026-09-13T20:00",
        ends_at: "2026-09-13T18:00",
      }).success,
    ).toBe(false);
  });
});
