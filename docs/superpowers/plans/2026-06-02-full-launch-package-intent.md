# Full Launch Package Intent Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add a post-artifact paid-intent path that lets users request a full QuickFork launch package without publishing exact prices.

**Architecture:** Reuse the existing contact/lead-capture funnel by adding a `launch-package` contact intent. Add a CTA inside the generated launch brief panel that tracks a PII-free `cta_clicked` event and routes users to `/contact?intent=launch-package` with campaign attribution.

**Tech Stack:** TypeScript, React, Vitest, Testing Library, existing marketing link catalog, existing lead-capture API, existing GA4/dataLayer analytics helper.

---

## Growth Contract

- **Hypothesis:** If a user has reviewed or exported launch artifacts, a focused `Request full launch package` CTA will reveal higher-value willingness-to-pay signals without requiring public pricing.
- **Lifecycle stage:** Monetization.
- **Target user:** AI project builders, founders, open-source maintainers, DevRel operators, and studios who need human-reviewed README, social, deck, outreach, and visual launch assets.
- **Primary CTA:** Request full launch package.
- **Primary metric:** `cta_clicked` with `cta_id=request_full_launch_package`, followed by `sales_contact_requested` with `contact_reason=full_launch_package`.
- **Guardrail metric:** No exact pricing, checkout claims, raw artifact body, raw README text, emails, tokens, or secrets in browser analytics.
- **Evidence gap:** This creates an intent signal; real product-market evidence still requires qualified leads, follow-up outcomes, and willingness-to-pay conversations.

## File Map

- Modify `src/App.test.tsx`: add failing tests for the in-product CTA and launch-package contact form.
- Modify `src/components/landing/HeroSection.tsx`: render the paid-intent CTA and track safe click metadata.
- Modify `src/components/marketing/LeadCaptureForm.tsx`: map launch-package contact requests to sales contact payloads.
- Modify `src/marketing/link-catalog.ts`: add the `launch-package` contact intent.
- Modify `src/marketing/page-content.ts`: add CTA label and href.
- Modify `src/styles/app.css`: style the CTA inside the brief panel.
- Modify `docs/plans/2026-06-01-quickfork-growth-lifecycle-prioritization.md`: document the monetization slice.
- Modify `/Users/moose/Documents/Moose's Birth ID/QuickFork/SEO Growth/2026-06-01 QuickFork Cold Start Launch Growth Iteration.md`: mirror the growth iteration.

## Task 1: RED Tests

- [ ] **Step 1: Add generator CTA expectations**

Extend `submits the Hero generator form to the backend generation API` in `src/App.test.tsx`:

```ts
const packageLink = within(briefRegion).getByRole("link", { name: /request full launch package/i });
expect(packageLink).toHaveAttribute("href", expect.stringContaining("/contact?intent=launch-package"));
fireEvent.click(packageLink);
expect(window.dataLayer).toEqual(
  expect.arrayContaining([
    expect.objectContaining({
      event: "cta_clicked",
      cta_id: "request_full_launch_package",
      cta_location: "launch_brief_panel",
      lifecycle_stage: "monetization",
      repo_full_name: "QwenLM/FlashQLA",
      generation_id: "gen_qwenlm_flashqla_test",
      artifact_count: 2,
    }),
  ]),
);
expect(JSON.stringify(window.dataLayer)).not.toContain("README checklist");
```

- [ ] **Step 2: Add launch-package contact expectations**

Add a test in `src/App.test.tsx`:

