import { mkdtemp, readFile, rm } from "node:fs/promises";
import { join } from "node:path";
import { tmpdir } from "node:os";

import { afterEach, describe, expect, it, vi } from "vitest";

import {
  createMockLlmAdapter,
  DEFAULT_GENERATION_MODELS,
  WAVESPEED_API_KEY_ENV,
  buildWavespeedChatCompletionRequest,
} from "./llm";
import { resolveBrandAssets, storeReferenceAsset } from "./assets";
import { buildProjectBrief } from "./brief";
import { buildLayoutSpec, buildLocalizedCopies } from "./copy";
import { generateWavespeedImage } from "./image-generator";
import { runProjectLaunchGeneration } from "./orchestrator";
import { buildImagePrompt, buildWavespeedImageRequest, imageAspectRatioForPreset, imageSizeForPreset } from "./prompt";
import { inspectMarketingCard } from "./quality";
import { extractReadmeContext } from "./readme";
import { fetchGitHubRepoMetadata, fetchRepositoryReadme, resolveRepositorySource } from "./repository-source";
import { parseGitHubRepositoryUrl } from "./repo";
import { selectVisualDirection } from "./visual";

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

const openDesignMetadata = {
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
    type: "Organization" as const,
  },
  readmeDownloadUrl: "https://raw.githubusercontent.com/nexu-io/open-design/main/README.md",
};

