"use client";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useForm, useWatch } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { FormField, FormSection } from "@/components/shared/form-layout";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { useAdminMutation } from "@/hooks/use-admin-mutation";
import { saveEvent } from "../actions";
import { eventFormSchema, type EventFormPayload, type EventFormValues } from "../event.schema";
import type { ChurchEvent } from "../event.types";
const local = (v: string | null | undefined) => (v ? new Date(v).toISOString().slice(0, 16) : "");
export function EventForm({ event }: Readonly<{ event?: ChurchEvent }>) {
  const router = useRouter(),
    { pending, execute } = useAdminMutation(),
    {
      register,
      handleSubmit,
      setValue,
      control,
      formState: { errors },
    } = useForm<EventFormValues, unknown, EventFormPayload>({
      resolver: zodResolver(eventFormSchema),
      defaultValues: {
        title: event?.title ?? "",
        description: event?.description ?? "",
        start_at: local(event?.start_at),
        end_at: local(event?.end_at),
        location: event?.location ?? "",
        status: event?.status ?? "DRAFT",
        registration_enabled: event?.registration_enabled ?? false,
        registration_deadline: local(event?.registration_deadline),
        maximum_participants: event?.maximum_participants ?? "",
      },
    }),
    enabled = useWatch({ control, name: "registration_enabled" });
  return (
    <form
      className="space-y-6"
      noValidate
      onSubmit={handleSubmit((values) =>
        execute(
          () => saveEvent({ id: event?.id, values }),
          event ? "Evento atualizado com sucesso." : "Evento criado com sucesso.",
          () => router.push(event ? `/eventos/${event.id}` : "/eventos"),
        ),
      )}
    >
      <FormSection
        title="Informações do evento"
        description="Apresente o evento e informe quando e onde ele acontecerá."
      >
        <FormField label="Título *" error={errors.title?.message} wide>
          <Input {...register("title")} />
        </FormField>
        <FormField label="Descrição" error={errors.description?.message} wide>
          <Textarea rows={6} {...register("description")} />
        </FormField>
        <FormField label="Início *" error={errors.start_at?.message}>
          <Input type="datetime-local" {...register("start_at")} />
        </FormField>
        <FormField label="Término" error={errors.end_at?.message}>
          <Input type="datetime-local" {...register("end_at")} />
        </FormField>
        <FormField label="Local" error={errors.location?.message} wide>
          <Input {...register("location")} />
        </FormField>
        <FormField label="Status">
          <select
            {...register("status")}
            className="border-input bg-background h-10 w-full rounded-lg border px-3 text-sm"
          >
            <option value="DRAFT">Rascunho</option>
            <option value="PUBLISHED">Publicado</option>
            <option value="CANCELED">Cancelado</option>
            <option value="COMPLETED">Concluído</option>
          </select>
        </FormField>
      </FormSection>
      <FormSection title="Inscrições" description="Controle o prazo e a capacidade do evento.">
        <FormField
          label={
            <span className="flex items-center gap-2">
              <Checkbox
                checked={enabled}
                onCheckedChange={(v) => setValue("registration_enabled", v === true, { shouldDirty: true })}
              />
              Permitir inscrições
            </span>
          }
          wide
        >
          <span />
        </FormField>
        {enabled ? (
          <>
            <FormField label="Prazo para inscrição" error={errors.registration_deadline?.message}>
              <Input type="datetime-local" {...register("registration_deadline")} />
            </FormField>
            <FormField label="Limite de participantes" error={errors.maximum_participants?.message}>
              <Input type="number" min={1} {...register("maximum_participants")} />
            </FormField>
          </>
        ) : null}
      </FormSection>
      <div className="flex flex-col-reverse gap-3 border-t pt-6 sm:flex-row sm:justify-end">
        <Button type="button" variant="outline" disabled={pending} onClick={() => router.back()}>
          Cancelar
        </Button>
        <Button type="submit" disabled={pending}>
          {pending ? "Salvando…" : event ? "Salvar alterações" : "Criar evento"}
        </Button>
      </div>
    </form>
  );
}
