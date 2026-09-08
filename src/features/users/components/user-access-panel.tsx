"use client";
import { useState } from "react";
import { LogOut, ShieldPlus, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ConfirmationDialog } from "@/components/shared/confirmation-dialog";
import { useAdminMutation } from "@/hooks/use-admin-mutation";
import { getInitials } from "@/lib/utils";
import { updateUserAccess } from "../actions";
import type { AdminUser } from "../user.types";
import type { Role } from "@/features/access-control/access-control.types";
import type { AccountStatus } from "@/lib/auth/auth.types";
import type { UserMutation } from "../user.schema";
import { userStatusLabels } from "../user.constants";
import { UserStatusBadge } from "./user-status-badge";

type Confirmation = {
  mutation: UserMutation;
  title: string;
  description: string;
  label: string;
  destructive?: boolean;
};

export function UserAccessPanel({
  user,
  roles,
  currentUserId,
  onClose,
}: Readonly<{ user: AdminUser; roles: Role[]; currentUserId: string; onClose: () => void }>) {
  const [status, setStatus] = useState(user.status);
  const [roleCode, setRoleCode] = useState("");
  const [confirmation, setConfirmation] = useState<Confirmation | null>(null);
  const { pending, execute } = useAdminMutation();
  const availableRoles = roles.filter((role) => !user.roles.some((assigned) => assigned.id === role.id));
  const selfNotice =
    user.id === currentUserId
      ? " Esta é sua conta; você precisará entrar novamente."
      : " O usuário precisará entrar novamente.";
  const statusItems = Object.entries(userStatusLabels).map(([value, label]) => ({ value, label }));

  return (
    <>
      <Sheet
        open
        onOpenChange={(open) => {
          if (!open && !pending) onClose();
        }}
      >
        <SheetContent
          className="gap-0 overflow-y-auto data-[side=right]:w-full data-[side=right]:sm:max-w-lg"
          showCloseButton={!pending}
        >
          <SheetHeader className="border-b p-6 pr-12">
            <div className="bg-muted text-foreground mb-3 flex size-12 items-center justify-center rounded-xl text-base font-semibold">
              {getInitials(user.fullName)}
            </div>
            <SheetTitle className="text-xl font-semibold">{user.fullName}</SheetTitle>
            <SheetDescription className="break-all">{user.email}</SheetDescription>
            <div className="mt-3">
              <UserStatusBadge status={user.status} />
            </div>
          </SheetHeader>
          <div className="space-y-8 p-6">
            <section className="space-y-4">
              <div>
                <h3 className="font-semibold">Situação da conta</h3>
                <p className="text-muted-foreground mt-1 text-xs leading-relaxed">
                  Aprove cadastros e controle o acesso à plataforma.
                </p>
              </div>
              <Label htmlFor="account-status">Status</Label>
              <Select
                value={status}
                onValueChange={(value) => {
                  if (value) setStatus(value as AccountStatus);
                }}
                items={statusItems}
                disabled={pending}
              >
                <SelectTrigger id="account-status" className="w-full">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {statusItems.map((item) => (
                    <SelectItem key={item.value} value={item.value}>
                      {item.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Button
                variant="outline"
                disabled={pending || status === user.status}
                onClick={() =>
                  setConfirmation({
                    mutation: { action: "status", id: user.id, status },
                    title: `Alterar status de ${user.fullName}?`,
                    description: `A conta passará de “${userStatusLabels[user.status]}” para “${userStatusLabels[status]}”. Você poderá alterar o status novamente.${selfNotice}`,
                    label: "Confirmar alteração",
                    destructive: status !== "ACTIVE",
                  })
                }
              >
                Aplicar status
              </Button>
            </section>
            <section className="space-y-4 border-t pt-6">
              <div>
                <h3 className="font-semibold">Perfis de acesso</h3>
                <p className="text-muted-foreground mt-1 text-xs">
                  As permissões se somam entre os perfis atribuídos.
                </p>
              </div>
              <ul className="divide-y rounded-lg border">
                {user.roles.length ? (
                  user.roles.map((role) => (
                    <li key={role.id} className="flex items-center justify-between gap-3 p-3">
                      <div className="min-w-0">
                        <p className="font-medium">{role.name}</p>
                        <p className="text-muted-foreground truncate font-mono text-xs">{role.code}</p>
                      </div>
                      <Button
                        variant="ghost"
                        size="icon-sm"
                        disabled={pending}
                        aria-label={`Remover perfil ${role.name}`}
                        onClick={() =>
                          setConfirmation({
                            mutation: { action: "remove", id: user.id, roleCode: role.code },
                            title: `Remover o perfil ${role.name}?`,
                            description: `${user.fullName} perderá as permissões deste perfil. É possível atribuí-lo novamente.${selfNotice}`,
                            label: "Remover perfil",
                            destructive: true,
                          })
                        }
                      >
                        <Trash2 className="size-4" />
                      </Button>
                    </li>
                  ))
                ) : (
                  <li className="text-muted-foreground p-4 text-sm">Nenhum perfil atribuído.</li>
                )}
              </ul>
              {availableRoles.length ? (
                <div className="space-y-3">
                  <Label htmlFor="assign-role">Adicionar perfil</Label>
                  <Select
                    items={[
                      { value: "", label: "Selecione um perfil" },
                      ...availableRoles.map((role) => ({ value: role.code, label: role.name })),
                    ]}
                    value={roleCode}
                    onValueChange={(value) => setRoleCode(value ?? "")}
                    disabled={pending}
                  >
                    <SelectTrigger id="assign-role" className="w-full">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="">Selecione um perfil</SelectItem>
                      {availableRoles.map((role) => (
                        <SelectItem key={role.id} value={role.code}>
                          {role.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <Button
                    disabled={!roleCode || pending}
                    variant="outline"
                    onClick={() =>
                      setConfirmation({
                        mutation: { action: "assign", id: user.id, roleCode },
                        title: "Atribuir perfil de acesso?",
                        description: `${user.fullName} receberá as permissões do perfil “${availableRoles.find((role) => role.code === roleCode)?.name}”. Você poderá remover essa atribuição.${selfNotice}`,
                        label: "Atribuir perfil",
                      })
                    }
                  >
                    <ShieldPlus className="size-4" /> Atribuir perfil
                  </Button>
                </div>
              ) : (
                <p className="text-muted-foreground text-xs">
                  Todos os perfis disponíveis já foram atribuídos.
                </p>
              )}
            </section>
            <section className="space-y-3 border-t pt-6">
              <h3 className="font-semibold">Sessões e segurança</h3>
              <p className="text-muted-foreground text-xs leading-relaxed">
                Encerre o acesso desta conta em todos os dispositivos. Os dados do usuário serão preservados.
              </p>
              <Button
                variant="outline"
                disabled={pending}
                onClick={() =>
                  setConfirmation({
                    mutation: { action: "revoke", id: user.id },
                    title: "Encerrar todas as sessões?",
                    description: `Todas as sessões de ${user.fullName} serão encerradas. Não é possível restaurá-las; um novo login será necessário.${selfNotice}`,
                    label: "Encerrar sessões",
                    destructive: true,
                  })
                }
              >
                <LogOut className="size-4" /> Encerrar sessões
              </Button>
            </section>
          </div>
        </SheetContent>
      </Sheet>
      <ConfirmationDialog
        open={!!confirmation}
        onOpenChange={(open) => {
          if (!open) setConfirmation(null);
        }}
        title={confirmation?.title ?? ""}
        description={confirmation?.description ?? ""}
        confirmLabel={confirmation?.label ?? "Confirmar"}
        destructive={confirmation?.destructive}
        pending={pending}
        onConfirm={async () => {
          if (!confirmation) return;
          await execute(
            () => updateUserAccess(confirmation.mutation),
            "Acesso do usuário atualizado com sucesso.",
            () => {
              setConfirmation(null);
              setRoleCode("");
              if (user.id === currentUserId) window.location.replace("/login?error=session");
            },
          );
        }}
      />
    </>
  );
}
