"use client";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { useAdminMutation } from "@/hooks/use-admin-mutation";
import type { Member } from "@/features/members/member.types";
import { addEventParticipant, updateEventParticipant } from "../actions";
import { participationStatusLabels, type EventParticipant } from "../event.types";
export function EventParticipants({
  eventId,
  participants,
  candidates,
  canManage,
  registrationEnabled,
}: Readonly<{
  eventId: string;
  participants: EventParticipant[];
  candidates: Member[];
  canManage: boolean;
  registrationEnabled: boolean;
}>) {
  const assigned = new Set(participants.map((p) => p.member_id)),
    available = candidates.filter((m) => !assigned.has(m.id));
  const [memberId, setMemberId] = useState(available[0]?.id ?? "");
  const { pending, execute } = useAdminMutation();
  return (
    <section className="border-t p-6 sm:p-8">
      <div className="flex items-end justify-between">
        <div>
          <h2 className="font-semibold">Participantes</h2>
          <p className="text-muted-foreground mt-1 text-sm">Gerencie inscrições e presença.</p>
        </div>
        <span className="text-muted-foreground text-sm">{participants.length} inscritos</span>
      </div>
      {canManage && registrationEnabled && available.length ? (
        <div className="bg-muted/35 mt-5 flex flex-col gap-3 rounded-lg p-4 sm:flex-row">
          <select
            value={memberId}
            onChange={(e) => setMemberId(e.target.value)}
            className="border-input bg-background h-10 min-w-0 flex-1 rounded-lg border px-3 text-sm"
          >
            {available.map((m) => (
              <option key={m.id} value={m.id}>
                {m.first_name} {m.last_name}
              </option>
            ))}
          </select>
          <Button
            disabled={pending || !memberId}
            onClick={() =>
              execute(() => addEventParticipant({ eventId, memberId }), "Participante inscrito com sucesso.")
            }
          >
            Inscrever membro
          </Button>
        </div>
      ) : null}
      {participants.length ? (
        <ul className="mt-5 divide-y rounded-lg border">
          {participants.map((p) => (
            <li key={p.id} className="flex flex-col gap-3 p-4 sm:flex-row sm:items-center">
              <div className="min-w-0 flex-1">
                <p className="font-medium">
                  {p.members.first_name} {p.members.last_name}
                </p>
                <p className="text-muted-foreground text-xs">
                  {p.members.email || p.members.phone || "Contato não informado"}
                </p>
              </div>
              {canManage ? (
                <select
                  value={p.status}
                  disabled={pending}
                  onChange={(e) =>
                    execute(
                      () =>
                        updateEventParticipant({ eventId, memberId: p.member_id, status: e.target.value }),
                      "Participação atualizada.",
                    )
                  }
                  className="border-input bg-background h-9 rounded-lg border px-3 text-sm"
                >
                  {Object.entries(participationStatusLabels).map(([v, l]) => (
                    <option key={v} value={v}>
                      {l}
                    </option>
                  ))}
                </select>
              ) : (
                <span className="text-muted-foreground text-sm">{participationStatusLabels[p.status]}</span>
              )}
            </li>
          ))}
        </ul>
      ) : (
        <div className="text-muted-foreground mt-5 rounded-lg border border-dashed p-8 text-center text-sm">
          Nenhum participante inscrito.
        </div>
      )}
    </section>
  );
}
