import type { Metadata } from "next";
import { AdminLoadError } from "@/components/shared/admin-feedback";
import { AdminPageHeader } from "@/components/shared/admin-page-header";
import { getRoles } from "@/features/access-control/services/access-control.service";
import { UserDirectory } from "@/features/users/components/user-directory";
import { getUsers } from "@/features/users/services/users.service";
import { userQuerySchema } from "@/features/users/user.schema";
import { requireAdminSession } from "@/lib/api/admin-api";

export const metadata: Metadata = { title: "Usuários" };

export default async function UsersPage({
  searchParams,
}: Readonly<{ searchParams: Promise<Record<string, string | string[] | undefined>> }>) {
  const session = await requireAdminSession();
  const query = userQuerySchema.parse(await searchParams);
  const [users, roles] = await Promise.all([getUsers(query), getRoles()]);

  return (
    <div className="mx-auto w-full max-w-7xl px-1 sm:px-2">
      <AdminPageHeader
        current="users"
        title="Usuários"
        description="Aprove cadastros, atribua perfis e encerre sessões de contas registradas."
      />
      {!users.ok || !roles.ok ? (
        <AdminLoadError
          message={
            !users.ok ? users.message : !roles.ok ? roles.message : "Não foi possível carregar os dados."
          }
        />
      ) : (
        <UserDirectory users={users.data} roles={roles.data} query={query} currentUserId={session.user.id} />
      )}
    </div>
  );
}
