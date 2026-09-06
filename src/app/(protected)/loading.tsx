import { Skeleton } from "@/components/ui/skeleton";

export default function ProtectedLoading() {
  return (
    <div role="status" aria-label="Carregando configurações da igreja" className="space-y-6 p-8">
      <Skeleton className="h-9 w-64" />
      <Skeleton className="h-64 w-full" />
      <span className="sr-only">Carregando…</span>
    </div>
  );
}
