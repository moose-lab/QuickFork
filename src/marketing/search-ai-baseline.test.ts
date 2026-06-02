import { readFileSync } from "node:fs";
import { join } from "node:path";

import { describe, expect, it } from "vitest";

import { growthExperimentRegistry } from "./growth-experiments";
import { getMarketingLinkByPath } from "./link-catalog";
import {
  aiSearchAuditSurfaces,
  forbiddenAiSearchClaims,
  getSearchAiBaselineRowsForExperiment,
  renderSearchAiBaselineRunbook,
  searchAiBaselineRows,
} from "./search-ai-baseline";

const csvPath = "docs/marketing/data/search-ai-baseline-prompts.csv";
const requiredHeaders = [
  "baseline_id",
  "experiment_id",
  "route_role",
  "canonical_path",
  "target_user",
  "query",
  "query_cluster",
  "surfaces",
  "expected_terms",
  "forbidden_claims",
  "decision_use",
] as const;

function parseRows() {
  const source = readFileSync(join(process.cwd(), csvPath), "utf8").trim();
  const [headerLine, ...lines] = source.split(/\r?\n/);
  const headers = headerLine.split(",");
  const rows = lines.map((line) => {
    const values = line.split(",");
    return Object.fromEntries(headers.map((header, index) => [header, values[index] ?? ""]));
  });

  return { headers, rows };
}

describe("search and AI baseline contract", () => {
  it("covers every experiment that requires search or AI-answer evidence", () => {
    const requiredExperiments = growthExperimentRegistry.filter((experiment) =>
      /search_console_query_baseline|ai_answer_audit/.test(experiment.evidenceRequired),
    );

    expect(requiredExperiments.length).toBeGreaterThan(0);

    for (const experiment of requiredExperiments) {
      const rows = getSearchAiBaselineRowsForExperiment(experiment.id);

      expect(rows.map((row) => row.routeRole).sort()).toEqual(["control", "variant"]);
      expect(rows.find((row) => row.routeRole === "control")?.canonicalPath).toBe(experiment.controlPath);
      expect(rows.find((row) => row.routeRole === "variant")?.canonicalPath).toBe(experiment.variantPath);
    }
  });

  it("mirrors the editable CSV baseline inventory", () => {
    const { headers, rows } = parseRows();

    expect(headers).toEqual([...requiredHeaders]);
    expect(searchAiBaselineRows).toHaveLength(rows.length);

    for (const row of rows) {
      expect(searchAiBaselineRows).toContainEqual(
        expect.objectContaining({
          id: row.baseline_id,
          experimentId: row.experiment_id,
          routeRole: row.route_role,
          canonicalPath: row.canonical_path,
          targetUser: row.target_user,
          query: row.query,
          queryCluster: row.query_cluster,
          decisionUse: row.decision_use,
        }),
      );
    }
  });

  it("uses published canonical pages and required AI/search surfaces", () => {
    for (const row of searchAiBaselineRows) {
      const link = getMarketingLinkByPath(row.canonicalPath);

      expect(link?.status).toBe("published");
      expect(link?.canonicalUrl).not.toContain("utm_");
      expect(row.surfaces).toContain("google_search_console");
      for (const surface of aiSearchAuditSurfaces) {
        expect(row.surfaces).toContain(surface);
      }
    }
  });

  it("keeps baseline prompts extractable and claim-safe", () => {
    for (const row of searchAiBaselineRows) {
      expect(row.query.length).toBeGreaterThan(12);
      expect(row.expectedTerms).toContain("QuickFork");
      expect(row.expectedTerms).toContain("GitHub repository");
      expect(row.forbiddenClaims).toEqual(expect.arrayContaining([...forbiddenAiSearchClaims]));
      expect(JSON.stringify(row)).not.toMatch(/email|token|secret|password|api_key|revenue_amount|customer_logo/i);
    }
  });

  it("covers the cold-start launch materials hub with control and variant prompts", () => {
    const rows = getSearchAiBaselineRowsForExperiment("2026_q2_cold_start_materials_intent_validation");

    expect(rows).toHaveLength(2);
    expect(rows).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          id: "cold_start_materials_control",
          routeRole: "control",
          canonicalPath: "/product/github-repo-to-launch-package",
          targetUser: "ai_project_builder",
          query: "GitHub repo to launch package",
          queryCluster: "github_repo_to_launch_package",
        }),
        expect.objectContaining({
          id: "cold_start_materials_variant",
          routeRole: "variant",
          canonicalPath: "/product/cold-start-launch-materials",
          targetUser: "ai_project_builder",
          query: "cold start launch materials",
          queryCluster: "cold_start_launch_materials",
        }),
      ]),
    );
  });

  it("renders a manual runbook without claiming visibility", () => {
    const runbook = renderSearchAiBaselineRunbook("2026_q2_source_backed_assets_intent_validation");

    expect(runbook).toContain("# Search and AI Baseline Runbook");
    expect(runbook).toContain("Experiment: 2026_q2_source_backed_assets_intent_validation");
    expect(runbook).toContain("google_search_console");
    expect(runbook).toContain("chatgpt_search");
    expect(runbook).toContain("/product/source-backed-launch-assets");
    expect(runbook).toContain("Decision: pending evidence collection");
    expect(runbook).not.toMatch(/validated demand|ranking win|revenue lift|customer traction|guaranteed ranking/i);
  });
});
