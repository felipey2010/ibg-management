import { describe, expect, it } from "vitest";
import { defaultChurchSettings, resolveChurchSettings } from "./church-settings.defaults";
import { churchSettingsSchema } from "./church-settings.schema";

describe("church settings validation and defaults", () => {
  it("uses defaults for an absent record and preserves deliberately empty fields", () => {
    expect(resolveChurchSettings(null)).toEqual(defaultChurchSettings);
    expect(resolveChurchSettings({ name: "Church", description: "" })).toMatchObject({
      name: "Church",
      description: "",
      timezone: "America/Boa_Vista",
    });
  });
  it("accepts clearing optional fields and strips non-editable fields", () => {
    const result = churchSettingsSchema.parse(defaultChurchSettings);
    expect(result.email).toBe("");
    expect(result).not.toHaveProperty("id");
    expect(result).not.toHaveProperty("logo_file_id");
  });
  it.each([{ name: " " }, { email: "invalid" }, { timezone: "invalid" }, { website: "javascript:alert(1)" }])(
    "rejects invalid values %j",
    (values) => {
      expect(churchSettingsSchema.safeParse({ ...defaultChurchSettings, ...values }).success).toBe(false);
    },
  );
});
