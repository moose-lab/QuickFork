# Launch Package Intent Qualification Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Make `/contact?intent=launch-package` collect qualification signals for full launch package requests without leaking PII or raw project text into browser analytics.

**Architecture:** Extend the existing `LeadCaptureForm` and `lead-capture` server contract. The form adds launch-package-only fields, sends them server-side as structured qualification metadata, and tracks only safe summary fields in analytics.

**Tech Stack:** React, TypeScript, Vitest, mock CRM adapter, static growth docs.

---

## Growth Contract

- Hypothesis: If a launch-package request asks for repo URL, launch timeline, package scope, and review needs, QuickFork can distinguish qualified paid-intent requests from generic contact submissions before publishing exact pricing.
- Lifecycle stage: Monetization learning, P4/P5.
- Target user: Founders, open-source maintainers, DevRel operators, and design/product leads requesting a full package after reviewing a free brief, demand map, readiness score, or pilot page.
- Primary CTA: `request_launch_package`.
- Primary metric: `sales_contact_requested` where `contact_reason=full_launch_package` and `request_type=full_launch_package`.
- Guardrail: Browser analytics must not include email, name, raw repo URL, raw notes, tokens, secrets, or pricing promises.
- Evidence gap: Real request quality, launch urgency, scope distribution, and willingness-to-pay interviews are still missing.

## File Structure

- Modify `src/components/marketing/LeadCaptureForm.tsx`: add launch-package-only qualification fields and safe analytics properties.
- Modify `src/server/marketing/lead-capture.ts`: normalize optional qualification metadata and include it in CRM activity properties.
- Modify `src/App.test.tsx`: assert launch-package form fields, payload, and PII-safe analytics.
- Modify `src/server/marketing/lead-capture.test.ts`: assert server normalization and CRM activity properties.
- Modify `src/styles/app.css`: make expanded qualification fields fit the existing form.
- Add `docs/marketing/research/2026-06-02-launch-package-intent-qualification.md`: document the growth contract, evidence gap, and validation path.
- Update `docs/plans/2026-06-01-quickfork-growth-lifecycle-prioritization.md` and Obsidian mirror with evidence.

## Task 1: Failing Tests

**Files:**
- Modify: `src/App.test.tsx`
- Modify: `src/server/marketing/lead-capture.test.ts`

- [ ] **Step 1: Add frontend RED expectations**

Update the `submits full launch package contact requests as sales contact` test to fill:

- `GitHub repository URL` with `https://github.com/moose-lab/QuickFork`
- `Launch timeline` with `within_30_days`
- `Package scope` checkboxes for `README`, `Social`, `Deck`, `Outreach`, and `Visual explainer`
- `Human review needed` checked
- `Launch notes` with a short launch-context sentence

Assert the API payload includes `qualification` with `repoFullName`, `repoHost`, `launchTimeline`, `packageScope`, `humanReviewNeeded`, and `notes`. Assert `window.dataLayer` includes only safe summary properties: `launch_timeline`, `package_scope_count`, and `human_review_needed`.

- [ ] **Step 2: Add server RED expectations**

Add a lead-capture test proving `captureLead` preserves `qualification` in CRM activity properties for `sales_contact` and normalizes GitHub repo URL into `repoFullName`.

- [ ] **Step 3: Run RED**

Run:

```bash
npm test -- src/App.test.tsx -t "full launch package contact"
npm test -- src/server/marketing/lead-capture.test.ts -t "qualification"
```

Expected: frontend fails because fields are missing; server fails because `qualification` is ignored.

## Task 2: Form And Server Implementation

**Files:**
- Modify: `src/components/marketing/LeadCaptureForm.tsx`
- Modify: `src/server/marketing/lead-capture.ts`
- Modify: `src/styles/app.css`

- [ ] **Step 1: Add launch package form state**

Add state for `repoUrl`, `launchTimeline`, `packageScope`, `humanReviewNeeded`, and `notes`, shown only when `link.pageType === "contact" && link.slug === "launch-package"`.

- [ ] **Step 2: Build qualification payload**

Add `qualification` to `buildLeadCapturePayload` only for launch-package contact requests:

```ts
qualification: {
  repoUrl,
  repoHost,
  repoFullName,
  launchTimeline,
  packageScope,
  humanReviewNeeded,
  notes,
}
```

- [ ] **Step 3: Keep analytics safe**

In `trackLeadCaptureRequested` and delivered contact tracking, include only `launch_timeline`, `package_scope_count`, and `human_review_needed` for launch-package requests. Do not include email, raw repo URL, raw notes, or package-scope text arrays.

- [ ] **Step 4: Normalize server qualification**

Extend `LeadCaptureInput` with `qualification?: LeadQualificationInput`. Normalize optional strings, booleans, and arrays. Add normalized qualification to CRM activity properties.

- [ ] **Step 5: Run focused GREEN**

Run:

```bash
npm test -- src/App.test.tsx -t "full launch package contact"
npm test -- src/server/marketing/lead-capture.test.ts -t "qualification"
```

Expected: both commands pass.

## Task 3: Docs And Full Verification

**Files:**
- Create: `docs/marketing/research/2026-06-02-launch-package-intent-qualification.md`
- Modify: `docs/plans/2026-06-01-quickfork-growth-lifecycle-prioritization.md`
- Modify: `/Users/moose/Documents/Moose's Birth ID/QuickFork/SEO Growth/2026-06-01 QuickFork Cold Start Launch Growth Iteration.md`

- [ ] **Step 1: Document growth contract**

Create a research note with hypothesis, lifecycle, target user, CTA, primary metric, guardrail, evidence gap, changed surface, implementation evidence, and next validation step.

- [ ] **Step 2: Update lifecycle docs and Obsidian mirror**

Append the slice summary and test evidence. Label this as monetization learning, not validated demand.

- [ ] **Step 3: Full verification**

Run:

```bash
git diff --check
npm test
npm run build
```

Expected: all pass.

## Task 4: Publish

- [ ] **Step 1: Commit and push**

Commit:

```bash
git add src/App.test.tsx src/components/marketing/LeadCaptureForm.tsx src/server/marketing/lead-capture.test.ts src/server/marketing/lead-capture.ts src/styles/app.css docs/marketing/research/2026-06-02-launch-package-intent-qualification.md docs/plans/2026-06-01-quickfork-growth-lifecycle-prioritization.md docs/superpowers/plans/2026-06-02-launch-package-intent-qualification.md
git commit -m "feat: qualify launch package requests"
git push -u origin feature/launch-package-intent-qualification
```

- [ ] **Step 2: Open PR, merge after CI, production smoke**

Open a PR to `main`, merge after `Test and build` passes, wait for production deploy, then smoke-test `/contact?intent=launch-package` route status and bundle strings for qualification fields.

---

## Self-Review

- Spec coverage: The plan covers target user, monetization signal, CRM qualification, PII-safe analytics, docs, tests, and publish verification.
- Placeholder scan: No TODO/TBD placeholders remain.
- Type consistency: `qualification`, `launchTimeline`, `packageScope`, `humanReviewNeeded`, `repoFullName`, and `full_launch_package` are consistent across tests, form, server, and docs.
