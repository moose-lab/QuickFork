# GitHub Repo Launch Demand Map Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add a crawlable demand-map resource page that turns public launch-prep evidence into QuickFork's next landing-page and paid-package prioritization signals.

**Architecture:** Create a typed demand signal map in `src/marketing/launch-demand-map.ts`, add a resource route to the semantic marketing catalog, extend marketing page narratives with optional source notes, and publish the route through sitemap and `llms.txt`. Tests prove the route is source-linked, claim-safe, and measurable.

**Tech Stack:** TypeScript, React, Vitest, existing marketing route catalog, existing public growth asset renderer.

---

## Growth Contract

- **Hypothesis:** If QuickFork shows a source-backed demand map for GitHub repo launches, open-source maintainers and AI builders will see the paid launch-package workflow as grounded in real launch requirements rather than generic AI marketing.
- **Lifecycle stage:** Discovery to Monetization.
- **Target user:** Open-source maintainers, AI project builders, indie founders, DevRel operators, and studios preparing launch assets from a GitHub repository.
- **Primary CTA:** Request full launch package.
- **Primary metric:** `cta_clicked` where `cta_id=request_launch_package` on `/resources/github-repo-launch-demand-map`.
- **Guardrail metric:** `sales_contact_requested` quality should be reviewed before publishing prices; no public claim may state revenue, customer count, guaranteed ranking, or validated conversion lift.
- **Evidence gap:** Public sources show launch-prep requirements and community language, not QuickFork-specific demand. Treat this page as a hypothesis until production CTA, contact, and interview evidence exist.

## Public Sources

- GitHub Docs: social preview image requirements for repository links.
- Open Source Guides: message clarity, audience channels, and feedback-first promotion for open-source projects.
- Product Hunt Launch Guide: launch content checklist, gallery images, video, pricing status, and first comment requirements.
- Reddit community threads: recent maker language around checklists, tagline clarity, screenshots, visuals, first comments, and launch preparation.

## File Map

- Create `src/marketing/launch-demand-map.ts`: typed demand signals and paid-package implications.
- Create `src/marketing/launch-demand-map.test.ts`: source URL, confidence, priority, claim hygiene, and paid-intent coverage tests.
- Modify `src/marketing/link-catalog.ts`: add the published resource route.
- Modify `docs/marketing/data/semantic-link-inventory.csv`: mirror the new route.
- Modify `src/marketing/page-content.ts`: add narrative and source notes for the route.
- Modify `src/components/marketing/MarketingPage.tsx`: render optional source notes.
- Modify `src/App.test.tsx`: prove route content, source notes, CTA, metadata, schema, and analytics.
- Modify `src/seo/public-growth.test.ts`, `public/sitemap.xml`, and `public/llms.txt`: publish the route to crawlers and AI agents.
- Create `docs/marketing/research/2026-06-02-github-repo-launch-demand-map.md`: concise research synthesis and next validation steps.
- Modify `docs/plans/2026-06-01-quickfork-growth-lifecycle-prioritization.md`: append this growth slice.
- Modify `/Users/moose/Documents/Moose's Birth ID/QuickFork/SEO Growth/2026-06-01 QuickFork Cold Start Launch Growth Iteration.md`: mirror the decision.

## Task 1: RED Demand Map And Route Tests

- [ ] **Step 1: Add failing demand map tests**

Create `src/marketing/launch-demand-map.test.ts`:

