# Free Repo Launch Brief Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add a free repo launch brief to the QuickFork generation result so activated users see source-backed launch value immediately after submitting a GitHub URL.

**Architecture:** Extend the existing generation pipeline with a deterministic `launchBrief` artifact derived from `ProjectBrief`, `ReadmeContext`, `LocalizedCardCopy`, and `VisualDirection`. Render the brief in the Hero generator result panel and track viewed/copied events without storing raw README or PII.

**Tech Stack:** TypeScript, React, Vitest, Testing Library, existing `trackEvent` analytics helper, existing `/api/generations` contract.

---

### Task 1: Backend Launch Brief Contract

**Files:**
- Modify: `src/server/generation/types.ts`
- Create: `src/server/generation/launch-brief.ts`
- Modify: `src/server/generation/orchestrator.ts`
- Test: `src/server/generation/generation.test.ts`

- [ ] **Step 1: Write the failing test**

Add a test in `src/server/generation/generation.test.ts` after the existing project brief tests:

```ts
it("returns a source-backed free repo launch brief for activation", async () => {
  const outputRoot = await mkdtemp(join(tmpdir(), "quickfork-brief-"));

  try {
    const result = await runProjectLaunchGeneration({
      repoUrl: "https://github.com/nexu-io/open-design",
      provider: "mock",
      outputRoot,
      mock: {
        repoMetadata: openDesignMetadata,
        readmeMarkdown: openDesignReadme,
      },
    });

    expect(result.launchBrief.summary).toContain("Open-source Claude Design alternative");
    expect(result.launchBrief.audienceHypothesis).toContain("Open-source maintainers");
    expect(result.launchBrief.readmeChecklist).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          item: expect.stringContaining("README"),
          source: expect.stringContaining("repository evidence"),
        }),
      ]),
    );
    expect(result.launchBrief.launchAngles).toHaveLength(3);
    expect(result.launchBrief.deckOutline).toHaveLength(4);
    expect(result.launchBrief.socialPost).toContain("github.com/nexu-io/open-design");
    expect(result.launchBrief.visualExplainerPrompt).toContain("workflow_diagram");
    expect(result.launchBrief.sourceReferences.join("\\n")).toContain("README or repo metadata includes");
    expect(JSON.stringify(result.launchBrief)).not.toMatch(/best|guaranteed|customers|revenue/i);
  } finally {
    await rm(outputRoot, { recursive: true, force: true });
  }
});
```

- [ ] **Step 2: Run the test to verify it fails**

Run:

```bash
npm test -- src/server/generation/generation.test.ts -t "source-backed free repo launch brief"
```

Expected: FAIL because `launchBrief` does not exist on `GenerationResponse`.

- [ ] **Step 3: Add the contract and deterministic builder**

Create `src/server/generation/launch-brief.ts` with:

```ts
import type { GitHubRepoMetadata, LocalizedCardCopy, ProjectBrief, ReadmeContext, RepoLaunchBrief, VisualDirection } from "./types.js";

export function buildRepoLaunchBrief(input: {
  metadata: GitHubRepoMetadata;
  readme: ReadmeContext;
  brief: ProjectBrief;
  localizedCopy: LocalizedCardCopy;
  visualDirection: VisualDirection;
}): RepoLaunchBrief {
  const repoUrl = `github.com/${input.metadata.fullName}`;
  const sourceReferences = input.brief.sourceSignals.readmeEvidence.slice(0, 6);
  const insights = input.brief.keyInsights.slice(0, 3);
  const workflow = input.brief.workflowSteps.slice(0, 3);

  return {
    summary: input.brief.subtitle,
    audienceHypothesis: audienceHypothesis(input.metadata),
    readmeChecklist: [
      { item: "Lead with a one-sentence README value proposition.", source: "Derived from repository evidence and README positioning." },
      { item: "Show the top source-backed features before implementation detail.", source: sourceReferences[0] ?? "Repository evidence is thin; review before publishing." },
      { item: "Add a visual project explainer near the top of the README.", source: `${input.visualDirection.category} visual direction from repository signals.` },
      { item: "Keep metrics and claims tied to README or repo metadata.", source: sourceReferences[1] ?? "No strong metric evidence found; avoid invented proof." },
    ],
    launchAngles: insights.map((insight, index) => ({
      title: `Launch angle ${index + 1}`,
      body: insight,
      source: sourceReferences[index] ?? "Source evidence is limited; validate this angle manually.",
    })),
    socialPost: `${input.localizedCopy.hook}\\n\\n${input.localizedCopy.valueProposition}\\n\\n${repoUrl}`,
    deckOutline: [
      `Problem: ${input.brief.title} is hard to understand from raw repository context.`,
      `What it does: ${input.brief.subtitle}`,
      `Why it matters: ${insights[0] ?? "Source-backed project story for launch review."}`,
      `Workflow: ${workflow.join(" -> ") || "Brief -> Generate -> Review"}`,
    ],
    outreachDraft: `Hi, I found ${input.brief.title} and put together a source-backed launch brief from ${repoUrl}. The draft focuses on ${insights[0] ?? input.brief.subtitle}.`,
    visualExplainerPrompt: `Create a ${input.visualDirection.category} ${input.localizedCopy.locale} visual explainer using ${input.visualDirection.layout.join(", ")}. Keep the GitHub strip as ${repoUrl}.`,
    sourceReferences,
  };
}

function audienceHypothesis(metadata: GitHubRepoMetadata) {
  const corpus = [metadata.description ?? "", metadata.language ?? "", ...metadata.topics].join(" ").toLowerCase();
  if (/agent|ai|model|llm|inference|cuda/.test(corpus)) return "AI project builders, open-source maintainers, and technical founders evaluating launch readiness.";
  if (/design|creative|visual/.test(corpus)) return "Open-source maintainers, design tool builders, and product teams packaging a technical launch.";
  return "Open-source maintainers, DevRel teams, and indie technical founders preparing a public launch.";
}
```

