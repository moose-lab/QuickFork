# QuickFork Growth Lifecycle Prioritization

Date: 2026-06-01

## Growth Operating Frame

QuickFork's near-term growth objective is to validate a paid product wedge:

> Generate a source-backed cold-start launch package from one repository URL.

The product should help technical builders move from "I have a repo" to "I can explain, share, pitch, and measure this project" without inventing proof or diluting the technical story.

## Iteration Contract

Each growth iteration must state:

- Growth hypothesis
- Lifecycle stage
- Target user
- Primary CTA
- Primary metric
- Guardrail metric
- Evidence gap
- Source-backed claim limits
- Obsidian mirror update

## Lifecycle Model

| Stage | User state | Product job | Primary metric | Guardrail |
| --- | --- | --- | --- | --- |
| Visitor | Arrives from search, AI answer, GitHub, social, directory, or referral | Explain the category: GitHub repo to cold-start launch package | Landing CTA click rate | Bounce from unclear or overhyped copy |
| Activated user | Enters a repository URL and receives a launch brief | Deliver value before or during signup | Repo scan completion rate | Failed parsing, hallucinated claims, generic output |
| Evaluating user | Reviews README, social, deck, outreach, and visual assets | Make the package trustworthy and editable | Export/copy/download rate | Unsupported claims or low editability |
| Lead / paid-intent user | Needs private repo support, full package, brand voice, or team review | Convert launch urgency into payment intent | Upgrade click, checkout start, pilot request | Pricing promise before fulfillment proof |
| Retained user | Runs multiple launches or maintains multiple repos | Preserve launch history, brand voice, and learning | Repeat repo scans and second package generation | One-off novelty usage |

## Growth Priority Stack

### P0: Positioning And Trust Alignment

Goal:

- Make homepage, route pages, and docs consistently describe QuickFork as repository-to-launch-package software.

Work:

- Rewrite homepage hero/proof/FAQ language.
- Remove stale generic reference-page and UI/UX design positioning.
- Add source-backed trust language and output examples.

Metric:

- CTA click rate and repo URL submission rate.

Evidence gap:

- No segmented conversion baseline yet.

### P1: High-Intent Landing Pages

First pages:

- `/product/github-repo-to-launch-package`
- `/product/source-backed-launch-assets`
- `/product/readme-marketing-cards`
- `/use-cases/ai-project-launch`
- `/resources/open-source-launch-checklist`

Required sections:

- 40-60 word definition block.
- Named target user.
- Job-to-be-done.
- Source-backed benefits.
- Workflow section.
- FAQ for AI-search extraction.
- One measurable CTA.

### P2: Free Repo Launch Brief

Minimum viable output:

- Repo summary.
- Audience hypothesis.
- README improvement checklist.
- Three launch angles.
- One social post.
- One deck outline.
- One visual explainer prompt.

Metric:

- Repo URL submissions and completed briefs.

Guardrail:

- Output must show source references or uncertainty labels.

### P3: Visual Project Explainer

Minimum viable outputs:

- README hero card.
- GitHub social preview.
- Architecture/workflow diagram.
- One deck-ready explainer slide.

Metric:

- Visual preview, export, or download rate.

Guardrail:

- Visual assets should explain the project, not decorate it.

### P4: Launch Package Export

Outputs:

- README patch recommendations.
- Product Hunt copy.
- X/LinkedIn/Reddit/Hacker News variants.
- Outreach email sequence.
- Pitch deck outline.
- Launch checklist.

Metric:

- Asset export rate and number of channels selected.

Guardrail:

- Respect platform and community norms; avoid spammy wording.

### P5: Paid Packaging And Retention

Packages to test:

- Pay-per-launch package.
- Monthly creator plan.
- DevRel/team batch workflow.
- Human review add-on.

Metric:

- Upgrade clicks, checkout starts, qualified pilot requests, repeat usage.

Guardrail:

- No exact public pricing until pricing research or purchase intent supports it.

## First Build Slice

Implemented direction:

- Rewrite homepage from stale reference-page/UI design language to repo-to-launch-package language.
- Make `/product/github-repo-to-launch-package` a richer high-intent page with definition, target user, evidence boundary, benefits, workflow, FAQ, metadata, and CTA.
- Keep CTA focused on generating a free repo brief.

Growth hypothesis:

- If QuickFork clearly promises a source-backed launch package from one repository URL, AI builders with launch urgency will click into the repo brief flow at a higher rate than broad AI marketing or landing-page positioning.

Primary target user:

- AI project builder preparing a first public launch.

Primary CTA:

- Generate a free repo launch brief.

Primary metric:

- CTA click rate from homepage and first product page.

Guardrail metric:

- Repo URL submission failure rate and unsupported-claim review flags.

Evidence gap:

- No live query-level search baseline and no paid-intent benchmark yet.

## Feature Backlog

Repository understanding:

- Public repo URL intake.
- README/docs/code summarization.
- Feature extraction.
- Audience hypothesis generation.
- Source map for claims.

Launch narrative:

- Positioning angle variants.
- Technical vs founder vs DevRel tone modes.
- One-line pitch.
- Short and long descriptions.
- Launch FAQ.

Channel outputs:

- README improvement plan.
- GitHub social preview copy and image prompt.
- Product Hunt copy.
- X/LinkedIn/Reddit variants.
- Outreach email.
- Pitch deck outline.
- Landing-page section copy.

Visual interpretation:

- README hero card.
- Architecture diagram.
- Workflow diagram.
- Screenshot/storyboard prompts.
- Deck-ready explainer slide.

Review and trust:

- Claim source map.
- Unsupported-claim warnings.
- User edit memory.
- Confidence labels.
- Export checklist.

Growth and retention:

- Saved launch packages.
- Repeat repo scans.
- Public example gallery.
- Before/after case pages.
- Team review workflow.
- Analytics checklist.

## Next Action

Continue from artifact export tracking into paid-intent CTA tests after users copy or download README, social, deck, outreach, or visual prompt artifacts.

## 2026-06-02 Cold Start Launch Materials Hub Slice

Hypothesis:

- If QuickFork publishes a product-led hub for `cold start launch materials`, AI project builders and maintainers will better understand the full value unit: source-backed README, social, deck, visual, and outreach drafts generated from one public GitHub repository URL.

Lifecycle stage:

- Discovery to Validation, with SEO/GEO foundation.

Target user:

- AI project builders, open-source maintainers, indie technical founders, and DevRel teams preparing first public launches.

Changed surface:

- Added `/product/cold-start-launch-materials` as a published product route.
- Added route narrative, definition, target user, evidence boundary, benefits, workflow, FAQs, source notes, metadata, and schema.
- Added the page to semantic link inventory, sitemap, `llms.txt`, and public-growth tests.
- Added `2026_q2_cold_start_materials_intent_validation` to the experiment registry and evidence report.
- Added Search Console and AI-answer baseline rows for `GitHub repo to launch package` and `cold start launch materials`.
- Added implementation plan at `docs/superpowers/plans/2026-06-02-cold-start-launch-materials-hub.md`.
- Added research handoff at `docs/marketing/research/2026-06-02-cold-start-launch-materials-hub.md`.

Primary CTA:

- Generate free repo brief.

Primary metric:

- `cta_clicked_per_page_view` for `/product/cold-start-launch-materials`.

Guardrail:

- `generation_failed_per_generation_started`.
- No browser analytics payload should include raw README text, raw artifact body, email, token, secret, API key, private repo content, or unsupported proof.

Evidence gap:

- The route and contracts are testable but demand remains unvalidated until a 14-day production window, Search Console baseline, AI-answer audit, and qualitative feedback exist.

Evidence observed:

- RED tests failed first because the route, catalog entry, public assets, experiment row, and baseline rows were missing.
- `npm test -- src/App.test.tsx src/seo/semantic-links.test.ts`: 2 files passed, 37 tests passed.
- `npm test -- src/seo/public-growth.test.ts`: 1 file passed, 6 tests passed.
- `npm test -- src/marketing/growth-experiments.test.ts src/marketing/search-ai-baseline.test.ts src/marketing/growth-experiment-report.test.ts`: 3 files passed, 20 tests passed.
- `npm test`: 24 files passed, 158 tests passed.
- `npm run build`: TypeScript and Vite production build passed.
- `git diff --check`: no whitespace errors.

Decision:

- Treat this as a hypothesis and measurement setup. Do not promote it as validated demand or AI-search visibility until production evidence exists.

Next action:

- Run full verification, ship through PR/CI/Vercel, smoke-check production, then begin the 14-day comparison against `/product/github-repo-to-launch-package`.

## 2026-06-02 Evaluation Slice

Hypothesis:

- If users can copy or download channel-specific launch artifacts after the free repo brief, QuickFork can measure stronger product-value and paid-intent signals than a single copied summary.

Lifecycle stage:

- Activation to Evaluation.

Target user:

- AI project builders, open-source maintainers, indie technical founders, and DevRel operators preparing public repository launches.

Changed surface:

- `RepoLaunchBrief` now includes deterministic artifact exports for README, social, deck, outreach, and visual prompt use cases.
- The Hero generator result panel now shows an `Export artifacts` section with per-artifact copy and text download actions.
- Analytics now tracks `launch_artifact_copied` and `launch_artifact_downloaded` with artifact metadata only.

Primary CTA:

