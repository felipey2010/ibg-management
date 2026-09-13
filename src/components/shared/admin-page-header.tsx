import { buttonVariants } from "@/components/ui/button";
import Link from "next/link";
import { Separator } from "../ui/separator";

export function AdminPageHeader({
  title,
  description,
  current,
}: Readonly<{ title: string; description: string; current: "users" | "access" }>) {
  return (
    <header className="bg-card mb-7 space-y-4 rounded-xl border p-4">
      <div>
        <h1 className="font-serif text-2xl font-semibold tracking-tight sm:text-3xl">{title}</h1>
        <p className="text-muted-foreground mt-2 max-w-2xl text-sm leading-relaxed">{description}</p>
      </div>
      <Separator orientation="horizontal" />
      <nav aria-label="Administração de acesso" className="flex flex-wrap gap-2">
        <Link
          href="/configuracoes/usuarios"
          className={buttonVariants({ variant: current === "users" ? "default" : "secondary" })}
        >
          Usuários
        </Link>
        <Link
          href="/configuracoes/permissoes"
          className={buttonVariants({ variant: current === "access" ? "default" : "secondary" })}
        >
          Perfis e permissões
        </Link>
      </nav>
    </header>
  );
}
