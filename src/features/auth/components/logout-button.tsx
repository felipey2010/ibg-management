"use client";

import { LogOut } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";

import { logout } from "@/features/auth/services/auth-client.service";

export function LogoutButton() {
  const router = useRouter();
  const [isPending, setIsPending] = useState(false);

  async function handleLogout() {
    setIsPending(true);
    try {
      await logout();
    } finally {
      router.replace("/login");
      router.refresh();
    }
  }

  return (
    <button
      type="button"
      onClick={handleLogout}
      disabled={isPending}
      aria-label="Sair da plataforma"
      title="Sair"
      className="text-muted-foreground hover:text-foreground disabled:opacity-50"
    >
      <LogOut aria-hidden="true" className="size-4" />
    </button>
  );
}
