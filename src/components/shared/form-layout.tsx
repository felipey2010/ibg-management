import {
  Field,
  FieldDescription,
  FieldError,
  FieldLabel,
  FieldLegend,
  FieldSet,
} from "@/components/ui/field";
import { cn } from "@/lib/utils";

export function FormSection({
  title,
  description,
  className,
  children,
}: Readonly<{
  title: string;
  description?: string;
  className?: string;
  children: React.ReactNode;
}>) {
  return (
    <FieldSet className={cn("grid gap-5 rounded-xl border p-5 sm:grid-cols-2 sm:p-6", className)}>
      <FieldLegend className="sr-only">{title}</FieldLegend>
      <div className="sm:col-span-2">
        <h2 className="font-semibold">{title}</h2>
        {description ? <FieldDescription className="mt-1 text-xs">{description}</FieldDescription> : null}
      </div>
      {children}
    </FieldSet>
  );
}

export function FormField({
  label,
  htmlFor,
  error,
  wide,
  children,
}: Readonly<{
  label: React.ReactNode;
  htmlFor?: string;
  error?: string;
  wide?: boolean;
  children: React.ReactNode;
}>) {
  return (
    <Field className={wide ? "sm:col-span-2" : undefined} data-invalid={!!error}>
      <FieldLabel htmlFor={htmlFor} className="block">
        {label}
        {children}
      </FieldLabel>
      <FieldError className="text-xs">{error}</FieldError>
    </Field>
  );
}
