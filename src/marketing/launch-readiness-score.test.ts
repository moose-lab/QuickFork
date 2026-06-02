import { describe, expect, it } from "vitest";

import { getLaunchReadinessTotal, launchReadinessScorecard } from "./launch-readiness-score";

describe("launch readiness scorecard", () => {
  it("defines a 100-point source-backed scorecard for repository launch readiness", () => {
    expect(getLaunchReadinessTotal()).toBe(100);
    expect(launchReadinessScorecard.categories.map((category) => category.id)).toEqual([
      "readme_trust",
      "repository_preview",
      "audience_feedback",
      "launch_assets",
      "measurement_follow_up",
    ]);
    expect(launchReadinessScorecard.categories.map((category) => category.points)).toEqual([25, 15, 20, 25, 15]);
  });

  it("keeps every readiness category tied to sources, outputs, lifecycle stage, and activation metric", () => {
    for (const category of launchReadinessScorecard.categories) {
      expect(category.title).toMatch(/\S/);
      expect(category.sourceUrl).toMatch(/^https:\/\//);
      expect(category.quickForkOutput).toMatch(/\S/);
      expect(category.lifecycleStage).toMatch(/discovery|activation|evaluation/i);
      expect(category.activationMetric).toMatch(/\S/);
      expect(category.signals.length).toBeGreaterThanOrEqual(2);
    }
  });

  it("uses public sources without turning them into proof of growth outcomes", () => {
    const sourceUrls = launchReadinessScorecard.categories.map((category) => category.sourceUrl);

    expect(sourceUrls).toContain(
      "https://docs.github.com/repositories/managing-your-repositorys-settings-and-features/customizing-your-repository/about-readmes",
    );
    expect(sourceUrls).toContain(
      "https://docs.github.com/en/repositories/managing-your-repositorys-settings-and-features/customizing-your-repository/customizing-your-repositorys-social-media-preview?apiVersion=2022-11-28",
    );
    expect(sourceUrls).toContain("https://opensource.guide/finding-users/");
    expect(sourceUrls).toContain("https://www.producthunt.com/launch/preparing-for-launch");
    expect(launchReadinessScorecard.claimBoundary).toMatch(/does not predict/i);
    expect(JSON.stringify(launchReadinessScorecard)).not.toMatch(/ranking|revenue|customers|guaranteed|viral/i);
  });
});
