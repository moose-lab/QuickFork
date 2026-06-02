# Repo Audience Discovery Map Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add a source-backed audience discovery map to the generated launch brief so QuickFork helps builders identify target users, launch triggers, channels, and validation questions from one repository URL.

**Architecture:** Extend `RepoLaunchBrief` with a deterministic `audienceDiscovery` object and a first-class `audience` export artifact. Render it inside the existing launch brief panel before the story map, add a copy action, and track only metadata through analytics.

**Tech Stack:** TypeScript, React, Vitest, Testing Library, existing generation pipeline, existing `trackEvent` helper.

---

## Growth Contract

- **Hypothesis:** If the free repo launch brief names likely target users, launch triggers, and validation questions, users will see QuickFork as a launch strategy product rather than a generic asset generator.
- **Lifecycle stage:** Discovery to Activation.
- **Target user:** AI project builders, open-source maintainers, indie technical founders, DevRel operators, and studios preparing public launches from GitHub-backed products.
- **Primary CTA:** Copy target user map.
- **Primary metric:** `launch_audience_map_copied` with `segment_count`, `channel_count`, and `validation_question_count`.
- **Guardrail metric:** No raw README, raw artifact body, emails, tokens, secrets, raw notes, unsupported customer proof, pricing, ranking, revenue, or guaranteed-growth claims in browser analytics.
- **Evidence gap:** Repo tests can prove product contract, UI, and analytics hygiene; production validation still needs audience-map copy/export rate and interviews about whether the target user map improves launch planning.

## File Map

- Modify `src/server/generation/types.ts`: add audience discovery interfaces, include `audienceDiscovery` in `RepoLaunchBrief`, and add `audience` artifact type.
- Modify `src/server/generation/launch-brief.ts`: build deterministic audience discovery signals and a markdown artifact.
- Modify `src/server/generation/generation.test.ts`: add RED/GREEN expectations for audience discovery contract, artifact order, and claim hygiene.
- Modify `src/components/landing/HeroSection.tsx`: render audience discovery, serialize it, and track `launch_audience_map_copied`.
- Modify `src/App.test.tsx`: verify UI, copy action, metadata-only analytics, and updated artifact count.
- Modify `src/lib/analytics.ts`: add `launch_audience_map_copied`.
- Modify `src/styles/app.css`: style the audience map without nesting page cards.
- Modify `docs/plans/2026-06-01-quickfork-growth-lifecycle-prioritization.md`: add this growth slice.
- Modify `/Users/moose/Documents/Moose's Birth ID/QuickFork/SEO Growth/2026-06-01 QuickFork Cold Start Launch Growth Iteration.md`: mirror the decision and evidence.

## Execution Log

- [x] Add failing backend and frontend expectations for `audienceDiscovery`, `audience` artifact export, audience UI, copy action, and safe analytics.
- [x] Run targeted RED tests and verify failures are caused by the missing feature.
- [x] Implement server types, deterministic audience discovery builder, and markdown artifact.
- [x] Implement frontend types, audience map rendering, copy serialization, and analytics event.
- [x] Update repo and Obsidian growth logs.
- [x] Run targeted tests, full tests, build, and whitespace verification.
- [ ] Commit, push, open PR, and verify CI/deploy.
