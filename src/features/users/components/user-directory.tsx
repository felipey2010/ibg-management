"use client";
import AvatarPhoto from "@/components/shared/avatar-photo";
import { PaginationControls } from "@/components/shared/pagination-controls";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import type { Role } from "@/features/access-control/access-control.types";
import { useChurchSettings } from "@/features/church/components/church-settings-provider";
import { Settings, UsersRound } from "lucide-react";
import { useState } from "react";
import type { UserQuery } from "../user.schema";
import type { UserPage } from "../user.types";
import { UserAccessPanel } from "./user-access-panel";
import { UserFilters } from "./user-filters";
import { UserStatusBadge } from "./user-status-badge";

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
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Usuário</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Perfis de acesso</TableHead>
                <TableHead>Último acesso</TableHead>
                <TableHead>Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {users.data.map((user) => (
                <TableRow key={user.id}>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <AvatarPhoto name={user.fullName} className="size-10 rounded-lg" />
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
                  </TableCell>
                  <TableCell>
                    <UserStatusBadge status={user.status} />
                  </TableCell>
                  <TableCell>
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
                  </TableCell>
                  <TableCell>
                    <p className="text-muted-foreground text-xs">
                      <span className="mr-1 lg:hidden">Último acesso:</span>
                      {user.lastLoginAt ? formatter.format(new Date(user.lastLoginAt)) : "Ainda não acessou"}
                    </p>
                  </TableCell>
                  <TableCell>
                    <Button
                      variant="ghost"
                      size="icon-sm"
                      onClick={() => setSelectedId(user.id)}
                      aria-label={`Gerenciar ${user.fullName}`}
                      title={`Gerenciar ${user.fullName}`}
                    >
                      <Settings />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        ) : (
          <div className="flex flex-col items-center gap-3 px-6 py-16 text-center">
            <UsersRound aria-hidden className="text-muted-foreground size-8" />
            <h2 className="font-semibold">Nenhum usuário encontrado</h2>
            <p className="text-muted-foreground max-w-sm text-sm">
              Ajuste os filtros ou aguarde novos cadastros para gerenciar o acesso à plataforma.
            </p>
          </div>
        )}
        <PaginationControls
          currentPage={query.page}
          totalPages={totalPages}
          getPageHref={pageHref}
          className="border-t px-5 py-4"
        />
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
