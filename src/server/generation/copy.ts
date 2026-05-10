import type { GitHubRepoMetadata, LocaleCode, LocalizedCardCopy, MarketingCardLayoutSpec, ProjectBrief, StoredReferenceAsset } from "./types.js";

function repoUrlText(metadata: GitHubRepoMetadata) {
  return `github.com/${metadata.fullName}`;
}

function firstSentence(value: string) {
  return value.split(/[.!?。！？]\s*/)[0]?.trim() || value;
}

export function buildLayoutSpec(metadata: GitHubRepoMetadata, brief: ProjectBrief, primaryAsset: StoredReferenceAsset): MarketingCardLayoutSpec {
  return {
    identity: {
      logoOrAvatarPath: primaryAsset.localPath,
      brandName: brief.title,
      assetSource: primaryAsset.source === "github_avatar" ? "github_avatar" : "official_logo",
    },
    tags: [metadata.topics[0] ?? "Open Source", metadata.language ?? "Project", primaryAsset.source === "github_avatar" ? "GitHub Avatar" : "Official Brand"].slice(0, 3),
    visualPanel: {
      type: metadata.topics.some((topic) => /design|creative|artifact/i.test(topic)) ? "product_showcase" : "workflow_diagram",
      elements: ["floating artifact cards", "workflow preview", "export chips"],
    },
    githubStrip: {
      icon: "github",
      repoUrl: repoUrlText(metadata),
    },
  };
}

export function buildEnglishMasterCopy(metadata: GitHubRepoMetadata, brief: ProjectBrief): LocalizedCardCopy {
  const isDesign = [metadata.name, metadata.description ?? "", ...metadata.topics].join(" ").toLowerCase().includes("design");
  return {
    locale: "en",
    hook: isDesign ? "Design with the agent already on your laptop." : `${brief.title} turns repo context into a launch-ready story.`,
    subtitle: firstSentence(brief.subtitle),
    valueProposition: isDesign ? "Your existing coding agents become the design engine." : brief.keyInsights[0] ?? firstSentence(brief.subtitle),
    metricLabels: brief.metrics.slice(0, 4),
    featureBullets: brief.keyInsights.slice(0, 3),
    workflowLabels: brief.workflowSteps.slice(0, 3),
    ctaOrStripText: repoUrlText(metadata),
  };
}

const zhStatic = {
  designHook: "用你电脑里的 agent 开始设计。",
  genericHook: "把仓库内容变成可发布的项目故事。",
  designValue: "把现有 coding agents 变成你的设计引擎。",
};

const jaStatic = {
  designHook: "手元の agent で、そのままデザインする。",
  genericHook: "リポジトリの文脈を公開向けストーリーに変える。",
  designValue: "既存の coding agents をデザインエンジンに変える。",
};

function localizeMetric(metric: string, locale: LocaleCode) {
  if (locale === "en") return metric;
  if (locale === "zh") {
    return metric
      .replace("coding-agent CLIs", "个 agent CLI")
      .replace("composable Skills", "个可组合 Skills")
      .replace("brand-grade Design Systems", "套品牌级设计系统")
      .replace("export", "导出");
  }
  return metric
    .replace("coding-agent CLIs", "個の agent CLI")
    .replace("composable Skills", "個の composable Skills")
    .replace("brand-grade Design Systems", "種の brand-grade Design Systems")
    .replace("export", "export");
}

export function buildLocalizedCopies(metadata: GitHubRepoMetadata, brief: ProjectBrief): Record<LocaleCode, LocalizedCardCopy> {
  const en = buildEnglishMasterCopy(metadata, brief);
  const isDesign = en.hook.toLowerCase().includes("design");
  const zh: LocalizedCardCopy = {
    locale: "zh",
    hook: isDesign ? zhStatic.designHook : zhStatic.genericHook,
    subtitle: en.subtitle.includes("Claude Design") ? "开源 Claude Design 替代方案。" : `${brief.title} 项目营销名片。`,
    valueProposition: isDesign ? zhStatic.designValue : "压缩项目事实、真实素材和可传播文案。",
    metricLabels: en.metricLabels.map((metric) => localizeMetric(metric, "zh")),
    featureBullets: en.featureBullets.map((feature, index) => {
      const fallbacks = ["运行本地优先的设计循环", "自带模型密钥与服务商选择", "从可复用工作流导出高质量产物"];
      return isDesign ? fallbacks[index] ?? feature : feature;
    }),
    workflowLabels: ["选择 brief 方向", "让 agent 构建设计", "预览并导出"].slice(0, en.workflowLabels.length),
    ctaOrStripText: en.ctaOrStripText,
  };
  const ja: LocalizedCardCopy = {
    locale: "ja",
    hook: isDesign ? jaStatic.designHook : jaStatic.genericHook,
    subtitle: en.subtitle.includes("Claude Design") ? "オープンソースの Claude Design 代替。" : `${brief.title} のマーケティングカード。`,
    valueProposition: isDesign ? jaStatic.designValue : "プロジェクト事実、実素材、伝わるコピーを圧縮する。",
    metricLabels: en.metricLabels.map((metric) => localizeMetric(metric, "ja")),
    featureBullets: en.featureBullets.map((feature, index) => {
      const fallbacks = ["ローカルファーストなデザインループ", "自分のモデルキーとプロバイダーを利用", "再利用可能なワークフローから成果物を出力"];
      return isDesign ? fallbacks[index] ?? feature : feature;
    }),
    workflowLabels: ["brief の方向を選ぶ", "agent が成果物を作成", "プレビューしてエクスポート"].slice(0, en.workflowLabels.length),
    ctaOrStripText: en.ctaOrStripText,
  };

  return { en, zh, ja };
}
