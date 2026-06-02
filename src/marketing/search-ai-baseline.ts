import { getGrowthExperimentById } from "./growth-experiments";

export const aiSearchAuditSurfaces = [
  "chatgpt_search",
  "perplexity",
  "google_ai_overview",
  "gemini",
  "claude",
] as const;

export const searchBaselineSurfaces = ["google_search_console", ...aiSearchAuditSurfaces] as const;

export const forbiddenAiSearchClaims = [
  "pricing",
  "rankings",
  "revenue",
  "customer_count",
  "conversion_lift",
  "product_hunt_outcome",
  "guaranteed_launch",
  "validated_ai_citation",
] as const;

export type AiSearchAuditSurface = (typeof aiSearchAuditSurfaces)[number];
export type SearchBaselineSurface = (typeof searchBaselineSurfaces)[number];
export type ForbiddenAiSearchClaim = (typeof forbiddenAiSearchClaims)[number];
export type SearchAiRouteRole = "control" | "variant";

export interface SearchAiBaselineRow {
  id: string;
  experimentId: string;
  routeRole: SearchAiRouteRole;
  canonicalPath: string;
  targetUser: string;
  query: string;
  queryCluster: string;
  surfaces: readonly SearchBaselineSurface[];
  expectedTerms: readonly string[];
  forbiddenClaims: readonly ForbiddenAiSearchClaim[];
  decisionUse: string;
}

const allSurfaces = searchBaselineSurfaces;
const allForbiddenClaims = forbiddenAiSearchClaims;

export const searchAiBaselineRows: readonly SearchAiBaselineRow[] = [
  {
    id: "source_backed_assets_control",
    experimentId: "2026_q2_source_backed_assets_intent_validation",
    routeRole: "control",
    canonicalPath: "/product/github-repo-to-launch-package",
    targetUser: "product_marketer",
    query: "GitHub repo to launch package",
    queryCluster: "github_repo_to_launch_package",
    surfaces: allSurfaces,
    expectedTerms: ["QuickFork", "GitHub repository", "launch package", "source-backed", "README", "social", "deck", "outreach"],
    forbiddenClaims: allForbiddenClaims,
    decisionUse: "compare generic launch-package category demand against source-backed page demand",
  },
  {
    id: "source_backed_assets_variant",
    experimentId: "2026_q2_source_backed_assets_intent_validation",
    routeRole: "variant",
    canonicalPath: "/product/source-backed-launch-assets",
    targetUser: "product_marketer",
    query: "source backed launch assets",
    queryCluster: "source_backed_launch_assets",
    surfaces: allSurfaces,
    expectedTerms: ["QuickFork", "GitHub repository", "source-backed", "launch assets", "README", "social", "deck", "outreach"],
    forbiddenClaims: allForbiddenClaims,
    decisionUse: "check whether source-backed asset intent is visible and accurately described",
  },
  {
    id: "readme_cards_control",
    experimentId: "2026_q2_readme_cards_intent_validation",
    routeRole: "control",
    canonicalPath: "/product/github-repo-to-launch-package",
    targetUser: "design_lead",
    query: "GitHub repo to launch package",
    queryCluster: "github_repo_to_launch_package",
    surfaces: allSurfaces,
    expectedTerms: ["QuickFork", "GitHub repository", "launch package", "source-backed", "README", "social", "deck", "outreach"],
    forbiddenClaims: allForbiddenClaims,
    decisionUse: "compare generic launch-package category demand against README card page demand",
  },
  {
    id: "readme_cards_variant",
    experimentId: "2026_q2_readme_cards_intent_validation",
    routeRole: "variant",
    canonicalPath: "/product/readme-marketing-cards",
    targetUser: "design_lead",
    query: "README marketing cards",
    queryCluster: "readme_marketing_cards",
    surfaces: allSurfaces,
    expectedTerms: [
      "QuickFork",
      "GitHub repository",
      "README",
      "marketing cards",
      "social preview",
      "launch visuals",
      "source-backed",
    ],
    forbiddenClaims: allForbiddenClaims,
    decisionUse: "check whether README marketing card intent is visible and accurately described",
  },
];

export function getSearchAiBaselineRowsForExperiment(experimentId: string) {
  return searchAiBaselineRows.filter((row) => row.experimentId === experimentId);
}

export function renderSearchAiBaselineRunbook(experimentId: string) {
  const experiment = getGrowthExperimentById(experimentId);
  const rows = getSearchAiBaselineRowsForExperiment(experimentId);

  if (!experiment || rows.length === 0) {
    throw new Error(`Unknown search and AI baseline experiment: ${experimentId}`);
  }

  return [
    "# Search and AI Baseline Runbook",
    "",
    `Experiment: ${experiment.id}`,
    `Lifecycle stage: ${experiment.lifecycleStage}`,
    `Target user: ${experiment.targetUser}`,
    `Primary CTA: ${experiment.primaryCta}`,
    `Decision: pending evidence collection`,
    "",
    "| Role | Route | Query | Surfaces | Expected terms | Forbidden claims | Decision use |",
    "| --- | --- | --- | --- | --- | --- | --- |",
    ...rows.map(
      (row) =>
        `| ${row.routeRole} | ${row.canonicalPath} | ${row.query} | ${row.surfaces.join("; ")} | ${row.expectedTerms.join(
          "; ",
        )} | ${row.forbiddenClaims.join("; ")} | ${row.decisionUse} |`,
    ),
    "",
    "Record one row per surface during the manual audit. Leave the experiment decision as insufficient_data until Search Console query data and AI-answer observations are collected.",
  ].join("\n");
}
