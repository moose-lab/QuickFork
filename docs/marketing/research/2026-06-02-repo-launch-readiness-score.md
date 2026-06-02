# GitHub Repo Launch Readiness Score Research

Date: 2026-06-02

## Growth Contract

Hypothesis:

- If a founder or maintainer can evaluate launch readiness through a source-backed scorecard, they will better understand why QuickFork asks for a repo URL and will be more likely to start the free studio flow.

Lifecycle stage:

- Discovery to Activation.

Target user:

- Founders, open-source maintainers, and AI/devtool builders preparing a public GitHub repository launch.

Primary CTA:

- `start_free_tool` on `/tools/github-repo-launch-readiness-score`.

Primary metric:

- `cta_clicked` where `cta_id=start_free_tool`, segmented by prior `tool_page_viewed` on `/tools/github-repo-launch-readiness-score`.

Guardrail:

- `generation_failed / generation_started` after visitors start the studio flow.
- Do not claim the score predicts search performance, sales outcomes, launch results, Product Hunt performance, conversion lift, or willingness to pay.

Evidence gap:

- Production tool page views, CTA clicks, repo submissions, generated package completions, and interviews are not yet validated.

## Scorecard Rubric

| Category | Points | Lifecycle | QuickFork output |
| --- | ---: | --- | --- |
| README trust | 25 | Discovery | README checklist and source-backed launch brief |
| Repository preview | 15 | Discovery | README hero card and GitHub social preview direction |
| Audience and feedback | 20 | Activation | Audience hypothesis, feedback questions, and community launch angle |
| Launch assets | 25 | Evaluation | Product Hunt copy, deck outline, social posts, outreach draft, and visual prompt |
| Measurement and follow-up | 15 | Evaluation | Post-launch checklist tied to CTA, artifact export, and follow-up evidence |

Total:

- 100 points.

## Public Source Evidence

| Source | What it supports | QuickFork interpretation |
| --- | --- | --- |
| GitHub Docs About READMEs | README is a key repository explanation surface. | README trust is the first readiness category before generating public copy. |
| GitHub Docs social preview | Repository social preview is a configurable sharing surface. | Preview imagery is part of launch readiness, not decoration. |
| Open Source Guides finding users | Open-source growth depends on audience, messaging, community, and feedback. | Audience and feedback should be scored before broad distribution. |
| Product Hunt launch guide | Launch preparation includes checklist, maker copy, gallery assets, first-comment context, and launch-day decisions. | Channel assets should be scored before treating a repo as launch-ready. |

Source URLs:

- https://docs.github.com/repositories/managing-your-repositorys-settings-and-features/customizing-your-repository/about-readmes
- https://docs.github.com/en/repositories/managing-your-repositorys-settings-and-features/customizing-your-repository/customizing-your-repositorys-social-media-preview?apiVersion=2022-11-28
- https://opensource.guide/finding-users/
- https://www.producthunt.com/launch/preparing-for-launch

## Claim Limits

Safe claims:

- QuickFork can map one public GitHub repository URL into a source-backed pre-launch scorecard and launch package workflow.
- The scorecard covers README trust, repository preview, audience feedback, launch assets, and measurement follow-up.
- The tool is a planning rubric and activation path into the studio.

Unsafe claims until validated:

- The score predicts ranking, sales, customer acquisition, Product Hunt results, launch outcomes, or willingness to pay.
- Users will prefer this scorecard over the direct studio flow.
- The page has proven lead quality, conversion lift, or AI-search visibility.

## Decision

Publish the dedicated readiness-score narrative because the route is already public in `sitemap.xml` and `llms.txt`. Leaving it as a generic tool page creates a thin-page risk and misses a clear free-tool lead path.

The strategy remains a hypothesis until production analytics and user follow-up show whether visitors use the scorecard to start repo generation.

## Next Validation Step

After deploy:

1. Confirm `https://seekersai.com/tools/github-repo-launch-readiness-score` returns 200.
2. Confirm `llms.txt` exposes the 100-point readiness score description.
3. Track `tool_page_viewed`, `cta_clicked`, `generation_started`, `generation_completed`, and `generation_failed`.
4. Compare studio starts from the readiness-score route against generic product-page starts.

## Implementation Evidence

Observed on 2026-06-02:

- RED model test failed first because `src/marketing/launch-readiness-score.ts` did not exist.
- RED route test failed first because `/tools/github-repo-launch-readiness-score` still lacked 100-point scorecard content.
- RED public-growth test failed first because `llms.txt` still exposed the generic tool description.
- Build verification later failed because `tool_page_viewed` was emitted by `MarketingPage` but was missing from the `AnalyticsEventName` type.
- Added `src/lib/analytics.test.ts` coverage for `tool_page_viewed` with scorecard metadata, UTM preservation, and PII/secret filtering.
- `npm test -- src/lib/analytics.test.ts src/App.test.tsx -t "tool page views|repo launch readiness score"`: 2 files passed, 2 selected tests passed.
- `npm test`: 20 files passed, 129 tests passed.
- `npm run build`: TypeScript and Vite production build completed.
- `git diff --check`: no whitespace errors.

Current status:

- The scorecard route is ready for PR/production validation, but the growth strategy remains a hypothesis until production funnel evidence exists.
