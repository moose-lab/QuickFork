# Launch Package Pilot Page Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Publish a bottom-funnel QuickFork page that collects full launch package / pilot intent without publishing unvalidated pricing or outcome claims.

**Architecture:** Extend the existing semantic marketing catalog and generic `MarketingPage` narrative system. The page is a crawlable product route, uses the existing `request_launch_package` CTA to `/contact?intent=launch-package`, and records the hypothesis in repo/Obsidian growth docs.

**Tech Stack:** React, TypeScript, Vitest, static `public/sitemap.xml`, generated `llms.txt`, markdown docs.

---

## Growth Contract

- Hypothesis: If activated/evaluating builders see a clear full launch package pilot offer after free repo brief and visual explainer pages, they will signal paid intent by requesting a launch package before exact pricing is published.
- Lifecycle stage: Monetization learning, P4/P5 bridge.
- Target user: Founders, open-source maintainers, DevRel operators, and design/product leads with launch deadlines or repeated launch packaging needs.
- Primary CTA: `request_launch_package`.
- Primary metric: `cta_clicked` on `/product/repository-launch-package-pilot`, segmented by `page_view` where `intent_cluster=repository_launch_package_pilot`.
- Guardrail metric: contact form spam / unqualified requests, `generation_failed / generation_started`, and unsupported claims in requested launch materials.
- Evidence gap: No pricing research, checkout starts, qualified pilot requests, or willingness-to-pay interviews yet.
- Claim boundary: Do not publish exact prices or claims about rankings, revenue, customer acquisition, Product Hunt results, conversion lift, customer count, or guaranteed launch outcomes.

## File Structure

- Modify `src/marketing/link-catalog.ts`: add one published bottom-funnel product link for the pilot page.
- Modify `docs/marketing/data/semantic-link-inventory.csv`: mirror the new catalog row with clean canonical and UTM-ready distributed URL.
- Modify `src/marketing/page-content.ts`: add the page narrative, headline, and SEO description for `repository_launch_package_pilot`.
- Modify `src/App.test.tsx`: add a route test covering copy, metadata, CTA, analytics, and claim hygiene.
- Modify `src/seo/public-growth.test.ts`: assert sitemap and `llms.txt` include the pilot page.
- Modify `docs/plans/2026-06-01-quickfork-growth-lifecycle-prioritization.md`: add the monetization-learning slice.
- Create `docs/marketing/research/2026-06-02-launch-package-pilot-page.md`: document the hypothesis, page intent, guardrails, and validation plan.
- Update Obsidian strategy mirror after verification.

## Task 1: Route Contract Tests

**Files:**
- Modify: `src/App.test.tsx`
- Modify: `src/seo/public-growth.test.ts`

- [ ] **Step 1: Add a failing route test**

Add a test named `renders the repository launch package pilot page as a paid-intent hypothesis` that visits `/product/repository-launch-package-pilot?utm_source=linkedin`, expects H1 `Repository Launch Package Pilot for source-backed paid-intent learning.`, expects `Request full launch package` CTA href `/contact?intent=launch-package`, expects title `Repository Launch Package Pilot | QuickFork`, expects canonical `https://seekersai.com/product/repository-launch-package-pilot`, expects `page_view` analytics with `intent_cluster: "repository_launch_package_pilot"`, and checks that rendered text does not contain forbidden claims such as `guaranteed`, `revenue`, `customers`, `rankings`, `Product Hunt #1`, or exact prices.

- [ ] **Step 2: Add failing public-growth assertions**

In `src/seo/public-growth.test.ts`, assert `public/sitemap.xml` contains `https://seekersai.com/product/repository-launch-package-pilot` and `public/llms.txt` contains `Repository Launch Package Pilot` plus `full launch package pilot for README, social, deck, outreach, visual explainer, review, and measurement work`.

- [ ] **Step 3: Run tests and verify RED**

Run:

```bash
npm test -- src/App.test.tsx -t "repository launch package pilot"
npm test -- src/seo/public-growth.test.ts -t "public growth|machine-readable AI context"
```

Expected: route test fails because the route renders the homepage or generic copy; public-growth test fails because sitemap and `llms.txt` do not include the pilot page.

## Task 2: Catalog And Narrative Implementation

**Files:**
- Modify: `src/marketing/link-catalog.ts`
- Modify: `docs/marketing/data/semantic-link-inventory.csv`
- Modify: `src/marketing/page-content.ts`

- [ ] **Step 1: Add catalog row**

Add a published product link:

