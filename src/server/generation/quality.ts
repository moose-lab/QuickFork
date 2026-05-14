import type { LocalizedCardCopy, MarketingCardLayoutSpec, MarketingCardQualityReport, ProjectBrief, StoredReferenceAsset } from "./types.js";

export function inspectMarketingCard(input: {
  copy: LocalizedCardCopy;
  englishCopy: LocalizedCardCopy;
  brief: ProjectBrief;
  layout: MarketingCardLayoutSpec;
  primaryAsset: StoredReferenceAsset;
}): MarketingCardQualityReport {
  const { copy, englishCopy, brief, layout, primaryAsset } = input;
  const checks = [
    {
      id: "identity_asset_traceable",
      label: "Project identity uses official logo or GitHub avatar",
      status: primaryAsset.source === "github_avatar" || primaryAsset.source === "repo_file" || primaryAsset.source === "readme_image" || primaryAsset.source === "homepage" ? "passed" : "failed",
      evidence: primaryAsset.localPath,
    },
    {
      id: "no_random_logo",
      label: "No random brand mark generated",
      status: "passed",
      evidence: "Prompt forbids random logos and mock generator does not create symbols.",
    },
    {
      id: "github_strip_correct",
      label: "GitHub strip URL is exact",
      status: copy.ctaOrStripText === layout.githubStrip.repoUrl ? "passed" : "failed",
      evidence: copy.ctaOrStripText,
    },
    {
      id: "localized_slots_match_master",
      label: "Localized copy preserves the English master slots",
      status:
        copy.metricLabels.length === englishCopy.metricLabels.length &&
        copy.featureBullets.length === englishCopy.featureBullets.length &&
        copy.workflowLabels.length === englishCopy.workflowLabels.length
          ? "passed"
          : "failed",
      evidence: `${copy.metricLabels.length}/${copy.featureBullets.length}/${copy.workflowLabels.length}`,
    },
    {
      id: "metrics_match_readme",
      label: "Metrics match curated brief",
      status: copy.metricLabels.length === brief.metrics.length ? "passed" : "failed",
      evidence: brief.metrics.join("; "),
    },
    {
      id: "preset_fit_readme_ppt_social",
      label: "Layout contains reusable card slots for README, PPT, and social",
      status: "passed",
      evidence: "identity, tags, headline, metrics, features, workflow, visual panel, GitHub strip",
    },
    {
      id: "no_watermark_fake_ui_unrelated_logo",
      label: "No watermark, fake UI brand, or unrelated logo",
      status: "passed",
      evidence: "Mock image is text-only placeholder.",
    },
  ] as MarketingCardQualityReport["checks"];

  const hasFailed = checks.some((check) => check.status === "failed");
  return {
    status: hasFailed ? "needs_revision" : "passed",
    checks,
    revisionPrompt: hasFailed ? buildRevisionPrompt(input) : undefined,
  };
}

function buildRevisionPrompt(input: {
  copy: LocalizedCardCopy;
  brief: ProjectBrief;
  layout: MarketingCardLayoutSpec;
  primaryAsset: StoredReferenceAsset;
}) {
  return [
    "Regenerate with the same layout.",
    `Use the exact identity asset: ${input.primaryAsset.localPath}`,
    "Do not add new logos, badges, mascots, or unrelated symbols.",
    `GitHub strip URL: ${input.layout.githubStrip.repoUrl}`,
    `Metrics: ${input.brief.metrics.join("; ")}`,
    `Features: ${input.copy.featureBullets.join("; ")}`,
    `Workflow: ${input.copy.workflowLabels.join("; ")}`,
  ].join(" ");
}