- Copy or download a launch artifact.

Primary metric:

- `launch_artifact_copied` and `launch_artifact_downloaded` by `artifact_type`.

Guardrail:

- Do not send raw artifact body, raw README text, emails, tokens, secrets, unsupported customer claims, ranking claims, or revenue claims to browser analytics.

Evidence gap:

- Repo tests can prove UI behavior and event hygiene, but production validation still requires GA4 event baselines and real artifact export rates.

Evidence observed:

- Backend RED test failed first because `launchBrief.artifacts` did not exist.
- Frontend RED test failed first because the free brief panel did not render `Export artifacts`.
- `npm test -- src/server/generation/generation.test.ts src/App.test.tsx src/lib/analytics.test.ts`: 3 files passed, 54 tests passed.
- `npm test`: 16 files passed, 108 tests passed.
- `npm run build`: production build completed.
- `git diff --check`: no whitespace errors.

Next action:

- Add a paid-intent action after artifact review, such as requesting a full launch package or saving artifacts behind signup, once export behavior is observable.

## 2026-06-02 Monetization Slice

Hypothesis:

- If an evaluating user can request a full launch package after reviewing generated artifacts, QuickFork can capture early willingness-to-pay and SQL-ready signals without publishing unvalidated prices.

Lifecycle stage:

- Monetization.

Target user:

- AI project builders, founders, open-source maintainers, DevRel operators, and studios that need reviewed README, social, deck, outreach, and visual launch assets.

Changed surface:

- The generated launch brief panel now includes a `Request full launch package` CTA after artifact export.
- `/contact?intent=launch-package` now routes to a bottom-funnel contact form.
- Lead capture maps this intent to `sales_contact` with `requestType=full_launch_package` and `contactReason=full_launch_package`.
- Analytics tracks the CTA as `cta_clicked` with repo, generation, artifact count, and lifecycle metadata only.

Primary CTA:

- Request full launch package.

Primary metric:

- `cta_clicked` where `cta_id=request_full_launch_package`.
- `sales_contact_requested` where `contact_reason=full_launch_package`.

Guardrail:

- Do not publish exact pricing, checkout claims, revenue claims, raw artifact body, raw README text, emails, tokens, or secrets in browser analytics.

Evidence gap:

- This only proves the product can capture intent. It still needs real lead quality, follow-up outcomes, and willingness-to-pay conversations before changing public pricing or packaging.

Evidence observed:

- RED test failed first because `Request full launch package` was absent from the generated brief panel.
- RED test failed first because `/contact?intent=launch-package` did not resolve to the contact form.
- `npm test -- src/App.test.tsx -t "submits the Hero generator form|full launch package contact"`: 1 file passed, 2 selected tests passed.
- `npm test -- src/seo/semantic-links.test.ts src/App.test.tsx src/lib/analytics.test.ts`: 3 files passed, 30 tests passed.
- `npm test`: 16 files passed, 109 tests passed.
- `npm run build`: production build completed.
- `git diff --check`: no whitespace errors.

Next action:

- Once full-launch-package requests are observable, compare them against artifact export behavior and decide whether to test signup-gated saves, paid pilot requests, or human-review packaging.

## 2026-06-02 Visual Project Story Map Slice

Hypothesis:

- If users can see a compact source-backed story map after generation, they can understand a technical repo faster and will be more likely to copy/export launch assets or request a full launch package.

Lifecycle stage:

- Activation to Evaluation.

Target user:

- AI project builders, open-source maintainers, DevRel operators, technical founders, and studios evaluating whether a repository can become a public launch story.

Changed surface:

- `RepoLaunchBrief` now includes a deterministic `storyMap` with source, audience, workflow, proof, and launch nodes.
- The generated launch brief panel now renders a `Project story map` before artifact exports.
- Users can copy the story map as markdown.
- `launchBrief.artifacts` now includes a `story_map` markdown export.
- Analytics tracks `launch_story_map_copied` with repo, generation, node count, and source-reference count only.

Primary CTA:

- Copy story map.

Primary metric:

- `launch_story_map_copied`.
- `launch_artifact_copied` and `launch_artifact_downloaded` where `artifact_type=story_map`.

Guardrail:

- Do not send raw README, raw story-map detail, raw artifact body, emails, tokens, secrets, unsupported customer proof, ranking claims, or revenue claims to browser analytics.

Evidence gap:

- Repo tests prove the story map contract, UI, and analytics hygiene. Production validation still needs real story-map copy/export rates and feedback on whether the map improves understanding.

Evidence observed:

- Backend RED test failed first because `launchBrief.storyMap` did not exist.
- Frontend RED test failed first because the generated brief did not render a true story map section or copy action.
- `npm test -- src/server/generation/generation.test.ts -t "source-backed free repo launch brief"`: 1 file passed, 1 selected test passed.
- `npm test -- src/App.test.tsx -t "submits the Hero generator form"`: 1 file passed, 1 selected test passed.
- `npm test -- src/server/generation/generation.test.ts src/App.test.tsx src/lib/analytics.test.ts`: 3 files passed, 55 tests passed.
- `npm test`: 16 files passed, 109 tests passed.
- `npm run build`: production build completed.
- `git diff --check`: no whitespace errors.

Next action:

- Compare story-map copy/download behavior against README/social/deck/outreach exports, then decide whether the next activation slice should be a visual preview export, signup-gated saves, or a source-backed showcase example.

## 2026-06-02 Repo Audience Discovery Map Slice

Hypothesis:

- If the generated launch brief names likely target users, launch triggers, channels, and validation questions, builders will understand QuickFork as a launch strategy workflow rather than a generic asset generator.

Lifecycle stage:

- Discovery to Activation.

Target user:

- AI project builders, open-source maintainers, indie technical founders, DevRel operators, and studios preparing public launches from GitHub-backed products.

Changed surface:

- `RepoLaunchBrief` now includes a deterministic `audienceDiscovery` map.
- The generated launch brief panel now renders a `Target user discovery` section before the project story map.
- Users can copy the target user map as markdown.
- `launchBrief.artifacts` now includes an `audience` markdown export before story map, README, social, deck, outreach, and visual artifacts.
- Analytics tracks `launch_audience_map_copied` with repo, generation, segment count, channel count, and validation question count only.
- Added implementation plan at `docs/superpowers/plans/2026-06-02-repo-audience-discovery-map.md`.
- Added research synthesis at `docs/marketing/research/2026-06-02-repo-audience-discovery-map.md`.

Primary CTA:

- Copy target user map.

Primary metric:

- `launch_audience_map_copied`.
- `launch_artifact_copied` and `launch_artifact_downloaded` where `artifact_type=audience`.

Guardrail:

- Do not send raw README, raw target-user text, raw artifact body, emails, tokens, secrets, unsupported customer proof, pricing, ranking, revenue, or guaranteed-growth claims to browser analytics.

Evidence gap:

- Repo tests prove the audience discovery contract, UI, and analytics hygiene. Production validation still needs real copy/export rates and interviews about whether the target user map helps users find launch audiences.

Evidence observed:

- Backend RED test failed first because `launchBrief.audienceDiscovery` did not exist.
- Frontend RED test failed first because the generated brief did not render a `Target user discovery` region.
- `npm test -- src/server/generation/generation.test.ts -t "source-backed free repo launch brief"`: 1 file passed, 1 selected test passed.
- `npm test -- src/App.test.tsx -t "submits the Hero generator form"`: 1 file passed, 1 selected test passed.
- `npm test -- src/server/generation/generation.test.ts src/App.test.tsx src/lib/analytics.test.ts`: 3 files passed, 63 tests passed.
- `npm test`: 22 files passed, 140 tests passed.
- `npm run build`: TypeScript and Vite production build completed.
- `git diff --check`: no whitespace errors.
- PR #16 merged into `main` at merge commit `a116ba67d50b1096898122ea74c3a9a2f940fe1f`.
- Main CI/CD run `26820012405` completed successfully: `Test and build` passed and `Deploy production to Vercel` passed.
- Production smoke passed: `https://seekersai.com` returned HTTP 200.
- Production bundle `/assets/index-DmGop2Ki.js` contains `Target user discovery`, `launch_audience_map_copied`, and `audienceDiscovery`.

Next action:

- Run full verification, PR/merge, production smoke, then compare `launch_audience_map_copied` and `artifact_type=audience` export behavior against story map and README/social/deck/outreach exports.

## 2026-06-02 AI Project Launch Use Case Page Slice

Hypothesis:

- If AI project builders land on an AI-project-specific use-case page, they will understand QuickFork's cold-start launch package faster than from a generic open-source launch page.

Lifecycle stage:

- Discovery to Validation.

Target user:

- AI project builders, open-source AI maintainers, research engineers, technical founders, and DevRel teams preparing an AI repository for public launch.

Changed surface:

- Added the published `/use-cases/ai-project-launch` route to the semantic marketing link catalog and CSV inventory.
- Added AI-project-specific page narrative, definition, target user, source boundary, benefits, workflow, and FAQ content.
- Added route-level `FAQPage` JSON-LD for AI/GEO extraction on marketing pages.
- Added the route to `public/sitemap.xml` and `public/llms.txt`.
- Added route rendering, canonical metadata, schema, CTA tracking, public-growth asset, and semantic-link regression tests.

Primary CTA:

