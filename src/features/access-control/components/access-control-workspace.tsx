"use client";

import { useState } from "react";
import { KeyRound, LockKeyhole, Pencil, Plus, ShieldCheck, Trash2, UsersRound } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ConfirmationDialog } from "@/components/shared/confirmation-dialog";
import { PaginationControls } from "@/components/shared/pagination-controls";
import { useAdminMutation } from "@/hooks/use-admin-mutation";
import { deleteAccessRecord } from "../actions";
import type { Permission, Role } from "../access-control.types";
import { AccessRecordDialog } from "./access-record-dialog";
import { RolePermissionsDialog } from "./role-permissions-dialog";

type EditState = { kind: "role"; record?: Role } | { kind: "permission"; record?: Permission } | null;
type DeleteState = { kind: "roles" | "permissions"; id: string; label: string } | null;
const ROLE_PAGE_SIZE = 5;
const PERMISSION_PAGE_SIZE = 8;

export function AccessControlWorkspace({
  roles,
  permissions,
}: Readonly<{ roles: Role[]; permissions: Permission[] }>) {
  const [edit, setEdit] = useState<EditState>(null);
  const [permissionRole, setPermissionRole] = useState<Role | null>(null);
  const [remove, setRemove] = useState<DeleteState>(null);
  const [rolePage, setRolePage] = useState(1);
  const [permissionPage, setPermissionPage] = useState(1);
  const { pending, execute } = useAdminMutation();
  const rolePages = Math.max(1, Math.ceil(roles.length / ROLE_PAGE_SIZE));
  const permissionPages = Math.max(1, Math.ceil(permissions.length / PERMISSION_PAGE_SIZE));
  const currentRolePage = Math.min(rolePage, rolePages);
  const currentPermissionPage = Math.min(permissionPage, permissionPages);
  const visibleRoles = roles.slice((currentRolePage - 1) * ROLE_PAGE_SIZE, currentRolePage * ROLE_PAGE_SIZE);
  const visiblePermissions = permissions.slice(
    (currentPermissionPage - 1) * PERMISSION_PAGE_SIZE,
    currentPermissionPage * PERMISSION_PAGE_SIZE,
  );

  return (
    <div className="grid gap-6 xl:grid-cols-[minmax(0,1.2fr)_minmax(22rem,.8fr)]">
      <section className="bg-card h-fit overflow-hidden rounded-xl border" aria-labelledby="roles-heading">
        <header className="flex items-start justify-between gap-4 border-b p-5 sm:p-6">
          <div>
            <h2 id="roles-heading" className="flex items-center gap-2 font-semibold">
              <ShieldCheck className="size-4" aria-hidden /> Perfis de acesso
            </h2>
            <p className="text-muted-foreground mt-1 text-xs">{roles.length} perfis configurados</p>
          </div>
          <Button onClick={() => setEdit({ kind: "role" })}>
            <Plus className="size-4" /> Novo perfil
          </Button>
        </header>
        {roles.length ? (
          <ul className="divide-y">
            {visibleRoles.map((role) => {
              const permissionCount = role.role_permissions.length;
              return (
                <li key={role.id} className="space-y-4 p-5 sm:p-6">
                  <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-start">
                    <div className="min-w-0">
                      <div className="flex flex-wrap items-center gap-2">
                        <h3 className="font-semibold">{role.name}</h3>
                        {role.is_system_role ? (
                          <Badge variant="secondary">
                            <LockKeyhole className="size-3" /> Sistema
                          </Badge>
                        ) : null}
                      </div>
                      <p className="text-muted-foreground mt-1 font-mono text-xs break-all">{role.code}</p>
                      <p className="text-muted-foreground mt-3 max-w-xl text-sm leading-relaxed">
                        {role.description || "Sem descrição."}
                      </p>
                    </div>
                    <div className="flex shrink-0 gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setEdit({ kind: "role", record: role })}
                      >
                        <Pencil className="size-4" /> Editar
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon-sm"
                        disabled={role.is_system_role}
                        aria-label={`Excluir perfil ${role.name}`}
                        onClick={() => setRemove({ kind: "roles", id: role.id, label: role.name })}
                      >
                        <Trash2 className="size-4" />
                      </Button>
                    </div>
                  </div>
                  <div className="bg-muted/45 flex flex-wrap items-center justify-between gap-3 rounded-lg px-4 py-3">
                    <div className="text-muted-foreground flex flex-wrap gap-x-5 gap-y-1 text-xs">
                      <span>
                        <KeyRound className="mr-1 inline size-3.5" /> {permissionCount} permissões
                      </span>
                      <span>
                        <UsersRound className="mr-1 inline size-3.5" /> {role._count.user_roles} usuários
                      </span>
                    </div>
                    <Button variant="outline" size="sm" onClick={() => setPermissionRole(role)}>
                      Gerenciar permissões
                    </Button>
                  </div>
                </li>
              );
            })}
          </ul>
        ) : (
          <EmptyState
            title="Nenhum perfil configurado"
            description="Crie um perfil para começar a organizar as permissões."
          />
        )}
        <PaginationControls
          currentPage={currentRolePage}
          totalPages={rolePages}
          onPageChange={setRolePage}
          className="border-t px-5 py-4"
        />
      </section>

      <section
        className="bg-card h-fit overflow-hidden rounded-xl border"
        aria-labelledby="permissions-heading"
      >
        <header className="flex items-start justify-between gap-4 border-b p-5 sm:p-6">
          <div>
            <h2 id="permissions-heading" className="flex items-center gap-2 font-semibold">
              <KeyRound className="size-4" aria-hidden /> Catálogo de permissões
            </h2>
            <p className="text-muted-foreground mt-1 text-xs">{permissions.length} operações disponíveis</p>
          </div>
          <Button variant="outline" onClick={() => setEdit({ kind: "permission" })}>
            <Plus className="size-4" /> Nova
          </Button>
        </header>
        {permissions.length ? (
          <ul className="divide-y">
            {visiblePermissions.map((permission) => (
              <li key={permission.id} className="group flex items-start justify-between gap-3 p-4 sm:px-6">
                <div className="min-w-0">
                  <p className="font-mono text-xs font-semibold break-all">{permission.code}</p>
                  <p className="text-muted-foreground mt-1 text-xs leading-relaxed">
                    {permission.description || "Sem descrição."}
                  </p>
                </div>
                <div className="flex shrink-0 gap-1">
                  <Button
                    variant="ghost"
                    size="icon-sm"
                    aria-label={`Editar permissão ${permission.code}`}
                    onClick={() => setEdit({ kind: "permission", record: permission })}
                  >
                    <Pencil className="size-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon-sm"
                    aria-label={`Excluir permissão ${permission.code}`}
                    onClick={() =>
                      setRemove({ kind: "permissions", id: permission.id, label: permission.code })
                    }
                  >
                    <Trash2 className="size-4" />
                  </Button>
                </div>
              </li>
            ))}
          </ul>
        ) : (
          <EmptyState
            title="Nenhuma permissão cadastrada"
            description="Cadastre os códigos de operação usados pelo backend."
          />
        )}
        <PaginationControls
          currentPage={currentPermissionPage}
          totalPages={permissionPages}
          onPageChange={setPermissionPage}
          className="border-t px-5 py-4"
        />
      </section>

      {edit?.kind === "role" ? (
        <AccessRecordDialog
          kind="role"
          record={edit.record}
          open
          onOpenChange={(open) => !open && setEdit(null)}
        />
      ) : null}
      {edit?.kind === "permission" ? (
        <AccessRecordDialog
          kind="permission"
          record={edit.record}
          open
          onOpenChange={(open) => !open && setEdit(null)}
        />
      ) : null}
      {permissionRole ? (
        <RolePermissionsDialog
          role={permissionRole}
          permissions={permissions}
          onClose={() => setPermissionRole(null)}
        />
      ) : null}
      <ConfirmationDialog
        open={!!remove}
        onOpenChange={(open) => !open && setRemove(null)}
        title={
          remove?.kind === "roles"
            ? `Excluir o perfil ${remove.label}?`
            : `Excluir a permissão ${remove?.label}?`
        }
        description="A exclusão é permanente e só será concluída se o registro não estiver em uso."
        confirmLabel="Excluir permanentemente"
        destructive
        pending={pending}
        onConfirm={() =>
          remove &&
          execute(
            () => deleteAccessRecord({ id: remove.id, kind: remove.kind }),
            "Registro excluído com sucesso.",
            () => setRemove(null),
          )
        }
      />
    </div>
  );
}

function EmptyState({ title, description }: Readonly<{ title: string; description: string }>) {
  return (
    <div className="p-10 text-center">
      <p className="font-semibold">{title}</p>
      <p className="text-muted-foreground mt-2 text-sm">{description}</p>
    </div>
  );
}
