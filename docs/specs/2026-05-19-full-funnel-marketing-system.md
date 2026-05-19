# Spec: QuickFork Full-Funnel Marketing and CRM Attribution System

*Date: 2026-05-19*

## Objective

Build a complete marketing funnel for QuickFork before payment support exists. The system must connect public discovery, semantic SEO pages, UTM-tagged distribution links, product engagement, lead capture, CRM automation, sales qualification, and ROI reporting.

The near-term goal is not payment revenue. The goal is to prove which acquisition surfaces create qualified product usage and sales-ready demand for a GitHub-to-launch asset generator.

## Assumptions

1. `.agents/product-marketing.md` remains the positioning source of truth.
2. QuickFork does not currently support payments, checkout, subscriptions, or in-app billing.
3. GA4 direct `gtag.js`, `window.dataLayer`, and `quickfork:analytics` are the current measurement layer.
4. Existing UTM capture is session-scoped. Durable first-touch attribution requires a future lead/account record.
5. CRM platform is not selected yet. The first implementation should be adapter-first and exportable.
6. SEO implementation must not publish fabricated pricing, customer count, revenue, rankings, or usage claims.
7. Public showcase pages for third-party repositories require explicit opt-in or a curated internal allowlist.

## Tech Stack

- Vite 7
- React 19
- TypeScript 5.9
- Vitest and Testing Library
- GA4 direct `gtag.js`
- Future CRM adapter: HubSpot, Pipedrive, Airtable, Notion, or a custom webhook target
- Future email/nurture adapter: Resend, HubSpot Marketing, ConvertKit, Customer.io, or a custom webhook target

## Commands

```bash
npm test
npm run build
npm test -- src/lib/analytics.test.ts src/App.test.tsx src/components/auth/AuthPage.test.tsx src/seo/public-growth.test.ts
```

## Project Structure

```text
.agents/product-marketing.md                                  Master positioning and claim boundaries
docs/marketing/quickfork-public-traffic-ai-seo-growth-strategy.md
docs/marketing/research/2026-05-18-seekersai-analytics-tracking-plan.md
docs/specs/2026-05-19-full-funnel-marketing-system.md         This spec
docs/plans/2026-05-19-full-funnel-marketing-implementation-plan.md
src/lib/analytics.ts                                          Existing event and UTM helper
src/components/landing/HeroSection.tsx                        Core product activation events
src/components/auth/AuthPage.tsx                              Signup/signin events
```

Future implementation can add:

```text
docs/marketing/data/semantic-link-inventory.csv               Human-editable source of generated links
src/marketing/link-catalog.ts                                 Typed link catalog for static routes and sitemap
src/marketing/lead-scoring.ts                                 Lead scoring rules
src/server/crm/                                                CRM adapter boundary
src/server/marketing/                                          Lead capture and campaign APIs
```

## Funnel Model

### Top Funnel: Traffic, Exposure, and Discovery

Objective: turn public demand into qualified visits and first product intent.

Primary surfaces:

| Surface | URL pattern | Intent | Primary metric |
| --- | --- | --- | --- |
| Product pages | `/product/{capability}` | Category and feature consideration | `generation_started / page_view` |
| Use-case pages | `/use-cases/{persona-or-job}` | Persona and job-to-be-done demand | `cta_clicked / page_view` |
| Resource pages | `/resources/{guide-or-template}` | Searchable educational demand | `lead_magnet_requested / page_view` |
| Comparison pages | `/compare/{alternative}` | Commercial evaluation | `signup_started / page_view` |
| Example pages | `/examples/{owner}-{repo}` | Proof and product-led SEO | `generation_started / example_page_view` |
| Tool pages | `/tools/{utility}` | Engineering-as-marketing utility | `tool_result_viewed / tool_started` |
| Directory links | External profiles | Referral discovery | Sessions by `utm_source` |
| GitHub README links | External repo backlinks | Product-led referral traffic | Sessions and starts by `utm_content=readme_badge` |

Required top-funnel events:

