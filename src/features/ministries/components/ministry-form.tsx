"use client";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useAdminMutation } from "@/hooks/use-admin-mutation";
import { saveMinistry } from "../actions";
import { ministryFormSchema, type MinistryFormPayload, type MinistryFormValues } from "../ministry.schema";
import type { Ministry } from "../ministry.types";
export function MinistryForm({ ministry }: Readonly<{ ministry?: Ministry }>) {
  const router = useRouter();
  const { pending, execute } = useAdminMutation();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<MinistryFormValues, unknown, MinistryFormPayload>({
    resolver: zodResolver(ministryFormSchema),
    defaultValues: {
      name: ministry?.name ?? "",
      description: ministry?.description ?? "",
      status: ministry?.status ?? "ACTIVE",
    },
  });
  const submit = handleSubmit((values) =>
    execute(
      () => saveMinistry({ id: ministry?.id, values }),
      ministry ? "Ministério atualizado com sucesso." : "Ministério criado com sucesso.",
      () => router.push(ministry ? `/ministerios/${ministry.id}` : "/ministerios"),
    ),
  );
  return (
    <form onSubmit={submit} className="space-y-6" noValidate>
      <fieldset className="space-y-5 rounded-xl border p-5 sm:p-6">
        <legend className="sr-only">Dados do ministério</legend>
        <div className="space-y-2">
          <Label htmlFor="name">Nome *</Label>
          <Input id="name" {...register("name")} />
          {errors.name ? (
            <p role="alert" className="text-destructive text-xs">
              {errors.name.message}
            </p>
          ) : null}
        </div>
        <div className="space-y-2">
          <Label htmlFor="description">Descrição</Label>
          <Textarea id="description" rows={6} {...register("description")} />
          {errors.description ? (
            <p role="alert" className="text-destructive text-xs">
              {errors.description.message}
            </p>
          ) : null}
        </div>
        <div className="space-y-2">
          <Label htmlFor="status">Status</Label>
          <select
            id="status"
            {...register("status")}
            className="border-input bg-background h-10 w-full rounded-lg border px-3 text-sm"
          >
            <option value="ACTIVE">Ativo</option>
            <option value="INACTIVE">Inativo</option>
          </select>
        </div>
      </fieldset>
      <div className="flex flex-col-reverse gap-3 border-t pt-6 sm:flex-row sm:justify-end">
        <Button type="button" variant="outline" disabled={pending} onClick={() => router.back()}>
          Cancelar
        </Button>
        <Button type="submit" disabled={pending}>
          {pending ? "Salvando…" : ministry ? "Salvar alterações" : "Criar ministério"}
        </Button>
      </div>
    </form>
  );
}
