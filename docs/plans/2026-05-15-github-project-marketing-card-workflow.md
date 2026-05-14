# GitHub Project Marketing Card Workflow Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Complete the fine-grained QuickFork workflow that turns a GitHub repository URL into a source-backed project marketing card package.

**Architecture:** Keep the public API route and frontend unchanged while tightening internal generation modules behind the existing `CreateGenerationInput` and `GenerationResponse` contracts. Each stage owns one concern: source resolution, README extraction, asset ranking, brief construction, copy, prompt, image execution, QA, and manifest assembly.

**Tech Stack:** Vite, React, TypeScript, Vitest, Node fetch, existing `src/server/generation/*` modules.

**Scope Fence:** Do not modify `src/App.tsx`, `src/components/landing/HeroSection.tsx`, `src/components/studio/ProductStudio.tsx`, or other frontend components. Do not change the public request contract in `api/generations.ts` unless a later task explicitly approves a contract migration.

## Task 1: Lock the Workflow Contract

**Files:**
- Modify: `src/server/generation/types.ts`
- Test: `src/server/generation/generation.test.ts`
- Reference: `docs/specs/2026-05-15-github-project-marketing-card-workflow.md`

**Step 1: Write contract tests**

Add assertions that a mock generation response includes:

- Stage order from `repo` through `manifest`.
- `artifactRoot`, `briefPath`, and `manifestPath`.
- `primaryIdentityAsset`.
- `localizedCopy.en`, `localizedCopy.zh`, and `localizedCopy.ja`.
- Per-locale `promptPath`, `imagePath`, and `qualityReportPath`.
- `manifest.safety.noRemotePush === true`.

**Step 2: Run the focused test**

```bash
npm test -- src/server/generation/generation.test.ts
```

Expected: test fails only where the existing contract lacks the newly asserted field or safety detail.

**Step 3: Make minimal type or manifest updates**

Only add fields that already exist conceptually in the workflow. Do not add frontend state or API input fields.

**Step 4: Verify**

```bash
npm test -- src/server/generation/generation.test.ts
```

Expected: generation tests pass.

## Task 2: Harden GitHub Source Resolution

**Files:**
- Modify: `src/server/generation/repo.ts`
- Modify: `src/server/generation/repository-source.ts`
- Test: `src/server/generation/generation.test.ts`

**Step 1: Add tests**

Cover:

- `.git` suffix stripping.
- Non-GitHub URL rejection.
- Metadata fetch normalization.
- README fallback order: default branch, `main`, `master`, Jina GitHub mirror.
- Fallback source writes warnings rather than pretending data is verified.

**Step 2: Run focused tests**

```bash
npm test -- src/server/generation/generation.test.ts
```

Expected: new fallback-order tests fail until implemented.

**Step 3: Implement source resolver changes**

Keep fetch and fallback logic in `repository-source.ts`. Do not move HTTP handling into `orchestrator.ts`.

**Step 4: Verify**

```bash
npm test -- src/server/generation/generation.test.ts
```

Expected: all source-resolution cases pass.

## Task 3: Improve README Signal Extraction

**Files:**
- Modify: `src/server/generation/readme.ts`
- Test: `src/server/generation/generation.test.ts`

**Step 1: Add tests**

Cover:

- Shields/badge images do not become metrics.
- Meaningful numeric bullets are preserved.
- README images are classified as `logo`, `banner`, `hero`, `screenshot`, `diagram`, `badge`, `demo`, or `unknown`.
- Official links are deduplicated.

**Step 2: Run focused tests**

```bash
npm test -- src/server/generation/generation.test.ts
```

Expected: badge filtering and extraction edge cases fail if missing.

**Step 3: Implement extraction changes**

Keep the extractor deterministic and string-based unless a real parser is already available. Do not add dependencies for this pass.

**Step 4: Verify**

```bash
npm test -- src/server/generation/generation.test.ts
```

Expected: README extraction tests pass.

## Task 4: Make Brand Asset Ranking Traceable

**Files:**
- Modify: `src/server/generation/assets.ts`
- Test: `src/server/generation/generation.test.ts`

**Step 1: Add tests**

Cover priority order:

1. Explicit future supplied logo, if contract support is approved later.
2. README or repo official logo.
3. README banner or hero as supporting asset, not identity unless logo absent and confidence is documented.
4. GitHub owner avatar fallback.

Also assert:

- GitHub logo is never selected as project identity.
- Candidate assets include `confidence` and `reason`.
- Stored assets include source URL and local path.

**Step 2: Run focused tests**

```bash
npm test -- src/server/generation/generation.test.ts
```

Expected: tests fail where ranking or evidence is incomplete.

**Step 3: Implement ranking only**

Do not change prompt structure yet. Do not download assets once per locale.

**Step 4: Verify**

```bash
npm test -- src/server/generation/generation.test.ts
```

Expected: brand asset tests pass.

## Task 5: Keep Brief Construction Evidence-Backed

