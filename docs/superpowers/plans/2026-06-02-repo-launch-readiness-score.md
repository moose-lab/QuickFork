# Repo Launch Readiness Score Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Turn `/tools/github-repo-launch-readiness-score` from a generic marketing shell into a source-backed free tool page that explains how QuickFork scores repository launch readiness before generating a launch package.

**Architecture:** Add a typed launch-readiness rubric in `src/marketing/launch-readiness-score.ts`, render it through the existing `MarketingPage` narrative model, and track `tool_page_viewed` events for the free-tool funnel. Keep the CTA pointed to the studio because the MVP is a public scorecard/tool page rather than a separate calculator UI.

**Tech Stack:** React, TypeScript, Vitest, Testing Library, QuickFork marketing catalog, static `llms.txt`, and existing browser analytics wrapper.

---

## Growth Contract

- Hypothesis: If a founder or maintainer can evaluate launch readiness through a source-backed scorecard, they will better understand why QuickFork asks for a repo URL and will be more likely to start the free studio flow.
- Lifecycle stage: Discovery to Activation.
- Target user: Founders, open-source maintainers, and AI/devtool builders preparing a public GitHub repository launch.
- Primary CTA: `start_free_tool`.
- Primary metric: `cta_clicked` where `cta_id=start_free_tool`, segmented by prior `tool_page_viewed` on `/tools/github-repo-launch-readiness-score`.
- Guardrail metric: `generation_failed / generation_started` after visitors start the studio flow.
- Evidence gap: Production tool page views, CTA clicks, repo submissions, generated package completions, and interviews are not yet validated.

## Source Notes

- GitHub Docs About READMEs: https://docs.github.com/repositories/managing-your-repositorys-settings-and-features/customizing-your-repository/about-readmes
- GitHub Docs social preview: https://docs.github.com/en/repositories/managing-your-repositorys-settings-and-features/customizing-your-repository/customizing-your-repositorys-social-media-preview?apiVersion=2022-11-28
- Open Source Guides finding users: https://opensource.guide/finding-users/
- Product Hunt launch guide: https://www.producthunt.com/launch/preparing-for-launch

## File Map

- Create: `src/marketing/launch-readiness-score.ts`
  - Own the 100-point rubric, category source URLs, lifecycle mapping, activation metrics, and claim boundary.
- Create: `src/marketing/launch-readiness-score.test.ts`
  - Lock total points, source-backed categories, lifecycle mapping, and claim hygiene.
- Modify: `src/marketing/page-content.ts`
  - Add `scorecard` to `MarketingPageNarrative`.
  - Add dedicated `launch_readiness_score` narrative, headline, and meta description.
- Modify: `src/components/marketing/MarketingPage.tsx`
  - Render optional scorecard categories.
  - Track `tool_page_viewed` for tool routes.
- Modify: `src/styles/app.css`
  - Add compact scorecard layout styles.
- Modify: `src/App.test.tsx`
  - Add route test for source-backed launch readiness tool page and analytics.
- Modify: `src/seo/public-growth.test.ts`
  - Assert the `llms.txt` description exposes the readiness score as a source-backed tool.
- Modify: `public/llms.txt`
  - Refresh the readiness score line to match the dedicated meta description.
- Create: `docs/marketing/research/2026-06-02-repo-launch-readiness-score.md`
  - Document the growth contract, source evidence, score categories, and validation status.
- Modify: `docs/plans/2026-06-01-quickfork-growth-lifecycle-prioritization.md`
  - Append this free-tool slice.
- Modify: `/Users/moose/Documents/Moose's Birth ID/QuickFork/SEO Growth/2026-06-01 QuickFork Cold Start Launch Growth Iteration.md`
  - Mirror the strategy update locally.

## Tasks

### Task 1: RED Model And Route Tests

**Files:**
- Create: `src/marketing/launch-readiness-score.test.ts`
- Modify: `src/App.test.tsx`
- Modify: `src/seo/public-growth.test.ts`

- [x] **Step 1: Add model tests**

Create `src/marketing/launch-readiness-score.test.ts` with tests that expect:

- Total score is 100.
- Category ids are `readme_trust`, `repository_preview`, `audience_feedback`, `launch_assets`, and `measurement_follow_up`.
- Each category has points, source URL, QuickFork output, lifecycle stage, and activation metric.
- Source URLs include GitHub README docs, GitHub social preview docs, Open Source Guides, and Product Hunt launch guide.
- Serialized rubric does not contain `ranking`, `revenue`, `customers`, `guaranteed`, or `viral`.

- [x] **Step 2: Add route test**

Add `renders the repo launch readiness score as a source-backed free tool route` to `src/App.test.tsx`. It should navigate to `/tools/github-repo-launch-readiness-score?utm_source=product_hunt` and assert:

