export type LocaleCode = "en" | "zh" | "ja";

export interface RepoRef {
  owner: string;
  name: string;
  fullName: string;
  url: string;
}

export interface ModelSettings {
  copyModel: string;
  imageModel: string;
  imageQuality: "low" | "medium" | "high" | "auto";
  imageSize: string;
  apiMode: "offline" | "openai";
}

export interface AssetPreset {
  id: string;
  label: string;
  useCase: "README" | "PPT" | "Social";
  size: string;
  aspect: string;
  note: string;
}

export interface LaunchInput {
  repoUrl: string;
  projectName: string;
  sourceNotes: string;
  modelSettings: ModelSettings;
  narrativeOption?: NarrativeOptionId;
  assetPresetId?: string;
}

export type NarrativeOptionId = "performance" | "research" | "developer";

export interface NarrativeOption {
  id: NarrativeOptionId;
  label: string;
  description: string;
}

export interface LocaleOutput {
  code: LocaleCode;
  label: string;
  subtitle: string;
  metrics: string[];
  keyInsights: string[];
  workflowSteps: string[];
  copy: string;
  coverPrompt: string;
}

export interface LaunchPackage {
  repo: RepoRef;
  projectName: string;
  assetPreset: AssetPreset;
  modelSettings: ModelSettings;
  narrativeOption: NarrativeOption;
  locales: LocaleOutput[];
}

export const DEFAULT_MODEL_SETTINGS: ModelSettings = {
  copyModel: "gpt-5.5",
  imageModel: "gpt-image-2",
  imageQuality: "high",
  imageSize: "1536x1024",
  apiMode: "offline",
};

export const ASSET_PRESETS: AssetPreset[] = [
  {
    id: "github-readme",
    label: "GitHub README",
    useCase: "README",
    size: "1536x1024",
    aspect: "3:2",
    note: "Wide enough for repo landing sections while staying readable on GitHub.",
  },
  {
    id: "ppt-wide",
    label: "PowerPoint 16:9",
    useCase: "PPT",
    size: "1920x1080",
    aspect: "16:9",
    note: "Fits widescreen decks and product updates without manual cropping.",
  },
  {
    id: "x-linkedin-landscape",
    label: "X / LinkedIn landscape",
    useCase: "Social",
    size: "1600x900",
    aspect: "16:9",
    note: "Readable in social feeds, newsletters, and link previews.",
  },
  {
    id: "square-social",
    label: "Square social",
    useCase: "Social",
    size: "1200x1200",
    aspect: "1:1",
    note: "Compact square option for platform previews and reposts.",
  },
];

export const NARRATIVE_OPTIONS: NarrativeOption[] = [
  {
    id: "research",
    label: "Research launch",
    description: "Best for papers and model repos: problem, mechanism, benchmark, limitation.",
  },
  {
    id: "performance",
    label: "Performance story",
    description: "Best for kernels and systems projects: speed, memory, throughput, tradeoff.",
  },
  {
    id: "developer",
    label: "Developer adoption",
    description: "Best for libraries: why it matters, how it works, where to start.",
  },
];

const LOCALE_LABELS: Record<LocaleCode, string> = {
  en: "English",
  zh: "中文",
  ja: "日本語",
};

export function parseGitHubRepoUrl(url: string): RepoRef {
  const parsed = new URL(url.trim());
  if (parsed.hostname !== "github.com") {
    throw new Error("Expected a github.com repository URL.");
  }
  const [owner, rawName] = parsed.pathname.split("/").filter(Boolean);
  if (!owner || !rawName) {
    throw new Error("Expected a GitHub URL in the form https://github.com/owner/repo.");
  }
  const name = rawName.replace(/\.git$/, "");
  return {
    owner,
    name,
    fullName: `${owner}/${name}`,
    url: `https://github.com/${owner}/${name}`,
  };
}

export function validateModelSettings(settings: ModelSettings): { ok: boolean; errors: string[] } {
  const errors: string[] = [];
  if (!settings.copyModel.trim()) errors.push("Copy model is required.");
  if (!settings.imageModel.trim()) errors.push("Image model is required.");
  if (!/^\d+x\d+$/.test(settings.imageSize)) errors.push("Image size must use WIDTHxHEIGHT.");
  return { ok: errors.length === 0, errors };
}

function chooseMetrics(notes: string): string[] {
  const normalized = notes.replace(/\s+/g, " ");
  const metrics: string[] = [];
  if (/90[^.]{0,40}KV|KV[^.]{0,40}90/i.test(normalized)) {
    metrics.push("~90 KV-cache entries for 800 x 800 images");
  }
  if (/77\.2\s?%/.test(normalized)) {
    metrics.push("77.2% average score on selected benchmarks");
  }
  return metrics.length ? metrics : ["Source-backed benchmark callout", "Architecture-level differentiator"];
}

