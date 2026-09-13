import { CalendarDays, CircleDollarSign, PackageOpen } from "lucide-react";
import Link from "next/link";
import { PaginationControls } from "@/components/shared/pagination-controls";
import { buttonVariants } from "@/components/ui/button";
import type { ContributionQuery } from "../contribution.schema";
import {
  contributionTypeLabels,
  type ContributionCampaign,
  type ContributionPage,
} from "../contribution.types";
import { ContributionFilters } from "./contribution-filters";
import { ContributionStatusBadge } from "./contribution-status-badge";

const currency = new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" });
const shortDate = (value: string | null) =>
  value ? new Intl.DateTimeFormat("pt-BR", { dateStyle: "medium" }).format(new Date(value)) : null;

function financialProgress(campaign: ContributionCampaign) {
  return campaign.financial_contributions.reduce(
    (total, contribution) => total + Number(contribution.amount),
    0,
  );
}

function itemProgress(campaign: ContributionCampaign) {
  const required = campaign.required_contribution_items.reduce(
    (total, item) => total + Number(item.required_quantity),
    0,
  );
  const committed = campaign.required_contribution_items.reduce(
    (total, item) =>
      total +
      item.item_commitments
        .filter((commitment) => commitment.status !== "CANCELED")
        .reduce((sum, commitment) => sum + Number(commitment.quantity), 0),
    0,
  );
  return { required, committed };
}

export function ContributionDirectory({
  page,
  query,
}: Readonly<{ page: ContributionPage; query: ContributionQuery }>) {
  const pages = Math.max(1, Math.ceil(page.pagination.total / page.pagination.limit));
  const href = (number: number) => {
    const params = new URLSearchParams({ page: String(number) });
    if (query.search) params.set("search", query.search);
    if (query.type) params.set("type", query.type);
    if (query.status) params.set("status", query.status);
    return `/contribuicoes?${params}`;
  };

  return (
    <div className="space-y-5">
      <ContributionFilters query={query} />
      {page.data.length ? (
        <div className="grid gap-4 lg:grid-cols-2">
          {page.data.map((campaign) => {
            const amount = financialProgress(campaign);
            const items = itemProgress(campaign);
            const target = Number(campaign.financial_target ?? 0);
            const percent =
              campaign.type === "FINANCIAL"
                ? target > 0
                  ? Math.min(100, (amount / target) * 100)
                  : 0
                : items.required > 0
                  ? Math.min(100, (items.committed / items.required) * 100)
                  : 0;

            return (
              <article key={campaign.id} className="bg-card flex flex-col rounded-xl border p-5">
                <div className="flex items-start justify-between gap-3">
                  <div className="bg-primary/10 text-primary flex size-11 items-center justify-center rounded-lg">
                    {campaign.type === "FINANCIAL" ? (
                      <CircleDollarSign className="size-5" />
                    ) : (
                      <PackageOpen className="size-5" />
                    )}
                  </div>
                  <ContributionStatusBadge status={campaign.status} />
                </div>
                <p className="text-muted-foreground mt-4 text-xs font-medium tracking-wide uppercase">
                  {contributionTypeLabels[campaign.type]}
                </p>
                <h2 className="mt-1 text-lg font-semibold">{campaign.title}</h2>
                <p className="text-muted-foreground mt-2 line-clamp-2 text-sm">
                  {campaign.description || "Sem descrição."}
                </p>
                <div className="mt-5">
                  <div className="mb-2 flex justify-between text-xs">
                    <span className="text-muted-foreground">Progresso</span>
                    <span className="font-medium">
                      {campaign.type === "FINANCIAL"
                        ? target
                          ? `${currency.format(amount)} de ${currency.format(target)}`
                          : currency.format(amount)
                        : `${items.committed} de ${items.required} itens`}
                    </span>
                  </div>
                  <div className="bg-muted h-2 overflow-hidden rounded-full">
                    <div className="bg-primary h-full rounded-full" style={{ width: `${percent}%` }} />
                  </div>
                </div>
                {(campaign.starts_at || campaign.ends_at) && (
                  <p className="text-muted-foreground mt-4 flex items-center gap-2 text-xs">
                    <CalendarDays className="size-3.5" />
                    {shortDate(campaign.starts_at) || "Sem início"}
                    {campaign.ends_at ? ` até ${shortDate(campaign.ends_at)}` : ""}
                  </p>
                )}
                <Link
                  href={`/contribuicoes/${campaign.id}`}
                  className={buttonVariants({
                    variant: "outline",
                    className: "mt-5 w-full sm:w-fit",
                  })}
                >
                  Ver campanha
                </Link>
              </article>
            );
          })}
        </div>
      ) : (
        <div className="bg-card rounded-xl border border-dashed p-14 text-center">
          <CircleDollarSign className="text-muted-foreground mx-auto size-9" />
          <h2 className="mt-4 font-semibold">Nenhuma campanha encontrada</h2>
          <p className="text-muted-foreground mt-1 text-sm">Ajuste os filtros ou crie a primeira campanha.</p>
        </div>
      )}
      <PaginationControls
        currentPage={query.page}
        totalPages={pages}
        getPageHref={href}
        className="bg-card rounded-xl border px-5 py-4"
      />
    </div>
  );
}
