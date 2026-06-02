# Open Source Launch Checklist Resource Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Turn `/resources/open-source-launch-checklist` from a generic catalog shell into a source-backed checklist resource page for open-source maintainers and AI/devtool builders preparing a public repository launch.

**Architecture:** Keep the route catalog unchanged because the page is already published in `marketingLinks`. Add a dedicated narrative in `src/marketing/page-content.ts`, render an optional last-updated field in `MarketingPage`, and lock the content with route and public-growth tests. Update repo docs and the Obsidian mirror so the growth decision remains traceable.

**Tech Stack:** React, TypeScript, Vitest, Testing Library, QuickFork marketing catalog, static `sitemap.xml` and `llms.txt` generated from `src/seo/seo-assets.ts`.

---

## Growth Contract

- Hypothesis: If open-source maintainers receive a source-backed launch checklist instead of a generic resource shell, they can see QuickFork as a useful early launch-planning tool and are more likely to request the checklist or generate a repo brief.
- Lifecycle stage: Discovery to Validation.
- Target user: Open-source maintainers and AI/devtool repo builders preparing a public launch.
- Primary CTA: `request_checklist`.
- Primary metric: `lead_magnet_requested / resource_page_viewed` for `/resources/open-source-launch-checklist`.
- Guardrail metric: Unsupported public claims, especially rankings, revenue, customer count, Product Hunt success, or guaranteed growth.
- Evidence gap: Production page views, checklist requests, lead quality, follow-up interviews, and AI-search citation behavior are not yet validated.

## Source Notes

- Open Source Guides finding users: https://opensource.guide/finding-users/
- GitHub Docs About READMEs: https://docs.github.com/repositories/managing-your-repositorys-settings-and-features/customizing-your-repository/about-readmes
- GitHub Docs social preview: https://docs.github.com/en/repositories/managing-your-repositorys-settings-and-features/customizing-your-repository/customizing-your-repositorys-social-media-preview?apiVersion=2022-11-28
- Product Hunt preparing for launch: https://www.producthunt.com/launch/preparing-for-launch

## File Map

- Modify: `src/App.test.tsx`
  - Add the RED route test proving the checklist page has unique source-backed content, source links, last-updated copy, CTA, metadata, and analytics.
- Modify: `src/marketing/page-content.ts`
  - Add optional `lastUpdated` to `MarketingPageNarrative`.
  - Add the `open_source_launch_checklist` dedicated narrative.
  - Add a dedicated headline and meta description for the page.
- Modify: `src/components/marketing/MarketingPage.tsx`
  - Render optional `Last updated` copy on strategic pages.
- Modify: `src/seo/public-growth.test.ts`
  - Lock the route in `llms.txt` with the custom title/description.
- Modify: `src/seo/seo-assets.ts`
  - Update `seoAssetLastModified` to `2026-06-02`.
- Modify: `public/sitemap.xml`
  - Refresh generated lastmod values after `seoAssetLastModified`.
- Modify: `public/llms.txt`
  - Refresh generated resource description for the checklist page.
- Create: `docs/marketing/research/2026-06-02-open-source-launch-checklist.md`
  - Document the growth contract, source evidence, claim limits, and next validation step.
- Modify: `docs/plans/2026-06-01-quickfork-growth-lifecycle-prioritization.md`
  - Append this slice to the lifecycle plan.
- Modify: `/Users/moose/Documents/Moose's Birth ID/QuickFork/SEO Growth/2026-06-01 QuickFork Cold Start Launch Growth Iteration.md`
  - Mirror the strategy decision and validation status.

## Tasks

### Task 1: Write RED Route And Public-Growth Tests

**Files:**
- Modify: `src/App.test.tsx`
- Modify: `src/seo/public-growth.test.ts`

- [ ] **Step 1: Add route test**

Add one test named `renders the open-source launch checklist as a source-backed resource route`. It should navigate to `/resources/open-source-launch-checklist?utm_source=x`, render `App`, and assert:

- H1 contains `Open Source Launch Checklist`.
- The definition contains `source-backed README`, `social preview`, `Product Hunt`, `deck`, and `outreach`.
- Target user includes `Open-source maintainers and AI/devtool builders`.
- Workflow includes `README trust pass`, `Repository preview pass`, `Audience and feedback pass`, `Launch asset pass`, and `Post-launch learning pass`.
- Source links include Open Source Guides, GitHub Docs About READMEs, GitHub Docs social preview, and Product Hunt launch guide.
- Page includes `Last updated: June 2, 2026`.
- Primary CTA says `Request checklist` and links to `/#studio`.
- Analytics include `resource_page_viewed` with `resource_slug: "open-source-launch-checklist"`, `resource_type: "guide"`, `buyer_stage: "awareness"`, `intent_cluster: "open_source_launch_checklist"`, and `utm_source: "x"`.
- Serialized analytics do not contain `ranking`, `revenue`, `customers`, `guaranteed`, `token`, `secret`, or `api_key`.