function baseContent(input: LaunchInput) {
  const projectName = input.projectName.trim() || "Untitled Project";
  return {
    projectName,
    metrics: chooseMetrics(input.sourceNotes),
    en: {
      subtitle: "Fast project overview, launch copy, and visual infographic",
      positioning: "Purpose-built for making important GitHub projects easier to understand, see, and share.",
      insights: [
        "Extract the repo's core technical mechanism.",
        "Convert the mechanism into aligned multilingual copy.",
        "Generate platform-ready infographic prompts and images.",
      ],
      steps: ["Analyze repository", "Write launch copy", "Generate infographic"],
      paragraphs: [
        `${projectName} becomes a compact launch package: project overview, copy, visual structure, image prompts, and export sizes for README files, decks, and social channels.`,
        "QuickFork keeps all languages structurally aligned so teams can compare, review, and distribute the same story across English, Chinese, and Japanese audiences.",
      ],
    },
    zh: {
      subtitle: "快速项目概览、发布文案与可视化信息图",
      positioning: "为让重要 GitHub 项目更快被理解、看见和扩散而设计。",
      insights: [
        "提取仓库的核心技术机制。",
        "转成结构一致的多语言发布文案。",
        "生成适配多平台的信息图提示词与图像。",
      ],
      steps: ["分析仓库", "撰写发布文案", "生成信息图"],
      paragraphs: [
        `${projectName} 会被整理成紧凑发布包：项目概要、文案、视觉结构、图像提示词，以及适配 README、PPT 和社交平台的导出尺寸。`,
        "QuickFork 让三种语言共享同一套信息结构，便于团队在英文、中文、日文之间对照审阅和统一分发。",
      ],
    },
    ja: {
      subtitle: "高速なプロジェクト概要、ローンチコピー、情報図",
      positioning: "重要な GitHub プロジェクトをより速く理解され、見つけられ、広がる形にするために設計。",
      insights: [
        "リポジトリの中核技術メカニズムを抽出する。",
        "構造をそろえた多言語ローンチコピーへ変換する。",
        "複数プラットフォーム向けの情報図プロンプトと画像を生成する。",
      ],
      steps: ["リポジトリを分析", "ローンチコピーを作成", "情報図を生成"],
      paragraphs: [
        `${projectName} は、プロジェクト概要、コピー、視覚構成、画像プロンプト、README・PPT・SNS 向けサイズを含むコンパクトなローンチパッケージになります。`,
        "QuickFork は英語・中国語・日本語で同じ情報構造を保つため、チームは同じストーリーを比較、レビュー、配布できます。",
      ],
    },
  };
}

function buildCopy(projectName: string, content: ReturnType<typeof baseContent>[LocaleCode], metrics: string[]) {
  return [
    `Introducing ${projectName}: ${content.subtitle}`,
    "",
    `⚡ ${metrics.join(" ")}`,
    `💻 ${content.positioning}`,
    "",
    "💡Key insights:",
    ...content.insights.map((insight, index) => `${index + 1}. ${insight}`),
    "",
    ...content.paragraphs,
  ].join("\n");
}

function buildCoverPrompt(repo: RepoRef, projectName: string, content: ReturnType<typeof baseContent>[LocaleCode], metrics: string[], preset: AssetPreset) {
  return [
    "Use case: infographic-diagram",
    `Asset type: ${preset.label} cover, ${preset.aspect} (${preset.size})`,
    `Primary request: Create a polished launch cover for GitHub project "${projectName}".`,
    "",
    "Style: clean white technical infographic, deep electric blue accent, faint perspective grid, crisp rounded rectangles, modern sans-serif type.",
    `Title text: "${projectName}"`,
    `Subtitle text: "${content.subtitle}"`,
    `Metrics/callouts: ${metrics.join("; ")}`,
    "Key insight feature rows:",
    ...content.insights.map((insight, index) => `Feature ${index + 1}: ${insight}`),
    "Workflow panel steps:",
    ...content.steps.map((step, index) => `Step ${index + 1}: ${step}`),
    `GitHub strip URL: github.com/${repo.fullName}`,
    "",
    "Composition: left column for title and three feature rows; right column for deep-blue three-step workflow panel; top token tiles for inputs; bottom tiles for outputs.",
    "Constraints: keep text legible, no unrelated logos, no watermark, no fake clutter.",
  ].join("\n");
}

export function buildLaunchPackage(input: LaunchInput): LaunchPackage {
  const repo = parseGitHubRepoUrl(input.repoUrl);
  const modelValidation = validateModelSettings(input.modelSettings);
  if (!modelValidation.ok) {
    throw new Error(modelValidation.errors.join(" "));
  }
  const preset = ASSET_PRESETS.find((item) => item.id === input.assetPresetId) ?? ASSET_PRESETS[0];
  const narrativeOption = NARRATIVE_OPTIONS.find((item) => item.id === input.narrativeOption) ?? NARRATIVE_OPTIONS[0];
  const content = baseContent(input);

  const locales = (["en", "zh", "ja"] as LocaleCode[]).map((code) => ({
    code,
    label: LOCALE_LABELS[code],
    subtitle: content[code].subtitle,
    metrics: content.metrics,
    keyInsights: content[code].insights,
    workflowSteps: content[code].steps,
    copy: buildCopy(content.projectName, content[code], content.metrics),
    coverPrompt: buildCoverPrompt(repo, content.projectName, content[code], content.metrics, preset),
  }));

  return {
    repo,
    projectName: content.projectName,
    assetPreset: preset,
    modelSettings: input.modelSettings,
    narrativeOption,
    locales,
  };
}
