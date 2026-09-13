"use client";
import { useState } from "react";
import { Boxes, MapPin, Pencil, Plus, Settings2 } from "lucide-react";
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { FormField } from "@/components/shared/form-layout";
import { useAdminMutation } from "@/hooks/use-admin-mutation";
import { saveInventoryCategory, saveStorageLocation } from "../actions";
import type { InventoryOption } from "../inventory.types";

type Kind = "locations" | "categories";
type Editor = { kind: Kind; record: InventoryOption } | null;

export function InventoryOrganizationManager({
  locations,
  categories,
  canManageLocations,
  canManageCategories,
}: Readonly<{
  locations: InventoryOption[];
  categories: InventoryOption[];
  canManageLocations: boolean;
  canManageCategories: boolean;
}>) {
  const [open, setOpen] = useState(false);
  const [editor, setEditor] = useState<Editor>(null);
  const { pending, execute } = useAdminMutation();
  const initialTab: Kind = canManageLocations ? "locations" : "categories";

  return (
    <>
      <Button variant="outline" onClick={() => setOpen(true)}>
        <Settings2 /> Organizar estoque
      </Button>
      <Dialog open={open} onOpenChange={(value) => !pending && setOpen(value)}>
        <DialogContent className="sm:max-w-2xl">
          <DialogHeader>
            <DialogTitle>Organização do estoque</DialogTitle>
            <DialogDescription>Gerencie categorias e locais usados no cadastro dos itens.</DialogDescription>
          </DialogHeader>
          <Tabs defaultValue={initialTab}>
            {canManageLocations && canManageCategories ? (
              <TabsList className="min-h-10 w-full">
                <TabsTrigger value="locations">
                  <MapPin /> Locais
                </TabsTrigger>
                <TabsTrigger value="categories">
                  <Boxes /> Categorias
                </TabsTrigger>
              </TabsList>
            ) : null}
            {canManageLocations ? (
              <TabsContent value="locations">
                <OrganizationPanel
                  kind="locations"
                  records={locations}
                  editing={editor?.kind === "locations" ? editor.record : null}
                  setEditor={setEditor}
                  pending={pending}
                  execute={execute}
                />
              </TabsContent>
            ) : null}
            {canManageCategories ? (
              <TabsContent value="categories">
                <OrganizationPanel
                  kind="categories"
                  records={categories}
                  editing={editor?.kind === "categories" ? editor.record : null}
                  setEditor={setEditor}
                  pending={pending}
                  execute={execute}
                />
              </TabsContent>
            ) : null}
          </Tabs>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => setOpen(false)}>
              Fechar
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}

function OrganizationPanel({
  kind,
  records,
  editing,
  setEditor,
  pending,
  execute,
}: Readonly<{
  kind: Kind;
  records: InventoryOption[];
  editing: InventoryOption | null;
  setEditor: (value: Editor) => void;
  pending: boolean;
  execute: ReturnType<typeof useAdminMutation>["execute"];
}>) {
  const singular = kind === "locations" ? "Local" : "Categoria";

  return (
    <div className="space-y-5 pt-4">
      <form
        key={editing?.id ?? `new-${kind}`}
        className="bg-muted/20 space-y-4 rounded-lg border p-4"
        onSubmit={async (event) => {
          event.preventDefault();
          const form = event.currentTarget,
            data = new FormData(form);
          const values = {
            name: String(data.get("name") ?? ""),
            description: String(data.get("description") ?? ""),
            is_active: data.get("is_active") === "on",
          };
          const success = await execute(
            () =>
              kind === "locations"
                ? saveStorageLocation({ id: editing?.id, values })
                : saveInventoryCategory({ id: editing?.id, values }),
            editing ? `${singular} atualizado com sucesso.` : `${singular} cadastrado com sucesso.`,
            () => setEditor(null),
          );
          if (success) form.reset();
        }}
      >
        <div className="grid gap-4 sm:grid-cols-2">
          <FormField label="Nome">
            <Input name="name" defaultValue={editing?.name ?? ""} required maxLength={120} />
          </FormField>
          <FormField label="Descrição">
            <Input name="description" defaultValue={editing?.description ?? ""} maxLength={500} />
          </FormField>
        </div>
        <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-center">
          <label className="flex items-center gap-2 text-sm">
            <Checkbox name="is_active" defaultChecked={editing?.is_active ?? true} />
            Ativo e disponível para novos itens
          </label>
          <div className="flex gap-2">
            {editing ? (
              <Button type="button" variant="ghost" onClick={() => setEditor(null)}>
                Cancelar
              </Button>
            ) : null}
            <Button type="submit" disabled={pending}>
              {editing ? (
                "Salvar alterações"
              ) : (
                <>
                  <Plus /> Adicionar {singular}
                </>
              )}
            </Button>
          </div>
        </div>
      </form>
      <div className="max-h-72 overflow-y-auto rounded-lg border">
        {records.length ? (
          <ul className="divide-y">
            {records.map((record) => (
              <li key={record.id} className="flex items-center gap-3 p-4">
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2">
                    <p className="font-medium">{record.name}</p>
                    <span
                      className={
                        record.is_active ? "text-xs text-emerald-700" : "text-muted-foreground text-xs"
                      }
                    >
                      {record.is_active ? "Ativo" : "Inativo"}
                    </span>
                  </div>
                  <p className="text-muted-foreground truncate text-xs">
                    {record.description || "Sem descrição"}
                  </p>
                </div>
                <Button
                  variant="ghost"
                  size="icon-sm"
                  aria-label={`Editar ${record.name}`}
                  onClick={() => setEditor({ kind, record })}
                >
                  <Pencil />
                </Button>
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-muted-foreground p-8 text-center text-sm">Nenhum registro cadastrado.</p>
        )}
      </div>
    </div>
  );
}