| Event | Trigger | Required properties |
| --- | --- | --- |
| `page_view` | Route render | `page_path`, `page_title`, `page_referrer`, `page_type`, `page_intent`, `utm_*` |
| `cta_clicked` | Primary or secondary CTA click | `cta_id`, `cta_label`, `cta_location`, `page_type`, `target_url`, `utm_*` |
| `outbound_link_clicked` | Link to source repo, directory, social, or docs | `destination_host`, `link_context`, `page_type`, `utm_*` |
| `resource_page_viewed` | Resource route render | `resource_slug`, `resource_type`, `buyer_stage`, `utm_*` |
| `example_page_viewed` | Example route render | `repo_full_name`, `example_slug`, `source_type`, `utm_*` |
| `tool_started` | Visitor starts a free tool | `tool_slug`, `page_type`, `utm_*` |

External data sources:

- Google Search Console: impressions, clicks, indexed pages, queries.
- Bing Webmaster Tools: impressions, clicks, indexed pages.
- GA4: sessions, engagement, key events by UTM and page type.
- Manual AI visibility sheet: ChatGPT, Perplexity, Gemini, Google AI summaries.
- Directory/referral sheet: listing URL, status, UTM link, first indexed date.

### Middle Funnel: Lead Nurture and Interaction

Objective: identify engaged visitors, move them toward repeated use, and collect enough fit/intent data for CRM routing.

Primary interactions:

| Interaction | Why it matters | Event or CRM activity |
| --- | --- | --- |
| Paste GitHub repo URL | Strong product intent | `hero_repo_url_entered` |
| Generate launch package | Primary activation | `generation_started`, `generation_completed` |
| Preview/download result | Artifact-value moment | `generated_image_preview_opened`, `generated_image_downloaded` |
| Save or publish showcase | Proof flywheel | `showcase_publish_started`, `showcase_published` |
| Request checklist/template | Educational lead capture | `lead_magnet_requested`, `lead_magnet_delivered` |
| Sign up | Account conversion | `signup_started`, `signup_completed` |
| Return visit with prior campaign | Nurture progression | `returning_campaign_visit` |
| Email click | Nurture engagement | CRM/email provider activity |

Required middle-funnel events:

| Event | Trigger | Required properties |
| --- | --- | --- |
| `lead_magnet_requested` | Visitor submits a resource form | `resource_slug`, `resource_type`, `buyer_stage`, `capture_location`, `utm_*` |
| `lead_magnet_delivered` | Resource delivery succeeds | `resource_slug`, `delivery_channel`, `utm_*` |
| `generation_started` | Existing hero generator submit | `repo_host`, `repo_full_name`, `locales`, `locale_count`, `preset`, `image_quality`, `utm_*` |
| `generation_completed` | Generation succeeds | `repo_host`, `repo_full_name`, `generation_id`, `has_image_url`, `utm_*` |
| `generated_image_downloaded` | Image download clicked | `repo_full_name`, `generation_id`, `output_locale`, `preset`, `utm_*` |
| `signup_completed` | Account creation succeeds | `method`, `utm_*` |
| `showcase_publish_started` | User begins opt-in showcase flow | `repo_full_name`, `generation_id`, `utm_*` |
| `showcase_published` | Showcase is published | `repo_full_name`, `example_slug`, `generation_id`, `utm_*` |

### Bottom Funnel: Sales Conversion and ROI Without Payments

Objective: measure sales-ready demand and marketing ROI through CRM pipeline, not checkout revenue.

Bottom-funnel conversions:

| Conversion | Definition | Owner | ROI use |
| --- | --- | --- | --- |
| Product-qualified lead | Signed up and completed at least one successful generation | Product/marketing | Shows high-intent product usage |
| Marketing-qualified lead | Fit score plus engagement score passes threshold | Marketing | Routes to sales or founder follow-up |
| Sales-qualified lead | Human accepts lead and confirms relevant need | Sales/founder | Creates opportunity pipeline |
| Opportunity created | CRM deal exists with estimated value and source attribution | Sales/founder | Pipeline value by campaign |
| Manual closed-won | Offline contract, pilot, or paid service agreement closed manually | Sales/founder | Revenue when payments are not in-product |
| Investor/partner qualified | Strategic partner or investor asks for follow-up | Founder | Non-revenue business value |

