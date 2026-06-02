import type { GrowthLifecycleStage } from "./growth-experiments";
import type { MarketingPrimaryCta } from "./link-catalog";

export const demandSignalConfidenceLevels = ["low", "medium", "high"] as const;
export const demandSignalPriorities = ["P1", "P2", "P3", "P4"] as const;

export type DemandSignalConfidence = (typeof demandSignalConfidenceLevels)[number];
export type DemandSignalPriority = (typeof demandSignalPriorities)[number];

export interface LaunchDemandSignal {
  id: string;
  sourceLabel: string;
  sourceUrl: string;
  sourceType: "official_docs" | "official_guide" | "community_thread";
  targetUser: string;
  observedNeed: string;
  quickForkSurface: string;
  lifecycleStage: GrowthLifecycleStage;
  priority: DemandSignalPriority;
  primaryCta: MarketingPrimaryCta;
  primaryMetric: string;
  guardrailMetric: string;
  willingnessToPaySignal: string;
  confidence: DemandSignalConfidence;
  inference: string;
}

export const launchDemandSignals: readonly LaunchDemandSignal[] = [
  {
    id: "product_hunt_launch_assets",
    sourceLabel: "Product Hunt launch guide",
    sourceUrl: "https://www.producthunt.com/launch/preparing-for-launch",
    sourceType: "official_guide",
    targetUser: "indie_founder",
    observedNeed: "Makers preparing a Product Hunt launch need a tagline, description, gallery assets, video decisions, pricing status, and launch-day context.",
    quickForkSurface: "Full launch package with Product Hunt copy, gallery asset prompts, first-comment draft, and launch checklist.",
    lifecycleStage: "monetization",
    priority: "P4",
    primaryCta: "request_launch_package",
    primaryMetric: "sales_contact_requested",
    guardrailMetric: "lead_quality_reviewed_before_public_pricing",
    willingnessToPaySignal: "launch_package_deadline_and_human_review",
    confidence: "medium",
    inference:
      "Product Hunt requirements point to a deadline-driven package where founders may pay for reviewed launch materials instead of assembling assets manually.",
  },
  {
    id: "github_social_preview",
    sourceLabel: "GitHub Docs social preview",
    sourceUrl:
      "https://docs.github.com/en/repositories/managing-your-repositorys-settings-and-features/customizing-your-repository/customizing-your-repositorys-social-media-preview?apiVersion=2022-11-28",
    sourceType: "official_docs",
    targetUser: "open_source_maintainer",
    observedNeed: "Repository links need a useful preview image when shared across social surfaces and launch posts.",
    quickForkSurface: "README and social preview asset pack with source-backed visual direction and GitHub identity constraints.",
    lifecycleStage: "activation",
    priority: "P3",
    primaryCta: "generate_launch_card",
    primaryMetric: "launch_artifact_downloaded",
    guardrailMetric: "unsupported_visual_identity_flags",
    willingnessToPaySignal: "asset_export_request",
    confidence: "medium",
    inference:
      "Maintainers who care about repository preview quality are likely to value exportable, correctly sized visual launch assets.",
  },
  {
    id: "open_source_message_audience",
    sourceLabel: "Open Source Guides finding users",
    sourceUrl: "https://opensource.guide/finding-users/",
    sourceType: "official_guide",
    targetUser: "open_source_maintainer",
    observedNeed: "Open-source projects need clear messaging, audience channels, and feedback loops before promotion scales.",
    quickForkSurface: "Source-backed message map, target-user hypothesis, launch angles, and outreach draft from one repository URL.",
    lifecycleStage: "discovery",
    priority: "P1",
    primaryCta: "generate_launch_card",
    primaryMetric: "generation_completed",
    guardrailMetric: "unsupported_claim_flags",
    willingnessToPaySignal: "repeat_launch_package_review",
    confidence: "medium",
    inference:
      "Audience and messaging work should stay early in the QuickFork workflow so generated assets do not outrun source evidence.",
  },
  {
    id: "community_launch_prep",
    sourceLabel: "Community launch prep threads",
    sourceUrl: "https://www.reddit.com/r/ProductHuntLaunches/",
    sourceType: "community_thread",
    targetUser: "technical_founder",
    observedNeed: "Launch communities repeatedly discuss checklists, screenshots, first comments, maker updates, and concise positioning.",
    quickForkSurface: "Launch readiness checklist with README, social, deck, outreach, and visual story-map exports.",
    lifecycleStage: "validation",
    priority: "P2",
    primaryCta: "request_launch_package",
    primaryMetric: "cta_clicked",
    guardrailMetric: "sales_contact_requested_quality_review",
    willingnessToPaySignal: "deadline_and_package_review",
    confidence: "low",
    inference:
      "Community language is useful for copy and interview prompts, but it needs direct QuickFork interviews before public packaging decisions.",
  },
];

export function getDemandSignalsByLifecycleStage(stage: GrowthLifecycleStage) {
  return launchDemandSignals.filter((signal) => signal.lifecycleStage === stage);
}
