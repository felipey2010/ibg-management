import { buttonVariants } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { FileQuestion } from "lucide-react";
import Link from "next/link";

export default function NotFound() {
  return (
    <main className="bg-background text-foreground flex min-h-dvh items-center justify-center px-4 py-12">
      <Card className="w-full max-w-2xl border-dashed">
        <CardContent className="flex flex-col items-center px-6 py-14 text-center">
          <div className="bg-primary/10 text-primary mb-5 flex size-16 items-center justify-center rounded-full">
            <FileQuestion className="size-8" aria-hidden="true" />
          </div>
          <p className="text-muted-foreground font-mono text-xs tracking-[0.25em] uppercase">Erro 404</p>
          <h1 className="font-heading mt-3 text-3xl font-semibold sm:text-4xl">Página não encontrada</h1>
          <p className="text-muted-foreground mt-3 max-w-md text-sm leading-6">
            O endereço informado não existe ou a página foi movida.
          </p>
          <Link href="/" className={buttonVariants({ className: "mt-7" })}>
            Ir para o início
          </Link>
        </CardContent>
      </Card>
    </main>
  );
}
