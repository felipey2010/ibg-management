"use client";
import { useEffect } from "react";
import { checkBrowserSession, redirectBrowser } from "../services/session-client.service";
import { safeRedirectPath } from "@/lib/auth/redirect-path";

export function SessionRenewal({ redirectTo }: Readonly<{ redirectTo?: string }>) {
  useEffect(() => {
    let stopped = false;
    const destination = safeRedirectPath(redirectTo);

    async function renew() {
      try {
        const session = await checkBrowserSession();
        if (stopped) return;
        redirectBrowser(
          session && !session.error && session.user.status === "ACTIVE"
            ? destination
            : `/login?error=session&redirectTo=${encodeURIComponent(destination)}`,
        );
      } catch {
        if (!stopped) redirectBrowser("/login?error=service");
      }
    }

    void renew();
    return () => {
      stopped = true;
    };
  }, [redirectTo]);

  return (
    <p role="status" className="p-6 text-center">
      Validando sua sessão…
    </p>
  );
}
