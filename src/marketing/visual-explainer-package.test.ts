import { describe, expect, it } from "vitest";

import { visualExplainerPackage } from "./visual-explainer-package";

describe("visualExplainerPackage", () => {
  it("defines the expected source-backed visual outputs", () => {
    expect(visualExplainerPackage.outputs.map((output) => output.id)).toEqual([
      "story_map",
      "readme_hero_card",
      "github_social_preview",
      "deck_ready_slide",
    ]);

    for (const output of visualExplainerPackage.outputs) {
      expect(output.title).toMatch(/\S/);
      expect(output.sourceLabel).toMatch(/\S/);
      expect(output.sourceUrl).toMatch(/^https:\/\//);
      expect(output.projectQuestion).toMatch(/\S/);
      expect(output.quickForkSurface).toMatch(/\S/);
      expect(output.lifecycleStage).toMatch(/\S/);
      expect(output.activationMetric).toMatch(/^[a-z0-9_]+$/);
    }
  });

  it("anchors the visual package to public source notes", () => {
    const sourceUrls = visualExplainerPackage.outputs.map((output) => output.sourceUrl);

    expect(sourceUrls).toContain(
      "https://docs.github.com/repositories/managing-your-repositorys-settings-and-features/customizing-your-repository/about-readmes",
    );
    expect(sourceUrls).toContain(
      "https://docs.github.com/en/repositories/managing-your-repositorys-settings-and-features/customizing-your-repository/customizing-your-repositorys-social-media-preview?apiVersion=2022-11-28",
    );
    expect(sourceUrls).toContain("https://opensource.guide/finding-users/");
    expect(sourceUrls).toContain("https://www.producthunt.com/launch/preparing-for-launch");
  });

  it("keeps visual explainer claims inside the planning boundary", () => {
    const serialized = JSON.stringify(visualExplainerPackage).toLowerCase();

    expect(serialized).not.toMatch(/ranking|revenue|customers|guaranteed|viral|fully autonomous/);
    expect(visualExplainerPackage.claimBoundary).toMatch(/does not predict/i);
  });
});
