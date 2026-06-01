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
