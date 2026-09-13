"use client";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { useAdminMutation } from "@/hooks/use-admin-mutation";
import type { Member } from "@/features/members/member.types";
import { addMinistryMember, removeMinistryMember, updateMinistryMember } from "../actions";
import { ministryRoleLabels, type MinistryMember } from "../ministry.types";

export function MinistryRoster({
  ministryId,
  roster,
  candidates,
  canManage,
}: Readonly<{ ministryId: string; roster: MinistryMember[]; candidates: Member[]; canManage: boolean }>) {
  const assigned = new Set(roster.map((item) => item.member_id));
  const available = candidates.filter((item) => !assigned.has(item.id));
  const [memberId, setMemberId] = useState(available[0]?.id ?? "");
  const [role, setRole] = useState<"LEADER" | "MEMBER">("MEMBER");
  const { pending, execute } = useAdminMutation();
  return (
    <section className="border-t p-6">
      <div className="flex flex-col justify-between gap-2 sm:flex-row sm:items-end">
        <div>
          <h2 className="font-semibold">Equipe do ministério</h2>
          <p className="text-muted-foreground mt-1 text-sm">Defina participantes e responsabilidades.</p>
        </div>
        <span className="text-muted-foreground text-sm">
          {roster.length} {roster.length === 1 ? "participante" : "participantes"}
        </span>
      </div>
      {canManage && available.length ? (
        <div className="bg-muted/35 mt-5 grid gap-3 rounded-lg p-4 sm:grid-cols-[1fr_160px_auto]">
          <select
            value={memberId}
            onChange={(e) => setMemberId(e.target.value)}
            className="border-input bg-background h-10 rounded-lg border px-3 text-sm"
            aria-label="Membro"
          >
            <option value="">Selecione um membro</option>
            {available.map((member) => (
              <option value={member.id} key={member.id}>
                {member.first_name} {member.last_name}
              </option>
            ))}
          </select>
          <select
            value={role}
            onChange={(e) => setRole(e.target.value as typeof role)}
            className="border-input bg-background h-10 rounded-lg border px-3 text-sm"
            aria-label="Função"
          >
            <option value="MEMBER">Membro</option>
            <option value="LEADER">Liderança</option>
          </select>
          <Button
            disabled={pending || !memberId}
            onClick={() =>
              execute(
                () => addMinistryMember({ ministryId, memberId, role }),
                "Participante adicionado com sucesso.",
              )
            }
          >
            Adicionar
          </Button>
        </div>
      ) : null}
      {roster.length ? (
        <ul className="mt-5 divide-y rounded-lg border">
          {roster.map((item) => (
            <li key={item.id} className="flex flex-col gap-3 p-4 sm:flex-row sm:items-center">
              <div className="min-w-0 flex-1">
                <p className="font-medium">
                  {item.members.first_name} {item.members.last_name}
                </p>
                <p className="text-muted-foreground text-xs">
                  {item.members.email || item.members.phone || "Contato não informado"}
                </p>
              </div>
              {canManage ? (
                <>
                  <select
                    value={item.role}
                    disabled={pending}
                    onChange={(e) =>
                      execute(
                        () =>
                          updateMinistryMember({
                            ministryId,
                            memberId: item.member_id,
                            role: e.target.value,
                          }),
                        "Responsabilidade atualizada.",
                      )
                    }
                    className="border-input bg-background h-9 rounded-lg border px-3 text-sm"
                    aria-label={`Função de ${item.members.first_name}`}
                  >
                    {Object.entries(ministryRoleLabels).map(([value, label]) => (
                      <option key={value} value={value}>
                        {label}
                      </option>
                    ))}
                  </select>
                  <Button
                    variant="outline"
                    size="sm"
                    disabled={pending}
                    onClick={() =>
                      execute(
                        () => removeMinistryMember({ ministryId, memberId: item.member_id }),
                        "Participante removido do ministério.",
                      )
                    }
                  >
                    Remover
                  </Button>
                </>
              ) : (
                <span className="text-muted-foreground text-sm">{ministryRoleLabels[item.role]}</span>
              )}
            </li>
          ))}
        </ul>
      ) : (
        <div className="text-muted-foreground mt-5 rounded-lg border border-dashed p-8 text-center text-sm">
          Nenhum participante vinculado.
        </div>
      )}
      {canManage && !available.length ? (
        <p className="text-muted-foreground mt-4 text-xs">
          Todos os membros ativos disponíveis já participam deste ministério.
        </p>
      ) : null}
    </section>
  );
}
