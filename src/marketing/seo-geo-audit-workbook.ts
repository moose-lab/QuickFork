import { getGrowthExperimentById } from "./growth-experiments";
import {
  searchAiBaselineRows,
  type ForbiddenAiSearchClaim,
  type SearchAiBaselineRow,
  type SearchBaselineSurface,
} from "./search-ai-baseline";

export const seoGeoAuditStatuses = ["pending", "collected", "needs_reaudit"] as const;
export const seoGeoAuditTaskKinds = ["search_console_query_baseline", "ai_answer_audit"] as const;

export type SeoGeoAuditStatus = (typeof seoGeoAuditStatuses)[number];
export type SeoGeoAuditTaskKind = (typeof seoGeoAuditTaskKinds)[number];

export interface SeoGeoAuditWorkbookRow {
  auditId: string;
  baselineId: string;
  experimentId: string;
  routeRole: SearchAiBaselineRow["routeRole"];
  canonicalPath: string;
  targetUser: string;
  query: string;
  queryCluster: string;
  surface: SearchBaselineSurface;
  taskKind: SeoGeoAuditTaskKind;
  evidenceFields: readonly string[];
  successCriteria: string;
  expectedTerms: readonly string[];
  forbiddenClaims: readonly ForbiddenAiSearchClaim[];
  status: SeoGeoAuditStatus;
  nextAction: string;
}

const searchConsoleEvidenceFields = [
  "window_start",
  "window_end",
  "query",
  "page",
  "country",
  "device",
  "impressions",
  "clicks",
  "ctr",
  "average_position",
] as const;

const aiAnswerEvidenceFields = [
  "audit_date",
  "mentioned",
  "cited",
  "source_url",
  "answer_summary",
  "accuracy_status",
  "competitors_cited",
  "forbidden_claims_observed",
] as const;

export function buildSeoGeoAuditWorkbookRows() {
  return searchAiBaselineRows.flatMap((baseline) =>
    baseline.surfaces.map((surface): SeoGeoAuditWorkbookRow => {
      const isSearchConsole = surface === "google_search_console";

      return {
        auditId: `${baseline.id}_${surface}`,
        baselineId: baseline.id,
        experimentId: baseline.experimentId,
        routeRole: baseline.routeRole,
        canonicalPath: baseline.canonicalPath,
        targetUser: baseline.targetUser,
        query: baseline.query,
        queryCluster: baseline.queryCluster,
        surface,
        taskKind: isSearchConsole ? "search_console_query_baseline" : "ai_answer_audit",
        evidenceFields: isSearchConsole ? searchConsoleEvidenceFields : aiAnswerEvidenceFields,
        successCriteria: isSearchConsole
          ? "query_data_collected_and_mapped_to_canonical_page"
          : "answer_mentions_or_omits_quickfork_without_forbidden_claims",
        expectedTerms: baseline.expectedTerms,
        forbiddenClaims: baseline.forbiddenClaims,
        status: "pending",
        nextAction: isSearchConsole
          ? "export_14_day_search_console_query_page_metrics"
          : "run_prompt_and_record_mention_citation_accuracy_and_competitors",
      };
    }),
  );
}

export function getSeoGeoAuditWorkbookRowsForExperiment(experimentId: string) {
  return buildSeoGeoAuditWorkbookRows().filter((row) => row.experimentId === experimentId);
}

export function renderSeoGeoAuditWorkbook(experimentId: string) {
  const experiment = getGrowthExperimentById(experimentId);
  const rows = getSeoGeoAuditWorkbookRowsForExperiment(experimentId);

  if (!experiment || rows.length === 0) {
    throw new Error(`Unknown SEO/GEO audit workbook experiment: ${experimentId}`);
  }

  return [
    "# SEO/GEO Evidence Workbook",
    "",
    `Experiment: ${experiment.id}`,
    `Lifecycle stage: ${experiment.lifecycleStage}`,
    `Target user: ${experiment.targetUser}`,
    `Minimum window: ${experiment.minimumWindow}`,
    `Primary CTA: ${experiment.primaryCta}`,
    `Primary metric: ${experiment.primaryMetric}`,
    `Guardrail metric: ${experiment.guardrailMetric}`,
    "Decision: insufficient_data_until_14_day_ga4_search_console_and_ai_answer_evidence_exists",
    "",
    "| Role | Route | Surface | Query | Task kind | Evidence fields | Success criteria | Next action |",
    "| --- | --- | --- | --- | --- | --- | --- | --- |",
    ...rows.map(
      (row) =>
        `| ${row.routeRole} | ${row.canonicalPath} | ${row.surface} | ${row.query} | ${row.taskKind} | ${row.evidenceFields.join(
          "; ",
        )} | ${row.successCriteria} | ${row.nextAction} |`,
    ),
    "",
    "Guardrails:",
    "",
    "- Keep GA4, Search Console, and AI-answer evidence separate from the decision until the minimum window is complete.",
    "- Record omissions as evidence; do not convert prompt coverage into visibility claims.",
    `- Forbidden claims to flag: ${Array.from(new Set(rows.flatMap((row) => row.forbiddenClaims))).join("; ")}.`,
  ].join("\n");
}
