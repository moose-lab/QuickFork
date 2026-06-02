# 2026-06-03 Launch Materials Map Research Note

## Summary

The launch materials map packages QuickFork's repo-to-launch output into a channel plan: README, social, deck, visual, and outreach. It turns the free launch brief from "generated assets" into a reviewable product workflow with target user, job, artifact, source evidence, review question, and success signal per channel.

This is a product activation hypothesis, not validated market demand.

## Why This Slice Matters

- QuickFork already generates multiple launch artifacts from one repository URL.
- Builders need help deciding which artifact belongs on which channel before public publishing.
- A map makes the product easier to explain in landing pages, AI-search answers, and sales conversations.
- A map creates a paid-packaging wedge: the free product can show the plan, while a paid package can offer reviewed execution across the same channels.

## Target User Hypotheses

- AI project builder: needs a launch story without writing a blank marketing prompt.
- Open-source maintainer: needs README and social assets that remain tied to repository evidence.
- DevRel operator: needs channel-specific launch material for docs, social, and community posts.
- Technical founder: needs a deck and outreach narrative before requesting a fuller launch package.
- Product marketer: needs traceable claims and a reusable artifact map for cross-channel review.

## Product Lifecycle Position

- Discovery: public landing route explains the problem and source-backed workflow.
- Activation: generated brief now includes a launch materials map and copy event.
- Validation: compare page and artifact behavior against existing repo-to-launch routes.
- Monetization: only after evidence shows repeated full-package interest should QuickFork package reviewed channel execution as a paid product.

## Growth Contract

Primary activation metric:

- `launch_materials_map_copied` after a successful free repo launch brief.

Supporting metrics:

- `page_view` for `/product/github-repo-launch-materials-map`.
- CTA clicks with `intent_cluster=github_repo_launch_materials_map`.
- Repo URL submissions from the route.
- Generation completions and failures.
- Artifact copy/download events by type.
- Full launch package requests after materials-map exposure.

Guardrails:

- Do not claim search placement, financial outcomes, adoption, Product Hunt outcomes, exact pricing, or automatic publishing.
- Do not send raw README text, artifact bodies, source notes, secrets, tokens, or email to browser analytics.
- Keep every launch material tied to repository evidence, official assets, generated reports, or explicit user input.

## Source-Backed Inputs

- GitHub README docs define README as the repository explanation surface: https://docs.github.com/repositories/managing-your-repositorys-settings-and-features/customizing-your-repository/about-readmes
- GitHub social preview docs make repository preview visuals part of launch packaging: https://docs.github.com/en/repositories/managing-your-repositorys-settings-and-features/customizing-your-repository/customizing-your-repositorys-social-media-preview?apiVersion=2022-11-28
- Open Source Guides finding users connects audience discovery and feedback loops to open-source launches: https://opensource.guide/finding-users/
- Product Hunt launch guidance frames story, media, maker context, and launch-day copy as review surfaces: https://www.producthunt.com/launch/preparing-for-launch

## Implemented Surface

- `RepoLaunchBrief.launchMaterialsMap`
- `RepoLaunchBrief.artifacts[]` item with type `materials_map`
- Landing result section labeled `Launch materials map`
- Copy tracking event `launch_materials_map_copied`
- Product route `/product/github-repo-launch-materials-map`
- Public discovery assets in `sitemap.xml` and `llms.txt`

## Current Verification

- Baseline `npm test`: 24 files passed, 158 tests passed before implementation.
- Focused generation verification passed.
- Focused hero generator verification passed.
- Focused route, semantic link, and public growth verification passed.
- Full verification passed: `npm test` returned 24 files passed and 160 tests passed.
- Build verification passed: `npm run build` completed TypeScript build and Vite production build.
- Diff hygiene passed: `git diff --check` returned no whitespace errors.

## Next Validation Step

Run a 14-day comparison against `/product/github-repo-to-launch-package` and `/product/cold-start-launch-materials`. Prioritize this slice only if visitors who see or copy the map show stronger generation completion, artifact export, or full-package request behavior.
