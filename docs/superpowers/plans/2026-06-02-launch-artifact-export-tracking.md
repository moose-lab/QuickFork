# Launch Artifact Export Tracking Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Turn the generated free repo launch brief into separate README, social, deck, outreach, and visual prompt artifacts that users can copy or download, while tracking PII-free artifact usage.

**Architecture:** Extend `RepoLaunchBrief` with deterministic text artifacts derived from the existing source-backed brief. Render an export rail inside the existing `LaunchBriefPanel`; each artifact gets a copy button, text download link, and analytics event that records artifact type and label without raw content.

**Tech Stack:** TypeScript, React, Vitest, Testing Library, existing `trackEvent` analytics helper, existing `/api/generations` response contract.

---

## Growth Contract

- **Hypothesis:** If activated users can export channel-specific launch artifacts after generation, QuickFork will expose stronger paid-intent and product-value signals than a single copied brief.
- **Lifecycle stage:** Activation to Evaluation.
- **Target user:** AI project builders, open-source maintainers, indie technical founders, and DevRel operators preparing public repository launches.
- **Primary CTA:** Copy or download a launch artifact.
- **Primary metric:** `launch_artifact_copied` and `launch_artifact_downloaded` by `artifact_type`.
- **Guardrail metric:** No raw README text, emails, tokens, secrets, unsupported customer claims, ranking claims, or revenue claims in analytics events.
- **Evidence gap:** The repo can prove events and UI behavior, but production adoption still needs GA4 and real user export-rate baselines.

## File Map

- Modify `src/server/generation/types.ts`: add artifact type and `RepoLaunchBriefArtifact`.
- Modify `src/server/generation/launch-brief.ts`: build deterministic artifacts from the existing brief.
- Modify `src/server/generation/generation.test.ts`: prove backend artifacts exist and stay source-backed.
- Modify `src/components/landing/HeroSection.tsx`: render artifact actions and track copy/download events.
- Modify `src/lib/analytics.ts`: add artifact event names.
- Modify `src/App.test.tsx`: prove artifact UI, copy events, download links, and event payloads.
- Modify `src/styles/app.css`: add compact export rail styling.
- Modify `docs/plans/2026-06-01-quickfork-growth-lifecycle-prioritization.md`: record the evaluation-stage slice.
- Modify `/Users/moose/Documents/Moose's Birth ID/QuickFork/SEO Growth/2026-06-01 QuickFork Cold Start Launch Growth Iteration.md`: mirror the growth iteration.

## Task 1: Backend Artifact Contract

**Files:**
- Modify: `src/server/generation/types.ts`
- Modify: `src/server/generation/launch-brief.ts`
- Test: `src/server/generation/generation.test.ts`

- [x] **Step 1: Write the failing backend test**

`src/server/generation/generation.test.ts` now expects:

```ts
expect(result.launchBrief.artifacts.map((artifact) => artifact.type)).toEqual([
  "readme",
  "social",
  "deck",
  "outreach",
  "visual",
]);
expect(result.launchBrief.artifacts).toEqual(
  expect.arrayContaining([
    expect.objectContaining({
      type: "readme",
      label: "README launch brief",
      fileName: "nexu-io-open-design-readme-launch-brief.md",
      body: expect.stringContaining("README checklist"),
      sourceReferences: expect.arrayContaining([expect.stringContaining("README or repo metadata includes")]),
    }),
    expect.objectContaining({
      type: "deck",
      label: "Pitch deck outline",
      body: expect.stringContaining("Problem:"),
    }),
  ]),
);
expect(JSON.stringify(result.launchBrief.artifacts)).not.toMatch(/guaranteed|customers|revenue|ranking/i);
```

- [x] **Step 2: Run the backend test and verify RED**

Run:

```bash
npm test -- src/server/generation/generation.test.ts -t "source-backed free repo launch brief"
```

Observed: FAIL because `launchBrief.artifacts` did not exist.

- [x] **Step 3: Implement minimal backend artifacts**

`RepoLaunchBrief` now includes:

