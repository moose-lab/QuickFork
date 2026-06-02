# Repo Audience Discovery Map

Date: 2026-06-02

## Question

Can QuickFork make "find the target users for this repository" a concrete product output inside the cold-start launch package?

## Hypothesis

If the free repo launch brief names likely target users, launch triggers, channels, and validation questions, builders will see QuickFork as a launch strategy workflow rather than a generic asset generator.

## Lifecycle Stage

Discovery to Activation.

## Target User

AI project builders, open-source maintainers, indie technical founders, DevRel operators, and studios preparing public launches from GitHub-backed products.

## Source Inputs

- `.agents/product-marketing.md`: QuickFork should generate reviewable launch packages from repository evidence, not unsupported marketing claims.
- `docs/marketing/research/2026-06-01-cold-start-launch-demand-analysis.md`: target user discovery is part of the repository-to-launch package job.
- `docs/plans/2026-06-01-quickfork-growth-lifecycle-prioritization.md`: Discovery and Activation stages need evidence about who has the pain and whether generated outputs are useful.
- `AGENTS.md`: target users should be found through visible pain signals, search language, launch triggers, communities, and willingness-to-pay signals.

## Product Decision

Add `audienceDiscovery` to the generated `RepoLaunchBrief`.

The map includes:

- Target segment.
- Job to be done.
- Launch trigger.
- Where to find or validate that segment.
- Validation question.
- Source boundary.
- Priority.

The map is also exported as a first-class `audience` artifact before story map, README, social, deck, outreach, and visual artifacts.

## Measurement

Primary CTA:

- Copy target user map.

Primary metric:

- `launch_audience_map_copied`.

Safe analytics properties:

- `segment_count`
- `channel_count`
- `validation_question_count`
- repo host/full name
- generation id

Guardrail:

- Do not send raw README, raw target-user text, raw artifact body, emails, tokens, secrets, unsupported customer proof, pricing, ranking, revenue, or guaranteed-growth claims to browser analytics.

## Evidence Observed

- Backend RED test failed first because `launchBrief.audienceDiscovery` did not exist.
- Frontend RED test failed first because the generated brief did not render a `Target user discovery` region.
- Backend GREEN test passed: `npm test -- src/server/generation/generation.test.ts -t "source-backed free repo launch brief"` returned 1 file passed, 1 selected test passed.
- Frontend GREEN test passed: `npm test -- src/App.test.tsx -t "submits the Hero generator form"` returned 1 file passed, 1 selected test passed.
- Focused verification passed: `npm test -- src/server/generation/generation.test.ts src/App.test.tsx src/lib/analytics.test.ts` returned 3 files passed, 63 tests passed.
- Full test suite passed: `npm test` returned 22 files passed, 140 tests passed.
- Production build passed: `npm run build` completed TypeScript and Vite production build.
- `git diff --check`: no whitespace errors.
- PR #16 merged into `main` at merge commit `a116ba67d50b1096898122ea74c3a9a2f940fe1f`.
- Main CI/CD run `26820012405` completed successfully: `Test and build` passed and `Deploy production to Vercel` passed.
- Production smoke passed: `https://seekersai.com` returned HTTP 200.
- Production bundle `/assets/index-DmGop2Ki.js` contains `Target user discovery`, `launch_audience_map_copied`, and `audienceDiscovery`.

## Evidence Gap

This proves the local product contract, UI, and event hygiene. It does not prove users value the map yet.

Required validation before scaling:

- Production `launch_audience_map_copied` rate.
- Audience artifact copy/download rate.
- Interviews asking whether the map helped identify launch users or channels.
- Comparison against story map, README, social, deck, outreach, and visual artifact export behavior.

## Next Action

Run full verification, ship via PR, then compare audience map usage against story map and artifact export behavior before adding a public audience-finder landing page or paid audience research package.
