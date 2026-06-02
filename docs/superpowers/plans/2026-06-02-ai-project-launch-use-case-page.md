# AI Project Launch Use Case Page Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add a crawlable high-intent `/use-cases/ai-project-launch` page that turns QuickFork's repo-to-launch-package positioning into an AI-project-specific growth route.

**Architecture:** Add a published semantic marketing link and custom narrative for the AI project launch use case, reuse the existing `MarketingPage` shell, add FAQ schema for AI/GEO extraction, and align sitemap, `llms.txt`, CSV inventory, repo docs, and Obsidian.

**Tech Stack:** TypeScript, React, Vitest, Testing Library, existing marketing link catalog, existing SEO asset renderer, existing analytics/dataLayer helper.

---

## Growth Contract

- **Hypothesis:** If AI project builders land on an AI-project-specific use-case page, they will understand QuickFork's cold-start launch package faster than from a generic open-source launch page.
- **Lifecycle stage:** Discovery to Validation.
- **Target user:** AI project builders, open-source AI maintainers, research engineers, technical founders, and DevRel teams preparing an AI repo for public launch.
- **Primary CTA:** Generate free repo brief.
- **Primary metric:** `cta_clicked` on `/use-cases/ai-project-launch` with `intent_cluster=ai_project_launch`.
- **Guardrail metric:** No rankings, revenue, customer-count, benchmark, pricing, or guaranteed-launch claims.
- **Evidence gap:** This page proves crawlable route coverage and CTA tracking; search demand, AI citations, and qualified activation still require production data.

## File Map

- Modify `src/marketing/link-catalog.ts`: add the published `ai_project_launch` use-case route.
- Modify `docs/marketing/data/semantic-link-inventory.csv`: mirror the route catalog.
- Modify `src/marketing/page-content.ts`: add custom headline, description, and narrative.
- Modify `src/components/marketing/MarketingPage.tsx`: add FAQPage JSON-LD for AI/GEO extraction.
- Modify `src/lib/analytics.ts`: add optional `use_case_page_viewed` if page-view measurement needs a dedicated event.
- Modify `src/App.test.tsx`: add route rendering, metadata, schema, CTA, and analytics tests.
- Modify `src/seo/public-growth.test.ts`: require the new URL in sitemap and `llms.txt`.
- Modify `src/seo/semantic-links.test.ts`: require route lookup for `/use-cases/ai-project-launch`.
- Modify `public/sitemap.xml`: add the canonical URL.
- Modify `public/llms.txt`: add the use-case route summary.
- Modify `docs/plans/2026-06-01-quickfork-growth-lifecycle-prioritization.md`: document the slice.
- Modify `/Users/moose/Documents/Moose's Birth ID/QuickFork/SEO Growth/2026-06-01 QuickFork Cold Start Launch Growth Iteration.md`: mirror the decision and evidence.

## Task 1: RED Tests

- [x] **Step 1: Add App route test**

Add a test in `src/App.test.tsx`:

```ts
it("renders the AI project launch use case as an AI/GEO growth route", () => {
  window.dataLayer = [];
  window.history.replaceState({}, "", "/use-cases/ai-project-launch?utm_source=perplexity");

  render(<App />);

  expect(screen.getByRole("heading", { name: /AI project launch/i })).toBeInTheDocument();
  expect(screen.getByText(/source-backed launch package for an AI repository/i)).toBeInTheDocument();
  expect(screen.getByText(/AI project builders and open-source AI maintainers/i)).toBeInTheDocument();
  expect(screen.getByText(/Turn repo evidence into a launch story/i)).toBeInTheDocument();
  expect(screen.getByText(/What does an AI project launch page need to explain/i)).toBeInTheDocument();
  const primaryCta = screen
    .getAllByRole("link", { name: /generate free repo brief/i })
    .find((link) => link.classList.contains("primaryButton"));
  expect(primaryCta).toHaveAttribute("href", "/#hero");
  fireEvent.click(primaryCta!);
  expect(document.title).toBe("AI Project Launch | QuickFork");
  expect(document.querySelector('link[rel="canonical"]')).toHaveAttribute(
    "href",
    "https://seekersai.com/use-cases/ai-project-launch",
  );
  const schema = JSON.parse(document.querySelector('script[data-quickfork-marketing-schema]')?.textContent ?? "{}");
  expect(schema["@type"]).toBe("FAQPage");
  expect(schema.mainEntity[0].name).toContain("What does an AI project launch page need to explain");
  expect(window.dataLayer).toEqual(
    expect.arrayContaining([
      expect.objectContaining({
        event: "page_view",
        page_path: "/use-cases/ai-project-launch",
        page_type: "use_case",
        buyer_stage: "consideration",
        intent_cluster: "ai_project_launch",
        utm_source: "perplexity",
      }),
      expect.objectContaining({
        event: "cta_clicked",
        cta_id: "generate_launch_card",
        cta_location: "marketing_page_hero",
        page_type: "use_case",
        intent_cluster: "ai_project_launch",
      }),
    ]),
  );
  expect(JSON.stringify(window.dataLayer)).not.toMatch(/ranking|revenue|customers|guaranteed/i);
});
```

