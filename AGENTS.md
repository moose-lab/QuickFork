# QuickFork Agent Instructions

## Superpowers System

Superpowers is installed through the Codex plugin system on this machine.
Use the available `superpowers:*` skills when a task matches their trigger rules.
The old standalone bootstrap CLI is not part of the current Superpowers v5.1.0 plugin checkout, so no shell bootstrap step is needed.

## Marketing Growth Operating System

Use [coreyhaines31/marketingskills](https://github.com/coreyhaines31/marketingskills) as the operating system for QuickFork marketing work. Treat it as a set of task-specific agent skills, not as generic marketing advice. Its `product-marketing` context is the foundation for landing pages, SEO, GEO, customer research, pricing, and growth execution.

Every QuickFork growth iteration must follow this loop:

1. Read the current source-of-truth docs.
2. Choose the relevant `superpowers:*` and marketingskills.
3. State the growth hypothesis, target lifecycle stage, target user, CTA, metric, guardrail, and evidence gap.
4. Make the smallest useful change or plan.
5. Verify the change with repo tests, production checks, analytics checks, or manual evidence collection as appropriate.
6. Update repo docs and the Obsidian strategy mirror with what changed, what evidence exists, and what remains unvalidated.

### Source of Truth

- Start from `.agents/product-marketing.md` before writing copy, planning SEO/GEO pages, changing positioning, or defining paid packaging.
- Use `docs/marketing/quickfork-public-traffic-ai-seo-growth-strategy.md` for public traffic, AI SEO, crawlability, and citation-readiness direction.
- Use `docs/specs/2026-05-16-growth-validation-system.md` before calling any strategy "validated" or "final".
- Use `docs/specs/2026-05-19-full-funnel-marketing-system.md` and `docs/plans/2026-05-19-full-funnel-marketing-implementation-plan.md` for funnel implementation order, lifecycle stages, CRM/lead-capture boundaries, ROI labels, and measurement dependencies.
- Use `docs/marketing/research/2026-05-16-customer-research.md`, `docs/marketing/research/2026-05-16-interview-plan.md`, `docs/marketing/research/2026-05-16-search-ai-visibility-baseline.md`, and `docs/marketing/research/2026-05-16-validation-roadmap.md` as evidence inputs before treating a segment, keyword, or message as validated.
- Check the Obsidian strategy mirror at `/Users/moose/Documents/Moose's Birth ID/QuickFork/SEO Growth/2026-05-19 QuickFork Marketing Attribution and SEO Growth Capability Map.md` during growth strategy, SEO/GEO, attribution, or lifecycle work.
- Repo docs are the implementation source of truth. Obsidian is the strategy mirror and decision log; if it conflicts with repo docs, record the conflict and prefer the repo docs unless the user explicitly says otherwise.
- Do not update `.agents/product-marketing.md` with new positioning, ICP, proof, pricing, or claims until there is documented evidence in the marketing research docs.

### Superpowers Requirements

- Use `superpowers:*` skills whenever their trigger rules match. No standalone bootstrap CLI is required.
- For multi-step growth implementation, use `superpowers:writing-plans` before coding or large doc changes unless the user asks for a small direct edit.
- For execution from an existing written plan, use `superpowers:executing-plans` or `superpowers:subagent-driven-development` according to the plan handoff.
- Before claiming a growth change is complete, use `superpowers:verification-before-completion`: identify the proof command or manual evidence, run or inspect it freshly, and report the result.
- When debugging analytics, indexing, crawlability, or conversion behavior, use `superpowers:systematic-debugging` before patching.

### Marketingskills Flow

When doing QuickFork marketing work, use the relevant marketingskills in this order:

1. `product-marketing`: confirm the current product, audience, objections, proof limits, and claim boundaries.
2. `customer-research`: identify target users, buyer triggers, interview questions, communities, search language, and evidence gaps.
3. `copywriting` plus `cro`: create or revise landing pages around one clear conversion action: paste a GitHub repository URL, generate a launch package, sign up, download a resource, request a demo, or request a productized package.
4. `seo-audit`, `ai-seo`, `schema`, `site-architecture`, and `programmatic-seo`: make pages crawlable, extractable, internally linked, schema-backed, and citation-ready for Google, Perplexity, ChatGPT search, Gemini, Claude, and other AI answer systems.
5. `analytics` and `ab-testing`: define event names, attribution, baseline measurements, experiment windows, and success thresholds before calling a growth tactic successful.
6. `pricing`, `paywalls`, `revops`, and `sales-enablement`: package validated demand into paid offers, lead qualification, sales assets, and lifecycle stages.

If a marketingskills skill is not installed locally, reference the GitHub repo and install or copy only the specific skill needed after the user approves dependency changes.

### Growth Strategy Analysis

Every growth strategy analysis must separate:

- Direct SEO/GEO capabilities: route metadata, title/description/canonical/H1, crawlable pages, `robots.txt`, `sitemap.xml`, `llms.txt`, schema, internal links, AI-readable answer blocks, and indexable examples.
- Indirect SEO support: UTM attribution, lead capture, CRM lifecycle, reporting, ROI, nurture, and sales follow-up. These do not improve rankings by themselves but prove whether discovery creates business value.
- Product activation: repository URL entry, generation started, generation completed, preview opened, artifact downloaded, signup, showcase intent, and repeat usage.
- Productization: paid package intent, export needs, collaboration needs, hosted showcase needs, agency/team workflows, white-label needs, and willingness-to-pay evidence.

Do not describe CRM, lead scoring, or ROI as SEO ranking factors. Describe them as attribution and monetization systems that judge whether SEO/GEO traffic is valuable.

For every strategy recommendation, include:

- Target user segment.
- Lifecycle stage.
- Page, channel, or product surface.
- Primary CTA.
- Primary metric and guardrail metric.
- Required evidence before scaling.
- Whether the idea is validated, partially validated, or still a hypothesis.

### Product Lifecycle Plan

Map growth work to this lifecycle. Do not skip stages just because a page or feature can be built quickly.

| Lifecycle stage | Goal | Primary evidence | Typical work |
| --- | --- | --- | --- |
| Discovery | Find who has the pain and how they describe it | Interviews, search language, community posts, AI-answer gaps | Customer research, search baseline, message tests |
| Validation | Prove a segment or page promise deserves investment | Production events, 2-4 weeks of page data, interview synthesis | Smoke-test pages, SEO/GEO audits, CTA tests |
| Activation | Turn visitors into successful generated packages | `generation_started`, `generation_completed`, previews, downloads, signups | Landing page CRO, generator UX, trust blocks |
| Monetization | Package repeated high-value outcomes | Lead quality, demo requests, PQL/MQL signals, WTP signals | Pricing tests, paywall design, sales collateral |
| Retention | Make repeated launches useful | Repeat generation, saved workspaces, exports, team review | Lifecycle email, onboarding, product loops |
| Scale | Expand only proven loops | Indexed pages, AI citations, qualified leads, pipeline ROI | Programmatic showcases, directories, partnerships, referrals |

Lead lifecycle stages should remain compatible with the full-funnel spec: subscriber, lead, PQL, MQL, SQL-ready, opportunity, customer, and closed-lost where relevant. Browser analytics must stay PII-free; CRM-only fields may contain email or contact data server-side only.

### Landing Page Rules

- Build landing pages for high-intent jobs, not broad "AI marketing" traffic.
- The first paid-intent page should center on "GitHub repo to launch package" or "source-backed launch assets" before generic landing-page generator terms.
- Each strategic page needs a direct 40-60 word definition block, a named target persona, the exact job-to-be-done, evidence-backed benefits, a workflow section, an objection/FAQ section, last-updated date, internal links, and one primary CTA.
- Do not publish claims about rankings, revenue, customer count, conversion lift, or pricing unless they are already measured or explicitly marked as hypotheses.
- Every landing page should connect back to the generator and to at least one source-backed example, showcase, guide, or checklist.
- Prefer concrete product language: GitHub repository, source-backed launch package, README/social card, localized copy, prompt, QA report, manifest, and AI-search-ready showcase.

### SEO and GEO Rules

- Treat GEO as AI search visibility: the goal is accurate citation and extraction, not just ranking.
- Every SEO/GEO page should include extractable answer blocks, natural-language FAQs, comparison tables where relevant, last-updated dates, internal links, and schema when the content supports it.
- Keep `robots.txt`, `sitemap.xml`, `llms.txt`, public pricing/context pages, canonical metadata, and structured data aligned with the approved page inventory.
- Prioritize pages where QuickFork has product proof: GitHub project launch, README marketing cards, source-backed AI marketing, multilingual launch copy, public showcase examples, and launch-readiness tools.
- Avoid thin scaled pages. A page is not ready for sitemap or `llms.txt` inclusion until it has unique intent, product relevance, source-backed examples, and a measurable CTA.
- AI answer audits should check whether ChatGPT search, Perplexity, Google AI Overviews, Gemini, and Claude can describe QuickFork accurately without inventing proof or pricing.
- Production SEO smoke tests should check `https://seekersai.com` status codes, canonical tags, sitemap, robots policy, `llms.txt`, and representative published marketing routes.

### Target User Discovery

Find target users by looking for people already showing the pain, not by starting with demographic labels.

Primary segments to validate:

- Open-source maintainers launching AI/devtool repositories who need README visuals, launch copy, and credible distribution assets.
- Indie hackers and SaaS founders who have a GitHub-backed product but lack time or design/marketing support for launch packaging.
- DevRel and product-marketing operators who repeatedly turn technical work into public examples, decks, docs, and social posts.
- Design/product studios that package client projects and need a repeatable, source-backed launch-asset workflow.

Evidence to collect:

- Search queries and AI-answer prompts they use.
- Repeated language from GitHub issues, READMEs, launch posts, Product Hunt pages, devrel blogs, Reddit/Hacker News discussions, X/LinkedIn posts, and direct interviews.
- Buying triggers such as upcoming launch deadlines, Product Hunt preparation, README rewrite, funding/demo day, client handoff, multilingual distribution, or repeated project launches.
- Willingness-to-pay signals such as asking for exports, white-label assets, team review, batch generation, examples hosted on their domain, CRM capture, analytics reports, human review, or predictable campaign reporting.

### Growth Priority Order

Use this order unless newer evidence proves a different path:

| Priority | Workstream | Outcome |
| --- | --- | --- |
| P0 | Measurement and evidence | GA4/Search Console/Bing/AI-answer baselines, production events, and an evidence log are active before scaling content. |
| P1 | ICP and page validation | Interview maintainers, founders, devrel/product marketers, and studios; launch one product-led landing page per validated high-intent job. |
| P2 | SEO/GEO foundation | Ship crawlable product/resource/example pages, schema, `sitemap.xml`, `llms.txt`, and AI-readable answer blocks. |
| P3 | Activation and lead capture | Convert traffic into generated packages, signups, resource downloads, demo requests, and qualified CRM records. |
| P4 | Paid packaging | Turn repeated high-value workflows into paid tiers, with clear gating, exports, collaboration, and reporting. |
| P5 | Scale | Add programmatic showcases, directory submissions, partner links, content distribution, lifecycle email, and referral loops only after P0-P4 are working. |

### Productization Direction

Package QuickFork as a paid product only around outcomes users would pay to avoid doing manually.

Default paid-product hypothesis:

- Free: one repo scan or limited launch-card generation that shows the source-backed brief, one visual direction, and one CTA.
- Starter: a single repository launch package with landing-page spine, README/social visuals, localized launch copy, prompt, QA report, and downloadable manifest.
- Pro: recurring launch packages, hosted showcase pages, SEO/GEO page drafts, AI-answer audit, analytics links, and exportable content blocks.
- Team/Agency: multi-repo workspace, brand rules, review workflow, white-label exports, CRM handoff, campaign reporting, and batch generation.

Do not put exact pricing on public pages until pricing research or real purchase intent supports it. Internally, evaluate pricing with `pricing` and `paywalls` skills, and document the evidence behind any packaging change.

### Strategy Effectiveness Review

Before marking a growth strategy or growth iteration as effective, verify the appropriate evidence:

- Crawlability: canonical public pages return 200, sitemap URLs are accessible, and robots policy does not block intended search/AI bots.
- Search demand: Search Console or equivalent shows impressions for relevant non-brand queries.
- AI visibility: at least one AI search product can summarize QuickFork accurately without inventing pricing, rankings, customers, or revenue.
- Activation: generator usage can be tied to page or campaign source through analytics events.
- Lead value: resource downloads, contact requests, demo requests, PQLs, MQLs, or SQL-ready leads are attributable to the page or campaign.
- Product-market learning: interviews or user behavior show which artifact creates value and which objections remain.
- Claim hygiene: no public page violates `.agents/product-marketing.md`.

If evidence is missing, label the strategy as a hypothesis and document the next validation step.

### Obsidian Strategy Log

For growth strategy, SEO/GEO, attribution, lifecycle, or monetization work, use Obsidian as the local strategy mirror:

- Read `/Users/moose/Documents/Moose's Birth ID/QuickFork/SEO Growth/2026-05-19 QuickFork Marketing Attribution and SEO Growth Capability Map.md` before changing growth priorities, SEO/GEO plans, attribution logic, or product lifecycle assumptions.
- After a growth iteration, update the relevant Obsidian note or create a dated note in the same QuickFork Obsidian area if the existing note is not the right place.
- Each Obsidian entry should include: date, repo commit or file refs, hypothesis, lifecycle stage, target user, changed surface, metric, guardrail, evidence observed, decision, and next action.
- Do not store secrets, tokens, raw emails, private repo content, or sensitive analytics exports in Obsidian.
- Do not treat an Obsidian note as validated evidence by itself. It is a mirror of decisions and observations; validation still requires repo docs, production checks, analytics, interviews, or search/AI visibility evidence.

### Guardrails

- QuickFork's durable positioning is source-backed, traceable project marketing from GitHub evidence. Do not drift into generic AI landing-page, design, or SEO automation unless the page clearly ties back to this wedge.
- Keep generated marketing reviewable. Humans approve claims, examples, pricing, and public publishing.
- Do not claim "automatic growth", "guaranteed rankings", "viral launch", or "fully autonomous marketing".
- Prefer narrow, testable growth bets over broad strategy docs. Every growth recommendation should name the target user, page or channel, CTA, expected signal, and evidence required to continue.
