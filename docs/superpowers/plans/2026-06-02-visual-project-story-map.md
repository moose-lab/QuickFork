# Visual Project Story Map Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add a source-backed visual project story map to the generated launch brief so users can quickly understand a repository before copying channel assets or requesting the full package.

**Architecture:** Extend `RepoLaunchBrief` with a deterministic `storyMap` object built from existing repo, README, brief, workflow, source-reference, and visual-direction data. Render the story map inside the existing launch brief panel with a copy action and PII-free analytics, then document it as a Visual Project Explainer activation/evaluation slice.

**Tech Stack:** TypeScript, React, Vitest, Testing Library, existing `trackEvent` analytics helper, existing launch brief generation pipeline.

---

## Growth Contract

- **Hypothesis:** If users see a compact source-backed story map after generation, they will understand the project faster and will be more likely to copy/export launch assets or request a full package.
- **Lifecycle stage:** Activation to Evaluation.
- **Target user:** AI project builders, open-source maintainers, DevRel operators, founders, and studios evaluating whether a technical repo can be turned into a public launch story.
- **Primary CTA:** Copy story map.
- **Primary metric:** `launch_story_map_copied` with `node_count` and `source_reference_count`.
- **Guardrail metric:** No raw README, raw story-map detail, raw artifact body, email, token, secret, unsupported customer proof, ranking claim, or revenue claim in browser analytics.
- **Evidence gap:** This proves the product can present and measure a visual understanding artifact; production value still requires copy/export rates, user feedback, and follow-up behavior.

## File Map

- Modify `src/server/generation/types.ts`: add story map node and story map interfaces, include `storyMap` in `RepoLaunchBrief`, and add `story_map` artifact type.
- Modify `src/server/generation/launch-brief.ts`: build deterministic story map nodes and add a markdown story-map artifact.
- Modify `src/server/generation/generation.test.ts`: verify story map contract, source-backed nodes, artifact export, and claim hygiene.
- Modify `src/components/landing/HeroSection.tsx`: add story map summary types, render story map nodes, serialize story map text, and track `launch_story_map_copied`.
- Modify `src/App.test.tsx`: verify story map UI, copy action, metadata-only analytics, and section count.
- Modify `src/lib/analytics.ts`: add `launch_story_map_copied`.
- Modify `src/styles/app.css`: style the story map inside the existing launch brief panel without introducing a nested card pattern.
- Modify `docs/plans/2026-06-01-quickfork-growth-lifecycle-prioritization.md`: document the activation/evaluation slice.
- Modify `/Users/moose/Documents/Moose's Birth ID/QuickFork/SEO Growth/2026-06-01 QuickFork Cold Start Launch Growth Iteration.md`: mirror the decision and evidence.

## Task 1: RED Backend Contract Test

- [ ] **Step 1: Add failing backend expectations**

Extend `returns a source-backed free repo launch brief for activation` in `src/server/generation/generation.test.ts` with:

```ts
expect(result.launchBrief.storyMap.title).toContain("open-design");
expect(result.launchBrief.storyMap.nodes.map((node) => node.id)).toEqual([
  "source",
  "audience",
  "workflow",
  "proof",
  "launch",
]);
expect(result.launchBrief.storyMap.nodes[0]).toEqual(
  expect.objectContaining({
    label: "Source",
    title: expect.stringContaining("Repository evidence"),
    source: expect.stringContaining("README or repo metadata includes"),
  }),
);
expect(result.launchBrief.storyMap.nodes[2]?.detail).toContain("->");
expect(result.launchBrief.artifacts.map((artifact) => artifact.type)).toEqual([
  "story_map",
  "readme",
  "social",
  "deck",
  "outreach",
  "visual",
]);
expect(result.launchBrief.artifacts).toEqual(
  expect.arrayContaining([
    expect.objectContaining({
      type: "story_map",
      label: "Project story map",
      fileName: "nexu-io-open-design-project-story-map.md",
      body: expect.stringContaining("## Project story map"),
      sourceReferences: expect.arrayContaining([expect.stringContaining("README or repo metadata includes")]),
    }),
  ]),
);
```

- [ ] **Step 2: Run backend RED**

Run:

```bash
npm test -- src/server/generation/generation.test.ts -t "source-backed free repo launch brief"
```

Expected: FAIL because `storyMap` and `story_map` artifact do not exist.

## Task 2: RED Frontend Story Map Test

- [ ] **Step 1: Add mocked story map payload**

In `src/App.test.tsx`, add `storyMap` to the mocked `launchBrief`:

