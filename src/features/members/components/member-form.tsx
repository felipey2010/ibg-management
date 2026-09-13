"use client";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useForm, useWatch } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { FormField, FormSection } from "@/components/shared/form-layout";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { useAdminMutation } from "@/hooks/use-admin-mutation";
import { saveMember } from "../actions";
import { memberFormSchema, type MemberFormPayload, type MemberFormValues } from "../member.schema";
import { memberStatusLabels, type Member } from "../member.types";

const dateInput = (value: string | null | undefined) => value?.slice(0, 10) ?? "";
const defaults = (member?: Member): MemberFormValues => ({
  first_name: member?.first_name ?? "",
  last_name: member?.last_name ?? "",
  birth_date: dateInput(member?.birth_date),
  email: member?.email ?? "",
  phone: member?.phone ?? "",
  address_line: member?.address_line ?? "",
  city: member?.city ?? "",
  state: member?.state ?? "",
  postal_code: member?.postal_code ?? "",
  membership_status: member?.membership_status ?? "ACTIVE",
  membership_date: dateInput(member?.membership_date),
  notes: member?.notes ?? "",
  status_reason: "",
});

export function MemberForm({ member }: Readonly<{ member?: Member }>) {
  const router = useRouter();
  const { pending, execute } = useAdminMutation();
  const {
    register,
    handleSubmit,
    setValue,
    control,
    formState: { errors },
  } = useForm<MemberFormValues, unknown, MemberFormPayload>({
    resolver: zodResolver(memberFormSchema),
    defaultValues: defaults(member),
  });
  const status = useWatch({ control, name: "membership_status" });
  const statusChanged = !!member && status !== member.membership_status;

  const submit = handleSubmit(async (values) => {
    await execute(
      () => saveMember({ id: member?.id, values }),
      member ? "Membro atualizado com sucesso." : "Membro cadastrado com sucesso.",
      () => router.push(member ? `/membros/${member.id}` : "/membros"),
    );
  });

  return (
    <form onSubmit={submit} className="space-y-8" noValidate>
      <FormSection title="Identificação" description="Dados pessoais e contato principal.">
        <FormField label="Primeiro nome *" error={errors.first_name?.message}>
          <Input {...register("first_name")} autoComplete="given-name" />
        </FormField>
        <FormField label="Sobrenome *" error={errors.last_name?.message}>
          <Input {...register("last_name")} autoComplete="family-name" />
        </FormField>
        <FormField label="Data de nascimento" error={errors.birth_date?.message}>
          <Input type="date" {...register("birth_date")} />
        </FormField>
        <FormField label="E-mail" error={errors.email?.message}>
          <Input type="email" {...register("email")} autoComplete="email" />
        </FormField>
        <FormField label="Telefone" error={errors.phone?.message}>
          <Input {...register("phone")} autoComplete="tel" />
        </FormField>
      </FormSection>
      <FormSection title="Endereço" description="Informações opcionais para contato e organização.">
        <FormField label="Endereço" error={errors.address_line?.message} wide>
          <Input {...register("address_line")} autoComplete="street-address" />
        </FormField>
        <FormField label="Cidade" error={errors.city?.message}>
          <Input {...register("city")} autoComplete="address-level2" />
        </FormField>
        <FormField label="Estado" error={errors.state?.message}>
          <Input {...register("state")} maxLength={2} placeholder="UF" autoComplete="address-level1" />
        </FormField>
        <FormField label="CEP" error={errors.postal_code?.message}>
          <Input {...register("postal_code")} autoComplete="postal-code" />
        </FormField>
      </FormSection>
      <FormSection title="Vínculo com a igreja" description="Situação atual e data de entrada do membro.">
        <FormField label="Status" error={errors.membership_status?.message}>
          <Select
            value={status}
            onValueChange={(value) =>
              value &&
              setValue("membership_status", value as MemberFormValues["membership_status"], {
                shouldDirty: true,
              })
            }
            items={Object.entries(memberStatusLabels).map(([value, label]) => ({ value, label }))}
          >
            <SelectTrigger aria-label="Status do membro" className="w-full">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {Object.entries(memberStatusLabels).map(([value, label]) => (
                <SelectItem key={value} value={value}>
                  {label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </FormField>
        <FormField label="Data de membresia" error={errors.membership_date?.message}>
          <Input type="date" {...register("membership_date")} />
        </FormField>
        {statusChanged ? (
          <FormField label="Motivo da alteração de status" error={errors.status_reason?.message} wide>
            <Textarea
              {...register("status_reason")}
              rows={3}
              placeholder="Registre o contexto desta alteração"
            />
          </FormField>
        ) : null}
        <FormField label="Observações" error={errors.notes?.message} wide>
          <Textarea {...register("notes")} rows={5} />
        </FormField>
      </FormSection>
      <div className="flex flex-col-reverse gap-3 border-t pt-6 sm:flex-row sm:justify-end">
        <Button type="button" variant="outline" disabled={pending} onClick={() => router.back()}>
          Cancelar
        </Button>
        <Button type="submit" disabled={pending}>
          {pending ? "Salvando…" : member ? "Salvar alterações" : "Cadastrar membro"}
        </Button>
      </div>
    </form>
  );
}
