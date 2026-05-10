import type { GitHubRepoMetadata, RepoReference } from "./types.js";
import { GenerationError } from "./types.js";

export function parseGitHubRepositoryUrl(repoUrl: string): RepoReference {
  let parsed: URL;
  try {
    parsed = new URL(repoUrl.trim());
  } catch {
    throw new GenerationError("VALIDATION_ERROR", "repoUrl must be a valid URL.");
  }

  if (parsed.hostname !== "github.com") {
    throw new GenerationError("VALIDATION_ERROR", "repoUrl must be a github.com repository URL.");
  }

  const [owner, rawRepo] = parsed.pathname.split("/").filter(Boolean);
  if (!owner || !rawRepo) {
    throw new GenerationError("VALIDATION_ERROR", "repoUrl must include an owner and repository name.");
  }

  const repo = rawRepo.replace(/\.git$/, "");
  return {
    owner,
    repo,
    fullName: `${owner}/${repo}`,
    repoUrl: `https://github.com/${owner}/${repo}`,
  };
}

export function buildDefaultMetadata(repo: RepoReference, mock?: Partial<GitHubRepoMetadata>): GitHubRepoMetadata {
  return {
    name: mock?.name ?? repo.repo,
    fullName: mock?.fullName ?? repo.fullName,
    description: mock?.description ?? null,
    homepage: mock?.homepage ?? null,
    language: mock?.language ?? null,
    topics: mock?.topics ?? [],
    defaultBranch: mock?.defaultBranch ?? "main",
    stars: mock?.stars ?? 0,
    owner: {
      login: mock?.owner?.login ?? repo.owner,
      avatarUrl: mock?.owner?.avatarUrl ?? `https://github.com/${repo.owner}.png`,
      htmlUrl: mock?.owner?.htmlUrl ?? `https://github.com/${repo.owner}`,
      type: mock?.owner?.type ?? "Organization",
    },
    readmeDownloadUrl:
      mock?.readmeDownloadUrl ?? `https://raw.githubusercontent.com/${repo.owner}/${repo.repo}/${mock?.defaultBranch ?? "main"}/README.md`,
  };
}
