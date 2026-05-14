# Spec: GitHub Project Marketing Card Workflow

## Objective

Build the core QuickFork product workflow: a user supplies a GitHub repository URL, and QuickFork produces a local, shareable project marketing card package for README, PPT, and social distribution.

This spec is intentionally scoped to workflow design and internal generation boundaries. It does not change the existing frontend surface or the public backend API call shape.

## Assumptions

1. The existing public request surface remains `POST /api/generations`.
2. The existing frontend form and output panels remain unchanged during this planning scope.
3. The generation workflow keeps `openai/gpt-5.5` for text planning and `openai/gpt-image-2/text-to-image` for image generation unless a later approved task changes model routing.
4. Generated artifacts continue to live under `output/project-launch/{owner}-{repo}/`.
5. The first production-quality target is correctness and traceability; throughput optimization is a second pass once the workflow is stable.

## Tech Stack

- Vite 7, React 19, TypeScript 5.9
- Vitest for unit and integration tests
- Node fetch for GitHub metadata, README, and provider calls
- Current generation modules under `src/server/generation/*`
- Current API route at `api/generations.ts`

## Commands

```bash
npm test
npm test -- api/generations.test.ts src/server/generation/generation.test.ts src/App.test.tsx
npm run build
```

Manual local verification, after implementation work is separately approved:

```bash
npm run dev
curl -sS -X POST http://localhost:5173/api/generations \
  -H 'Content-Type: application/json' \
  -d '{"repoUrl":"https://github.com/QwenLM/FlashQLA","locales":["en","zh","ja"],"provider":"mock","preset":"3:2","imageQuality":"low"}'
```

## Input Contract

Minimum input:

```json
{
  "repoUrl": "https://github.com/owner/repo"
}
```

Supported optional fields should stay compatible with the current backend contract:

```json
{
  "locales": ["en", "zh", "ja"],
  "preset": "3:2",
  "provider": "mock",
  "imageQuality": "low",
  "models": {
    "llm": "openai/gpt-5.5",
    "image": "openai/gpt-image-2/text-to-image"
  }
}
```

Future extension fields, only after a contract review:

```json
{
  "referenceStyleImage": "/absolute/path/to/reference.png",
  "extraContextFiles": ["/absolute/path/to/paper.pdf"],
  "brandLogo": "/absolute/path/to/logo.png",
  "forceNoRemoteChanges": true
}
```

## Output Contract

Recommended artifact tree:

```text
output/project-launch/{owner}-{repo}/
  manifest.json
  project_brief_curated.json
  assets/
    official-logo.png
    github-avatar.png
    banner.png
  en/
    marketing_card_prompt.txt
    marketing-card.png
    quality-report.json
  zh/
    marketing_card_prompt.txt
    marketing-card.png
    quality-report.json
  ja/
    marketing_card_prompt.txt
    marketing-card.png
    quality-report.json
```

Minimum successful output:

```text
output/project-launch/{owner}-{repo}/{locale}/marketing-card.png
```

## Project Structure

Existing module boundaries should remain the source of truth:

```text
api/generations.ts                         Public HTTP normalization and response handling
src/server/generation/repo.ts              GitHub URL parsing and default metadata helpers
src/server/generation/repository-source.ts GitHub metadata and README source resolution
src/server/generation/readme.ts            README signal extraction
src/server/generation/assets.ts            Brand asset selection and local asset persistence
src/server/generation/brief.ts             Source-backed project brief construction
src/server/generation/visual.ts            Visual direction selection
src/server/generation/copy.ts              English master and localized copy slots
src/server/generation/prompt.ts            Image prompt and provider request construction
src/server/generation/image-generator.ts   Mock and WaveSpeed image execution
src/server/generation/quality.ts           Deterministic quality checks and revision prompts
src/server/generation/orchestrator.ts      Stage sequencing and manifest assembly
src/server/generation/types.ts             Cross-module contracts
```

## Workflow State Machine

