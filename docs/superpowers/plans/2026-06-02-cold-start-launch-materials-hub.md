# Cold Start Launch Materials Hub Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Publish and measure a product-led `/product/cold-start-launch-materials` hub that explains QuickFork's full value unit: README, social, deck, visual, and outreach launch materials generated from one public GitHub repository URL.

**Architecture:** Follow the existing catalog-backed marketing route pattern. Add one published `MarketingLink`, one route narrative, SEO/GEO public assets, experiment/search baseline rows, and growth documentation without changing generator behavior.

**Tech Stack:** React, TypeScript, Vite, Vitest, static public crawler assets, CSV-backed marketing evidence docs.

---

## File Structure

- Modify `src/marketing/link-catalog.ts`: add the product route contract for `cold_start_launch_materials`.
- Modify `src/marketing/page-content.ts`: add the page narrative with definition, target user, workflow, FAQs, source notes, and claim boundary.
- Modify `src/App.test.tsx`: add a route rendering and metadata regression test.
- Modify `src/seo/semantic-links.test.ts`: lock catalog contract for the new route.
- Modify `src/seo/public-growth.test.ts`: lock sitemap and `llms.txt` entries.
- Modify `src/marketing/growth-experiments.ts` and `src/marketing/growth-experiments.test.ts`: add active validation experiment against `/product/github-repo-to-launch-package`.
- Modify `src/marketing/search-ai-baseline.ts`, `src/marketing/search-ai-baseline.test.ts`, and `docs/marketing/data/search-ai-baseline-prompts.csv`: add Search Console and AI-answer prompt coverage for the new route.
- Modify `docs/marketing/data/growth-experiment-registry.csv` and `docs/marketing/data/growth-experiment-evidence.csv`: add evidence rows for the new experiment.
- Modify `public/sitemap.xml`, `public/llms.txt`, and `src/seo/seo-assets.ts`: publish the route to crawler/AI surfaces.
- Create `docs/marketing/research/2026-06-02-cold-start-launch-materials-hub.md`: record hypothesis, lifecycle stage, target user, CTA, metrics, guardrails, evidence boundary, and deployment evidence placeholders.
- Modify `docs/plans/2026-06-01-quickfork-growth-lifecycle-prioritization.md`: append this P1/P2 hub slice and next validation action.
- Update Obsidian strategy mirror after repo changes: `/Users/moose/Documents/Moose's Birth ID/QuickFork/SEO Growth/2026-06-01 QuickFork Cold Start Launch Growth Iteration.md`.

## Task 1: RED Tests For The New Product Hub

**Files:**
- Modify: `src/App.test.tsx`
- Modify: `src/seo/semantic-links.test.ts`
- Modify: `src/seo/public-growth.test.ts`
- Modify: `src/marketing/growth-experiments.test.ts`
- Modify: `src/marketing/search-ai-baseline.test.ts`

- [ ] **Step 1: Add a failing App route test**

Add a Vitest case that visits `/product/cold-start-launch-materials?utm_source=google`, renders the product page, and expects:

```ts
expect(
  screen.getByRole("heading", {
    name: /Cold Start Launch Materials From A GitHub Repo/i,
  }),
).toBeInTheDocument();
expect(screen.getAllByText(/README, social, deck, visual, and outreach/i).length).toBeGreaterThan(0);
expect(screen.getAllByText(/AI project builders, open-source maintainers/i).length).toBeGreaterThan(0);
expect(screen.getByText(/Turn one repo into a launch-materials brief/i)).toBeInTheDocument();
expect(screen.getByText(/Package four launch channels together/i)).toBeInTheDocument();
expect(screen.getByText(/What are cold-start launch materials/i)).toBeInTheDocument();
expect(screen.getByRole("link", { name: /Product Hunt launch guide/i })).toHaveAttribute(
  "href",
  expect.stringContaining("producthunt.com"),
);
expect(screen.getByText("Last updated: June 2, 2026")).toBeInTheDocument();
expect(document.title).toBe("Cold Start Launch Materials | QuickFork");
expect(document.querySelector('meta[name="description"]')).toHaveAttribute(
  "content",
  "QuickFork maps cold start launch materials demand into source-backed README, social, deck, visual, and outreach drafts generated from one public GitHub repository URL.",
);
expect(document.querySelector('link[rel="canonical"]')).toHaveAttribute(
  "href",
  "https://seekersai.com/product/cold-start-launch-materials",
);
expect(window.dataLayer).toEqual(
  expect.arrayContaining([
    expect.objectContaining({
      event: "page_view",
      page_path: "/product/cold-start-launch-materials",
      page_type: "product",
      buyer_stage: "consideration",
      intent_cluster: "cold_start_launch_materials",
      utm_source: "google",
    }),
  ]),
);
expect(document.body.textContent).not.toMatch(
  /\b(guaranteed|rankings|revenue|customers|viral|fully autonomous)\b/i,
);
expect(JSON.stringify(window.dataLayer)).not.toMatch(/email|token|secret|api_key|raw|readme/i);
```

