import { CircleAlert } from "lucide-react";

export function FormMessage({ children }: Readonly<{ children?: React.ReactNode }>) {
  if (!children) return null;

  return (
    <div
      role="alert"
      aria-live="polite"
      className="border-destructive/30 bg-destructive/10 text-destructive flex gap-2 rounded-lg border px-3 py-2.5 text-xs"
    >
      <CircleAlert aria-hidden="true" className="mt-0.5 size-4 shrink-0" />
      <span>{children}</span>
    </div>
  );
}