- Generate free repo brief.

Primary metric:

- `cta_clicked` on `/use-cases/ai-project-launch` with `intent_cluster=ai_project_launch`.
- `page_view` on `/use-cases/ai-project-launch` with `buyer_stage=consideration`.

Guardrail:

- Do not publish rankings, revenue, customer-count, unsupported benchmark, exact pricing, guaranteed-launch, or guaranteed-growth claims.

Evidence gap:

- Repo tests prove the route, metadata, schema, crawl assets, and analytics payload contract. Production validation still needs search impressions, AI-search citation checks, CTA rate, repo submission rate, and qualified activation from this route.

Evidence observed:

- RED target test failed while the route, crawl assets, and schema were missing.
- Targeted test later failed on `AI project launch` text casing in `llms.txt`; the route description and semantic-link test were adjusted to preserve readable `AI` acronym text while still matching the primary keyword case-insensitively.
- `npm test -- src/App.test.tsx src/seo/public-growth.test.ts src/seo/semantic-links.test.ts`: 3 files passed, 28 tests passed.
- `npm test`: 16 files passed, 110 tests passed.
- `npm run build`: TypeScript build and Vite production build completed.
- `git diff --check`: no whitespace errors.

Next action:

- After PR checks and deploy, compare this use-case route's page-view and CTA behavior against `/product/github-repo-to-launch-package`.

## 2026-06-02 Landing Page Measurement Registry Slice

Hypothesis:

- If `/use-cases/ai-project-launch` gives AI builders a more specific job-to-be-done than `/product/github-repo-to-launch-package`, it should produce a higher qualified CTA rate without increasing low-quality generation starts or unsupported-claim risk.

Lifecycle stage:

- Validation.

Target user:

- AI project builders and open-source AI maintainers preparing a public repository launch.

Changed surface:

- Added `docs/marketing/data/growth-experiment-registry.csv` as the editable experiment inventory.
- Added `src/marketing/growth-experiments.ts` as the typed registry mirror.
- Added `src/marketing/growth-experiments.test.ts` to verify route references, CTA comparability, metric definitions, guardrails, and claim hygiene.
- Added the implementation plan at `docs/superpowers/plans/2026-06-02-landing-page-growth-experiment-registry.md`.

Primary CTA:

- Generate free repo brief.

Primary metric:

- `cta_clicked_per_page_view` for `generate_launch_card`.

Guardrail:

- `generation_failed_per_generation_started`.
- Unsupported-claim review flags during generated package review.

Evidence gap:

- The registry defines what must be compared. It does not prove the AI project launch route wins. A decision still needs at least 14 days of production `page_view`, `cta_clicked`, `generation_started`, and `generation_failed` data plus qualitative review of generated claims.

Evidence observed:

- RED test failed first because `src/marketing/growth-experiments.ts` did not exist.
- `npm test -- src/marketing/growth-experiments.test.ts`: 1 file passed, 4 tests passed.
- `npm test -- src/marketing/growth-experiments.test.ts src/seo/semantic-links.test.ts src/lib/analytics.test.ts`: 3 files passed, 20 tests passed.
- `npm test`: 17 files passed, 114 tests passed.
- `npm run build`: TypeScript build and Vite production build completed.
- `git diff --check`: no whitespace errors.

Next action:

- Add a lightweight reporting surface or manual GA4 checklist that exports this registry into a route comparison table after enough production data exists.

## 2026-06-02 Growth Experiment Evidence Report Slice

Hypothesis:

- If the AI project launch route is compared against the product-category route with a pre-declared evidence table, QuickFork can decide the next landing-page investment from measured behavior instead of copy preference.

Lifecycle stage:

- Validation.

Target user:

- AI project builders and open-source AI maintainers preparing a public repository launch.

Changed surface:

- Added `docs/marketing/data/growth-experiment-evidence.csv` as the editable pending evidence inventory for the active landing-page comparison.
- Added `src/marketing/growth-experiment-report.ts` to join the experiment registry with evidence rows and render a Markdown comparison report.
- Added `src/marketing/growth-experiment-report.test.ts` to lock pending-state behavior, route comparability, metric hygiene, and claim safety.
- Added the implementation plan at `docs/superpowers/plans/2026-06-02-growth-experiment-evidence-report.md`.

Primary CTA:

- Generate free repo brief.

Primary metric:

- `cta_clicked_per_page_view` for `generate_launch_card`.

Guardrail:

- `generation_failed_per_generation_started`.
- The report must not claim validation, revenue, customers, guaranteed growth, or a winning variant before 14-day production evidence exists.

Evidence gap:

- The evidence row is intentionally `pending_evidence`. A decision still needs comparable GA4 `page_view`, `cta_clicked`, `generation_started`, and `generation_failed` data for `/product/github-repo-to-launch-package` and `/use-cases/ai-project-launch`, plus Search Console and AI visibility checks.

Evidence observed:

- RED test failed first because `src/marketing/growth-experiment-report.ts` did not exist.
- `npm test -- src/marketing/growth-experiment-report.test.ts`: 1 file passed, 6 tests passed.
- `npm test -- src/marketing/growth-experiment-report.test.ts src/marketing/growth-experiments.test.ts src/lib/analytics.test.ts`: 3 files passed, 19 tests passed.
- `npm test`: 18 files passed, 120 tests passed.
- `npm run build`: TypeScript build and Vite production build completed.

Decision:

- Treat the report as an evidence collection contract, not a validation result. Current decision remains `insufficient_data` until the 14-day production window is filled.

Next action:

- Fill `docs/marketing/data/growth-experiment-evidence.csv` after a full production window, then use the rendered report to decide whether `/use-cases/ai-project-launch` should be promoted, revised, or replaced by the next high-intent page.

## 2026-06-02 GitHub Repo Launch Demand Map Slice

Hypothesis:

- If QuickFork turns public GitHub repo launch-prep signals into a source-linked demand map, builders will understand the paid full-launch-package CTA as grounded in real launch work rather than generic AI marketing.

Lifecycle stage:

- Discovery to Monetization.

Target user:

- Open-source maintainers, AI project builders, indie founders, DevRel operators, and studios preparing repository launch assets.

Changed surface:

- Added `src/marketing/launch-demand-map.ts` as a typed public-demand signal map.
- Added `src/marketing/launch-demand-map.test.ts` to verify source URLs, lifecycle priority, paid-intent signals, and claim hygiene.
- Added `/resources/github-repo-launch-demand-map` as a published resource route with source notes for GitHub Docs, Open Source Guides, Product Hunt, and Reddit community launch prep.
- Added the route to `docs/marketing/data/semantic-link-inventory.csv`, `public/sitemap.xml`, and `public/llms.txt`.
- Added research synthesis at `docs/marketing/research/2026-06-02-github-repo-launch-demand-map.md`.
- Added implementation plan at `docs/superpowers/plans/2026-06-02-github-repo-launch-demand-map.md`.

Primary CTA:

- Request full launch package.

Primary metric:

- `cta_clicked` where `cta_id=request_launch_package` on `/resources/github-repo-launch-demand-map`.
- `sales_contact_requested` where `contact_reason=full_launch_package` after route visits.

Guardrail:

- Treat public sources as discovery evidence only. Do not publish revenue, customer-count, ranking, conversion-lift, guaranteed-launch, or exact pricing claims from this research.

Evidence gap:

- The route and demand map are source-linked but not validated demand. Production route views, CTA clicks, contact quality, and interviews are still required before pricing or packaging changes.

Evidence observed:

- RED test failed first because `src/marketing/launch-demand-map.ts` did not exist.
- RED route test failed first because `/resources/github-repo-launch-demand-map` rendered the homepage rather than a marketing route.
- RED source-note test failed first because the route did not expose the Reddit Product Hunt launch community source link.
- `npm test -- src/marketing/launch-demand-map.test.ts src/App.test.tsx -t "launch demand map|launch demand"`: 2 files passed, 3 selected tests passed.
- `npm test -- src/marketing/launch-demand-map.test.ts src/App.test.tsx src/seo/public-growth.test.ts src/seo/semantic-links.test.ts -t "launch demand map|launch demand|public growth|semantic marketing"`: 4 files passed, 16 selected tests passed.
- `npm test -- src/App.test.tsx -t "GitHub repo launch demand map"`: 1 file passed, 1 selected test passed after adding the Reddit source note.
- `npm test -- src/marketing/launch-demand-map.test.ts src/App.test.tsx src/seo/public-growth.test.ts src/seo/semantic-links.test.ts`: 4 files passed, 31 tests passed.
- `npm test`: 19 files passed, 123 tests passed.
- `npm run build`: TypeScript build and Vite production build completed.
- `git diff --check`: no whitespace errors.

Decision:

- Treat this as a research-to-monetization bridge. The next paid-product learning should come from full launch package requests and interviews, not from publishing prices.

Next action:

- After production deploy, verify the route returns 200, appears in sitemap and `llms.txt`, and starts collecting route-level CTA/contact evidence.

## 2026-06-02 Open Source Launch Checklist Resource Slice

Hypothesis:

- If open-source maintainers receive a source-backed launch checklist instead of a generic resource shell, they can see QuickFork as a useful early launch-planning tool and are more likely to request the checklist or generate a repo brief.

Lifecycle stage:

- Discovery to Validation.

Target user:

