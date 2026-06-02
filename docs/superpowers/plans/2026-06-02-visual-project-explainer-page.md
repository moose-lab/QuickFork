# Visual Project Explainer Page Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Publish a source-backed `/product/github-repo-visual-explainer` page that defines QuickFork's visual project explainer package for README, GitHub social preview, story-map, and deck-ready launch surfaces.

**Architecture:** Add a typed visual-explainer package model in `src/marketing/visual-explainer-package.ts`, attach it to a dedicated `MarketingPageNarrative`, and render it through the existing marketing page shell. Register the route in the semantic link catalog and SEO assets so sitemap, `llms.txt`, metadata, and analytics all expose the same growth contract.

**Tech Stack:** React, TypeScript, Vitest, Testing Library, QuickFork semantic marketing catalog, static sitemap/`llms.txt`, and existing browser analytics wrapper.

---

## Growth Contract

- Hypothesis: If AI/devtool builders can see how QuickFork converts a repository into a visual story map, README hero card, GitHub social preview direction, and deck-ready slide outline, they will understand the project faster and be more likely to start the repo generation flow.
- Lifecycle stage: Discovery to Activation, with P3 Visual Project Explainer evidence.
- Target user: AI project builders, DevRel operators, open-source maintainers, and design/product leads preparing public repository launches.
- Primary CTA: `generate_launch_card` (`Generate free repo brief`).
- Primary metric: `cta_clicked` on `/product/github-repo-visual-explainer`, segmented by `page_view` where `intent_cluster=github_repo_visual_explainer`.
- Guardrail metric: `generation_failed / generation_started` plus unsupported visual identity review flags.
- Evidence gap: Production route views, CTA clicks, repo submissions, story-map copies, visual preview opens, image downloads, and interviews are not yet validated.

## Source Notes

- GitHub Docs About READMEs: https://docs.github.com/repositories/managing-your-repositorys-settings-and-features/customizing-your-repository/about-readmes
- GitHub Docs social preview: https://docs.github.com/en/repositories/managing-your-repositorys-settings-and-features/customizing-your-repository/customizing-your-repositorys-social-media-preview?apiVersion=2022-11-28
- Open Source Guides finding users: https://opensource.guide/finding-users/
- Product Hunt launch guide: https://www.producthunt.com/launch/preparing-for-launch

## File Map

- Create: `src/marketing/visual-explainer-package.ts`
  - Own the visual package title, claim boundary, output formats, source URLs, lifecycle stage, QuickFork surface, and activation metric.
- Create: `src/marketing/visual-explainer-package.test.ts`
  - Lock output ids, source URLs, activation metrics, and claim hygiene.
- Modify: `src/marketing/link-catalog.ts`
  - Register `/product/github-repo-visual-explainer`.
- Modify: `docs/marketing/data/semantic-link-inventory.csv`
  - Mirror the route for campaign attribution.
- Modify: `src/marketing/page-content.ts`
  - Add `visualPackage` to `MarketingPageNarrative`.
  - Add dedicated `github_repo_visual_explainer` narrative, headline, and meta description.
- Modify: `src/components/marketing/MarketingPage.tsx`
  - Render optional visual explainer package cards.
- Modify: `src/styles/app.css`
  - Add responsive package-card layout.
- Modify: `src/App.test.tsx`
  - Add route rendering, metadata, source links, CTA, and analytics assertions.
- Modify: `src/seo/public-growth.test.ts`
  - Assert sitemap and `llms.txt` expose the route and source-backed visual explainer description.
- Modify: `public/sitemap.xml`
  - Add the published route.
- Modify: `public/llms.txt`
  - Add the AI-readable description.
- Create: `docs/marketing/research/2026-06-02-visual-project-explainer-page.md`
  - Document source evidence, growth contract, output formats, claim limits, and validation status.
- Modify: `docs/plans/2026-06-01-quickfork-growth-lifecycle-prioritization.md`
  - Append this P3 visual explainer slice.
- Modify: `/Users/moose/Documents/Moose's Birth ID/QuickFork/SEO Growth/2026-06-01 QuickFork Cold Start Launch Growth Iteration.md`
  - Mirror the strategy update locally.

