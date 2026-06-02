# 2026-06-03 Launch Materials Map

## Objective

Turn QuickFork's free repo launch brief into a clearer product activation surface by adding a source-backed launch materials map. The map explains which generated material belongs on README, social, deck, visual, and outreach channels, who it is for, what source evidence supports it, what a human should review, and what activation signal QuickFork should measure next.

## Skills And Rules

- Use `superpowers:*` skills when the task matches their trigger rules.
- Keep the growth loop source-backed: repository evidence, official project assets, README content, public metadata, generated reports, and explicit user input.
- Keep analytics payloads behavioral and aggregate. Do not send raw README text, artifact bodies, secrets, tokens, email, or private launch notes.
- Use the Obsidian growth note to record the hypothesis, validation evidence, and next lifecycle decision after implementation.

## Product Hypothesis

If QuickFork makes the launch materials map first-class inside the generated brief and gives the same intent a crawlable product page, AI project builders can understand the value faster and QuickFork can measure whether artifact planning creates stronger activation than isolated copy/download events.

## Target Users

- AI project builders preparing a cold-start GitHub launch.
- Open-source maintainers who need a reviewable README, social, and visual package.
- DevRel operators and product marketers who need traceable channel assets.
- Technical founders evaluating whether a paid launch package is worth requesting.

## Implementation Plan

1. Add a typed `launchMaterialsMap` to `RepoLaunchBrief`.
2. Generate five channel mappings: README, social, deck, visual, and outreach.
3. Add a `materials_map` artifact to the export manifest.
4. Render the map in the landing generator result and support copy tracking with `launch_materials_map_copied`.
5. Add `/product/github-repo-launch-materials-map` to the semantic link catalog, page narrative, sitemap, `llms.txt`, and CSV inventory.
6. Record the growth hypothesis and lifecycle plan in repo docs and Obsidian.

## Source Notes

- GitHub README docs: https://docs.github.com/repositories/managing-your-repositorys-settings-and-features/customizing-your-repository/about-readmes
- GitHub social preview docs: https://docs.github.com/en/repositories/managing-your-repositorys-settings-and-features/customizing-your-repository/customizing-your-repositorys-social-media-preview?apiVersion=2022-11-28
- Open Source Guides finding users: https://opensource.guide/finding-users/
- Product Hunt launch guide: https://www.producthunt.com/launch/preparing-for-launch

## Verification Notes

- Baseline `npm test` passed before implementation: 24 test files, 158 tests.
- RED generation test failed before `launchMaterialsMap` existed.
- GREEN generation focused test passed: `npm test -- src/server/generation/generation.test.ts -t "source-backed free repo launch brief"`.
- GREEN UI focused test passed: `npm test -- src/App.test.tsx -t "Hero generator"`.
- RED route tests failed before `/product/github-repo-launch-materials-map` was added to the catalog and public assets.
- GREEN route focused test passed: `npm test -- src/App.test.tsx -t "launch materials map"`.
- GREEN semantic-link focused test passed: `npm test -- src/seo/semantic-links.test.ts -t "launch materials map|canonical page paths"`.
- GREEN public-growth focused test passed: `npm test -- src/seo/public-growth.test.ts -t "sitemap|machine-readable AI context"`.
- Full verification passed: `npm test` returned 24 files passed and 160 tests passed.
- Build verification passed: `npm run build` completed TypeScript build and Vite production build.
- Diff hygiene passed: `git diff --check` returned no whitespace errors.

## Lifecycle Decision

Treat this as an Activation plus Validation slice, not proof of demand. The next decision should use page views, CTA clicks, repo submissions, generation completions, materials-map copy events, artifact exports, and full-package requests before expanding or pricing the capability.