Required bottom-funnel events and CRM activities:

| Name | Type | Required properties |
| --- | --- | --- |
| `demo_requested` | Analytics event + CRM activity | `request_type`, `company_domain`, `role_segment`, `utm_*` |
| `sales_contact_requested` | Analytics event + CRM activity | `contact_reason`, `company_domain`, `role_segment`, `utm_*` |
| `crm_lead_created` | CRM sync activity | `lead_id`, `first_touch_*`, `last_touch_*`, `source_page`, `lifecycle_stage` |
| `crm_lead_qualified` | CRM activity | `lead_id`, `fit_score`, `engagement_score`, `qualification_reason` |
| `sales_opportunity_created` | CRM activity | `lead_id`, `opportunity_id`, `estimated_value`, `currency`, `source_campaign` |
| `manual_closed_won` | CRM activity | `opportunity_id`, `contract_value`, `currency`, `source_campaign` |
| `roi_snapshot_generated` | Internal report activity | `period`, `campaign_cost`, `pipeline_value`, `contract_value`, `roi_method` |

Until payments exist, ROI reporting should show:

- Qualified product usage by campaign.
- MQLs and SQLs by campaign.
- Pipeline value by campaign.
- Manual closed-won value by campaign if available.
- Cost per qualified generation, cost per signup, cost per MQL, and cost per opportunity.
- Estimated ROI with a clear label when using pipeline value instead of booked revenue.

## Semantic Bulk Link System

The link system must generate meaningful landing URLs first, then attach campaign parameters. The path should describe user intent; UTM should describe distribution context.

### Link Taxonomy

| Field | Purpose | Example |
| --- | --- | --- |
| `funnel_stage` | Top, middle, or bottom | `top` |
| `buyer_stage` | Awareness, consideration, decision, implementation | `consideration` |
| `persona` | Primary audience | `open_source_maintainer` |
| `intent_cluster` | Search or campaign theme | `readme_social_card` |
| `page_type` | Product, use case, resource, compare, example, tool | `resource` |
| `slug` | Canonical path segment | `github-project-marketing-card-guide` |
| `canonical_url` | Clean URL without tracking | `https://seekersai.com/resources/github-project-marketing-card-guide` |
| `primary_keyword` | Search target | `github project marketing card` |
| `primary_cta` | Desired action | `generate_launch_card` |
| `utm_source` | Distribution source | `github` |
| `utm_medium` | Channel class | `referral` |
| `utm_campaign` | Campaign motion | `repo_to_card_demo` |
| `utm_content` | Creative or placement | `readme_badge` |
| `crm_campaign` | CRM campaign name | `2026_q2_repo_to_card_demo` |

### URL Families

Use these semantic URL families before adding UTM parameters:

| Family | Example canonical URL | Purpose |
| --- | --- | --- |
| Product | `/product/github-repo-to-launch-package` | Capture category demand |
| Product | `/product/source-backed-launch-assets` | Capture trust/traceability demand |
| Product | `/product/readme-marketing-cards` | Capture README visual demand |
| Use case | `/use-cases/open-source-launch` | Map directly to ICP jobs |
| Use case | `/use-cases/devrel-launch-workflow` | Speak to repeatable team workflows |
| Resource | `/resources/open-source-launch-checklist` | Top-funnel useful asset |
| Resource | `/resources/github-project-marketing-card-guide` | Core category guide |
| Resource | `/resources/readme-cover-prompt-guide` | Prompt/template demand |
| Compare | `/compare/chatgpt-open-source-launch-copy` | Alternative evaluation |
| Compare | `/compare/canva-readme-banner-generator` | Visual alternative evaluation |
| Example | `/examples/qwenlm-flashqla-launch-card` | Product-led proof |
| Tool | `/tools/github-repo-launch-readiness-score` | Free tool lead capture |
| Template | `/templates/github-launch-announcement` | Implementation-stage demand |

