# Source-Backed Launch Package Example

Date: 2026-06-02

## Question

Can a public example route make QuickFork's repo-to-launch-package output more concrete for visitors and AI-search crawlers?

## Hypothesis

If a published example page shows the target-user map, story map, README brief, social post, deck outline, and outreach draft created from one public GitHub repository, visitors will better understand the paid-product wedge before submitting their own repository URL.

## Lifecycle Stage

Discovery and Validation to Activation.

## Target User

Open-source maintainers, AI project builders, indie technical founders, and DevRel operators evaluating whether QuickFork can package a technical repository for public launch.

## Changed Surface

- `/examples/qwenlm-flashqla-launch-card` now has route-specific narrative and metadata instead of the generic example shell.
- The page renders a source-backed launch package example for `QwenLM/FlashQLA`.
- The example displays target-user discovery, project story map, README launch brief, social launch post, launch deck outline, and product outreach draft outputs.
- The page links to the public source repository and back to the QuickFork launch package generator.
- `llms.txt` now describes the example as a source-backed launch package example with target-user discovery, story map, README, social, deck, and outreach outputs.

## Growth Contract

Primary CTA:

- Generate similar card.

Primary metric:

- `example_page_viewed` for `qwenlm-flashqla-launch-card`.
- CTA clicks back to `/#hero`.

Guardrail metric:

- Do not send raw README text, raw generated output, emails, tokens, secrets, pricing, customer proof, ranking, revenue, or guaranteed-growth claims to browser analytics.

## Source Inputs

- `AGENTS.md`: every landing page should connect back to the generator and at least one source-backed example, showcase, guide, or checklist.
- `.agents/product-marketing.md`: QuickFork's durable positioning is source-backed, traceable project marketing from GitHub evidence.
- `docs/plans/2026-06-01-quickfork-growth-lifecycle-prioritization.md`: public example gallery and before/after case pages are part of growth and retention once source-backed outputs exist.
- Public GitHub source boundary: `https://github.com/QwenLM/FlashQLA`.

## Evidence Observed

- RED App test failed first because the route still rendered the generic example heading and had no launch-package example section.
- GREEN App test passed after adding the source-backed example package model, route narrative, page rendering, metadata, links, and analytics-safe assertions.
- RED public-growth test failed first because static `public/llms.txt` still exposed the generic example description while `renderLlmsTxt()` generated the new launch-package example description.
- GREEN public-growth test passed after syncing `public/llms.txt` and locking the new example description.
- Focused verification passed: `npm test -- src/App.test.tsx -t "source-backed launch package example"` returned 1 file passed, 1 selected test passed.
- Public-growth verification passed: `npm test -- src/seo/public-growth.test.ts` returned 1 file passed, 6 tests passed.
- Semantic-link verification passed: `npm test -- src/seo/semantic-links.test.ts` returned 1 file passed, 9 tests passed.
- Full test suite passed after rerunning without concurrent build load: `npm test` returned 22 files passed, 141 tests passed.
- Production build passed: `npm run build` completed TypeScript and Vite production build.
- `git diff --check`: no whitespace errors.
- Local route smoke passed: `http://127.0.0.1:5177/examples/qwenlm-flashqla-launch-card` returned HTTP 200.
- Local `llms.txt` smoke passed: `http://127.0.0.1:5177/llms.txt` contains the source-backed launch package example description.
- Built bundle smoke passed: `dist/assets/index-hWHJJcPx.js` contains the example heading, source-backed example copy, and `qwenlm_flashqla_launch_card`.
- PR #18 merged into `main` at merge commit `53ae3fcb86a252e174a8edc2f13b6107cf012816`.
- Main CI/CD run `26821810970` completed successfully: `Test and build` passed and `Deploy production to Vercel` passed.
- Production route smoke passed: `https://seekersai.com/examples/qwenlm-flashqla-launch-card` returned HTTP 200.
- Production `llms.txt` contains the source-backed launch package example description.
- Production sitemap contains `https://seekersai.com/examples/qwenlm-flashqla-launch-card`.
- Production bundle `/assets/index-t2d_KMc9.js` contains the example heading, source-backed example copy, and `qwenlm_flashqla_launch_card`.

## Evidence Gap

This proves the local route contract and AI-readable static context. It does not prove demand or willingness to pay.

Required validation before scaling example pages:

- Production route returns 200 after deploy.
- Production sitemap and `llms.txt` expose the updated example description.
- `example_page_viewed` and `cta_clicked` events appear for the example route.
- Visitors who view the example submit repository URLs or request a full launch package at a higher rate than generic product pages.
- Interviews confirm whether example outputs make the product easier to understand.

## Decision

Keep this as a focused public proof surface. Do not scale programmatic examples until this route has production traffic, example-page activation evidence, and interview feedback.

## Next Action

Run focused route, SEO, semantic-link, full test, and build verification. After merge, smoke-test the production route, `llms.txt`, sitemap, and deployed bundle strings.