**Files:**
- Modify: `src/server/generation/brief.ts`
- Test: `src/server/generation/generation.test.ts`

**Step 1: Add tests**

Cover:

- Metrics come from README or repo metadata.
- No benchmark appears unless present in source signals.
- Weak evidence uses cautious wording.
- Brief has max 4 metrics, 3 insights, and 3 workflow steps.
- `sourceSignals.readmeEvidence` references selected claims.

**Step 2: Run focused tests**

```bash
npm test -- src/server/generation/generation.test.ts
```

Expected: tests fail if brief over-selects claims or drops evidence.

**Step 3: Implement minimal brief selection**

Keep business rules in `brief.ts`. Avoid LLM-only facts unless they can be traced to `readme.ts` or metadata.

**Step 4: Verify**

```bash
npm test -- src/server/generation/generation.test.ts
```

Expected: brief tests pass.

## Task 6: Stabilize Narrative, Visual, and Locale Slots

**Files:**
- Modify: `src/server/generation/visual.ts`
- Modify: `src/server/generation/copy.ts`
- Test: `src/server/generation/generation.test.ts`

**Step 1: Add tests**

Cover:

- DevTool, design tool, AI infra, model benchmark, agent tool, and open-source alternative categories.
- English, Chinese, and Japanese keep equal metric, feature, and workflow slot counts.
- Brand name and GitHub URL do not translate.
- Chinese copy keeps key technical terms when appropriate.

**Step 2: Run focused tests**

```bash
npm test -- src/server/generation/generation.test.ts
```

Expected: tests fail for any unsupported category or slot mismatch.

**Step 3: Implement deterministic category mapping**

Keep visual categorization in `visual.ts`; keep localized text in `copy.ts`. Do not put visual rules in prompt assembly.

**Step 4: Verify**

```bash
npm test -- src/server/generation/generation.test.ts
```

Expected: narrative and localization tests pass.

## Task 7: Tighten Prompt and Provider Request Boundaries

**Files:**
- Modify: `src/server/generation/prompt.ts`
- Test: `src/server/generation/generation.test.ts`

**Step 1: Add prompt tests**

Assert generated prompt includes:

- Asset type and use case.
- Source-backed identity rule.
- Exact local identity asset path.
- Exact headline, subtitle, metrics, features, workflow, and GitHub strip text.
- Hard constraints against fake logos, fake badges, unrelated symbols, URL translation, and fake screenshots.

**Step 2: Add provider body tests**

Assert `buildWavespeedImageRequest` maps:

- `preset` to aspect ratio.
- `imageQuality` to WaveSpeed quality.
- `output_format` to `png`.
- `enable_sync_mode` and `enable_base64_output` to `false`.

**Step 3: Run focused tests**

```bash
npm test -- src/server/generation/generation.test.ts
```

Expected: prompt missing any required section fails.

**Step 4: Implement minimal prompt updates**

Keep provider body construction in `prompt.ts`. Do not call fetch here.

**Step 5: Verify**

```bash
npm test -- src/server/generation/generation.test.ts
```

Expected: prompt and provider request tests pass.

## Task 8: Strengthen Image Execution and Artifact Persistence

**Files:**
- Modify: `src/server/generation/image-generator.ts`
- Test: `src/server/generation/generation.test.ts`

**Step 1: Add tests**

Cover:

- Mock image writes prompt and image placeholder per locale.
- WaveSpeed completed response saves returned image URL.
- WaveSpeed processing response polls result URL.
- Poll URL can be derived from request id.
- Provider failure returns a structured generation failure.
- Prompt file is still saved for debugging when image generation fails after prompt construction.

**Step 2: Run focused tests**

```bash
npm test -- src/server/generation/generation.test.ts
```

Expected: missing failure-path persistence tests fail.

**Step 3: Implement persistence and error handling**

Keep provider fetch and polling in `image-generator.ts`. Do not mutate orchestrator except to pass options already supported by the module.

**Step 4: Verify**

```bash
npm test -- src/server/generation/generation.test.ts
```

Expected: image execution tests pass.

## Task 9: Make QA Actionable but Deterministic

**Files:**
- Modify: `src/server/generation/quality.ts`
- Test: `src/server/generation/generation.test.ts`

**Step 1: Add tests**

Cover:

- Identity asset traceability.
- GitHub strip URL exactness.
- Locale slot preservation.
- Metrics match curated brief.
- Revision prompt contains only minimal correction instructions.
- QA status becomes `needs_revision` when a deterministic check fails.

**Step 2: Run focused tests**

```bash
npm test -- src/server/generation/generation.test.ts
```

Expected: revision prompt cases fail if currently too generic.

**Step 3: Implement deterministic QA**

Do not add OCR or another LLM call in this task. Visual QA remains a later optional layer.

**Step 4: Verify**

```bash
npm test -- src/server/generation/generation.test.ts
```

Expected: QA tests pass.

