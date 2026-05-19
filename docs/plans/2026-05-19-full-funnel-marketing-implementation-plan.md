# Implementation Plan: QuickFork Full-Funnel Marketing System

*Date: 2026-05-19*

## Overview

This plan turns `docs/specs/2026-05-19-full-funnel-marketing-system.md` into an implementation sequence. The implementation should stay payment-free for now and focus on public discovery, semantic bulk links, product activation, lead capture, CRM automation, and pipeline ROI.

## Architecture Decisions

- Use adapter-first CRM automation. Do not hard-code HubSpot, Pipedrive, Airtable, or Notion until the CRM is selected.
- Use clean canonical URLs for SEO pages and attach UTM parameters only on distributed links.
- Extend the existing `trackEvent` foundation rather than adding a second analytics SDK.
- Keep browser analytics PII-free; CRM records may store email/contact data server-side only.
- Treat ROI as pipeline and manual closed-won reporting until payment support exists.
- Keep route/content inventory data-driven so SEO pages, sitemap entries, `llms.txt`, and campaign links can share the same source.

## Phase 0: Preconditions

These decisions unblock implementation:

- [ ] Select CRM target: HubSpot, Pipedrive, Airtable, Notion, or custom database plus webhook.
- [ ] Select email/nurture target: Resend-only, HubSpot Marketing, ConvertKit, Customer.io, or webhook.
- [ ] Decide whether resource lead capture is account-gated or lightweight email capture.
- [ ] Approve first showcase repos and examples for public SEO pages.
- [ ] Define manual estimated opportunity values before pricing exists.
- [ ] Confirm GA4 key events and custom dimensions can be edited in the GA4 property.
- [ ] Confirm Search Console and Bing Webmaster Tools access for `https://seekersai.com`.

## Phase 1: Tracking Contract Expansion

### Task 1: Extend event contract for top, middle, and bottom funnel

**Description:** Add typed event names and property helpers for CTA clicks, resource views, example views, lead magnet requests, demo requests, and CRM-safe attribution.

**Acceptance criteria:**
- [ ] Existing events remain compatible.
- [ ] New event names follow object-action naming.
- [ ] UTM enrichment still applies to every event.
- [ ] PII guardrails are covered in tests.

**Verification:**
- [ ] `npm test -- src/lib/analytics.test.ts`

**Dependencies:** None

**Files likely touched:**
- `src/lib/analytics.ts`
- `src/lib/analytics.test.ts`

**Estimated scope:** Small

### Task 2: Add page intent metadata to route-level page views

**Description:** Add a small route metadata map so `page_view` includes `page_type`, `page_intent`, `buyer_stage`, and `intent_cluster` when known.

**Acceptance criteria:**
- [ ] Homepage, auth routes, and future SEO route patterns have safe fallback metadata.
- [ ] No raw query strings are sent.
- [ ] Tests prove page metadata is included where available.

**Verification:**
- [ ] `npm test -- src/App.test.tsx src/lib/analytics.test.ts`

**Dependencies:** Task 1

**Files likely touched:**
- `src/App.tsx`
- `src/lib/analytics.ts`
- `src/lib/analytics.test.ts`
- `src/App.test.tsx`

**Estimated scope:** Medium

### Checkpoint: Measurement Foundation

- [ ] Existing analytics tests pass.
- [ ] GA4 event names and property names are documented.
- [ ] No browser event includes PII or raw query strings.

## Phase 2: Semantic Link Inventory

### Task 3: Create human-editable semantic link inventory

**Description:** Add the first batch of canonical SEO URLs, campaign URLs, UTM values, buyer stages, page types, and CRM campaign names.

**Acceptance criteria:**
- [ ] Every row has canonical URL, distributed URL, buyer stage, page type, primary CTA, UTM tuple, and CRM campaign.
- [ ] Canonical URLs have no UTM parameters.
- [ ] Distributed URLs have stable, lowercase UTM values.
- [ ] Rows are marked `draft`, `ready`, or `published`.