- [x] **Step 2: Add SEO asset tests**

In `src/seo/public-growth.test.ts`, require:

```ts
expect(sitemap).toContain("<loc>https://seekersai.com/use-cases/ai-project-launch</loc>");
expect(llms).toContain("https://seekersai.com/use-cases/ai-project-launch");
expect(llms).toContain("AI project launch");
```

- [x] **Step 3: Add semantic route lookup**

In `src/seo/semantic-links.test.ts`, require:

```ts
expect(getMarketingLinkByPath("/use-cases/ai-project-launch")?.slug).toBe("ai-project-launch");
```

- [x] **Step 4: Run RED**

Run:

```bash
npm test -- src/App.test.tsx src/seo/public-growth.test.ts src/seo/semantic-links.test.ts
```

Expected: FAIL because the route, catalog entry, sitemap entry, `llms.txt` entry, and schema do not exist yet.

## Task 2: Implement Route, Copy, Schema, And Assets

- [x] **Step 1: Add catalog and CSV row**

Add:

```ts
{
  status: "published",
  funnelStage: "top",
  buyerStage: "consideration",
  persona: "ai_project_builder",
  intentCluster: "ai_project_launch",
  pageType: "use_case",
  slug: "ai-project-launch",
  canonicalUrl: "https://seekersai.com/use-cases/ai-project-launch",
  primaryKeyword: "ai project launch",
  primaryCta: "generate_launch_card",
  crmCampaign: "2026_q2_ai_project_launch",
  utm: {
    source: "perplexity",
    medium: "ai_search",
    campaign: "ai_project_launch",
    content: "use_case_page",
  },
}
```

Mirror the same route in `semantic-link-inventory.csv`.

- [x] **Step 2: Add custom page content**

Add custom headline, description, and narrative for `ai_project_launch` in `page-content.ts`. Keep the definition block 40-60 words and avoid unverified proof.

- [x] **Step 3: Add FAQ schema**

In `MarketingPage`, render one route-level `FAQPage` JSON-LD script using the page title, canonical URL, and FAQ pairs. Clean it up when the route changes.

- [x] **Step 4: Update public assets**

Add the route to `public/sitemap.xml` and `public/llms.txt` in the same order as the catalog.

## Task 3: Docs, Verification, Commit, Push

- [x] **Step 1: Run GREEN targeted test**

Run:

```bash
npm test -- src/App.test.tsx src/seo/public-growth.test.ts src/seo/semantic-links.test.ts
```

- [x] **Step 2: Update repo and Obsidian growth logs**

Document hypothesis, lifecycle stage, target user, changed surface, CTA, metric, guardrail, evidence gap, observed evidence, and next action.

- [x] **Step 3: Run verification**

Run:

```bash
npm test
npm run build
git diff --check
```

- [x] **Step 4: Commit and push**

Run:

```bash
git add src/marketing/link-catalog.ts src/marketing/page-content.ts src/components/marketing/MarketingPage.tsx src/App.test.tsx src/seo/public-growth.test.ts src/seo/semantic-links.test.ts public/sitemap.xml public/llms.txt docs/marketing/data/semantic-link-inventory.csv docs/plans/2026-06-01-quickfork-growth-lifecycle-prioritization.md docs/superpowers/plans/2026-06-02-ai-project-launch-use-case-page.md
git diff --cached --check
git commit -m "feat: add ai project launch use case"
git -c http.version=HTTP/1.1 push
```

Do not stage the pre-existing untracked May validation docs unless explicitly requested.
