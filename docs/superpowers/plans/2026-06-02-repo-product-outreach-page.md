# Repo Product Outreach Page Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add a published `/product/github-repo-to-product-outreach` route that positions QuickFork's source-backed outreach drafts as a reviewable launch-package surface, not automated spam.

**Architecture:** Extend the existing catalog-driven marketing route system. The route is added to `src/marketing/link-catalog.ts` and `docs/marketing/data/semantic-link-inventory.csv`, receives a dedicated narrative and outreach-output package in `src/marketing/page-content.ts`, renders through `MarketingPage`, and is exposed through generated `sitemap.xml` and `llms.txt`.

**Tech Stack:** Vite, React, TypeScript, Vitest, Testing Library, generated SEO assets.

---

## Growth Contract

- **Hypothesis:** If QuickFork publishes a source-backed GitHub repo product outreach page, founders and DevRel operators preparing cold-start launches will see outreach drafts as reviewable launch-package artifacts and will be more likely to generate a free repo brief or request a full package.
- **Lifecycle stage:** Activation to Evaluation, with a P4 launch package export signal.
- **Target user:** AI project founders, indie technical founders, open-source maintainers, and DevRel operators preparing Product Hunt, community, partner, newsletter, or pilot-customer outreach.
- **Primary CTA:** `generate_launch_card` with label `Generate free repo brief`.
- **Primary metric:** `cta_clicked` on `/product/github-repo-to-product-outreach` segmented by `intent_cluster=github_repo_product_outreach`.
- **Guardrail metric:** Unsupported-claim flags and `generation_failed / generation_started` after visitors start the studio flow.
- **Evidence gap:** Public sources prove outreach preparation matters, but they do not prove QuickFork-specific demand or willingness to pay. Production page views, CTA clicks, artifact export behavior, launch-package requests, and interviews are still required.
- **Claim limits:** Do not promise reply rates, deliverability, customer acquisition, rankings, revenue, Product Hunt outcomes, automatic sending, scraped leads, or exact pricing.

## External Source Notes

- coreyhaines31/marketingskills: https://github.com/coreyhaines31/marketingskills
- Open Source Guides finding users: https://opensource.guide/finding-users/
- GitHub Docs About READMEs: https://docs.github.com/repositories/managing-your-repositorys-settings-and-features/customizing-your-repository/about-readmes
- Product Hunt launch preparation: https://www.producthunt.com/launch/preparing-for-launch
- FTC CAN-SPAM compliance guide: https://www.ftc.gov/business-guidance/resources/can-spam-act-compliance-guide-business
- Hacker News guidelines: https://news.ycombinator.com/newsguidelines.html

## File Map

- Modify `src/seo/semantic-links.test.ts`: add catalog, path, and page contract coverage for the new product route.
- Modify `src/seo/public-growth.test.ts`: assert sitemap and `llms.txt` include the outreach route and safe description.
- Modify `src/App.test.tsx`: assert the route renders outreach-specific output cards, source notes, canonical metadata, CTA analytics, and claim hygiene.
- Create `src/marketing/product-outreach-package.ts`: typed outreach package outputs and guardrails for route rendering.
- Create `src/marketing/product-outreach-package.test.ts`: tests for outreach output scope, source URLs, metrics, and forbidden claims.
- Modify `src/marketing/link-catalog.ts`: add the published product route.
- Modify `docs/marketing/data/semantic-link-inventory.csv`: mirror the route inventory row.
- Modify `src/marketing/page-content.ts`: add the dedicated narrative, source notes, metadata strings, and outreach package.
- Modify `src/components/marketing/MarketingPage.tsx`: render outreach package outputs when present.
- Regenerate `public/sitemap.xml` and `public/llms.txt` from `src/seo/seo-assets.ts`.
- Create `docs/marketing/research/2026-06-02-repo-product-outreach-page.md`: document public signals, assumptions, guardrails, and next validation.
- Modify `docs/plans/2026-06-01-quickfork-growth-lifecycle-prioritization.md`: append this slice.
- Modify Obsidian mirror `2026-06-01 QuickFork Cold Start Launch Growth Iteration.md`: mirror hypothesis, files, metric, guardrail, and evidence.

## Task 1: Write RED Tests

- [ ] **Step 1: Add semantic-link tests**

In `src/seo/semantic-links.test.ts`, add assertions that:

```ts
expect(rows.map((row) => row.canonical_url)).toContain(
  "https://seekersai.com/product/github-repo-to-product-outreach",
);
expect(getMarketingLinkByPath("/product/github-repo-to-product-outreach")).toEqual(
  expect.objectContaining({
    intentCluster: "github_repo_product_outreach",
    primaryKeyword: "github repo product outreach",
  }),
);
```

Add a page contract test that checks title/headline contain `GitHub Repo Product Outreach`, description contains `source-backed outreach brief`, and description does not match `/spam|scraped|guaranteed|revenue|reply rate|deliverability/i`.

- [ ] **Step 2: Add public-growth tests**

In `src/seo/public-growth.test.ts`, assert the generated sitemap and `llms.txt` contain:

```ts
"https://seekersai.com/product/github-repo-to-product-outreach"
"GitHub Repo Product Outreach"
"source-backed outreach brief, launch email sequence, community post angle, partner note, and human review checklist from repository evidence"
```

- [ ] **Step 3: Add route rendering test**

In `src/App.test.tsx`, add a test that navigates to `/product/github-repo-to-product-outreach?utm_source=google` and asserts visible copy for:

