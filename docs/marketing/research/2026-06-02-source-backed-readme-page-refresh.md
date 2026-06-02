# Source-Backed And README Product Page Refresh

Date: 2026-06-02

## Growth Hypothesis

If `/product/source-backed-launch-assets` and `/product/readme-marketing-cards` explain QuickFork's repo-to-launch package workflow with unique source-backed definitions, target users, workflows, FAQs, and source notes, search and AI-search visitors will understand the product wedge before starting the generator.

## Lifecycle Stage

P1: High-intent landing page validation.

This is a Discovery and Validation slice, not proof of demand. It improves page quality for two already published URLs so future analytics, Search Console, AI answer checks, and interviews can produce cleaner evidence.

## Target Users

- Product marketers who need traceable launch assets from technical source material.
- DevRel operators who repeatedly turn repositories into README, deck, social, and outreach materials.
- AI project builders and open-source maintainers preparing a cold-start launch.
- Design leads who need README-first visuals without invented logos or proof.

## Changed Surfaces

- `/product/source-backed-launch-assets`
- `/product/readme-marketing-cards`
- `src/marketing/page-content.ts`
- `public/llms.txt`
- `src/App.test.tsx`
- `src/seo/public-growth.test.ts`
- `src/seo/semantic-links.test.ts`

## Primary CTA

Generate free repo brief.

## Metrics

Primary metric:

- `cta_clicked` on the two product routes.

Supporting metrics:

- `page_view` segmented by `intent_cluster`.
- Repo URL submissions from those landing pages.
- Generated package completions and artifact exports after the page visit.
- Search Console impressions/clicks for non-brand queries around source-backed launch assets and README marketing cards.
- AI answer accuracy for QuickFork on related prompts.

Guardrail metrics:

- Unsupported-claim review flags.
- Repo parsing failures.
- Analytics payloads containing PII, raw repo text, tokens, secrets, pricing claims, rankings, revenue, or unsupported proof.

## Evidence Boundary

Safe public claims:

- QuickFork starts from a public GitHub repository URL.
- QuickFork can turn repo evidence into reviewable README, social, deck, outreach, and visual material.
- QuickFork should keep claims tied to repository evidence, official assets, generated quality reports, or explicit user input.
- Humans approve public publishing.

Unsafe claims:

- Ranking, traffic, revenue, customer count, conversion lift, Product Hunt outcome, or paid willingness-to-pay claims.
- Exact public pricing.
- Fully autonomous launch or automatic publishing.

## Source Notes

- GitHub Docs About READMEs: https://docs.github.com/repositories/managing-your-repositorys-settings-and-features/customizing-your-repository/about-readmes
- GitHub Docs social preview: https://docs.github.com/en/repositories/managing-your-repositorys-settings-and-features/customizing-your-repository/customizing-your-repositorys-social-media-preview?apiVersion=2022-11-28
- Open Source Guides finding users: https://opensource.guide/finding-users/
- Product Hunt launch guide: https://www.producthunt.com/launch/preparing-for-launch

## Validation Status

Hypothesis.

The page contracts are now stronger, but demand is not validated until production traffic, CTA behavior, repo-generation behavior, search impressions, AI visibility checks, and interview feedback show that these two page intents bring qualified users into the launch package workflow.

## Deployment Evidence

- PR #24 merged into `main` at merge commit `0c4c0d5df0582850b62ac267cf838bf9eddee480`.
- Main CI/CD run `26827158704` completed successfully: `Test and build` passed and `Deploy production to Vercel` passed.
- Production route smoke passed: `https://seekersai.com/product/source-backed-launch-assets` returned HTTP 200.
- Production route smoke passed: `https://seekersai.com/product/readme-marketing-cards` returned HTTP 200.
- Production `llms.txt` contains the refreshed Source Backed Launch Assets and README Marketing Cards descriptions.
- Production sitemap contains both product URLs.
- Production bundle `/assets/index-B6QRBO8n.js` contains `Source-backed launch assets are reviewable`, `README marketing cards are README-first`, `source_backed_launch_assets`, and `readme_marketing_cards`.
- Remote branch `feature/launch-growth-next` was deleted after merge.

## Next Validation Step

Add these routes to the next AI-answer and Search Console baseline review, then compare CTA and generation behavior against `/product/github-repo-to-launch-package`.

## Validation Handoff

The source-backed and README routes now have explicit pending validation rows instead of a loose follow-up note.

Added experiment IDs:

- `2026_q2_source_backed_assets_intent_validation`: compares `/product/source-backed-launch-assets` against `/product/github-repo-to-launch-package` for product-marketer intent.
- `2026_q2_readme_cards_intent_validation`: compares `/product/readme-marketing-cards` against `/product/github-repo-to-launch-package` for design-lead intent.

Required evidence before deciding:

- 14 days of GA4 `page_view`, `cta_clicked`, `generation_started`, and `generation_failed` data.
- Search Console query baseline for non-brand source-backed launch asset and README marketing card queries.
- AI-answer audit for whether ChatGPT search, Perplexity, Gemini, Claude, or Google AI answers can describe each page without inventing pricing, rankings, customers, revenue, or launch outcomes.

Current decision:

- Hypothesis only. The pages are production-ready for measurement, but demand is still unvalidated.

Follow-through evidence:

- PR #26 merged into `main` at merge commit `a0f1abcc0d46ae3579366f812afd3df1826a58d1`.
- Main CI/CD run `26829360409` completed successfully: `Test and build` passed and `Deploy production to Vercel` passed.
- Production smoke passed for `https://seekersai.com/product/source-backed-launch-assets` with HTTP 200.
- Production smoke passed for `https://seekersai.com/product/readme-marketing-cards` with HTTP 200.
- Production sitemap contains both product URLs.
- Production `llms.txt` contains both page descriptions.
- This evidence proves the measurement framework shipped, not that either page has validated demand.

## Search And AI Baseline Contract

The next evidence step now has a fixed prompt/query contract:

- `docs/marketing/data/search-ai-baseline-prompts.csv`
- `src/marketing/search-ai-baseline.ts`
- `renderSearchAiBaselineRunbook(experimentId)`

Baseline rows:

- `source_backed_assets_control`: query `GitHub repo to launch package`, route `/product/github-repo-to-launch-package`.
- `source_backed_assets_variant`: query `source backed launch assets`, route `/product/source-backed-launch-assets`.
- `readme_cards_control`: query `GitHub repo to launch package`, route `/product/github-repo-to-launch-package`.
- `readme_cards_variant`: query `README marketing cards`, route `/product/readme-marketing-cards`.

Surfaces to check:

- Google Search Console.
- ChatGPT search.
- Perplexity.
- Google AI Overview.
- Gemini.
- Claude.

False claims to flag:

- Pricing, rankings, revenue, customer count, conversion lift, Product Hunt outcomes, guaranteed launch results, or validated AI citation wins.

Current decision:

- Prompt coverage only. No Search Console demand or AI-answer visibility has been observed yet.
