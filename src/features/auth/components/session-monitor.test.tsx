import { act, cleanup, render } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { SessionMonitor } from "./session-monitor";
import { SessionRenewal } from "./session-renewal";
import { checkBrowserSession, redirectBrowser } from "../services/session-client.service";

const refresh = vi.hoisted(() => vi.fn());
vi.mock("next/navigation", () => ({ useRouter: () => ({ refresh }) }));
vi.mock("../services/session-client.service", () => ({
  checkBrowserSession: vi.fn(),
  redirectBrowser: vi.fn(),
}));
const session = () => ({
  expires: "2099",
  accessTokenExpires: Date.now() + 1500,
  user: { id: "user", status: "ACTIVE" as const, permissions: [] },
});

describe("automatic session renewal and expiry navigation", () => {
  beforeEach(() => {
    vi.resetAllMocks();
    vi.useFakeTimers();
  });
  afterEach(() => {
    cleanup();
    vi.useRealTimers();
  });

  it("automatically sends an expired idle session to login", async () => {
    vi.mocked(checkBrowserSession).mockResolvedValueOnce(session()).mockResolvedValueOnce(null);
    render(<SessionMonitor userId="user" permissions={[]} />);
    await act(async () => {});
    await act(async () => {
      await vi.advanceTimersByTimeAsync(1600);
    });
    expect(redirectBrowser).toHaveBeenCalledWith(expect.stringContaining("/login?error=session"));
  });

  it("keeps the user on the page after successful renewal", async () => {
    vi.mocked(checkBrowserSession)
      .mockResolvedValueOnce(session())
      .mockImplementation(async () => session());
    render(<SessionMonitor userId="user" permissions={[]} />);
    await act(async () => {});
    await act(async () => {
      await vi.advanceTimersByTimeAsync(1600);
    });
    expect(checkBrowserSession).toHaveBeenCalledTimes(2);
    expect(redirectBrowser).not.toHaveBeenCalled();
  });

  it("refreshes the server UI after permissions change", async () => {
    vi.mocked(checkBrowserSession).mockResolvedValue(session());
    render(<SessionMonitor userId="user" permissions={["church.settings.update"]} />);
    await act(async () => {});
    expect(refresh).toHaveBeenCalled();
  });

  it("returns to the requested route after cookie renewal", async () => {
    vi.mocked(checkBrowserSession).mockResolvedValue(session());
    render(<SessionRenewal redirectTo="/configuracoes/igreja" />);
    await act(async () => {});
    expect(redirectBrowser).toHaveBeenCalledWith("/configuracoes/igreja");
  });

  it("does not return to a protected route after rejected renewal", async () => {
    vi.mocked(checkBrowserSession).mockResolvedValue({ ...session(), error: "SessionExpired" });
    render(<SessionRenewal redirectTo="/configuracoes/igreja" />);
    await act(async () => {});
    expect(redirectBrowser).toHaveBeenCalledWith("/login?error=session&redirectTo=%2Fconfiguracoes%2Figreja");
  });
});