**Verification:**
- [ ] Add a file-level test or script that validates required columns and URL rules.

**Dependencies:** None

**Files likely touched:**
- `docs/marketing/data/semantic-link-inventory.csv`
- `src/seo/public-growth.test.ts` or a new `src/seo/semantic-links.test.ts`

**Estimated scope:** Small

### Task 4: Add typed link catalog for app and sitemap use

**Description:** Convert the approved inventory into a typed catalog that can power page generation, sitemap entries, and internal navigation.

**Acceptance criteria:**
- [ ] Draft links are excluded from sitemap output.
- [ ] Published links have unique canonical URLs and slugs.
- [ ] Catalog validates buyer stage, page type, intent cluster, and CTA values.

**Verification:**
- [ ] `npm test -- src/seo/semantic-links.test.ts`
- [ ] `npm run build`

**Dependencies:** Task 3

**Files likely touched:**
- `src/marketing/link-catalog.ts`
- `src/seo/semantic-links.test.ts`
- `src/seo/public-growth.test.ts`

**Estimated scope:** Medium

### Checkpoint: Link Governance

- [ ] Link inventory can produce clean canonical and UTM-tagged distribution URLs.
- [ ] No sitemap includes missing or draft pages.
- [ ] CRM campaign names map one-to-one with UTM campaigns.

## Phase 3: SEO Page Foundation

### Task 5: Implement crawlable SEO route shell

**Description:** Add route rendering for product, use-case, resource, compare, example, tool, and template page families using data-driven content.

**Acceptance criteria:**
- [ ] Each page family has unique title, description, canonical URL, H1, page type, and CTA.
- [ ] Pages avoid fabricated pricing, customer count, or ranking claims.
- [ ] Internal links connect pages to homepage, generator, related pages, and examples.

**Verification:**
- [ ] `npm test`
- [ ] `npm run build`
- [ ] Browser check for representative routes.

**Dependencies:** Task 4

**Files likely touched:**
- `src/App.tsx`
- `src/components/marketing/MarketingPage.tsx`
- `src/marketing/link-catalog.ts`
- `src/styles/app.css`
- `src/seo/public-growth.test.ts`

**Estimated scope:** Medium

### Task 6: Generate SEO assets from route inventory

**Description:** Make sitemap, `llms.txt`, and page metadata consume the approved page inventory.

**Acceptance criteria:**
- [ ] Sitemap contains only published canonical pages.
- [ ] `llms.txt` references approved product, resource, compare, and example URLs.
- [ ] Metadata reflects page intent and product-marketing claim boundaries.

**Verification:**
- [ ] `npm test -- src/seo/public-growth.test.ts src/seo/semantic-links.test.ts`
- [ ] `npm run build`

**Dependencies:** Task 5

**Files likely touched:**
- `public/sitemap.xml`
- `public/llms.txt`
- `src/seo/public-growth.test.ts`
- `src/marketing/link-catalog.ts`

**Estimated scope:** Medium

### Checkpoint: SEO Readiness

- [ ] Representative routes render with unique metadata.
- [ ] Sitemap and `llms.txt` reflect the same approved route inventory.
- [ ] Search Console submission list is ready.

## Phase 4: Lead Capture and CRM Adapter

### Task 7: Define CRM adapter interface and mock adapter

**Description:** Add a server-side CRM interface for lead upsert, activity creation, lifecycle updates, and opportunity creation.

**Acceptance criteria:**
- [ ] Interface is platform-neutral.
- [ ] Mock adapter is covered by tests.
- [ ] Browser analytics remains separate from CRM PII storage.

**Verification:**
- [ ] `npm test -- src/server/crm`
- [ ] `npm run build`

**Dependencies:** Phase 0 CRM decision can remain unresolved if mock adapter is used first.

**Files likely touched:**
- `src/server/crm/types.ts`
- `src/server/crm/mock-adapter.ts`
- `src/server/crm/crm.test.ts`

