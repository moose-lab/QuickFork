import { mkdir, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";

import { resolveBrandAssets, storeReferenceAsset } from "./assets.js";
import { generateMockImage, generateWavespeedImage } from "./image-generator.js";
import { WAVESPEED_CHAT_COMPLETIONS_URL, createMockLlmAdapter, createWavespeedLlmAdapter, resolveGenerationModelConfig } from "./llm.js";
import { WAVESPEED_IMAGE_ENDPOINT, buildImagePrompt } from "./prompt.js";
import { inspectMarketingCard } from "./quality.js";
import { parseGitHubRepositoryUrl } from "./repo.js";
import { resolveRepositorySource } from "./repository-source.js";
import type { CreateGenerationInput, GenerationModelCall, GenerationResponse, GenerationStage, LocaleCode } from "./types.js";
import { GenerationError } from "./types.js";

const DEFAULT_LOCALES: LocaleCode[] = ["en", "zh", "ja"];

function projectSlug(owner: string, repo: string) {
  return `${owner}-${repo}`.toLowerCase().replace(/[^a-z0-9-]+/g, "-");
}

function responseRepo(owner: string, repo: string) {
  return {
    owner,
    repo,
    full_name: `${owner}/${repo}`,
    repo_url: `https://github.com/${owner}/${repo}`,
  };
}

function resolveOutputRoot(outputRoot?: string) {
  if (outputRoot) return outputRoot;
  if (process.env.VERCEL) return join(tmpdir(), "quickfork-output", "project-launch");
  return "output/project-launch";
}

async function writeJson(path: string, value: unknown) {
  await writeFile(path, `${JSON.stringify(value, null, 2)}\n`, "utf8");
}

export async function runProjectLaunchGeneration(input: CreateGenerationInput): Promise<GenerationResponse> {
  const repo = parseGitHubRepositoryUrl(input.repoUrl);
  const locales = input.locales?.length ? input.locales : DEFAULT_LOCALES;
  const provider = input.provider ?? "mock";
  const preset = input.preset ?? "4:3";
  const imageQuality = input.imageQuality ?? "low";
  const modelConfig = resolveGenerationModelConfig(input.models);
  const llm = provider === "wavespeed" ? createWavespeedLlmAdapter({ model: modelConfig.llm }) : createMockLlmAdapter({ model: modelConfig.llm });
  const stages: GenerationStage[] = [];
  const modelCalls: GenerationModelCall[] = [];

  if (provider !== "mock" && provider !== "wavespeed") {
    throw new GenerationError("VALIDATION_ERROR", "provider must be wavespeed.");
  }

  const repositorySource = await resolveRepositorySource(repo, input);
  stages.push({
    id: "repo",
    label: "Repository source",
    status: "completed",
    detail: repositorySource.source,
  });
  const { metadata, readmeMarkdown } = repositorySource;
  const readme = await llm.readRepositoryContext({ repo, metadata, readmeMarkdown });
  stages.push({
    id: "readme",
    label: provider === "wavespeed" ? "GPT5.5 README analysis" : "README analysis",
    status: "completed",
    model: modelConfig.llm,
  });
  modelCalls.push({
    provider,
    model: modelConfig.llm,
    endpoint: provider === "wavespeed" ? WAVESPEED_CHAT_COMPLETIONS_URL : undefined,
    purpose: "readme_analysis",
    status: provider === "wavespeed" ? "completed" : "skipped",
  });
  const { primaryAsset } = resolveBrandAssets(repo, metadata, readme);

  const artifactRoot = join(resolveOutputRoot(input.outputRoot), projectSlug(repo.owner, repo.repo));
  const assetsDir = join(artifactRoot, "assets");
  await mkdir(artifactRoot, { recursive: true });
  const storedPrimaryAsset = await storeReferenceAsset(assetsDir, repo, primaryAsset);

  const plan = await llm.buildProjectLaunchPlan({
    repo,
    metadata,
    readmeMarkdown,
    primaryIdentityAsset: storedPrimaryAsset,
    readme,
  });
  stages.push({
    id: "brief",
    label: provider === "wavespeed" ? "GPT5.5 launch plan" : "Launch plan",
    status: "completed",
    model: modelConfig.llm,
  });
  modelCalls.push({
    provider,
    model: modelConfig.llm,
    endpoint: provider === "wavespeed" ? WAVESPEED_CHAT_COMPLETIONS_URL : undefined,
    purpose: "launch_plan",
    status: provider === "wavespeed" ? "completed" : "skipped",
  });
  const { brief, visualDirection, layout, localizedCopy } = plan;

  const briefPath = join(artifactRoot, "project_brief_curated.json");
  await writeJson(briefPath, brief);

  const outputs = {} as GenerationResponse["outputs"];
  const qualityReports: Record<string, unknown> = {};
  let hasImageFailure = false;

  for (const locale of locales) {
    const copy = localizedCopy[locale];
    const localeDir = join(artifactRoot, locale);
    const prompt = buildImagePrompt({
      brief,
      visualDirection,
      layout,
      copy,
      primaryAsset: storedPrimaryAsset,
      quality: imageQuality,
      preset,
      model: modelConfig.image,
    });
    if (!stages.some((stage) => stage.id === "prompt")) {
      stages.push({
        id: "prompt",
        label: "gpt-image-2 prompt",
        status: "completed",
        model: modelConfig.image,
      });
    }
    const generated =
      provider === "wavespeed"
        ? await generateWavespeedImage(localeDir, locale, prompt, { preset })
        : await generateMockImage(localeDir, locale, prompt);
    if (generated.status === "failed") {
      hasImageFailure = true;
    }
    const quality = inspectMarketingCard({
      copy,
      englishCopy: localizedCopy.en,
      brief,
      layout,
      primaryAsset: storedPrimaryAsset,
    });
    const qualityReportPath = join(localeDir, "quality-report.json");
    await writeJson(qualityReportPath, quality);
    qualityReports[locale] = quality;
    outputs[locale] = {
      promptPath: generated.promptPath,
      imagePath: generated.imagePath,
      ...(generated.imageUrl ? { imageUrl: generated.imageUrl } : {}),
      status: generated.status,
      warnings: generated.warnings,
      qualityReportPath,
    };
  }
  const generationStatus = hasImageFailure ? "failed" : "completed";
  stages.push({
    id: "image",
    label: provider === "wavespeed" ? "gpt-image-2 render" : "Mock image render",
    status: generationStatus,
    model: modelConfig.image,
  });
  modelCalls.push({
    provider,
    model: modelConfig.image,
    endpoint: provider === "wavespeed" ? WAVESPEED_IMAGE_ENDPOINT : undefined,
    purpose: "image_generation",
    status: provider === "wavespeed" ? generationStatus : "skipped",
  });
  stages.push({
    id: "quality",
    label: "Quality report",
    status: "completed",
  });
  stages.push({
    id: "manifest",
    label: "Manifest",
    status: "completed",
  });

  const generationId = `gen_${repo.owner}_${repo.repo}_${Date.now()}`.replace(/[^a-zA-Z0-9_]/g, "_");
  const manifestPath = join(artifactRoot, "manifest.json");
  const manifest = {
    id: generationId,
    status: generationStatus,
    repo: responseRepo(repo.owner, repo.repo),
    artifactRoot,
    projectBrief: "project_brief_curated.json",
    primaryIdentityAsset: storedPrimaryAsset.localPath,
    visualDirection: visualDirection.category,
    model: {
      llm: modelConfig.llm,
      image: modelConfig.image,
      provider,
      quality: imageQuality,
      preset,
    },
    source: {
      repository: repositorySource.source,
      warnings: repositorySource.warnings,
    },
    locales,
    stages,
    modelCalls,
    outputs,
    qualityReports,
    safety: {
      noRemotePush: true,
      noSourceProjectModification: true,
      noSocialPublishing: true,
      noRandomLogo: true,
      noCredentialPersistence: true,
    },
  };
  await writeJson(manifestPath, manifest);

  return {
    id: generationId,
    status: generationStatus,
    repo: responseRepo(repo.owner, repo.repo),
    artifactRoot,
    briefPath,
    manifestPath,
    primaryIdentityAsset: storedPrimaryAsset,
    modelConfig,
    stages,
    modelCalls,
    brief,
    visualDirection,
    localizedCopy,
    outputs,
  };
}