- Open-source maintainers and AI/devtool builders preparing a public GitHub repository launch.

Changed surface:

- `/resources/open-source-launch-checklist` now has a dedicated source-backed narrative instead of the generic resource template.
- The page defines the job around README trust, repository social preview, audience feedback, launch assets, and post-launch learning.
- Public source notes now link Open Source Guides, GitHub README docs, GitHub social preview docs, and Product Hunt launch preparation.
- `MarketingPageNarrative` now supports an optional `lastUpdated` field and renders `Last updated: June 2, 2026`.
- `public/llms.txt` and `public/sitemap.xml` were refreshed from the SEO/GEO route contract.
- Added implementation plan at `docs/superpowers/plans/2026-06-02-open-source-launch-checklist-resource.md`.
- Added research synthesis at `docs/marketing/research/2026-06-02-open-source-launch-checklist.md`.

Primary CTA:

- Request checklist.

Primary metric:

- `lead_magnet_requested / resource_page_viewed` for `/resources/open-source-launch-checklist`.

Guardrail:

- Do not claim ranking lift, revenue, customer count, Product Hunt success, guaranteed growth, conversion lift, or exact pricing from this resource.

Evidence gap:

- The route is source-backed but not validated demand. Production page views, checklist requests, lead quality, follow-up interviews, repo brief starts, and AI-search citation behavior are still required.

Evidence observed:

- RED route test failed first because `/resources/open-source-launch-checklist` used generic resource copy instead of checklist-specific content.
- RED public-growth test failed first because `llms.txt` still exposed the generic resource description.
- `npm test -- src/App.test.tsx -t "open-source launch checklist"`: 1 file passed, 1 selected test passed.
- `npm test -- src/seo/public-growth.test.ts -t "machine-readable AI context"`: 1 file passed, 1 selected test passed.
- `npm test -- src/App.test.tsx src/seo/public-growth.test.ts src/seo/semantic-links.test.ts`: 3 files passed, 30 tests passed.
- `npm test`: 19 files passed, 124 tests passed.
- `npm run build`: TypeScript build and Vite production build completed.
- `git diff --check`: no whitespace errors.

Decision:

- Treat this as a P1 resource-depth fix and a lead-magnet validation surface. It is not evidence of willingness to pay yet.

Next action:

- Run full verification, push the branch, open a PR, and after deploy smoke-test the production route, sitemap, and `llms.txt`.

## 2026-06-02 Repo Launch Readiness Score Slice

Hypothesis:

- If a founder or maintainer can evaluate launch readiness through a source-backed scorecard, they will better understand why QuickFork asks for a repo URL and will be more likely to start the free studio flow.

Lifecycle stage:

- Discovery to Activation.

Target user:

- Founders, open-source maintainers, and AI/devtool builders preparing a public GitHub repository launch.

Changed surface:

- `/tools/github-repo-launch-readiness-score` now has a dedicated source-backed narrative instead of the generic tool template.
- Added `src/marketing/launch-readiness-score.ts` as a typed 100-point readiness rubric.
- Added scorecard rendering to `MarketingPage` for routes with `narrative.scorecard`.
- Added `tool_page_viewed` analytics for tool routes.
- Updated `public/llms.txt` to describe the score as README trust, repository preview, audience feedback, launch assets, and follow-up measurement.
- Added implementation plan at `docs/superpowers/plans/2026-06-02-repo-launch-readiness-score.md`.
- Added research synthesis at `docs/marketing/research/2026-06-02-repo-launch-readiness-score.md`.

Primary CTA:

- Start free tool.

Primary metric:

- `cta_clicked` where `cta_id=start_free_tool`, segmented by prior `tool_page_viewed` on `/tools/github-repo-launch-readiness-score`.

Guardrail:

- `generation_failed / generation_started` after visitors start the studio flow.
- Do not claim the score predicts search performance, sales outcomes, launch results, Product Hunt performance, conversion lift, or willingness to pay.

Evidence gap:

- The route is source-backed but not validated demand. Production tool page views, CTA clicks, repo submissions, generation completions, and interviews are still required.

Evidence observed:

- RED model test failed first because `src/marketing/launch-readiness-score.ts` did not exist.
- RED route test failed first because `/tools/github-repo-launch-readiness-score` still lacked 100-point scorecard content.
- RED public-growth test failed first because `llms.txt` still exposed the generic tool description.
- `npm test -- src/marketing/launch-readiness-score.test.ts`: 1 file passed, 3 tests passed.
- `npm test -- src/App.test.tsx -t "repo launch readiness score"`: 1 file passed, 1 selected test passed.
- `npm test -- src/seo/public-growth.test.ts -t "machine-readable AI context"`: 1 file passed, 1 selected test passed.
- Build verification caught a missing `AnalyticsEventName` entry for `tool_page_viewed`; the event type was added and covered by `src/lib/analytics.test.ts`.
- `npm test -- src/lib/analytics.test.ts src/App.test.tsx -t "tool page views|repo launch readiness score"`: 2 files passed, 2 selected tests passed.
- `npm test`: 20 files passed, 129 tests passed.
- `npm run build`: TypeScript build and Vite production build completed.
- `git diff --check`: no whitespace errors.

Decision:

- Treat this as a free-tool activation bridge, not validated demand. The scorecard makes the published tool route useful while the next proof still comes from production funnel behavior.

Next action:

- Run full verification, push/open PR, then smoke-test production route, `llms.txt`, sitemap, and deployed bundle.

## 2026-06-02 Paid-Intent Package Qualification Slice

Hypothesis:

- If the full launch package request asks for package model and buying trigger in addition to repo URL, launch timeline, package scope, and human review needs, QuickFork can distinguish real monetization intent from generic contact before publishing exact prices.

Lifecycle stage:

- Monetization learning.

Target user:

- Founders, open-source maintainers, DevRel operators, and studios with a launch deadline, Product Hunt preparation, investor/demo-day need, client handoff, or repeat repository launch workflow.

Changed surface:

- `/contact?intent=launch-package`
- `src/components/marketing/LeadCaptureForm.tsx`
- `src/server/marketing/lead-capture.ts`
- `src/App.test.tsx`
- `src/server/marketing/lead-capture.test.ts`
- `docs/superpowers/plans/2026-06-02-paid-intent-package-qualification.md`

Primary CTA:

- Request full launch package.

Primary metric:

- `sales_contact_requested`, segmented by `package_model`, `buying_trigger`, `launch_timeline`, `package_scope_count`, and `human_review_needed`.

Guardrail:

- Do not publish exact pricing until pricing research, qualified pilot requests, and willingness-to-pay interviews exist.
- Browser analytics must not include raw email, name, repository URL, launch notes, raw artifact bodies, tokens, secrets, unsupported customer proof, ranking, revenue, or guaranteed-launch claims.

Evidence gap:

- Field capture and CRM preservation prove instrumentation, not willingness to pay. This still needs qualified requests, interviews, route-level CTA behavior, and package-scope analysis.

Evidence observed:

- Frontend RED test failed first because the full launch package form did not expose `Package model`.
- Server RED test failed first because CRM activity qualification did not preserve `packageModel` or `buyingTrigger`.
- `npm test -- src/App.test.tsx -t "full launch package contact"`: 1 file passed, 1 selected test passed.
- `npm test -- src/server/marketing/lead-capture.test.ts -t "full launch package qualification"`: 1 file passed, 1 selected test passed.
- `npm test -- src/App.test.tsx src/server/marketing/lead-capture.test.ts src/seo/public-growth.test.ts`: 3 files passed, 33 tests passed.
- `npm test`: 22 files passed, 141 tests passed.
- `npm run build`: TypeScript and Vite production build completed.
- `git diff --check`: no whitespace errors.
- PR #20 merged into `main` at merge commit `65735f96d65cc35010687c1d38f524264ac4817c`.
- Main CI/CD run `26823339942` completed successfully: `Test and build` passed and `Deploy production to Vercel` passed.
- Production smoke passed: `https://seekersai.com/contact?intent=launch-package` returned HTTP 200.
- Production pilot route smoke passed: `https://seekersai.com/product/repository-launch-package-pilot` returned HTTP 200.
- Production bundle `/assets/index-Ct_v02I-.js` contains `Package model`, `Buying trigger`, `package_model`, `buying_trigger`, `single_launch`, and `launch_deadline`.

Decision:

- Treat this as a monetization qualification improvement, not validated pricing. The request path now captures which paid package shape users ask for without turning the public page into a pricing claim.

Next action:

- Run full verification, push/open PR, merge, then production-smoke the contact route and monitor `sales_contact_requested` quality before changing packaging or prices.

## 2026-06-02 Source-Backed Launch Package Example Slice

Hypothesis:

- If a published example page shows a concrete launch package created from one public GitHub repository, visitors and AI-search systems can understand QuickFork's output shape before the visitor submits their own repository URL.

Lifecycle stage:

- Discovery and Validation to Activation.

Target user:

- Open-source maintainers, AI project builders, indie technical founders, and DevRel operators evaluating whether QuickFork can package a technical repository for public launch.

Changed surface:

