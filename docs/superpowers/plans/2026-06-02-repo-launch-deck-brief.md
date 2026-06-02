# Repo Launch Deck Brief Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add a source-backed `GitHub repository pitch deck generator` growth slice that makes QuickFork's PPT/deck launch-package value crawlable and measurable.

**Architecture:** Extend the existing data-driven semantic marketing catalog instead of adding a one-off route. The new page uses `MarketingPage`, `page-content.ts`, generated sitemap/`llms.txt`, and existing CTA analytics so the route stays aligned with the SEO/GEO and funnel system.

**Tech Stack:** Vite, React, TypeScript, Vitest, static SEO assets generated from `src/marketing/link-catalog.ts` and `src/seo/seo-assets.ts`.

---

## Growth Contract

- Hypothesis: If QuickFork publishes a source-backed repo-to-launch-deck brief page, AI project founders and DevRel operators will better understand the value of turning one repository URL into deck-ready launch structure before requesting a full package.
- Lifecycle stage: Activation to Evaluation, P4.
- Target user: AI project founders, indie technical founders, and DevRel operators preparing Product Hunt, demo-day, investor, or internal launch decks from a GitHub-backed product.
- Primary CTA: `generate_launch_card`.
- Primary metric: `cta_clicked` from `/product/github-repo-to-launch-deck`.
- Guardrail metric: no browser analytics or public copy should include fabricated pricing, funding outcomes, Product Hunt ranking, revenue, customers, benchmark lift, or guaranteed launch performance.
- Evidence gap: real Search Console demand for deck-related repo queries, artifact export rate for deck assets, and willingness-to-pay interviews for full launch-package deck review.

## Files

- Modify: `src/marketing/link-catalog.ts`
- Modify: `src/marketing/page-content.ts`
- Modify: `docs/marketing/data/semantic-link-inventory.csv`
- Modify: `src/seo/semantic-links.test.ts`
- Modify: `src/seo/public-growth.test.ts`
- Create: `docs/marketing/research/2026-06-02-repo-launch-deck-brief.md`
- Modify: `docs/plans/2026-06-01-quickfork-growth-lifecycle-prioritization.md`
- Modify: `/Users/moose/Documents/Moose's Birth ID/QuickFork/SEO Growth/2026-06-01 QuickFork Cold Start Launch Growth Iteration.md`

### Task 1: Write The Failing Route Contract

- [ ] **Step 1: Add tests for the new deck page**

Add expectations that:

- `marketingLinks` and `semantic-link-inventory.csv` include `https://seekersai.com/product/github-repo-to-launch-deck`.
- `getMarketingLinkByPath("/product/github-repo-to-launch-deck")?.intentCluster` is `github_repo_to_launch_deck`.
- `getMarketingPageHeadline()` contains `GitHub Repo To Launch Deck`.
- `public/sitemap.xml` and `public/llms.txt` include the new URL and deck/pitch brief language.

- [ ] **Step 2: Run the focused tests and verify RED**

Run:

```bash
npm test -- src/seo/semantic-links.test.ts src/seo/public-growth.test.ts
```

Expected: fail because the catalog, sitemap, and `llms.txt` do not include the new route yet.

### Task 2: Implement The Catalog And Page Copy

- [ ] **Step 1: Add the semantic catalog row**

Add a published product route:

```text
published,top,consideration,founder,github_repo_to_launch_deck,product,github-repo-to-launch-deck,https://seekersai.com/product/github-repo-to-launch-deck,github repository pitch deck generator,generate_launch_card,google,organic,launch_deck,product_page,2026_q2_launch_deck,https://seekersai.com/product/github-repo-to-launch-deck?utm_source=google&utm_medium=organic&utm_campaign=launch_deck&utm_content=product_page
```

- [ ] **Step 2: Add the typed catalog entry**

Add the matching `marketingLinks` object with `intentCluster: "github_repo_to_launch_deck"`, `slug: "github-repo-to-launch-deck"`, and `primaryKeyword: "github repository pitch deck generator"`.

- [ ] **Step 3: Add the narrative**

Add `pageNarratives.github_repo_to_launch_deck` with definition, target user, JTBD, evidence boundary, benefits, workflow, FAQ, source notes, and last updated date. Copy must describe a reviewable deck brief, not guaranteed fundraising or launch success.

### Task 3: Verify SEO/GEO Generation

- [ ] **Step 1: Run the focused tests**

```bash
npm test -- src/seo/semantic-links.test.ts src/seo/public-growth.test.ts
```

Expected: pass.

- [ ] **Step 2: Regenerate or verify static SEO files**

If generated files changed through the normal build/test pipeline, verify `public/sitemap.xml` and `public/llms.txt` match `renderSitemapXml()` and `renderLlmsTxt()`.

### Task 4: Document Growth Evidence

- [ ] **Step 1: Add repo research note**

Create `docs/marketing/research/2026-06-02-repo-launch-deck-brief.md` with the growth contract, source signals, implementation surface, claim boundaries, and next validation steps.

- [ ] **Step 2: Update lifecycle prioritization**

Append a dated slice to `docs/plans/2026-06-01-quickfork-growth-lifecycle-prioritization.md` describing the deck brief route and evidence gaps.

- [ ] **Step 3: Update the Obsidian mirror**

Append the same decision log to the local QuickFork SEO Growth note without storing secrets or raw lead data.

### Task 5: Full Verification

- [ ] **Step 1: Run all checks**

```bash
git diff --check
npm test
npm run build
```

- [ ] **Step 2: Inspect the diff**

```bash
git status --short
git diff --stat
```

Expected: only the intended catalog, page-content, SEO tests/assets, docs, and Obsidian note changed.
