"use client";
import { useEffect } from "react";
import { checkBrowserSession, redirectBrowser } from "../services/session-client.service";
import { safeRedirectPath } from "@/lib/auth/redirect-path";
import { useRouter } from "next/navigation";

export function SessionMonitor({ permissions, userId }: Readonly<{ permissions: string[]; userId: string }>) {
  const router = useRouter();
  const permissionKey = [...permissions].sort().join("\0");

  useEffect(() => {
    let stopped = false;
    let checking = false;
    let timer: ReturnType<typeof setTimeout>;

    async function check() {
      if (stopped || checking) return;
      checking = true;
      clearTimeout(timer);
      try {
        const session = await checkBrowserSession();
        if (stopped) return;
        if (!session || session.error || session.user.status !== "ACTIVE") {
          redirectBrowser(
            `/login?error=session&redirectTo=${encodeURIComponent(safeRedirectPath(window.location.pathname + window.location.search))}`,
          );
          return;
        }
        if (session.user.id !== userId || [...session.user.permissions].sort().join("\0") !== permissionKey)
          router.refresh();
        timer = setTimeout(
          check,
          Math.max(1000, Math.min(60_000, (session.accessTokenExpires ?? Date.now()) - Date.now() + 100)),
        );
      } catch {
        if (!stopped) redirectBrowser("/login?error=service");
      } finally {
        checking = false;
      }
    }

    function onVisible() {
      if (document.visibilityState === "visible") void check();
    }

    void check();
    document.addEventListener("visibilitychange", onVisible);
    return () => {
      stopped = true;
      clearTimeout(timer);
      document.removeEventListener("visibilitychange", onVisible);
    };
  }, [router, permissionKey, userId]);
  return null;
}
