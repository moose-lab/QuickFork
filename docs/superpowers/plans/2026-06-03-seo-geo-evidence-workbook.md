# SEO GEO Evidence Workbook Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build a test-covered SEO/GEO evidence workbook that expands QuickFork's registered Search/AI baseline rows into human-auditable Search Console and AI-answer collection tasks.

**Architecture:** Add a focused marketing module that derives audit rows from `search-ai-baseline.ts` rather than duplicating experiment definitions. Add an editable CSV mirror for human audit work and a research note explaining the validation boundary.

**Tech Stack:** TypeScript, Vitest, CSV docs, Markdown docs.

---

### Task 1: SEO/GEO Audit Workbook Tests

**Files:**
- Create: `src/marketing/seo-geo-audit-workbook.test.ts`

- [ ] **Step 1: Write the failing test**

Create `src/marketing/seo-geo-audit-workbook.test.ts` with tests that import `searchAiBaselineRows`, `searchBaselineSurfaces`, and the future workbook helpers. The tests must assert:

- Every baseline row expands to one workbook row per surface.
- `google_search_console` rows use task kind `search_console_query_baseline`.
- ChatGPT Search, Perplexity, Google AI Overview, Gemini, and Claude rows use task kind `ai_answer_audit`.
- Every row preserves `baselineId`, `experimentId`, `routeRole`, `canonicalPath`, `targetUser`, `query`, `queryCluster`, expected terms, forbidden claims, status `pending`, and a non-empty next action.
- The editable CSV at `docs/marketing/data/seo-geo-audit-workbook.csv` mirrors the generated workbook.
- The rendered runbook names the experiment, routes, Search Console, AI surfaces, required evidence fields, and explicitly keeps the decision as `insufficient_data`.
- The rendered runbook does not claim validated demand, ranking wins, revenue lift, customer traction, or guaranteed launch results.

- [ ] **Step 2: Run test to verify it fails**

Run:

```bash
npm test -- src/marketing/seo-geo-audit-workbook.test.ts
```

Expected: FAIL because `src/marketing/seo-geo-audit-workbook.ts` and the CSV do not exist yet.

### Task 2: SEO/GEO Audit Workbook Module

**Files:**
- Create: `src/marketing/seo-geo-audit-workbook.ts`

- [ ] **Step 1: Implement the minimal module**

Create `src/marketing/seo-geo-audit-workbook.ts` with:

- `seoGeoAuditStatuses = ["pending", "collected", "needs_reaudit"]`.
- Task kinds `search_console_query_baseline` and `ai_answer_audit`.
- `buildSeoGeoAuditWorkbookRows()` that maps every `SearchAiBaselineRow` surface to a `SeoGeoAuditWorkbookRow`.
- `getSeoGeoAuditWorkbookRowsForExperiment(experimentId)`.
- `renderSeoGeoAuditWorkbook(experimentId)` that returns a Markdown runbook with route rows, evidence fields, guardrails, and the decision line `Decision: insufficient_data_until_14_day_ga4_search_console_and_ai_answer_evidence_exists`.

- [ ] **Step 2: Run focused test**

Run:

```bash
npm test -- src/marketing/seo-geo-audit-workbook.test.ts
```

Expected: still FAIL until the editable CSV is added.

### Task 3: Editable SEO/GEO Audit CSV

**Files:**
- Create: `docs/marketing/data/seo-geo-audit-workbook.csv`

- [ ] **Step 1: Add the CSV mirror**

Create a CSV with this header:

```text
audit_id,baseline_id,experiment_id,route_role,canonical_path,target_user,query,query_cluster,surface,task_kind,evidence_fields,success_criteria,forbidden_claims,status,next_action
```

Add one row per baseline/surface pair. Use pipe-delimited lists inside fields. Keep all values PII-free and claim-safe.

- [ ] **Step 2: Run focused test**

Run:

```bash
npm test -- src/marketing/seo-geo-audit-workbook.test.ts
```

Expected: PASS.

### Task 4: Research Note And Lifecycle Plan Update

**Files:**
- Create: `docs/marketing/research/2026-06-03-seo-geo-evidence-workbook.md`
- Modify: `docs/plans/2026-06-01-quickfork-growth-lifecycle-prioritization.md`

- [ ] **Step 1: Add research note**

Document:

- Hypothesis: a generated audit workbook will reduce evidence drift across GA4, Search Console, and AI-answer audits.
- Lifecycle stage: Validation.
- Target user: SEO/GEO supervisor and growth operator.
- Changed surface: TypeScript workbook, CSV mirror, runbook renderer.
- Metric: completion of Search Console and AI-answer evidence rows for active experiments.
- Guardrail: no SEO/GEO, pricing, revenue, customer, or AI-citation claims until evidence is collected.
- Next action: run the workbook for each active experiment and fill the evidence CSV after the 14-day window.

- [ ] **Step 2: Update lifecycle plan**

Append a short dated section that records the SEO/GEO evidence workbook as a P0 measurement slice and states that it is instrumentation, not validation.

### Task 5: Verification

**Files:**
- Verify only.

- [ ] **Step 1: Run focused related tests**

Run:

```bash
npm test -- src/marketing/seo-geo-audit-workbook.test.ts src/marketing/search-ai-baseline.test.ts src/marketing/growth-experiment-report.test.ts
```

Expected: PASS.

- [ ] **Step 2: Run full verification**

Run:

```bash
npm test
npm run build
git diff --check
```

Expected: PASS. If the full suite fails for unrelated pre-existing reasons, record the exact failure and keep the focused verification result.

### Task 6: Obsidian Mirror

**Files:**
- Modify: `/Users/moose/Documents/Moose's Birth ID/QuickFork/SEO Growth/2026-06-01 QuickFork Cold Start Launch Growth Iteration.md`

- [ ] **Step 1: Append dated entry**

Append a dated entry with repo refs, hypothesis, lifecycle stage, target user, changed surface, metric, guardrail, evidence observed, decision, and next action.

- [ ] **Step 2: Verify entry exists**

Run:

```bash
tail -n 120 "/Users/moose/Documents/Moose's Birth ID/QuickFork/SEO Growth/2026-06-01 QuickFork Cold Start Launch Growth Iteration.md"
```

Expected: The new SEO/GEO evidence workbook entry is visible and states that the workbook is not validation evidence by itself.