```text
INIT
  -> PARSE_REPO
  -> FETCH_METADATA
  -> FETCH_README
  -> EXTRACT_README_SIGNALS
  -> DISCOVER_ASSETS
  -> STORE_REFERENCE_ASSETS
  -> BUILD_BRIEF
  -> SELECT_NARRATIVE
  -> SELECT_VISUAL_DIRECTION
  -> BUILD_LOCALIZED_COPY
  -> BUILD_IMAGE_PROMPT
  -> GENERATE_IMAGE
  -> SAVE_OUTPUT
  -> QA
  -> WRITE_MANIFEST
  -> DONE
```

Error states:

```text
VALIDATION_FAILED
GITHUB_FETCH_FAILED
README_FETCH_FAILED
ASSET_NOT_FOUND
PROMPT_INCOMPLETE
IMAGE_GENERATION_FAILED
QA_NEEDS_REVISION
USER_CONFIRMATION_REQUIRED
```

## Fine-Grained Stage Requirements

### 1. Parse Repository URL

Input: `https://github.com/nexu-io/open-design`

Output:

```json
{
  "owner": "nexu-io",
  "repo": "open-design",
  "fullName": "nexu-io/open-design",
  "repoUrl": "https://github.com/nexu-io/open-design"
}
```

Rules:

- Accept only `github.com/{owner}/{repo}`.
- Strip `.git`.
- Reject non-GitHub URLs without guessing.
- Keep parsing pure and dependency-free.

### 2. Fetch Repository Metadata

Fetch and normalize:

- `name`
- `full_name`
- `description`
- `homepage`
- `stargazers_count`
- `language`
- `topics`
- `default_branch`
- `owner.login`
- `owner.avatar_url`
- `owner.html_url`
- `owner.type`

Rules:

- Use `GITHUB_TOKEN` only from process environment.
- Never persist credentials into artifacts.
- If GitHub fetch fails, produce a fallback source with explicit warnings in `manifest.json`.
- Do not let fallback data masquerade as verified repository facts.

### 3. Fetch README

Primary URL:

```text
https://raw.githubusercontent.com/{owner}/{repo}/{default_branch}/README.md
```

Fallbacks for a later implementation pass:

```text
https://raw.githubusercontent.com/{owner}/{repo}/main/README.md
https://raw.githubusercontent.com/{owner}/{repo}/master/README.md
https://r.jina.ai/https://github.com/{owner}/{repo}
```

Rules:

- Keep README fetching isolated from README parsing.
- Preserve the source URL used.
- If no README can be fetched, generate a conservative fallback and flag it as fallback.

### 4. Extract README Signals

Extract:

- One-line positioning
- Core features
- Meaningful metrics
- Supported platforms
- Usage scenarios
- Architecture highlights
- Export formats
- Official links
- Referenced images

Filtering rules:

- Ignore shields.io badges as metrics.
- Do not treat image alt text, badge URLs, query params, or HTML noise as product claims.
- Keep meaningful numbers like `16 CLIs`, `31 Skills`, `72 Design Systems`.
- Cap marketing-card metrics at 3-4 slots.

### 5. Discover Brand Assets

Priority:

1. User-supplied brand logo, if a future contract explicitly supports it.
2. Official repo logo file.
3. README official logo or banner.
4. Traceable homepage logo.
5. GitHub owner avatar.

Identity rules:

- Project identity uses a real official logo when available.
- If no official logo exists, use the real GitHub owner avatar.
- GitHub logo is only allowed in the bottom GitHub strip.
- Never synthesize random logos, abstract brand marks, mascots, badges, or unrelated symbols.

### 6. Store Reference Assets

Rules:

- Store references under `assets/` before prompt construction.
- Record original source URL, local path, MIME type, confidence, and reason.
- Never overwrite an existing generated artifact unless the user explicitly asks.
- Avoid repeatedly downloading the same asset inside each locale loop.

### 7. Build Project Brief

The brief is the factual source for copy and prompt generation:

