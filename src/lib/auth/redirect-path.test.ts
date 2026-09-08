import { describe, expect, it } from "vitest";
import { safeRedirectPath } from "./redirect-path";

describe("safe return destinations", () => {
  it.each([
    "https://evil.example",
    "//evil.example",
    "/\\evil.example",
    "/login",
    "/renovar-sessao",
    "/api/auth/signout",
    "/\n/evil.example",
  ])("rejects %s", (path) => {
    expect(safeRedirectPath(path)).toBe("/");
  });

  it("preserves local route filters", () =>
    expect(safeRedirectPath("/membros?page=2")).toBe("/membros?page=2"));
});
