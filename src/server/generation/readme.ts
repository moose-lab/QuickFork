import type { GitHubRepoMetadata, ReadmeContext, ReadmeImageAsset, RepoReference } from "./types.js";

function toTitleCase(value: string) {
  return value
    .replace(/[-_]+/g, " ")
    .replace(/\b\w/g, (char) => char.toUpperCase())
    .trim();
}

function withoutMarkdown(value: string) {
  return value
    .replace(/!\[[^\]]*]\([^)]+\)/g, "")
    .replace(/\[[^\]]+]\(([^)]+)\)/g, "$1")
    .replace(/[*_`>#]/g, "")
    .trim();
}

function listItems(markdown: string) {
  return markdown
    .split("\n")
    .map((line) => line.trim())
    .filter((line) => /^[-*]\s+/.test(line) || /^\d+\.\s+/.test(line))
    .map((line) => withoutMarkdown(line.replace(/^[-*]\s+/, "").replace(/^\d+\.\s+/, "")))
    .filter(Boolean);
}

function classifyImage(src: string, alt: string | null): ReadmeImageAsset["kind"] {
  const signal = `${src} ${alt ?? ""}`.toLowerCase();
  if (signal.includes("shields.io") || signal.includes("badge")) return "badge";
  if (signal.includes("logo")) return "logo";
  if (signal.includes("banner") || signal.includes("cover")) return "banner";
  if (signal.includes("hero")) return "hero";
  if (signal.includes("screenshot")) return "screenshot";
  if (signal.includes("diagram") || signal.includes("architecture")) return "diagram";
  if (signal.includes("demo")) return "demo";
  return "unknown";
}

function absoluteReadmeAssetUrl(src: string, repo: RepoReference, branch: string) {
  if (/^https?:\/\//i.test(src)) return src;
  const normalized = src.replace(/^\.\//, "");
  return `https://raw.githubusercontent.com/${repo.owner}/${repo.repo}/${branch}/${normalized}`;
}

export function extractReadmeContext(markdown: string, repo: RepoReference, metadata: GitHubRepoMetadata): ReadmeContext {
  const cleanLines = markdown
    .split("\n")
    .map((line) => withoutMarkdown(line))
    .filter(Boolean);
  const firstParagraph = cleanLines.find((line) => !/^#+\s*/.test(line) && !/^[-*]\s+/.test(line)) ?? null;
  const items = listItems(markdown);
  const metrics = items.filter((item) => /\d/.test(item)).slice(0, 4);
  const keyFeatures = items.filter((item) => !/\d/.test(item)).slice(0, 3);
  const workflowItems = items.filter((item) => /brief|agent|preview|export|build|deploy|generate/i.test(item)).slice(0, 3);

  const referencedImages = [...markdown.matchAll(/!\[([^\]]*)]\(([^)]+)\)/g)].map((match) => {
    const alt = match[1]?.trim() || null;
    const src = match[2].trim();
    return {
      alt,
      src,
      absoluteUrl: absoluteReadmeAssetUrl(src, repo, metadata.defaultBranch),
      kind: classifyImage(src, alt),
    };
  });

  const officialLinks = [...markdown.matchAll(/\[[^\]]+]\((https?:\/\/[^)]+)\)/g)].map((match) => match[1]).filter(Boolean);
  if (metadata.homepage) officialLinks.unshift(metadata.homepage);

  return {
    sourceUrl: metadata.readmeDownloadUrl ?? `https://raw.githubusercontent.com/${repo.owner}/${repo.repo}/${metadata.defaultBranch}/README.md`,
    rawMarkdown: markdown,
    extracted: {
      positioning: metadata.description ?? firstParagraph,
      oneLineValueProp: firstParagraph ?? metadata.description ?? toTitleCase(repo.repo),
      keyFeatures,
      metrics,
      supportedPlatforms: items.filter((item) => /mac|windows|linux|browser|local|cloud/i.test(item)).slice(0, 4),
      exportFormats: items.filter((item) => /html|pdf|pptx|mp4|png|jpg|svg|export/i.test(item)).slice(0, 4),
      technicalArchitecture: items.filter((item) => /agent|cli|api|sdk|sandbox|workflow|architecture/i.test(item)).slice(0, 4),
      useCases: workflowItems,
      officialLinks: [...new Set(officialLinks)],
      referencedImages,
    },
  };
}