```ts
it("submits full launch package contact requests as sales contact", async () => {
  window.dataLayer = [];
  window.history.replaceState({}, "", "/contact?intent=launch-package&utm_source=product");
  const fetchMock = vi.fn(
    async () =>
      new Response(JSON.stringify({ leadId: "lead_2", lifecycleStage: "sales_qualified_lead", activityId: "activity_2" }), {
        headers: { "Content-Type": "application/json" },
        status: 201,
      }),
  );
  vi.stubGlobal("fetch", fetchMock);

  render(<App />);

  expect(screen.getByRole("heading", { name: /full launch package/i })).toBeInTheDocument();
  fireEvent.change(screen.getByLabelText(/work email/i), { target: { value: "founder@example.dev" } });
  fireEvent.change(screen.getByLabelText(/company domain/i), { target: { value: "example.dev" } });
  fireEvent.click(screen.getByRole("button", { name: /request full launch package/i }));

  await waitFor(() => expect(fetchMock).toHaveBeenCalledTimes(1));
  const payload = JSON.parse((fetchMock.mock.calls[0]?.[1] as RequestInit).body as string);
  expect(payload).toMatchObject({
    intent: "sales_contact",
    requestType: "full_launch_package",
    contactReason: "full_launch_package",
    crmCampaign: "2026_q2_full_launch_package",
    firstTouch: expect.objectContaining({
      source: "product",
      landingPage: "http://localhost:3000/contact",
    }),
  });
  expect(window.dataLayer).toEqual(
    expect.arrayContaining([
      expect.objectContaining({
        event: "sales_contact_requested",
        contact_reason: "full_launch_package",
        role_segment: "founder",
        utm_source: "product",
      }),
    ]),
  );
  expect(JSON.stringify(window.dataLayer)).not.toContain("founder@example.dev");
});
```

- [ ] **Step 3: Run tests and verify RED**

Run:

```bash
npm test -- src/App.test.tsx -t "submits the Hero generator form|full launch package contact"
```

Expected: FAIL because the CTA and `launch-package` contact intent do not exist yet.

## Task 2: Implement Minimal Product And Contact Path

- [ ] **Step 1: Add contact catalog entry**

Add `request_launch_package` to `marketingPrimaryCtas`, then add a draft contact link with:

```ts
intentCluster: "full_launch_package",
pageType: "contact",
slug: "launch-package",
canonicalUrl: "https://seekersai.com/contact?intent=launch-package",
primaryKeyword: "full launch package",
primaryCta: "request_launch_package",
crmCampaign: "2026_q2_full_launch_package",
```

- [ ] **Step 2: Map contact form payload**

In `LeadCaptureForm`, detect `link.slug === "launch-package"` and set:

```ts
requestType: "full_launch_package"
contactReason: "full_launch_package"
```

- [ ] **Step 3: Add generated-result CTA**

In `LaunchBriefPanel`, render a `Request full launch package` link to `/contact?intent=launch-package&utm_source=quickfork&utm_medium=product&utm_campaign=full_launch_package&utm_content=artifact_review_cta`. On click, call `trackEvent("cta_clicked", ...)` with repo, generation, artifact count, and source-reference count only.

- [ ] **Step 4: Run tests and verify GREEN**

Run:

```bash
npm test -- src/App.test.tsx -t "submits the Hero generator form|full launch package contact"
```

Expected: PASS.

## Task 3: Docs, Verification, Commit, Push

- [ ] **Step 1: Update repo and Obsidian growth logs**

Record hypothesis, lifecycle stage, target user, CTA, metrics, guardrail, evidence, and next action.

- [ ] **Step 2: Run verification**

Run:

```bash
npm test -- src/App.test.tsx src/lib/analytics.test.ts
npm test
npm run build
git diff --check
```

- [ ] **Step 3: Commit and push**

Run:

```bash
git add src/App.test.tsx src/components/landing/HeroSection.tsx src/components/marketing/LeadCaptureForm.tsx src/marketing/link-catalog.ts src/marketing/page-content.ts src/styles/app.css docs/plans/2026-06-01-quickfork-growth-lifecycle-prioritization.md docs/superpowers/plans/2026-06-02-full-launch-package-intent.md
git diff --cached --check
git commit -m "feat: add full launch package intent"
git -c http.version=HTTP/1.1 push
```

Do not stage the pre-existing untracked May validation docs unless explicitly requested.