- [ ] **Step 2: Add public-growth test assertions**

Extend the `llms.txt` test to assert:

- `https://seekersai.com/resources/open-source-launch-checklist`
- `Open Source Launch Checklist`
- `source-backed README, social preview, Product Hunt, deck, outreach, and post-launch learning`

- [ ] **Step 3: Run RED tests**

Run:

```bash
npm test -- src/App.test.tsx -t "open-source launch checklist"
npm test -- src/seo/public-growth.test.ts -t "machine-readable AI context"
```

Expected: both fail because the page still uses the generic narrative and the static AI context has not been refreshed.

### Task 2: Implement Checklist Narrative And Last-Updated Rendering

**Files:**
- Modify: `src/marketing/page-content.ts`
- Modify: `src/components/marketing/MarketingPage.tsx`

- [ ] **Step 1: Add optional narrative field**

Add `lastUpdated?: string` to `MarketingPageNarrative`.

- [ ] **Step 2: Render the optional date**

In `MarketingPage`, render:

```tsx
{narrative.lastUpdated ? <p className="marketingUpdated">Last updated: {narrative.lastUpdated}</p> : null}
```

near the definition block so AI/search visitors and humans can see freshness without changing the catalog contract.

- [ ] **Step 3: Add dedicated checklist narrative**

Add `open_source_launch_checklist` to `pageNarratives` with:

- 40-60 word definition.
- Target user exactly naming open-source maintainers and AI/devtool builders.
- JTBD around preparing public README, social preview, launch channels, and follow-up.
- Evidence boundary that labels this page as public-source discovery evidence, not proof of demand or pricing.
- Benefits for README trust, social preview, audience feedback, launch package planning, and post-launch learning.
- Workflow with the five pass names from Task 1.
- FAQ covering what the checklist is, who should use it, what QuickFork can generate, and what remains unvalidated.
- Source notes for the four sources in the plan.
- `lastUpdated: "June 2, 2026"`.

- [ ] **Step 4: Add dedicated headline and description**

Add custom branches:

- Headline: `Open Source Launch Checklist for source-backed repository launches.`
- Description: `QuickFork maps open source launch checklist demand into source-backed README, social preview, Product Hunt, deck, outreach, and post-launch learning steps for public GitHub repository launches.`

### Task 3: Refresh Static SEO/GEO Assets

**Files:**
- Modify: `src/seo/seo-assets.ts`
- Modify: `public/sitemap.xml`
- Modify: `public/llms.txt`

- [ ] **Step 1: Update `seoAssetLastModified`**

Set `seoAssetLastModified` to `2026-06-02`.

- [ ] **Step 2: Regenerate public assets manually from expected render output**

Use the existing `renderSitemapXml()` and `renderLlmsTxt()` contract as the authority. Refresh `public/sitemap.xml` lastmod values and the checklist line in `public/llms.txt` so `public-growth.test.ts` stays aligned.

### Task 4: Document The Growth Iteration

**Files:**
- Create: `docs/marketing/research/2026-06-02-open-source-launch-checklist.md`
- Modify: `docs/plans/2026-06-01-quickfork-growth-lifecycle-prioritization.md`
- Modify: `/Users/moose/Documents/Moose's Birth ID/QuickFork/SEO Growth/2026-06-01 QuickFork Cold Start Launch Growth Iteration.md`

- [ ] **Step 1: Create research note**

Include the growth contract, public source evidence, target-user interpretation, CTA/metric, guardrail, evidence gap, and next validation step.

- [ ] **Step 2: Append lifecycle plan section**

Add a `2026-06-02 Open Source Launch Checklist Resource Slice` section that records the changed surface and states the strategy is still a hypothesis until production lead/analytics evidence exists.

- [ ] **Step 3: Mirror in Obsidian**

Append the same decision fields to the dated QuickFork Obsidian strategy note.

### Task 5: Verify And Prepare PR

**Files:**
- Check all modified files.

- [ ] **Step 1: Run focused tests**

```bash
npm test -- src/App.test.tsx -t "open-source launch checklist"
npm test -- src/App.test.tsx src/seo/public-growth.test.ts src/seo/semantic-links.test.ts
```

- [ ] **Step 2: Run broad verification**

```bash
npm test
npm run build
git diff --check
```

- [ ] **Step 3: Prepare integration**

Commit only this slice, push `feature/open-source-launch-checklist`, create a PR into `main`, and document the feature points in Chinese.

## Self-Review

- Spec coverage: The plan implements the strategic page requirements in `AGENTS.md`, the P1 resource page in the lifecycle plan, AI SEO extractability, and the repo + Obsidian logging loop.
- Placeholder scan: No `TBD`, `TODO`, or unspecified implementation steps remain.
- Type consistency: The new `lastUpdated` field is optional and only consumed through `MarketingPageNarrative`, so generic catalog routes remain compatible.
