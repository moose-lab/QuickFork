# Repo Product Outreach Page Research

Date: 2026-06-02

## Growth Question

Can QuickFork make "product outreach from one repository URL" a credible launch-package surface for cold-start AI and technical projects?

## Hypothesis

If QuickFork publishes a source-backed GitHub repo product outreach page, founders and DevRel operators preparing a cold-start launch will understand outreach drafts as reviewable launch-package artifacts and will be more likely to generate a free repo brief or request a full package.

## Lifecycle Stage

Activation to Evaluation, with P4 launch-package export learning.

## Target User

- AI project founders preparing launch follow-up.
- Indie technical founders with a working GitHub-backed product.
- Open-source maintainers asking communities for feedback.
- DevRel operators packaging repository launches across README, Product Hunt, social, partners, and newsletters.

## Source Signals

| Source | Signal | Confidence | QuickFork implication |
| --- | --- | --- | --- |
| coreyhaines31/marketingskills | Treat product marketing context, customer research, copywriting, CRO, launch, cold-email, analytics, and pricing as task-specific skills rather than generic advice. | Medium | The page should stay grounded in `.agents/product-marketing.md`, one CTA, clear claim boundaries, and measurable follow-up. |
| Open Source Guides finding users | Open-source growth starts with explaining what the project does, why it matters, who it helps, and where those users already gather. | Medium | Outreach should include audience hypothesis and feedback questions, not only announcement copy. |
| GitHub Docs About READMEs | README is the first repository explanation surface. | High | Outreach should reuse README evidence and source-backed launch brief language instead of inventing a new story. |
| Product Hunt launch preparation | Launch work includes concise product story, assets, maker context, and launch-day discussion. | Medium | The route should include Product Hunt first-comment context as a launch package artifact. |
| FTC CAN-SPAM compliance guide | Commercial email requires truthful identity, truthful subject lines, opt-out handling, and other human compliance checks. | High for email guardrails | QuickFork should frame email as a draft and human review checklist, not a sending system. |
| Hacker News guidelines | HN is for intellectual curiosity and discourages primarily promotional submissions. | Medium | Community outreach should be feedback-oriented and useful without requiring a click. |

Sources:

- https://github.com/coreyhaines31/marketingskills
- https://opensource.guide/finding-users/
- https://docs.github.com/repositories/managing-your-repositorys-settings-and-features/customizing-your-repository/about-readmes
- https://www.producthunt.com/launch/preparing-for-launch
- https://www.ftc.gov/business-guidance/resources/can-spam-act-compliance-guide-business
- https://news.ycombinator.com/newsguidelines.html

## Product Implications

QuickFork should present product outreach as a reviewable package surface:

- Launch email draft.
- Community feedback post.
- Partner or newsletter note.
- Product Hunt first comment.
- Human review checklist.

The product value is not "send more messages." The value is turning one repository URL into accurate, source-backed follow-up drafts that match the launch story already used in README, social, deck, and visual assets.

## Page Contract

- Route: `/product/github-repo-to-product-outreach`
- Intent cluster: `github_repo_product_outreach`
- Primary keyword: `github repo product outreach`
- Primary CTA: `generate_launch_card`
- Primary metric: `cta_clicked` segmented by `page_path=/product/github-repo-to-product-outreach`
- Guardrail metric: unsupported-claim flags and `generation_failed / generation_started`
- CTA target: `/#hero`

## Claim Guardrails

Do not publish claims about:

- Guaranteed replies or launch outcomes.
- Email sending, lead scraping, or automated distribution.
- Search performance, business outcomes, customer acquisition, or Product Hunt results.
- Exact public pricing before pricing research or purchase intent exists.

## Evidence Observed

- RED model test failed first because `src/marketing/product-outreach-package.ts` did not exist.
- RED route test failed first because `/product/github-repo-to-product-outreach` rendered the homepage rather than a marketing route.
- RED public-growth tests failed first because sitemap and `llms.txt` did not include the route.
- Focused tests passed after implementation: `npm test -- src/marketing/product-outreach-package.test.ts src/App.test.tsx src/seo/public-growth.test.ts src/seo/semantic-links.test.ts -t "product outreach|public growth|semantic marketing"` returned 4 files passed, 18 selected tests passed.
- Focused route/SEO verification passed: `npm test -- src/marketing/product-outreach-package.test.ts src/App.test.tsx src/seo/public-growth.test.ts src/seo/semantic-links.test.ts` returned 4 files passed, 38 tests passed.
- Full verification passed: `git diff --check` returned 0, `npm test` returned 22 files passed and 140 tests passed, and `npm run build` completed TypeScript plus Vite production build.
- Local smoke passed: `http://127.0.0.1:5176/product/github-repo-to-product-outreach` returned HTTP 200, local sitemap contained the outreach URL, and local `llms.txt` contained `GitHub Repo Product Outreach` plus the source-backed outreach brief description.
- PR #14 merged into `main` at merge commit `776115722e3b2acb6f70b255ba4a2062914b0164`.
- Main CI/CD run `26818466190` completed successfully: `Test and build` passed and `Deploy production to Vercel` passed.
- Production smoke passed: `https://seekersai.com/product/github-repo-to-product-outreach` returned HTTP 200, production sitemap contains the outreach route, production `llms.txt` contains `GitHub Repo Product Outreach` and the source-backed outreach brief description, and production bundle `/assets/index-Bgr1koiC.js` contains `GitHub Repo Product Outreach`, `github_repo_product_outreach`, and `source-backed outreach package`.

## Evidence Gaps

- No production page-view, CTA, or generator-start data exists yet for this route.
- No interviews yet confirm that users value outreach drafts more than README, deck, social, or visual exports.
- No launch-package request has been attributed to this route yet.
- No pricing or willingness-to-pay evidence exists for an outreach-specific paid tier.

## Next Validation

1. Ship the route to production and verify 200 status, sitemap inclusion, and `llms.txt` inclusion.
2. Track `page_view`, `cta_clicked`, `generation_started`, `generation_completed`, `launch_artifact_copied`, and `launch_artifact_downloaded`.
3. Compare outreach route CTA behavior against `/product/github-repo-to-launch-deck` and `/product/repository-launch-package-pilot`.
4. Interview at least 5 founders, maintainers, or DevRel operators about launch follow-up pain and whether human-reviewed outreach packaging is worth paying for.
