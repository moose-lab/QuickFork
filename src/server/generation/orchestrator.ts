import { mkdir, writeFile } from "node:fs/promises";
import { join } from "node:path";

import { resolveBrandAssets, storeReferenceAsset } from "./assets.js";
import { buildProjectBrief } from "./brief.js";
import { buildLayoutSpec, buildLocalizedCopies } from "./copy.js";
import { generateMockImage } from "./image-generator.js";
import { buildImagePrompt } from "./prompt.js";
import { inspectMarketingCard } from "./quality.js";
import { buildDefaultMetadata, parseGitHubRepositoryUrl } from "./repo.js";
import { extractReadmeContext } from "./readme.js";
import { selectVisualDirection } from "./visual.js";
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

  if (provider !== "mock") {
    throw new GenerationError("VALIDATION_ERROR", "Only the mock image generation provider is supported in this backend MVP.");
  }

  const metadata = buildDefaultMetadata(repo, input.mock?.repoMetadata);
  const readmeMarkdown =
    input.mock?.readmeMarkdown ??
    [
      `# ${metadata.name}`,
      "",
      metadata.description ?? `${metadata.name} is an open-source project.`,
      "",
      "- Source-backed benchmark callout",
      "- Architecture-level differentiator",
      "- Repeatable open-source workflow",
    ].join("\n");
  const readme = extractReadmeContext(readmeMarkdown, repo, metadata);
  const { primaryAsset } = resolveBrandAssets(repo, metadata, readme);

  const artifactRoot = join(input.outputRoot ?? "output/project-launch", projectSlug(repo.owner, repo.repo));
  const assetsDir = join(artifactRoot, "assets");
  await mkdir(artifactRoot, { recursive: true });
  const storedPrimaryAsset = await storeReferenceAsset(assetsDir, repo, primaryAsset);

  const brief = buildProjectBrief(metadata, readme);
  const visualDirection = selectVisualDirection(metadata, brief);
  const layout = buildLayoutSpec(metadata, brief, storedPrimaryAsset);
  const localizedCopy = buildLocalizedCopies(metadata, brief);

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
      image: "gpt-image-2",
      provider,
      quality: imageQuality,
      preset,
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
    brief,
    visualDirection,
    localizedCopy,
    outputs,
  };
}
