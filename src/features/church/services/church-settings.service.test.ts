import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { getApiSession } from "@/lib/auth/api-session";
import { getChurchSettings, saveChurchSettings } from "./church-settings.service";
import { defaultChurchSettings } from "../church-settings.defaults";

vi.mock("server-only", () => ({}));
vi.mock("@/lib/auth/api-session", () => ({ getApiSession: vi.fn() }));

describe("church settings data access", () => {
  beforeEach(() => {
    vi.stubEnv("API_URL", "http://localhost:4000/api/v1");
    vi.stubGlobal("fetch", vi.fn());
    vi.mocked(getApiSession).mockResolvedValue({
      expires: "2099-01-01",
      accessToken: "test-token",
      user: { id: "user", status: "ACTIVE", permissions: [] },
    });
  });
  afterEach(() => {
    vi.unstubAllEnvs();
    vi.unstubAllGlobals();
    vi.clearAllMocks();
  });

  it("does not contact the API before authentication", async () => {
    vi.mocked(getApiSession).mockResolvedValue(null);
    expect(await getChurchSettings()).toMatchObject({ ok: false, status: 401 });
    expect(fetch).not.toHaveBeenCalled();
  });
  it("loads defaults only when a successful response has null settings", async () => {
    vi.mocked(fetch).mockResolvedValue(Response.json({ success: true, data: null, canEdit: true }));
    expect(await getChurchSettings()).toEqual({ ok: true, settings: defaultChurchSettings, canEdit: true });
    expect(fetch).toHaveBeenCalledWith(
      "http://localhost:4000/api/v1/church/settings",
      expect.objectContaining({
        cache: "no-store",
        headers: expect.objectContaining({ Authorization: "Bearer test-token" }),
      }),
    );
  });
  it.each([401, 403, 404, 500])("does not replace HTTP %s failures with defaults", async (status) => {
    vi.mocked(fetch).mockResolvedValue(new Response(null, { status }));
    expect(await getChurchSettings()).toMatchObject({ ok: false, status });
  });
  it("rejects malformed successful responses", async () => {
    vi.mocked(fetch).mockResolvedValue(Response.json({ success: true, data: [] }));
    expect(await getChurchSettings()).toMatchObject({ ok: false });
  });
  it("authenticates writes and respects backend denial", async () => {
    vi.mocked(fetch).mockResolvedValue(new Response(null, { status: 403 }));
    expect(await saveChurchSettings(defaultChurchSettings)).toMatchObject({ ok: false, status: 403 });
    expect(fetch).toHaveBeenCalledWith(expect.any(String), expect.objectContaining({ method: "PUT" }));
  });
});