```json
{
  "title": "Open Design",
  "subtitle": "Open-source Claude Design alternative for local-first agentic design",
  "repo_url": "https://github.com/nexu-io/open-design",
  "homepage": "https://open-design.ai",
  "identity_asset": "assets/open-design-logo.png",
  "metrics": [
    "16 coding-agent CLIs",
    "31 composable Skills",
    "72 brand-grade Design Systems",
    "HTML / PDF / PPTX / MP4 export"
  ],
  "key_insights": [
    "Local-first design loop wires existing coding agents into artifact generation.",
    "BYOK at every layer keeps provider choice and deployment control with the user.",
    "Skills, design systems, sandboxed previews, and exports make design output repeatable."
  ],
  "workflow_steps": [
    "Brief + direction picker",
    "Agent builds artifact",
    "Preview + export"
  ]
}
```

Rules:

- Every metric must come from repository metadata, README, docs, or user input.
- Do not invent benchmarks.
- If evidence is weak, use cautious capability language.
- Keep `project_brief_curated.json` small and auditable.

### 8. Select Narrative

Map project type to narrative:

| Project type | Narrative focus |
| --- | --- |
| AI kernel / infra | Performance, throughput, memory, hardware friendliness |
| Model / benchmark | Architecture, training, metrics, context, reasoning capability |
| DevTool | Workflow, time-to-value, ecosystem compatibility |
| Design tool | Artifacts, visual systems, export ability, creative loop |
| Agent tool | Scheduling, context, tool calling, controllability |
| Open-source alternative | Lock-in avoidance, local-first, BYOK, self-hosting |

Narrative output must fit fixed card slots:

- 1 headline
- 1 subtitle
- 3 key insights
- 3-4 metrics
- 3 workflow steps

### 9. Select Visual Direction

Rules:

- Visual direction must be derived from project signals, not a universal blue-white template.
- It should define category, mood, palette, typography, layout, motifs, and avoid-list.
- It must not include generated brand marks or unrelated logos.

### 10. Build Localized Copy

Rules:

- English is the master structure.
- Chinese and Japanese preserve slot count and order.
- Brand name, GitHub URL, metric order, feature count, and workflow count stay aligned.
- Simplified Chinese should be natural, not literal machine translation.
- Key technical terms like `Agent`, `BYOK`, and `Skills` can remain in English.

### 11. Build Image Prompt

Prompt must include:

- Use case
- Asset type
- Source-backed identity rule
- Reference visual style
- Layout
- Exact text to render
- Feature callouts
- Workflow strip
- Hard constraints

Required identity snippet:

```text
Use the official brand logo if a real logo source asset is supplied.
If no official brand logo source is supplied, use the real GitHub account avatar.
The GitHub logo is only for the bottom GitHub strip, not the project identity slot.
Never synthesize random logos, abstract brand marks, mascots, badges, or unrelated symbols.
```

### 12. Generate Image

Default model:

```text
openai/gpt-image-2/text-to-image
```

Rules:

- Provider request construction belongs in `prompt.ts`.
- Provider execution and polling belongs in `image-generator.ts`.
- The orchestrator should not know provider body internals.
- Prompt and image output must both be saved per locale.
- Failed image generation should surface a structured failure, not a partial success.

### 13. Quality Check

Checks:

- Identity asset is traceable.
- Random logo generation is forbidden by prompt and reported in QA.
- GitHub strip URL is exact.
- Localized slots match English master slots.
- Metrics match the curated brief.
- Card layout supports README, PPT, and social reuse.
- Prompt contains no fake badges or unrelated logos.

Future visual QA should add:

- Image dimensions match preset.
- OCR text roughly matches exact copy slots.
- No severe overlap in critical text regions.
- Generated image is not blank.

### 14. Revision Strategy

Only perform minimal prompt corrections:

| Issue | Revision |
| --- | --- |
| Logo was redrawn | Strengthen exact official logo rule |
| Chinese text unreadable | Reduce text length and enlarge text |
| Metric changed | List exact metric strings again |
| Visual style drifted | Re-state reference visual direction |
| Card overcrowded | Reduce feature text, not slot count |
| URL typo | Add isolated `GitHub strip URL: ...` line |

