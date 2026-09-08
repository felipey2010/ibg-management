import { beforeEach, describe, expect, it, vi } from "vitest";
import { getApiSession } from "@/lib/auth/api-session";
import Page from "@/app/(protected)/configuracoes/igreja/page";
import { redirect } from "next/navigation";

vi.mock("@/lib/auth/api-session", () => ({ getApiSession: vi.fn() }));
vi.mock("next/navigation", () => ({
  redirect: vi.fn((path: string) => {
    throw new Error(`redirect:${path}`);
  }),
}));
vi.mock("./components/church-settings-form", () => ({ ChurchSettingsForm: () => null }));

describe("settings page authorization independent of proxy", () => {
  beforeEach(() => vi.resetAllMocks());

  it("redirects unauthenticated direct access", async () => {
    vi.mocked(getApiSession).mockResolvedValue(null);
    await expect(Page()).rejects.toThrow("redirect:/login?error=session");
  });

  it("redirects an active user without edit permission", async () => {
    vi.mocked(getApiSession).mockResolvedValue({
      expires: "2099",
      user: { id: "user", status: "ACTIVE", permissions: [] },
    });
    await expect(Page()).rejects.toThrow("redirect:/");
    expect(redirect).toHaveBeenCalledWith("/");
  });

  it("allows a permitted user", async () => {
    vi.mocked(getApiSession).mockResolvedValue({
      expires: "2099",
      user: { id: "user", status: "ACTIVE", permissions: ["church.settings.update"] },
    });
    expect(await Page()).toBeTruthy();
    expect(redirect).not.toHaveBeenCalled();
  });
});
