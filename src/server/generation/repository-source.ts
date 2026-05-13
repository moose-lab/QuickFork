import { buildDefaultMetadata } from "./repo.js";
import type { CreateGenerationInput, GitHubRepoMetadata, RepoReference } from "./types.js";
import { GenerationError } from "./types.js";

interface RepositorySourceResult {
  metadata: GitHubRepoMetadata;
  readmeMarkdown: string;
  source: "mock" | "github" | "fallback";
  warnings: string[];
}

function fallbackReadme(metadata: GitHubRepoMetadata) {
  return [
    `# ${metadata.name}`,
    "",
    metadata.description ?? `${metadata.name} is an open-source project.`,
    "",
    "- Source-backed benchmark callout",
    "- Architecture-level differentiator",
    "- Repeatable open-source workflow",
  ].join("\n");
}

function githubHeaders() {
  const headers: Record<string, string> = {
    Accept: "application/vnd.github+json",
    "User-Agent": "QuickFork-Project-Launch-Generator",
  };
  if (process.env.GITHUB_TOKEN) headers.Authorization = `Bearer ${process.env.GITHUB_TOKEN}`;
  return headers;
}

function assertObject(value: unknown): asserts value is Record<string, unknown> {
  if (!value || typeof value !== "object") {
    throw new GenerationError("GENERATION_FAILED", "GitHub returned an invalid response shape.");
  }
}

function textValue(value: unknown, fallback = "") {
  return typeof value === "string" ? value : fallback;
}

function nullableText(value: unknown) {
  return typeof value === "string" && value.trim() ? value : null;
}

function topicList(value: unknown) {
  return Array.isArray(value) ? value.filter((item): item is string => typeof item === "string") : [];
}

function numberValue(value: unknown) {
  return typeof value === "number" && Number.isFinite(value) ? value : 0;
}

function normalizeGitHubMetadata(repo: RepoReference, value: unknown): GitHubRepoMetadata {
  assertObject(value);
  const owner = value.owner;
  assertObject(owner);
  const defaultBranch = textValue(value.default_branch, "main");

  return {
    name: textValue(value.name, repo.repo),
    fullName: textValue(value.full_name, repo.fullName),
    description: nullableText(value.description),
    homepage: nullableText(value.homepage),
    language: nullableText(value.language),
    topics: topicList(value.topics),
    defaultBranch,
    stars: numberValue(value.stargazers_count),
    owner: {
      login: textValue(owner.login, repo.owner),
      avatarUrl: textValue(owner.avatar_url, `https://github.com/${repo.owner}.png`),
      htmlUrl: textValue(owner.html_url, `https://github.com/${repo.owner}`),
      type: owner.type === "User" ? "User" : "Organization",
    },
    readmeDownloadUrl: `https://raw.githubusercontent.com/${repo.owner}/${repo.repo}/${defaultBranch}/README.md`,
  };
}

async function fetchJson(url: string): Promise<unknown> {
  const response = await fetch(url, { headers: githubHeaders() });
  if (!response.ok) {
    throw new GenerationError("GENERATION_FAILED", `GitHub request failed with ${response.status}.`);
  }
  return response.json();
}

async function fetchText(url: string): Promise<string> {
  const response = await fetch(url, { headers: githubHeaders() });
  if (!response.ok) {
    throw new GenerationError("GENERATION_FAILED", `README request failed with ${response.status}.`);
  }
  return response.text();
}

export async function fetchGitHubRepoMetadata(repo: RepoReference): Promise<GitHubRepoMetadata> {
  const value = await fetchJson(`https://api.github.com/repos/${repo.owner}/${repo.repo}`);
  return normalizeGitHubMetadata(repo, value);
}

export async function fetchRepositoryReadme(metadata: GitHubRepoMetadata): Promise<string> {
  if (!metadata.readmeDownloadUrl) {
    return fallbackReadme(metadata);
  }
  return fetchText(metadata.readmeDownloadUrl);
}

export async function resolveRepositorySource(repo: RepoReference, input: CreateGenerationInput): Promise<RepositorySourceResult> {
  if (input.mock?.repoMetadata || input.mock?.readmeMarkdown) {
    const metadata = buildDefaultMetadata(repo, input.mock.repoMetadata);
    return {
      metadata,
      readmeMarkdown: input.mock.readmeMarkdown ?? fallbackReadme(metadata),
      source: "mock",
      warnings: [],
    };
  }

  try {
    const metadata = await fetchGitHubRepoMetadata(repo);
    return {
      metadata,
      readmeMarkdown: await fetchRepositoryReadme(metadata),
      source: "github",
      warnings: [],
    };
  } catch (error) {
    const metadata = buildDefaultMetadata(repo);
    return {
      metadata,
      readmeMarkdown: fallbackReadme(metadata),
      source: "fallback",
      warnings: [error instanceof Error ? error.message : "GitHub source lookup failed."],
    };
  }
}
