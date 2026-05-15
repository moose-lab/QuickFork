# QuickFork Public Traffic and AI SEO Growth Strategy

*Date: 2026-05-15*

## Constraint

This strategy must not run ahead of the product marketing context. The source of truth is `.agents/product-marketing.md`, especially these sections:

- Product Overview: QuickFork is a GitHub-to-launch asset generator.
- Target Audience: open-source maintainers, devrel, founders, product marketers, design leads.
- Pain Points: strong technical projects are hard to understand and share; generic AI output invents unsupported claims.
- Differentiation: source-backed evidence, traceable artifacts, identity rules, locale alignment.
- Proof Points: no fabricated customer metrics, logos, or rankings.
- Goals: increase public awareness, qualified usage, generated packages, signups, and search/AI visibility.

No page, post, directory submission, comparison page, or AI SEO asset should be published if it contradicts that context.

## Current State Audit

Repo evidence:

- Homepage title is currently only `QuickFork` in `index.html`; there is no meta description, canonical URL, Open Graph, Twitter card, or JSON-LD.
- No `robots.txt`, `sitemap.xml`, `llms.txt`, or machine-readable pricing/context file exists in `public/`.
- The public app has one main route plus auth routes; the landing copy explains GitHub repo input, artifact generation, multilingual copy, prompts, quality reports, and manifests.
- The product has no verified customer metrics, logos, traffic baseline, or Search Console data in the repo.

External source rules used for this plan:

- Google recommends descriptive URLs, topical grouping, crawlable resources, sitemaps, and structured data to help it discover and understand pages.
- Google recommends JSON-LD when structured data is practical.
- Google sitemap docs recommend putting the sitemap at the site root, listing canonical URLs, and referencing it from `robots.txt`.
- OpenAI documents `OAI-SearchBot` for ChatGPT search visibility and separates it from `GPTBot` training usage.
- `llms.txt` is an emerging Markdown convention for giving LLMs a curated site overview; it should complement, not replace, normal SEO.

Sources:

- Google SEO Starter Guide: https://developers.google.com/search/docs/fundamentals/seo-starter-guide
- Google technical SEO guide: https://developers.google.com/search/docs/fundamentals/get-started
- Google sitemap guide: https://developers.google.com/search/docs/crawling-indexing/sitemaps/build-sitemap
- Google structured data intro: https://developers.google.com/search/docs/appearance/structured-data/intro-structured-data
- OpenAI crawlers: https://platform.openai.com/docs/bots
- llms.txt proposal: https://llmstxt.org/

## Strategy Thesis

QuickFork should grow public traffic by owning one sharply defined category: "turn a GitHub repository into launch-ready marketing assets." The site should not try to rank broadly for generic AI design or landing-page generator terms first. The defensible search surface is the intersection of GitHub projects, open-source launch, README visuals, developer marketing, and traceable AI generation.

The growth system should have three layers:

1. Make the existing app crawlable and understandable.
2. Create high-intent pages that match how open-source and devtool teams search.
3. Turn every successful generated launch package into a public showcase asset that earns links, social sharing, and AI citations.

## Phase 1: Indexing Foundation

Goal: ensure Google and AI search systems can parse the product clearly before scaling content.

Actions:

| Priority | Action | Why it matters | Context dependency |
| --- | --- | --- | --- |
| P0 | Add homepage metadata: title, description, canonical, OG image, Twitter card | Current `index.html` gives crawlers very little product context | Product Overview |
| P0 | Add JSON-LD `Organization`, `WebSite`, and `SoftwareApplication` on homepage | Helps Google understand QuickFork as a software product | Product Overview, Goals |
| P0 | Add `public/robots.txt` with sitemap reference and explicit policy for search/AI bots | Prevents accidental crawl ambiguity; supports ChatGPT search policy decisions | Goals, Brand Voice |
| P0 | Add `public/sitemap.xml` for canonical public pages | Gives Google a canonical URL list for the small current site | Goals |
| P0 | Add `public/llms.txt` | Gives AI agents a concise, source-aligned overview of QuickFork and key URLs | Differentiation |
| P0 | Add visible FAQ blocks that answer buyer and AI-search questions | FAQ content is extractable and can support rich result eligibility if marked up accurately | Objections |
| P1 | Create `/pricing` or `/pricing.md` when pricing is defined; until then publish "Pricing not finalized" honestly | Avoid opaque or hallucinated pricing in AI-mediated comparisons | Product Overview, Proof Points |

Suggested homepage title:

```text
QuickFork - GitHub Repository to Launch-Ready Marketing Assets
```

Suggested meta description:

```text
QuickFork turns a GitHub repository into source-backed launch copy, README visuals, social cards, prompts, and quality reports.
```

Robots policy decision:

- Allow normal Google/Bing crawling.
- Allow `OAI-SearchBot` if ChatGPT search visibility is a goal.
- Decide separately whether to allow or disallow training crawlers such as `GPTBot`; OpenAI treats search and training crawler controls independently.

## Phase 2: Site Architecture for Search Demand

