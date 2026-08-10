import { BookOpen, CalendarDays, CircleDollarSign, FileText, Megaphone, UsersRound } from "lucide-react";

import { Brand } from "@/components/layout/brand";

const modules = [
  { icon: UsersRound, label: "Membros e ministérios", detail: "Pessoas e equipes em um só lugar" },
  { icon: Megaphone, label: "Avisos", detail: "Comunicação direcionada" },
  { icon: CalendarDays, label: "Eventos", detail: "Agenda e participantes" },
  { icon: CircleDollarSign, label: "Contribuições", detail: "Campanhas e compromissos" },
  { icon: BookOpen, label: "Estudos bíblicos", detail: "Grupos, presença e materiais" },
  { icon: FileText, label: "Documentos", detail: "Acesso organizado e seguro" },
] as const;

export function ModuleShowcase() {
  return (
    <aside className="border-sidebar-border bg-sidebar relative hidden min-h-dvh overflow-hidden border-r p-10 lg:flex lg:flex-col xl:p-14">
      <div className="bg-primary/10 absolute -top-40 -left-40 size-96 rounded-full blur-3xl" />
      <div className="relative">
        <Brand />
      </div>
      <div className="relative my-auto max-w-2xl py-12">
        <p className="text-primary text-xs font-semibold tracking-[0.18em] uppercase">Gestão com propósito</p>
        <h1 className="mt-4 max-w-xl font-serif text-4xl leading-tight font-semibold tracking-tight xl:text-5xl">
          Cuidar da comunidade começa com informação bem organizada.
        </h1>
        <p className="text-muted-foreground mt-5 max-w-xl text-sm leading-6">
          Uma plataforma administrativa para apoiar pessoas, ministérios e cada atividade da igreja.
        </p>
        <div className="mt-10 grid gap-3 xl:grid-cols-2">
          {modules.map((module) => {
            const Icon = module.icon;
            return (
              <div key={module.label} className="border-sidebar-border flex items-center gap-3 border-t py-3">
                <span className="bg-primary/10 text-primary flex size-9 shrink-0 items-center justify-center rounded-lg">
                  <Icon aria-hidden="true" className="size-4" />
                </span>
                <span>
                  <span className="block text-sm font-semibold">{module.label}</span>
                  <span className="text-muted-foreground mt-0.5 block text-xs">{module.detail}</span>
                </span>
              </div>
            );
          })}
        </div>
      </div>
      <blockquote className="border-primary text-muted-foreground relative border-l-2 pl-4 text-sm leading-5">
        “Tudo, porém, seja feito com decência e ordem.”
        <cite className="text-tertiary mt-1 block not-italic">1 Coríntios 14:40 (NVI)</cite>
      </blockquote>
    </aside>
  );
}
