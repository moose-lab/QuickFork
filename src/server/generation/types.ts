export type LocaleCode = "en" | "zh" | "ja";
export type GenerationProvider = "mock" | "wavespeed";
export type OutputPreset =
  | "1:1"
  | "3:2"
  | "2:3"
  | "3:4"
  | "4:3"
  | "4:5"
  | "5:4"
  | "9:16"
  | "16:9"
  | "21:9";
export type ImageQuality = "low";

export interface GenerationModelConfig {
  llm: string;
  image: string;
}

export interface RepoReference {
  owner: string;
  repo: string;
  fullName: string;
  repoUrl: string;
}

export interface GitHubRepoMetadata {
  name: string;
  fullName: string;
  description: string | null;
  homepage: string | null;
  language: string | null;
  topics: string[];
  defaultBranch: string;
  stars: number;
  owner: {
    login: string;
    avatarUrl: string;
    htmlUrl: string;
    type: "User" | "Organization";
  };
  readmeDownloadUrl: string | null;
}

export interface ReadmeImageAsset {
  alt: string | null;
  src: string;
  absoluteUrl: string;
  kind: "logo" | "screenshot" | "diagram" | "badge" | "banner" | "hero" | "demo" | "unknown";
}

export interface ReadmeContext {
  sourceUrl: string;
  rawMarkdown: string;
  extracted: {
    positioning: string | null;
    oneLineValueProp: string | null;
    keyFeatures: string[];
    metrics: string[];
    supportedPlatforms: string[];
    exportFormats: string[];
    technicalArchitecture: string[];
    useCases: string[];
    officialLinks: string[];
    referencedImages: ReadmeImageAsset[];
  };
}

export interface BrandAsset {
  type: "logo" | "banner" | "hero" | "avatar" | "favicon";
  url: string;
  source: "repo_file" | "readme_image" | "homepage" | "github_avatar";
  path?: string;
  confidence: "high" | "medium" | "fallback";
  reason: string;
}

export interface StoredReferenceAsset extends BrandAsset {
  localPath: string;
  fileName: string;
  mimeType: string;
  sizeBytes: number;
}

export interface ProjectBrief {
  title: string;
  subtitle: string;
  metrics: string[];
  keyInsights: string[];
  workflowSteps: string[];
  sourceSignals: {
    repoDescription: string | null;
    homepage: string | null;
    primaryLanguage: string | null;
    topics: string[];
    readmeEvidence: string[];
  };
}

export interface VisualDirection {
  category:
    | "ai_kernel_infra"
    | "model_benchmark"
    | "design_tool"
    | "devtool"
    | "creative_tool"
    | "agent_tool"
    | "open_source_alternative"
    | "generic_open_source";
  mood: string[];
  palette: {
    background: string;
    text: string;
    accent: string;
    secondaryAccent?: string;
  };
  typography: string[];
  layout: string[];
  visualMotifs: string[];
  avoid: string[];
}

export interface MarketingCardLayoutSpec {
  identity: {
    logoOrAvatarPath: string;
    brandName: string;
    assetSource: "official_logo" | "github_avatar";
  };
  tags: string[];
  visualPanel: {
    type: "product_showcase" | "workflow_diagram" | "architecture_diagram" | "research_result" | "code_system";
    elements: string[];
  };
  githubStrip: {
    icon: "github";
    repoUrl: string;
  };
}

export interface LocalizedCardCopy {
  locale: LocaleCode;
  hook: string;
  subtitle: string;
  valueProposition: string;
  metricLabels: string[];
  featureBullets: string[];
  workflowLabels: string[];
  ctaOrStripText: string;
}

export interface ImagePromptResult {
  model: string;
  size: string;
  quality: ImageQuality;
  prompt: string;
  referencedAssets: StoredReferenceAsset[];
}

export interface GeneratedImageResult {
  provider: GenerationProvider;
  model: string;
  status: "completed" | "failed";
  imagePath: string;
  imageUrl?: string;
  promptPath: string;
  assetPaths: string[];
  warnings: string[];
}

export interface QualityCheck {
  id: string;
  label: string;
  status: "passed" | "warning" | "failed";
  evidence?: string;
}

export interface MarketingCardQualityReport {
  status: "passed" | "needs_revision" | "failed";
  checks: QualityCheck[];
  revisionPrompt?: string;
}

export interface RepoLaunchBriefChecklistItem {
  item: string;
  source: string;
}

export interface RepoLaunchBriefAngle {
  title: string;
  body: string;
  source: string;
}

export interface RepoLaunchBrief {
  summary: string;
  audienceHypothesis: string;
  readmeChecklist: RepoLaunchBriefChecklistItem[];
  launchAngles: RepoLaunchBriefAngle[];
  socialPost: string;
  deckOutline: string[];
  outreachDraft: string;
  visualExplainerPrompt: string;
  sourceReferences: string[];
}

export interface CreateGenerationInput {
  repoUrl: string;
  locales?: LocaleCode[];
  preset?: OutputPreset;
  provider?: GenerationProvider;
  imageQuality?: ImageQuality;
  models?: Partial<GenerationModelConfig>;
  outputRoot?: string;
  mock?: {
    repoMetadata?: Partial<GitHubRepoMetadata>;
    readmeMarkdown?: string;
  };
}

export interface GenerationOutputItem {
  promptPath: string;
  imagePath: string;
  imageUrl?: string;
  qualityReportPath: string;
  status?: "completed" | "failed";
  warnings?: string[];
}

export interface GenerationStage {
  id: "repo" | "readme" | "brief" | "prompt" | "image" | "quality" | "manifest";
  label: string;
  status: "completed" | "failed";
  model?: string;
  detail?: string;
}

export interface GenerationModelCall {
  provider: GenerationProvider | "github";
  model: string;
  endpoint?: string;
  purpose: "repository_source" | "readme_analysis" | "launch_plan" | "image_generation";
  status: "completed" | "failed" | "skipped";
}

export interface GenerationResponse {
  id: string;
  status: "completed" | "failed";
  repo: {
    owner: string;
    repo: string;
    full_name: string;
    repo_url: string;
  };
  artifactRoot: string;
  briefPath: string;
  manifestPath: string;
  primaryIdentityAsset: StoredReferenceAsset;
  modelConfig: GenerationModelConfig;
  stages: GenerationStage[];
  modelCalls: GenerationModelCall[];
  brief: ProjectBrief;
  launchBrief: RepoLaunchBrief;
  visualDirection: VisualDirection;
  localizedCopy: Record<LocaleCode, LocalizedCardCopy>;
  outputs: Record<LocaleCode, GenerationOutputItem>;
}

export class GenerationError extends Error {
  constructor(
    public code: "VALIDATION_ERROR" | "METHOD_NOT_ALLOWED" | "GENERATION_FAILED",
    message: string,
    public details?: unknown,
  ) {
    super(message);
    this.name = "GenerationError";
  }
}
