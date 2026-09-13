"use client";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useForm, useWatch } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
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
        <Field label="Primeiro nome *" error={errors.first_name?.message}>
          <Input {...register("first_name")} autoComplete="given-name" />
        </Field>
        <Field label="Sobrenome *" error={errors.last_name?.message}>
          <Input {...register("last_name")} autoComplete="family-name" />
        </Field>
        <Field label="Data de nascimento" error={errors.birth_date?.message}>
          <Input type="date" {...register("birth_date")} />
        </Field>
        <Field label="E-mail" error={errors.email?.message}>
          <Input type="email" {...register("email")} autoComplete="email" />
        </Field>
        <Field label="Telefone" error={errors.phone?.message}>
          <Input {...register("phone")} autoComplete="tel" />
        </Field>
      </FormSection>
      <FormSection title="Endereço" description="Informações opcionais para contato e organização.">
        <Field label="Endereço" error={errors.address_line?.message} wide>
          <Input {...register("address_line")} autoComplete="street-address" />
        </Field>
        <Field label="Cidade" error={errors.city?.message}>
          <Input {...register("city")} autoComplete="address-level2" />
        </Field>
        <Field label="Estado" error={errors.state?.message}>
          <Input {...register("state")} maxLength={2} placeholder="UF" autoComplete="address-level1" />
        </Field>
        <Field label="CEP" error={errors.postal_code?.message}>
          <Input {...register("postal_code")} autoComplete="postal-code" />
        </Field>
      </FormSection>
      <FormSection title="Vínculo com a igreja" description="Situação atual e data de entrada do membro.">
        <Field label="Status" error={errors.membership_status?.message}>
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
        </Field>
        <Field label="Data de membresia" error={errors.membership_date?.message}>
          <Input type="date" {...register("membership_date")} />
        </Field>
        {statusChanged ? (
          <Field label="Motivo da alteração de status" error={errors.status_reason?.message} wide>
            <Textarea
              {...register("status_reason")}
              rows={3}
              placeholder="Registre o contexto desta alteração"
            />
          </Field>
        ) : null}
        <Field label="Observações" error={errors.notes?.message} wide>
          <Textarea {...register("notes")} rows={5} />
        </Field>
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

function FormSection({
  title,
  description,
  children,
}: Readonly<{ title: string; description: string; children: React.ReactNode }>) {
  return (
    <fieldset className="grid gap-5 rounded-xl border p-5 sm:grid-cols-2 sm:p-6">
      <legend className="sr-only">{title}</legend>
      <div className="sm:col-span-2">
        <h2 className="font-semibold">{title}</h2>
        <p className="text-muted-foreground mt-1 text-xs">{description}</p>
      </div>
      {children}
    </fieldset>
  );
}

function Field({
  label,
  error,
  wide,
  children,
}: Readonly<{ label: string; error?: string; wide?: boolean; children: React.ReactNode }>) {
  return (
    <div className={`space-y-2 ${wide ? "sm:col-span-2" : ""}`}>
      <Label className="block space-y-2">
        {label}
        {children}
      </Label>
      {error ? (
        <p role="alert" className="text-destructive text-xs">
          {error}
        </p>
      ) : null}
    </div>
  );
}
