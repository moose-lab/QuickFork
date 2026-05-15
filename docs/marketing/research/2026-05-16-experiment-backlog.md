# QuickFork Growth Experiment Backlog

*Generated: 2026-05-16*

## Scoring

ICE score = `(Impact + Confidence + Ease) / 3`.

Use this backlog after baseline events are visible in production. Do not call winners before a pre-defined sample or review window.

## Experiments

| ID | Hypothesis | Primary metric | Guardrail | Impact | Confidence | Ease | ICE |
| --- | --- | --- | --- | ---: | ---: | ---: | ---: |
| EXP-001 | Because research shows trust is the wedge, adding "no invented metrics / no random logos" near the generator will increase generation starts. | `generation_started / page_view` | `hero_repo_url_entered / page_view` | 8 | 7 | 8 | 7.7 |
| EXP-002 | Because the category is not mature, "GitHub repo to launch package" will outperform "AI README/social card generator" for qualified activation. | `generation_started / page_view` | Bounce rate | 9 | 6 | 6 | 7.0 |
| EXP-003 | Because generated preview is the peak moment, preview-first result layout will increase preview opens and downloads. | `generated_image_preview_opened / generation_completed` | `generated_image_downloaded / generation_completed` | 8 | 7 | 7 | 7.3 |
| EXP-004 | Because users may prefer private artifacts, asking for public showcase only after preview will outperform asking before generation. | `showcase_publish_clicked / generation_completed` | Download rate | 7 | 5 | 5 | 5.7 |
| EXP-005 | Because developers distrust obvious marketing, restrained proof language will outperform viral/traction language. | `generation_started / page_view` | Negative feedback / bounce | 8 | 8 | 6 | 7.3 |
| EXP-006 | Because social preview design is a practical pain, a utility page for GitHub social preview size will attract qualified visitors. | `generation_started / organic_page_view` | Low intent traffic | 6 | 6 | 7 | 6.3 |

## First Experiment To Run

Start with EXP-001 once tracking is deployed.

Reason:

- Directly tests the biggest research-backed wedge.
- Easy to implement.
- Low risk.
- Does not require many new pages.

## Experiment Template

```markdown
# Experiment: [ID]

## Hypothesis

Because [research/data],
we believe [change]
will cause [outcome]
for [audience].
We'll know this is true when [primary metric].

## Variant

Control:
Variant:

## Metrics

Primary:
Secondary:
Guardrail:

## Sample / duration

Baseline:
Minimum sample:
Review window:

## Result

Winner / loser / inconclusive:
Evidence:
Decision:
Follow-up:
```
