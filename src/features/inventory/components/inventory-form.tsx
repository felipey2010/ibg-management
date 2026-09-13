"use client";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useForm, useWatch } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { FormField, FormSection } from "@/components/shared/form-layout";
import { useAdminMutation } from "@/hooks/use-admin-mutation";
import { saveInventoryItem } from "../actions";
import {
  inventoryFormSchema,
  type InventoryFormPayload,
  type InventoryFormValues,
} from "../inventory.schema";
import type { InventoryItem, InventoryOptions } from "../inventory.types";

export function InventoryForm({
  item,
  options,
}: Readonly<{ item?: InventoryItem; options: InventoryOptions }>) {
  const router = useRouter(),
    { pending, execute } = useAdminMutation(),
    {
      register,
      handleSubmit,
      setValue,
      control,
      formState: { errors },
    } = useForm<InventoryFormValues, unknown, InventoryFormPayload>({
      resolver: zodResolver(inventoryFormSchema),
      defaultValues: {
        name: item?.name ?? "",
        description: item?.description ?? "",
        category_id: item?.category_id ?? "",
        storage_location_id: item?.storage_location_id ?? "",
        quantity: item ? Number(item.quantity) : 0,
        minimum_quantity: item ? Number(item.minimum_quantity) : 0,
        unit: item?.unit ?? "un",
        condition: item?.condition ?? "GOOD",
        is_active: item?.is_active ?? true,
      },
    });
  const isActive = useWatch({ control, name: "is_active" });

  return (
    <form
      className="space-y-6"
      onSubmit={handleSubmit((values) =>
        execute(
          () => saveInventoryItem({ id: item?.id, values }),
          item ? "Item atualizado com sucesso." : "Item cadastrado com sucesso.",
          () => router.push(item ? `/estoque/${item.id}` : "/estoque"),
        ),
      )}
    >
      <FormSection title="Identificação" description="Dados de organização e localização do item.">
        <FormField label="Nome *" error={errors.name?.message} wide>
          <Input {...register("name")} />
        </FormField>
        <FormField label="Descrição" error={errors.description?.message} wide>
          <Textarea rows={4} {...register("description")} />
        </FormField>
        <FormField label="Categoria">
          <select
            {...register("category_id")}
            className="border-input bg-background h-10 w-full rounded-lg border px-3 text-sm"
          >
            <option value="">Sem categoria</option>
            {options.categories.map((x) => (
              <option key={x.id} value={x.id}>
                {x.name}
              </option>
            ))}
          </select>
        </FormField>
        <FormField label="Local de armazenamento">
          <select
            {...register("storage_location_id")}
            className="border-input bg-background h-10 w-full rounded-lg border px-3 text-sm"
          >
            <option value="">Sem local</option>
            {options.locations.map((x) => (
              <option key={x.id} value={x.id}>
                {x.name}
              </option>
            ))}
          </select>
        </FormField>
      </FormSection>
      <FormSection
        title="Controle do estoque"
        description={
          item
            ? "O saldo é alterado somente por movimentações."
            : "Informe o saldo inicial e os níveis de controle."
        }
      >
        <FormField label="Quantidade inicial">
          <Input type="number" step="0.01" disabled={!!item} {...register("quantity")} />
        </FormField>
        <FormField label="Estoque mínimo">
          <Input type="number" step="0.01" {...register("minimum_quantity")} />
        </FormField>
        <FormField label="Unidade *">
          <Input {...register("unit")} placeholder="un, kg, caixa…" />
        </FormField>
        <FormField label="Conservação">
          <select
            {...register("condition")}
            className="border-input bg-background h-10 w-full rounded-lg border px-3 text-sm"
          >
            <option value="NEW">Novo</option>
            <option value="GOOD">Bom</option>
            <option value="FAIR">Regular</option>
            <option value="DAMAGED">Danificado</option>
            <option value="UNUSABLE">Inutilizável</option>
          </select>
        </FormField>
        <FormField
          label={
            <span className="flex items-center gap-2">
              <Checkbox checked={isActive} onCheckedChange={(v) => setValue("is_active", v === true)} />
              Item ativo
            </span>
          }
        >
          <span />
        </FormField>
      </FormSection>
      <div className="flex justify-end gap-3">
        <Button type="button" variant="outline" onClick={() => router.back()}>
          Cancelar
        </Button>
        <Button type="submit" disabled={pending}>
          {pending ? "Salvando…" : "Salvar item"}
        </Button>
      </div>
    </form>
  );
}