- `/examples/qwenlm-flashqla-launch-card` now uses dedicated source-backed example narrative and metadata instead of the generic example shell.
- Added `src/marketing/launch-package-example.ts` as a typed example package model for target-user discovery, story map, README, social, deck, and outreach outputs.
- Added launch-package example rendering to `MarketingPage` for routes with `narrative.launchPackageExample`.
- Updated `public/llms.txt` so AI crawlers can read the example as a source-backed launch package example.
- Added research synthesis at `docs/marketing/research/2026-06-02-source-backed-launch-package-example.md`.

Primary CTA:

- Generate similar card.

Primary metric:

- `example_page_viewed` for `qwenlm-flashqla-launch-card`.
- `cta_clicked` back to `/#hero`.

Guardrail:

- Do not send raw README text, raw generated output, emails, tokens, secrets, pricing, customer proof, ranking, revenue, or guaranteed-growth claims to browser analytics.
- Do not treat the example as proof of benchmark performance, adoption, revenue, Product Hunt outcomes, or willingness to pay.

Evidence gap:

- Production route views, CTA clicks, repo submissions, full-package requests, and interviews are still required before scaling example pages.

Evidence observed:

- RED App test failed first because the route still rendered the generic example heading and had no launch-package example section.
- `npm test -- src/App.test.tsx -t "source-backed launch package example"`: 1 file passed, 1 selected test passed.
- RED public-growth test failed first because `public/llms.txt` still exposed the generic example description.
- `npm test -- src/seo/public-growth.test.ts -t "machine-readable AI context"`: 1 file passed, 1 selected test passed.
- `npm test -- src/seo/public-growth.test.ts`: 1 file passed, 6 tests passed.
- `npm test -- src/seo/semantic-links.test.ts`: 1 file passed, 9 tests passed.
- Initial concurrent `npm test` + `npm run build` run timed out in unrelated App/Auth tests under load; after build completed, standalone `npm test` passed with 22 files and 141 tests.
- `npm run build`: TypeScript and Vite production build completed.
- `git diff --check`: no whitespace errors.
- Local route smoke passed: `http://127.0.0.1:5177/examples/qwenlm-flashqla-launch-card` returned HTTP 200.
- Local `llms.txt` contains the new source-backed launch package example description.
- Built bundle contains `QwenLM FlashQLA Launch Card as a source-backed launch package example`, `source-backed launch package example`, and `qwenlm_flashqla_launch_card`.
- PR #18 merged into `main` at merge commit `53ae3fcb86a252e174a8edc2f13b6107cf012816`.
- Main CI/CD run `26821810970` completed successfully: `Test and build` passed and `Deploy production to Vercel` passed.
- Production route smoke passed: `https://seekersai.com/examples/qwenlm-flashqla-launch-card` returned HTTP 200.
- Production `llms.txt` contains the source-backed launch package example description.
- Production sitemap contains `https://seekersai.com/examples/qwenlm-flashqla-launch-card`.
- Production bundle `/assets/index-t2d_KMc9.js` contains the example heading, source-backed example copy, and `qwenlm_flashqla_launch_card`.

Decision:

- Treat this as a focused public proof surface. Do not scale programmatic examples until this route has production traffic, example-page activation evidence, and interview feedback.

Next action:

- Run focused route, SEO, semantic-link, full test, and build verification. After merge, smoke-test the production route, `llms.txt`, sitemap, and deployed bundle strings.

## 2026-06-02 Repo Launch Deck Brief Slice

Hypothesis:

- If QuickFork publishes a source-backed repo-to-launch-deck brief page, AI project founders and DevRel operators will better understand the value of turning one repository URL into deck-ready launch structure before requesting a full launch package.

Lifecycle stage:

- Activation to Evaluation, P4.

Target user:

- AI project founders, indie technical founders, open-source maintainers, and DevRel operators preparing Product Hunt, demo-day, internal, or community launch decks from a GitHub-backed product.

Changed surface:

- Added `/product/github-repo-to-launch-deck` as a published product route in the semantic marketing catalog and CSV inventory.
- Added route-specific title, description, headline, definition block, target user, JTBD, evidence boundary, benefits, workflow, FAQ, source notes, and last-updated date.
- Updated sitemap and `llms.txt` so crawlers and AI-search systems can discover the deck brief route.
- Added implementation plan at `docs/superpowers/plans/2026-06-02-repo-launch-deck-brief.md`.
- Added research synthesis at `docs/marketing/research/2026-06-02-repo-launch-deck-brief.md`.

Primary CTA:

- Generate free repo brief.

Primary metric:

- `cta_clicked` on `/product/github-repo-to-launch-deck`, segmented by `page_view` where `intent_cluster=github_repo_to_launch_deck`.

Guardrail:

- Do not publish claims about funding, rankings, revenue, customers, benchmark lift, Product Hunt results, guaranteed launch performance, or exact pricing.
- Route visitors to reviewable repo brief generation, not automatic publishing.

Evidence gap:

- Search Console demand for deck-related repo queries.
- Route-level CTA and repo generation starts from `/product/github-repo-to-launch-deck`.
- Export/copy/download rate for deck artifacts from the launch brief.
- Willingness-to-pay interviews for full launch-package deck review.

Evidence observed:

- Baseline `npm test`: 21 files passed, 135 tests passed.
- RED focused tests failed first because `/product/github-repo-to-launch-deck`, sitemap, `llms.txt`, and catalog entries did not exist.
- `npm test -- src/seo/semantic-links.test.ts src/seo/public-growth.test.ts`: 2 files passed, 14 tests passed.
- `git diff --check`: no whitespace errors.
- `npm test`: 21 files passed, 136 tests passed.
- `npm run build`: TypeScript and Vite production build completed.
- Local dev smoke: `http://localhost:5173/product/github-repo-to-launch-deck`, `/sitemap.xml`, and `/llms.txt` returned HTTP 200; `llms.txt` contains `GitHub Repository Pitch Deck Generator` and the deck-ready launch brief description.
- PR #12 merged into `main` at merge commit `f5fcc5a37b7ea6c6884c2b5e3dba00914fb7869d`.
- Main CI/CD run `26810312003` completed successfully: `Test and build` passed and `Deploy production to Vercel` passed.
- Production smoke: `https://seekersai.com/product/github-repo-to-launch-deck`, `/sitemap.xml`, and `/llms.txt` returned HTTP 200.
- Production sitemap contains `https://seekersai.com/product/github-repo-to-launch-deck`.
- Production `llms.txt` contains `GitHub Repository Pitch Deck Generator` and the deck-ready launch brief description.
- Production JS bundle contains `GitHub Repository Pitch Deck Generator`, `github_repo_to_launch_deck`, `deck-ready launch brief`, `Product Hunt story`, and `source-backed launch decks`.

Decision:

- Treat this as a published P4 activation-to-evaluation growth hypothesis and productization bridge, not validated demand or pricing proof.

Next action:

- Compare route-level `page_view`, `cta_clicked`, `generation_started`, `generation_completed`, and deck artifact export behavior against `/product/github-repo-to-launch-package`.

## 2026-06-02 Repo Product Outreach Page Slice

Hypothesis:

- If QuickFork publishes a source-backed repo-to-product-outreach page, founders and DevRel operators preparing cold-start launches will see outreach drafts as reviewable launch-package artifacts and will be more likely to generate a free repo brief or request a full package.

Lifecycle stage:

- Activation to Evaluation, P4 launch package export learning.

Target user:

- AI project founders, indie technical founders, open-source maintainers, and DevRel operators preparing Product Hunt, community, partner, newsletter, or pilot-customer follow-up from a GitHub-backed product.

Changed surface:

- Added `/product/github-repo-to-product-outreach` as a published product route in the semantic marketing route inventory.
- Added `src/marketing/product-outreach-package.ts` with source-backed outreach outputs for launch email draft, community feedback post, partner/newsletter note, Product Hunt first comment, and human review checklist.
- Added route-specific page narrative, source notes, metadata, sitemap, and `llms.txt` coverage.
- Repo research note: `docs/marketing/research/2026-06-02-repo-product-outreach-page.md`
- Implementation plan: `docs/superpowers/plans/2026-06-02-repo-product-outreach-page.md`

Metric:

- `cta_clicked` on `/product/github-repo-to-product-outreach`, segmented by `page_view` where `intent_cluster=github_repo_product_outreach`.
- Downstream: `launch_artifact_copied` and `launch_artifact_downloaded` where `artifact_type=outreach`.

Guardrail:

- Do not publish claims about guaranteed replies, email sending, scraped leads, search performance, business outcomes, customer acquisition, Product Hunt results, or exact public pricing.
- Keep outreach as human-reviewed drafts, not automated distribution.

Evidence observed:

