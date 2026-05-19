export interface CampaignRoiInput {
  campaign: string;
  source?: string;
  medium?: string;
  cost?: number;
  activations: number;
  leads: number;
  mqls: number;
  sqls: number;
  opportunities: number;
  pipelineValue?: number;
  closedWonValue?: number;
  currency: string;
}

export interface CampaignRoiReport {
  campaign: string;
  source?: string;
  medium?: string;
  cost: number | null;
  currency: string;
  activations: number;
  leads: number;
  mqls: number;
  sqls: number;
  opportunities: number;
  pipelineValue: number | null;
  closedWonValue: number | null;
  costPerActivation: number | null;
  costPerLead: number | null;
  costPerMql: number | null;
  costPerOpportunity: number | null;
  pipelineRoi: number | null;
  bookedRoi: number | null;
  valueBasis: "activation_only" | "pipeline_estimate" | "booked_revenue";
  warnings: string[];
}

interface CampaignAccumulator {
  campaign: string;
  source?: string;
  medium?: string;
  currency: string;
  cost: number;
  hasCost: boolean;
  activations: number;
  leads: number;
  mqls: number;
  sqls: number;
  opportunities: number;
  pipelineValue: number;
  hasPipelineValue: boolean;
  closedWonValue: number;
  hasClosedWonValue: boolean;
}

export function buildCampaignRoiReport(rows: CampaignRoiInput[]): CampaignRoiReport[] {
  const campaigns = new Map<string, CampaignAccumulator>();

  for (const row of rows) {
    const key = getCampaignKey(row);
    const existing = campaigns.get(key) ?? createAccumulator(row);

    existing.cost += row.cost ?? 0;
    existing.hasCost = existing.hasCost || row.cost !== undefined;
    existing.activations += row.activations;
    existing.leads += row.leads;
    existing.mqls += row.mqls;
    existing.sqls += row.sqls;
    existing.opportunities += row.opportunities;
    existing.pipelineValue += row.pipelineValue ?? 0;
    existing.hasPipelineValue = existing.hasPipelineValue || row.pipelineValue !== undefined;
    existing.closedWonValue += row.closedWonValue ?? 0;
    existing.hasClosedWonValue = existing.hasClosedWonValue || row.closedWonValue !== undefined;
    campaigns.set(key, existing);
  }

  return Array.from(campaigns.values()).map(toCampaignReport);
}

function createAccumulator(row: CampaignRoiInput): CampaignAccumulator {
  return {
    campaign: row.campaign,
    source: row.source,
    medium: row.medium,
    currency: row.currency,
    cost: 0,
    hasCost: false,
    activations: 0,
    leads: 0,
    mqls: 0,
    sqls: 0,
    opportunities: 0,
    pipelineValue: 0,
    hasPipelineValue: false,
    closedWonValue: 0,
    hasClosedWonValue: false,
  };
}

function toCampaignReport(campaign: CampaignAccumulator): CampaignRoiReport {
  const cost = campaign.hasCost ? campaign.cost : null;
  const pipelineValue = campaign.hasPipelineValue ? campaign.pipelineValue : null;
  const closedWonValue = campaign.hasClosedWonValue ? campaign.closedWonValue : null;
  const warnings = getWarnings(campaign);

  return {
    campaign: campaign.campaign,
    source: campaign.source,
    medium: campaign.medium,
    cost,
    currency: campaign.currency,
    activations: campaign.activations,
    leads: campaign.leads,
    mqls: campaign.mqls,
    sqls: campaign.sqls,
    opportunities: campaign.opportunities,
    pipelineValue,
    closedWonValue,
    costPerActivation: ratio(cost, campaign.activations),
    costPerLead: ratio(cost, campaign.leads),
    costPerMql: ratio(cost, campaign.mqls),
    costPerOpportunity: ratio(cost, campaign.opportunities),
    pipelineRoi: roi(cost, pipelineValue),
    bookedRoi: roi(cost, closedWonValue),
    valueBasis: getValueBasis(pipelineValue, closedWonValue),
    warnings,
  };
}

function getWarnings(campaign: CampaignAccumulator) {
  const warnings: string[] = [];
  if (!campaign.hasCost) warnings.push("cost_missing");
  if (!campaign.hasPipelineValue) warnings.push("pipeline_value_missing");
  if (!campaign.hasClosedWonValue) warnings.push("closed_won_value_missing");
  if (campaign.hasClosedWonValue && campaign.closedWonValue === 0) warnings.push("closed_won_value_zero");
  if (campaign.opportunities === 0) warnings.push("opportunities_zero");
  return warnings;
}

function getValueBasis(pipelineValue: number | null, closedWonValue: number | null): CampaignRoiReport["valueBasis"] {
  if ((closedWonValue ?? 0) > 0) return "booked_revenue";
  if ((pipelineValue ?? 0) > 0) return "pipeline_estimate";
  return "activation_only";
}

function ratio(cost: number | null, denominator: number) {
  if (cost === null || denominator <= 0) return null;
  return round(cost / denominator);
}

function roi(cost: number | null, value: number | null) {
  if (cost === null || value === null || cost <= 0) return null;
  return round((value - cost) / cost);
}

function round(value: number) {
  return Math.round(value * 100) / 100;
}

function getCampaignKey(row: CampaignRoiInput) {
  return [row.campaign, row.source ?? "", row.medium ?? "", row.currency].join("::");
}
