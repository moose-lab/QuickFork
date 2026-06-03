# 2026-06-03 Launch Materials Map Validation Contract

## Objective

Add a measurement contract for the launch materials map product page and generated artifact. The contract should make `/product/github-repo-launch-materials-map` comparable against `/product/cold-start-launch-materials` and require activation, Search Console, and AI-answer evidence before QuickFork treats the page or feature as validated.

## Hypothesis

If QuickFork compares the broader cold-start launch materials route against the narrower launch materials map route, the team can learn whether builders value channel planning enough to copy the map, complete generations, export artifacts, or request a reviewed launch package.

## Lifecycle Stage

- Validation.
- Activation evidence is required through `launch_materials_map_copied`.

## Target User

- AI project builders preparing cold-start GitHub launches.
- Open-source maintainers and DevRel/product-marketing operators who need source-backed channel planning for README, social, deck, visual, and outreach materials.

## Implementation Scope

- Add `2026_q2_launch_materials_map_intent_validation` to the typed growth experiment registry.
- Mirror the experiment in `docs/marketing/data/growth-experiment-registry.csv`.
- Add a pending evidence row to `growthExperimentEvidence`.
- Mirror the evidence row in `docs/marketing/data/growth-experiment-evidence.csv`.
- Add Search/AI baseline rows for the control and variant routes.
- Mirror the baseline rows in `docs/marketing/data/search-ai-baseline-prompts.csv`.
- Update the launch materials map research note, lifecycle plan, and Obsidian strategy mirror.

## Metrics

- Primary comparison metric: `cta_clicked_per_page_view`.
- Guardrail metric: `generation_failed_per_generation_started`.
- Required activation evidence: `launch_materials_map_copied`.
- Required discovery evidence: Search Console query baseline and AI-answer audit.

## Guardrails

- Do not treat prompt coverage, a published page, or a copied artifact as validated demand.
- Do not claim pricing, rankings, revenue, customer count, conversion lift, Product Hunt outcome, guaranteed launch results, or validated AI citation.
- Keep evidence rows and analytics requirements free of email, raw repo text, tokens, secrets, raw artifact bodies, and private notes.

## Verification Notes

- Baseline `npm test` passed before changes: 24 test files, 160 tests.
- RED registry test failed first because `2026_q2_launch_materials_map_intent_validation` did not exist.
- RED evidence test failed first because no pending evidence row existed for the launch materials map experiment.
- RED Search/AI test failed first because no control or variant baseline rows existed for the launch materials map experiment.
- GREEN focused registry verification passed: `npm test -- src/marketing/growth-experiments.test.ts -t "launch materials map|mirrors|references published|decision-ready"`.
- GREEN focused evidence verification passed: `npm test -- src/marketing/growth-experiment-report.test.ts -t "launch materials map|evidence row|mirrors|registry experiment|privacy-safe"`.
- GREEN focused Search/AI verification passed: `npm test -- src/marketing/search-ai-baseline.test.ts -t "launch materials map|covers every|mirrors|published|claim-safe"`.
- Related verification passed: `npm test -- src/marketing/growth-experiments.test.ts src/marketing/growth-experiment-report.test.ts src/marketing/search-ai-baseline.test.ts` returned 3 files passed and 23 tests passed.
- Full verification passed: `npm test` returned 24 files passed and 163 tests passed.
- Build verification passed: `npm run build` completed TypeScript build and Vite production build.
- Diff hygiene passed: `git diff --check` returned no whitespace errors.

## Next Action

Run full verification, merge, production smoke the public route and context assets, then use the new rows for 14 days of GA4, Search Console, and AI-answer evidence collection.