**Estimated scope:** Small

### Task 8: Add lead capture API for resource and contact forms

**Description:** Add server endpoints that receive resource/contact form submissions, capture first/last-touch attribution, and call the CRM adapter.

**Acceptance criteria:**
- [ ] Email/contact fields are accepted only server-side.
- [ ] Request validation rejects missing or malformed inputs.
- [ ] Attribution fields are copied from request payload or server session context.
- [ ] CRM sync failures return safe errors and do not expose secrets.

**Verification:**
- [ ] `npm test -- src/server/marketing`
- [ ] `npm run build`

**Dependencies:** Task 7

**Files likely touched:**
- `src/server/marketing/lead-capture.ts`
- `src/server/marketing/lead-capture.test.ts`
- `src/server/crm/types.ts`
- `src/server/auth-node-handler.ts` or Vercel route wiring file

**Estimated scope:** Medium

### Task 9: Add lightweight resource/contact forms

**Description:** Add frontend forms for resource requests, demo/contact requests, and partnership requests.

**Acceptance criteria:**
- [ ] Forms emit `lead_magnet_requested`, `demo_requested`, or `sales_contact_requested`.
- [ ] Forms submit to the lead capture API.
- [ ] Success states explain the next action without overclaiming.
- [ ] Error states do not leak backend details.

**Verification:**
- [ ] `npm test -- src/App.test.tsx src/lib/analytics.test.ts`
- [ ] Browser check for one resource page and one contact intent.

**Dependencies:** Task 8

**Files likely touched:**
- `src/components/marketing/LeadCaptureForm.tsx`
- `src/components/marketing/ContactIntentForm.tsx`
- `src/App.test.tsx`
- `src/styles/app.css`

**Estimated scope:** Medium

### Checkpoint: CRM Capture

- [ ] Lead capture works with mock CRM adapter.
- [ ] PII is server-side only.
- [ ] First-touch and last-touch fields are represented in CRM payloads.

## Phase 5: Lead Scoring and Automation

### Task 10: Implement lead scoring rules

**Description:** Add a deterministic lead scoring module based on fit and engagement signals.

**Acceptance criteria:**
- [ ] Scoring rules match the spec.
- [ ] PQL and MQL thresholds are test-covered.
- [ ] Scores include reason codes for review.

**Verification:**
- [ ] `npm test -- src/marketing/lead-scoring.test.ts`

**Dependencies:** Task 8

**Files likely touched:**
- `src/marketing/lead-scoring.ts`
- `src/marketing/lead-scoring.test.ts`

**Estimated scope:** Small

### Task 11: Add automation trigger mapping

**Description:** Map lead capture, PQL, MQL, demo request, nurture entry, re-engagement, and recycle workflows into CRM adapter calls.

**Acceptance criteria:**
- [ ] Each automation has a trigger, action, owner, and SLA.
- [ ] Mock adapter tests prove task/activity payloads.
- [ ] Automation can be disabled by config for local tests.

**Verification:**
- [ ] `npm test -- src/server/crm src/server/marketing`
- [ ] `npm run build`

**Dependencies:** Task 10

**Files likely touched:**
- `src/server/marketing/automation.ts`
- `src/server/marketing/automation.test.ts`
- `src/server/crm/types.ts`

**Estimated scope:** Medium

### Checkpoint: Automation

- [ ] Lead lifecycle can progress through subscriber, lead, PQL, MQL, and SQL-ready states.
- [ ] CRM task and activity creation are test-covered.
- [ ] Human owner and SLA fields are present.

## Phase 6: ROI Reporting

### Task 12: Add campaign performance data contract

**Description:** Define an internal reporting shape that combines GA4 counts, CRM stages, campaign costs, pipeline value, and manual closed-won value.

**Acceptance criteria:**
- [ ] Report distinguishes activation, MQL, SQL, opportunity, pipeline value, and closed-won value.
- [ ] Pipeline ROI and booked ROI are separate fields.
- [ ] Missing campaign cost or opportunity value is handled explicitly.

