"use client";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useForm, useWatch } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { FormField, FormSection } from "@/components/shared/form-layout";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useAdminMutation } from "@/hooks/use-admin-mutation";
import type { Ministry } from "@/features/ministries/ministry.types";
import { saveAnnouncement } from "../actions";
import {
  announcementFormSchema,
  type AnnouncementFormPayload,
  type AnnouncementFormValues,
} from "../announcement.schema";
import type { Announcement } from "../announcement.types";

const localDate = (v: string | null | undefined) => (v ? new Date(v).toISOString().slice(0, 16) : "");

export function AnnouncementForm({
  announcement,
  ministries,
}: Readonly<{ announcement?: Announcement; ministries: Ministry[] }>) {
  const router = useRouter(),
    { pending, execute } = useAdminMutation();
  const destination = announcement?.announcement_destinations[0];
  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
  } = useForm<AnnouncementFormValues, unknown, AnnouncementFormPayload>({
    resolver: zodResolver(announcementFormSchema),
    defaultValues: {
      title: announcement?.title ?? "",
      content: announcement?.content ?? "",
      status: announcement?.status ?? "DRAFT",
      audience: destination?.type ?? "ALL_MEMBERS",
      ministry_id: destination?.ministry_id ?? "",
      starts_at: localDate(announcement?.starts_at),
      ends_at: localDate(announcement?.ends_at),
    },
  });
  const audience = useWatch({ control, name: "audience" });

  return (
    <form
      noValidate
      onSubmit={handleSubmit((values) =>
        execute(
          () => saveAnnouncement({ id: announcement?.id, values }),
          announcement ? "Aviso atualizado com sucesso." : "Aviso criado com sucesso.",
          () => router.push(announcement ? `/avisos/${announcement.id}` : "/avisos"),
        ),
      )}
      className="space-y-6"
    >
      <FormSection title="Conteúdo e publicação" className="bg-card">
        <FormField label="Título *" htmlFor="title" error={errors.title?.message} wide>
          <Input id="title" {...register("title")} placeholder="Um título claro e objetivo" />
        </FormField>
        <FormField label="Mensagem *" htmlFor="content" error={errors.content?.message} wide>
          <Textarea
            id="content"
            {...register("content")}
            rows={9}
            placeholder="Escreva as informações que precisam ser comunicadas…"
          />
        </FormField>
        <FormField label="Status">
          <select
            {...register("status")}
            className="border-input bg-background h-10 w-full rounded-lg border px-3 text-sm"
          >
            <option value="DRAFT">Rascunho</option>
            <option value="PUBLISHED">Publicado</option>
          </select>
        </FormField>
        <FormField label="Público">
          <select
            {...register("audience")}
            className="border-input bg-background h-10 w-full rounded-lg border px-3 text-sm"
          >
            <option value="ALL_MEMBERS">Todos os membros</option>
            <option value="VISITORS">Visitantes</option>
            <option value="CHURCH_LEADERS">Liderança da igreja</option>
            <option value="MINISTRY">Ministério específico</option>
            <option value="ALL_USERS">Todos os usuários</option>
          </select>
        </FormField>
        {audience === "MINISTRY" ? (
          <FormField label="Ministério" error={errors.ministry_id?.message}>
            {ministries.length ? (
              <select
                {...register("ministry_id")}
                className="border-input bg-background h-10 w-full rounded-lg border px-3 text-sm"
              >
                <option value="">Selecione</option>
                {ministries.map((m) => (
                  <option key={m.id} value={m.id}>
                    {m.name}
                  </option>
                ))}
              </select>
            ) : (
              <p className="text-muted-foreground rounded-lg border p-3 text-sm">
                Nenhum ministério ativo disponível.
              </p>
            )}
          </FormField>
        ) : null}
        <FormField label="Exibir a partir de">
          <Input type="datetime-local" {...register("starts_at")} />
        </FormField>
        <FormField label="Exibir até" error={errors.ends_at?.message}>
          <Input type="datetime-local" {...register("ends_at")} />
        </FormField>
      </FormSection>
      <div className="flex flex-col-reverse gap-3 border-t pt-6 sm:flex-row sm:justify-end">
        <Button type="button" variant="outline" disabled={pending} onClick={() => router.back()}>
          Cancelar
        </Button>
        <Button type="submit" disabled={pending}>
          {pending ? "Salvando…" : announcement ? "Salvar alterações" : "Criar aviso"}
        </Button>
      </div>
    </form>
  );
}
