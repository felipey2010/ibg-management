import { DashboardSection } from "@/features/dashboard/components/dashboard-section";
import { contributionCampaigns } from "@/features/dashboard/data/dashboard.mock";
import { cn } from "@/lib/utils";

export function ContributionCampaigns() {
  return (
    <DashboardSection title="Campanhas de contribuição" description="Ativas no momento" linkLabel="Ver tudo">
      <div className="divide-y">
        {contributionCampaigns.map((campaign) => (
          <article key={campaign.id} className="py-4">
            <div className="flex items-start justify-between gap-3">
              <div>
                <h3 className="text-xs font-semibold">{campaign.title}</h3>
                <p className="text-muted-foreground mt-1 text-xs">{campaign.summary}</p>
              </div>
              <span className="text-tertiary text-[0.6rem] tracking-[0.08em] uppercase">{campaign.type}</span>
            </div>
            <div
              className="bg-muted mt-3 h-1.5 overflow-hidden rounded-full"
              role="progressbar"
              aria-label={`Progresso de ${campaign.title}`}
              aria-valuemin={0}
              aria-valuemax={100}
              aria-valuenow={campaign.progress}
            >
              <span
                className={cn(
                  "block h-full rounded-full",
                  campaign.tone === "brand" ? "bg-primary" : "bg-success",
                )}
                style={{ width: `${campaign.progress}%` }}
              />
            </div>
            <div className="text-tertiary mt-2 flex justify-between gap-3 text-[0.68rem]">
              <span>{campaign.footerStart}</span>
              <span>{campaign.footerEnd}</span>
            </div>
          </article>
        ))}
      </div>
    </DashboardSection>
  );
}