- RED model test failed first because `src/marketing/product-outreach-package.ts` did not exist.
- RED route test failed first because `/product/github-repo-to-product-outreach` rendered the homepage rather than a marketing route.
- RED public-growth tests failed first because sitemap and `llms.txt` did not include the route.
- `npm test -- src/marketing/product-outreach-package.test.ts src/App.test.tsx src/seo/public-growth.test.ts src/seo/semantic-links.test.ts -t "product outreach|public growth|semantic marketing"`: 4 files passed, 18 selected tests passed.
- `npm test -- src/marketing/product-outreach-package.test.ts src/App.test.tsx src/seo/public-growth.test.ts src/seo/semantic-links.test.ts`: 4 files passed, 38 tests passed.
- `git diff --check`: no whitespace errors.
- `npm test`: 22 files passed, 140 tests passed.
- `npm run build`: TypeScript and Vite production build completed.
- Local dev smoke: `http://127.0.0.1:5176/product/github-repo-to-product-outreach`, `/sitemap.xml`, and `/llms.txt` returned expected route/status/content evidence; the dev server was stopped after verification.
- PR #14 merged into `main` at merge commit `776115722e3b2acb6f70b255ba4a2062914b0164`.
- Main CI/CD run `26818466190` completed successfully: `Test and build` passed and `Deploy production to Vercel` passed.
- Production smoke: `https://seekersai.com/product/github-repo-to-product-outreach` returned HTTP 200.
- Production sitemap contains `https://seekersai.com/product/github-repo-to-product-outreach`.
- Production `llms.txt` contains `GitHub Repo Product Outreach` and the source-backed outreach brief description.
- Production JS bundle `/assets/index-Bgr1koiC.js` contains `GitHub Repo Product Outreach`, `github_repo_product_outreach`, and `source-backed outreach package`.

Decision:

- Treat this as a published-route candidate and productization hypothesis, not validated outreach demand. Production analytics, artifact export behavior, full package requests, and interviews are still required.

Next action:

- Run full verification, PR/merge, production smoke, then compare route-level `page_view`, `cta_clicked`, `generation_started`, `generation_completed`, and outreach artifact export behavior against the deck and full package pilot pages.

## 2026-06-02 Launch Package Intent Qualification Slice

Hypothesis:

- If a full launch package request asks for repo URL, launch timeline, package scope, and review needs, QuickFork can distinguish qualified paid-intent requests from generic contact submissions before publishing exact pricing.

Lifecycle stage:

- Monetization learning, P4/P5.

Target user:

- Founders, open-source maintainers, DevRel operators, and design/product leads requesting a full package after reviewing a free brief, demand map, readiness score, visual explainer, or pilot page.

Changed surface:

- `/contact?intent=launch-package` now asks for GitHub repository URL, launch timeline, package scope, human review need, and launch notes.
- Browser analytics only receives safe summary fields: `launch_timeline`, `package_scope_count`, and `human_review_needed`.
- Server-side lead capture normalizes repo URL into `repoHost` and `repoFullName`, then stores structured qualification metadata in the CRM activity.
- Added implementation plan at `docs/superpowers/plans/2026-06-02-launch-package-intent-qualification.md`.
- Added research synthesis at `docs/marketing/research/2026-06-02-launch-package-intent-qualification.md`.

Primary CTA:

- Request full launch package.

Primary metric:

- `sales_contact_requested` where `contact_reason=full_launch_package` and `request_type=full_launch_package`.

Guardrail:

- Browser analytics must not include email, name, raw repo URL, raw notes, tokens, secrets, price claims, revenue claims, or guaranteed launch outcomes.

Evidence gap:

- Real request quality, launch urgency, scope distribution, and willingness-to-pay interview outcomes are still missing.

Evidence observed:

- Baseline `npm test`: 21 files passed, 134 tests passed.
- RED frontend test failed first because `/contact?intent=launch-package` did not include `GitHub repository URL`.
- RED server test failed first because `qualification` was not present in CRM activity properties.
- `npm test -- src/App.test.tsx -t "full launch package contact"`: 1 file passed, 1 selected test passed.
- `npm test -- src/server/marketing/lead-capture.test.ts -t "qualification"`: 1 file passed, 1 selected test passed.
- Build verification caught a TypeScript narrowing issue for `packageScope`; the array filter was changed to an explicit string type guard.
- `git diff --check`: no whitespace errors.
- `npm test`: 21 files passed, 135 tests passed.
- `npm run build`: TypeScript and Vite production build completed.

Decision:

- Treat this as a lead-quality and paid-intent qualification improvement, not validated demand or pricing proof.

Next action:

- Run full verification, push/open PR, production smoke the contact route, then review real launch-package request quality before publishing exact pricing.

## 2026-06-02 Launch Package Pilot Page Slice

Hypothesis:

- If activated or evaluating builders see a clear full launch package pilot offer after free repo brief, readiness score, demand map, and visual explainer pages, they will signal paid intent by requesting a scoped launch package before QuickFork publishes exact pricing.

Lifecycle stage:

- Monetization learning, P4/P5 bridge.

Target user:

- Founders, open-source maintainers, DevRel operators, and design/product leads with a real launch deadline, repeated launch packaging needs, or a review workflow that the free repo brief cannot cover.

Changed surface:

- Added `/product/repository-launch-package-pilot` to the semantic marketing link catalog and CSV inventory.
- Added a bottom-funnel decision page narrative that routes `request_launch_package` to `/contact?intent=launch-package`.
- Updated sitemap and `llms.txt` to expose the productized pilot route.
- Added implementation plan at `docs/superpowers/plans/2026-06-02-launch-package-pilot-page.md`.
- Added research synthesis at `docs/marketing/research/2026-06-02-launch-package-pilot-page.md`.

Primary CTA:

- Request full launch package.

Primary metric:

- `cta_clicked` on `/product/repository-launch-package-pilot`, segmented by `page_view` where `intent_cluster=repository_launch_package_pilot`.

Guardrail:

- Contact form spam or unqualified requests.
- `generation_failed / generation_started` after visitors start the studio flow.
- Unsupported claims in requested launch materials.
- Do not publish exact prices or claims about rankings, revenue, customer acquisition, Product Hunt results, conversion lift, customer count, viral sharing, or guaranteed launch outcomes.

Evidence gap:

- No pricing research, checkout starts, qualified pilot requests, or willingness-to-pay interviews exist yet.

Evidence observed:

- Baseline `npm test`: 21 files passed, 133 tests passed.
- RED route test failed first because `/product/repository-launch-package-pilot` rendered the homepage instead of a product route.
- RED public-growth test failed first because sitemap and `llms.txt` did not include the pilot page.
- `npm test -- src/App.test.tsx -t "repository launch package pilot"`: 1 file passed, 1 selected test passed.
- `npm test -- src/seo/public-growth.test.ts -t "public growth|machine-readable AI context"`: 1 file passed, 6 tests passed.
- `npm test -- src/seo/semantic-links.test.ts`: 1 file passed, 7 tests passed.
- `git diff --check`: no whitespace errors.
- `npm test`: 21 files passed, 134 tests passed.
- `npm run build`: TypeScript and Vite production build completed.

Decision:

- Treat this as a paid-intent learning page, not validated demand. The page makes the full package request measurable while pricing and package shape remain unvalidated.

Next action:

- Run full verification, push/open PR, then smoke-test production route, `llms.txt`, sitemap, and deployed bundle.

## 2026-06-02 Visual Project Explainer Page Slice

Hypothesis:

- If AI/devtool builders can see how QuickFork converts a repository into a visual story map, README hero card, GitHub social preview direction, and deck-ready slide outline, they will understand the project faster and be more likely to start the repo generation flow.

Lifecycle stage:

- Discovery to Activation, with P3 Visual Project Explainer evidence.

Target user:

- AI project builders, DevRel operators, open-source maintainers, and design/product leads preparing public repository launches.

Changed surface:

- Added `/product/github-repo-visual-explainer` to the semantic marketing link catalog and CSV inventory.
- Added `src/marketing/visual-explainer-package.ts` as a typed source-backed package model for story map, README hero card, GitHub social preview, and deck-ready explainer slide outputs.
- Added visual package rendering to `MarketingPage` for routes with `narrative.visualPackage`.
- Added dedicated page narrative, source notes, metadata, sitemap entry, `llms.txt` line, and route tests.
- Added implementation plan at `docs/superpowers/plans/2026-06-02-visual-project-explainer-page.md`.
- Added research synthesis at `docs/marketing/research/2026-06-02-visual-project-explainer-page.md`.

Primary CTA:

- Generate free repo brief.

Primary metric:

- `cta_clicked` on `/product/github-repo-visual-explainer`, segmented by `page_view` where `intent_cluster=github_repo_visual_explainer`.

Guardrail:

- `generation_failed / generation_started`.
- Unsupported visual identity review flags.
- Do not claim rankings, revenue, Product Hunt results, customer acquisition, viral sharing, conversion lift, or willingness to pay.

Evidence gap:

- The route is source-backed but not validated demand. Production route views, CTA clicks, repo submissions, story-map copies, visual preview opens, image downloads, and interviews are still required.

Evidence observed:

- RED model test failed first because `src/marketing/visual-explainer-package.ts` did not exist.
- RED route test failed first because `/product/github-repo-visual-explainer` rendered the homepage rather than a marketing route.
- RED public-growth test failed first because sitemap and `llms.txt` did not include the route.
- `npm test -- src/marketing/visual-explainer-package.test.ts`: 1 file passed, 3 tests passed.
- `npm test -- src/App.test.tsx -t "GitHub repo visual explainer"`: 1 file passed, 1 selected test passed.
- `npm test -- src/seo/public-growth.test.ts -t "public growth|machine-readable AI context"`: 1 file passed, 6 tests passed.
- `npm test -- src/seo/semantic-links.test.ts`: 1 file passed, 7 tests passed.
- `npm test -- src/marketing/visual-explainer-package.test.ts src/App.test.tsx src/seo/public-growth.test.ts src/seo/semantic-links.test.ts`: 4 files passed, 35 tests passed.
- `npm test`: 21 files passed, 133 tests passed.
- `npm run build`: TypeScript build and Vite production build completed.
- `git diff --check`: no whitespace errors.

