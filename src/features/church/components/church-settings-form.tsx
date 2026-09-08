"use client";

import { toast } from "@/components/ui/toast";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { updateChurchSettings } from "../actions";
import { churchSettingsSchema, type ChurchSettingsValues } from "../church-settings.schema";
import { churchSettingsSections } from "../church-settings.fields";
import { useChurchSettings } from "./church-settings-provider";
import { ChurchSettingsSection } from "./church-settings-section";

export function ChurchSettingsForm({ canEdit }: Readonly<{ canEdit: boolean }>) {
  const { settings, setSettings } = useChurchSettings();
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting, isDirty },
  } = useForm<ChurchSettingsValues>({
    resolver: zodResolver(churchSettingsSchema),
    defaultValues: settings,
  });

  const onSubmit = handleSubmit(async (values) => {
    if (!canEdit || isSubmitting) return;
    try {
      const result = await updateChurchSettings(values);
      if (!result.ok) {
        if (result.status === 401) {
          window.location.replace("/login?error=session");
          return;
        }
        if (result.status === 403) {
          window.location.replace("/");
          return;
        }
        toast.error(result.message);
        return;
      }
      setSettings(result.settings);
      reset(result.settings);
      toast.success("Configurações salvas com sucesso.");
    } catch {
      toast.error("Não foi possível salvar as configurações. Tente novamente.");
    }
  });

  return (
    <form onSubmit={onSubmit} noValidate className="max-w-3xl space-y-6">
      {!settings.id ? (
        <p className="bg-muted rounded-md p-4 text-sm">
          A igreja ainda não foi configurada. Os valores padrão estão em uso.
        </p>
      ) : null}
      {!canEdit ? (
        <p role="status" className="bg-muted rounded-md p-4 text-sm">
          Você pode consultar as configurações. Para alterá-las, solicite permissão a um administrador.
        </p>
      ) : null}
      <p className="text-muted-foreground text-sm">Os campos marcados com * são obrigatórios.</p>
      <fieldset disabled={!canEdit || isSubmitting} className="min-w-0 space-y-7">
        <legend className="sr-only">Dados da igreja</legend>
        {churchSettingsSections.map((section) => (
          <ChurchSettingsSection key={section.title} section={section} register={register} errors={errors} />
        ))}
      </fieldset>
      {canEdit ? (
        <div className="flex flex-col gap-3 sm:flex-row">
          <Button type="submit" disabled={isSubmitting || (!isDirty && !!settings.id)}>
            {isSubmitting ? "Salvando…" : "Salvar configurações"}
          </Button>
          <Button
            type="button"
            variant="outline"
            disabled={isSubmitting || !isDirty}
            onClick={() => {
              reset(settings);
            }}
          >
            Descartar alterações
          </Button>
        </div>
      ) : null}
    </form>
  );
}