## Tasks

### Task 1: RED Model, Route, And SEO Tests

**Files:**
- Create: `src/marketing/visual-explainer-package.test.ts`
- Modify: `src/App.test.tsx`
- Modify: `src/seo/public-growth.test.ts`

- [x] **Step 1: Add model tests**

Create `src/marketing/visual-explainer-package.test.ts` with tests that expect:

- Output ids are `story_map`, `readme_hero_card`, `github_social_preview`, and `deck_ready_slide`.
- Each output has a title, source label, source URL, project question, QuickFork surface, lifecycle stage, and activation metric.
- Source URLs include GitHub README docs, GitHub social preview docs, Open Source Guides finding users, and Product Hunt launch guide.
- Serialized package does not contain `ranking`, `revenue`, `customers`, `guaranteed`, `viral`, or `fully autonomous`.

- [x] **Step 2: Add route test**

Add `renders the GitHub repo visual explainer as a source-backed product route` to `src/App.test.tsx`. It should navigate to `/product/github-repo-visual-explainer?utm_source=google` and assert:

- H1 contains `GitHub Repo Visual Explainer`.
- Definition contains `source-backed visual package`.
- Page shows `Visual package outputs`.
- Output cards include `Project story map`, `README hero card`, `GitHub social preview`, and `Deck-ready explainer slide`.
- Source links include GitHub README docs, GitHub social preview docs, Open Source Guides, and Product Hunt launch guide.
- `Last updated: June 2, 2026` is rendered.
- Primary CTA says `Generate free repo brief` and links to `/#hero`.
- Metadata title is `GitHub Repo Visual Explainer | QuickFork`.
- Meta description is `QuickFork maps github repo visual explainer demand into source-backed story maps, README hero cards, GitHub social previews, and deck-ready visual launch assets for technical repositories.`
- Canonical URL is `https://seekersai.com/product/github-repo-visual-explainer`.
- `page_view` includes `page_type=product`, `buyer_stage=consideration`, `intent_cluster=github_repo_visual_explainer`, and `utm_source=google`.
- Analytics payload does not contain email, token, secret, api_key, ranking, revenue, customers, guaranteed, viral, or fully autonomous.

- [x] **Step 3: Add public-growth assertions**

Extend the public growth test to assert:

- sitemap contains `https://seekersai.com/product/github-repo-visual-explainer`.
- `llms.txt` contains `GitHub Repo Visual Explainer`.
- `llms.txt` contains `source-backed story maps, README hero cards, GitHub social previews, and deck-ready visual launch assets`.

- [x] **Step 4: Run RED tests**

```bash
npm test -- src/marketing/visual-explainer-package.test.ts
npm test -- src/App.test.tsx -t "GitHub repo visual explainer"
npm test -- src/seo/public-growth.test.ts -t "public growth|machine-readable AI context"
```

Expected: fail because the model, route, page narrative, sitemap entry, and `llms.txt` line do not exist yet.

### Task 2: Implement Model, Catalog, And Route Narrative

**Files:**
- Create: `src/marketing/visual-explainer-package.ts`
- Modify: `src/marketing/link-catalog.ts`
- Modify: `docs/marketing/data/semantic-link-inventory.csv`
- Modify: `src/marketing/page-content.ts`

- [x] **Step 1: Add typed visual package model**

Create a package with four outputs:

- Project story map: source-backed narrative graph for repo purpose, audience, workflow, proof, and launch path.
- README hero card: visual direction for the README first impression.
- GitHub social preview: share-preview direction for repository links.
- Deck-ready explainer slide: one-slide flow for pitch decks and launch reviews.

- [x] **Step 2: Register route**

Add a published product link:

- `intentCluster`: `github_repo_visual_explainer`
- `slug`: `github-repo-visual-explainer`
- `canonicalUrl`: `https://seekersai.com/product/github-repo-visual-explainer`
- `primaryKeyword`: `github repo visual explainer`
- `primaryCta`: `generate_launch_card`
- `utm.campaign`: `visual_explainer`
- `crmCampaign`: `2026_q2_visual_explainer`

- [x] **Step 3: Add page narrative**

