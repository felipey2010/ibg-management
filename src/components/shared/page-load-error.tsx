"use client";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
export function PageLoadError({ message }: Readonly<{ message: string }>) {
  const router = useRouter();
  return (
    <div className="bg-card rounded-xl border p-8 text-center">
      <p role="alert" className="text-sm">
        {message}
      </p>
      <Button className="mt-4" variant="outline" onClick={() => router.refresh()}>
        Tentar novamente
      </Button>
    </div>
  );
}