```ts
storyMap: {
  title: "QwenLM/FlashQLA launch story map",
  summary: "Source-backed visual interpretation for CUDA attention kernels.",
  nodes: [
    {
      id: "source",
      label: "Source",
      title: "Repository evidence",
      detail: "README describes optimized attention kernels.",
      source: "README or repo metadata includes: Optimizes attention kernels for lower latency inference.",
    },
    {
      id: "audience",
      label: "Audience",
      title: "AI project builders",
      detail: "Builders evaluating inference performance work.",
      source: "Audience hypothesis from repo metadata and topics.",
    },
    {
      id: "workflow",
      label: "Workflow",
      title: "Install to benchmark",
      detail: "Install kernels -> Run benchmark -> Ship inference",
      source: "Workflow steps from launch brief.",
    },
  ],
},
```

- [ ] **Step 2: Add UI and analytics expectations**

Add expectations after `briefRegion` is found:

```ts
expect(within(briefRegion).getByText(/Project story map/i)).toBeInTheDocument();
expect(within(briefRegion).getByText(/Source-backed visual interpretation/i)).toBeInTheDocument();
expect(within(briefRegion).getByText(/Install to benchmark/i)).toBeInTheDocument();
```

Click the new copy action:

```ts
fireEvent.click(within(briefRegion).getByRole("button", { name: /copy story map/i }));
expect(navigator.clipboard.writeText).toHaveBeenCalledWith(expect.stringContaining("Project story map"));
```

Add analytics expectation:

```ts
expect.objectContaining({
  event: "launch_story_map_copied",
  repo_full_name: "QwenLM/FlashQLA",
  generation_id: "gen_qwenlm_flashqla_test",
  node_count: 3,
  source_reference_count: 1,
})
```

Update `launch_brief_viewed` expectation to `brief_sections: 7`.

- [ ] **Step 3: Run frontend RED**

Run:

```bash
npm test -- src/App.test.tsx -t "submits the Hero generator form"
```

Expected: FAIL because the UI does not render or copy story maps.

## Task 3: Implement Story Map Contract

- [ ] **Step 1: Update server types**

Add:

```ts
export type RepoLaunchStoryMapNodeId = "source" | "audience" | "workflow" | "proof" | "launch";

export interface RepoLaunchStoryMapNode {
  id: RepoLaunchStoryMapNodeId;
  label: string;
  title: string;
  detail: string;
  source: string;
}

export interface RepoLaunchStoryMap {
  title: string;
  summary: string;
  nodes: RepoLaunchStoryMapNode[];
}
```

Then update:

```ts
export type RepoLaunchBriefArtifactType = "story_map" | "readme" | "social" | "deck" | "outreach" | "visual";
```

and add `storyMap: RepoLaunchStoryMap;` to `RepoLaunchBrief`.

- [ ] **Step 2: Build story map nodes**

In `src/server/generation/launch-brief.ts`, derive `storyMap` from `metadata.fullName`, `brief.subtitle`, `audience`, `workflow`, `insights`, `visualDirection.category`, and `sourceReferences`.

- [ ] **Step 3: Add story map artifact**

Add the story map markdown artifact before README artifacts so story-map copy/download becomes the first visual-understanding export.

- [ ] **Step 4: Run backend GREEN**

Run:

```bash
npm test -- src/server/generation/generation.test.ts -t "source-backed free repo launch brief"
```

Expected: PASS.

## Task 4: Implement Story Map UI

- [ ] **Step 1: Update frontend types and analytics**

Add story map summary types in `HeroSection.tsx` and add `launch_story_map_copied` to `AnalyticsEventName`.

- [ ] **Step 2: Render story map**

Inside `LaunchBriefPanel`, render a `Project story map` section before export artifacts, using accessible list semantics and stable card-like nodes without nested page cards.

- [ ] **Step 3: Add copy action**

Add `Copy story map` button that writes a markdown version of the story map and tracks `launch_story_map_copied` with repo, generation, node count, and source-reference count only.

- [ ] **Step 4: Run frontend GREEN**

Run:

```bash
npm test -- src/App.test.tsx -t "submits the Hero generator form"
```

Expected: PASS.

## Task 5: Docs, Verification, Commit, Push

- [ ] **Step 1: Update repo and Obsidian growth logs**

Document hypothesis, lifecycle stage, target user, changed surface, CTA, metric, guardrail, evidence gap, observed evidence, and next action.

- [ ] **Step 2: Run verification**

Run:

```bash
npm test -- src/server/generation/generation.test.ts src/App.test.tsx src/lib/analytics.test.ts
npm test
npm run build
git diff --check
```

- [ ] **Step 3: Commit and push**

Run:

```bash
git add src/server/generation/types.ts src/server/generation/launch-brief.ts src/server/generation/generation.test.ts src/components/landing/HeroSection.tsx src/App.test.tsx src/lib/analytics.ts src/styles/app.css docs/plans/2026-06-01-quickfork-growth-lifecycle-prioritization.md docs/superpowers/plans/2026-06-02-visual-project-story-map.md
git diff --cached --check
git commit -m "feat: add visual project story map"
git -c http.version=HTTP/1.1 push
```

Do not stage the pre-existing untracked May validation docs unless explicitly requested.