Decision:

- Treat this as a P3 visual explainer landing-page slice, not validated demand. The page now defines the visual package surface that production measurement can test.

Next action:

- Run full verification, push/open PR, then smoke-test production route, `llms.txt`, sitemap, and deployed bundle.

## 2026-06-02 Launch Package Fit Score Slice

Hypothesis:

- If the full launch package request converts structured qualification fields into a server-side fit score, QuickFork can prioritize monetization interviews and scoped package follow-up before publishing exact prices.

Lifecycle stage:

- Monetization learning.

Target user:

- Founders, open-source maintainers, DevRel operators, and studios that have a launch deadline, launch package scope, human review need, or repeat repository launch workflow.

Changed surface:

- Added `scoreLaunchPackageFit` for deterministic server-side launch package scoring.
- Updated lead capture to compute `packageFit` only for `full_launch_package` requests.
- CRM lead fit and engagement scores now rise for high-fit full launch package qualification.
- CRM activity stores a safe `packageFit` object with score, tier, recommended next step, and reason codes.
- Added implementation plan at `docs/superpowers/plans/2026-06-02-launch-package-fit-score.md`.

Metric:

- `packageFit.score`
- `packageFit.tier`
- `packageFit.recommendedNextStep`

Guardrail:

- Do not send `packageFit` to browser analytics.
- Do not include raw notes, raw repository URL, email, name, secrets, artifact bodies, unsupported customer proof, ranking, revenue, pricing, or guaranteed-launch claims in `packageFit`.
- Do not treat a high score as pricing validation; it is a follow-up prioritization signal.

Evidence gap:

- No qualified pilot-call outcomes, checkout starts, won opportunities, willingness-to-pay interviews, or repeat paid launch workflows exist yet.

Evidence observed:

- RED scorer test failed first because `src/server/marketing/launch-package-fit.ts` did not exist.
- RED lead capture test failed first because full launch package leads still used default `fitScore: 60` and `engagementScore: 70`.
- `npm test -- src/server/marketing/launch-package-fit.test.ts src/server/marketing/lead-capture.test.ts -t "launch package fit|full launch package qualification"`: 2 files passed, 2 selected tests passed.
- `npm test -- src/server/marketing/launch-package-fit.test.ts src/server/marketing/lead-capture.test.ts`: 2 files passed, 6 tests passed.
- `npm test`: 23 files passed, 142 tests passed.
- `npm run build`: TypeScript build and Vite production build completed.
- `git diff --check`: no whitespace errors.
- PR #22 merged into `main` at merge commit `d9d0c9ef1e7be8f61f90b585239bd13be3575065`.
- Main CI/CD run `26824999903` completed successfully: `Test and build` passed and `Deploy production to Vercel` passed.
- Production smoke passed: `https://seekersai.com/contact?intent=launch-package` returned HTTP 200.
- Production API smoke passed without creating lead data: `GET https://seekersai.com/api/lead-capture` returned HTTP 405 with `METHOD_NOT_ALLOWED`.

Decision:

- Treat package fit score as a CRM prioritization and product-learning signal, not validated paid demand or a public pricing claim.

Next action:

- Review actual full launch package lead quality before changing public package or pricing language.

## 2026-06-02 Source-Backed And README Product Page Refresh Slice

Hypothesis:

- If `/product/source-backed-launch-assets` and `/product/readme-marketing-cards` explain QuickFork's source-backed repo-to-launch package workflow with unique definitions, target users, workflows, FAQs, source notes, and AI-readable descriptions, search and AI-search visitors will understand the product wedge before starting the generator.

Lifecycle stage:

- Discovery and Validation.

Target user:

- Product marketers, DevRel operators, AI project builders, open-source maintainers, design leads, and technical founders preparing repository-backed launch assets.

Changed surface:

- `/product/source-backed-launch-assets`
- `/product/readme-marketing-cards`
- `src/marketing/page-content.ts`
- `public/llms.txt`
- `src/App.test.tsx`
- `src/seo/public-growth.test.ts`
- `src/seo/semantic-links.test.ts`
- `docs/marketing/research/2026-06-02-source-backed-readme-page-refresh.md`

Metric:

- `page_view` and `cta_clicked` by `intent_cluster`, followed by repo URL submissions, generation completions, and artifact exports.

Guardrail:

- Do not claim rankings, revenue, customer count, Product Hunt outcomes, conversion lift, exact pricing, or willingness to pay.
- Keep browser analytics free of email, raw repo text, tokens, secrets, raw artifact bodies, pricing claims, rankings, revenue, or unsupported proof.

Evidence observed:

- RED App tests failed first because both product routes still used fallback generic copy instead of source-backed/README-specific content.
- RED public-growth test failed first because `public/llms.txt` still exposed generic fallback descriptions.
- RED semantic-link tests failed first because `getMarketingPageDescription()` still returned fallback descriptions for both intent clusters.
- GREEN focused verification passed: `npm test -- src/App.test.tsx src/seo/public-growth.test.ts src/seo/semantic-links.test.ts -t "source-backed launch assets|README marketing cards|machine-readable AI context|semantic marketing"` returned 3 files passed and 15 selected tests passed.
- Targeted verification passed: `npm test -- src/App.test.tsx src/seo/public-growth.test.ts src/seo/semantic-links.test.ts` returned 3 files passed and 41 tests passed.
- Full verification passed: `npm test` returned 23 files passed and 146 tests passed.
- Build verification passed: `npm run build` completed TypeScript build and Vite production build.
- Diff hygiene passed: `git diff --check` returned no whitespace errors.
- PR #24 merged into `main` at merge commit `0c4c0d5df0582850b62ac267cf838bf9eddee480`.
- Main CI/CD run `26827158704` completed successfully: `Test and build` passed and `Deploy production to Vercel` passed.
- Production route smoke passed: `https://seekersai.com/product/source-backed-launch-assets` returned HTTP 200.
- Production route smoke passed: `https://seekersai.com/product/readme-marketing-cards` returned HTTP 200.
- Production `llms.txt` contains the refreshed Source Backed Launch Assets and README Marketing Cards descriptions.
- Production sitemap contains both product URLs.
- Production bundle `/assets/index-B6QRBO8n.js` contains `Source-backed launch assets are reviewable`, `README marketing cards are README-first`, `source_backed_launch_assets`, and `readme_marketing_cards`.

Decision:

- Treat this as a P1 landing page quality and AI/GEO extraction improvement, not validated demand. The pages are now suitable for production smoke, Search Console review, AI-answer checks, and interview follow-up.

Next action:

- Add both routes to the next AI-answer and Search Console baseline review, then compare CTA and generation behavior against `/product/github-repo-to-launch-package`.

## 2026-06-02 Page Intent Validation Expansion Slice

Hypothesis:

- If `/product/source-backed-launch-assets` and `/product/readme-marketing-cards` address narrower jobs than the generic GitHub repo launch package page, they should produce clearer CTA and generation signals without increasing generation failure or unsupported-claim risk.

Lifecycle stage:

- Validation.

Target user:

- Product marketers and DevRel operators validating source-backed launch assets.
- Design leads and open-source maintainers validating README marketing cards.

Changed surface:

- `docs/marketing/data/growth-experiment-registry.csv`
- `docs/marketing/data/growth-experiment-evidence.csv`
- `src/marketing/growth-experiments.ts`
- `src/marketing/growth-experiments.test.ts`
- `src/marketing/growth-experiment-report.ts`
- `src/marketing/growth-experiment-report.test.ts`
- `docs/superpowers/plans/2026-06-02-page-intent-validation-expansion.md`
- `docs/marketing/research/2026-06-02-source-backed-readme-page-refresh.md`

Metric:

- `cta_clicked_per_page_view` for `generate_launch_card`, comparing each variant route against `/product/github-repo-to-launch-package`.

Guardrail:

- `generation_failed_per_generation_started`.
- Do not claim rankings, revenue, customer count, Product Hunt outcomes, conversion lift, exact pricing, AI citation wins, Search Console demand, or willingness to pay.
- Keep evidence rows free of email, raw repo text, tokens, secrets, raw artifact bodies, pricing claims, rankings, revenue, customers, or unsupported proof.

Evidence observed:

- Baseline `npm test` passed before changes: 23 files passed and 146 tests passed.
- RED registry test failed first because `2026_q2_source_backed_assets_intent_validation` did not exist.
- RED evidence test failed first because pending evidence rows for the source-backed and README experiments did not exist.
- GREEN focused verification passed: `npm test -- src/marketing/growth-experiments.test.ts src/marketing/growth-experiment-report.test.ts` returned 2 files passed and 13 tests passed.
- Full verification passed: `npm test` returned 23 files passed and 149 tests passed.
- Build verification passed: `npm run build` completed TypeScript build and Vite production build.
- Diff hygiene passed: `git diff --check` returned no whitespace errors.
- PR #26 merged into `main` at merge commit `a0f1abcc0d46ae3579366f812afd3df1826a58d1`.
- Main CI/CD run `26829360409` completed successfully: `Test and build` passed and `Deploy production to Vercel` passed.
- Production route smoke passed: `https://seekersai.com/product/source-backed-launch-assets` returned HTTP 200.
- Production route smoke passed: `https://seekersai.com/product/readme-marketing-cards` returned HTTP 200.
- Production sitemap still contains both product URLs.
- Production `llms.txt` still contains both Source Backed Launch Assets and README Marketing Cards descriptions.
- Remote branch `feature/page-intent-validation-expansion` was deleted after merge.

