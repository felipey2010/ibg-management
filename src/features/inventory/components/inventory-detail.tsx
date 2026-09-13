"use client";
import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useForm, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { ArrowLeft, Boxes, Pencil, PowerOff } from "lucide-react";
import { Button, buttonVariants } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ConfirmationDialog } from "@/components/shared/confirmation-dialog";
import { FormField } from "@/components/shared/form-layout";
import { useAdminMutation } from "@/hooks/use-admin-mutation";
import { createInventoryMovement, deactivateInventoryItem } from "../actions";
import { movementSchema, type MovementValues } from "../inventory.schema";
import { conditionLabels, movementLabels, type InventoryItem } from "../inventory.types";

const n = (v: string) => Number(v).toLocaleString("pt-BR", { maximumFractionDigits: 2 }),
  date = (v: string) =>
    new Intl.DateTimeFormat("pt-BR", { dateStyle: "short", timeStyle: "short" }).format(new Date(v));

export function InventoryDetail({
  item,
  canUpdate,
  canDelete,
  canMove,
}: Readonly<{ item: InventoryItem; canUpdate: boolean; canDelete: boolean; canMove: boolean }>) {
  const router = useRouter(),
    [confirm, setConfirm] = useState(false),
    { pending, execute } = useAdminMutation(),
    {
      register,
      handleSubmit,
      control,
      reset,
      formState: { errors },
    } = useForm<MovementValues>({
      resolver: zodResolver(movementSchema),
      defaultValues: { type: "ENTRY", quantity: 1, reason: "" },
    }),
    type = useWatch({ control, name: "type" });

  return (
    <>
      <Button variant="ghost" className="mb-4" onClick={() => router.back()}>
        <ArrowLeft />
        Voltar
      </Button>
      <section className="bg-card overflow-hidden rounded-xl border">
        <header className="bg-muted/35 flex flex-col gap-5 border-b p-6 sm:flex-row sm:items-center">
          <div className="bg-background flex size-14 items-center justify-center rounded-xl">
            <Boxes />
          </div>
          <div className="flex-1">
            <h1 className="font-serif text-2xl font-semibold">{item.name}</h1>
            <p className="text-muted-foreground mt-1 text-sm">
              {conditionLabels[item.condition]} · {item.inventory_categories?.name || "Sem categoria"}
            </p>
          </div>
          <div className="flex gap-2">
            {canUpdate ? (
              <Link href={`/estoque/${item.id}/editar`} className={buttonVariants({ variant: "outline" })}>
                <Pencil />
                Editar
              </Link>
            ) : null}
            {canDelete && item.is_active ? (
              <Button variant="destructive" onClick={() => setConfirm(true)}>
                <PowerOff />
                Desativar
              </Button>
            ) : null}
          </div>
        </header>
        <div className="grid gap-6 p-6 sm:grid-cols-3">
          <div>
            <p className="text-muted-foreground text-xs">Saldo atual</p>
            <p className="mt-1 text-2xl font-semibold">
              {n(item.quantity)} {item.unit}
            </p>
          </div>
          <div>
            <p className="text-muted-foreground text-xs">Estoque mínimo</p>
            <p className="mt-1 font-medium">
              {n(item.minimum_quantity)} {item.unit}
            </p>
          </div>
          <div>
            <p className="text-muted-foreground text-xs">Armazenamento</p>
            <p className="mt-1 font-medium">{item.storage_locations?.name || "Não informado"}</p>
          </div>
          <p className="text-muted-foreground text-sm whitespace-pre-wrap sm:col-span-3">
            {item.description || "Sem descrição."}
          </p>
        </div>
        {canMove && item.is_active ? (
          <form
            onSubmit={handleSubmit((values) =>
              execute(
                () => createInventoryMovement({ id: item.id, values }),
                "Movimentação registrada com sucesso.",
                () => reset({ type: "ENTRY", quantity: 1, reason: "" }),
              ),
            )}
            className="bg-muted/20 grid gap-4 border-t p-6 sm:grid-cols-[150px_150px_1fr_auto]"
          >
            <FormField label="Movimento">
              <select
                {...register("type")}
                className="border-input bg-background h-10 w-full rounded-lg border px-3 text-sm"
              >
                <option value="ENTRY">Entrada</option>
                <option value="REMOVAL">Saída</option>
                <option value="REMOVAL">Estra</option>
                <option value="ADJUSTMENT">Ajuste</option>
              </select>
            </FormField>
            <FormField
              label={type === "ADJUSTMENT" ? "Novo saldo" : "Quantidade"}
              error={errors.quantity?.message}
            >
              <Input type="number" step="0.01" {...register("quantity")} />
            </FormField>
            <FormField label="Motivo" error={errors.reason?.message}>
              <Input {...register("reason")} />
            </FormField>
            <Button className="self-end" disabled={pending} type="submit">
              Registrar
            </Button>
          </form>
        ) : null}
        <section className="border-t p-6">
          <h2 className="font-semibold">Histórico de movimentações</h2>
          {item.inventory_movements?.length ? (
            <ul className="mt-4 divide-y rounded-lg border">
              {item.inventory_movements.map((m) => (
                <li key={m.id} className="flex flex-col justify-between gap-2 p-4 sm:flex-row">
                  <div>
                    <p className="font-medium">
                      {movementLabels[m.type]} · {n(m.quantity)} {item.unit}
                    </p>
                    <p className="text-muted-foreground mt-1 text-xs">{m.reason}</p>
                  </div>
                  <div className="text-muted-foreground text-xs sm:text-right">
                    <p>
                      {n(m.previous_quantity)} → {n(m.resulting_quantity)}
                    </p>
                    <p className="mt-1">{date(m.created_at)}</p>
                  </div>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-muted-foreground mt-4 text-sm">Nenhuma movimentação registrada.</p>
          )}
        </section>
      </section>
      <ConfirmationDialog
        open={confirm}
        onOpenChange={setConfirm}
        title={`Desativar ${item.name}?`}
        description="O item deixará de aceitar movimentações, mas seu histórico será preservado."
        confirmLabel="Desativar item"
        destructive
        pending={pending}
        onConfirm={() =>
          execute(
            () => deactivateInventoryItem(item.id),
            "Item desativado com sucesso.",
            () => router.push("/estoque"),
          )
        }
      />
    </>
  );
}
