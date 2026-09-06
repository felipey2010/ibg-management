import { buttonVariants } from "@/components/ui/button";
import { siteConfig } from "@/config/site";
import { cn } from "@/lib/utils";
import { ArrowLeft } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

function LegalPageLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="bg-muted/20 flex min-h-dvh flex-col">
      <header className="bg-background/95 px:4 sticky top-0 z-40 col-span-full flex h-14 items-center justify-between border-b backdrop-blur sm:px-8">
        <div className="flex h-full w-full items-center px-4 md:w-54">
          <Link href="/" className="flex items-center gap-2.5">
            <Image src={siteConfig.logo} alt={siteConfig.name} width={28} height={28} />
            <div>
              <strong className="block text-sm leading-none">{siteConfig.name}</strong>
              <span className="text-muted-foreground mt-1 block font-mono text-[8px] tracking-[.2em] uppercase">
                {siteConfig.description}
              </span>
            </div>
          </Link>
        </div>
      </header>
      <main className="mx-auto w-full max-w-3xl flex-1 px-4 py-10 sm:py-14">
        <Link
          href="/"
          className={cn(
            buttonVariants({ variant: "ghost" }),
            "text-muted-foreground hover:text-foreground mb-2 flex w-fit items-center gap-2 text-xs",
          )}
        >
          <ArrowLeft size={15} />
          Voltar ao sistema
        </Link>
        {children}
      </main>
      <footer className="bg-card text-muted-foreground flex flex-col gap-3 border-t px-4 py-5 text-[11px] sm:flex-row sm:items-center sm:justify-between sm:px-8">
        <span>© 2026 {siteConfig.name}</span>
        <nav className="flex gap-5">
          <Link href="/privacy" className="hover:text-foreground">
            Política de Privacidade
          </Link>
          <Link href="/terms" className="hover:text-foreground">
            Termos de Serviço
          </Link>
        </nav>
      </footer>
    </div>
  );
}

export default LegalPageLayout;
