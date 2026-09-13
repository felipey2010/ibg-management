import type { FieldErrors, UseFormRegister } from "react-hook-form";
import { FormField, FormSection } from "@/components/shared/form-layout";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import type { ChurchSettingsValues } from "../church-settings.schema";
import type { churchSettingsSections } from "../church-settings.fields";

export function ChurchSettingsSection({
  section,
  register,
  errors,
}: Readonly<{
  section: (typeof churchSettingsSections)[number];
  register: UseFormRegister<ChurchSettingsValues>;
  errors: FieldErrors<ChurchSettingsValues>;
}>) {
  return (
    <FormSection title={section.title} className="rounded-none border-x-0 border-t-0 p-0 pb-7 sm:p-0 sm:pb-7">
      {section.fields.map((field) => {
        const id = `church-${field.name}`;
        const error = errors[field.name]?.message;
        const props = {
          id,
          ...register(field.name),
          required: field.required,
          placeholder: field.placeholder,
          "aria-invalid": !!error,
          "aria-describedby": error ? `${id}-error` : undefined,
        };
        return (
          <FormField
            key={field.name}
            htmlFor={id}
            error={typeof error === "string" ? error : undefined}
            wide={field.multiline}
            label={
              <>
                {field.label}
                {field.required ? " *" : ""}
              </>
            }
          >
            {field.name === "default_language" ? (
              <select
                {...props}
                className="border-input bg-background h-9 w-full rounded-md border px-3 text-sm focus-visible:outline-2 focus-visible:outline-offset-2 disabled:opacity-50"
              >
                <option value="pt-BR">Português (Brasil)</option>
              </select>
            ) : field.multiline ? (
              <Textarea {...props} rows={3} />
            ) : (
              <Input {...props} type={field.type ?? "text"} />
            )}
          </FormField>
        );
      })}
    </FormSection>
  );
}
