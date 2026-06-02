# Launch Package Pilot Page

Date: 2026-06-02

## Growth Contract

Hypothesis:

- If activated or evaluating builders see a clear full launch package pilot offer after free repo brief, readiness score, demand map, and visual explainer pages, they will signal paid intent by requesting a scoped launch package before QuickFork publishes exact pricing.

Lifecycle stage:

- Monetization learning, P4/P5 bridge.

Target user:

- Founders, open-source maintainers, DevRel operators, and design/product leads with a real launch deadline, repeated launch packaging needs, or a review workflow that the free repo brief cannot cover.

Primary CTA:

- `request_launch_package`, routed to `/contact?intent=launch-package`.

Primary metric:

- `cta_clicked` on `/product/repository-launch-package-pilot`, segmented by `page_view` where `intent_cluster=repository_launch_package_pilot`.

Guardrail metrics:

- Contact form spam or unqualified requests.
- `generation_failed / generation_started` after visitors start the studio flow.
- Unsupported claims in requested launch materials.

Evidence gap:

- No pricing research, checkout starts, qualified pilot requests, or willingness-to-pay interviews exist yet.

Claim boundary:

- Do not publish exact prices or claims about rankings, revenue, customer acquisition, Product Hunt results, conversion lift, customer count, viral sharing, or guaranteed launch outcomes.

## Changed Surface

- New crawlable page: `/product/repository-launch-package-pilot`.
- New catalog entry: `repository_launch_package_pilot`.
- New funnel position: bottom-funnel decision page that points to the existing launch-package contact intent.
- New `llms.txt` and sitemap entries for AI-search and crawler discovery.

## Productization Rationale

QuickFork already has pages for discovery, launch readiness, demand mapping, visual explanation, and free repo brief activation. The missing paid-product learning surface is a clear way for a high-intent visitor to ask for the full package without forcing public pricing.

This page treats the full package as a qualified pilot request, not a priced plan. That keeps the productization path honest while still collecting signals around:

- Full package scope.
- Launch urgency.
- Human review needs.
- Export/channel needs.
- Repeat launch or team workflow needs.
- Willingness-to-pay interview follow-up.

## Validation Plan

Track:

- `page_view` for `/product/repository-launch-package-pilot`.
- `cta_clicked` with `cta_id=request_launch_package`.
- Contact submissions with `intent=launch-package`.
- Downstream qualification notes: repo fit, deadline, package scope, review needs, and willingness-to-pay interview status.

Compare against:

- `/product/github-repo-to-launch-package`
- `/resources/github-repo-launch-demand-map`
- `/product/github-repo-visual-explainer`
- `/tools/github-repo-launch-readiness-score`

Decision threshold before scaling:

- At least one qualified launch-package request or interview signal that clarifies package scope.
- No public pricing until pricing research or real purchase intent supports it.

## Implementation Evidence

- RED route test failed first because `/product/repository-launch-package-pilot` rendered the homepage instead of a product route.
- RED public-growth test failed first because sitemap and `llms.txt` did not include the pilot page.
- Focused route, public-growth, and semantic-link tests passed after adding catalog, narrative, sitemap, and `llms.txt` entries.
- Full verification passed with `git diff --check`, `npm test`, and `npm run build`.

## Next Action

- Run full verification, publish through PR, deploy, then production-smoke the route, sitemap, `llms.txt`, and bundle strings.