```ts
{
  status: "published",
  funnelStage: "bottom",
  buyerStage: "decision",
  persona: "founder",
  intentCluster: "repository_launch_package_pilot",
  pageType: "product",
  slug: "repository-launch-package-pilot",
  canonicalUrl: "https://seekersai.com/product/repository-launch-package-pilot",
  primaryKeyword: "repository launch package pilot",
  primaryCta: "request_launch_package",
  crmCampaign: "2026_q2_launch_package_pilot",
  utm: {
    source: "linkedin",
    medium: "organic_social",
    campaign: "launch_package_pilot",
    content: "paid_intent_page",
  },
}
```

Mirror it in the CSV with distributed URL `https://seekersai.com/product/repository-launch-package-pilot?utm_source=linkedin&utm_medium=organic_social&utm_campaign=launch_package_pilot&utm_content=paid_intent_page`.

- [ ] **Step 2: Add narrative**

Add `repository_launch_package_pilot` to `pageNarratives` with definition, target user, job-to-be-done, evidence boundary, four benefits, four workflow steps, four FAQs, source notes from the existing product marketing context / growth plan, and `lastUpdated: "June 2, 2026"`.

- [ ] **Step 3: Add custom SEO copy**

Add a custom headline and description:

```ts
return "Repository Launch Package Pilot for source-backed paid-intent learning.";
return "QuickFork maps repository launch package pilot demand into a full launch package pilot for README, social, deck, outreach, visual explainer, review, and measurement work.";
```

- [ ] **Step 4: Run focused tests and verify GREEN**

Run:

```bash
npm test -- src/App.test.tsx -t "repository launch package pilot"
npm test -- src/seo/public-growth.test.ts -t "public growth|machine-readable AI context"
npm test -- src/seo/semantic-links.test.ts
```

Expected: all commands exit 0.

## Task 3: Docs And Growth Evidence

**Files:**
- Create: `docs/marketing/research/2026-06-02-launch-package-pilot-page.md`
- Modify: `docs/plans/2026-06-01-quickfork-growth-lifecycle-prioritization.md`
- Modify: `/Users/moose/Documents/Moose's Birth ID/QuickFork/SEO Growth/2026-06-01 QuickFork Cold Start Launch Growth Iteration.md`

- [ ] **Step 1: Write repo research note**

Create a markdown note with: hypothesis, lifecycle stage, target user, CTA, metric, guardrail, evidence gap, claim boundary, changed surface, and next validation step.

- [ ] **Step 2: Update lifecycle plan**

Append a `2026-06-02 Launch Package Pilot Page Slice` section describing the P4/P5 monetization-learning bet and stating that the page is not validated demand.

- [ ] **Step 3: Update Obsidian mirror**

Append the same slice summary with test evidence after verification. Do not store secrets or private analytics exports.

## Task 4: Full Verification And Publish

**Files:** No additional file changes expected.

- [ ] **Step 1: Run full verification**

Run:

```bash
git diff --check
npm test
npm run build
```

Expected: whitespace check exits 0, Vitest passes, TypeScript/Vite build exits 0.

- [ ] **Step 2: Commit, push, and open PR**

Commit with:

```bash
git add docs/marketing/data/semantic-link-inventory.csv docs/marketing/research/2026-06-02-launch-package-pilot-page.md docs/plans/2026-06-01-quickfork-growth-lifecycle-prioritization.md docs/superpowers/plans/2026-06-02-launch-package-pilot-page.md public/llms.txt public/sitemap.xml src/App.test.tsx src/marketing/link-catalog.ts src/marketing/page-content.ts src/seo/public-growth.test.ts
git commit -m "feat: add launch package pilot page"
git push -u origin feature/launch-package-pilot-page
```

Open a PR to `main` titled `feat: add launch package pilot page` with a body listing功能点, 增长合同, and verification evidence.

- [ ] **Step 3: After merge, production smoke**

Check `/product/repository-launch-package-pilot`, `/llms.txt`, `/sitemap.xml`, and the production JS bundle for route title, description, CTA intent, and `repository_launch_package_pilot`.

---

## Self-Review

- Spec coverage: The plan covers the new paid-intent page, lifecycle/target/CTA/metric/guardrail/evidence gap, docs, Obsidian mirror, tests, and publish verification.
- Placeholder scan: No TBD/TODO placeholders remain.
- Type consistency: `repository_launch_package_pilot`, `repository-launch-package-pilot`, `request_launch_package`, and `2026_q2_launch_package_pilot` are consistent across catalog, tests, docs, and SEO assets.
