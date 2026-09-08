"use client";
import { useState } from "react";
import Link from "next/link";
import { ChevronLeft, ChevronRight, UsersRound } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { getInitials } from "@/lib/utils";
import { useChurchSettings } from "@/features/church/components/church-settings-provider";
import type { Role } from "@/features/access-control/access-control.types";
import type { UserPage } from "../user.types";
import type { UserQuery } from "../user.schema";
import { UserStatusBadge } from "./user-status-badge";
import { UserAccessPanel } from "./user-access-panel";
import { UserFilters } from "./user-filters";

export function UserDirectory({
  users,
  roles,
  query,
  currentUserId,
}: Readonly<{ users: UserPage; roles: Role[]; query: UserQuery; currentUserId: string }>) {
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const selected = users.data.find((user) => user.id === selectedId);
  const { settings } = useChurchSettings();
  const formatter = new Intl.DateTimeFormat("pt-BR", {
    dateStyle: "short",
    timeStyle: "short",
    timeZone: settings.timezone,
  });
  const totalPages = Math.max(1, Math.ceil(users.pagination.total / users.pagination.limit));
  const pageHref = (page: number) => {
    const params = new URLSearchParams({ page: String(page) });
    if (query.search) params.set("search", query.search);
    if (query.status) params.set("status", query.status);
    return `/configuracoes/usuarios?${params}`;
  };

  return (
    <div className="space-y-5">
      <UserFilters query={query} />
      <section className="bg-card overflow-hidden rounded-xl border" aria-label="Lista de usuários">
        <div className="border-b px-5 py-4 text-sm">
          <span className="font-semibold">{users.pagination.total.toLocaleString("pt-BR")}</span>{" "}
          <span className="text-muted-foreground">usuários encontrados</span>
        </div>
        {users.data.length ? (
          <>
            <div
              className="text-muted-foreground bg-muted/40 hidden grid-cols-[minmax(0,2fr)_1fr_1.4fr_1fr_auto] gap-4 px-5 py-3 text-xs font-medium lg:grid"
              aria-hidden
            >
              <span>Usuário</span>
              <span>Status</span>
              <span>Perfis de acesso</span>
              <span>Último acesso</span>
              <span className="w-20" />
            </div>
            <ul className="divide-y">
              {users.data.map((user) => (
                <li
                  key={user.id}
                  className="hover:bg-muted/25 grid gap-4 px-5 py-5 transition-colors lg:grid-cols-[minmax(0,2fr)_1fr_1.4fr_1fr_auto] lg:items-center"
                >
                  <div className="flex min-w-0 items-center gap-3">
                    <span className="bg-muted text-foreground flex size-10 shrink-0 items-center justify-center rounded-lg text-xs font-semibold">
                      {getInitials(user.fullName)}
                    </span>
                    <div className="min-w-0">
                      <p className="truncate text-sm font-semibold">
                        {user.fullName}
                        {user.id === currentUserId ? (
                          <span className="text-muted-foreground ml-2 text-xs font-normal">Você</span>
                        ) : null}
                      </p>
                      <p className="text-muted-foreground truncate text-xs">{user.email}</p>
                    </div>
                  </div>
                  <UserStatusBadge status={user.status} />
                  <div className="flex min-w-0 flex-wrap gap-1.5">
                    {user.roles.length ? (
                      user.roles.map((role) => (
                        <Badge key={role.id} variant="outline" className="max-w-full truncate">
                          {role.name}
                        </Badge>
                      ))
                    ) : (
                      <span className="text-muted-foreground text-xs">Sem perfil</span>
                    )}
                  </div>
                  <p className="text-muted-foreground text-xs">
                    <span className="mr-1 lg:hidden">Último acesso:</span>
                    {user.lastLoginAt ? formatter.format(new Date(user.lastLoginAt)) : "Ainda não acessou"}
                  </p>
                  <Button
                    variant="outline"
                    className="w-full lg:w-20"
                    onClick={() => setSelectedId(user.id)}
                    aria-label={`Gerenciar ${user.fullName}`}
                  >
                    Gerenciar
                  </Button>
                </li>
              ))}
            </ul>
          </>
        ) : (
          <div className="flex flex-col items-center gap-3 px-6 py-16 text-center">
            <UsersRound aria-hidden className="text-muted-foreground size-8" />
            <h2 className="font-semibold">Nenhum usuário encontrado</h2>
            <p className="text-muted-foreground max-w-sm text-sm">
              Ajuste os filtros ou aguarde novos cadastros para gerenciar o acesso à plataforma.
            </p>
          </div>
        )}
        {totalPages > 1 && (
          <footer className="flex flex-wrap items-center justify-between gap-3 border-t px-5 py-4">
            <p className="text-muted-foreground text-xs">
              Página {query.page} de {totalPages}
            </p>
            <div className="flex gap-2">
              {query.page > 1 ? (
                <Button variant="outline" size="sm" render={<Link href={pageHref(query.page - 1)} />}>
                  <ChevronLeft className="size-4" /> Anterior
                </Button>
              ) : (
                <Button variant="outline" size="sm" disabled>
                  <ChevronLeft className="size-4" /> Anterior
                </Button>
              )}
              {query.page < totalPages ? (
                <Button variant="outline" size="sm" render={<Link href={pageHref(query.page + 1)} />}>
                  Próxima <ChevronRight className="size-4" />
                </Button>
              ) : (
                <Button variant="outline" size="sm" disabled>
                  Próxima <ChevronRight className="size-4" />
                </Button>
              )}
            </div>
          </footer>
        )}
      </section>
      {selected ? (
        <UserAccessPanel
          key={selected.id}
          user={selected}
          roles={roles}
          currentUserId={currentUserId}
          onClose={() => setSelectedId(null)}
        />
      ) : null}
    </div>
  );
}
