import { readFileSync } from "node:fs";
import { join } from "node:path";

import { describe, expect, it } from "vitest";

import { getGrowthExperimentById, growthExperimentRegistry } from "./growth-experiments";
import { getMarketingLinkByPath } from "./link-catalog";

const registryPath = "docs/marketing/data/growth-experiment-registry.csv";
const requiredHeaders = [
  "experiment_id",
  "status",
  "lifecycle_stage",
  "target_user",
  "control_path",
  "variant_path",
  "primary_cta",
  "primary_metric",
  "guardrail_metric",
  "decision_rule",
  "minimum_window",
  "evidence_required",
] as const;

function parseRegistry() {
  const source = readFileSync(join(process.cwd(), registryPath), "utf8").trim();
  const [headerLine, ...lines] = source.split(/\r?\n/);
  const headers = headerLine.split(",");
  const rows = lines.map((line) => {
    const values = line.split(",");
    return Object.fromEntries(headers.map((header, index) => [header, values[index] ?? ""]));
  });

  return { headers, rows };
}

describe("growth experiment registry", () => {
  it("contains the active landing page intent comparison", () => {
    const experiment = getGrowthExperimentById("2026_q2_landing_page_intent_comparison");

    expect(experiment).toEqual(
      expect.objectContaining({
        status: "active",
        lifecycleStage: "validation",
        targetUser: "ai_project_builder",
        controlPath: "/product/github-repo-to-launch-package",
        variantPath: "/use-cases/ai-project-launch",
        primaryCta: "generate_launch_card",
        primaryMetric: "cta_clicked_per_page_view",
        guardrailMetric: "generation_failed_per_generation_started",
        minimumWindow: "14_days",
      }),
    );
  });

  it("mirrors the editable CSV registry", () => {
    const { headers, rows } = parseRegistry();

    expect(headers).toEqual([...requiredHeaders]);
    expect(growthExperimentRegistry).toHaveLength(rows.length);

    for (const row of rows) {
      const experiment = getGrowthExperimentById(row.experiment_id);

      expect(experiment).toEqual(
        expect.objectContaining({
          id: row.experiment_id,
          status: row.status,
          lifecycleStage: row.lifecycle_stage,
          targetUser: row.target_user,
          controlPath: row.control_path,
          variantPath: row.variant_path,
          primaryCta: row.primary_cta,
          primaryMetric: row.primary_metric,
          guardrailMetric: row.guardrail_metric,
          decisionRule: row.decision_rule,
          minimumWindow: row.minimum_window,
          evidenceRequired: row.evidence_required,
        }),
      );
    }
  });

  it("references published comparable marketing pages", () => {
    for (const experiment of growthExperimentRegistry) {
      const control = getMarketingLinkByPath(experiment.controlPath);
      const variant = getMarketingLinkByPath(experiment.variantPath);

      expect(control?.status).toBe("published");
      expect(variant?.status).toBe("published");
      expect(control?.buyerStage).toBe(variant?.buyerStage);
      expect(control?.primaryCta).toBe(experiment.primaryCta);
      expect(variant?.primaryCta).toBe(experiment.primaryCta);
      expect(control?.canonicalUrl).not.toContain("utm_");
      expect(variant?.canonicalUrl).not.toContain("utm_");
    }
  });

  it("keeps experiment metrics decision-ready and privacy-safe", () => {
    for (const experiment of growthExperimentRegistry) {
      expect(["planned", "active", "paused", "complete"]).toContain(experiment.status);
      expect(["discovery", "validation", "activation", "monetization", "retention", "scale"]).toContain(
        experiment.lifecycleStage,
      );
      expect(experiment.primaryMetric).toMatch(/^cta_clicked_per_page_view$/);
      expect(experiment.guardrailMetric).toMatch(/^generation_failed_per_generation_started$/);
      expect(experiment.decisionRule).toContain("no_significant_guardrail_regression");
      expect(experiment.evidenceRequired).toContain("ga4_page_view");
      expect(JSON.stringify(experiment)).not.toMatch(
        /email|token|secret|password|api_key|revenue|customers|guaranteed/i,
      );
    }
  });
});
