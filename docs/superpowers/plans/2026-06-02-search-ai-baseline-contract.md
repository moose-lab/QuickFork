# Search AI Baseline Contract Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Create a typed Search Console and AI-answer audit baseline contract for the active QuickFork page-intent validation experiments.

**Architecture:** Store editable baseline rows in `docs/marketing/data/search-ai-baseline-prompts.csv`, mirror them in `src/marketing/search-ai-baseline.ts`, and test that every growth experiment requiring `search_console_query_baseline` or `ai_answer_audit` has both control and variant baseline rows. The baseline is a data-collection contract only; all status remains pending until real Search Console and AI-answer observations are recorded.

**Tech Stack:** TypeScript, Vitest, Node `fs` CSV contract tests, existing `growthExperimentRegistry`, existing `link-catalog`, repo growth docs, Obsidian strategy mirror.

---

## Growth Contract

- **Hypothesis:** If QuickFork records a fixed baseline prompt set for each active page-intent experiment, future Search Console and AI-answer reviews will produce comparable evidence instead of ad hoc notes.
- **Lifecycle stage:** Discovery to Validation.
- **Target users:** Product marketers, DevRel operators, design leads, and open-source maintainers evaluating source-backed repository launch assets.
- **Primary CTA:** `generate_launch_card` on the compared pages.
- **Primary metric:** Query-level Search Console impressions/clicks and AI-answer citation/accuracy status for each control and variant route.
- **Guardrail metric:** AI answers must not invent pricing, rankings, customer counts, revenue, conversion lift, Product Hunt outcomes, guaranteed launch results, or validated AI citation wins.
- **Evidence gap:** No real Search Console export or AI-answer audit result exists in the repo yet.
- **Claim boundary:** This slice defines how to collect evidence. It does not claim QuickFork is cited, ranking, growing revenue, or validated by AI/search systems.

## File Map

- Create `src/marketing/search-ai-baseline.test.ts`: RED/GREEN contract tests for coverage, route validity, CSV mirror, surfaces, expected terms, and forbidden claims.
- Create `src/marketing/search-ai-baseline.ts`: typed baseline rows and runbook renderer.
- Create `docs/marketing/data/search-ai-baseline-prompts.csv`: editable prompt/query inventory.
- Modify `docs/plans/2026-06-01-quickfork-growth-lifecycle-prioritization.md`: add this P0 measurement slice.
- Modify `docs/marketing/research/2026-06-02-source-backed-readme-page-refresh.md`: add the exact baseline handoff for source-backed and README experiments.
- Modify `/Users/moose/Documents/Moose's Birth ID/QuickFork/SEO Growth/2026-06-01 QuickFork Cold Start Launch Growth Iteration.md`: mirror the decision and evidence.

## Task 1: RED Tests

- [x] **Step 1: Add failing baseline tests**

Create `src/marketing/search-ai-baseline.test.ts`:

```ts
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

  it("renders a manual runbook without claiming visibility", () => {
    const runbook = renderSearchAiBaselineRunbook("2026_q2_source_backed_assets_intent_validation");

    expect(runbook).toContain("# Search and AI Baseline Runbook");
    expect(runbook).toContain("Experiment: 2026_q2_source_backed_assets_intent_validation");
    expect(runbook).toContain("google_search_console");
    expect(runbook).toContain("chatgpt_search");
    expect(runbook).toContain("/product/source-backed-launch-assets");
    expect(runbook).toContain("Decision: pending evidence collection");
    expect(runbook).not.toMatch(/validated|ranking win|revenue|customers|guaranteed/i);
  });
});
```

- [x] **Step 2: Run RED**

Run:

```bash
npm test -- src/marketing/search-ai-baseline.test.ts
```

Expected: FAIL because `src/marketing/search-ai-baseline.ts` and `docs/marketing/data/search-ai-baseline-prompts.csv` do not exist.

## Task 2: GREEN Baseline Contract

- [x] **Step 1: Add editable CSV inventory**

Create `docs/marketing/data/search-ai-baseline-prompts.csv` with four rows: control and variant for `2026_q2_source_backed_assets_intent_validation`, and control and variant for `2026_q2_readme_cards_intent_validation`.

- [x] **Step 2: Add typed baseline module**

Create `src/marketing/search-ai-baseline.ts` with:

- `aiSearchAuditSurfaces`
- `searchBaselineSurfaces`
- `forbiddenAiSearchClaims`
- `searchAiBaselineRows`
- `getSearchAiBaselineRowsForExperiment(experimentId)`
- `renderSearchAiBaselineRunbook(experimentId)`

- [x] **Step 3: Run GREEN**

Run:

```bash
npm test -- src/marketing/search-ai-baseline.test.ts
```

Expected: PASS.

## Task 3: Docs And Mirror

- [x] **Step 1: Update repo lifecycle plan**

Append `2026-06-02 Search And AI Baseline Contract Slice` to `docs/plans/2026-06-01-quickfork-growth-lifecycle-prioritization.md`.

- [x] **Step 2: Update source-backed README research handoff**

Add the exact baseline CSV/module/runbook handoff to `docs/marketing/research/2026-06-02-source-backed-readme-page-refresh.md`.

- [x] **Step 3: Update Obsidian strategy mirror**

Append the same decision to `/Users/moose/Documents/Moose's Birth ID/QuickFork/SEO Growth/2026-06-01 QuickFork Cold Start Launch Growth Iteration.md`.

## Task 4: Verification And Publish

- [x] **Step 1: Run focused and full verification**

Run:

```bash
npm test -- src/marketing/search-ai-baseline.test.ts src/marketing/growth-experiment-report.test.ts src/marketing/growth-experiments.test.ts
npm test
npm run build
git diff --check
```

Expected: all commands exit 0.

- [ ] **Step 2: Commit and push**

Run:

```bash
git status -sb
git add docs/marketing/data/search-ai-baseline-prompts.csv src/marketing/search-ai-baseline.ts src/marketing/search-ai-baseline.test.ts docs/plans/2026-06-01-quickfork-growth-lifecycle-prioritization.md docs/marketing/research/2026-06-02-source-backed-readme-page-refresh.md docs/superpowers/plans/2026-06-02-search-ai-baseline-contract.md
git commit -m "feat: add search AI baseline contract"
git push -u origin feature/ai-answer-baseline-contract
```

Expected: branch pushed to GitHub.

- [ ] **Step 3: PR, merge, and production smoke**

Create PR into `main`, merge after checks pass, wait for main CI/CD and Vercel deploy, then smoke-test:

```bash
curl -L -s -o /dev/null -w "%{http_code}\n" https://seekersai.com/product/source-backed-launch-assets
curl -L -s -o /dev/null -w "%{http_code}\n" https://seekersai.com/product/readme-marketing-cards
curl -L -s -o /dev/null -w "%{http_code}\n" https://seekersai.com/llms.txt
```

Expected: all return `200`.
