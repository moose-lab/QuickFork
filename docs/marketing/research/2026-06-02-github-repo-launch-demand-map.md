# GitHub Repo Launch Demand Map

Date: 2026-06-02

## Research Goal

Identify public launch-prep signals that support QuickFork's wedge: generate source-backed cold-start launch materials for README pages, social media, PPT decks, and product outreach from one repository URL.

This is discovery evidence, not QuickFork-specific validation. It should guide landing-page prioritization, interview prompts, and paid-package hypotheses until production analytics and user conversations exist.

## Public Source Signals

| Signal | Source | Demand clue | QuickFork implication | Confidence |
| --- | --- | --- | --- | --- |
| Product Hunt launch assets | Product Hunt launch guide: `https://www.producthunt.com/launch/preparing-for-launch` | Launch preparation includes copy, gallery assets, video decisions, pricing status, and launch-day context. | Test a full launch package request after artifact review. Package tagline, gallery prompts, first comment, launch checklist, README/social/deck/outreach assets, and human review. | Medium |
| GitHub social preview | GitHub Docs: `https://docs.github.com/en/repositories/managing-your-repositorys-settings-and-features/customizing-your-repository/customizing-your-repositorys-social-media-preview?apiVersion=2022-11-28` | Repository sharing has a concrete visual preview surface. | Prioritize README/social preview exports and visual explainer prompts that preserve repository identity and source-backed claims. | Medium |
| Open-source audience and message work | Open Source Guides: `https://opensource.guide/finding-users/` | Open-source projects need audience discovery, clear messaging, and feedback loops before broad promotion. | Keep story map, audience hypothesis, launch angles, and source-reference checks before scaled content or paid packaging. | Medium |
| Community launch prep language | Reddit Product Hunt launch community: `https://www.reddit.com/r/ProductHuntLaunches/` | Makers discuss launch checklists, screenshots, first comments, concise positioning, and launch prep. | Use this as low-confidence voice-of-customer input for interviews and resource-page copy, not as proof of purchase intent. | Low |

## Productization Implications

| Package hypothesis | Paid-intent signal to watch | Metric | Guardrail |
| --- | --- | --- | --- |
| Single-repo full launch package | `request_launch_package` after artifact review or demand-map visit | `sales_contact_requested` with `contact_reason=full_launch_package` | Review lead quality before publishing prices |
| Product Hunt launch package | Launch deadline, gallery asset need, first-comment prep, pricing status question | `cta_clicked` on Product Hunt or demand-map route | Do not imply launch success or ranking |
| README/social preview package | Preview export/download and story-map copy | `launch_artifact_downloaded` by `artifact_type` | Do not synthesize random logos or unsupported claims |
| DevRel/studio batch workflow | Multiple repo requests, white-label or review workflow need | repeat generation and qualified contact requests | Do not claim team fit before interviews |

## Prioritization Decision

Build and publish `/resources/github-repo-launch-demand-map` as a source-linked research route with `request_launch_package` as the primary CTA. The route should be treated as a Discovery to Monetization bridge:

- Discovery: map public launch-prep language and source requirements.
- Validation: measure whether the route gets CTA clicks and contact requests.
- Monetization: use full launch package requests and interviews to test willingness to pay.

## Evidence Gaps

- No Search Console impressions for the new route yet.
- No production `cta_clicked` or `sales_contact_requested` data from this route yet.
- No direct interviews confirming which artifact users value enough to pay for.
- No pricing or tier claim should be published from this research alone.

## Next Validation Steps

1. Publish the route and verify it appears in sitemap and `llms.txt`.
2. Watch `page_view`, `resource_page_viewed`, `cta_clicked`, and `sales_contact_requested`.
3. Interview users who request a full launch package about deadline, asset type, review needs, and budget range.
4. Use evidence to decide whether the next package test should focus on Product Hunt, README/social preview, DevRel batch workflow, or human review.