- H1 contains `GitHub Repo Launch Readiness Score`.
- Definition contains `100-point source-backed scorecard`.
- Page shows `100 total points`.
- Scorecard categories include `README trust`, `Repository preview`, `Audience and feedback`, `Launch assets`, and `Measurement and follow-up`.
- Source links include GitHub README docs, GitHub social preview docs, Open Source Guides, and Product Hunt launch guide.
- `Last updated: June 2, 2026` is rendered.
- Primary CTA says `Start free tool` and links to `/#studio`.
- `tool_page_viewed` event includes `tool_slug`, `tool_type=scorecard`, `buyer_stage=consideration`, `page_type=tool`, `intent_cluster=launch_readiness_score`, and `utm_source=product_hunt`.
- Analytics payload does not contain email, token, secret, api_key, ranking, revenue, customers, guaranteed, or viral.

- [x] **Step 3: Add public-growth test assertion**

Extend the `llms.txt` test to assert:

- `https://seekersai.com/tools/github-repo-launch-readiness-score`
- `GitHub Repo Launch Readiness Score`
- `100-point source-backed readiness score for README trust, repository preview, audience feedback, launch assets, and follow-up measurement`

- [x] **Step 4: Run RED tests**

```bash
npm test -- src/marketing/launch-readiness-score.test.ts
npm test -- src/App.test.tsx -t "repo launch readiness score"
npm test -- src/seo/public-growth.test.ts -t "machine-readable AI context"
```

Expected: fail because the rubric module, route narrative, scorecard rendering, and `llms.txt` line do not exist yet.

### Task 2: Implement Scorecard Model And Route Rendering

**Files:**
- Create: `src/marketing/launch-readiness-score.ts`
- Modify: `src/marketing/page-content.ts`
- Modify: `src/components/marketing/MarketingPage.tsx`
- Modify: `src/styles/app.css`

- [x] **Step 1: Add typed rubric**

Create a 100-point rubric with five categories:

- README trust: 25 points.
- Repository preview: 15 points.
- Audience and feedback: 20 points.
- Launch assets: 25 points.
- Measurement and follow-up: 15 points.

- [x] **Step 2: Add page narrative**

Add `launch_readiness_score` to `pageNarratives` with a 40-60 word definition, target user, JTBD, evidence boundary, benefits, workflow, FAQ, source notes, `lastUpdated`, and the scorecard.

- [x] **Step 3: Add dedicated headline and description**

Headline:

```text
GitHub Repo Launch Readiness Score for source-backed pre-launch reviews.
```

Description:

```text
QuickFork maps github repo launch readiness score demand into a 100-point source-backed readiness score for README trust, repository preview, audience feedback, launch assets, and follow-up measurement.
```

- [x] **Step 4: Render optional scorecard**

Render a `Launch readiness rubric` section in `MarketingPage` when `narrative.scorecard` exists.

- [x] **Step 5: Track tool route views**

Add `tool_page_viewed` tracking for `link.pageType === "tool"` with non-PII route metadata.

### Task 3: Refresh AI-Readable Public Context

**Files:**
- Modify: `public/llms.txt`

- [x] **Step 1: Refresh readiness score line**

Update the tool line to match `getMarketingPageDescription()`.

### Task 4: Document Growth Iteration

**Files:**
- Create: `docs/marketing/research/2026-06-02-repo-launch-readiness-score.md`
- Modify: `docs/plans/2026-06-01-quickfork-growth-lifecycle-prioritization.md`
- Modify: `/Users/moose/Documents/Moose's Birth ID/QuickFork/SEO Growth/2026-06-01 QuickFork Cold Start Launch Growth Iteration.md`

- [x] **Step 1: Create research note**

Include the growth contract, sources, scorecard categories, metric, guardrail, evidence gap, and next validation step.

- [x] **Step 2: Append lifecycle section**

Record the slice as a free-tool Discovery-to-Activation bridge.

- [x] **Step 3: Mirror in Obsidian**

Append the same decision fields to the local strategy mirror.

### Task 5: Verify And Publish

**Files:**
- Check all modified files.

- [x] **Step 1: Run focused tests**

```bash
npm test -- src/marketing/launch-readiness-score.test.ts src/App.test.tsx src/seo/public-growth.test.ts src/seo/semantic-links.test.ts
```

- [x] **Step 2: Run full verification**

```bash
npm test
npm run build
git diff --check
```

- [ ] **Step 3: Publish**

Use GitHub API commit flow if normal git push is unavailable. Create PR into `main`, merge after CI passes, and production-smoke the route, `llms.txt`, sitemap, and bundle.

Observed verification:

- `npm test -- src/lib/analytics.test.ts src/App.test.tsx -t "tool page views|repo launch readiness score"`: 2 files passed, 2 selected tests passed.
- `npm test`: 20 files passed, 129 tests passed.
- `npm run build`: TypeScript and Vite production build completed.
- `git diff --check`: no whitespace errors.

## Self-Review

- Spec coverage: The plan turns a published generic tool route into a useful source-backed free tool page, adds measurement, keeps proof limits clear, and updates repo plus Obsidian docs.
- Placeholder scan: No TBD/TODO placeholders remain.
- Type consistency: `scorecard` is optional on `MarketingPageNarrative`, so existing routes remain compatible.
