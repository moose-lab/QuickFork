export type LaunchPackageFitTier = "low" | "medium" | "high";

export type LaunchPackageRecommendedNextStep = "nurture" | "scope_clarification" | "sales_interview";

export interface LaunchPackageFitInput {
  repoHost?: string;
  repoFullName?: string;
  launchTimeline?: string;
  packageModel?: string;
  buyingTrigger?: string;
  packageScope?: string[];
  humanReviewNeeded?: boolean;
  notes?: string;
}

export interface LaunchPackageFitScore {
  score: number;
  tier: LaunchPackageFitTier;
  recommendedNextStep: LaunchPackageRecommendedNextStep;
  reasonCodes: string[];
}

const timelineScores = {
  within_7_days: 20,
  within_30_days: 16,
  this_quarter: 10,
  exploring: 4,
} as const;

const modelScores = {
  team_or_agency: 20,
  recurring_launches: 18,
  single_launch: 12,
  human_review_addon: 10,
} as const;

const triggerScores = {
  launch_deadline: 18,
  repeat_launch_workflow: 18,
  product_hunt_prep: 16,
  investor_or_demo_day: 15,
  client_handoff: 14,
} as const;

export function scoreLaunchPackageFit(input: LaunchPackageFitInput): LaunchPackageFitScore {
  const reasonCodes: string[] = [];
  let score = 0;

  if (input.repoFullName && input.repoHost === "github.com") {
    score += 15;
    reasonCodes.push("repo:github");
  } else if (input.repoFullName || input.repoHost) {
    score += 8;
    reasonCodes.push("repo:provided");
  }

  const timelineScore = getKnownScore(timelineScores, input.launchTimeline);
  if (timelineScore) {
    score += timelineScore;
    reasonCodes.push(`timeline:${input.launchTimeline}`);
  }

  const modelScore = getKnownScore(modelScores, input.packageModel);
  if (modelScore) {
    score += modelScore;
    reasonCodes.push(`model:${input.packageModel}`);
  }

  const triggerScore = getKnownScore(triggerScores, input.buyingTrigger);
  if (triggerScore) {
    score += triggerScore;
    reasonCodes.push(`trigger:${input.buyingTrigger}`);
  }

  const scopeCount = input.packageScope?.length ?? 0;
  if (scopeCount >= 5) {
    score += 20;
    reasonCodes.push("scope:full_package");
  } else if (scopeCount >= 3) {
    score += 14;
    reasonCodes.push("scope:multi_channel");
  } else if (scopeCount >= 1) {
    score += 8;
    reasonCodes.push("scope:narrow");
  }

  if (input.humanReviewNeeded) {
    score += 10;
    reasonCodes.push("review:human_needed");
  }

  const normalizedScore = Math.min(100, score);
  const tier = getTier(normalizedScore);

  return {
    score: normalizedScore,
    tier,
    recommendedNextStep: getRecommendedNextStep(tier),
    reasonCodes,
  };
}

function getKnownScore<T extends Record<string, number>>(scores: T, key: string | undefined) {
  if (!key) return 0;
  return scores[key as keyof T] ?? 0;
}

function getTier(score: number): LaunchPackageFitTier {
  if (score >= 75) return "high";
  if (score >= 45) return "medium";
  return "low";
}

function getRecommendedNextStep(tier: LaunchPackageFitTier): LaunchPackageRecommendedNextStep {
  switch (tier) {
    case "high":
      return "sales_interview";
    case "medium":
      return "scope_clarification";
    case "low":
      return "nurture";
  }
}