Goal: move from one app page to a small, crawlable SaaS/content hybrid.

Recommended structure:

```text
Homepage (/)
├── Product (/product)
│   ├── GitHub to launch assets (/product/github-to-launch-assets)
│   ├── README marketing cards (/product/readme-marketing-cards)
│   ├── Multilingual launch copy (/product/multilingual-launch-copy)
│   └── Traceable AI generation (/product/traceable-ai-generation)
├── Examples (/examples)
│   ├── FlashQLA launch card (/examples/flashqla)
│   └── [Generated public showcases] (/examples/{owner}-{repo})
├── Resources (/resources)
│   ├── Open-source launch checklist (/resources/open-source-launch-checklist)
│   ├── README cover prompt guide (/resources/readme-cover-prompt-guide)
│   └── GitHub project marketing card guide (/resources/github-project-marketing-card)
├── Compare (/compare)
│   ├── QuickFork vs Canva for README launch assets (/compare/canva)
│   ├── QuickFork vs ChatGPT for open-source launch copy (/compare/chatgpt)
│   └── QuickFork vs Figma manual launch cards (/compare/figma)
├── Blog (/blog)
├── Pricing (/pricing)
└── Sign up (/sign-up)
```

Navigation:

- Header: Product, Examples, Resources, Pricing, Sign in, CTA "Generate".
- Footer: Product, Examples, Resources, Compare, Legal, `llms.txt`, `sitemap.xml`.
- Every feature page should link back to the generator and at least one example.
- Every example page should link to the source GitHub repo, explain evidence used, and invite the user to generate their own.

## Phase 3: Content Pillars

The content plan should prioritize high-intent, product-led topics. Do not start with generic "AI design" posts.

| Pillar | Search intent | Example topics | Product link |
| --- | --- | --- | --- |
| GitHub project launch | Open-source teams preparing public release | "How to launch an open-source AI project", "GitHub project launch checklist", "How to write a README launch story" | QuickFork turns repo evidence into launch assets |
| README visuals and social cards | Users looking for visual assets | "README cover image generator", "GitHub README banner examples", "Social card sizes for open-source projects" | QuickFork outputs README/PPT/social-ready assets |
| Developer marketing automation | Founders/devrel looking for workflow | "Developer marketing for open-source tools", "How devrel teams package GitHub projects" | QuickFork reduces manual packaging |
| Traceable AI generation | Skeptical buyers worried about hallucination | "How to prevent AI from inventing product claims", "Source-backed AI marketing workflow" | QuickFork stores brief, prompt, QA, and manifest |
| Multilingual launch distribution | Teams launching across English/Chinese/Japanese audiences | "Open-source launch copy in Chinese and English", "How to localize GitHub project announcements" | QuickFork keeps locale slots aligned |

First 12 pieces:

| Priority | Page/topic | Type | Target query | Buyer stage |
| --- | --- | --- | --- | --- |
| 1 | GitHub Project Marketing Card Guide | Definitive guide | github project marketing card | Awareness |
| 2 | Open-Source Launch Checklist | Template/resource | open source launch checklist | Awareness |
| 3 | README Cover Image Generator | Product-led feature page | README cover image generator | Consideration |
| 4 | GitHub Repo to Social Card | Feature page | GitHub social card generator | Consideration |
| 5 | How to Turn a README into Launch Copy | How-to guide | README launch copy | Awareness |
| 6 | QuickFork vs ChatGPT for Launch Copy | Comparison | ChatGPT open source launch copy | Consideration |
| 7 | QuickFork vs Canva for README Cards | Comparison | Canva README banner alternative | Consideration |
| 8 | Source-Backed AI Marketing Workflow | Thought leadership | source-backed AI marketing | Awareness |
| 9 | Multilingual Open-Source Launch Copy | Feature/resource | multilingual launch copy | Consideration |
| 10 | FlashQLA Example Showcase | Example/case page | FlashQLA launch card | Decision |
| 11 | README Banner Size Guide | Utility guide | README banner size | Awareness |
| 12 | GPT-image Prompt Template for README Cards | Template | README card prompt template | Implementation |

## Phase 4: AI SEO and Citation Readiness

Goal: make QuickFork easy for AI systems to summarize and cite accurately.

Required content block pattern for every strategic page:

1. First paragraph: direct definition of the page topic in 40-60 words.
2. "Best for" section naming the target persona.
3. "How it works" numbered steps.
4. Comparison table when the page has alternatives.
5. FAQ with natural-language questions.
6. "Last updated" date.
7. Links to source artifacts or examples where available.

AI-readable assets:

- `/llms.txt`: product summary, who it is for, canonical product/resources/example URLs, current pricing status, and agent-safe description.
- `/pricing.md`: only after pricing exists. Before that, either omit it or state pricing is not finalized.
- `/examples/{owner}-{repo}.md`: Markdown version of each public showcase, including evidence fields and generated artifacts.
- `/resources/open-source-launch-checklist.md`: Markdown version of key resources for AI agents.

