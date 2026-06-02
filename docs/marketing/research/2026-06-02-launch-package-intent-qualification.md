# Launch Package Intent Qualification

Date: 2026-06-02

## Growth Contract

Hypothesis:

- If a full launch package request asks for repo URL, launch timeline, package scope, and review needs, QuickFork can distinguish qualified paid-intent requests from generic contact submissions before publishing exact pricing.

Lifecycle stage:

- Monetization learning, P4/P5.

Target user:

- Founders, open-source maintainers, DevRel operators, and design/product leads requesting a full package after reviewing a free brief, demand map, readiness score, visual explainer, or pilot page.

Primary CTA:

- `request_launch_package`.

Primary metric:

- `sales_contact_requested` where `contact_reason=full_launch_package` and `request_type=full_launch_package`.

Guardrail:

- Browser analytics must not include email, name, raw repo URL, raw notes, tokens, secrets, price claims, revenue claims, or guaranteed launch outcomes.

Evidence gap:

- Real request quality, launch urgency, scope distribution, and willingness-to-pay interview outcomes are still missing.

## Changed Surface

- `/contact?intent=launch-package` now asks for:
  - GitHub repository URL.
  - Launch timeline.
  - Package scope across README, social, deck, outreach, and visual explainer.
  - Human review need.
  - Launch notes.
- Browser analytics only receives summary properties: launch timeline, package scope count, and human review flag.
- Server-side lead capture normalizes repo URL into `repoHost` and `repoFullName`, then stores qualification metadata in the CRM activity.

## RevOps Rationale

The previous contact form could tell QuickFork that someone requested a full launch package, but it could not distinguish a vague contact request from a qualified pilot candidate. The new fields create a lightweight handoff record without asking for price or budget:

- Repo fit.
- Launch urgency.
- Required surfaces.
- Review need.
- Context for founder-led follow-up.

This supports lead qualification without claiming that willingness to pay is already proven.

## Implementation Evidence

- Baseline `npm test`: 21 files passed, 134 tests passed.
- RED frontend test failed first because `/contact?intent=launch-package` did not include `GitHub repository URL`.
- RED server test failed first because `qualification` was not present in CRM activity properties.
- `npm test -- src/App.test.tsx -t "full launch package contact"`: 1 file passed, 1 selected test passed.
- `npm test -- src/server/marketing/lead-capture.test.ts -t "qualification"`: 1 file passed, 1 selected test passed.
- Build verification caught a TypeScript narrowing issue for `packageScope`; the array filter was changed to an explicit string type guard.
- `git diff --check`: no whitespace errors.
- `npm test`: 21 files passed, 135 tests passed.
- `npm run build`: TypeScript and Vite production build completed.

## Next Validation

- After production deploy, submit or observe a launch-package contact request and review whether the repo, timeline, scope, and review fields are sufficient for founder-led qualification.
- Use qualified requests and interviews before publishing exact pricing or treating the package as validated demand.
