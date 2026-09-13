"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useForm, useWatch } from "react-hook-form";
import { FormField, FormSection } from "@/components/shared/form-layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useAdminMutation } from "@/hooks/use-admin-mutation";
import { saveContributionCampaign } from "../actions";
import {
  contributionFormSchema,
  type ContributionFormPayload,
  type ContributionFormValues,
} from "../contribution.schema";
import type { ContributionCampaign } from "../contribution.types";

const localDate = (value: string | null | undefined) =>
  value ? new Date(value).toISOString().slice(0, 16) : "";

export function ContributionForm({ campaign }: Readonly<{ campaign?: ContributionCampaign }>) {
  const router = useRouter();
  const { pending, execute } = useAdminMutation();
  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
  } = useForm<ContributionFormValues, unknown, ContributionFormPayload>({
    resolver: zodResolver(contributionFormSchema),
    defaultValues: {
      title: campaign?.title ?? "",
      description: campaign?.description ?? "",
      type: campaign?.type ?? "FINANCIAL",
      status: campaign?.status ?? "DRAFT",
      starts_at: localDate(campaign?.starts_at),
      ends_at: localDate(campaign?.ends_at),
      financial_target: campaign?.financial_target ? Number(campaign.financial_target) : "",
    },
  });
  const type = useWatch({ control, name: "type" });

  return (
    <form
      className="space-y-6"
      noValidate
      onSubmit={handleSubmit((values) =>
        execute(
          () => saveContributionCampaign({ id: campaign?.id, values }),
          campaign ? "Campanha atualizada com sucesso." : "Campanha criada com sucesso.",
          () => router.push(campaign ? `/contribuicoes/${campaign.id}` : "/contribuicoes"),
        ),
      )}
    >
      <FormSection
        title="Informações da campanha"
        description="Defina o objetivo, o formato e como a campanha será apresentada."
      >
        <FormField label="Título *" error={errors.title?.message} wide>
          <Input {...register("title")} />
        </FormField>
        <FormField label="Descrição" error={errors.description?.message} wide>
          <Textarea rows={5} {...register("description")} />
        </FormField>
        <FormField label="Tipo">
          <select
            {...register("type")}
            className="border-input bg-background h-10 w-full rounded-lg border px-3 text-sm"
          >
            <option value="FINANCIAL">Financeira</option>
            <option value="ITEM">Arrecadação de itens</option>
          </select>
        </FormField>
        <FormField label="Status">
          <select
            {...register("status")}
            className="border-input bg-background h-10 w-full rounded-lg border px-3 text-sm"
          >
            <option value="DRAFT">Rascunho</option>
            <option value="ACTIVE">Ativa</option>
            <option value="CLOSED">Encerrada</option>
            <option value="ARCHIVED">Arquivada</option>
          </select>
        </FormField>
      </FormSection>
      <FormSection
        title="Período e meta"
        description="O período é opcional e ajuda a comunicar o prazo da campanha."
      >
        <FormField label="Início" error={errors.starts_at?.message}>
          <Input type="datetime-local" {...register("starts_at")} />
        </FormField>
        <FormField label="Término" error={errors.ends_at?.message}>
          <Input type="datetime-local" {...register("ends_at")} />
        </FormField>
        {type === "FINANCIAL" ? (
          <FormField label="Meta financeira" error={errors.financial_target?.message} wide>
            <Input type="number" min="0.01" step="0.01" {...register("financial_target")} />
          </FormField>
        ) : null}
      </FormSection>
      <div className="flex flex-col-reverse gap-3 border-t pt-6 sm:flex-row sm:justify-end">
        <Button type="button" variant="outline" disabled={pending} onClick={() => router.back()}>
          Cancelar
        </Button>
        <Button type="submit" disabled={pending}>
          {pending ? "Salvando…" : campaign ? "Salvar alterações" : "Criar campanha"}
        </Button>
      </div>
    </form>
  );
}
