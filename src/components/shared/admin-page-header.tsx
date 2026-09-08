import { buttonVariants } from "@/components/ui/button";
import Link from "next/link";

export function AdminPageHeader({
  title,
  description,
  current,
}: Readonly<{ title: string; description: string; current: "users" | "access" }>) {
  return (
    <header className="mb-7 space-y-5">
      <div>
        <h1 className="font-serif text-2xl font-semibold tracking-tight sm:text-3xl">{title}</h1>
        <p className="text-muted-foreground mt-2 max-w-2xl text-sm leading-relaxed">{description}</p>
      </div>
      <nav aria-label="Administração de acesso" className="flex flex-wrap gap-2">
        <Link
          href="/configuracoes/usuarios"
          className={buttonVariants({ variant: current === "users" ? "default" : "outline" })}
        >
          Usuários
        </Link>
        <Link
          href="/configuracoes/permissoes"
          className={buttonVariants({ variant: current === "access" ? "default" : "outline" })}
        >
          Perfis e permissões
        </Link>
      </nav>
    </header>
  );
}