## Task 10: Verify Orchestration Without Frontend Changes

**Files:**
- Modify: `src/server/generation/orchestrator.ts`
- Test: `src/server/generation/generation.test.ts`
- Test: `api/generations.test.ts`

**Step 1: Add integration tests**

Cover:

- Full mock generation writes the artifact tree.
- Full WaveSpeed stub path records model calls.
- Manifest includes warnings, safety flags, stages, model calls, locale list, outputs, and quality reports.
- Existing API request body continues to normalize without requiring new frontend fields.

**Step 2: Run focused tests**

```bash
npm test -- api/generations.test.ts src/server/generation/generation.test.ts
```

Expected: failures identify only orchestration or manifest gaps.

**Step 3: Implement orchestration glue**

Only sequence existing module outputs. Do not put parsing, asset ranking, visual selection, prompt text rules, or provider payload rules in `orchestrator.ts`.

**Step 4: Verify**

```bash
npm test -- api/generations.test.ts src/server/generation/generation.test.ts
```

Expected: API and generation tests pass.

## Task 11: Preserve Current Frontend Behavior

**Files:**
- Test: `src/App.test.tsx`
- Test: `src/components/landing/hero-video.test.ts`

**Step 1: Run frontend tests**

```bash
npm test -- src/App.test.tsx src/components/landing/hero-video.test.ts
```

Expected: tests pass without modifying frontend code.

**Step 2: If tests fail**

Only inspect whether failures are caused by changed backend response assumptions. Prefer adapting test fixtures or generation response shape inside server tests before touching frontend code.

**Step 3: Verify no frontend diff**

```bash
git diff -- src/App.tsx src/components/landing/HeroSection.tsx src/components/studio/ProductStudio.tsx src/styles/app.css
```

Expected: no new diff from this workflow work.

## Task 12: End-to-End Local Smoke Test

**Files:**
- No source changes expected.
- Generated artifacts under `output/project-launch/*`.

**Step 1: Run all tests**

```bash
npm test
```

Expected: all tests pass.

**Step 2: Build**

```bash
npm run build
```

Expected: TypeScript and Vite build pass.

**Step 3: Manual mock generation**

```bash
npm run dev
```

Then:

```bash
curl -sS -X POST http://localhost:5173/api/generations \
  -H 'Content-Type: application/json' \
  -d '{"repoUrl":"https://github.com/QwenLM/FlashQLA","locales":["en","zh","ja"],"provider":"mock","preset":"3:2","imageQuality":"low"}'
```

Expected:

- HTTP 201.
- `artifactRoot` points to `output/project-launch/qwenlm-flashqla`.
- `manifest.json` exists.
- `project_brief_curated.json` exists.
- `en`, `zh`, and `ja` each contain prompt, image, and quality report.

**Step 4: Optional WaveSpeed smoke test**

Only run when `WAVESPEED_API_KEY` is available and the user explicitly wants provider verification.

```bash
curl -sS -X POST http://localhost:5173/api/generations \
  -H 'Content-Type: application/json' \
  -d '{"repoUrl":"https://github.com/QwenLM/FlashQLA","locales":["en"],"provider":"wavespeed","preset":"3:2","imageQuality":"low"}'
```

Expected:

- Model calls record `openai/gpt-5.5` and `openai/gpt-image-2/text-to-image`.
- Output includes a real `imageUrl` or saved image path.
- No credentials appear in response or artifacts.

## Task 13: Commit Hygiene

**Files:**
- Depends on actual implementation diff.

**Step 1: Inspect diff**

```bash
git status --short
git diff --check
```

Expected: no whitespace errors; frontend files unchanged unless separately authorized.

**Step 2: Run final verification**

```bash
npm test
npm run build
```

Expected: both pass.

**Step 3: Commit only approved files**

```bash
git add src/server/generation api/generations.test.ts docs/specs/2026-05-15-github-project-marketing-card-workflow.md docs/plans/2026-05-15-github-project-marketing-card-workflow.md
git commit -m "docs: plan github project marketing card workflow"
```

Expected: commit contains no generated output and no unauthorized frontend changes.

## Parallelization Notes

Sequential dependencies:

- Task 1 before all implementation tasks.
- Task 2 before Tasks 3-5.
- Tasks 3, 4, and 5 can proceed independently after source resolution is stable.
- Tasks 6 and 7 depend on brief and asset contracts.
- Tasks 8 and 9 can proceed after prompt contract is stable.
- Task 10 integrates all internal modules.

Parallel-safe work slices:

- README extraction tests and asset ranking tests.
- Brief construction and visual category tests.
- Prompt contract tests and QA tests.

Do not parallelize changes to `types.ts` and `orchestrator.ts`; those are shared integration points.

## Non-Goals

- No frontend redesign.
- No change to Hero form fields.
- No public API contract migration.
- No new provider.
- No new database schema.
- No social publishing.
- No automatic source repository modification.
- No generated artifact commit by default.
