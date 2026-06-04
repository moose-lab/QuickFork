# Sites Output Enablement

Date: 2026-06-03

## Hypothesis

If QuickFork exposes Sites as part of the launch package, founders, open-source maintainers, and DevRel operators can turn the same repository evidence into a reviewable site/page spine instead of treating launch output as only README, deck, social, visual, and outreach files.

## Lifecycle Stage

- Stage: Activation to monetization.
- Target user: AI/devtool builders, open-source maintainers, technical founders, and DevRel operators preparing a public launch.
- Product surface: generated launch brief, studio output presets, and full launch package qualification form.
- CTA: generate a similar launch package or request a reviewed full launch package.
- Primary metric: `launch_artifact_copied` or `launch_artifact_downloaded` where `artifact_type=site`; `sales_contact_requested` with package scope including `sites`.
- Guardrail metric: no raw README text, artifact body, email, token, secret, unsupported customer proof, ranking, revenue, or guaranteed-growth claim in browser analytics.

## Change

- Added `site` as a generated launch materials channel.
- Added a source-backed "Launch site page spine" export artifact.
- Added a Sites output preset for the studio.
- Added Sites to full launch package qualification scope.
- Kept Sites as a reviewable page spine, not automatic public publishing.

## Evidence Observed

- RED generation test failed first because the launch brief did not include the site channel.
- RED App tests failed first because the studio and contact scope form did not expose Sites.
- Focused GREEN verification passed after implementation:
  - `npm test -- src/server/generation/generation.test.ts -t "source-backed free repo launch brief"`
  - `npm test -- src/App.test.tsx -t "keeps the generator studio|full launch package contact"`
  - `npm test -- src/server/marketing/launch-package-fit.test.ts src/server/marketing/lead-capture.test.ts -t "launch package fit|full launch package qualification"`
- Related focused verification passed after the final scope-count alignment:
  - `npm test -- src/server/generation/generation.test.ts -t "source-backed free repo launch brief"` returned 1 file passed and 1 selected test passed.
  - `npm test -- src/App.test.tsx -t "keeps the generator studio|full launch package contact|landing architecture"` returned 1 file passed and 3 selected tests passed.
  - `npm test -- src/server/marketing/launch-package-fit.test.ts src/server/marketing/lead-capture.test.ts -t "launch package fit|full launch package qualification"` returned 2 files passed and 2 selected tests passed.
- Full verification with the default forks pool hit Vitest worker startup timeout in this local environment, but no Sites assertion failed after the scope-count fix.
- Full verification passed with threads pool: `npm test -- --testTimeout=30000 --pool=threads` returned 25 files passed and 168 tests passed.
- Build verification passed: `npm run build` completed TypeScript build and Vite production build.
- Diff hygiene passed: `git diff --check` returned no whitespace errors.

## Remaining Validation Gap

No production users have copied, downloaded, or requested the Sites scope yet. Treat the output as a monetization hypothesis until artifact interactions, full-package requests, or interviews show that launch site/page support is more valuable than the existing README, social, deck, visual, and outreach outputs.
