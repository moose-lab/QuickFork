import type { GitHubRepoMetadata, ProjectBrief, ReadmeContext } from "./types.js";

function titleCaseRepoName(name: string) {
  return name
    .replace(/[-_]+/g, " ")
    .replace(/\b\w/g, (char) => char.toUpperCase())
    .trim();
}

function fallbackMetrics(metadata: GitHubRepoMetadata) {
  const metrics: string[] = [];
  if (metadata.stars > 0) metrics.push(`${metadata.stars.toLocaleString("en-US")} GitHub stars`);
  if (metadata.language) metrics.push(`${metadata.language} primary language`);
  return metrics;
}

export function buildProjectBrief(metadata: GitHubRepoMetadata, readme: ReadmeContext): ProjectBrief {
  const metrics = readme.extracted.metrics.length ? readme.extracted.metrics.slice(0, 4) : fallbackMetrics(metadata).slice(0, 4);
  const keyInsights = readme.extracted.keyFeatures.length
    ? readme.extracted.keyFeatures.slice(0, 3)
    : [
        "Repository context is compressed into a shareable project story.",
        "Traceable assets keep generated visuals grounded in the real project.",
        "Repeatable layout slots support multilingual publishing.",
      ];
  const workflowSteps = readme.extracted.useCases.length >= 3 ? readme.extracted.useCases.slice(0, 3) : ["Brief + direction picker", "Agent builds artifact", "Preview + export"];

  return {
    title: titleCaseRepoName(metadata.name),
    subtitle: metadata.description ?? readme.extracted.oneLineValueProp ?? titleCaseRepoName(metadata.name),
    metrics,
    keyInsights,
    workflowSteps,
    sourceSignals: {
      repoDescription: metadata.description,
      homepage: metadata.homepage,
      primaryLanguage: metadata.language,
      topics: metadata.topics,
      readmeEvidence: [...metrics, ...keyInsights].map((item) => `README or repo metadata includes: ${item}`),
    },
  };
}
