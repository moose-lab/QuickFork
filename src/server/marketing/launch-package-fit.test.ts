import { describe, expect, it } from "vitest";

import { scoreLaunchPackageFit } from "./launch-package-fit";

describe("launch package fit scoring", () => {
  it("scores structured launch package qualification without relying on raw notes or pricing claims", () => {
    expect(
      scoreLaunchPackageFit({
        repoHost: "github.com",
        repoFullName: "moose-lab/QuickFork",
        launchTimeline: "within_30_days",
        packageModel: "single_launch",
        buyingTrigger: "launch_deadline",
        packageScope: ["readme", "social", "deck", "outreach", "visual_explainer"],
        humanReviewNeeded: true,
        notes: "Launching an AI repo and need source-backed README, deck, and outreach review.",
      }),
    ).toEqual({
      score: 91,
      tier: "high",
      recommendedNextStep: "sales_interview",
      reasonCodes: [
        "repo:github",
        "timeline:within_30_days",
        "model:single_launch",
        "trigger:launch_deadline",
        "scope:full_package",
        "review:human_needed",
      ],
    });
  });
});
