# Cold-Start Launch Materials Hub

Date: 2026-06-02

## Growth Hypothesis

If QuickFork publishes a product-led hub for `cold start launch materials`, AI project builders and maintainers will better understand the full product value unit: source-backed README, social, deck, visual, and outreach drafts generated from one public GitHub repository URL.

This is a landing-page and measurement slice. It does not validate demand until production behavior, Search Console data, AI-answer observations, and user feedback are collected.

## Lifecycle Stage

P1/P2: High-intent product page validation plus SEO/GEO foundation.

The page connects Discovery and Validation work to the existing Activation surface: generate a free repo brief.

## Target User

- AI project builders preparing a first public launch.
- Open-source maintainers who need README and social-preview clarity.
- Indie technical founders who need launch materials before hiring marketing support.
- DevRel teams that repeatedly turn repositories into public examples, decks, and outreach.

## Primary CTA

Generate free repo brief.

## Metrics

Primary metric:

- `cta_clicked_per_page_view` for `/product/cold-start-launch-materials`.

Supporting metrics:

- `page_view` with `intent_cluster=cold_start_launch_materials`.
- `generation_started` and `generation_failed` after the page visit.
- Artifact copy/download behavior after generation.
- Search Console impressions and clicks for `cold start launch materials`.
- AI-answer audit accuracy across ChatGPT search, Perplexity, Google AI Overview, Gemini, and Claude.

Guardrail metrics:

- `generation_failed_per_generation_started`.
- Unsupported-claim review flags.
- Browser analytics containing raw README text, raw artifact body, email, token, secret, API key, private repo content, or unsupported proof.

## Changed Surfaces

- `/product/cold-start-launch-materials`
- `src/marketing/link-catalog.ts`
- `src/marketing/page-content.ts`
- `docs/marketing/data/semantic-link-inventory.csv`
- `public/sitemap.xml`
- `public/llms.txt`
- `docs/marketing/data/growth-experiment-registry.csv`
- `docs/marketing/data/growth-experiment-evidence.csv`
- `docs/marketing/data/search-ai-baseline-prompts.csv`
- `src/marketing/growth-experiments.ts`
- `src/marketing/growth-experiment-report.ts`
- `src/marketing/search-ai-baseline.ts`
- `src/App.test.tsx`
- `src/seo/semantic-links.test.ts`
- `src/seo/public-growth.test.ts`
- `src/marketing/growth-experiments.test.ts`
- `src/marketing/growth-experiment-report.test.ts`
- `src/marketing/search-ai-baseline.test.ts`

## Research Inputs

- `.agents/product-marketing.md`: QuickFork is a source-backed repository-to-launch asset workflow, not a generic AI landing-page generator.
- `docs/marketing/research/2026-06-01-cold-start-launch-demand-analysis.md`: the product value unit should be a launch package, not a single generated page.
- `docs/plans/2026-06-01-quickfork-growth-lifecycle-prioritization.md`: P1 needs high-intent landing pages and P2 needs free repo launch brief activation.
- GitHub README docs: the README is a key repository explanation surface.
- GitHub social preview docs: repository sharing creates a real visual launch surface.
- Open Source Guides finding users: user discovery and feedback shape open-source launch messaging.
- Product Hunt launch guide: launch preparation includes concise story, media, maker context, and launch-day copy.

## Claim Boundary

Safe claims:

- QuickFork starts from one public GitHub repository URL.
- QuickFork can describe a source-backed launch materials workflow for README, social, deck, visual, and outreach drafts.
- QuickFork requires human review before public publishing.
- Search and AI-answer visibility are pending measurement.

Unsafe claims:

- Validated demand for the new page.
- Exact public pricing.
- Business, search, launch, or adoption outcomes.
- Fully automated publishing or human-free claim approval.

## Experiment Contract

Experiment ID:

- `2026_q2_cold_start_materials_intent_validation`

Control:

- `/product/github-repo-to-launch-package`

Variant:

- `/product/cold-start-launch-materials`

Decision rule:

- Higher `cta_clicked_per_page_view` with no significant guardrail regression after a minimum 14-day window.

Required evidence:

- GA4 page views and CTA clicks.
- Generation starts and failures.
- Search Console query baseline.
- AI-answer audit.

Current decision:

- `insufficient_data`.

## Search And AI Baseline Rows

- `cold_start_materials_control`: query `GitHub repo to launch package`, route `/product/github-repo-to-launch-package`.
- `cold_start_materials_variant`: query `cold start launch materials`, route `/product/cold-start-launch-materials`.

Surfaces:

- Google Search Console.
- ChatGPT search.
- Perplexity.
- Google AI Overview.
- Gemini.
- Claude.

## Validation Status

Hypothesis only.

The route, SEO/GEO assets, and measurement contracts make the growth idea testable. They do not prove that users want this exact page, that the route ranks, or that AI answer systems cite it.

## Next Validation Step

After production deploy:

1. Smoke-check `/product/cold-start-launch-materials`, `sitemap.xml`, and `llms.txt`.
2. Start the 14-day experiment window.
3. Run the Search Console and AI-answer baseline prompts.
4. Compare page CTA and generation behavior against `/product/github-repo-to-launch-package`.
