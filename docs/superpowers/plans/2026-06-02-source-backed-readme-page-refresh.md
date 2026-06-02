# Source-Backed And README Page Refresh Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Turn `/product/source-backed-launch-assets` and `/product/readme-marketing-cards` from generic published shells into source-backed, AI-extractable QuickFork growth pages.

**Architecture:** Keep the existing catalog-driven marketing route system. Add intent-specific narratives and metadata in `src/marketing/page-content.ts`, lock the rendered routes with App tests, lock machine-readable SEO/GEO output with public-growth and semantic-link tests, then mirror the growth decision in repo docs and Obsidian.

**Tech Stack:** React, TypeScript, Vitest, Testing Library, Vite, static `public/llms.txt` generated from `src/seo/seo-assets.ts`.

---

### Task 1: Route And SEO Contract Tests

**Files:**
- Modify: `src/App.test.tsx`
- Modify: `src/seo/public-growth.test.ts`
- Modify: `src/seo/semantic-links.test.ts`

- [ ] **Step 1: Add failing route tests**

Add two tests after the existing `GitHub repo to launch package` route test.

```tsx
it("renders source-backed launch assets as a high-intent product route", () => {
  window.dataLayer = [];
  window.history.replaceState({}, "", "/product/source-backed-launch-assets?utm_source=perplexity");

  render(<App />);

  expect(screen.getByRole("heading", { name: /Source Backed Launch Assets/i })).toBeInTheDocument();
  expect(screen.getAllByText(/reviewable README, social, deck, outreach, and visual materials/i).length).toBeGreaterThan(0);
  expect(screen.getAllByText(/Product marketers, DevRel operators, AI project builders/i).length).toBeGreaterThan(0);
  expect(screen.getByText(/Replace a blank prompt with a source map/i)).toBeInTheDocument();
  expect(screen.getByText(/Keep launch claims reviewable/i)).toBeInTheDocument();
  expect(screen.getByText(/What are source-backed launch assets/i)).toBeInTheDocument();
  expect(screen.getByRole("link", { name: /GitHub Docs About READMEs/i })).toHaveAttribute("href", expect.stringContaining("docs.github.com"));
  expect(screen.getByText("Last updated: June 2, 2026")).toBeInTheDocument();
  const primaryCta = screen
    .getAllByRole("link", { name: /generate free repo brief/i })
    .find((link) => link.classList.contains("primaryButton"));
  expect(primaryCta).toHaveAttribute("href", "/#hero");
  expect(document.title).toBe("Source Backed Launch Assets | QuickFork");
  expect(document.querySelector('meta[name="description"]')).toHaveAttribute(
    "content",
    "QuickFork maps source backed launch assets demand into reviewable README, social, deck, outreach, and visual materials generated from repository evidence, source maps, and human-approved claims.",
  );
  expect(document.querySelector('link[rel="canonical"]')).toHaveAttribute(
    "href",
    "https://seekersai.com/product/source-backed-launch-assets",
  );
  const schema = JSON.parse(document.querySelector('script[data-quickfork-marketing-schema]')?.textContent ?? "{}");
  expect(schema["@type"]).toBe("FAQPage");
  expect(schema.mainEntity[0].name).toContain("What are source-backed launch assets");
  expect(window.dataLayer).toEqual(
    expect.arrayContaining([
      expect.objectContaining({
        event: "page_view",
        page_path: "/product/source-backed-launch-assets",
        page_type: "product",
        buyer_stage: "consideration",
        intent_cluster: "source_backed_launch_assets",
        utm_source: "perplexity",
      }),
    ]),
  );
  expect(document.body.textContent).not.toMatch(/\b(guaranteed|rankings|revenue|customers|viral|fully autonomous)\b/i);
  expect(JSON.stringify(window.dataLayer)).not.toMatch(/email|token|secret|api_key/i);
});

it("renders README marketing cards as a README-first product route", () => {
  window.dataLayer = [];
  window.history.replaceState({}, "", "/product/readme-marketing-cards?utm_source=google");

  render(<App />);

  expect(screen.getByRole("heading", { name: /README Marketing Cards/i })).toBeInTheDocument();
  expect(screen.getAllByText(/README-first hero cards, GitHub social preview direction, and launch visuals/i).length).toBeGreaterThan(0);
  expect(screen.getAllByText(/Design leads, open-source maintainers, AI project builders/i).length).toBeGreaterThan(0);
  expect(screen.getByText(/Make the README scannable before the code/i)).toBeInTheDocument();
  expect(screen.getByText(/Connect README visuals to launch channels/i)).toBeInTheDocument();
  expect(screen.getByText(/What is a README marketing card/i)).toBeInTheDocument();
  expect(screen.getByRole("link", { name: /GitHub Docs social preview/i })).toHaveAttribute("href", expect.stringContaining("docs.github.com"));
  expect(screen.getByText("Last updated: June 2, 2026")).toBeInTheDocument();
  const primaryCta = screen
    .getAllByRole("link", { name: /generate free repo brief/i })
    .find((link) => link.classList.contains("primaryButton"));
  expect(primaryCta).toHaveAttribute("href", "/#hero");
  expect(document.title).toBe("README Marketing Cards | QuickFork");
  expect(document.querySelector('meta[name="description"]')).toHaveAttribute(
    "content",
    "QuickFork maps readme marketing cards demand into README-first hero cards, GitHub social preview direction, and launch visuals grounded in repository evidence and human review.",
  );
  expect(document.querySelector('link[rel="canonical"]')).toHaveAttribute(
    "href",
    "https://seekersai.com/product/readme-marketing-cards",
  );
  const schema = JSON.parse(document.querySelector('script[data-quickfork-marketing-schema]')?.textContent ?? "{}");
  expect(schema["@type"]).toBe("FAQPage");
  expect(schema.mainEntity[0].name).toContain("What is a README marketing card");
  expect(window.dataLayer).toEqual(
    expect.arrayContaining([
      expect.objectContaining({
        event: "page_view",
        page_path: "/product/readme-marketing-cards",
        page_type: "product",
        buyer_stage: "consideration",
        intent_cluster: "readme_marketing_cards",
        utm_source: "google",
      }),
    ]),
  );
  expect(document.body.textContent).not.toMatch(/\b(guaranteed|rankings|revenue|customers|viral|fully autonomous)\b/i);
  expect(JSON.stringify(window.dataLayer)).not.toMatch(/email|token|secret|api_key/i);
});
```

