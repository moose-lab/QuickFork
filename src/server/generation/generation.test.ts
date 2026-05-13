import { mkdtemp, readFile, rm } from "node:fs/promises";
import { join } from "node:path";
import { tmpdir } from "node:os";

import { describe, expect, it } from "vitest";

import { createMockLlmAdapter, DEFAULT_GENERATION_MODELS } from "./llm";
import { runProjectLaunchGeneration } from "./orchestrator";
import { parseGitHubRepositoryUrl } from "./repo";

const openDesignReadme = `
# Open Design

Open-source Claude Design alternative for local-first agentic design.

Design with the agent already on your laptop.

![Open Design banner](docs/assets/banner.png)

## Metrics

- 16 coding-agent CLIs
- 31 composable Skills
- 72 brand-grade Design Systems
- HTML / PDF / PPTX / MP4 export

## Features

- Local-first design loop wires existing coding agents into artifact generation.
- BYOK at every layer keeps provider choice and deployment control with the user.
- Skills, design systems, sandboxed previews, and exports make design output repeatable.

## Workflow

1. Brief + direction picker
2. Agent builds artifact
3. Preview + export
`;

describe("project launch generation backend", () => {
  it("defines a mock LLM adapter boundary with GPT5.5 as the default model", async () => {
    const repo = parseGitHubRepositoryUrl("https://github.com/nexu-io/open-design");
    const adapter = createMockLlmAdapter({ model: DEFAULT_GENERATION_MODELS.llm });
    const result = await adapter.buildProjectLaunchPlan({
      repo,
      metadata: {
        name: "open-design",
        fullName: "nexu-io/open-design",
        description: "Open-source Claude Design alternative for local-first agentic design",
        homepage: "https://open-design.ai",
        language: "TypeScript",
        topics: ["design", "agents", "local-first"],
        defaultBranch: "main",
        stars: 1200,
        owner: {
          login: "nexu-io",
          avatarUrl: "https://github.com/nexu-io.png",
          htmlUrl: "https://github.com/nexu-io",
          type: "Organization",
        },
        readmeDownloadUrl: "https://raw.githubusercontent.com/nexu-io/open-design/main/README.md",
      },
      readmeMarkdown: openDesignReadme,
      primaryIdentityAsset: {
        type: "avatar",
        url: "https://github.com/nexu-io.png",
        source: "github_avatar",
        confidence: "fallback",
        reason: "test fixture",
        localPath: "output/project-launch/nexu-io-open-design/assets/nexu-io-github-avatar.png",
        fileName: "nexu-io-github-avatar.png",
        mimeType: "image/png",
        sizeBytes: 12,
      },
    });

    expect(result.model).toBe("gpt-5.5");
    expect(result.brief.title).toBe("Open Design");
    expect(result.visualDirection.category).toBe("design_tool");
    expect(result.localizedCopy.en.ctaOrStripText).toBe("github.com/nexu-io/open-design");
  });

  it("normalizes GitHub repository URLs", () => {
    expect(parseGitHubRepositoryUrl("https://github.com/nexu-io/open-design")).toEqual({
      owner: "nexu-io",
      repo: "open-design",
      fullName: "nexu-io/open-design",
      repoUrl: "https://github.com/nexu-io/open-design",
    });
  });

  it("rejects non-GitHub repository URLs", () => {
    expect(() => parseGitHubRepositoryUrl("https://example.com/nexu-io/open-design")).toThrow(/github\.com/i);
  });

  it("runs the mock orchestration and writes the final artifact tree", async () => {
    const outputRoot = await mkdtemp(join(tmpdir(), "quickfork-generation-"));

    try {
      const result = await runProjectLaunchGeneration({
        repoUrl: "https://github.com/nexu-io/open-design",
        locales: ["en", "zh", "ja"],
        provider: "mock",
        outputRoot,
        mock: {
          repoMetadata: {
            name: "open-design",
            fullName: "nexu-io/open-design",
            description: "Open-source Claude Design alternative for local-first agentic design",
            homepage: "https://open-design.ai",
            language: "TypeScript",
            topics: ["design", "agents", "local-first"],
            defaultBranch: "main",
            stars: 1200,
            owner: {
              login: "nexu-io",
              avatarUrl: "https://github.com/nexu-io.png",
              htmlUrl: "https://github.com/nexu-io",
              type: "Organization",
            },
            readmeDownloadUrl: "https://raw.githubusercontent.com/nexu-io/open-design/main/README.md",
          },
          readmeMarkdown: openDesignReadme,
        },
      });

      expect(result.status).toBe("completed");
      expect(result.repo.full_name).toBe("nexu-io/open-design");
      expect(result.brief.title).toBe("Open Design");
      expect(result.brief.metrics).toEqual([
        "16 coding-agent CLIs",
        "31 composable Skills",
        "72 brand-grade Design Systems",
        "HTML / PDF / PPTX / MP4 export",
      ]);
      expect(result.visualDirection.category).toBe("design_tool");
      expect(result.primaryIdentityAsset.source).toBe("github_avatar");

      const manifest = JSON.parse(await readFile(result.manifestPath, "utf8")) as { status: string };
      expect(manifest.status).toBe("completed");
      expect(result.modelConfig).toEqual({
        llm: "gpt-5.5",
        image: "gpt-image-2",
      });

      const englishPrompt = await readFile(result.outputs.en.promptPath, "utf8");
      expect(englishPrompt).toContain("Asset type:");
      expect(englishPrompt).toContain("Use the official logo asset if available.");
      expect(englishPrompt).toContain("Do not redraw it as a new symbol.");
      expect(englishPrompt).toContain("Do not invent random logos.");
      expect(englishPrompt).toContain("github.com/nexu-io/open-design");
      expect(englishPrompt).toContain("Design with the agent already on your laptop.");

      expect(await readFile(result.outputs.en.imagePath, "utf8")).toContain("Mock QuickFork image");
      expect(JSON.parse(await readFile(result.outputs.zh.qualityReportPath, "utf8")).status).toBe("passed");

      expect(result.localizedCopy.zh.metricLabels).toHaveLength(result.localizedCopy.en.metricLabels.length);
      expect(result.localizedCopy.ja.featureBullets).toHaveLength(result.localizedCopy.en.featureBullets.length);
      expect(result.localizedCopy.zh.ctaOrStripText).toBe("github.com/nexu-io/open-design");
      expect(result.localizedCopy.ja.ctaOrStripText).toBe("github.com/nexu-io/open-design");
    } finally {
      await rm(outputRoot, { recursive: true, force: true });
    }
  });
});