- [ ] **Step 2: Add failing catalog/SEO tests**

Assert `getMarketingLinkByPath("/product/cold-start-launch-materials")` returns:

```ts
expect.objectContaining({
  intentCluster: "cold_start_launch_materials",
  primaryKeyword: "cold start launch materials",
  primaryCta: "generate_launch_card",
})
```

Assert `getMarketingPageDescription(link!)` contains:

```ts
"README, social, deck, visual, and outreach drafts"
```

Assert `public/sitemap.xml`, `public/llms.txt`, and `src/seo/seo-assets.ts` contain the new URL and description.

- [ ] **Step 3: Add failing experiment/search baseline tests**

Add expectations that:

```ts
getGrowthExperimentById("2026_q2_cold_start_materials_intent_validation")
```

exists with control `/product/github-repo-to-launch-package`, variant `/product/cold-start-launch-materials`, target user `ai_project_builder`, active status, and evidence requiring GA4, Search Console, and AI-answer audit.

Add expectations that `getSearchAiBaselineRowsForExperiment("2026_q2_cold_start_materials_intent_validation")` returns control and variant rows for:

```ts
"GitHub repo to launch package"
"cold start launch materials"
```

- [ ] **Step 4: Run focused tests and verify RED**

Run:

```bash
npm test -- src/App.test.tsx src/seo/semantic-links.test.ts src/seo/public-growth.test.ts src/marketing/growth-experiments.test.ts src/marketing/search-ai-baseline.test.ts
```

Expected: fail because `cold_start_launch_materials` route, experiment, and baseline rows are not implemented.

## Task 2: GREEN Product Route And Narrative

**Files:**
- Modify: `src/marketing/link-catalog.ts`
- Modify: `src/marketing/page-content.ts`

- [ ] **Step 1: Add catalog link**

Add a published product link near the other top-funnel product routes:

```ts
{
  status: "published",
  funnelStage: "top",
  buyerStage: "consideration",
  persona: "ai_project_builder",
  intentCluster: "cold_start_launch_materials",
  pageType: "product",
  slug: "cold-start-launch-materials",
  canonicalUrl: "https://seekersai.com/product/cold-start-launch-materials",
  primaryKeyword: "cold start launch materials",
  primaryCta: "generate_launch_card",
  crmCampaign: "2026_q2_cold_start_materials",
  utm: {
    source: "google",
    medium: "organic",
    campaign: "cold_start_materials",
    content: "product_page",
  },
}
```

- [ ] **Step 2: Add route narrative**

Add `cold_start_launch_materials` to `pageNarratives` with:

- 40-60 word definition block.
- Target user: AI project builders, open-source maintainers, indie technical founders, and DevRel teams.
- Job-to-be-done: generate launch materials across README, social, deck, visual, and outreach surfaces from the same repo evidence.
- Evidence boundary: repository metadata, README, linked docs, official assets, generated quality reports, and explicit user input only.
- Benefits titled exactly:
  - `Turn one repo into a launch-materials brief`
  - `Package four launch channels together`
  - `Make the project understandable before the code`
  - `Route launch urgency into activation`
- Workflow titled exactly:
  - `Capture repository evidence`
  - `Build the launch-materials map`
  - `Draft channel-specific assets`
  - `Review, export, and measure`
- FAQs including:
  - `What are cold-start launch materials?`
  - `Why generate launch materials from a GitHub repository?`
  - `Which launch channels should QuickFork cover first?`
  - `Does QuickFork guarantee launch results?`
- Source notes for GitHub README docs, GitHub social preview docs, Open Source Guides finding users, and Product Hunt launch guide.
- `lastUpdated: "June 2, 2026"`.

- [ ] **Step 3: Run focused route/catalog tests**

Run:

```bash
npm test -- src/App.test.tsx src/seo/semantic-links.test.ts
```

Expected: route/catalog assertions pass except public asset and experiment tests, if run separately.

## Task 3: GREEN SEO/GEO Public Assets

**Files:**
- Modify: `public/sitemap.xml`
- Modify: `public/llms.txt`
- Modify: `src/seo/seo-assets.ts`

- [ ] **Step 1: Add sitemap URL**

Add:

```xml
<url>
  <loc>https://seekersai.com/product/cold-start-launch-materials</loc>
  <lastmod>2026-06-02</lastmod>
  <changefreq>weekly</changefreq>
  <priority>0.8</priority>
</url>
```

- [ ] **Step 2: Add llms entry**

Add:

```md
- Cold Start Launch Materials | QuickFork: https://seekersai.com/product/cold-start-launch-materials - Product, Consideration. QuickFork maps cold start launch materials demand into source-backed README, social, deck, visual, and outreach drafts generated from one public GitHub repository URL.
```

- [ ] **Step 3: Add generated SEO asset text**

Keep `src/seo/seo-assets.ts` aligned with `public/llms.txt`.

- [ ] **Step 4: Run public-growth tests**

Run:

```bash
npm test -- src/seo/public-growth.test.ts
```

Expected: public SEO/GEO asset tests pass.

