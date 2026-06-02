# Paid Intent Package Qualification Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Make the full launch package request capture stronger paid-product signals without publishing exact pricing.

**Architecture:** Extend the existing contact intent flow for `/contact?intent=launch-package`. The browser form collects package model and buying trigger enums, the API normalizes them into the CRM qualification object, analytics keeps only PII-free metadata, and the growth docs record the hypothesis and evidence gap.

**Tech Stack:** React, TypeScript, Vitest, Testing Library, QuickFork mock CRM adapter.

---

### Task 1: Add RED Tests For Paid-Intent Fields

**Files:**
- Modify: `src/App.test.tsx`
- Modify: `src/server/marketing/lead-capture.test.ts`

- [x] **Step 1: Update the frontend test expectation**

In `src/App.test.tsx`, update the `submits full launch package contact requests as sales contact` test to select `Package model` and `Buying trigger`, then expect:

```ts
packageModel: "single_launch",
buyingTrigger: "launch_deadline",
```

inside `payload.qualification`, and expect browser analytics to include `package_model` and `buying_trigger` while still excluding the raw email address and raw launch notes.

- [x] **Step 2: Update the server normalization test**

In `src/server/marketing/lead-capture.test.ts`, update `preserves full launch package qualification in sales contact CRM activity` so the input qualification includes:

```ts
packageModel: "single_launch",
buyingTrigger: "launch_deadline",
```

and the CRM activity preserves those fields.

- [x] **Step 3: Run RED verification**

Run:

```bash
npm test -- src/App.test.tsx -t "full launch package contact"
npm test -- src/server/marketing/lead-capture.test.ts -t "full launch package qualification"
```

Observed: both failed. The frontend test could not find `Package model`, and the server test showed `packageModel` and `buyingTrigger` were missing from CRM qualification.

### Task 2: Implement Package Qualification Fields

**Files:**
- Modify: `src/components/marketing/LeadCaptureForm.tsx`
- Modify: `src/server/marketing/lead-capture.ts`

- [x] **Step 1: Extend the React form state and payload**

Add `packageModel` and `buyingTrigger` state fields for launch-package requests. Render two select inputs:

- `Package model`: `single_launch`, `recurring_launches`, `team_or_agency`, `human_review_addon`
- `Buying trigger`: `launch_deadline`, `product_hunt_prep`, `investor_or_demo_day`, `client_handoff`, `repeat_launch_workflow`

Include both fields in `qualification`.

- [x] **Step 2: Keep analytics safe**

In `getSafeQualificationAnalytics`, include only:

```ts
package_model: qualification.packageModel,
buying_trigger: qualification.buyingTrigger,
```

Do not include raw notes, repo URL, email, name, or full package scope values in browser analytics.

- [x] **Step 3: Extend server normalization**

In `src/server/marketing/lead-capture.ts`, add optional `packageModel` and `buyingTrigger` to `LeadQualificationInput` and preserve normalized strings in `normalizeQualification`.

- [x] **Step 4: Run GREEN verification**

Observed: `npm test -- src/App.test.tsx -t "full launch package contact"` and `npm test -- src/server/marketing/lead-capture.test.ts -t "full launch package qualification"` both passed.

### Task 3: Record The Growth Iteration

**Files:**
- Modify: `docs/plans/2026-06-01-quickfork-growth-lifecycle-prioritization.md`
- Modify: `/Users/moose/Documents/Moose's Birth ID/QuickFork/SEO Growth/2026-06-01 QuickFork Cold Start Launch Growth Iteration.md`

- [x] **Step 1: Append a 2026-06-02 paid-intent qualification slice**

Record:

- Hypothesis: package model and buying trigger fields help distinguish real paid intent from generic contact.
- Lifecycle stage: Monetization.
- Target user: launch-deadline founders, maintainers, DevRel operators, and studios.
- CTA: Request full launch package.
- Metric: `sales_contact_requested` segmented by package model and buying trigger.
- Guardrail: no exact pricing or raw PII in browser analytics.
- Evidence gap: field capture proves instrumentation, not willingness to pay.

- [x] **Step 2: Run final checks**

Run:

```bash
npm test -- src/App.test.tsx -t "full launch package contact"
npm test -- src/server/marketing/lead-capture.test.ts -t "full launch package qualification"
npm test -- src/seo/public-growth.test.ts
npm run build
git diff --check
```

Observed: affected tests passed with 3 files and 33 tests, full `npm test` passed with 22 files and 141 tests, `npm run build` completed, and `git diff --check` reported no whitespace errors.
