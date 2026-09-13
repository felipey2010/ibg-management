"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { FormField } from "@/components/shared/form-layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import type { Member } from "@/features/members/member.types";
import { useAdminMutation } from "@/hooks/use-admin-mutation";
import { recordItemCommitment } from "../actions";
import {
  itemCommitmentSchema,
  type ItemCommitmentPayload,
  type ItemCommitmentValues,
} from "../contribution.schema";

export function ItemCommitmentForm({
  campaignId,
  itemId,
  members,
}: Readonly<{ campaignId: string; itemId: string; members: Member[] }>) {
  const { pending, execute } = useAdminMutation();
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<ItemCommitmentValues, unknown, ItemCommitmentPayload>({
    resolver: zodResolver(itemCommitmentSchema),
    defaultValues: { member_id: "", quantity: 1, notes: "" },
  });

  return (
    <form
      className="mt-4 grid gap-3 border-t pt-4"
      noValidate
      onSubmit={handleSubmit(async (values) => {
        const success = await execute(
          () => recordItemCommitment({ campaignId, itemId, values }),
          "Contribuição registrada com sucesso.",
        );
        if (success) reset({ member_id: "", quantity: 1, notes: "" });
      })}
    >
      <FormField label="Membro *" error={errors.member_id?.message}>
        <select
          {...register("member_id")}
          className="border-input bg-background h-10 w-full rounded-lg border px-3 text-sm"
        >
          <option value="">Selecione um membro</option>
          {members.map((member) => (
            <option key={member.id} value={member.id}>
              {member.first_name} {member.last_name}
            </option>
          ))}
        </select>
      </FormField>
      <div className="grid grid-cols-[1fr_auto] gap-2">
        <FormField label="Quantidade *" error={errors.quantity?.message}>
          <Input type="number" min="0.01" step="0.01" {...register("quantity")} />
        </FormField>
        <Button type="submit" className="mt-6" disabled={pending}>
          {pending ? "Registrando…" : "Registrar"}
        </Button>
      </div>
    </form>
  );
}
