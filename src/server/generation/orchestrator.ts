import { mkdir, writeFile } from "node:fs/promises";
import { join } from "node:path";

import { resolveBrandAssets, storeReferenceAsset } from "./assets.js";
import { generateMockImage } from "./image-generator.js";
import { createMockLlmAdapter, resolveGenerationModelConfig } from "./llm.js";
import { buildImagePrompt } from "./prompt.js";
import { inspectMarketingCard } from "./quality.js";
import { parseGitHubRepositoryUrl } from "./repo.js";
import { resolveRepositorySource } from "./repository-source.js";
import type { CreateGenerationInput, GenerationResponse, LocaleCode } from "./types.js";
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

async function writeJson(path: string, value: unknown) {
  await writeFile(path, `${JSON.stringify(value, null, 2)}\n`, "utf8");
}

export async function runProjectLaunchGeneration(input: CreateGenerationInput): Promise<GenerationResponse> {
  const repo = parseGitHubRepositoryUrl(input.repoUrl);
  const locales = input.locales?.length ? input.locales : DEFAULT_LOCALES;
  const provider = input.provider ?? "mock";
  const preset = input.preset ?? "github-readme";
  const imageQuality = input.imageQuality ?? "high";
  const modelConfig = resolveGenerationModelConfig(input.models);
  const llm = createMockLlmAdapter({ model: modelConfig.llm });

  if (provider !== "mock") {
    throw new GenerationError("VALIDATION_ERROR", "Only the mock image generation provider is supported in this backend MVP.");
  }

  const repositorySource = await resolveRepositorySource(repo, input);
  const { metadata, readmeMarkdown } = repositorySource;
  const readme = await llm.readRepositoryContext({ repo, metadata, readmeMarkdown });
  const { primaryAsset } = resolveBrandAssets(repo, metadata, readme);

  const artifactRoot = join(input.outputRoot ?? "output/project-launch", projectSlug(repo.owner, repo.repo));
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
  const { brief, visualDirection, layout, localizedCopy } = plan;

  const briefPath = join(artifactRoot, "project_brief_curated.json");
  await writeJson(briefPath, brief);

  const outputs = {} as GenerationResponse["outputs"];
  const qualityReports: Record<string, unknown> = {};

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
    const generated = await generateMockImage(localeDir, locale, prompt);
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
      qualityReportPath,
    };
  }

  const generationId = `gen_${repo.owner}_${repo.repo}_${Date.now()}`.replace(/[^a-zA-Z0-9_]/g, "_");
  const manifestPath = join(artifactRoot, "manifest.json");
  const manifest = {
    id: generationId,
    status: "completed",
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
    status: "completed",
    repo: responseRepo(repo.owner, repo.repo),
    artifactRoot,
    briefPath,
    manifestPath,
    primaryIdentityAsset: storedPrimaryAsset,
    modelConfig,
    brief,
    visualDirection,
    localizedCopy,
    outputs,
  };
}
