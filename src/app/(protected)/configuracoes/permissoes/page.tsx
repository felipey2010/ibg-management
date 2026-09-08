import type { Metadata } from "next";
import { AdminLoadError } from "@/components/shared/admin-feedback";
import { AdminPageHeader } from "@/components/shared/admin-page-header";
import { AccessControlWorkspace } from "@/features/access-control/components/access-control-workspace";
import { getPermissions, getRoles } from "@/features/access-control/services/access-control.service";
import { requireAdminSession } from "@/lib/api/admin-api";

export const metadata: Metadata = { title: "Perfis e permissões" };

export default async function PermissionsPage() {
  await requireAdminSession();
  const [roles, permissions] = await Promise.all([getRoles(), getPermissions()]);

  return (
    <div className="mx-auto w-full max-w-7xl px-1 sm:px-2">
      <AdminPageHeader
        current="access"
        title="Perfis e permissões"
        description="Organize o acesso por perfis e defina quais operações cada perfil pode realizar."
      />
      {!roles.ok || !permissions.ok ? (
        <AdminLoadError
          message={
            !roles.ok
              ? roles.message
              : !permissions.ok
                ? permissions.message
                : "Não foi possível carregar os dados."
          }
        />
      ) : (
        <AccessControlWorkspace roles={roles.data} permissions={permissions.data} />
      )}
    </div>
  );
}
