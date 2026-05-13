import { buildProjectBrief } from "./brief.js";
import { buildLayoutSpec, buildLocalizedCopies } from "./copy.js";
import { extractReadmeContext } from "./readme.js";
import { selectVisualDirection } from "./visual.js";
import type {
  GitHubRepoMetadata,
  GenerationModelConfig,
  LocalizedCardCopy,
  MarketingCardLayoutSpec,
  ProjectBrief,
  ReadmeContext,
  RepoReference,
  StoredReferenceAsset,
  VisualDirection,
} from "./types.js";

export const DEFAULT_GENERATION_MODELS: GenerationModelConfig = {
  llm: "gpt-5.5",
  image: "gpt-image-2",
};

export interface BuildProjectLaunchPlanInput {
  repo: RepoReference;
  metadata: GitHubRepoMetadata;
  readmeMarkdown: string;
  primaryIdentityAsset: StoredReferenceAsset;
  readme?: ReadmeContext;
}

export interface ProjectLaunchPlan {
  model: string;
  readme: ReadmeContext;
  brief: ProjectBrief;
  visualDirection: VisualDirection;
  layout: MarketingCardLayoutSpec;
  localizedCopy: Record<"en" | "zh" | "ja", LocalizedCardCopy>;
}

export interface ProjectLaunchLlmAdapter {
  model: string;
  readRepositoryContext(input: {
    repo: RepoReference;
    metadata: GitHubRepoMetadata;
    readmeMarkdown: string;
  }): Promise<ReadmeContext>;
  buildProjectLaunchPlan(input: BuildProjectLaunchPlanInput): Promise<ProjectLaunchPlan>;
}

export function resolveGenerationModelConfig(models?: Partial<GenerationModelConfig>): GenerationModelConfig {
  return {
    llm: models?.llm?.trim() || DEFAULT_GENERATION_MODELS.llm,
    image: models?.image?.trim() || DEFAULT_GENERATION_MODELS.image,
  };
}

export function createMockLlmAdapter(config: { model?: string } = {}): ProjectLaunchLlmAdapter {
  const model = config.model?.trim() || DEFAULT_GENERATION_MODELS.llm;
  const readRepositoryContext: ProjectLaunchLlmAdapter["readRepositoryContext"] = async (input) =>
    extractReadmeContext(input.readmeMarkdown, input.repo, input.metadata);

  return {
    model,
    readRepositoryContext,
    async buildProjectLaunchPlan(input) {
      const readme =
        input.readme ??
        (await readRepositoryContext({
          repo: input.repo,
          metadata: input.metadata,
          readmeMarkdown: input.readmeMarkdown,
        }));
      const brief = buildProjectBrief(input.metadata, readme);
      const visualDirection = selectVisualDirection(input.metadata, brief);
      const layout = buildLayoutSpec(input.metadata, brief, input.primaryIdentityAsset);
      const localizedCopy = buildLocalizedCopies(input.metadata, brief);

      return {
        model,
        readme,
        brief,
        visualDirection,
        layout,
        localizedCopy,
      };
    },
  };
}
