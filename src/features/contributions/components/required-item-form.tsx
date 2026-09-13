"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { FormField } from "@/components/shared/form-layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useAdminMutation } from "@/hooks/use-admin-mutation";
import { addRequiredContributionItem } from "../actions";
import {
  requiredItemSchema,
  type RequiredItemPayload,
  type RequiredItemValues,
} from "../contribution.schema";

export function RequiredItemForm({ campaignId }: Readonly<{ campaignId: string }>) {
  const { pending, execute } = useAdminMutation();
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<RequiredItemValues, unknown, RequiredItemPayload>({
    resolver: zodResolver(requiredItemSchema),
    defaultValues: {
      name: "",
      description: "",
      required_quantity: 1,
      maximum_contributors: "",
      unit: "un",
    },
  });

  return (
    <form
      className="grid gap-4 sm:grid-cols-2"
      noValidate
      onSubmit={handleSubmit(async (values) => {
        const success = await execute(
          () => addRequiredContributionItem({ campaignId, values }),
          "Item adicionado com sucesso.",
        );
        if (success)
          reset({
            name: "",
            description: "",
            required_quantity: 1,
            maximum_contributors: "",
            unit: "un",
          });
      })}
    >
      <FormField label="Item *" error={errors.name?.message}>
        <Input {...register("name")} />
      </FormField>
      <FormField label="Unidade *" error={errors.unit?.message}>
        <Input {...register("unit")} placeholder="un, kg, pacote…" />
      </FormField>
      <FormField label="Quantidade necessária *" error={errors.required_quantity?.message}>
        <Input type="number" min="0.01" step="0.01" {...register("required_quantity")} />
      </FormField>
      <FormField label="Limite de contribuintes" error={errors.maximum_contributors?.message}>
        <Input type="number" min="1" {...register("maximum_contributors")} />
      </FormField>
      <FormField label="Descrição" error={errors.description?.message} wide>
        <Textarea rows={3} {...register("description")} />
      </FormField>
      <div className="sm:col-span-2 sm:text-right">
        <Button type="submit" disabled={pending}>
          {pending ? "Adicionando…" : "Adicionar item"}
        </Button>
      </div>
    </form>
  );
}