```ts
import { describe, expect, it } from "vitest";

import { getDemandSignalsByLifecycleStage, launchDemandSignals } from "./launch-demand-map";

describe("launch demand map", () => {
  it("maps public launch-prep evidence to QuickFork paid-package signals", () => {
    expect(launchDemandSignals.length).toBeGreaterThanOrEqual(4);
    expect(launchDemandSignals.map((signal) => signal.id)).toContain("product_hunt_launch_assets");
    expect(launchDemandSignals.map((signal) => signal.id)).toContain("github_social_preview");

    for (const signal of launchDemandSignals) {
      expect(signal.sourceUrl).toMatch(/^https:\/\//);
      expect(["low", "medium", "high"]).toContain(signal.confidence);
      expect(signal.quickForkSurface).toMatch(/launch|story|asset|package|preview/i);
      expect(signal.willingnessToPaySignal).toMatch(/export|review|batch|package|human|white_label|deadline/i);
      expect(JSON.stringify(signal)).not.toMatch(/guaranteed|validated|revenue|customers|ranking|api_key|token|secret/i);
    }
  });

  it("prioritizes signals that connect launch assets to monetization learning", () => {
    const monetizationSignals = getDemandSignalsByLifecycleStage("monetization");

    expect(monetizationSignals.length).toBeGreaterThanOrEqual(1);
    expect(monetizationSignals[0]).toEqual(
      expect.objectContaining({
        priority: "P4",
        primaryCta: "request_launch_package",
      }),
    );
  });
});
```

- [ ] **Step 2: Add failing route test**

Append an `App` test that visits `/resources/github-repo-launch-demand-map`, expects source note links, Product Hunt/GitHub/Open Source Guide language, `request full launch package` CTA, route metadata, and `resource_page_viewed` analytics.

- [ ] **Step 3: Run RED**

Run:

```bash
npm test -- src/marketing/launch-demand-map.test.ts src/App.test.tsx -t "launch demand map|launch demand"
```

Expected: FAIL because the demand map module and route do not exist.

## Task 2: Implement Demand Map Resource

- [ ] **Step 1: Create `launch-demand-map.ts`**

Add typed demand signals for GitHub social preview, open-source message/audience work, Product Hunt launch assets, and community launch prep. Include source URL, inference, lifecycle stage, priority, CTA, metric, guardrail, and willingness-to-pay signal.

- [ ] **Step 2: Add the route to catalog and CSV**

Add a published resource route:

- slug: `github-repo-launch-demand-map`
- canonical: `https://seekersai.com/resources/github-repo-launch-demand-map`
- keyword: `github repo launch demand`
- primary CTA: `request_launch_package`
- CRM campaign: `2026_q2_launch_demand_map`

- [ ] **Step 3: Add page narrative and source notes**

Add `github_repo_launch_demand_map` narrative with a 40-60 word definition, target user, JTBD, evidence boundary, source-backed benefits, workflow, FAQ, and source notes.

- [ ] **Step 4: Render source notes**

Extend `MarketingPage` to render `narrative.sourceNotes` as a `Research sources` section with source labels, descriptions, and links.

- [ ] **Step 5: Update public crawl assets**

Add the new route to `public/sitemap.xml` and `public/llms.txt`, then update `src/seo/public-growth.test.ts` expectations.

- [ ] **Step 6: Run GREEN**

Run:

```bash
npm test -- src/marketing/launch-demand-map.test.ts src/App.test.tsx -t "launch demand map|launch demand"
```

Expected: PASS.

## Task 3: Docs, Verification, And Publish

- [ ] **Step 1: Add research synthesis**

Create `docs/marketing/research/2026-06-02-github-repo-launch-demand-map.md` with public sources, demand signals, confidence labels, product implications, evidence gaps, and next validation steps.

- [ ] **Step 2: Update repo and Obsidian growth logs**

Append a `2026-06-02 GitHub Repo Launch Demand Map Slice` section to the repo lifecycle plan and the Obsidian mirror.

- [ ] **Step 3: Run verification**

Run:

```bash
npm test -- src/marketing/launch-demand-map.test.ts src/App.test.tsx src/seo/public-growth.test.ts src/seo/semantic-links.test.ts
npm test
npm run build
git diff --check
```

Expected: all pass.

- [ ] **Step 4: Commit and publish**

Stage only this slice and do not stage pre-existing untracked May validation docs. Commit with:

```bash
git commit -m "feat: add github repo launch demand map"
```
