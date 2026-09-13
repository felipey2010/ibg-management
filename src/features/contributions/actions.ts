"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";
import {
  contributionFormSchema,
  financialContributionSchema,
  itemCommitmentSchema,
  requiredItemSchema,
} from "./contribution.schema";
import { requestContributionApi, type ContributionResult } from "./services/contribution.service";
import type {
  ContributionCampaign,
  FinancialContribution,
  ItemCommitment,
  RequiredContributionItem,
} from "./contribution.types";

export async function saveContributionCampaign(
  input: unknown,
): Promise<ContributionResult<ContributionCampaign>> {
  const parsed = z
    .object({ id: z.string().uuid().optional(), values: contributionFormSchema })
    .safeParse(input);
  if (!parsed.success) return { ok: false, status: 400, message: "Confira os dados da campanha." };

  const { id, values } = parsed.data;
  const result = await requestContributionApi<ContributionCampaign>(
    id ? `/${id}` : "",
    id ? "contributions.update" : "contributions.create",
    {
      method: id ? "PUT" : "POST",
      body: JSON.stringify({
        ...values,
        financial_target: values.type === "FINANCIAL" ? values.financial_target : null,
      }),
    },
  );
  if (result.ok) revalidatePath("/contribuicoes");
  return result;
}

export async function archiveContributionCampaign(
  id: string,
): Promise<ContributionResult<ContributionCampaign>> {
  if (!z.string().uuid().safeParse(id).success)
    return { ok: false, status: 400, message: "Campanha inválida." };
  const result = await requestContributionApi<ContributionCampaign>(`/${id}`, "contributions.delete", {
    method: "DELETE",
  });
  if (result.ok) revalidatePath("/contribuicoes");
  return result;
}

export async function recordFinancialContribution(
  input: unknown,
): Promise<ContributionResult<FinancialContribution>> {
  const parsed = z
    .object({ campaignId: z.string().uuid(), values: financialContributionSchema })
    .safeParse(input);
  if (!parsed.success) return { ok: false, status: 400, message: "Confira os dados da contribuição." };
  const result = await requestContributionApi<FinancialContribution>(
    `/${parsed.data.campaignId}/financial`,
    "contributions.record",
    { method: "POST", body: JSON.stringify(parsed.data.values) },
  );
  if (result.ok) revalidatePath(`/contribuicoes/${parsed.data.campaignId}`);
  return result;
}

export async function addRequiredContributionItem(
  input: unknown,
): Promise<ContributionResult<RequiredContributionItem>> {
  const parsed = z.object({ campaignId: z.string().uuid(), values: requiredItemSchema }).safeParse(input);
  if (!parsed.success) return { ok: false, status: 400, message: "Confira os dados do item." };
  const result = await requestContributionApi<RequiredContributionItem>(
    `/${parsed.data.campaignId}/items`,
    "contributions.update",
    { method: "POST", body: JSON.stringify(parsed.data.values) },
  );
  if (result.ok) revalidatePath(`/contribuicoes/${parsed.data.campaignId}`);
  return result;
}

export async function recordItemCommitment(input: unknown): Promise<ContributionResult<ItemCommitment>> {
  const parsed = z
    .object({
      campaignId: z.string().uuid(),
      itemId: z.string().uuid(),
      values: itemCommitmentSchema,
    })
    .safeParse(input);
  if (!parsed.success) return { ok: false, status: 400, message: "Confira os dados da contribuição." };
  const result = await requestContributionApi<ItemCommitment>(
    `/${parsed.data.campaignId}/items/${parsed.data.itemId}/commitments`,
    "contributions.record",
    { method: "POST", body: JSON.stringify(parsed.data.values) },
  );
  if (result.ok) revalidatePath(`/contribuicoes/${parsed.data.campaignId}`);
  return result;
}
