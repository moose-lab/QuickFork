# Page Intent Validation Expansion Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add `/product/source-backed-launch-assets` and `/product/readme-marketing-cards` to the formal growth experiment and evidence framework so the newest product pages can be compared against `/product/github-repo-to-launch-package`.

**Architecture:** Extend the typed growth experiment registry and editable CSVs with two additional validation experiments. Keep evidence pending until GA4, Search Console, and AI-answer checks exist. Use tests to require that every active experiment has a matching evidence row, published comparable pages, PII-safe metrics, and no public validation claims.

**Tech Stack:** TypeScript, Vitest, Node `fs` CSV contract tests, existing `src/marketing/link-catalog.ts`, existing growth docs, Obsidian strategy mirror.

---

## Growth Contract

- **Hypothesis:** If source-backed launch assets and README marketing card pages address narrower jobs than the generic GitHub repo launch package page, they should produce clearer CTA and generation signals without increasing generation failure or unsupported-claim risk.
- **Lifecycle stage:** Validation.
- **Target users:** Product marketers and DevRel operators for source-backed launch assets; design leads and open-source maintainers for README marketing cards.
- **Primary CTA:** `generate_launch_card`.
- **Primary metric:** `cta_clicked_per_page_view`.
- **Guardrail metric:** `generation_failed_per_generation_started`.
- **Evidence gap:** GA4 page/CTA/generation data, Search Console query baselines, and AI-answer visibility audits are still pending.
- **Claim boundary:** This is a validation plan, not proof that either page has demand, ranking lift, revenue impact, customer traction, or willingness to pay.

## File Map

- Modify `src/marketing/growth-experiments.test.ts`: add RED tests for the two new page intent validation experiments.
- Modify `src/marketing/growth-experiment-report.test.ts`: require evidence coverage for every registry experiment and pending evidence for the two new routes.
- Modify `src/marketing/growth-experiments.ts`: add typed registry entries.
- Modify `src/marketing/growth-experiment-report.ts`: add typed evidence rows.
- Modify `docs/marketing/data/growth-experiment-registry.csv`: add editable registry rows.
- Modify `docs/marketing/data/growth-experiment-evidence.csv`: add pending evidence rows.
- Modify `docs/plans/2026-06-01-quickfork-growth-lifecycle-prioritization.md`: append this growth slice.
- Modify `docs/marketing/research/2026-06-02-source-backed-readme-page-refresh.md`: add the validation handoff.
- Modify `/Users/moose/Documents/Moose's Birth ID/QuickFork/SEO Growth/2026-06-01 QuickFork Cold Start Launch Growth Iteration.md`: mirror the decision and next evidence step.

## Task 1: RED Registry Tests

- [x] **Step 1: Add failing registry expectations**

Update `src/marketing/growth-experiments.test.ts` with a new test:

```ts
it("adds the source-backed and README product pages to page intent validation", () => {
  expect(getGrowthExperimentById("2026_q2_source_backed_assets_intent_validation")).toEqual(
    expect.objectContaining({
      status: "active",
      lifecycleStage: "validation",
      targetUser: "product_marketer",
      controlPath: "/product/github-repo-to-launch-package",
      variantPath: "/product/source-backed-launch-assets",
      primaryCta: "generate_launch_card",
      primaryMetric: "cta_clicked_per_page_view",
      guardrailMetric: "generation_failed_per_generation_started",
      minimumWindow: "14_days",
    }),
  );

  expect(getGrowthExperimentById("2026_q2_readme_cards_intent_validation")).toEqual(
    expect.objectContaining({
      status: "active",
      lifecycleStage: "validation",
      targetUser: "design_lead",
      controlPath: "/product/github-repo-to-launch-package",
      variantPath: "/product/readme-marketing-cards",
      primaryCta: "generate_launch_card",
      primaryMetric: "cta_clicked_per_page_view",
      guardrailMetric: "generation_failed_per_generation_started",
      minimumWindow: "14_days",
    }),
  );
});
```

- [x] **Step 2: Run RED**

Run:

```bash
npm test -- src/marketing/growth-experiments.test.ts -t "source-backed and README product pages"
```

Expected: FAIL because the two experiment IDs are not in the registry yet.

## Task 2: RED Evidence Tests

- [x] **Step 1: Add failing evidence coverage expectations**

Update `src/marketing/growth-experiment-report.test.ts` with tests:

```ts
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
```

- [x] **Step 2: Run RED**

Run:

```bash
npm test -- src/marketing/growth-experiment-report.test.ts -t "evidence row|source-backed and README"
```

Expected: FAIL because the two evidence rows do not exist yet and the report test does not import `growthExperimentRegistry`.

## Task 3: GREEN Registry And Evidence

- [x] **Step 1: Add registry rows**

Add these rows to `docs/marketing/data/growth-experiment-registry.csv`:

```csv
2026_q2_source_backed_assets_intent_validation,active,validation,product_marketer,/product/github-repo-to-launch-package,/product/source-backed-launch-assets,generate_launch_card,cta_clicked_per_page_view,generation_failed_per_generation_started,higher_cta_rate_with_no_significant_guardrail_regression,14_days,ga4_page_view_and_cta_clicked_and_generation_started_and_generation_failed_and_search_console_query_baseline_and_ai_answer_audit
2026_q2_readme_cards_intent_validation,active,validation,design_lead,/product/github-repo-to-launch-package,/product/readme-marketing-cards,generate_launch_card,cta_clicked_per_page_view,generation_failed_per_generation_started,higher_cta_rate_with_no_significant_guardrail_regression,14_days,ga4_page_view_and_cta_clicked_and_generation_started_and_generation_failed_and_search_console_query_baseline_and_ai_answer_audit
```

- [x] **Step 2: Add typed registry entries**

Add matching `GrowthExperiment` objects to `src/marketing/growth-experiments.ts` with the same IDs, paths, target users, metrics, decision rule, and evidence requirement strings.

- [x] **Step 3: Add evidence rows**

Add these rows to `docs/marketing/data/growth-experiment-evidence.csv`:

```csv
2026_q2_source_backed_assets_intent_validation,pending_evidence,,,,,,,,,,,pending,pending,insufficient_data,ga4_page_view_and_cta_clicked_and_generation_started_and_generation_failed_14_day_window_and_search_console_query_baseline_and_ai_answer_audit
2026_q2_readme_cards_intent_validation,pending_evidence,,,,,,,,,,,pending,pending,insufficient_data,ga4_page_view_and_cta_clicked_and_generation_started_and_generation_failed_14_day_window_and_search_console_query_baseline_and_ai_answer_audit
```

- [x] **Step 4: Add typed evidence entries**

Add matching `GrowthExperimentEvidence` objects to `src/marketing/growth-experiment-report.ts` with undefined metrics, pending Search Console and AI visibility, `insufficient_data`, and the same next evidence string.

- [x] **Step 5: Run GREEN**

Run:

```bash
npm test -- src/marketing/growth-experiments.test.ts src/marketing/growth-experiment-report.test.ts
```

Expected: PASS.

## Task 4: Docs And Mirror

- [x] **Step 1: Update repo lifecycle plan**

Append a section titled `2026-06-02 Page Intent Validation Expansion Slice` to `docs/plans/2026-06-01-quickfork-growth-lifecycle-prioritization.md` with hypothesis, lifecycle stage, target users, changed surfaces, primary metric, guardrail, evidence gap, evidence observed, decision, and next action.

- [x] **Step 2: Update source-backed README research handoff**

Append a `Validation handoff` section to `docs/marketing/research/2026-06-02-source-backed-readme-page-refresh.md` explaining that both routes now have pending registry/evidence rows and still need Search Console, AI-answer, and GA4 data.

- [x] **Step 3: Update Obsidian strategy mirror**

Append a dated entry to `/Users/moose/Documents/Moose's Birth ID/QuickFork/SEO Growth/2026-06-01 QuickFork Cold Start Launch Growth Iteration.md` with commit refs once available, hypothesis, lifecycle stage, changed surface, metric, guardrail, evidence observed, decision, and next action.

## Task 5: Verification And Publish

- [x] **Step 1: Run focused tests**

Run:

```bash
npm test -- src/marketing/growth-experiments.test.ts src/marketing/growth-experiment-report.test.ts
```

Expected: PASS.

- [x] **Step 2: Run full verification**

Run:

```bash
npm test
npm run build
git diff --check
```

Expected: all commands exit 0.

- [ ] **Step 3: Commit and push**

Run:

```bash
git status -sb
git add docs/marketing/data/growth-experiment-registry.csv docs/marketing/data/growth-experiment-evidence.csv src/marketing/growth-experiments.ts src/marketing/growth-experiments.test.ts src/marketing/growth-experiment-report.ts src/marketing/growth-experiment-report.test.ts docs/plans/2026-06-01-quickfork-growth-lifecycle-prioritization.md docs/marketing/research/2026-06-02-source-backed-readme-page-refresh.md docs/superpowers/plans/2026-06-02-page-intent-validation-expansion.md
git commit -m "feat: expand page intent validation experiments"
git push -u origin feature/page-intent-validation-expansion
```

Expected: branch pushed to GitHub.

- [ ] **Step 4: Open PR, merge, and verify main**

Create a PR into `main`, merge it after checks pass, wait for main CI/CD, then smoke-test production routes that this slice depends on:

```bash
curl -L -s -o /dev/null -w "%{http_code}\n" https://seekersai.com/product/source-backed-launch-assets
curl -L -s -o /dev/null -w "%{http_code}\n" https://seekersai.com/product/readme-marketing-cards
```

Expected: both return `200`.
