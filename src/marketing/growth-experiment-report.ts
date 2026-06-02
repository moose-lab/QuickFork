import { getGrowthExperimentById } from "./growth-experiments";

export const growthExperimentEvidenceStatuses = ["pending_evidence", "ready_for_review", "decided"] as const;

export type GrowthExperimentEvidenceStatus = (typeof growthExperimentEvidenceStatuses)[number];

export interface GrowthExperimentEvidence {
  experimentId: string;
  status: GrowthExperimentEvidenceStatus;
  windowStart: string;
  windowEnd: string;
  controlPageViews?: number;
  controlCtaClicks?: number;
  variantPageViews?: number;
  variantCtaClicks?: number;
  controlGenerationStarts?: number;
  controlGenerationFailures?: number;
  variantGenerationStarts?: number;
  variantGenerationFailures?: number;
  searchConsoleStatus: string;
  aiVisibilityStatus: string;
  decision: string;
  nextEvidenceNeeded: string;
}

export const growthExperimentEvidence: readonly GrowthExperimentEvidence[] = [
  {
    experimentId: "2026_q2_landing_page_intent_comparison",
    status: "pending_evidence",
    windowStart: "",
    windowEnd: "",
    controlPageViews: undefined,
    controlCtaClicks: undefined,
    variantPageViews: undefined,
    variantCtaClicks: undefined,
    controlGenerationStarts: undefined,
    controlGenerationFailures: undefined,
    variantGenerationStarts: undefined,
    variantGenerationFailures: undefined,
    searchConsoleStatus: "pending",
    aiVisibilityStatus: "pending",
    decision: "insufficient_data",
    nextEvidenceNeeded: "ga4_page_view_and_cta_clicked_and_generation_started_and_generation_failed_14_day_window",
  },
];

export function getGrowthExperimentEvidenceById(experimentId: string) {
  return growthExperimentEvidence.find((evidence) => evidence.experimentId === experimentId);
}

export function calculateRate(numerator: number | undefined, denominator: number | undefined) {
  if (numerator === undefined || denominator === undefined || denominator === 0) return null;
  return numerator / denominator;
}

export function renderGrowthExperimentComparisonReport(experimentId: string) {
  const experiment = getGrowthExperimentById(experimentId);
  const evidence = getGrowthExperimentEvidenceById(experimentId);

  if (!experiment || !evidence) {
    throw new Error(`Unknown growth experiment: ${experimentId}`);
  }

  return [
    "# Growth Experiment Evidence Report",
    "",
    `Experiment: ${experiment.id}`,
    `Status: ${evidence.status}`,
    `Lifecycle stage: ${experiment.lifecycleStage}`,
    `Target user: ${experiment.targetUser}`,
    `Minimum window: ${experiment.minimumWindow}`,
    `Primary CTA: ${experiment.primaryCta}`,
    `Primary metric: ${experiment.primaryMetric}`,
    `Guardrail metric: ${experiment.guardrailMetric}`,
    `Window: ${formatWindow(evidence.windowStart, evidence.windowEnd)}`,
    "",
    "| Route | Page views | CTA clicks | CTA rate | Generation starts | Generation failures | Failure rate |",
    "| --- | ---: | ---: | ---: | ---: | ---: | ---: |",
    `| ${experiment.controlPath} | ${formatMetric(evidence.controlPageViews)} | ${formatMetric(
      evidence.controlCtaClicks,
    )} | ${formatRate(evidence.controlCtaClicks, evidence.controlPageViews)} | ${formatMetric(
      evidence.controlGenerationStarts,
    )} | ${formatMetric(evidence.controlGenerationFailures)} | ${formatRate(
      evidence.controlGenerationFailures,
      evidence.controlGenerationStarts,
    )} |`,
    `| ${experiment.variantPath} | ${formatMetric(evidence.variantPageViews)} | ${formatMetric(
      evidence.variantCtaClicks,
    )} | ${formatRate(evidence.variantCtaClicks, evidence.variantPageViews)} | ${formatMetric(
      evidence.variantGenerationStarts,
    )} | ${formatMetric(evidence.variantGenerationFailures)} | ${formatRate(
      evidence.variantGenerationFailures,
      evidence.variantGenerationStarts,
    )} |`,
    "",
    `Search Console: ${evidence.searchConsoleStatus}`,
    `AI visibility: ${evidence.aiVisibilityStatus}`,
    `Decision: ${evidence.decision}`,
    `Needs: ${evidence.nextEvidenceNeeded}`,
  ].join("\n");
}

export function renderGrowthExperimentReport(experimentId: string) {
  return renderGrowthExperimentComparisonReport(experimentId);
}

function formatWindow(start: string, end: string) {
  return start && end ? `${start} to ${end}` : "pending_14_day_window";
}

function formatMetric(value: number | undefined) {
  return value === undefined ? "pending" : String(value);
}

function formatRate(numerator: number | undefined, denominator: number | undefined) {
  const rate = calculateRate(numerator, denominator);
  return rate === null ? "pending" : `${(rate * 100).toFixed(2)}%`;
}
