import { describe, expect, it } from "vitest";
import {
  ASSET_PRESETS,
  DEFAULT_MODEL_SETTINGS,
  buildLaunchPackage,
  parseGitHubRepoUrl,
  validateModelSettings,
} from "./pipeline";

describe("repo launch pipeline", () => {
  it("parses GitHub repository URLs", () => {
    const repo = parseGitHubRepoUrl("https://github.com/QwenLM/FlashQLA");

    expect(repo.owner).toBe("QwenLM");
    expect(repo.name).toBe("FlashQLA");
    expect(repo.fullName).toBe("QwenLM/FlashQLA");
    expect(repo.ownerAvatarUrl).toBe("https://github.com/QwenLM.png");
  });

  it("rejects non GitHub repository URLs", () => {
    expect(() => parseGitHubRepoUrl("https://example.com/QwenLM/FlashQLA")).toThrow(/github/i);
  });

  it("keeps multilingual assets structurally aligned", () => {
    const pack = buildLaunchPackage({
      repoUrl: "https://github.com/deepseek-ai/Thinking-with-Visual-Primitives",
      projectName: "Thinking with Visual Primitives",
      sourceNotes:
        "Visual primitives become minimal units of thought. Points and bounding boxes anchor reasoning to coordinates. 77.2% benchmark average and ~90 KV-cache entries.",
      modelSettings: DEFAULT_MODEL_SETTINGS,
    });

    const insightCounts = pack.locales.map((locale) => locale.keyInsights.length);
    const stepCounts = pack.locales.map((locale) => locale.workflowSteps.length);
    const promptSlots = pack.locales.map((locale) => [
      locale.coverPrompt.includes("Feature 1:"),
      locale.coverPrompt.includes("Feature 2:"),
      locale.coverPrompt.includes("Feature 3:"),
      locale.coverPrompt.includes("Step 1:"),
      locale.coverPrompt.includes("Step 2:"),
      locale.coverPrompt.includes("Step 3:"),
    ]);

    expect(insightCounts).toEqual([3, 3, 3]);
    expect(stepCounts).toEqual([3, 3, 3]);
    expect(promptSlots.flat().every(Boolean)).toBe(true);
    expect(pack.locales[0].coverPrompt).toContain("official brand logo");
    expect(pack.locales[0].coverPrompt).toContain("https://github.com/deepseek-ai.png");
    expect(pack.locales[0].coverPrompt).toContain("GitHub logo is only for the bottom GitHub strip");
    expect(pack.locales[0].coverPrompt).toContain("Never synthesize random logos");
    expect(pack.locales[0].coverPrompt).not.toContain("use the GitHub logo with owner text");
  });

  it("offers image sizes for README, slides, and social platforms", () => {
    const presetKeys = ASSET_PRESETS.map((preset) => preset.id);

    expect(presetKeys).toContain("github-readme");
    expect(presetKeys).toContain("ppt-wide");
    expect(presetKeys).toContain("x-linkedin-landscape");
    expect(presetKeys).toContain("square-social");
  });

  it("validates model settings before generation", () => {
    expect(validateModelSettings(DEFAULT_MODEL_SETTINGS).ok).toBe(true);
    expect(validateModelSettings({ ...DEFAULT_MODEL_SETTINGS, copyModel: "" }).ok).toBe(false);
  });
});