Add `github_repo_visual_explainer` to `pageNarratives` with definition, target user, JTBD, evidence boundary, benefits, workflow, FAQ, source notes, `lastUpdated`, and `visualPackage`.

- [x] **Step 4: Add dedicated headline and description**

Headline:

```text
GitHub Repo Visual Explainer for source-backed project understanding.
```

Description:

```text
QuickFork maps github repo visual explainer demand into source-backed story maps, README hero cards, GitHub social previews, and deck-ready visual launch assets for technical repositories.
```

### Task 3: Render Visual Package Cards

**Files:**
- Modify: `src/components/marketing/MarketingPage.tsx`
- Modify: `src/styles/app.css`

- [x] **Step 1: Render optional visual package**

When `narrative.visualPackage` exists, render a `Visual package outputs` section with title, claim boundary, and one card per output.

- [x] **Step 2: Add responsive styles**

Add `.marketingVisualPackageGrid` and related classes. Use stable grid dimensions, 4 cards on desktop and 1 column on mobile.

### Task 4: Refresh SEO/GEO Assets

**Files:**
- Modify: `public/sitemap.xml`
- Modify: `public/llms.txt`

- [x] **Step 1: Add sitemap URL**

Add `<loc>https://seekersai.com/product/github-repo-visual-explainer</loc>` with `lastmod` `2026-06-02`, `changefreq` `monthly`, and `priority` `0.8`.

- [x] **Step 2: Add `llms.txt` route line**

Add the product page line under Product Pages with the same description as `getMarketingPageDescription()`.

### Task 5: Document Growth Iteration

**Files:**
- Create: `docs/marketing/research/2026-06-02-visual-project-explainer-page.md`
- Modify: `docs/plans/2026-06-01-quickfork-growth-lifecycle-prioritization.md`
- Modify: `/Users/moose/Documents/Moose's Birth ID/QuickFork/SEO Growth/2026-06-01 QuickFork Cold Start Launch Growth Iteration.md`

- [x] **Step 1: Create research note**

Document the growth contract, source evidence, output formats, metric, guardrail, claim limits, and next validation step.

- [x] **Step 2: Append lifecycle section**

Record this as a P3 Visual Project Explainer slice, still hypothesis-stage until production behavior exists.

- [x] **Step 3: Mirror in Obsidian**

Append the same decision fields to the local strategy mirror.

### Task 6: Verify And Publish

**Files:**
- Check all modified files.

- [x] **Step 1: Run focused tests**

```bash
npm test -- src/marketing/visual-explainer-package.test.ts src/App.test.tsx src/seo/public-growth.test.ts src/seo/semantic-links.test.ts
```

- [x] **Step 2: Run full verification**

```bash
npm test
npm run build
git diff --check
```

- [ ] **Step 3: Publish**

Create a PR into `main`, merge after CI passes, and production-smoke the route, `llms.txt`, sitemap, and deployed bundle.

Focused verification observed:

- `npm test -- src/marketing/visual-explainer-package.test.ts`: 1 file passed, 3 tests passed.
- `npm test -- src/App.test.tsx -t "GitHub repo visual explainer"`: 1 file passed, 1 selected test passed.
- `npm test -- src/seo/public-growth.test.ts -t "public growth|machine-readable AI context"`: 1 file passed, 6 tests passed.
- `npm test -- src/seo/semantic-links.test.ts`: 1 file passed, 7 tests passed.
- `npm test -- src/marketing/visual-explainer-package.test.ts src/App.test.tsx src/seo/public-growth.test.ts src/seo/semantic-links.test.ts`: 4 files passed, 35 tests passed.

Full verification observed:

- `npm test`: 21 files passed, 133 tests passed.
- `npm run build`: TypeScript and Vite production build completed.
- `git diff --check`: no whitespace errors.

## Self-Review

- Spec coverage: The plan adds a real P3 visual explainer page tied to repository evidence, visual outputs, CTA measurement, SEO/GEO assets, and growth docs.
- Placeholder scan: No TBD/TODO placeholders remain.
- Type consistency: `visualPackage` is optional on `MarketingPageNarrative`, so existing routes remain compatible.