Do not claim:

- "Best AI launch tool" unless there is independent evidence.
- Customer count, traffic growth, or conversion lifts until measured.
- Google/AI ranking guarantees.

## Phase 5: Showcase Flywheel

Goal: transform generated artifacts into indexed pages and shareable proof.

Workflow:

1. User generates a launch package from a public GitHub repo.
2. QuickFork stores a reviewable artifact bundle.
3. User opts in to publish a showcase page.
4. Showcase page includes source repo, summary, exact evidence used, generated image, prompt excerpt, QA report summary, and CTA to generate a similar asset.
5. Showcase page links back to the source GitHub repo and encourages maintainers to link from README.

Showcase page template:

- H1: `{Project Name} Launch Card Generated with QuickFork`
- Definition block: what the project is, based only on repo evidence.
- Asset preview: generated README/social card.
- Evidence table: repo URL, stars if fetched, language, topics, official logo/avatar source, README source URL.
- Output table: locales, ratio, prompt path, image path, QA status.
- CTA: "Generate a launch card from your GitHub repo."

This flywheel is the highest-leverage growth path because it creates product-led content directly from usage while respecting the traceability positioning.

## Phase 6: Distribution and Backlinks

Primary channels:

| Channel | Action | Guardrail |
| --- | --- | --- |
| GitHub READMEs | Encourage users to add generated cards with "Generated with QuickFork" attribution | Attribution must be optional and honest |
| Product Hunt / launch directories | Submit once the generator and examples are stable | Do not overclaim metrics |
| AI/tool directories | List under devtool, open-source marketing, README generator, and social-card generator categories | Use the Product Overview wording |
| Devrel communities | Share checklist/templates, not generic ads | Lead with useful resources |
| X/LinkedIn | Post before/after repo-to-card examples | Include source repo and evidence note |
| Blog guest posts | Pitch "source-backed AI marketing for open-source launches" | Avoid generic AI content |

Backlink targets:

- GitHub repos using generated launch cards.
- Open-source launch checklists.
- Devrel newsletters.
- AI tool directories.
- README template/resource lists.
- Product marketing and developer marketing blogs.

## Phase 7: Measurement

Set up baselines before judging performance:

| Metric | Tool | Frequency |
| --- | --- | --- |
| Indexed pages | Google Search Console | Weekly |
| Organic impressions/clicks | Google Search Console | Weekly |
| Top queries | Google Search Console | Weekly |
| AI citation checks | Manual ChatGPT/Perplexity/Gemini query sheet | Monthly |
| Referral traffic from AI/search/social | GA4 or equivalent | Weekly |
| Generator starts/completions | Product analytics | Weekly |
| Published showcases | Database/event log | Weekly |
| Backlinks from GitHub READMEs | Ahrefs/Semrush or manual GitHub search | Monthly |

Suggested event names:

- `generation_started`
- `generation_completed`
- `generation_failed`
- `generated_image_preview_opened`
- `generated_image_downloaded`
- `showcase_publish_started`
- `showcase_published`
- `signup_completed`

Priority AI visibility queries to track monthly:

- "GitHub repository to launch assets"
- "README cover image generator"
- "GitHub project marketing card"
- "open source launch checklist"
- "AI tool for GitHub README social cards"
- "source-backed AI marketing workflow"
- "QuickFork vs ChatGPT launch copy"

## 30/60/90 Day Plan

### First 30 Days

- Add SEO metadata, canonical, OG/Twitter tags, JSON-LD, `robots.txt`, `sitemap.xml`, and `llms.txt`.
- Publish the first three crawlable pages: README Cover Image Generator, GitHub Project Marketing Card Guide, Open-Source Launch Checklist.
- Add FAQ sections to homepage and feature pages using only product-context-approved claims.
- Set up Search Console, Bing Webmaster Tools, and baseline event tracking.

### Days 31-60

- Launch `/examples` with FlashQLA and 3-5 reviewed showcase pages.
- Publish comparison pages for ChatGPT, Canva, and Figma/manual workflow.
- Add Markdown mirrors for major resources and examples.
- Start monthly AI visibility tracking across key queries.
- Run targeted outreach to GitHub project maintainers whose showcase pages are published.

### Days 61-90

- Add opt-in public showcase publishing to the product flow.
- Create 10-20 showcase pages from real public repos, each with evidence tables and generated assets.
- Submit to relevant AI/devtool/startup directories.
- Refresh pages based on Search Console queries and AI answer gaps.
- Decide pricing and publish `/pricing` plus `/pricing.md` if monetization is ready.

## Acceptance Criteria

The strategy is working only if these become true:

- Google can crawl canonical public pages and sitemap URLs.
- Search Console shows impressions for at least 10 relevant non-brand queries.
- At least one AI search product can accurately summarize QuickFork from public pages without inventing pricing or proof.
- The site has at least 10 public, reviewable, source-backed example pages.
- Generator usage and public traffic can be tied together through analytics events.
- No published growth page violates `.agents/product-marketing.md`.
