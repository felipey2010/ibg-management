"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
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
import { Textarea } from "@/components/ui/textarea";
import { useAdminMutation } from "@/hooks/use-admin-mutation";
import { savePermission, saveRole } from "../actions";
import { permissionSchema, roleSchema } from "../access-control.schema";
import type { Permission, Role } from "../access-control.types";

type Props =
  | { kind: "role"; record?: Role; open: boolean; onOpenChange: (open: boolean) => void }
  | { kind: "permission"; record?: Permission; open: boolean; onOpenChange: (open: boolean) => void };

export function AccessRecordDialog(props: Readonly<Props>) {
  const { pending, execute } = useAdminMutation();
  const [errors, setErrors] = useState<Record<string, string>>({});
  const record = props.record;

  return (
    <Dialog open={props.open} onOpenChange={(open) => !pending && props.onOpenChange(open)}>
      <DialogContent className="sm:max-w-lg" showCloseButton={!pending}>
        <form
          onSubmit={async (event) => {
            event.preventDefault();
            const data = new FormData(event.currentTarget);
            const values = {
              ...(props.kind === "role" ? { name: String(data.get("name") ?? "") } : {}),
              code: String(data.get("code") ?? ""),
              description: String(data.get("description") ?? ""),
            };
            const parsed = (props.kind === "role" ? roleSchema : permissionSchema).safeParse(values);
            if (!parsed.success) {
              setErrors(
                Object.fromEntries(
                  parsed.error.issues.map((issue) => [String(issue.path[0]), issue.message]),
                ),
              );
              return;
            }
            setErrors({});
            await execute(
              () =>
                props.kind === "role"
                  ? saveRole({ id: record?.id, values: parsed.data })
                  : savePermission({ id: record?.id, values: parsed.data }),
              props.kind === "role" ? "Perfil salvo com sucesso." : "Permissão salva com sucesso.",
              () => props.onOpenChange(false),
            );
          }}
        >
          <DialogHeader>
            <DialogTitle>
              {record ? "Editar" : "Criar"} {props.kind === "role" ? "perfil" : "permissão"}
            </DialogTitle>
            <DialogDescription>
              {props.kind === "role"
                ? "Use um perfil para agrupar permissões relacionadas."
                : "O código deve representar uma operação reconhecida pelo backend."}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-5">
            {props.kind === "role" ? (
              <div className="space-y-2">
                <Label htmlFor="access-name">Nome</Label>
                <Input
                  id="access-name"
                  name="name"
                  defaultValue={record && "name" in record ? record.name : ""}
                  maxLength={100}
                  aria-invalid={!!errors.name}
                />
                {errors.name ? <p className="text-destructive text-xs">{errors.name}</p> : null}
              </div>
            ) : null}
            <div className="space-y-2">
              <Label htmlFor="access-code">Código</Label>
              <Input
                id="access-code"
                name="code"
                defaultValue={record?.code ?? ""}
                maxLength={100}
                className="font-mono"
                aria-invalid={!!errors.code}
              />
              {errors.code ? <p className="text-destructive text-xs">{errors.code}</p> : null}
            </div>
            <div className="space-y-2">
              <Label htmlFor="access-description">Descrição</Label>
              <Textarea
                id="access-description"
                name="description"
                defaultValue={record?.description ?? ""}
                maxLength={500}
                rows={4}
                aria-invalid={!!errors.description}
              />
              {errors.description ? <p className="text-destructive text-xs">{errors.description}</p> : null}
            </div>
          </div>
          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              disabled={pending}
              onClick={() => props.onOpenChange(false)}
            >
              Cancelar
            </Button>
            <Button type="submit" disabled={pending}>
              {pending ? "Salvando…" : "Salvar"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