- [ ] **Step 2: Add failing AI context assertions**

In `src/seo/public-growth.test.ts`, extend the `machine-readable AI context` test.

```ts
expect(llms).toContain("https://seekersai.com/product/source-backed-launch-assets");
expect(llms).toContain("Source Backed Launch Assets");
expect(llms).toContain("reviewable README, social, deck, outreach, and visual materials generated from repository evidence");
expect(llms).toContain("https://seekersai.com/product/readme-marketing-cards");
expect(llms).toContain("README Marketing Cards");
expect(llms).toContain("README-first hero cards, GitHub social preview direction, and launch visuals grounded in repository evidence");
```

- [ ] **Step 3: Add failing semantic metadata tests**

In `src/seo/semantic-links.test.ts`, add page contract tests.

```ts
it("publishes a source-backed launch assets product page contract", () => {
  const link = getMarketingLinkByPath("/product/source-backed-launch-assets");

  expect(link).toBeDefined();
  expect(getMarketingPageTitle(link!)).toContain("Source Backed Launch Assets");
  expect(getMarketingPageHeadline(link!)).toContain("Source Backed Launch Assets");
  expect(getMarketingPageDescription(link!)).toContain("reviewable README, social, deck, outreach, and visual materials");
  expect(getMarketingPageDescription(link!)).not.toMatch(/guaranteed|rankings|revenue|customers|viral/i);
});

it("publishes a README marketing cards product page contract", () => {
  const link = getMarketingLinkByPath("/product/readme-marketing-cards");

  expect(link).toBeDefined();
  expect(getMarketingPageTitle(link!)).toContain("README Marketing Cards");
  expect(getMarketingPageHeadline(link!)).toContain("README Marketing Cards");
  expect(getMarketingPageDescription(link!)).toContain("README-first hero cards");
  expect(getMarketingPageDescription(link!)).not.toMatch(/guaranteed|rankings|revenue|customers|viral/i);
});
```

- [ ] **Step 4: Run RED tests**

Run:

```bash
npm test -- src/App.test.tsx src/seo/public-growth.test.ts src/seo/semantic-links.test.ts -t "source-backed launch assets|README marketing cards|machine-readable AI context|semantic marketing"
```

Expected: failure because the two intent clusters still use generic fallback copy.

### Task 2: Page Narratives And Metadata

**Files:**
- Modify: `src/marketing/page-content.ts`

- [ ] **Step 1: Add `source_backed_launch_assets` narrative**

Add a `pageNarratives.source_backed_launch_assets` entry with:

- Definition: 40-60 words describing reviewable README/social/deck/outreach/visual materials from repository evidence.
- Target user: Product marketers, DevRel operators, AI project builders, open-source maintainers, and technical founders.
- JTBD: turn a working repository into public launch assets without inventing claims.
- Evidence boundary: README, repo metadata, linked docs, official assets, quality reports, or explicit user input only.
- Benefits: source map, reviewable claims, channel alignment, AI-search extraction.
- Workflow: read repo evidence, build source map, generate channel assets, review and measure.
- FAQ: what are source-backed launch assets, why start from a repository, what claims can QuickFork use, are assets published automatically.
- Source notes: GitHub READMEs, GitHub social preview, Open Source Guides, Product Hunt launch guide.
- Last updated: June 2, 2026.

