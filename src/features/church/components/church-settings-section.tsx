import type { FieldErrors, UseFormRegister } from "react-hook-form";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
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
    <fieldset className="border-border space-y-5 border-b pb-7">
      <legend className="mb-4 text-base font-semibold">{section.title}</legend>
      <div className="grid gap-5 sm:grid-cols-2">
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
            <div key={field.name} className={field.multiline ? "space-y-2 sm:col-span-2" : "space-y-2"}>
              <Label htmlFor={id}>
                {field.label}
                {field.required ? " *" : ""}
              </Label>
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
              {error ? (
                <p id={`${id}-error`} role="alert" className="text-destructive text-sm">
                  {error}
                </p>
              ) : null}
            </div>
          );
        })}
      </div>
    </fieldset>
  );
}
