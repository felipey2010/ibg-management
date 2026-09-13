"use client";
import { useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "@/components/ui/toast";
import { showAdminError } from "@/components/shared/admin-feedback";
import type { AdminResult } from "@/lib/api/admin-api";

export function useAdminMutation() {
  const [pending, setPending] = useState(false);
  const busy = useRef(false);
  const router = useRouter();

  async function execute(
    operation: () => Promise<AdminResult<unknown>>,
    message: string,
    onSuccess?: () => void,
  ) {
    if (busy.current) return false;
    busy.current = true;
    setPending(true);
    try {
      const result = await operation();
      if (!result.ok) {
        showAdminError(result);
        return false;
      }
      toast.success(message);
      onSuccess?.();
      router.refresh();
      return true;
    } catch {
      toast.error("Não foi possível concluir a operação. Tente novamente.");
      return false;
    } finally {
      busy.current = false;
      setPending(false);
    }
  }

  return { pending, execute };
}
