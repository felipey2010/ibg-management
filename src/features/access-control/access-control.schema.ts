import { z } from "zod";

export const roleSchema = z.object({
  name: z.string().trim().min(2, "Informe ao menos 2 caracteres.").max(100),
  code: z
    .string()
    .trim()
    .min(2, "Informe o código.")
    .max(100)
    .regex(/^[A-Z][A-Z0-9_]*$/, "Use letras maiúsculas, números e sublinhados."),
  description: z.string().trim().max(500, "Use no máximo 500 caracteres."),
});

export const permissionSchema = roleSchema.pick({ description: true }).extend({
  code: z
    .string()
    .trim()
    .min(2, "Informe o código.")
    .max(100)
    .regex(/^[A-Za-z][A-Za-z0-9_.:-]*$/, "Use letras, números, pontos, dois-pontos, hífens ou sublinhados."),
});

export const rolePermissionsSchema = z.object({
  id: z.string().uuid(),
  permissionCodes: z.array(permissionSchema.shape.code).max(100, "Selecione no máximo 100 permissões."),
});

export type RoleValues = z.infer<typeof roleSchema>;
export type PermissionValues = z.infer<typeof permissionSchema>;
