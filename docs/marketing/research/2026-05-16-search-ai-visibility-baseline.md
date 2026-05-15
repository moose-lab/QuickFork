# QuickFork Search and AI Visibility Baseline

*Generated: 2026-05-16*

## Goal

Measure whether QuickFork can be discovered and accurately described by Google, Bing, and AI search systems for the customer-language keyword groups identified in research.

## Required Setup

- Google Search Console property verified.
- Bing Webmaster Tools property verified.
- Sitemap submitted after crawlable pages exist.
- `robots.txt` references sitemap.
- Priority pages have canonical URLs.
- `llms.txt` exists once public pages are ready.

## Priority Query Groups

| Group | Queries |
| --- | --- |
| Category | `GitHub repo to launch package`, `GitHub project marketing card`, `source-backed launch assets` |
| README/social preview | `GitHub social preview image`, `README cover image`, `README banner size`, `GitHub README social card` |
| Open-source launch | `open source launch checklist`, `launch an open source project`, `Product Hunt launch GitHub project` |
| Trust | `AI invents project claims`, `source-backed AI marketing`, `no hallucination README generator` |
| Alternatives | `Socialify alternative`, `AI README generator alternative`, `Canva README banner alternative` |

## Weekly Search Console Checks

| Check | Data to capture |
| --- | --- |
| Indexed pages | URL, indexed status, crawl date |
| Query impressions | Query, impressions, clicks, CTR, average position |
| Page performance | URL, impressions, clicks, query set |
| Coverage issues | Error type, affected URL |
| Sitemap status | Submitted URLs, discovered URLs |

## Monthly AI Answer Audit

Run each query in:

- ChatGPT with search.
- Perplexity.
- Gemini.
- Google search with AI Overview if available.

Capture:

| Field | Notes |
| --- | --- |
| Query | Exact query string |
| AI surface | ChatGPT / Perplexity / Gemini / Google |
| QuickFork mentioned | Yes / No |
| QuickFork cited | Yes / No |
| Competitors cited | Names and URLs |
| Accuracy | Correct / partially correct / hallucinated |
| Wrong claims | Pricing, customer count, ranking, model/provider, features |
| Source URL | Cited URL if present |

## Acceptance Criteria

The search baseline is useful when:

- At least 5 priority pages are indexed.
- At least 10 non-brand queries have impressions.
- At least 1 AI surface describes QuickFork accurately from public pages.
- Incorrect AI descriptions are logged and mapped to missing/unclear page content.