## Low-Coupling Architecture Rules

- `orchestrator.ts` may sequence stages, but should not parse README, choose visual style, or construct provider payloads directly.
- `types.ts` owns shared contracts; implementation modules should not define competing response shapes.
- `repository-source.ts` owns external GitHub fetches; pure extraction logic stays in `readme.ts`.
- `assets.ts` owns identity asset ranking and local persistence; prompt generation only receives stored assets.
- `brief.ts`, `visual.ts`, and `copy.ts` are deterministic transformation modules.
- `prompt.ts` owns prompt assembly and image request normalization.
- `image-generator.ts` owns provider execution, polling, and local image persistence.
- `quality.ts` owns deterministic QA and revision prompt output.
- No module should import from React components.
- No module should require the HTTP request object except `api/generations.ts`.

## Performance Constraints

- Fetch GitHub metadata and README once per generation.
- Avoid per-locale network reads for the same metadata or reference asset.
- Generate prompt text synchronously after brief/copy are available.
- Keep LLM calls bounded: README analysis and launch plan should not multiply by locale unless explicitly needed.
- Keep image generation per locale, because each locale has different rendered text.
- Persist artifacts incrementally so a failed locale can be diagnosed without losing prior stage evidence.
- Keep QA deterministic and local; do not add another model call for the default QA path.

## Security and Permission Boundaries

- Always: Validate GitHub URL, keep credentials in env only, write traceable artifacts, include warnings for fallback sources.
- Always: Save prompt, brief, manifest, and QA report locally.
- Ask first: Add public API fields, change provider routing, change model defaults, add dependencies, alter frontend controls, commit or push.
- Never: Commit secrets, write to the source GitHub repo, publish social posts, synthesize a project logo, invent project metrics, overwrite artifacts without consent.

## Testing Strategy

Unit tests:

- `repo.ts`: URL normalization and rejection.
- `readme.ts`: metrics extraction, badge filtering, image classification.
- `assets.ts`: brand asset ranking and GitHub avatar fallback.
- `brief.ts`: evidence-backed brief construction.
- `copy.ts`: slot count preservation across locales.
- `prompt.ts`: identity rules, exact text, preset sizing, provider body.
- `quality.ts`: pass/fail status and revision prompt.

Integration tests:

- `runProjectLaunchGeneration` mock provider writes the full artifact tree.
- WaveSpeed path calls GPT5.5 twice and gpt-image-2 once for a single-locale request.
- Polling handles async image result URLs.
- Manifest records source warnings and safety flags.

API tests:

- `api/generations.ts` accepts current request shape.
- Invalid provider, locale, preset, quality, and JSON body return stable validation errors.
- The API route does not expose env credentials in responses.

Manual checks:

- Local `POST /api/generations` on `localhost:5173`.
- Open generated `manifest.json`.
- Inspect per-locale prompt files.
- Inspect generated image or mock image.

## Success Criteria

- A valid GitHub repo URL produces a deterministic artifact tree.
- `project_brief_curated.json` contains source-backed title, subtitle, metrics, insights, and workflow steps.
- Every locale has a prompt, image output, and quality report.
- Brand identity uses official logo or GitHub owner avatar only.
- GitHub URL is exact and unchanged across locales.
- Metrics are traceable and not invented.
- Existing frontend and public backend request shape remain unchanged.
- `npm test` and `npm run build` pass after implementation.

## Open Questions

1. Should future `brandLogo`, `referenceStyleImage`, and `extraContextFiles` become public API fields, or remain internal/manual inputs?
2. Should the output default be `3:2` to match the reference workflow, or stay with the current implementation default until a separate UX decision?
3. Should visual QA use OCR in CI, or remain a manual/browser check to avoid extra dependencies?
4. Should artifact overwrite protection create versioned directories or fail when a prior output exists?
