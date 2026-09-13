import AvatarPhoto from "@/components/shared/avatar-photo";
import { PaginationControls } from "@/components/shared/pagination-controls";
import { buttonVariants } from "@/components/ui/button";
import { Mail, Phone, UserRoundSearch } from "lucide-react";
import Link from "next/link";
import type { MemberQuery } from "../member.schema";
import type { MemberPage } from "../member.types";
import { MemberFilters } from "./member-filters";
import { MemberStatusBadge } from "./member-status-badge";

export function MemberDirectory({ page, query }: Readonly<{ page: MemberPage; query: MemberQuery }>) {
  const totalPages = Math.max(1, Math.ceil(page.pagination.total / page.pagination.limit));
  const href = (number: number) => {
    const params = new URLSearchParams({ page: String(number) });
    if (query.search) params.set("search", query.search);
    if (query.status) params.set("status", query.status);
    return `/membros?${params}`;
  };

  return (
    <div className="space-y-5">
      <MemberFilters query={query} />
      <section className="bg-card overflow-hidden rounded-xl border" aria-label="Diretório de membros">
        <header className="border-b px-5 py-4 text-sm">
          <strong>{page.pagination.total.toLocaleString("pt-BR")}</strong>{" "}
          <span className="text-muted-foreground">membros encontrados</span>
        </header>
        {page.data.length ? (
          <ul className="divide-y">
            {page.data.map((member) => {
              const name = `${member.first_name} ${member.last_name}`;
              return (
                <li
                  key={member.id}
                  className="hover:bg-muted/25 flex flex-col gap-4 p-5 transition-colors sm:flex-row sm:items-center"
                >
                  <AvatarPhoto name={name} className="size-11 shrink-0" fallbackClassName="text-sm" />
                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <h2 className="font-semibold">{name}</h2>
                      <MemberStatusBadge status={member.membership_status} />
                    </div>
                    <div className="text-muted-foreground mt-2 flex flex-col gap-1 text-xs md:flex-row md:gap-5">
                      <span>
                        <Mail className="mr-1 inline size-3.5" />
                        {member.email || "E-mail não informado"}
                      </span>
                      <span>
                        <Phone className="mr-1 inline size-3.5" />
                        {member.phone || "Telefone não informado"}
                      </span>
                    </div>
                  </div>
                  <Link href={`/membros/${member.id}`} className={buttonVariants({ variant: "outline" })}>
                    Ver perfil
                  </Link>
                </li>
              );
            })}
          </ul>
        ) : (
          <div className="flex flex-col items-center p-14 text-center">
            <UserRoundSearch className="text-muted-foreground size-9" />
            <h2 className="mt-4 font-semibold">Nenhum membro encontrado</h2>
            <p className="text-muted-foreground mt-1 text-sm">
              Ajuste os filtros ou cadastre o primeiro membro.
            </p>
          </div>
        )}
        <PaginationControls
          currentPage={query.page}
          totalPages={totalPages}
          getPageHref={href}
          className="border-t px-5 py-4"
        />
      </section>
    </div>
  );
}
