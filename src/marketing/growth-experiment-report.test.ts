import { readFileSync } from "node:fs";
import { join } from "node:path";

import { describe, expect, it } from "vitest";

import { getGrowthExperimentById, growthExperimentRegistry } from "./growth-experiments";
import {
  calculateRate,
  getGrowthExperimentEvidenceById,
  growthExperimentEvidence,
  renderGrowthExperimentComparisonReport,
  renderGrowthExperimentReport,
} from "./growth-experiment-report";
import { getMarketingLinkByPath } from "./link-catalog";

const evidencePath = "docs/marketing/data/growth-experiment-evidence.csv";
const requiredHeaders = [
  "experiment_id",
  "status",
  "window_start",
  "window_end",
  "control_page_views",
  "control_cta_clicks",
  "variant_page_views",
  "variant_cta_clicks",
  "control_generation_starts",
  "control_generation_failures",
  "variant_generation_starts",
  "variant_generation_failures",
  "search_console_status",
  "ai_visibility_status",
  "decision",
  "next_evidence_needed",
] as const;

function parseEvidence() {
  const source = readFileSync(join(process.cwd(), evidencePath), "utf8").trim();
  const [headerLine, ...lines] = source.split(/\r?\n/);
  const headers = headerLine.split(",");
  const rows = lines.map((line) => {
    const values = line.split(",");
    return Object.fromEntries(headers.map((header, index) => [header, values[index] ?? ""]));
  });

  return { headers, rows };
}

describe("growth experiment evidence report", () => {
  it("keeps the landing page comparison pending until production evidence exists", () => {
    const evidence = getGrowthExperimentEvidenceById("2026_q2_landing_page_intent_comparison");

    expect(evidence).toEqual(
      expect.objectContaining({
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
      }),
    );

    expect(calculateRate(evidence?.controlCtaClicks, evidence?.controlPageViews)).toBeNull();
    expect(calculateRate(evidence?.variantCtaClicks, evidence?.variantPageViews)).toBeNull();
  });

  it("mirrors the editable CSV evidence inventory", () => {
    const { headers, rows } = parseEvidence();

    expect(headers).toEqual([...requiredHeaders]);
    expect(growthExperimentEvidence).toHaveLength(rows.length);

    for (const row of rows) {
      const evidence = getGrowthExperimentEvidenceById(row.experiment_id);

      expect(evidence).toEqual(
        expect.objectContaining({
          experimentId: row.experiment_id,
          status: row.status,
          windowStart: row.window_start,
          windowEnd: row.window_end,
          searchConsoleStatus: row.search_console_status,
          aiVisibilityStatus: row.ai_visibility_status,
          decision: row.decision,
          nextEvidenceNeeded: row.next_evidence_needed,
        }),
      );
    }
  });

  it("has an evidence row for every registry experiment", () => {
    const registryIds = growthExperimentRegistry.map((experiment) => experiment.id).sort();
    const evidenceIds = growthExperimentEvidence.map((evidence) => evidence.experimentId).sort();

    expect(evidenceIds).toEqual(registryIds);
  });

  it("keeps source-backed and README validation evidence pending", () => {
    for (const experimentId of [
      "2026_q2_source_backed_assets_intent_validation",
      "2026_q2_readme_cards_intent_validation",
    ]) {
      const evidence = getGrowthExperimentEvidenceById(experimentId);

      expect(evidence).toEqual(
        expect.objectContaining({
          status: "pending_evidence",
          searchConsoleStatus: "pending",
          aiVisibilityStatus: "pending",
          decision: "insufficient_data",
        }),
      );
      expect(evidence?.nextEvidenceNeeded).toContain("search_console_query_baseline");
      expect(evidence?.nextEvidenceNeeded).toContain("ai_answer_audit");
    }
  });

  it("renders a route comparison report without inventing validation", () => {
    const report = renderGrowthExperimentComparisonReport("2026_q2_landing_page_intent_comparison");

    expect(report).toContain("# Growth Experiment Evidence Report");
    expect(report).toContain("Experiment: 2026_q2_landing_page_intent_comparison");
    expect(report).toContain("Status: pending_evidence");
    expect(report).toContain("Minimum window: 14_days");
    expect(report).toContain("/product/github-repo-to-launch-package");
    expect(report).toContain("/use-cases/ai-project-launch");
    expect(report).toContain("Primary metric: cta_clicked_per_page_view");
    expect(report).toContain("Guardrail metric: generation_failed_per_generation_started");
    expect(report).toContain("Decision: insufficient_data");
    expect(report).toContain("Needs: ga4_page_view_and_cta_clicked_and_generation_started_and_generation_failed_14_day_window");
    expect(report).not.toMatch(/validated|revenue|customers|guaranteed/i);
  });

  it("keeps the legacy report renderer alias stable", () => {
    expect(renderGrowthExperimentReport("2026_q2_landing_page_intent_comparison")).toBe(
      renderGrowthExperimentComparisonReport("2026_q2_landing_page_intent_comparison"),
    );
  });

  it("references an active registry experiment and published comparable marketing pages", () => {
    const experiment = getGrowthExperimentById("2026_q2_landing_page_intent_comparison");

    expect(experiment).toBeDefined();

    const control = getMarketingLinkByPath(experiment?.controlPath ?? "");
    const variant = getMarketingLinkByPath(experiment?.variantPath ?? "");

    expect(control?.status).toBe("published");
    expect(variant?.status).toBe("published");
    expect(control?.buyerStage).toBe(variant?.buyerStage);
    expect(control?.primaryCta).toBe(experiment?.primaryCta);
    expect(variant?.primaryCta).toBe(experiment?.primaryCta);
  });

  it("keeps evidence metrics numeric or missing and privacy-safe", () => {
    for (const evidence of growthExperimentEvidence) {
      expect(["pending_evidence", "ready_for_review", "decided"]).toContain(evidence.status);
      expect(evidence.searchConsoleStatus).toMatch(/^[a-z0-9_]+$/);
      expect(evidence.aiVisibilityStatus).toMatch(/^[a-z0-9_]+$/);
      expect(JSON.stringify(evidence)).not.toMatch(
        /email|token|secret|password|api_key|revenue|customers|guaranteed/i,
      );

      for (const value of [
        evidence.controlPageViews,
        evidence.controlCtaClicks,
        evidence.variantPageViews,
        evidence.variantCtaClicks,
        evidence.controlGenerationStarts,
        evidence.controlGenerationFailures,
        evidence.variantGenerationStarts,
        evidence.variantGenerationFailures,
      ]) {
        if (value !== undefined) {
          expect(Number.isInteger(value)).toBe(true);
          expect(value).toBeGreaterThanOrEqual(0);
        }
      }
    }
  });
});
