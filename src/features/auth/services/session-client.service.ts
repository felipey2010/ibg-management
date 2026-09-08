"use client";
import { getSession } from "next-auth/react";

let pending: ReturnType<typeof getSession> | undefined;

// Serialize refreshes across tabs where Web Locks are supported. NextAuth persists
// the rotated cookie before the next caller reads the session.
export function checkBrowserSession() {
  if (!pending) {
    pending = (async () =>
      navigator.locks
        ? await navigator.locks.request("ibg-session", () => getSession())
        : await getSession())().finally(() => {
      pending = undefined;
    });
  }
  return pending;
}

export function redirectBrowser(path: string) {
  window.location.replace(path);
}
