import { beforeEach, describe, expect, it, vi } from "vitest";
import type { JWT } from "next-auth/jwt";
import { requestAuthApi } from "@/features/auth/services/auth-server.service";
import { validateToken } from "./token-lifecycle";

vi.mock("@/features/auth/services/auth-server.service", () => ({ requestAuthApi: vi.fn() }));
const token = (): JWT => ({
  userId: "user",
  status: "ACTIVE",
  permissions: [],
  accessToken: "access",
  refreshToken: "refresh",
  accessTokenExpires: Date.now() + 60_000,
  refreshTokenExpires: Date.now() + 120_000,
});
const me = {
  ok: true,
  status: 200,
  response: {
    success: true,
    message: "ok",
    data: {
      id: "user",
      fullName: "User",
      email: "user@example.com",
      status: "ACTIVE",
      permissions: ["church.settings.update"],
    },
  },
};

describe("session validation", () => {
  beforeEach(() => vi.resetAllMocks());
  it("checks the backend and replaces stale permissions", async () => {
    vi.mocked(requestAuthApi).mockResolvedValue(me);
    expect(await validateToken(token(), false)).toMatchObject({
      permissions: ["church.settings.update"],
      status: "ACTIVE",
    });
    expect(requestAuthApi).toHaveBeenCalledWith("/auth/me", { method: "GET" }, "access");
  });

  it.each([401, 403, 503])("fails closed on backend HTTP %s", async (status) => {
    vi.mocked(requestAuthApi).mockResolvedValue({
      ok: false,
      status,
      response: { success: false, message: "denied" },
    });
    expect(await validateToken(token(), false)).toMatchObject({
      status: "INACTIVE",
      error: "SessionExpired",
      accessToken: undefined,
      refreshToken: undefined,
    });
  });

  it("renews an expired access token and validates the new one", async () => {
    vi.mocked(requestAuthApi)
      .mockResolvedValueOnce({
        ok: true,
        status: 200,
        response: {
          success: true,
          message: "ok",
          data: {
            accessToken: "new-access",
            refreshToken: "new-refresh",
            expiresIn: "15m",
            refreshExpiresIn: "30d",
          },
        },
      })
      .mockResolvedValueOnce(me);
    const result = await validateToken({ ...token(), accessTokenExpires: Date.now() - 1 }, true);
    expect(result).toMatchObject({
      status: "ACTIVE",
      accessToken: "new-access",
      refreshToken: "new-refresh",
    });
    expect(result.accessTokenExpires).toBeGreaterThan(Date.now());
    expect(requestAuthApi).toHaveBeenLastCalledWith("/auth/me", { method: "GET" }, "new-access");
  });

  it("never rotates tokens in read-only server rendering", async () => {
    expect(await validateToken({ ...token(), accessTokenExpires: 0 }, false)).toMatchObject({
      error: "SessionExpired",
    });
    expect(requestAuthApi).not.toHaveBeenCalled();
  });

  it("expires the session when both tokens are expired", async () => {
    expect(
      await validateToken({ ...token(), accessTokenExpires: 0, refreshTokenExpires: 0 }, true),
    ).toMatchObject({ error: "SessionExpired" });
    expect(requestAuthApi).not.toHaveBeenCalled();
  });

  it("does not retain an active session after failed refresh", async () => {
    vi.mocked(requestAuthApi).mockResolvedValue({
      ok: false,
      status: 401,
      response: { success: false, message: "expired" },
    });
    expect(await validateToken({ ...token(), accessTokenExpires: 0 }, true)).toMatchObject({
      status: "INACTIVE",
      error: "SessionExpired",
      refreshToken: undefined,
    });
  });

  it("rejects a backend user that differs from the session owner", async () => {
    vi.mocked(requestAuthApi).mockResolvedValue({
      ...me,
      response: { ...me.response, data: { ...me.response.data, id: "other" } },
    });
    expect(await validateToken(token(), false)).toMatchObject({ error: "SessionExpired" });
  });
});