## Task 4: GREEN Experiment And AI-Search Baseline Contract

**Files:**
- Modify: `src/marketing/growth-experiments.ts`
- Modify: `docs/marketing/data/growth-experiment-registry.csv`
- Modify: `docs/marketing/data/growth-experiment-evidence.csv`
- Modify: `src/marketing/search-ai-baseline.ts`
- Modify: `docs/marketing/data/search-ai-baseline-prompts.csv`

- [ ] **Step 1: Add active growth experiment**

Add:

```ts
{
  id: "2026_q2_cold_start_materials_intent_validation",
  status: "active",
  lifecycleStage: "validation",
  targetUser: "ai_project_builder",
  controlPath: "/product/github-repo-to-launch-package",
  variantPath: "/product/cold-start-launch-materials",
  primaryCta: "generate_launch_card",
  primaryMetric: "cta_clicked_per_page_view",
  guardrailMetric: "generation_failed_per_generation_started",
  decisionRule: "higher_cta_rate_with_no_significant_guardrail_regression",
  minimumWindow: "14_days",
  evidenceRequired:
    "ga4_page_view_and_cta_clicked_and_generation_started_and_generation_failed_and_search_console_query_baseline_and_ai_answer_audit",
}
```

- [ ] **Step 2: Add registry/evidence CSV rows**

Add a registry row matching the experiment and an evidence row with status `pending`, no claimed result, and the evidence note:

```csv
Needs 14 days of GA4 page_view, cta_clicked, generation_started, generation_failed, Search Console query baseline, and AI-answer audit before deciding.
```

- [ ] **Step 3: Add Search/AI baseline rows**

Add `cold_start_materials_control` and `cold_start_materials_variant` rows to both TypeScript and CSV with surfaces:

```txt
google_search_console|chatgpt_search|perplexity|google_ai_overview|gemini|claude
```

and forbidden claims:

```txt
pricing|rankings|revenue|customer_count|conversion_lift|product_hunt_outcome|guaranteed_launch|validated_ai_citation
```

- [ ] **Step 4: Run experiment/baseline tests**

Run:

```bash
npm test -- src/marketing/growth-experiments.test.ts src/marketing/search-ai-baseline.test.ts src/marketing/growth-experiment-report.test.ts
```

Expected: all experiment/report/baseline tests pass.

## Task 5: Docs, Obsidian, Verification, And Shipping

**Files:**
- Create: `docs/marketing/research/2026-06-02-cold-start-launch-materials-hub.md`
- Modify: `docs/plans/2026-06-01-quickfork-growth-lifecycle-prioritization.md`
- Modify: `/Users/moose/Documents/Moose's Birth ID/QuickFork/SEO Growth/2026-06-01 QuickFork Cold Start Launch Growth Iteration.md`

- [ ] **Step 1: Add research handoff doc**

Document hypothesis, lifecycle stage, target user, CTA, metrics, guardrails, evidence boundary, research inputs, changed surfaces, validation status, and next validation step. Mark demand as hypothesis only.

- [ ] **Step 2: Append lifecycle plan entry**

Add a `2026-06-02 Cold Start Launch Materials Hub Slice` section with target user, primary CTA, metrics, guardrails, evidence gap, and next validation step.

- [ ] **Step 3: Update Obsidian mirror**

Add date, branch, hypothesis, lifecycle stage, target user, changed surface, metric, guardrail, evidence observed, decision, and next action. Do not store secrets or raw analytics.

- [ ] **Step 4: Run full verification**

Run:

```bash
npm test
npm run build
git diff --check
```

Expected: tests pass, build passes, no whitespace errors.

- [ ] **Step 5: Commit and push**

Run:

```bash
git status -sb
git add AGENTS.md .agents docs public src
git diff --cached --check
git commit -m "feat: add cold-start launch materials hub"
git push -u origin feature/cold-start-launch-materials-hub
```

Expected: only this growth slice is staged and pushed.

- [ ] **Step 6: PR, CI, merge, production smoke**

Open PR with a body listing product route, SEO/GEO assets, experiment baseline, docs, and tests. After checks pass, merge into `main`, delete the remote branch, watch main CI/CD, and smoke-check:

```bash
curl -L -s -o /dev/null -w '%{http_code}\n' https://seekersai.com/product/cold-start-launch-materials
curl -L -s https://seekersai.com/sitemap.xml | rg 'https://seekersai.com/product/cold-start-launch-materials'
curl -L -s https://seekersai.com/llms.txt | rg 'Cold Start Launch Materials'
```

Expected: route returns 200 and both public discovery files include the new page.

## Self-Review

- Spec coverage: The plan covers the product hub, target user demand framing, SEO/GEO discoverability, experiment priority, lifecycle documentation, Obsidian mirror, and PR/deployment verification.
- Placeholder scan: No TBD/TODO/later placeholders remain.
- Type consistency: `cold_start_launch_materials`, `/product/cold-start-launch-materials`, and `2026_q2_cold_start_materials_intent_validation` are used consistently across route, experiment, baseline, docs, and public assets.