**Verification:**
- [ ] `npm test -- src/marketing/roi-report.test.ts`

**Dependencies:** Task 11

**Files likely touched:**
- `src/marketing/roi-report.ts`
- `src/marketing/roi-report.test.ts`

**Estimated scope:** Small

### Task 13: Add dashboard/export specification

**Description:** Document and optionally implement a CSV/JSON export that a Looker Studio, Sheets, or CRM dashboard can consume.

**Acceptance criteria:**
- [ ] Export includes campaign, source, medium, cost, activations, leads, MQLs, SQLs, pipeline, and closed-won value.
- [ ] Report labels estimated and actual values separately.
- [ ] Documentation includes manual update cadence.

**Verification:**
- [ ] `npm test -- src/marketing/roi-report.test.ts`
- [ ] Review generated sample output.

**Dependencies:** Task 12

**Files likely touched:**
- `src/marketing/roi-report.ts`
- `docs/marketing/research/2026-05-19-full-funnel-dashboard-spec.md`

**Estimated scope:** Small

### Checkpoint: ROI Readiness

- [ ] Campaigns can be compared by qualified usage, lead quality, pipeline, and manual revenue.
- [ ] Reports avoid presenting pipeline estimates as booked revenue.

## Phase 7: Production SEO and Ops Validation

### Task 14: Configure GA4 and external search tools

**Description:** Complete the manual configuration work needed outside the repo.

**Acceptance criteria:**
- [ ] GA4 key events are marked.
- [ ] GA4 custom dimensions are registered.
- [ ] Search Console and Bing properties are verified.
- [ ] Sitemap is submitted after route launch.

**Verification:**
- [ ] GA4 Realtime or DebugView shows representative events with UTM fields.
- [ ] Search Console sitemap submission succeeds.

**Dependencies:** Tasks 1-6

**Files likely touched:** None, unless documenting evidence.

**Estimated scope:** Manual

### Task 15: Launch first SEO batch and CRM smoke test

**Description:** Publish the first approved page/link batch, distribute UTM links, and verify lead capture through the CRM mock or selected CRM sandbox.

**Acceptance criteria:**
- [ ] First page batch is accessible on production.
- [ ] Distributed links preserve UTM attribution in events.
- [ ] At least one resource lead and one demo/contact lead reach CRM.
- [ ] No PII appears in GA4 payloads.

**Verification:**
- [ ] Browser production walkthrough.
- [ ] GA4 DebugView.
- [ ] CRM sandbox or webhook log check.
- [ ] `npm test`
- [ ] `npm run build`

**Dependencies:** Tasks 1-14

**Files likely touched:** Determined by implementation branch.

**Estimated scope:** Medium

## Risks and Mitigations

| Risk | Impact | Mitigation |
| --- | --- | --- |
| CRM not selected | Blocks real automation | Start with mock adapter and exportable webhook contract |
| SEO pages become thin | Search quality risk | Require unique intent, examples, FAQs, internal links, and no sitemap until page is real |
| UTM taxonomy drifts | Reporting becomes unreliable | Validate link inventory and CRM campaign naming in tests |
| PII leaks to analytics | Compliance and trust risk | Keep email/contact fields server-side; test analytics payloads |
| Pipeline ROI overstated | Misleading business reporting | Label pipeline value separately from booked revenue |
| Public showcases violate trust | Brand risk | Require opt-in or approved showcase allowlist |

## Open Questions

- Which CRM should be implemented first?
- Which email/nurture tool should own automated sequences?
- Which resource forms should be account-gated?
- Which example repos are approved for public showcase pages?
- What default opportunity values should be used before pricing exists?
- Who owns the MQL response SLA?

## Approval Gate

Do not begin implementation until the spec and this plan are reviewed. After approval, start with Phase 0 decisions, then Tasks 1-3. Those tasks create the measurement and link governance foundation required before SEO page expansion.
