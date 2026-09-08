import { describe, expect, it } from "vitest";
import { permissionSchema, rolePermissionsSchema, roleSchema } from "./access-control.schema";

describe("access control validation", () => {
  it("accepts backend permission codes with resource and operation segments", () => {
    expect(
      permissionSchema.safeParse({ code: "church.settings.update", description: "Editar igreja" }).success,
    ).toBe(true);
  });

  it("rejects role codes that are not normalized", () => {
    expect(roleSchema.safeParse({ name: "Gestor", code: "manager", description: "" }).success).toBe(false);
  });

  it("limits bulk role permission assignments", () => {
    expect(
      rolePermissionsSchema.safeParse({
        id: crypto.randomUUID(),
        permissionCodes: Array.from({ length: 101 }, (_, index) => `resource.${index}`),
      }).success,
    ).toBe(false);
  });
});
