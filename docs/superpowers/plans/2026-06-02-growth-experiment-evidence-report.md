# Growth Experiment Evidence Report Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add a lightweight evidence report contract that turns the landing-page experiment registry into a pending/ready route comparison table without claiming validation before production data exists.

**Architecture:** Store manually collected evidence rows in `docs/marketing/data/growth-experiment-evidence.csv`, expose them through `src/marketing/growth-experiment-report.ts`, and render a Markdown report that joins evidence with `growthExperimentRegistry`. Tests enforce that missing 14-day data keeps the experiment `pending`, metrics stay PII-free, and the report names the next evidence needed.

**Tech Stack:** TypeScript, Vitest, Node `fs`, existing `growth-experiments.ts`, existing semantic marketing link catalog.

---

## Growth Contract

- **Hypothesis:** The AI project launch page may perform better than the broader product page for AI builders, but the decision must wait for comparable production evidence.
- **Lifecycle stage:** Validation.
- **Target user:** AI project builders and open-source AI maintainers preparing a public repository launch.
- **Primary CTA:** Generate free repo brief.
- **Primary metric:** `cta_clicked_per_page_view`.
- **Guardrail metric:** `generation_failed_per_generation_started`.
- **Evidence gap:** No 14-day production evidence has been collected yet; the report should explicitly show `pending_evidence`.

## File Map

- Create `docs/marketing/data/growth-experiment-evidence.csv`: editable evidence inventory with pending placeholders.
- Create `src/marketing/growth-experiment-report.ts`: parses evidence rows, computes report status, and renders Markdown.
- Create `src/marketing/growth-experiment-report.test.ts`: verifies CSV mirroring, pending state, metric hygiene, route paths, and Markdown report output.
- Modify `docs/plans/2026-06-01-quickfork-growth-lifecycle-prioritization.md`: add evidence report slice.
- Modify `/Users/moose/Documents/Moose's Birth ID/QuickFork/SEO Growth/2026-06-01 QuickFork Cold Start Launch Growth Iteration.md`: mirror the decision and evidence.

## Task 1: RED Tests

- [ ] **Step 1: Add failing evidence report tests**

Create `src/marketing/growth-experiment-report.test.ts`:

```ts
import { readFileSync } from "node:fs";
import { join } from "node:path";

import { describe, expect, it } from "vitest";

import {
  calculateRate,
  getGrowthExperimentEvidenceById,
  growthExperimentEvidence,
  renderGrowthExperimentComparisonReport,
  renderGrowthExperimentReport,
} from "./growth-experiment-report";

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

  it("keeps evidence metrics numeric or missing and PII-free", () => {
    for (const evidence of growthExperimentEvidence) {
      expect(["pending_evidence", "ready_for_review", "decided"]).toContain(evidence.status);
      expect(evidence.aiVisibilityStatus).toMatch(/^[a-z0-9_]+$/);
      expect(JSON.stringify(evidence)).not.toMatch(/email|token|secret|password|api_key/i);

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
```

- [ ] **Step 2: Run RED**

Run:

```bash
npm test -- src/marketing/growth-experiment-report.test.ts
```

Expected: FAIL because the report module and evidence CSV do not exist.

## Task 2: Implement Evidence CSV And Report Renderer

- [ ] **Step 1: Create evidence CSV**

Create `docs/marketing/data/growth-experiment-evidence.csv`:

```csv
experiment_id,status,window_start,window_end,control_page_views,control_cta_clicks,variant_page_views,variant_cta_clicks,control_generation_starts,control_generation_failures,variant_generation_starts,variant_generation_failures,search_console_status,ai_visibility_status,decision,next_evidence_needed
2026_q2_landing_page_intent_comparison,pending_evidence,,,,,,,,,,,pending,pending,insufficient_data,ga4_page_view_and_cta_clicked_and_generation_started_and_generation_failed_14_day_window
```

- [ ] **Step 2: Create report renderer**

Create `src/marketing/growth-experiment-report.ts`:

```ts
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
    `| ${experiment.controlPath} | ${formatMetric(evidence.controlPageViews)} | ${formatMetric(evidence.controlCtaClicks)} | ${formatRate(evidence.controlCtaClicks, evidence.controlPageViews)} | ${formatMetric(evidence.controlGenerationStarts)} | ${formatMetric(evidence.controlGenerationFailures)} | ${formatRate(evidence.controlGenerationFailures, evidence.controlGenerationStarts)} |`,
    `| ${experiment.variantPath} | ${formatMetric(evidence.variantPageViews)} | ${formatMetric(evidence.variantCtaClicks)} | ${formatRate(evidence.variantCtaClicks, evidence.variantPageViews)} | ${formatMetric(evidence.variantGenerationStarts)} | ${formatMetric(evidence.variantGenerationFailures)} | ${formatRate(evidence.variantGenerationFailures, evidence.variantGenerationStarts)} |`,
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
```

- [ ] **Step 3: Run GREEN**

Run:

```bash
npm test -- src/marketing/growth-experiment-report.test.ts
```

Expected: PASS.

## Task 3: Docs, Verification, And Publish

- [ ] **Step 1: Update repo growth lifecycle plan**

Append a `2026-06-02 Growth Experiment Evidence Report Slice` section to `docs/plans/2026-06-01-quickfork-growth-lifecycle-prioritization.md` with hypothesis, lifecycle stage, target user, changed surface, primary CTA, primary metric, guardrail, evidence gap, observed evidence, and next action.

- [ ] **Step 2: Update Obsidian strategy mirror**

Append the same decision to `/Users/moose/Documents/Moose's Birth ID/QuickFork/SEO Growth/2026-06-01 QuickFork Cold Start Launch Growth Iteration.md`. Include that the report must remain `pending_evidence` until 14-day production data exists.

- [ ] **Step 3: Run verification**

Run:

```bash
npm test -- src/marketing/growth-experiment-report.test.ts src/marketing/growth-experiments.test.ts src/lib/analytics.test.ts
npm test
npm run build
git diff --check
```

Expected: all pass with no whitespace errors.

- [ ] **Step 4: Commit and publish**

Stage only this slice:

```bash
git add docs/marketing/data/growth-experiment-evidence.csv docs/plans/2026-06-01-quickfork-growth-lifecycle-prioritization.md docs/superpowers/plans/2026-06-02-growth-experiment-evidence-report.md src/marketing/growth-experiment-report.ts src/marketing/growth-experiment-report.test.ts
git diff --cached --check
git commit -m "feat: add growth experiment evidence report"
```

Do not stage the pre-existing untracked May validation docs unless the user explicitly asks.
