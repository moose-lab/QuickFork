export type LaunchReadinessCategoryId =
  | "readme_trust"
  | "repository_preview"
  | "audience_feedback"
  | "launch_assets"
  | "measurement_follow_up";

export interface LaunchReadinessScoreCategory {
  id: LaunchReadinessCategoryId;
  title: string;
  points: number;
  sourceLabel: string;
  sourceUrl: string;
  lifecycleStage: "Discovery" | "Activation" | "Evaluation";
  activationMetric: string;
  quickForkOutput: string;
  signals: string[];
}

export interface LaunchReadinessScorecard {
  title: string;
  totalLabel: string;
  claimBoundary: string;
  categories: LaunchReadinessScoreCategory[];
}

export const launchReadinessScorecard: LaunchReadinessScorecard = {
  title: "Launch readiness rubric",
  totalLabel: "100 total points",
  claimBoundary:
    "This scorecard is a source-backed planning rubric. It does not predict search performance, sales outcomes, launch results, or willingness to pay.",
  categories: [
    {
      id: "readme_trust",
      title: "README trust",
      points: 25,
      sourceLabel: "GitHub Docs About READMEs",
      sourceUrl:
        "https://docs.github.com/repositories/managing-your-repositorys-settings-and-features/customizing-your-repository/about-readmes",
      lifecycleStage: "Discovery",
      activationMetric: "repo_url_submitted",
      quickForkOutput: "README checklist and source-backed launch brief.",
      signals: ["Clear problem and audience", "Setup or demo path", "Claims tied to repository evidence"],
    },
    {
      id: "repository_preview",
      title: "Repository preview",
      points: 15,
      sourceLabel: "GitHub Docs social preview",
      sourceUrl:
        "https://docs.github.com/en/repositories/managing-your-repositorys-settings-and-features/customizing-your-repository/customizing-your-repositorys-social-media-preview?apiVersion=2022-11-28",
      lifecycleStage: "Discovery",
      activationMetric: "generated_image_preview_opened",
      quickForkOutput: "README hero card and GitHub social preview direction.",
      signals: ["Recognizable project identity", "Shareable repo link preview", "Visual explanation before code inspection"],
    },
    {
      id: "audience_feedback",
      title: "Audience and feedback",
      points: 20,
      sourceLabel: "Open Source Guides finding users",
      sourceUrl: "https://opensource.guide/finding-users/",
      lifecycleStage: "Activation",
      activationMetric: "generation_completed",
      quickForkOutput: "Audience hypothesis, feedback questions, and community launch angle.",
      signals: ["Named target user", "Specific communities or channels", "Feedback loop after first launch"],
    },
    {
      id: "launch_assets",
      title: "Launch assets",
      points: 25,
      sourceLabel: "Product Hunt launch guide",
      sourceUrl: "https://www.producthunt.com/launch/preparing-for-launch",
      lifecycleStage: "Evaluation",
      activationMetric: "launch_artifact_downloaded",
      quickForkOutput: "Product Hunt copy, deck outline, social posts, outreach draft, and visual prompt.",
      signals: ["Channel-specific copy", "Gallery or visual direction", "Launch-day context and first-comment draft"],
    },
    {
      id: "measurement_follow_up",
      title: "Measurement and follow-up",
      points: 15,
      sourceLabel: "QuickFork analytics contract",
      sourceUrl: "https://seekersai.com/resources/github-repo-launch-demand-map",
      lifecycleStage: "Evaluation",
      activationMetric: "lead_magnet_requested",
      quickForkOutput: "Post-launch checklist tied to CTA, artifact export, and follow-up evidence.",
      signals: ["CTA event defined", "Artifact export tracked", "Follow-up questions captured"],
    },
  ],
};

export function getLaunchReadinessTotal() {
  return launchReadinessScorecard.categories.reduce((total, category) => total + category.points, 0);
}