### Initial Batch Link Set

These links are ready to put into a future link inventory file. They should not be added to sitemap until the matching pages exist.

| Stage | Canonical URL | UTM example |
| --- | --- | --- |
| Top | `https://seekersai.com/product/github-repo-to-launch-package` | `?utm_source=google&utm_medium=organic&utm_campaign=seo_foundation&utm_content=product_category` |
| Top | `https://seekersai.com/product/source-backed-launch-assets` | `?utm_source=perplexity&utm_medium=ai_search&utm_campaign=ai_visibility&utm_content=source_backed_assets` |
| Top | `https://seekersai.com/product/readme-marketing-cards` | `?utm_source=google&utm_medium=organic&utm_campaign=readme_assets&utm_content=product_page` |
| Top | `https://seekersai.com/use-cases/open-source-launch` | `?utm_source=github&utm_medium=referral&utm_campaign=open_source_launch&utm_content=repo_footer` |
| Top | `https://seekersai.com/use-cases/devrel-launch-workflow` | `?utm_source=linkedin&utm_medium=organic_social&utm_campaign=devrel_workflow&utm_content=founder_post` |
| Top | `https://seekersai.com/resources/open-source-launch-checklist` | `?utm_source=x&utm_medium=organic_social&utm_campaign=launch_checklist&utm_content=thread_cta` |
| Top | `https://seekersai.com/resources/github-project-marketing-card-guide` | `?utm_source=github&utm_medium=referral&utm_campaign=repo_to_card_demo&utm_content=readme_badge` |
| Top | `https://seekersai.com/resources/readme-cover-prompt-guide` | `?utm_source=reddit&utm_medium=community&utm_campaign=readme_cover_prompt&utm_content=comment_link` |
| Middle | `https://seekersai.com/tools/github-repo-launch-readiness-score` | `?utm_source=product_hunt&utm_medium=directory&utm_campaign=free_tool_launch&utm_content=listing_cta` |
| Middle | `https://seekersai.com/templates/github-launch-announcement` | `?utm_source=newsletter&utm_medium=email&utm_campaign=launch_templates&utm_content=template_link` |
| Middle | `https://seekersai.com/examples/qwenlm-flashqla-launch-card` | `?utm_source=github&utm_medium=referral&utm_campaign=example_showcase&utm_content=source_repo_link` |
| Middle | `https://seekersai.com/examples/deepseek-twvp-launch-card` | `?utm_source=linkedin&utm_medium=organic_social&utm_campaign=example_showcase&utm_content=visual_demo` |
| Bottom | `https://seekersai.com/compare/chatgpt-open-source-launch-copy` | `?utm_source=google&utm_medium=organic&utm_campaign=alternative_pages&utm_content=chatgpt_compare` |
| Bottom | `https://seekersai.com/compare/canva-readme-banner-generator` | `?utm_source=google&utm_medium=organic&utm_campaign=alternative_pages&utm_content=canva_compare` |
| Bottom | `https://seekersai.com/contact?intent=demo` | `?utm_source=linkedin&utm_medium=organic_social&utm_campaign=founder_led_sales&utm_content=demo_cta` |
| Bottom | `https://seekersai.com/contact?intent=partnership` | `?utm_source=partner&utm_medium=referral&utm_campaign=devrel_partnerships&utm_content=partner_intro` |

### Batch Generation Rules

- Always generate clean canonical URLs first.
- Add UTM parameters only on distributed links, not canonical links.
- Use lowercase snake case or hyphenated values consistently.
- Do not use vague `utm_campaign=launch` or `utm_content=cta1`.
- Include a CRM campaign name that maps one-to-one to reporting.
- Every generated URL must map to one buyer stage and one primary CTA.
- Every public URL must have a canonical tag and sitemap inclusion only after the page exists.

## CRM Automation

### Lifecycle Stages