describe("project launch generation backend", () => {
  afterEach(() => {
    vi.unstubAllGlobals();
    delete process.env.WAVESPEED_API_KEY;
    delete process.env.VERCEL;
  });

  it("defines a mock LLM adapter boundary with Wavespeed GPT5.5 as the default model", async () => {
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

    expect(result.model).toBe("openai/gpt-5.5");
    expect(result.brief.title).toBe("Open Design");
    expect(result.visualDirection.category).toBe("design_tool");
    expect(result.localizedCopy.en.ctaOrStripText).toBe("github.com/nexu-io/open-design");
  });

  it("builds the Wavespeed chat completion request without persisting credentials", () => {
    const request = buildWavespeedChatCompletionRequest({
      model: DEFAULT_GENERATION_MODELS.llm,
      messages: [{ role: "user", content: "Read this README and return project signals." }],
      temperature: 0.2,
    });

    expect(WAVESPEED_API_KEY_ENV).toBe("WAVESPEED_API_KEY");
    expect(request.url).toBe("https://llm.wavespeed.ai/v1/chat/completions");
    expect(request.body.model).toBe("openai/gpt-5.5");
    expect(JSON.stringify(request)).not.toContain("YOUR_API_KEY");
  });

  it("normalizes copied Wavespeed API keys before writing request headers", async () => {
    process.env.WAVESPEED_API_KEY = "“test-key”";
    const fetchMock = vi.fn(async (_url: string | URL | Request, _init?: RequestInit) =>
      new Response(JSON.stringify({ choices: [{ message: { content: "ok" } }] }), {
        headers: { "Content-Type": "application/json" },
        status: 200,
      }),
    );
    vi.stubGlobal("fetch", fetchMock);

    await import("./llm").then(({ callWavespeedChatCompletion }) =>
      callWavespeedChatCompletion({
        messages: [{ role: "user", content: "Hello" }],
      }),
    );

    const firstRequest = fetchMock.mock.calls[0]?.[1];
    expect(firstRequest?.headers).toMatchObject({
      Authorization: "Bearer test-key",
    });
  });

  it("normalizes GitHub repository URLs", () => {
    expect(parseGitHubRepositoryUrl("https://github.com/nexu-io/open-design")).toEqual({
      owner: "nexu-io",
      repo: "open-design",
      fullName: "nexu-io/open-design",
      repoUrl: "https://github.com/nexu-io/open-design",
    });
  });

  it("strips .git suffixes when normalizing GitHub repository URLs", () => {
    expect(parseGitHubRepositoryUrl("https://github.com/nexu-io/open-design.git")).toEqual({
      owner: "nexu-io",
      repo: "open-design",
      fullName: "nexu-io/open-design",
      repoUrl: "https://github.com/nexu-io/open-design",
    });
  });

  it("rejects non-GitHub repository URLs", () => {
    expect(() => parseGitHubRepositoryUrl("https://example.com/nexu-io/open-design")).toThrow(/github\.com/i);
  });

  it("normalizes GitHub metadata responses for generation inputs", async () => {
    const repo = parseGitHubRepositoryUrl("https://github.com/nexu-io/open-design");
    vi.stubGlobal(
      "fetch",
      vi.fn(async () =>
        new Response(
          JSON.stringify({
            name: "open-design",
            full_name: "nexu-io/open-design",
            description: "Local-first agentic design",
            homepage: "https://open-design.ai",
            stargazers_count: 7200,
            language: "TypeScript",
            topics: ["design", "agents"],
            default_branch: "dev",
            owner: {
              login: "nexu-io",
              avatar_url: "https://avatars.githubusercontent.com/u/123",
              html_url: "https://github.com/nexu-io",
              type: "Organization",
            },
          }),
          { headers: { "Content-Type": "application/json" }, status: 200 },
        ),
      ),
    );

    await expect(fetchGitHubRepoMetadata(repo)).resolves.toMatchObject({
      name: "open-design",
      fullName: "nexu-io/open-design",
      description: "Local-first agentic design",
      homepage: "https://open-design.ai",
      stars: 7200,
      language: "TypeScript",
      topics: ["design", "agents"],
      defaultBranch: "dev",
      owner: {
        login: "nexu-io",
        avatarUrl: "https://avatars.githubusercontent.com/u/123",
        htmlUrl: "https://github.com/nexu-io",
        type: "Organization",
      },
      readmeDownloadUrl: "https://raw.githubusercontent.com/nexu-io/open-design/dev/README.md",
    });
  });

  it("tries README fallbacks in default branch, main, master, then Jina order", async () => {
    const metadata = {
      name: "open-design",
      fullName: "nexu-io/open-design",
      description: "Local-first agentic design",
      homepage: "https://open-design.ai",
      language: "TypeScript",
      topics: ["design"],
      defaultBranch: "dev",
      stars: 72,
      owner: {
        login: "nexu-io",
        avatarUrl: "https://github.com/nexu-io.png",
        htmlUrl: "https://github.com/nexu-io",
        type: "Organization" as const,
      },
      readmeDownloadUrl: "https://raw.githubusercontent.com/nexu-io/open-design/dev/README.md",
    };
    const fetchMock = vi.fn(async (url: string | URL | Request) => {
      const endpoint = String(url);
      if (endpoint.endsWith("/dev/README.md") || endpoint.endsWith("/main/README.md") || endpoint.endsWith("/master/README.md")) {
        return new Response("missing", { status: 404 });
      }
      if (endpoint === "https://r.jina.ai/https://github.com/nexu-io/open-design") {
        return new Response("# Open Design\n\nFallback README from Jina.", { status: 200 });
      }
      throw new Error(`Unexpected README URL: ${endpoint}`);
    });
    vi.stubGlobal("fetch", fetchMock);

    await expect(fetchRepositoryReadme(metadata)).resolves.toContain("Fallback README from Jina");
    expect(fetchMock.mock.calls.map((call) => String(call[0]))).toEqual([
      "https://raw.githubusercontent.com/nexu-io/open-design/dev/README.md",
      "https://raw.githubusercontent.com/nexu-io/open-design/main/README.md",
      "https://raw.githubusercontent.com/nexu-io/open-design/master/README.md",
      "https://r.jina.ai/https://github.com/nexu-io/open-design",
    ]);
  });

  it("marks repository source fallback warnings instead of presenting fallback data as verified GitHub data", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn(async () => new Response(JSON.stringify({ message: "rate limited" }), { headers: { "Content-Type": "application/json" }, status: 403 })),
    );

    const repo = parseGitHubRepositoryUrl("https://github.com/nexu-io/open-design");
    const source = await resolveRepositorySource(repo, { repoUrl: repo.repoUrl });

    expect(source.source).toBe("fallback");
    expect(source.warnings[0]).toMatch(/GitHub request failed with 403/);
    expect(source.metadata.fullName).toBe("nexu-io/open-design");
    expect(source.readmeMarkdown).toContain("open-design");
  });

  it("extracts README metrics without treating shields badges as facts", () => {
    const repo = parseGitHubRepositoryUrl("https://github.com/nexu-io/open-design");
    const context = extractReadmeContext(
      [
        "# Open Design",
        "",
        "![Stars 999](https://img.shields.io/github/stars/nexu-io/open-design)",
        "![Coverage 100%](https://img.shields.io/badge/coverage-100%25-green)",
        "",
        "- 16 coding-agent CLIs",
        "- 31 composable Skills",
        "- 72 brand-grade Design Systems",
        "- HTML / PDF / PPTX / MP4 export",
        "- Works with local agents",
      ].join("\n"),
      repo,
      {
        name: "open-design",
        fullName: "nexu-io/open-design",
        description: "Local-first agentic design",
        homepage: null,
        language: "TypeScript",
        topics: ["design"],
        defaultBranch: "main",
        stars: 7200,
        owner: {
          login: "nexu-io",
          avatarUrl: "https://github.com/nexu-io.png",
          htmlUrl: "https://github.com/nexu-io",
          type: "Organization",
        },
        readmeDownloadUrl: "https://raw.githubusercontent.com/nexu-io/open-design/main/README.md",
      },
    );

    expect(context.extracted.metrics).toEqual([
      "16 coding-agent CLIs",
      "31 composable Skills",
      "72 brand-grade Design Systems",
      "HTML / PDF / PPTX / MP4 export",
    ]);
    expect(context.extracted.metrics.join(" ")).not.toContain("999");
    expect(context.extracted.metrics.join(" ")).not.toContain("100%");
  });

  it("classifies README image references and resolves relative asset URLs", () => {
    const repo = parseGitHubRepositoryUrl("https://github.com/nexu-io/open-design");
    const context = extractReadmeContext(
      [
        "# Open Design",
        "",
        "![Open Design logo](docs/assets/logo.svg)",
        "![Product banner](./docs/assets/banner.png)",
        "![CI](https://img.shields.io/github/actions/workflow/status/nexu-io/open-design/ci.yml)",
        "![Architecture diagram](docs/architecture.png)",
      ].join("\n"),
      repo,
      {
        name: "open-design",
        fullName: "nexu-io/open-design",
        description: null,
        homepage: null,
        language: null,
        topics: [],
        defaultBranch: "dev",
        stars: 0,
        owner: {
          login: "nexu-io",
          avatarUrl: "https://github.com/nexu-io.png",
          htmlUrl: "https://github.com/nexu-io",
          type: "Organization",
        },
        readmeDownloadUrl: null,
      },
    );

    expect(context.extracted.referencedImages).toMatchObject([
      {
        alt: "Open Design logo",
        kind: "logo",
        absoluteUrl: "https://raw.githubusercontent.com/nexu-io/open-design/dev/docs/assets/logo.svg",
      },
      {
        alt: "Product banner",
        kind: "banner",
        absoluteUrl: "https://raw.githubusercontent.com/nexu-io/open-design/dev/docs/assets/banner.png",
      },
      {
        alt: "CI",
        kind: "badge",
        absoluteUrl: "https://img.shields.io/github/actions/workflow/status/nexu-io/open-design/ci.yml",
      },
      {
        alt: "Architecture diagram",
        kind: "diagram",
        absoluteUrl: "https://raw.githubusercontent.com/nexu-io/open-design/dev/docs/architecture.png",
      },
    ]);
  });

  it("prefers a traceable README logo over banners and GitHub avatars", () => {
    const repo = parseGitHubRepositoryUrl("https://github.com/nexu-io/open-design");
    const readme = extractReadmeContext(
      [
        "# Open Design",
        "",
        "![Open Design logo](docs/assets/logo.svg)",
        "![Product banner](docs/assets/banner.png)",
      ].join("\n"),
      repo,
      openDesignMetadata,
    );

    const assets = resolveBrandAssets(repo, openDesignMetadata, readme);

    expect(assets.primaryAsset).toMatchObject({
      type: "logo",
      source: "readme_image",
      path: "docs/assets/logo.svg",
      confidence: "high",
      reason: expect.stringContaining("README"),
    });
    expect(assets.candidates.map((asset) => `${asset.type}:${asset.confidence}`)).toEqual(["logo:high", "banner:medium"]);
  });

  it("does not use GitHub logos from README images as the project identity", () => {
    const repo = parseGitHubRepositoryUrl("https://github.com/nexu-io/open-design");
    const readme = extractReadmeContext(
      [
        "# Open Design",
        "",
        "![GitHub logo](docs/assets/github-logo.svg)",
        "![Open Design banner](docs/assets/banner.png)",
      ].join("\n"),
      repo,
      openDesignMetadata,
    );

    const assets = resolveBrandAssets(repo, openDesignMetadata, readme);

    expect(assets.primaryAsset).toMatchObject({
      type: "avatar",
      source: "github_avatar",
      confidence: "fallback",
      url: "https://github.com/nexu-io.png",
    });
    expect(assets.candidates.some((asset) => asset.path === "docs/assets/github-logo.svg")).toBe(false);
  });

  it("stores reference assets with source evidence and a stable local path", async () => {
    const outputRoot = await mkdtemp(join(tmpdir(), "quickfork-assets-"));
    const repo = parseGitHubRepositoryUrl("https://github.com/nexu-io/open-design");

    try {
      const stored = await storeReferenceAsset(outputRoot, repo, {
        type: "logo",
        url: "https://raw.githubusercontent.com/nexu-io/open-design/main/docs/assets/logo.svg",
        source: "readme_image",
        path: "docs/assets/logo.svg",
        confidence: "high",
        reason: "README references this image as logo.",
      });

      expect(stored.localPath).toBe(join(outputRoot, "open-design-logo.svg"));
      expect(stored.fileName).toBe("open-design-logo.svg");
      expect(stored.mimeType).toBe("image/svg+xml");
      await expect(readFile(stored.localPath, "utf8")).resolves.toContain("source=https://raw.githubusercontent.com/nexu-io/open-design/main/docs/assets/logo.svg");
    } finally {
      await rm(outputRoot, { recursive: true, force: true });
    }
  });

  it("keeps project briefs capped and backed by extracted evidence", () => {
    const repo = parseGitHubRepositoryUrl("https://github.com/nexu-io/open-design");
    const readme = extractReadmeContext(
      [
        "# Open Design",
        "",
        "Open-source Claude Design alternative for local-first agentic design.",
        "",
        "- 16 coding-agent CLIs",
        "- 31 composable Skills",
        "- 72 brand-grade Design Systems",
        "- HTML / PDF / PPTX / MP4 export",
        "- 120 integrations",
        "- Local-first design loop wires existing coding agents into artifact generation.",
        "- BYOK at every layer keeps provider choice and deployment control with the user.",
        "- Skills, design systems, sandboxed previews, and exports make design output repeatable.",
        "- Extra unsupported feature should be omitted from the card slots.",
      ].join("\n"),
      repo,
      openDesignMetadata,
    );

    const brief = buildProjectBrief(openDesignMetadata, readme);

    expect(brief.metrics).toHaveLength(4);
    expect(brief.metrics).not.toContain("120 integrations");
    expect(brief.keyInsights).toHaveLength(3);
    expect(brief.keyInsights).not.toContain("Extra unsupported feature should be omitted from the card slots.");
    for (const claim of [...brief.metrics, ...brief.keyInsights]) {
      expect(brief.sourceSignals.readmeEvidence.join("\n")).toContain(claim);
    }
  });

  it("returns a source-backed free repo launch brief for activation", async () => {
    const outputRoot = await mkdtemp(join(tmpdir(), "quickfork-brief-"));

    try {
      const result = await runProjectLaunchGeneration({
        repoUrl: "https://github.com/nexu-io/open-design",
        provider: "mock",
        outputRoot,
        mock: {
          repoMetadata: openDesignMetadata,
          readmeMarkdown: openDesignReadme,
        },
      });

      expect(result).toHaveProperty("launchBrief");
      expect(result.launchBrief.summary).toContain("Open-source Claude Design alternative");
      expect(result.launchBrief.audienceHypothesis).toContain("Open-source maintainers");
      expect(result.launchBrief.audienceDiscovery.title).toContain("nexu-io/open-design");
      expect(result.launchBrief.audienceDiscovery.signals.map((signal) => signal.id)).toEqual([
        "technical_builders",
        "open_source_adopters",
        "launch_reviewers",
      ]);
      expect(result.launchBrief.audienceDiscovery.signals[0]).toEqual(
        expect.objectContaining({
          segment: expect.stringContaining("Open-source maintainers"),
          trigger: expect.stringContaining("launch"),
          whereToFind: expect.stringContaining("GitHub"),
          validationQuestion: expect.stringContaining("repository"),
          source: expect.stringContaining("README or repo metadata includes"),
          priority: "high",
        }),
      );
      expect(result.launchBrief.readmeChecklist).toEqual(
        expect.arrayContaining([
          expect.objectContaining({
            item: expect.stringContaining("README"),
            source: expect.stringContaining("repository evidence"),
          }),
        ]),
      );
      expect(result.launchBrief.launchAngles).toHaveLength(3);
      expect(result.launchBrief.deckOutline).toHaveLength(4);
      expect(result.launchBrief.socialPost).toContain("github.com/nexu-io/open-design");
      expect(result.launchBrief.visualExplainerPrompt).toContain("workflow_diagram");
      expect(result.launchBrief.sourceReferences.join("\n")).toContain("README or repo metadata includes");
      expect(result.launchBrief.storyMap.title).toContain("nexu-io/open-design");
      expect(result.launchBrief.storyMap.nodes.map((node) => node.id)).toEqual([
        "source",
        "audience",
        "workflow",
        "proof",
        "launch",
      ]);
      expect(result.launchBrief.storyMap.nodes[0]).toEqual(
        expect.objectContaining({
          label: "Source",
          title: expect.stringContaining("Repository evidence"),
          source: expect.stringContaining("README or repo metadata includes"),
        }),
      );
      expect(result.launchBrief.storyMap.nodes[2]?.detail).toContain("->");
      expect(result.launchBrief.launchMaterialsMap.title).toContain("nexu-io/open-design");
      expect(result.launchBrief.launchMaterialsMap.channels.map((channel) => channel.type)).toEqual([
        "readme",
        "social",
        "deck",
        "visual",
        "outreach",
      ]);
      expect(result.launchBrief.launchMaterialsMap.channels[0]).toEqual(
        expect.objectContaining({
          type: "readme",
          label: "README launch section",
          primaryUser: expect.stringContaining("Open-source"),
          jobToBeDone: expect.stringContaining("understand"),
          reviewQuestion: expect.stringContaining("source"),
          successSignal: expect.stringContaining("README"),
          source: expect.stringContaining("README or repo metadata includes"),
        }),
      );
      expect(result.launchBrief.launchMaterialsMap.channels[3]).toEqual(
        expect.objectContaining({
          type: "visual",
          artifactLabel: "Visual explainer prompt",
          reviewQuestion: expect.stringContaining("identity"),
        }),
      );
      expect(result.launchBrief.artifacts.map((artifact) => artifact.type)).toEqual([
        "audience",
        "story_map",
        "materials_map",
        "readme",
        "social",
        "deck",
        "outreach",
        "visual",
      ]);
      expect(result.launchBrief.artifacts).toEqual(
        expect.arrayContaining([
          expect.objectContaining({
            type: "audience",
            label: "Target user discovery map",
            fileName: "nexu-io-open-design-target-user-discovery.md",
            body: expect.stringContaining("## Target user discovery map"),
            sourceReferences: expect.arrayContaining([expect.stringContaining("README or repo metadata includes")]),
          }),
          expect.objectContaining({
            type: "story_map",
            label: "Project story map",
            fileName: "nexu-io-open-design-project-story-map.md",
            body: expect.stringContaining("## Project story map"),
            sourceReferences: expect.arrayContaining([expect.stringContaining("README or repo metadata includes")]),
          }),
          expect.objectContaining({
            type: "materials_map",
            label: "Launch materials map",
            fileName: "nexu-io-open-design-launch-materials-map.md",
            body: expect.stringContaining("## Launch materials map"),
            sourceReferences: expect.arrayContaining([expect.stringContaining("README or repo metadata includes")]),
          }),
          expect.objectContaining({
            type: "readme",
            label: "README launch brief",
            fileName: "nexu-io-open-design-readme-launch-brief.md",
            body: expect.stringContaining("README checklist"),
            sourceReferences: expect.arrayContaining([expect.stringContaining("README or repo metadata includes")]),
          }),
          expect.objectContaining({
            type: "deck",
            label: "Pitch deck outline",
            body: expect.stringContaining("Problem:"),
          }),
        ]),
      );
      expect(JSON.stringify(result.launchBrief)).not.toMatch(/best|guaranteed|customers|revenue/i);
      expect(JSON.stringify(result.launchBrief.artifacts)).not.toMatch(/guaranteed|customers|revenue|ranking/i);
    } finally {
      await rm(outputRoot, { recursive: true, force: true });
    }
  });

  it("uses cautious fallback brief language when source evidence is thin", () => {
    const repo = parseGitHubRepositoryUrl("https://github.com/nexu-io/open-design");
    const readme = extractReadmeContext("# Open Design\n\n", repo, { ...openDesignMetadata, description: null, stars: 0, language: null, topics: [] });
    const brief = buildProjectBrief({ ...openDesignMetadata, description: null, stars: 0, language: null, topics: [] }, readme);

    expect(brief.metrics).toEqual([]);
    expect(brief.keyInsights).toEqual([
      "Repository context is compressed into a shareable project story.",
      "Traceable assets keep generated visuals grounded in the real project.",
      "Repeatable layout slots support multilingual publishing.",
    ]);
    expect(brief.sourceSignals.readmeEvidence.join("\n")).not.toMatch(/benchmark|fastest|best/i);
  });

  it("selects distinct visual directions for agent tools and open-source alternatives", () => {
    const agentBrief = {
      title: "Agent Console",
      subtitle: "Composable agent tool with context routing and tool calling.",
      metrics: ["12 tools"],
      keyInsights: ["Schedules agent runs with explicit context and tool calling."],
      workflowSteps: ["Plan", "Dispatch", "Review"],
      sourceSignals: {
        repoDescription: "Composable agent tool with context routing and tool calling.",
        homepage: null,
        primaryLanguage: "TypeScript",
        topics: ["agent", "tool-calling"],
        readmeEvidence: [],
      },
    };
    const alternativeBrief = {
      ...agentBrief,
      title: "Local Cloud",
      subtitle: "Open-source alternative to hosted automation with BYOK and self-hosting.",
      keyInsights: ["Avoid lock-in with local-first BYOK self-hosting."],
    };

    expect(
      selectVisualDirection(
        { ...openDesignMetadata, name: "agent-console", description: agentBrief.subtitle, topics: ["agent", "tool-calling"], language: "TypeScript" },
        agentBrief,
      ).category,
    ).toBe("agent_tool");
    expect(
      selectVisualDirection(
        { ...openDesignMetadata, name: "local-cloud", description: alternativeBrief.subtitle, topics: ["open-source", "self-hosted", "byok"], language: "TypeScript" },
        alternativeBrief,
      ).category,
    ).toBe("open_source_alternative");
  });

  it("keeps localized copy slot counts aligned while preserving brand and GitHub URL", () => {
    const brief = buildProjectBrief(openDesignMetadata, extractReadmeContext(openDesignReadme, parseGitHubRepositoryUrl("https://github.com/nexu-io/open-design"), openDesignMetadata));
    const copies = buildLocalizedCopies(openDesignMetadata, brief);

    expect(copies.zh.metricLabels).toHaveLength(copies.en.metricLabels.length);
    expect(copies.ja.featureBullets).toHaveLength(copies.en.featureBullets.length);
    expect(copies.zh.workflowLabels).toHaveLength(copies.en.workflowLabels.length);
    expect(copies.zh.ctaOrStripText).toBe("github.com/nexu-io/open-design");
    expect(copies.ja.ctaOrStripText).toBe("github.com/nexu-io/open-design");
    expect(copies.zh.valueProposition).toContain("coding agents");
  });

  it("uses repository-specific copy instead of generic launch-ready story headlines", () => {
    const brief = {
      title: "FlashQLA",
      subtitle: "CUDA kernels for faster attention inference.",
      metrics: ["CUDA primary language", "1,240 GitHub stars"],
      keyInsights: ["Optimizes attention kernels for lower latency inference."],
      workflowSteps: ["Install kernels", "Run benchmark", "Ship inference"],
      sourceSignals: {
        repoDescription: "CUDA kernels for faster attention inference.",
        homepage: null,
        primaryLanguage: "CUDA",
        topics: ["cuda", "inference"],
        readmeEvidence: ["README or repo metadata includes: CUDA kernels for faster attention inference."],
      },
    };

    const copies = buildLocalizedCopies(
      {
        ...openDesignMetadata,
        name: "FlashQLA",
        fullName: "QwenLM/FlashQLA",
        description: "CUDA kernels for faster attention inference.",
        language: "CUDA",
        topics: ["cuda", "inference"],
      },
      brief,
    );

    expect(copies.en.hook).toBe("CUDA kernels for faster attention inference");
    expect(copies.en.hook).not.toContain("turns repo context into a launch-ready story");
    expect(copies.zh.hook).toBe("CUDA kernels for faster attention inference");
    expect(copies.zh.hook).not.toContain("仓库内容");
    expect(copies.ja.hook).toBe("CUDA kernels for faster attention inference");
    expect(copies.ja.hook).not.toContain("リポジトリの文脈");
  });

  it("supports ratio presets for generated launch assets", () => {
    expect(imageSizeForPreset("16:9")).toBe("1920x1080");
    expect(imageSizeForPreset("1:1")).toBe("1200x1200");
    expect(imageSizeForPreset("4:3")).toBe("1600x1200");
    expect(imageSizeForPreset("3:4")).toBe("1200x1600");
    expect(imageSizeForPreset("9:16")).toBe("1080x1920");
    expect(imageAspectRatioForPreset("4:3")).toBe("4:3");
    expect(imageAspectRatioForPreset("3:2")).toBe("3:2");
  });

  it("builds the Wavespeed gpt-image-2 request from the prompt contract", () => {
    const imageRequest = buildWavespeedImageRequest({
      model: DEFAULT_GENERATION_MODELS.image,
      prompt: "Create a launch card",
      preset: "16:9",
      quality: "low",
    });

    expect(imageRequest.url).toBe("https://api.wavespeed.ai/api/v3/openai/gpt-image-2/text-to-image");
    expect(imageRequest.body).toEqual({
      prompt: "Create a launch card",
      aspect_ratio: "16:9",
      resolution: "1k",
      quality: "low",
      output_format: "png",
      enable_sync_mode: false,
      enable_base64_output: false,
    });
  });

  it("builds an image prompt with source-backed identity rules and exact text slots", () => {
    const repo = parseGitHubRepositoryUrl("https://github.com/nexu-io/open-design");
    const readme = extractReadmeContext(openDesignReadme, repo, openDesignMetadata);
    const brief = buildProjectBrief(openDesignMetadata, readme);
    const visualDirection = selectVisualDirection(openDesignMetadata, brief);
    const primaryAsset = {
      type: "logo" as const,
      url: "https://raw.githubusercontent.com/nexu-io/open-design/main/docs/assets/logo.svg",
      source: "readme_image" as const,
      path: "docs/assets/logo.svg",
      confidence: "high" as const,
      reason: "README references this image as logo.",
      localPath: "output/project-launch/nexu-io-open-design/assets/open-design-logo.svg",
      fileName: "open-design-logo.svg",
      mimeType: "image/svg+xml",
      sizeBytes: 128,
    };
    const layout = buildLayoutSpec(openDesignMetadata, brief, primaryAsset);
    const copy = buildLocalizedCopies(openDesignMetadata, brief).en;
    const prompt = buildImagePrompt({
      brief,
      visualDirection,
      layout,
      copy,
      primaryAsset,
      quality: "low",
      preset: "3:2",
      model: DEFAULT_GENERATION_MODELS.image,
    }).prompt;

    expect(prompt).toContain("Use case:");
    expect(prompt).toContain("infographic-diagram");
    expect(prompt).toContain("Asset type:");
    expect(prompt).toContain("Primary identity asset path: output/project-launch/nexu-io-open-design/assets/open-design-logo.svg");
    expect(prompt).toContain("Use the official brand logo if a real logo source asset is supplied.");
    expect(prompt).toContain("If no official brand logo source is supplied, use the real GitHub account avatar.");
    expect(prompt).toContain("The GitHub logo is only for the bottom GitHub strip, not the project identity slot.");
    expect(prompt).toContain("Never synthesize random logos, abstract brand marks, mascots, badges, or unrelated symbols.");
    expect(prompt).toContain(`Headline: "${copy.hook}"`);
    expect(prompt).toContain(`GitHub strip: "${copy.ctaOrStripText}"`);
    expect(prompt).toContain("Text budget:");
    expect(prompt).toContain("Render at most 2 metric chips and 2 short feature chips.");
    expect(prompt).not.toContain(`Subtitle: "${copy.subtitle}"`);
    expect(prompt).not.toContain(`3. "${copy.metricLabels[2]}"`);
    expect(prompt).not.toContain(`3. "${copy.featureBullets[2]}"`);
    expect(prompt).not.toContain("\nWorkflow:\n");
    expect(prompt).toContain("Do not hallucinate product screenshots not described in the visual panel.");
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

      const manifest = JSON.parse(await readFile(result.manifestPath, "utf8")) as {
        status: string;
        artifactRoot: string;
        safety: { noRemotePush: boolean; noSourceProjectModification: boolean; noSocialPublishing: boolean; noRandomLogo: boolean };
        stages: { id: string }[];
        outputs: Record<string, { promptPath: string; imagePath: string; qualityReportPath: string }>;
      };
      expect(manifest.status).toBe("completed");
      expect(manifest.artifactRoot).toBe(result.artifactRoot);
      expect(manifest.safety).toMatchObject({
        noRemotePush: true,
        noSourceProjectModification: true,
        noSocialPublishing: true,
        noRandomLogo: true,
      });
      expect(manifest.stages.map((stage) => stage.id)).toEqual(["repo", "readme", "brief", "prompt", "image", "quality", "manifest"]);
      expect(Object.keys(manifest.outputs)).toEqual(["en", "zh", "ja"]);
      expect(manifest.outputs.en).toMatchObject({
        promptPath: result.outputs.en.promptPath,
        imagePath: result.outputs.en.imagePath,
        qualityReportPath: result.outputs.en.qualityReportPath,
      });
      expect(result.modelConfig).toEqual({
        llm: "openai/gpt-5.5",
        image: "openai/gpt-image-2/text-to-image",
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

  it("uses a writable temporary artifact root in Vercel production when outputRoot is omitted", async () => {
    process.env.VERCEL = "1";
    let artifactRoot: string | undefined;

    try {
      const result = await runProjectLaunchGeneration({
        repoUrl: "https://github.com/nexu-io/open-design",
        locales: ["en"],
        provider: "mock",
        mock: {
          repoMetadata: openDesignMetadata,
          readmeMarkdown: openDesignReadme,
        },
      });
      artifactRoot = result.artifactRoot;

      expect(result.status).toBe("completed");
      expect(result.artifactRoot).toContain(join(tmpdir(), "quickfork-output", "project-launch"));
      expect(result.artifactRoot).not.toMatch(/^output[/\\]/);
    } finally {
      if (artifactRoot) await rm(artifactRoot, { recursive: true, force: true });
    }
  });

  it("calls Wavespeed GPT5.5 and gpt-image-2 when provider is wavespeed", async () => {
    const outputRoot = await mkdtemp(join(tmpdir(), "quickfork-wavespeed-generation-"));
    process.env.WAVESPEED_API_KEY = "test-wavespeed-key";
    const fetchMock = vi.fn(async (url: string | URL | Request) => {
      const endpoint = String(url);
      if (endpoint.includes("/chat/completions")) {
        return new Response(
          JSON.stringify({
            choices: [{ message: { content: "Use deterministic project evidence from the README." } }],
          }),
          { headers: { "Content-Type": "application/json" }, status: 200 },
        );
      }
      if (endpoint.includes("/text-to-image")) {
        return new Response(
          JSON.stringify({
            model: "openai/gpt-image-2/text-to-image",
            outputs: ["https://wavespeed.ai/generated/flashqla-card.png"],
            status: "completed",
          }),
          { headers: { "Content-Type": "application/json" }, status: 200 },
        );
      }
      throw new Error(`Unexpected fetch: ${endpoint}`);
    });
    vi.stubGlobal("fetch", fetchMock);

    try {
      const result = await runProjectLaunchGeneration({
        repoUrl: "https://github.com/QwenLM/FlashQLA",
        locales: ["en"],
        provider: "wavespeed",
        preset: "4:3",
        imageQuality: "low",
        outputRoot,
        mock: {
          readmeMarkdown: openDesignReadme,
        },
      });

      expect(fetchMock).toHaveBeenCalledTimes(3);
      expect(fetchMock.mock.calls.map((call) => String(call[0]))).toEqual([
        "https://llm.wavespeed.ai/v1/chat/completions",
        "https://llm.wavespeed.ai/v1/chat/completions",
        "https://api.wavespeed.ai/api/v3/openai/gpt-image-2/text-to-image",
      ]);
      expect(result.modelCalls.map((call) => call.model)).toEqual([
        "openai/gpt-5.5",
        "openai/gpt-5.5",
        "openai/gpt-image-2/text-to-image",
      ]);
      expect(result.stages.map((stage) => stage.id)).toEqual([
        "repo",
        "readme",
        "brief",
        "prompt",
        "image",
        "quality",
        "manifest",
      ]);
      expect(result.outputs.en.imageUrl).toBe("https://wavespeed.ai/generated/flashqla-card.png");
    } finally {
      await rm(outputRoot, { recursive: true, force: true });
    }
  });

  it("polls Wavespeed image results when text-to-image returns a processing task", async () => {
    const outputRoot = await mkdtemp(join(tmpdir(), "quickfork-wavespeed-poll-"));
    process.env.WAVESPEED_API_KEY = "test-wavespeed-key";
    const fetchMock = vi.fn(async (url: string | URL | Request) => {
      const endpoint = String(url);
      if (endpoint.includes("/chat/completions")) {
        return new Response(JSON.stringify({ choices: [{ message: { content: "ok" } }] }), {
          headers: { "Content-Type": "application/json" },
          status: 200,
        });
      }
      if (endpoint.endsWith("/text-to-image")) {
        return new Response(
          JSON.stringify({
            id: "task_123",
            status: "processing",
            outputs: [],
            urls: { get: "https://api.wavespeed.ai/api/v3/predictions/task_123/result" },
          }),
          { headers: { "Content-Type": "application/json" }, status: 200 },
        );
      }
      if (endpoint.endsWith("/predictions/task_123/result")) {
        return new Response(
          JSON.stringify({
            data: {
              id: "task_123",
              status: "completed",
              outputs: ["https://wavespeed.ai/generated/polled-card.png"],
            },
          }),
          { headers: { "Content-Type": "application/json" }, status: 200 },
        );
      }
      throw new Error(`Unexpected fetch: ${endpoint}`);
    });
    vi.stubGlobal("fetch", fetchMock);

    try {
      const result = await runProjectLaunchGeneration({
        repoUrl: "https://github.com/QwenLM/FlashQLA",
        locales: ["en"],
        provider: "wavespeed",
        outputRoot,
        mock: { readmeMarkdown: openDesignReadme },
      });

      expect(result.outputs.en.imageUrl).toBe("https://wavespeed.ai/generated/polled-card.png");
      expect(fetchMock.mock.calls.map((call) => String(call[0]))).toContain("https://api.wavespeed.ai/api/v3/predictions/task_123/result");
    } finally {
      await rm(outputRoot, { recursive: true, force: true });
    }
  });

  it("derives the Wavespeed image result polling URL from the request id when urls are omitted", async () => {
    const outputRoot = await mkdtemp(join(tmpdir(), "quickfork-wavespeed-request-id-poll-"));
    process.env.WAVESPEED_API_KEY = "Bearer “test-wavespeed-key”";
    const fetchMock = vi.fn(async (url: string | URL | Request, init?: RequestInit) => {
      const endpoint = String(url);
      if (endpoint.includes("/chat/completions")) {
        return new Response(JSON.stringify({ choices: [{ message: { content: "ok" } }] }), {
          headers: { "Content-Type": "application/json" },
          status: 200,
        });
      }
      if (endpoint.endsWith("/text-to-image")) {
        expect((init?.headers as Record<string, string>).Authorization).toBe("Bearer test-wavespeed-key");
        expect(JSON.parse(String(init?.body))).toMatchObject({
          prompt: expect.stringContaining("Asset type:"),
          resolution: "1k",
          quality: "low",
          output_format: "png",
          enable_sync_mode: false,
          enable_base64_output: false,
        });
        return new Response(
          JSON.stringify({
            id: "request_456",
            status: "processing",
            outputs: [],
          }),
          { headers: { "Content-Type": "application/json" }, status: 200 },
        );
      }
      if (endpoint.endsWith("/predictions/request_456")) {
        return new Response(
          JSON.stringify({
            data: {
              id: "request_456",
              status: "completed",
              outputs: ["https://wavespeed.ai/generated/request-id-card.png"],
            },
          }),
          { headers: { "Content-Type": "application/json" }, status: 200 },
        );
      }
      throw new Error(`Unexpected fetch: ${endpoint}`);
    });
    vi.stubGlobal("fetch", fetchMock);

    try {
      const result = await runProjectLaunchGeneration({
        repoUrl: "https://github.com/QwenLM/FlashQLA",
        locales: ["en"],
        provider: "wavespeed",
        outputRoot,
        mock: { readmeMarkdown: openDesignReadme },
      });

      expect(result.outputs.en.imageUrl).toBe("https://wavespeed.ai/generated/request-id-card.png");
      expect(fetchMock.mock.calls.map((call) => String(call[0]))).toContain("https://api.wavespeed.ai/api/v3/predictions/request_456");
    } finally {
      await rm(outputRoot, { recursive: true, force: true });
    }
  });

  it("keeps polling Wavespeed image tasks beyond the previous 45 second window", async () => {
    const outputRoot = await mkdtemp(join(tmpdir(), "quickfork-wavespeed-slow-poll-"));
    process.env.WAVESPEED_API_KEY = "test-wavespeed-key";
    let pollCount = 0;
    const fetchMock = vi.fn(async (url: string | URL | Request) => {
      const endpoint = String(url);
      if (endpoint.endsWith("/text-to-image")) {
        return new Response(
          JSON.stringify({
            id: "slow_789",
            status: "processing",
            outputs: [],
          }),
          { headers: { "Content-Type": "application/json" }, status: 200 },
        );
      }
      if (endpoint.endsWith("/predictions/slow_789")) {
        pollCount += 1;
        return new Response(
          JSON.stringify({
            data: {
              id: "slow_789",
              status: pollCount < 35 ? "processing" : "completed",
              outputs: pollCount < 35 ? [] : ["https://wavespeed.ai/generated/slow-card.png"],
            },
          }),
          { headers: { "Content-Type": "application/json" }, status: 200 },
        );
      }
      throw new Error(`Unexpected fetch: ${endpoint}`);
    });

    try {
      const result = await generateWavespeedImage(outputRoot, "en", {
        model: DEFAULT_GENERATION_MODELS.image,
        size: "1600x1200",
        quality: "low",
        prompt: "Create a launch card",
        referencedAssets: [],
      }, {
        preset: "4:3",
        fetchImpl: fetchMock,
        pollIntervalMs: 0,
      });

      expect(pollCount).toBe(35);
      expect(result.imageUrl).toBe("https://wavespeed.ai/generated/slow-card.png");
    } finally {
      await rm(outputRoot, { recursive: true, force: true });
    }
  });

  it("returns a structured failed image result while preserving the prompt artifact", async () => {
    const outputRoot = await mkdtemp(join(tmpdir(), "quickfork-wavespeed-fail-"));
    process.env.WAVESPEED_API_KEY = "test-wavespeed-key";

    try {
      const result = await generateWavespeedImage(outputRoot, "en", {
        model: DEFAULT_GENERATION_MODELS.image,
        size: "1536x1024",
        quality: "low",
        prompt: "Create a launch card with exact text.",
        referencedAssets: [],
      }, {
        preset: "3:2",
        fetchImpl: vi.fn(async () => new Response(JSON.stringify({ error: "provider unavailable" }), { status: 503 })),
        pollIntervalMs: 0,
      });

      expect(result.status).toBe("failed");
      expect(result.provider).toBe("wavespeed");
      expect(result.warnings.join("\n")).toContain("Wavespeed image generation failed with 503.");
      await expect(readFile(result.promptPath, "utf8")).resolves.toContain("Create a launch card with exact text.");
      await expect(readFile(result.imagePath, "utf8")).resolves.toContain("Wavespeed image generation failed");
    } finally {
      await rm(outputRoot, { recursive: true, force: true });
    }
  });

  it("marks orchestration and manifest failed when the image provider returns a structured failure", async () => {
    const outputRoot = await mkdtemp(join(tmpdir(), "quickfork-orchestration-image-fail-"));
    process.env.WAVESPEED_API_KEY = "test-wavespeed-key";
    const fetchMock = vi.fn(async (url: string | URL | Request) => {
      const endpoint = String(url);
      if (endpoint.includes("/chat/completions")) {
        return new Response(JSON.stringify({ choices: [{ message: { content: "ok" } }] }), {
          headers: { "Content-Type": "application/json" },
          status: 200,
        });
      }
      if (endpoint.endsWith("/text-to-image")) {
        return new Response(JSON.stringify({ error: "provider unavailable" }), {
          headers: { "Content-Type": "application/json" },
          status: 503,
        });
      }
      throw new Error(`Unexpected fetch: ${endpoint}`);
    });
    vi.stubGlobal("fetch", fetchMock);

    try {
      const result = await runProjectLaunchGeneration({
        repoUrl: "https://github.com/QwenLM/FlashQLA",
        locales: ["en"],
        provider: "wavespeed",
        outputRoot,
        mock: { readmeMarkdown: openDesignReadme },
      });
      const manifest = JSON.parse(await readFile(result.manifestPath, "utf8")) as {
        status: string;
        outputs: Record<string, { status: string; warnings: string[] }>;
        stages: Array<{ id: string; status: string }>;
        modelCalls: Array<{ purpose: string; status: string }>;
      };

      expect(result.status).toBe("failed");
      expect(result.outputs.en.status).toBe("failed");
      expect(result.outputs.en.warnings?.join("\n")).toContain("Wavespeed image generation failed with 503.");
      expect(manifest.status).toBe("failed");
      expect(manifest.outputs.en.status).toBe("failed");
      expect(manifest.stages.find((stage) => stage.id === "image")?.status).toBe("failed");
      expect(manifest.modelCalls.find((call) => call.purpose === "image_generation")?.status).toBe("failed");
    } finally {
      await rm(outputRoot, { recursive: true, force: true });
    }
  });

  it("returns a minimal revision prompt for deterministic QA failures", () => {
    const brief = {
      title: "Open Design",
      subtitle: "Local-first agentic design.",
      metrics: ["16 coding-agent CLIs", "31 composable Skills"],
      keyInsights: ["Local-first design loop.", "BYOK keeps provider control.", "Exports make output repeatable."],
      workflowSteps: ["Brief", "Build", "Export"],
      sourceSignals: {
        repoDescription: "Local-first agentic design.",
        homepage: null,
        primaryLanguage: "TypeScript",
        topics: ["design"],
        readmeEvidence: [],
      },
    };
    const primaryAsset = {
      type: "avatar" as const,
      url: "https://github.com/nexu-io.png",
      source: "github_avatar" as const,
      confidence: "fallback" as const,
      reason: "No official logo was found.",
      localPath: "output/project-launch/nexu-io-open-design/assets/nexu-io-github-avatar.png",
      fileName: "nexu-io-github-avatar.png",
      mimeType: "image/png",
      sizeBytes: 128,
    };
    const layout = buildLayoutSpec(openDesignMetadata, brief, primaryAsset);
    const englishCopy = buildLocalizedCopies(openDesignMetadata, brief).en;
    const brokenCopy = {
      ...englishCopy,
      ctaOrStripText: "github.com/wrong/repo",
      metricLabels: ["16 coding-agent CLIs"],
    };

    const report = inspectMarketingCard({
      copy: brokenCopy,
      englishCopy,
      brief,
      layout,
      primaryAsset,
    });

    expect(report.status).toBe("needs_revision");
    expect(report.revisionPrompt).toContain("Regenerate with the same layout.");
    expect(report.revisionPrompt).toContain("GitHub strip URL: github.com/nexu-io/open-design");
    expect(report.revisionPrompt).toContain("Metrics: 16 coding-agent CLIs; 31 composable Skills");
    expect(report.revisionPrompt).not.toContain("completely new");
  });
});
