"use client";

import { Toast } from "@base-ui/react/toast";
import { CheckCircle2, CircleAlert, X } from "lucide-react";
import { Button } from "@/components/ui/button";

const manager = Toast.createToastManager();
export const toast = {
  success: (title: string) => manager.add({ title, type: "success", priority: "low" }),
  error: (title: string) => manager.add({ title, type: "error", priority: "high", timeout: 8000 }),
};

function ToastViewport() {
  const { toasts } = Toast.useToastManager();
  return (
    <Toast.Portal>
      <Toast.Viewport
        className="fixed right-4 bottom-4 left-4 z-[100] flex flex-col gap-3 outline-none sm:left-auto sm:w-96"
        aria-label="Notificações"
      >
        {toasts.map((item) => (
          <Toast.Root
            key={item.id}
            toast={item}
            className="bg-popover text-popover-foreground flex items-start gap-3 rounded-xl border p-4 shadow-lg outline-none data-ending-style:opacity-0 data-limited:hidden"
          >
            {item.type === "error" ? (
              <CircleAlert aria-hidden className="text-destructive mt-0.5 size-5 shrink-0" />
            ) : (
              <CheckCircle2
                aria-hidden
                className="mt-0.5 size-5 shrink-0 text-emerald-700 dark:text-emerald-400"
              />
            )}
            <Toast.Content className="min-w-0 flex-1">
              <Toast.Title className="text-sm leading-relaxed font-medium" />
            </Toast.Content>
            <Toast.Close render={<Button variant="ghost" size="icon-sm" aria-label="Fechar notificação" />}>
              <X className="size-4" />
            </Toast.Close>
          </Toast.Root>
        ))}
      </Toast.Viewport>
    </Toast.Portal>
  );
}

export function ToastProvider({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <Toast.Provider toastManager={manager} timeout={5000} limit={3}>
      {children}
      <ToastViewport />
    </Toast.Provider>
  );
}
