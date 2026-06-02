# Launch Package Fit Score Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Turn full launch package qualification fields into a deterministic CRM-side fit score for prioritizing monetization interviews and scoped package follow-up.

**Architecture:** Add a focused server-side scorer for launch-package qualification. Lead capture uses it only for `full_launch_package` sales contacts, stores a safe `packageFit` object on the CRM activity, and uses the score to improve lead fit/engagement without exposing raw notes, email, repo URL, or pricing claims to browser analytics.

**Tech Stack:** TypeScript, Vitest, QuickFork mock CRM adapter.

---

### Task 1: Add RED Tests

**Files:**
- Create: `src/server/marketing/launch-package-fit.test.ts`
- Modify: `src/server/marketing/lead-capture.test.ts`

- [x] **Step 1: Add scorer test**

Create a test that expects a high-intent qualification with GitHub repo, within-30-day timeline, single-launch model, launch deadline trigger, all package scopes, and human review to return score `91`, tier `high`, recommended next step `sales_interview`, and safe reason codes.

- [x] **Step 2: Add lead capture integration expectations**

Update the full launch package CRM test to expect the lead to have `fitScore: 91`, `engagementScore: 90`, a non-PII `qualificationReason`, and the activity to include `packageFit` without raw notes or raw repo URL.

- [x] **Step 3: Run RED verification**

Run:

```bash
npm test -- src/server/marketing/launch-package-fit.test.ts src/server/marketing/lead-capture.test.ts -t "launch package fit|full launch package qualification"
```

Expected: fail because `launch-package-fit.ts` does not exist and lead capture does not compute package fit.

Observed:

- `src/server/marketing/launch-package-fit.test.ts` failed because `./launch-package-fit` did not exist.
- `src/server/marketing/lead-capture.test.ts` failed because the full launch package lead still had default `fitScore: 60`, `engagementScore: 70`, and no `qualificationReason`.

### Task 2: Implement Server-Side Fit Scoring

**Files:**
- Create: `src/server/marketing/launch-package-fit.ts`
- Modify: `src/server/marketing/lead-capture.ts`

- [x] **Step 1: Create `scoreLaunchPackageFit`**

Implement deterministic scoring from structured fields only:

- `repoFullName`: +15
- `launchTimeline`: within 7 days +20, within 30 days +16, this quarter +10, exploring +4
- `packageModel`: team/agency +20, recurring launches +18, single launch +12, human review add-on +10
- `buyingTrigger`: launch deadline +18, repeat launch workflow +18, Product Hunt prep +16, investor/demo day +15, client handoff +14
- `packageScope`: 5+ scopes +20, 3-4 scopes +14, 1-2 scopes +8
- `humanReviewNeeded`: +10

Tier: `high` at 75+, `medium` at 45+, otherwise `low`.

- [x] **Step 2: Connect lead capture**

For `requestType=full_launch_package` or `contactReason=full_launch_package`, compute package fit and store:

```ts
packageFit: {
  score,
  tier,
  recommendedNextStep,
  reasonCodes,
}
```

Use package fit to raise lead `fitScore` and `engagementScore`, and add a short safe `qualificationReason`.

- [x] **Step 3: Run GREEN verification**

Run the RED command again. Expected: selected tests pass.

Observed:

- `npm test -- src/server/marketing/launch-package-fit.test.ts src/server/marketing/lead-capture.test.ts -t "launch package fit|full launch package qualification"`: 2 files passed, 2 selected tests passed.

### Task 3: Update Growth Logs And Verify

**Files:**
- Modify: `docs/plans/2026-06-01-quickfork-growth-lifecycle-prioritization.md`
- Modify: `/Users/moose/Documents/Moose's Birth ID/QuickFork/SEO Growth/2026-06-01 QuickFork Cold Start Launch Growth Iteration.md`

- [x] **Step 1: Record the scoring slice**

Append hypothesis, lifecycle stage, metric, guardrail, evidence gap, RED/GREEN evidence, and decision.

- [x] **Step 2: Run final checks**

Run:

```bash
npm test -- src/server/marketing/launch-package-fit.test.ts src/server/marketing/lead-capture.test.ts
npm test
npm run build
git diff --check
```

Expected: all pass before committing and pushing.

Observed:

- `npm test -- src/server/marketing/launch-package-fit.test.ts src/server/marketing/lead-capture.test.ts`: 2 files passed, 6 tests passed.
- `npm test`: 23 files passed, 142 tests passed.
- `npm run build`: TypeScript build and Vite production build completed.
- `git diff --check`: no whitespace errors.
