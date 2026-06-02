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
