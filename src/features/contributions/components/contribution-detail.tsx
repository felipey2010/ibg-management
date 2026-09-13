"use client";

import { useState } from "react";
import { ArrowLeft, CalendarDays, Pencil, Trash2 } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ConfirmationDialog } from "@/components/shared/confirmation-dialog";
import { Button, buttonVariants } from "@/components/ui/button";
import type { Member } from "@/features/members/member.types";
import { useAdminMutation } from "@/hooks/use-admin-mutation";
import { archiveContributionCampaign } from "../actions";
import {
  contributionTypeLabels,
  paymentMethodLabels,
  type ContributionCampaign,
} from "../contribution.types";
import { ContributionStatusBadge } from "./contribution-status-badge";
import { FinancialContributionForm } from "./financial-contribution-form";
import { ItemCommitmentForm } from "./item-commitment-form";
import { RequiredItemForm } from "./required-item-form";

const currency = new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" });
const date = (value: string | null) =>
  value
    ? new Intl.DateTimeFormat("pt-BR", { dateStyle: "medium", timeStyle: "short" }).format(new Date(value))
    : "Não definido";

export function ContributionDetail({
  campaign,
  members,
  canUpdate,
  canDelete,
  canRecord,
}: Readonly<{
  campaign: ContributionCampaign;
  members: Member[];
  canUpdate: boolean;
  canDelete: boolean;
  canRecord: boolean;
}>) {
  const router = useRouter();
  const { pending, execute } = useAdminMutation();
  const [confirmArchive, setConfirmArchive] = useState(false);
  const total = campaign.financial_contributions.reduce(
    (sum, contribution) => sum + Number(contribution.amount),
    0,
  );
  const target = Number(campaign.financial_target ?? 0);
  const percent = target > 0 ? Math.min(100, (total / target) * 100) : 0;
  const acceptsEntries = campaign.status === "ACTIVE";

  return (
    <>
      <Button type="button" variant="ghost" className="mb-4" onClick={() => router.back()}>
        <ArrowLeft />
        Voltar
      </Button>
      <article className="bg-card overflow-hidden rounded-xl border">
        <header className="bg-muted/35 border-b p-6 sm:p-8">
          <div className="flex flex-col gap-5 sm:flex-row sm:items-start">
            <div className="min-w-0 flex-1">
              <div className="flex flex-wrap items-center gap-2">
                <ContributionStatusBadge status={campaign.status} />
                <span className="text-muted-foreground text-xs">{contributionTypeLabels[campaign.type]}</span>
              </div>
              <h1 className="mt-4 font-serif text-2xl font-semibold sm:text-3xl">{campaign.title}</h1>
              <p className="text-muted-foreground mt-3 max-w-3xl text-sm leading-6">
                {campaign.description || "Nenhuma descrição registrada."}
              </p>
            </div>
            <div className="flex flex-wrap gap-2">
              {canUpdate ? (
                <Link
                  href={`/contribuicoes/${campaign.id}/editar`}
                  className={buttonVariants({ variant: "outline" })}
                >
                  <Pencil />
                  Editar
                </Link>
              ) : null}
              {canDelete && campaign.status !== "ARCHIVED" ? (
                <Button type="button" variant="destructive" onClick={() => setConfirmArchive(true)}>
                  <Trash2 />
                  Arquivar
                </Button>
              ) : null}
            </div>
          </div>
          <div className="text-muted-foreground mt-6 flex flex-wrap gap-x-6 gap-y-2 text-xs">
            <span className="flex items-center gap-2">
              <CalendarDays className="size-3.5" />
              Início: {date(campaign.starts_at)}
            </span>
            <span className="flex items-center gap-2">
              <CalendarDays className="size-3.5" />
              Término: {date(campaign.ends_at)}
            </span>
          </div>
        </header>

        {campaign.type === "FINANCIAL" ? (
          <div className="divide-y">
            <section className="p-6 sm:p-8">
              <div className="flex flex-col justify-between gap-2 sm:flex-row sm:items-end">
                <div>
                  <p className="text-muted-foreground text-sm">Total arrecadado</p>
                  <p className="mt-1 text-3xl font-semibold">{currency.format(total)}</p>
                </div>
                <p className="text-muted-foreground text-sm">
                  {target ? `Meta: ${currency.format(target)}` : "Sem meta definida"}
                </p>
              </div>
              {target ? (
                <div className="mt-5">
                  <div className="bg-muted h-2.5 overflow-hidden rounded-full">
                    <div className="bg-primary h-full rounded-full" style={{ width: `${percent}%` }} />
                  </div>
                  <p className="text-muted-foreground mt-2 text-right text-xs">
                    {percent.toFixed(0)}% da meta
                  </p>
                </div>
              ) : null}
            </section>
            {canRecord && acceptsEntries ? (
              <section className="p-6 sm:p-8">
                <h2 className="mb-5 font-semibold">Registrar contribuição</h2>
                <FinancialContributionForm campaignId={campaign.id} members={members} />
              </section>
            ) : null}
            <section className="p-6 sm:p-8">
              <h2 className="font-semibold">Histórico financeiro</h2>
              {campaign.financial_contributions.length ? (
                <div className="mt-4 overflow-x-auto rounded-lg border">
                  <table className="w-full text-left text-sm">
                    <thead className="bg-muted/50 text-muted-foreground text-xs">
                      <tr>
                        <th className="px-4 py-3 font-medium">Data</th>
                        <th className="px-4 py-3 font-medium">Contribuinte</th>
                        <th className="px-4 py-3 font-medium">Forma</th>
                        <th className="px-4 py-3 text-right font-medium">Valor</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y">
                      {campaign.financial_contributions.map((contribution) => (
                        <tr key={contribution.id}>
                          <td className="px-4 py-3 whitespace-nowrap">{date(contribution.contributed_at)}</td>
                          <td className="px-4 py-3">
                            {contribution.members
                              ? `${contribution.members.first_name} ${contribution.members.last_name}`
                              : "Não identificado"}
                          </td>
                          <td className="px-4 py-3">
                            {contribution.payment_method
                              ? paymentMethodLabels[contribution.payment_method]
                              : "Não informada"}
                          </td>
                          <td className="px-4 py-3 text-right font-medium">
                            {currency.format(Number(contribution.amount))}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <p className="text-muted-foreground mt-4 text-sm">Nenhuma contribuição registrada.</p>
              )}
            </section>
          </div>
        ) : (
          <div className="divide-y">
            {canUpdate && campaign.status !== "CLOSED" && campaign.status !== "ARCHIVED" ? (
              <section className="p-6 sm:p-8">
                <h2 className="mb-5 font-semibold">Adicionar item necessário</h2>
                <RequiredItemForm campaignId={campaign.id} />
              </section>
            ) : null}
            <section className="p-6 sm:p-8">
              <h2 className="font-semibold">Itens solicitados</h2>
              {campaign.required_contribution_items.length ? (
                <div className="mt-4 grid gap-3 sm:grid-cols-2">
                  {campaign.required_contribution_items.map((item) => {
                    const committed = item.item_commitments
                      .filter((entry) => entry.status !== "CANCELED")
                      .reduce((sum, entry) => sum + Number(entry.quantity), 0);
                    return (
                      <div key={item.id} className="rounded-lg border p-4">
                        <div className="flex items-start justify-between gap-3">
                          <div>
                            <h3 className="font-medium">{item.name}</h3>
                            <p className="text-muted-foreground mt-1 text-xs">
                              {item.description || "Sem descrição"}
                            </p>
                          </div>
                          <span className="text-sm font-semibold">
                            {committed}/{Number(item.required_quantity)} {item.unit}
                          </span>
                        </div>
                        {canRecord && acceptsEntries ? (
                          <ItemCommitmentForm campaignId={campaign.id} itemId={item.id} members={members} />
                        ) : null}
                      </div>
                    );
                  })}
                </div>
              ) : (
                <p className="text-muted-foreground mt-4 text-sm">Nenhum item solicitado.</p>
              )}
            </section>
          </div>
        )}
      </article>
      <ConfirmationDialog
        open={confirmArchive}
        onOpenChange={setConfirmArchive}
        title={`Arquivar “${campaign.title}”?`}
        description="A campanha deixará de receber lançamentos e continuará disponível no histórico."
        confirmLabel="Arquivar campanha"
        destructive
        pending={pending}
        onConfirm={() =>
          execute(
            () => archiveContributionCampaign(campaign.id),
            "Campanha arquivada com sucesso.",
            () => router.push("/contribuicoes"),
          )
        }
      />
    </>
  );
}
