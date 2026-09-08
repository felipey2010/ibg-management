"use client";
import { useTransition } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { toast } from "@/components/ui/toast";
import type { AdminResult } from "@/lib/api/admin-api";

export function showAdminError(result: Extract<AdminResult, { ok: false }>) {
  toast.error(result.message);
  if (result.status === 401) window.location.replace("/login?error=session");
  if (result.status === 403) window.location.replace("/");
}

export function AdminLoadError({ message }: Readonly<{ message: string }>) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  return (
    <div className="bg-card space-y-4 rounded-xl border p-6">
      <p role="alert" className="text-sm">
        {message}
      </p>
      <Button variant="outline" disabled={pending} onClick={() => startTransition(() => router.refresh())}>
        {pending ? "Carregando…" : "Tentar novamente"}
      </Button>
    </div>
  );
}
