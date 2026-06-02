# Landing Page Growth Experiment Registry Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add a typed growth experiment registry that locks the measurement plan for comparing `/product/github-repo-to-launch-package` and `/use-cases/ai-project-launch`.

**Architecture:** Store editable experiment rows in `docs/marketing/data/growth-experiment-registry.csv`, mirror them in a typed `src/marketing/growth-experiments.ts` module, and test that every experiment references published marketing routes with comparable page-view, CTA, guardrail, lifecycle, and evidence requirements. This is a measurement contract only; it does not claim the AI project launch page is validated.

**Tech Stack:** TypeScript, Vitest, Node `fs` for CSV contract tests, existing semantic marketing link catalog, existing analytics event names.

---

## Growth Contract

- **Hypothesis:** If `/use-cases/ai-project-launch` gives AI builders a more specific job-to-be-done than `/product/github-repo-to-launch-package`, it should produce a higher qualified CTA rate without increasing low-quality generation starts or unsupported-claim risk.
- **Lifecycle stage:** Validation.
- **Target user:** AI project builders and open-source AI maintainers preparing a public repository launch.
- **Primary CTA:** Generate free repo brief.
- **Primary metric:** `cta_clicked / page_view` for `generate_launch_card`.
- **Guardrail metric:** `generation_failed / generation_started` and unsupported-claim review flags.
- **Evidence gap:** GA4/Search Console/AI-search data is not yet in the repo; the registry only defines what must be compared before a growth decision.

## File Map

- Create `docs/marketing/data/growth-experiment-registry.csv`: editable experiment inventory.
- Create `src/marketing/growth-experiments.ts`: typed source-of-truth mirror used by tests and future reporting surfaces.
- Create `src/marketing/growth-experiments.test.ts`: CSV mirror, route existence, event metric, guardrail, and claim-hygiene tests.
- Modify `docs/plans/2026-06-01-quickfork-growth-lifecycle-prioritization.md`: add this validation slice.
- Modify `/Users/moose/Documents/Moose's Birth ID/QuickFork/SEO Growth/2026-06-01 QuickFork Cold Start Launch Growth Iteration.md`: mirror the decision and evidence.

## Task 1: RED Tests

- [x] **Step 1: Add failing experiment registry tests**

Create `src/marketing/growth-experiments.test.ts`:

```ts
import { readFileSync } from "node:fs";
import { join } from "node:path";

import { describe, expect, it } from "vitest";

import {
  getGrowthExperimentById,
  growthExperimentRegistry,
} from "./growth-experiments";
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
      expect(JSON.stringify(experiment)).not.toMatch(/email|token|secret|password|api_key|revenue|customers|guaranteed/i);
    }
  });
});
```

- [x] **Step 2: Run RED**

Run:

```bash
npm test -- src/marketing/growth-experiments.test.ts
```

Expected: FAIL because `src/marketing/growth-experiments.ts` and `docs/marketing/data/growth-experiment-registry.csv` do not exist.

## Task 2: Implement Registry And CSV

- [x] **Step 1: Create editable CSV inventory**

Create `docs/marketing/data/growth-experiment-registry.csv`:

```csv
experiment_id,status,lifecycle_stage,target_user,control_path,variant_path,primary_cta,primary_metric,guardrail_metric,decision_rule,minimum_window,evidence_required
2026_q2_landing_page_intent_comparison,active,validation,ai_project_builder,/product/github-repo-to-launch-package,/use-cases/ai-project-launch,generate_launch_card,cta_clicked_per_page_view,generation_failed_per_generation_started,higher_cta_rate_with_no_significant_guardrail_regression,14_days,ga4_page_view_and_cta_clicked_and_generation_started_and_generation_failed
```

- [x] **Step 2: Create typed registry module**

Create `src/marketing/growth-experiments.ts`:

```ts
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
```

- [x] **Step 3: Run GREEN**

Run:

```bash
npm test -- src/marketing/growth-experiments.test.ts
```

Expected: PASS.

## Task 3: Docs And Verification

- [x] **Step 1: Update repo growth lifecycle plan**

Append a `2026-06-02 Landing Page Measurement Registry Slice` section to `docs/plans/2026-06-01-quickfork-growth-lifecycle-prioritization.md` with hypothesis, lifecycle stage, target user, changed surface, primary CTA, primary metric, guardrail, evidence gap, observed evidence, and next action.

- [x] **Step 2: Update Obsidian strategy mirror**

Append the same decision to `/Users/moose/Documents/Moose's Birth ID/QuickFork/SEO Growth/2026-06-01 QuickFork Cold Start Launch Growth Iteration.md`. Include that this registry is not a validation result and still needs 14 days of production data.

- [x] **Step 3: Run verification**

Run:

```bash
npm test -- src/marketing/growth-experiments.test.ts src/seo/semantic-links.test.ts src/lib/analytics.test.ts
npm test
npm run build
git diff --check
```

Expected: all pass with no whitespace errors.

- [x] **Step 4: Commit and publish**

Stage only the registry slice:

```bash
git add docs/marketing/data/growth-experiment-registry.csv docs/plans/2026-06-01-quickfork-growth-lifecycle-prioritization.md docs/superpowers/plans/2026-06-02-landing-page-growth-experiment-registry.md src/marketing/growth-experiments.ts src/marketing/growth-experiments.test.ts
git diff --cached --check
git commit -m "feat: add landing page growth experiment registry"
```

Do not stage the pre-existing untracked May validation docs unless the user explicitly asks.
