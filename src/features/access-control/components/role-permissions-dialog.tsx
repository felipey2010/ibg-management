"use client";

import { useMemo, useState } from "react";
import { Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAdminMutation } from "@/hooks/use-admin-mutation";
import { saveRolePermissions } from "../actions";
import type { Permission, Role } from "../access-control.types";

export function RolePermissionsDialog({
  role,
  permissions,
  onClose,
}: Readonly<{ role: Role; permissions: Permission[]; onClose: () => void }>) {
  const initial = role.role_permissions.map((item) => item.permissions.code);
  const [selected, setSelected] = useState(() => new Set(initial));
  const [search, setSearch] = useState("");
  const { pending, execute } = useAdminMutation();
  const filtered = useMemo(() => {
    const term = search.trim().toLocaleLowerCase("pt-BR");
    return term
      ? permissions.filter((permission) =>
          `${permission.code} ${permission.description ?? ""}`.toLocaleLowerCase("pt-BR").includes(term),
        )
      : permissions;
  }, [permissions, search]);

  return (
    <Dialog open onOpenChange={(open) => !open && !pending && onClose()}>
      <DialogContent className="sm:max-w-2xl" showCloseButton={!pending}>
        <DialogHeader>
          <DialogTitle>Permissões de {role.name}</DialogTitle>
          <DialogDescription>
            Selecione as operações concedidas a todos os usuários deste perfil.
          </DialogDescription>
        </DialogHeader>
        <div className="relative">
          <Search className="text-muted-foreground absolute top-2.5 left-3 size-4" aria-hidden />
          <Input
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder="Buscar permissões"
            aria-label="Buscar permissões"
            className="pl-9"
          />
        </div>
        <div className="max-h-[52vh] overflow-y-auto rounded-lg border">
          {filtered.length ? (
            filtered.map((permission) => {
              const checked = selected.has(permission.code);
              return (
                <Label
                  key={permission.id}
                  className="hover:bg-muted/35 flex cursor-pointer items-start gap-3 border-b p-4 last:border-b-0"
                >
                  <Checkbox
                    checked={checked}
                    disabled={pending}
                    onCheckedChange={(value) =>
                      setSelected((current) => {
                        const next = new Set(current);
                        if (value) next.add(permission.code);
                        else next.delete(permission.code);
                        return next;
                      })
                    }
                  />
                  <span className="min-w-0">
                    <span className="block font-mono text-xs font-semibold break-all">{permission.code}</span>
                    <span className="text-muted-foreground mt-1 block text-xs leading-relaxed">
                      {permission.description || "Sem descrição."}
                    </span>
                  </span>
                </Label>
              );
            })
          ) : (
            <p className="text-muted-foreground p-8 text-center text-sm">Nenhuma permissão encontrada.</p>
          )}
        </div>
        <p className="text-muted-foreground text-xs">
          {selected.size} de {permissions.length} permissões selecionadas
        </p>
        <DialogFooter>
          <Button variant="outline" disabled={pending} onClick={onClose}>
            Cancelar
          </Button>
          <Button
            disabled={pending}
            onClick={() =>
              execute(
                () => saveRolePermissions({ id: role.id, permissionCodes: [...selected] }),
                "Permissões do perfil atualizadas.",
                onClose,
              )
            }
          >
            {pending ? "Salvando…" : "Salvar permissões"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
