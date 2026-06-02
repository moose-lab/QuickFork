import { describe, expect, it } from "vitest";

import { getDemandSignalsByLifecycleStage, launchDemandSignals } from "./launch-demand-map";

describe("launch demand map", () => {
  it("maps public launch-prep evidence to QuickFork paid-package signals", () => {
    expect(launchDemandSignals.length).toBeGreaterThanOrEqual(4);
    expect(launchDemandSignals.map((signal) => signal.id)).toContain("product_hunt_launch_assets");
    expect(launchDemandSignals.map((signal) => signal.id)).toContain("github_social_preview");

    for (const signal of launchDemandSignals) {
      expect(signal.sourceUrl).toMatch(/^https:\/\//);
      expect(["low", "medium", "high"]).toContain(signal.confidence);
      expect(signal.quickForkSurface).toMatch(/launch|story|asset|package|preview/i);
      expect(signal.willingnessToPaySignal).toMatch(/export|review|batch|package|human|white_label|deadline/i);
      expect(JSON.stringify(signal)).not.toMatch(
        /guaranteed|validated|revenue|customers|ranking|api_key|token|secret/i,
      );
    }
  });

  it("prioritizes signals that connect launch assets to monetization learning", () => {
    const monetizationSignals = getDemandSignalsByLifecycleStage("monetization");

    expect(monetizationSignals.length).toBeGreaterThanOrEqual(1);
    expect(monetizationSignals[0]).toEqual(
      expect.objectContaining({
        priority: "P4",
        primaryCta: "request_launch_package",
      }),
    );
  });
});