| Stage | Entry criteria | Exit criteria | Owner |
| --- | --- | --- | --- |
| Visitor | Anonymous session with campaign/page data | Provides email or signs up | Marketing |
| Subscriber | Email captured for a resource or update | Fit data or product engagement appears | Marketing |
| Lead | Identified contact with first-touch and last-touch campaign context | Fit or engagement score passes threshold | Marketing |
| Product-qualified lead | Completed successful generation and inspected/downloaded output | Meets MQL threshold or requests contact | Product/marketing |
| MQL | Fit score plus engagement score meets threshold | Sales accepts or rejects within SLA | Marketing |
| SQL | Sales/founder confirms relevant need | Opportunity created or recycled | Sales/founder |
| Opportunity | CRM deal exists with estimated value | Closed-won, closed-lost, or paused | Sales/founder |
| Customer or pilot | Manual paid or pilot agreement exists | Renewal, expansion, case study, or churn | Founder/CS |

### Lead Scoring

Fit score:

| Signal | Points |
| --- | ---: |
| Work email or verified company domain | 15 |
| Role contains founder, devrel, product marketing, maintainer, PM, design lead | 15 |
| Company or project is devtool, AI, open-source, SaaS, or research engineering | 15 |
| Public GitHub repo has meaningful README/topics/stars | 10 |
| Personal email with public GitHub project evidence | 5 |

Engagement score:

| Signal | Points |
| --- | ---: |
| `generation_completed` | 25 |
| `generated_image_downloaded` | 20 |
| `signup_completed` | 20 |
| `lead_magnet_requested` | 10 |
| Visits comparison or pricing/contact page | 15 |
| Returns from same campaign within 14 days | 10 |
| Publishes or starts showcase flow | 25 |
| Requests demo/contact | 40 |

Thresholds:

- PQL: successful generation plus preview or download.
- MQL: fit score >= 25 and engagement score >= 35.
- SQL: human accepted MQL with confirmed relevant use case.

### Automation Workflows

| Workflow | Trigger | Action | SLA |
| --- | --- | --- | --- |
| Lead capture | Resource form, signup, contact form | Upsert CRM lead with first/last touch campaign | Immediate |
| PQL creation | `generation_completed` plus preview/download | Add product-qualified tag and activity summary | Immediate |
| MQL routing | Score crosses threshold | Assign owner, create follow-up task, send Slack/email alert | 4 business hours |
| Demo request | `demo_requested` | Create high-priority task and calendar link follow-up | 1 business hour |
| Nurture entry | Subscriber or low-score lead | Send relevant resource sequence based on intent cluster | Same day |
| Re-engagement | Dormant lead returns to comparison/contact page | Alert owner with last activity and source | Same day |
| Recycle | MQL rejected | Set reason code and enroll in lower-frequency nurture | 48 hours |
| Opportunity created | Human creates deal | Copy source attribution, estimated value, campaign, and owner | Immediate |

### CRM Data Contract

Minimum lead fields:

| Field | Description |
| --- | --- |
| `lead_id` | Internal stable ID |
| `email_hash` | Hash for dedupe; avoid exposing raw email in analytics |
| `email` | CRM-only field, never sent to GA4 |
| `name` | CRM-only field |
| `company_domain` | Derived from email or user input |
| `role_segment` | Founder, maintainer, devrel, product marketing, design lead, other |
| `first_touch_source` | First captured UTM source |
| `first_touch_medium` | First captured UTM medium |
| `first_touch_campaign` | First captured UTM campaign |
| `last_touch_source` | Most recent UTM source |
| `last_touch_medium` | Most recent UTM medium |
| `last_touch_campaign` | Most recent UTM campaign |
| `source_page` | First meaningful page path |
| `latest_intent_cluster` | SEO/campaign intent cluster |
| `fit_score` | Explicit fit score |
| `engagement_score` | Behavioral score |
| `lifecycle_stage` | Current lifecycle stage |
| `owner` | Assigned sales/founder owner |
| `crm_sync_status` | Pending, synced, failed |

