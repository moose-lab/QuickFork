# 2026-06-03 SEO/GEO Evidence Workbook Research Note

## Summary

The SEO/GEO evidence workbook turns QuickFork's registered Search/AI baseline prompts into a concrete audit queue. Each baseline row expands into one Google Search Console task and five AI-answer audit tasks across ChatGPT Search, Perplexity, Google AI Overview, Gemini, and Claude.

This is a measurement slice, not SEO/GEO validation.

## Why This Slice Matters

- QuickFork now has multiple published product, use-case, resource, tool, and example routes, but the active experiments still have `pending_evidence`.
- Search Console exports and AI-answer audits are manual enough that evidence can drift unless the exact route, query, surface, required fields, and forbidden claims are fixed.
- A supervisor-grade workbook lets growth reviewers audit the same experiment contract across GA4, Search Console, and answer-engine surfaces before choosing the next landing page or product slice.
- This supports the current P0 priority: collect evidence before scaling more pages.

## Target User

- SEO/GEO supervisor reviewing whether QuickFork is indexable, extractable, and accurately summarized.
- Growth operator collecting route-level Search Console and AI-answer evidence.
- Product marketer deciding whether a page promise deserves more content, product, or paid-package investment.

## Lifecycle Position

- Discovery: query clusters and AI prompts are fixed by the Search/AI baseline contract.
- Validation: workbook rows specify the evidence needed before route comparisons can be decided.
- Activation: workbook decisions must be read alongside generation, artifact export, and launch materials map copy behavior.
- Monetization: paid package decisions still require lead quality and willingness-to-pay evidence.

## Growth Contract

Primary metric:

- Completion of Search Console and AI-answer audit rows for each active experiment that requires search or AI evidence.

Supporting metrics:

- `page_view`, `cta_clicked`, `generation_started`, `generation_completed`, and `generation_failed` over the same 14-day window.
- `launch_materials_map_copied` for `2026_q2_launch_materials_map_intent_validation`.
- Lead-quality fields for full launch package requests when bottom-funnel pages are involved.

Guardrails:

- Do not treat workbook rows, prompt coverage, or page publication as search demand.
- Do not claim ranking wins, AI citations, revenue, customer count, conversion lift, Product Hunt results, guaranteed launches, or pricing validation.
- Keep the workbook PII-free: no raw emails, raw repo content, source notes, private launch notes, tokens, secrets, raw artifact bodies, or customer proof.

## Implemented Surface

- `src/marketing/seo-geo-audit-workbook.ts`
- `src/marketing/seo-geo-audit-workbook.test.ts`
- `docs/marketing/data/seo-geo-audit-workbook.csv`
- `docs/superpowers/plans/2026-06-03-seo-geo-evidence-workbook.md`

## Workbook Contract

Every Search/AI baseline row now produces six audit rows:

- `google_search_console`: collect `window_start`, `window_end`, `query`, `page`, `country`, `device`, `impressions`, `clicks`, `ctr`, and `average_position`.
- `chatgpt_search`, `perplexity`, `google_ai_overview`, `gemini`, and `claude`: collect `audit_date`, `mentioned`, `cited`, `source_url`, `answer_summary`, `accuracy_status`, `competitors_cited`, and `forbidden_claims_observed`.

The workbook keeps each row tied to:

- Baseline id.
- Experiment id.
- Control or variant role.
- Canonical path.
- Target user.
- Query cluster.
- Surface.
- Expected terms.
- Forbidden claims.
- Pending status and next action.

## Current Verification

- RED test failed first because `src/marketing/seo-geo-audit-workbook.ts` did not exist.
- GREEN focused verification passed after adding the module and CSV mirror: `npm test -- src/marketing/seo-geo-audit-workbook.test.ts` returned 1 file passed and 5 tests passed.
- Related verification passed: `npm test -- src/marketing/seo-geo-audit-workbook.test.ts src/marketing/search-ai-baseline.test.ts src/marketing/growth-experiment-report.test.ts` returned 3 files passed and 21 tests passed.
- Initial full `npm test` attempts with the default forks pool hit Vitest worker startup timeouts in this local environment.
- Targeted reruns of the affected files passed, including `npm test -- src/App.test.tsx -t "keeps the generator studio|full launch package contact|landing architecture"` and `npm test -- src/server/marketing/launch-package-fit.test.ts`.
- Full verification passed with threads pool: `npm test -- --testTimeout=30000 --pool=threads` returned 25 files passed and 168 tests passed.
- Build verification passed: `npm run build` completed TypeScript build and Vite production build.
- Diff hygiene passed: `git diff --check` returned no whitespace errors.

## Decision

Treat the workbook as P0 measurement infrastructure. It makes SEO/GEO evidence collection executable, but it does not prove indexed demand, answer-engine citation, activation quality, lead quality, or willingness to pay.

## Next Validation Step

Use the workbook to collect 14-day Search Console and AI-answer evidence for the active validation experiments, then fill `docs/marketing/data/growth-experiment-evidence.csv` and decide whether each page should be promoted, rewritten, consolidated, or paused.
