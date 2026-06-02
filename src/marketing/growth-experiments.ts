import { getMarketingLinkByPath, type MarketingPrimaryCta } from "./link-catalog";

export const growthExperimentStatuses = ["planned", "active", "paused", "complete"] as const;
export const growthLifecycleStages = ["discovery", "validation", "activation", "monetization", "retention", "scale"] as const;

export type GrowthExperimentStatus = (typeof growthExperimentStatuses)[number];
export type GrowthLifecycleStage = (typeof growthLifecycleStages)[number];

export interface GrowthExperiment {
  id: string;
  status: GrowthExperimentStatus;
  lifecycleStage: GrowthLifecycleStage;
  targetUser: string;
  controlPath: string;
  variantPath: string;
  primaryCta: MarketingPrimaryCta;
  primaryMetric: "cta_clicked_per_page_view";
  guardrailMetric: "generation_failed_per_generation_started";
  decisionRule: string;
  minimumWindow: "14_days";
  evidenceRequired: string;
}

export const growthExperimentRegistry: readonly GrowthExperiment[] = [
  {
    id: "2026_q2_landing_page_intent_comparison",
    status: "active",
    lifecycleStage: "validation",
    targetUser: "ai_project_builder",
    controlPath: "/product/github-repo-to-launch-package",
    variantPath: "/use-cases/ai-project-launch",
    primaryCta: "generate_launch_card",
    primaryMetric: "cta_clicked_per_page_view",
    guardrailMetric: "generation_failed_per_generation_started",
    decisionRule: "higher_cta_rate_with_no_significant_guardrail_regression",
    minimumWindow: "14_days",
    evidenceRequired: "ga4_page_view_and_cta_clicked_and_generation_started_and_generation_failed",
  },
];

export function getGrowthExperimentById(id: string) {
  return growthExperimentRegistry.find((experiment) => experiment.id === id);
}

export function getGrowthExperimentRoutePairs() {
  return growthExperimentRegistry.map((experiment) => ({
    experiment,
    control: getMarketingLinkByPath(experiment.controlPath),
    variant: getMarketingLinkByPath(experiment.variantPath),
  }));
}