Minimum opportunity fields:

| Field | Description |
| --- | --- |
| `opportunity_id` | CRM deal ID |
| `lead_id` | Related lead |
| `stage` | Opportunity stage |
| `estimated_value` | Manual estimate until payments exist |
| `currency` | ISO currency code |
| `source_campaign` | Attribution campaign |
| `source_page` | Page that created qualified action |
| `close_date` | Expected or actual close date |
| `loss_reason` | Required for closed-lost |

## Reporting and ROI

### Dashboard Views

| View | Questions |
| --- | --- |
| Acquisition | Which SEO pages, examples, directories, and social links create qualified traffic? |
| Activation | Which campaigns create successful generations, previews, downloads, and signups? |
| Lead quality | Which sources create PQLs, MQLs, SQLs, and opportunities? |
| ROI | Which campaigns create pipeline value or manual closed-won value relative to cost? |
| SEO readiness | Which page families are indexed, receiving impressions, and converting? |

### ROI Formulas

Use the clearest available denominator:

```text
cost_per_generation_started = campaign_cost / generation_started
cost_per_generation_completed = campaign_cost / generation_completed
cost_per_signup = campaign_cost / signup_completed
cost_per_mql = campaign_cost / mql_count
pipeline_roi = (pipeline_value - campaign_cost) / campaign_cost
booked_roi = (manual_closed_won_value - campaign_cost) / campaign_cost
```

When using `pipeline_value`, label it as pipeline ROI, not revenue ROI.

## Code Style

Use object-action event names and typed property builders. Keep PII out of browser analytics.

```ts
trackEvent("cta_clicked", {
  cta_id: "resource_checklist_download",
  cta_location: "resources_hero",
  page_type: "resource",
  page_intent: "awareness",
});
```

## Testing Strategy

- Unit-test event enrichment, UTM persistence, first/last-touch helper behavior, and PII stripping in `src/lib/analytics.test.ts`.
- Component-test top, middle, and bottom funnel interactions in relevant React tests.
- Add file-level SEO tests for sitemap, canonical links, metadata, and route inventory.
- Add CRM adapter contract tests with mock adapters before using any external CRM.
- Use manual GA4 DebugView and CRM sandbox checks for production verification.

## Boundaries

- Always: keep public claims tied to `.agents/product-marketing.md`.
- Always: preserve clean canonical URLs and attach UTM only to distributed links.
- Always: separate browser analytics from CRM PII storage.
- Always: label pipeline ROI separately from booked revenue ROI.
- Ask first: choose or add a CRM, email automation platform, enrichment provider, paid analytics SDK, cookie-consent vendor, or new database table.
- Ask first: publish third-party repository showcases.
- Never: send email, raw auth data, raw README text, private repository content, API keys, or backend error text to GA4.
- Never: claim paid revenue, customer count, or rankings until directly verified.

## Success Criteria

The full-funnel system is ready for SEO execution when:

- Top-funnel semantic pages have a route inventory, metadata plan, sitemap plan, and tracking contract.
- Every generated campaign link maps to one canonical URL, buyer stage, UTM tuple, and CRM campaign.
- GA4 key events and custom dimensions are configured for acquisition, activation, and lead conversion.
- Leads can be captured or exported with first-touch and last-touch attribution.
- A CRM lifecycle stage and lead score can be calculated without payment data.
- MQL routing and nurture automation have documented triggers, owners, and SLAs.
- ROI reports can distinguish product activation, MQLs, pipeline value, and manual closed-won value.
- No SEO page or automation violates the product marketing context or privacy boundaries.

## Open Questions

1. Which CRM should be canonical for the first implementation: HubSpot, Pipedrive, Airtable, Notion, or a custom database plus webhook?
2. Which email/nurture tool should send lead magnets and sequences?
3. Should lead capture require account signup, or should resource forms capture email before account creation?
4. What default estimated opportunity values should be used before pricing exists?
5. Which public examples are approved for showcase pages?
6. Who owns MQL follow-up, and what is the real business-hours SLA?