```ts
export type RepoLaunchBriefArtifactType = "readme" | "social" | "deck" | "outreach" | "visual";

export interface RepoLaunchBriefArtifact {
  type: RepoLaunchBriefArtifactType;
  label: string;
  fileName: string;
  body: string;
  sourceReferences: string[];
}
```

`buildRepoLaunchBrief` now returns five deterministic artifacts:

- `README launch brief`
- `Social launch post`
- `Pitch deck outline`
- `Product outreach draft`
- `Visual explainer prompt`

- [x] **Step 4: Run the backend test and verify GREEN**

Run:

```bash
npm test -- src/server/generation/generation.test.ts -t "source-backed free repo launch brief"
```

Observed: PASS.

## Task 2: Frontend Artifact Actions And Analytics

**Files:**
- Modify: `src/components/landing/HeroSection.tsx`
- Modify: `src/lib/analytics.ts`
- Modify: `src/App.test.tsx`
- Modify: `src/styles/app.css`

- [x] **Step 1: Write the failing frontend test**

`src/App.test.tsx` now expects the generated brief region to render `Export artifacts`, a `Copy README launch brief` button, a `Download README launch brief` text link, and PII-free artifact events:

```ts
expect(within(briefRegion).getByText(/Export artifacts/i)).toBeInTheDocument();
expect(within(briefRegion).getByRole("button", { name: /copy README launch brief/i })).toBeInTheDocument();
expect(within(briefRegion).getByRole("link", { name: /download README launch brief/i })).toHaveAttribute(
  "download",
  "qwenlm-flashqla-readme-launch-brief.md",
);
expect(JSON.stringify(window.dataLayer)).not.toContain("README checklist");
```

- [x] **Step 2: Run the frontend test and verify RED**

Run:

```bash
npm test -- src/App.test.tsx -t "submits the Hero generator form"
```

Observed: FAIL because the free brief panel did not render artifact exports.

- [x] **Step 3: Implement artifact UI and events**

`AnalyticsEventName` now includes:

```ts
| "launch_artifact_copied"
| "launch_artifact_downloaded"
```

`LaunchBriefPanel` now renders one row per artifact with copy and download actions. Event payloads include repo properties, `generation_id`, `artifact_type`, `artifact_label`, `artifact_format`, and `source_reference_count`; they do not include raw artifact bodies.

- [x] **Step 4: Run the frontend test and verify GREEN**

Run:

```bash
npm test -- src/App.test.tsx -t "submits the Hero generator form"
```

Observed: PASS.

## Task 3: Docs, Verification, Commit, Push

**Files:**
- Modify: `docs/plans/2026-06-01-quickfork-growth-lifecycle-prioritization.md`
- Modify: `/Users/moose/Documents/Moose's Birth ID/QuickFork/SEO Growth/2026-06-01 QuickFork Cold Start Launch Growth Iteration.md`

- [x] **Step 1: Update repo and Obsidian mirrors**

Both docs now record:

- Hypothesis
- Lifecycle stage
- Target user
- Changed surface
- Primary metric
- Guardrail
- Evidence gap
- Next action

- [x] **Step 2: Run targeted tests**

Run:

```bash
npm test -- src/server/generation/generation.test.ts src/App.test.tsx src/lib/analytics.test.ts
```

Observed: 3 files passed, 54 tests passed.

- [x] **Step 3: Run full verification**

Run:

```bash
npm test
npm run build
git diff --check
```

Observed: `npm test` passed with 16 files and 108 tests. `npm run build` completed. `git diff --check` exited 0.

- [ ] **Step 4: Commit and push only this slice**

Run:

```bash
git status --short
git add docs/plans/2026-06-01-quickfork-growth-lifecycle-prioritization.md docs/superpowers/plans/2026-06-02-launch-artifact-export-tracking.md src/server/generation/types.ts src/server/generation/launch-brief.ts src/server/generation/generation.test.ts src/components/landing/HeroSection.tsx src/lib/analytics.ts src/App.test.tsx src/styles/app.css
git diff --cached --check
git commit -m "feat: track launch artifact exports"
git -c http.version=HTTP/1.1 push
```

Do not stage the pre-existing untracked May validation docs unless the user explicitly asks.