Decision:

- Treat this as a formal validation framework expansion, not validated demand. The two product pages now have pending experiment and evidence rows that define what data must be collected before comparing page intent quality.

Next action:

- Collect 14 days of GA4 page view, CTA click, generation start, and generation failure data for the two new experiments, plus Search Console query baselines and AI-answer audits.

## 2026-06-02 Search And AI Baseline Contract Slice

Hypothesis:

- If every active page-intent validation experiment has a fixed Search Console and AI-answer prompt contract, QuickFork can collect comparable evidence instead of ad hoc AI/search notes.

Lifecycle stage:

- Discovery to Validation.

Target user:

- Product marketers and DevRel operators evaluating source-backed launch assets.
- Design leads and open-source maintainers evaluating README marketing cards.

Changed surface:

- `docs/marketing/data/search-ai-baseline-prompts.csv`
- `src/marketing/search-ai-baseline.ts`
- `src/marketing/search-ai-baseline.test.ts`
- `docs/superpowers/plans/2026-06-02-search-ai-baseline-contract.md`
- `docs/marketing/research/2026-06-02-source-backed-readme-page-refresh.md`

Metric:

- Search Console query impressions, clicks, CTR, and page mapping for each control and variant route.
- AI-answer mention, citation, source URL, and accuracy status across ChatGPT search, Perplexity, Google AI Overview, Gemini, and Claude.

Guardrail:

- AI/search audit notes must flag invented pricing, rankings, customer count, revenue, conversion lift, Product Hunt outcomes, guaranteed launch claims, and unearned AI citation wins.
- Do not treat prompt coverage as search demand or AI visibility evidence.

Evidence observed:

- Baseline `npm test` passed before changes: 23 files passed and 149 tests passed.
- RED test failed first because `src/marketing/search-ai-baseline.ts` did not exist.
- GREEN focused verification passed: `npm test -- src/marketing/search-ai-baseline.test.ts` returned 1 file passed and 5 tests passed.

Decision:

- Treat this as a P0 measurement contract. It makes the pending Search Console and AI-answer evidence collection executable, but no query demand or AI citation has been validated yet.

Next action:

- Run the manual baseline using the four prompt rows, then fill evidence rows only after real Search Console exports and AI-answer observations exist.

## 2026-06-03 Launch Materials Map Product Activation Slice

Hypothesis:

- If QuickFork adds a source-backed launch materials map to the generated brief and gives the same intent a crawlable product route, AI project builders can understand which launch material belongs on README, social, deck, visual, and outreach channels before requesting a full package.

Lifecycle stage:

- Activation and Validation.

Target user:

- AI project builders preparing a cold-start repository launch.
- Open-source maintainers who need source-backed README, social, and visual materials.
- DevRel operators and product marketers who need traceable channel assets.
- Technical founders evaluating whether a reviewed launch package is worth requesting.

Changed surface:

- `src/server/generation/types.ts`
- `src/server/generation/launch-brief.ts`
- `src/components/landing/HeroSection.tsx`
- `src/lib/analytics.ts`
- `src/styles/app.css`
- `src/marketing/link-catalog.ts`
- `src/marketing/page-content.ts`
- `public/sitemap.xml`
- `public/llms.txt`
- `docs/marketing/data/semantic-link-inventory.csv`
- `docs/superpowers/plans/2026-06-03-launch-materials-map.md`
- `docs/marketing/research/2026-06-03-launch-materials-map.md`

Metric:

- Primary: `launch_materials_map_copied`.
- Supporting: page views, CTA clicks, repo submissions, generation completions, artifact copy/download events, and full launch package requests by `intent_cluster=github_repo_launch_materials_map`.

Guardrail:

- Do not claim search placement, financial outcomes, adoption, Product Hunt outcomes, exact pricing, automatic publishing, or willingness to pay.
- Do not send raw README text, artifact bodies, source notes, secrets, tokens, email, or private launch notes to browser analytics.

Evidence observed:

- Baseline `npm test` passed before changes: 24 test files, 158 tests passed.
- RED generation test failed first because the launch brief did not include `launchMaterialsMap` or a `materials_map` artifact.
- GREEN focused generation verification passed: `npm test -- src/server/generation/generation.test.ts -t "source-backed free repo launch brief"`.
- GREEN focused UI verification passed: `npm test -- src/App.test.tsx -t "Hero generator"`.
- RED route tests failed first because `/product/github-repo-launch-materials-map` was not in the marketing catalog, sitemap, or `llms.txt`.
- GREEN route verification passed: `npm test -- src/App.test.tsx -t "launch materials map"`.
- GREEN semantic-link verification passed: `npm test -- src/seo/semantic-links.test.ts -t "launch materials map|canonical page paths"`.
- GREEN public-growth verification passed: `npm test -- src/seo/public-growth.test.ts -t "sitemap|machine-readable AI context"`.
- Full verification passed: `npm test` returned 24 files passed and 160 tests passed.
- Build verification passed: `npm run build` completed TypeScript build and Vite production build.
- Diff hygiene passed: `git diff --check` returned no whitespace errors.

Decision:

- Treat this as a product activation and validation slice, not validated demand. The materials map is ready for production smoke, Search Console review, AI-answer checks, and artifact-behavior comparison.

Next action:

- Run full verification, merge, production smoke, then compare `/product/github-repo-launch-materials-map` behavior against `/product/github-repo-to-launch-package` and `/product/cold-start-launch-materials` over a 14-day window.

## 2026-06-03 Launch Materials Map Validation Contract Slice

Hypothesis:

- If QuickFork compares the broad `/product/cold-start-launch-materials` route against the narrower `/product/github-repo-launch-materials-map` route, the team can learn whether AI project builders value source-backed channel planning enough to click the CTA, complete generation, copy the materials map, export artifacts, or request a reviewed launch package.

Lifecycle stage:

- Validation, with activation evidence required.

Target user:

- AI project builders preparing cold-start GitHub launches.
- Open-source maintainers and DevRel/product-marketing operators who need source-backed planning for README, social, deck, visual, and outreach materials.

Changed surface:

- `src/marketing/growth-experiments.ts`
- `src/marketing/growth-experiments.test.ts`
- `src/marketing/growth-experiment-report.ts`
- `src/marketing/growth-experiment-report.test.ts`
- `src/marketing/search-ai-baseline.ts`
- `src/marketing/search-ai-baseline.test.ts`
- `docs/marketing/data/growth-experiment-registry.csv`
- `docs/marketing/data/growth-experiment-evidence.csv`
- `docs/marketing/data/search-ai-baseline-prompts.csv`
- `docs/marketing/research/2026-06-03-launch-materials-map.md`
- `docs/superpowers/plans/2026-06-03-launch-materials-map-validation-contract.md`

Metric:

- Primary: `cta_clicked_per_page_view`.
- Guardrail: `generation_failed_per_generation_started`.
- Required activation signal: `launch_materials_map_copied`.
- Required discovery evidence: Search Console query baseline and AI-answer audit.

Guardrail:

- Do not treat a published page, prompt coverage, or a copied artifact as validated demand.
- Do not claim pricing, rankings, revenue, customer count, conversion lift, Product Hunt outcome, guaranteed launch results, or validated AI citation.
- Keep evidence rows free of email, raw repo text, tokens, secrets, raw artifact bodies, private notes, or unsupported proof.

Evidence observed:

- Baseline `npm test` passed before changes: 24 test files, 160 tests passed.
- RED registry test failed first because `2026_q2_launch_materials_map_intent_validation` did not exist.
- RED evidence test failed first because no pending evidence row existed for the launch materials map experiment.
- RED Search/AI test failed first because no control or variant baseline rows existed for the launch materials map experiment.
- GREEN focused registry verification passed: `npm test -- src/marketing/growth-experiments.test.ts -t "launch materials map|mirrors|references published|decision-ready"`.
- GREEN focused evidence verification passed: `npm test -- src/marketing/growth-experiment-report.test.ts -t "launch materials map|evidence row|mirrors|registry experiment|privacy-safe"`.
- GREEN focused Search/AI verification passed: `npm test -- src/marketing/search-ai-baseline.test.ts -t "launch materials map|covers every|mirrors|published|claim-safe"`.
- Related verification passed: `npm test -- src/marketing/growth-experiments.test.ts src/marketing/growth-experiment-report.test.ts src/marketing/search-ai-baseline.test.ts` returned 3 files passed and 23 tests passed.
- Full verification passed: `npm test` returned 24 files passed and 163 tests passed.
- Build verification passed: `npm run build` completed TypeScript build and Vite production build.
- Diff hygiene passed: `git diff --check` returned no whitespace errors.

Decision:

- Treat this as a P0 measurement contract for the launch materials map slice, not a demand result. The contract defines what evidence must be collected before deciding whether the channel-map product angle deserves more landing page, packaging, or paid-offer work.

Next action:

- Run full verification, merge, production smoke, then use `2026_q2_launch_materials_map_intent_validation` for 14 days of GA4, Search Console, and AI-answer evidence collection.