Also extend `RepoLaunchBrief` and `GenerationResponse` in `src/server/generation/types.ts`, and set `launchBrief: buildRepoLaunchBrief({ metadata, readme, brief, localizedCopy: localizedCopy.en, visualDirection })` in `runProjectLaunchGeneration`.

- [ ] **Step 4: Run the backend test to verify it passes**

Run:

```bash
npm test -- src/server/generation/generation.test.ts -t "source-backed free repo launch brief"
```

Expected: PASS.

### Task 2: Frontend Brief Panel And Analytics

**Files:**
- Modify: `src/components/landing/HeroSection.tsx`
- Modify: `src/lib/analytics.ts`
- Modify: `src/App.test.tsx`
- Modify: `src/styles/app.css`

- [ ] **Step 1: Write the failing frontend test**

Extend `submits the Hero generator form to the backend generation API` in `src/App.test.tsx` by adding a `launchBrief` object to the mocked response and these assertions after generation completes:

```ts
expect(await screen.findByRole("region", { name: /free repo launch brief/i })).toBeInTheDocument();
expect(screen.getByText(/AI project builders, open-source maintainers/i)).toBeInTheDocument();
expect(screen.getByText(/Lead with a one-sentence README value proposition/i)).toBeInTheDocument();
expect(screen.getByText(/Launch angle 1/i)).toBeInTheDocument();
expect(screen.getByText(/Create a ai_kernel_infra visual explainer/i)).toBeInTheDocument();
expect(window.dataLayer).toEqual(
  expect.arrayContaining([
    expect.objectContaining({
      event: "launch_brief_viewed",
      repo_full_name: "QwenLM/FlashQLA",
      generation_id: "gen_qwenlm_flashqla_test",
      brief_sections: 6,
    }),
  ]),
);
```

Add a copy assertion:

```ts
Object.assign(navigator, { clipboard: { writeText: vi.fn(async () => undefined) } });
fireEvent.click(screen.getByRole("button", { name: /copy launch brief/i }));
expect(navigator.clipboard.writeText).toHaveBeenCalledWith(expect.stringContaining("Free repo launch brief"));
expect(window.dataLayer).toEqual(
  expect.arrayContaining([
    expect.objectContaining({
      event: "launch_brief_copied",
      repo_full_name: "QwenLM/FlashQLA",
      generation_id: "gen_qwenlm_flashqla_test",
      artifact_type: "free_repo_launch_brief",
    }),
  ]),
);
```

- [ ] **Step 2: Run the frontend test to verify it fails**

Run:

```bash
npm test -- src/App.test.tsx -t "submits the Hero generator form"
```

Expected: FAIL because no launch brief region or analytics events exist.

- [ ] **Step 3: Implement the panel and events**

Add `launch_brief_viewed` and `launch_brief_copied` to `AnalyticsEventName`.

Extend the frontend `GenerationSummary` with `launchBrief?: RepoLaunchBriefSummary` and render a `LaunchBriefPanel` below the generated preview. The panel should show summary, audience, checklist, launch angles, social post, deck outline, outreach draft, visual prompt, and source references. On first render for a generation, call `trackEvent("launch_brief_viewed", ...)`. On copy, write a text export and call `trackEvent("launch_brief_copied", ...)`.

- [ ] **Step 4: Run the frontend test to verify it passes**

Run:

```bash
npm test -- src/App.test.tsx -t "submits the Hero generator form"
```

Expected: PASS.

### Task 3: Verification, Docs Mirror, Commit

**Files:**
- Modify: `/Users/moose/Documents/Moose's Birth ID/QuickFork/SEO Growth/2026-06-01 QuickFork Cold Start Launch Growth Iteration.md`

- [ ] **Step 1: Run targeted tests**

```bash
npm test -- src/server/generation/generation.test.ts src/App.test.tsx src/lib/analytics.test.ts
```

Expected: PASS.

- [ ] **Step 2: Run full checks**

```bash
npm test
npm run build
git diff --check
```

Expected: PASS / no whitespace errors.

- [ ] **Step 3: Update Obsidian mirror**

Append a 2026-06-02 entry noting:

- Hypothesis: free repo brief increases activation after repo submission.
- Lifecycle stage: Activation.
- Changed surface: `/api/generations`, hero generator result, analytics.
- Metric: `launch_brief_viewed`, `launch_brief_copied`, generation completion.
- Guardrail: unsupported claims, copy failures, repo scan failures.

- [ ] **Step 4: Commit and push**

```bash
git add src/server/generation/types.ts src/server/generation/launch-brief.ts src/server/generation/orchestrator.ts src/server/generation/generation.test.ts src/components/landing/HeroSection.tsx src/lib/analytics.ts src/App.test.tsx src/styles/app.css docs/superpowers/plans/2026-06-02-free-repo-launch-brief.md
git commit -m "feat: add free repo launch brief"
git -c http.version=HTTP/1.1 push
```

Expected: branch updates `origin/feature/cold-start-launch-growth`.
