"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { FormField } from "@/components/shared/form-layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useAdminMutation } from "@/hooks/use-admin-mutation";
import type { Member } from "@/features/members/member.types";
import { recordFinancialContribution } from "../actions";
import {
  financialContributionSchema,
  type FinancialContributionPayload,
  type FinancialContributionValues,
} from "../contribution.schema";

const now = () => {
  const date = new Date();
  date.setMinutes(date.getMinutes() - date.getTimezoneOffset());
  return date.toISOString().slice(0, 16);
};

export function FinancialContributionForm({
  campaignId,
  members,
}: Readonly<{ campaignId: string; members: Member[] }>) {
  const { pending, execute } = useAdminMutation();
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<FinancialContributionValues, unknown, FinancialContributionPayload>({
    resolver: zodResolver(financialContributionSchema),
    defaultValues: {
      member_id: "",
      amount: 0,
      contributed_at: now(),
      payment_method: "PIX",
      reference: "",
    },
  });

  return (
    <form
      className="grid gap-4 sm:grid-cols-2"
      noValidate
      onSubmit={handleSubmit(async (values) => {
        const success = await execute(
          () => recordFinancialContribution({ campaignId, values }),
          "Contribuição registrada com sucesso.",
        );
        if (success)
          reset({ member_id: "", amount: 0, contributed_at: now(), payment_method: "PIX", reference: "" });
      })}
    >
      <FormField label="Membro">
        <select
          {...register("member_id")}
          className="border-input bg-background h-10 w-full rounded-lg border px-3 text-sm"
        >
          <option value="">Contribuinte não identificado</option>
          {members.map((member) => (
            <option key={member.id} value={member.id}>
              {member.first_name} {member.last_name}
            </option>
          ))}
        </select>
      </FormField>
      <FormField label="Valor *" error={errors.amount?.message}>
        <Input type="number" min="0.01" step="0.01" {...register("amount")} />
      </FormField>
      <FormField label="Data *" error={errors.contributed_at?.message}>
        <Input type="datetime-local" {...register("contributed_at")} />
      </FormField>
      <FormField label="Forma de pagamento">
        <select
          {...register("payment_method")}
          className="border-input bg-background h-10 w-full rounded-lg border px-3 text-sm"
        >
          <option value="PIX">Pix</option>
          <option value="CASH">Dinheiro</option>
          <option value="BANK_TRANSFER">Transferência</option>
          <option value="CARD">Cartão</option>
          <option value="OTHER">Outro</option>
        </select>
      </FormField>
      <FormField label="Referência" error={errors.reference?.message} wide>
        <Input {...register("reference")} placeholder="Comprovante ou observação curta" />
      </FormField>
      <div className="sm:col-span-2 sm:text-right">
        <Button type="submit" disabled={pending}>
          {pending ? "Registrando…" : "Registrar contribuição"}
        </Button>
      </div>
    </form>
  );
}
