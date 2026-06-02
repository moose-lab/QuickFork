# QuickFork Repo Launch Deck Brief Growth Slice

Date: 2026-06-02

## Objective

Add a crawlable growth slice for QuickFork's PPT/deck value: turn one GitHub repository URL into a source-backed, deck-ready launch brief with slide outline, Product Hunt story, outreach narrative, and visual explainer prompts.

This is a product-led SEO/GEO and activation test. It is not proof of demand, willingness to pay, launch success, search ranking, funding outcomes, revenue, or customer acquisition.

## Growth Contract

Hypothesis:

- If QuickFork publishes a source-backed repo-to-launch-deck brief page, AI project founders and DevRel operators will better understand the value of turning one repository URL into deck-ready launch structure before requesting a full launch package.

Lifecycle stage:

- Activation to Evaluation, P4.

Target user:

- AI project founders, indie technical founders, open-source maintainers, and DevRel operators preparing Product Hunt, demo-day, internal, or community launch decks from a GitHub-backed product.

Changed surface:

- Added `/product/github-repo-to-launch-deck` as a published product route in the semantic marketing catalog.
- Added CSV inventory, route narrative, page title/description/headline, FAQ, workflow, and source notes.
- Updated generated sitemap and `llms.txt` so crawlers and AI-search systems can discover the route.
- Added regression tests in `src/seo/semantic-links.test.ts` and `src/seo/public-growth.test.ts`.

Primary CTA:

- Generate free repo brief.

Primary metric:

- `cta_clicked` on `/product/github-repo-to-launch-deck`, segmented by `page_view` where `intent_cluster=github_repo_to_launch_deck`.

Guardrail:

- Do not publish claims about funding, rankings, revenue, customers, benchmark lift, Product Hunt results, guaranteed launch performance, or exact pricing.
- Keep browser analytics PII-free and route visitors back to reviewable repo brief generation, not automatic publishing.

Evidence gap:

- Search Console demand for deck-related repo queries.
- Route-level CTA and repo generation starts from `/product/github-repo-to-launch-deck`.
- Export/copy/download rate for deck artifacts from the launch brief.
- Willingness-to-pay interviews for full launch-package deck review.

## Source Signals

Public-source rationale:

- GitHub README guidance treats the README as the project explanation surface, so repository evidence is a valid first input for a launch deck brief: https://docs.github.com/repositories/managing-your-repositorys-settings-and-features/customizing-your-repository/about-readmes
- GitHub social preview guidance makes shared-link visuals part of launch packaging, which connects README, social, gallery, and slide story needs: https://docs.github.com/en/repositories/managing-your-repositorys-settings-and-features/customizing-your-repository/customizing-your-repositorys-social-media-preview?apiVersion=2022-11-28
- Open Source Guides' finding-users guidance frames launch work around audience discovery, messaging, and feedback, not just documentation polish: https://opensource.guide/finding-users/
- Product Hunt launch preparation requires concise product story, media decisions, maker context, and launch-day copy, which can be organized from the same deck-ready brief: https://www.producthunt.com/launch/preparing-for-launch

Interpretation:

- The validated public need is not "AI makes a beautiful pitch deck." The narrower QuickFork hypothesis is that repository evidence can become a reusable launch story across README, Product Hunt, social, outreach, and deck surfaces.

## Productization Implications

Free:

- Continue routing visitors to the free repo brief so QuickFork can measure repo URL submission, generation completion, and artifact inspection.

Starter hypothesis:

- Single-repo launch package includes a deck-ready brief, slide outline, README recommendation, Product Hunt story, social copy, outreach narrative, visual prompt, and QA report.

Pro/team hypothesis:

- Repeatable launch-deck workflows for DevRel and platform teams may justify saved brand voice, batch repo intake, review workflow, export history, and campaign measurement.

## Verification Evidence

Current local evidence:

- Baseline `npm test`: 21 files passed, 135 tests passed.
- RED focused test failed first because the route, sitemap, `llms.txt`, and catalog entries did not exist.
- GREEN focused test: `npm test -- src/seo/semantic-links.test.ts src/seo/public-growth.test.ts` passed with 2 files and 14 tests.
- `git diff --check`: no whitespace errors.
- `npm test`: 21 files passed, 136 tests passed.
- `npm run build`: TypeScript and Vite production build completed.
- Local dev smoke: `http://localhost:5173/product/github-repo-to-launch-deck`, `/sitemap.xml`, and `/llms.txt` returned HTTP 200; `llms.txt` contains `GitHub Repository Pitch Deck Generator` and the deck-ready launch brief description.
- PR #12 merged into `main` at merge commit `f5fcc5a37b7ea6c6884c2b5e3dba00914fb7869d`.
- Main CI/CD run `26810312003` completed successfully: `Test and build` passed and `Deploy production to Vercel` passed.
- Production smoke: `https://seekersai.com/product/github-repo-to-launch-deck`, `/sitemap.xml`, and `/llms.txt` returned HTTP 200.
- Production sitemap contains `https://seekersai.com/product/github-repo-to-launch-deck`.
- Production `llms.txt` contains `GitHub Repository Pitch Deck Generator` and the deck-ready launch brief description.
- Production JS bundle contains `GitHub Repository Pitch Deck Generator`, `github_repo_to_launch_deck`, `deck-ready launch brief`, `Product Hunt story`, and `source-backed launch decks`.

Still required:

- Analytics evidence after the route receives traffic.

## Decision

Treat `/product/github-repo-to-launch-deck` as a published P4 activation-to-evaluation growth hypothesis and productization bridge. It makes QuickFork's PPT/deck output explicit without pretending deck demand or paid conversion is validated.

## Next Action

Compare route-level `page_view`, `cta_clicked`, `generation_started`, `generation_completed`, and deck artifact export behavior against the broader `/product/github-repo-to-launch-package` route.