```text
GitHub Repo Product Outreach
source-backed outreach package
Launch email draft
Community feedback post
Partner or newsletter note
Human review checklist
Open Source Guides finding users
FTC CAN-SPAM compliance guide
Hacker News guidelines
```

Also assert the primary CTA points to `/#hero`, page title is `GitHub Repo Product Outreach | QuickFork`, canonical URL is `https://seekersai.com/product/github-repo-to-product-outreach`, `page_view` includes `intent_cluster=github_repo_product_outreach`, and body/dataLayer do not include forbidden claims.

- [ ] **Step 4: Add product outreach package model test**

Create `src/marketing/product-outreach-package.test.ts`:

```ts
import { describe, expect, it } from "vitest";
import { productOutreachPackage } from "./product-outreach-package";

describe("product outreach package", () => {
  it("maps outreach outputs to reviewable launch surfaces", () => {
    expect(productOutreachPackage.outputs.map((output) => output.id)).toEqual([
      "launch_email_draft",
      "community_feedback_post",
      "partner_newsletter_note",
      "product_hunt_first_comment",
      "human_review_checklist",
    ]);
    expect(productOutreachPackage.outputs.every((output) => output.sourceUrl.startsWith("https://"))).toBe(true);
    expect(productOutreachPackage.outputs.every((output) => output.activationMetric)).toBe(true);
  });

  it("keeps outreach guardrails away from spam and guaranteed-result claims", () => {
    const serialized = JSON.stringify(productOutreachPackage);

    expect(serialized).toContain("human-reviewed");
    expect(serialized).toContain("source-backed");
    expect(serialized).not.toMatch(/scraped leads|automatic sending|guaranteed|reply rate|deliverability|revenue/i);
  });
});
```

- [ ] **Step 5: Run RED command**

Run:

```bash
npm test -- src/marketing/product-outreach-package.test.ts src/App.test.tsx src/seo/public-growth.test.ts src/seo/semantic-links.test.ts -t "product outreach|public growth|semantic marketing"
```

Expected: Fail because route, package model, sitemap, and `llms.txt` do not exist yet.

## Task 2: Implement Product Outreach Route

- [ ] **Step 1: Create `product-outreach-package.ts`**

Add typed outputs for launch email draft, community feedback post, partner/newsletter note, Product Hunt first comment, and human review checklist. Each output includes `id`, `title`, `channel`, `sourceUrl`, `quickForkSurface`, `activationMetric`, and `guardrail`.

- [ ] **Step 2: Add catalog row and typed link**

Add the new route with:

```text
status=published
funnel_stage=top
buyer_stage=consideration
persona=founder
intent_cluster=github_repo_product_outreach
page_type=product
slug=github-repo-to-product-outreach
canonical_url=https://seekersai.com/product/github-repo-to-product-outreach
primary_keyword=github repo product outreach
primary_cta=generate_launch_card
utm_source=google
utm_medium=organic
utm_campaign=product_outreach
utm_content=product_page
crm_campaign=2026_q2_product_outreach
```

- [ ] **Step 3: Add page narrative and metadata**

Add a `github_repo_product_outreach` narrative with a 40-60 word definition, target user, job-to-be-done, evidence boundary, benefits, workflow, FAQ, source notes, `lastUpdated: "June 2, 2026"`, and `outreachPackage: productOutreachPackage`.

Add special headline and description:

```ts
return "GitHub Repo Product Outreach for source-backed launch follow-up.";
return "QuickFork maps github repo product outreach demand into a source-backed outreach brief, launch email sequence, community post angle, partner note, and human review checklist from repository evidence.";
```

- [ ] **Step 4: Render outreach package section**

In `MarketingPage`, render an optional `Product outreach outputs` section when `narrative.outreachPackage` exists.

- [ ] **Step 5: Regenerate SEO assets**

Run:

```bash
node --loader @esbuild-kit/esm-loader - <<'NODE'
import { writeFileSync } from 'node:fs';
import { renderLlmsTxt, renderSitemapXml } from './src/seo/seo-assets.ts';
writeFileSync('public/sitemap.xml', renderSitemapXml());
writeFileSync('public/llms.txt', renderLlmsTxt());
NODE
```

## Task 3: Document Evidence And Mirror

- [ ] **Step 1: Create repo research note**

Create `docs/marketing/research/2026-06-02-repo-product-outreach-page.md` with source signals, confidence labels, growth contract, product implications, claim guardrails, and next validation steps.

- [ ] **Step 2: Append lifecycle note**

Append a `2026-06-02 Repo Product Outreach Page Slice` section to `docs/plans/2026-06-01-quickfork-growth-lifecycle-prioritization.md`.

- [ ] **Step 3: Update Obsidian mirror**

Append the same slice to `/Users/moose/Documents/Moose's Birth ID/QuickFork/SEO Growth/2026-06-01 QuickFork Cold Start Launch Growth Iteration.md`.

## Task 4: Verify And Ship

- [ ] **Step 1: Run focused verification**

```bash
npm test -- src/marketing/product-outreach-package.test.ts src/App.test.tsx src/seo/public-growth.test.ts src/seo/semantic-links.test.ts
```

- [ ] **Step 2: Run full verification**

```bash
git diff --check
npm test
npm run build
```

- [ ] **Step 3: Publish branch and PR**

Because ordinary git transport may hang in this environment, create the remote branch from the current remote main tree via the GitHub Git Database API if `git push` is unreliable.

- [ ] **Step 4: Merge and production smoke**

After CI/CD passes, merge into `main`, then verify production route, sitemap, and `llms.txt` contain the new product outreach page.