- [ ] **Step 2: Add `readme_marketing_cards` narrative**

Add a `pageNarratives.readme_marketing_cards` entry with:

- Definition: 40-60 words describing README-first hero cards, GitHub social preview direction, and launch visuals grounded in repository evidence.
- Target user: Design leads, open-source maintainers, AI project builders, DevRel operators, and founders.
- JTBD: make a repository scannable and shareable before a visitor reads the full README.
- Evidence boundary: same repository/public/explicit-input rule, no invented logos or proof.
- Benefits: README scanability, channel continuity, source-backed visual hierarchy, launch-package activation.
- Workflow: audit README story, choose card hierarchy, draft preview/visual direction, generate and review.
- FAQ: what is a README marketing card, how it differs from a banner generator, what source assets it uses, whether it replaces documentation.
- Source notes: GitHub READMEs, GitHub social preview, Open Source Guides, Product Hunt launch guide.
- Last updated: June 2, 2026.

- [ ] **Step 3: Add intent-specific headline and description branches**

Add branches in `getMarketingPageHeadline()` and `getMarketingPageDescription()` for both intent clusters. The descriptions must match the test strings exactly.

- [ ] **Step 4: Run GREEN focused tests**

Run:

```bash
npm test -- src/App.test.tsx src/seo/public-growth.test.ts src/seo/semantic-links.test.ts -t "source-backed launch assets|README marketing cards|machine-readable AI context|semantic marketing"
```

Expected: all selected tests pass.

### Task 3: Static SEO/GEO Assets And Docs Mirror

**Files:**
- Modify: `public/llms.txt`
- Create: `docs/marketing/research/2026-06-02-source-backed-readme-page-refresh.md`
- Modify: `docs/plans/2026-06-01-quickfork-growth-lifecycle-prioritization.md`
- Modify: `/Users/moose/Documents/Moose's Birth ID/QuickFork/SEO Growth/2026-06-01 QuickFork Cold Start Launch Growth Iteration.md`

- [ ] **Step 1: Sync `public/llms.txt`**

Run the public-growth test after implementation. If it fails because `public/llms.txt` differs from `renderLlmsTxt()`, update the static file to match generated output.

- [ ] **Step 2: Add repo research note**

Create `docs/marketing/research/2026-06-02-source-backed-readme-page-refresh.md` with the growth hypothesis, lifecycle stage, target user, changed surfaces, metrics, guardrails, evidence gap, source notes, and validation status.

- [ ] **Step 3: Update lifecycle plan**

Append a dated section to `docs/plans/2026-06-01-quickfork-growth-lifecycle-prioritization.md` recording this P1 landing page quality slice and its next validation action.

- [ ] **Step 4: Update Obsidian mirror**

Append the same compact decision log to `/Users/moose/Documents/Moose's Birth ID/QuickFork/SEO Growth/2026-06-01 QuickFork Cold Start Launch Growth Iteration.md`.

### Task 4: Verification And Shipping

**Files:**
- All modified files above

- [ ] **Step 1: Run targeted tests**

```bash
npm test -- src/App.test.tsx src/seo/public-growth.test.ts src/seo/semantic-links.test.ts
```

Expected: the three files pass.

- [ ] **Step 2: Run full verification**

```bash
npm test
npm run build
git diff --check
```

Expected: all tests pass, build passes, and no whitespace errors.

- [ ] **Step 3: Review diff scope**

```bash
git diff --stat
git diff -- src/App.test.tsx src/marketing/page-content.ts src/seo/public-growth.test.ts src/seo/semantic-links.test.ts public/llms.txt docs/marketing/research/2026-06-02-source-backed-readme-page-refresh.md docs/plans/2026-06-01-quickfork-growth-lifecycle-prioritization.md
```

Expected: diff is limited to this growth slice and Obsidian mirror.

- [ ] **Step 4: Commit, push, PR, and merge**

Commit message:

```bash
feat: refresh source-backed README product pages
```

PR body must list:

- `/product/source-backed-launch-assets`
- `/product/readme-marketing-cards`
- route tests
- `llms.txt`/semantic metadata
- docs and Obsidian strategy mirror updates
- validation commands

- [ ] **Step 5: Verify main and production**

After merge, watch main CI/CD and smoke test:

```bash
/usr/bin/curl -I -L --max-time 20 https://seekersai.com/product/source-backed-launch-assets
/usr/bin/curl -I -L --max-time 20 https://seekersai.com/product/readme-marketing-cards
/usr/bin/curl -L --max-time 20 https://seekersai.com/llms.txt | rg "Source Backed Launch Assets|README Marketing Cards|reviewable README|README-first hero cards"
/usr/bin/curl -L --max-time 20 https://seekersai.com/sitemap.xml | rg "source-backed-launch-assets|readme-marketing-cards"
```

Expected: both routes return HTTP 200, `llms.txt` contains the refreshed descriptions, and sitemap contains both URLs.
