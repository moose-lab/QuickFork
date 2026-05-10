import { mkdir, writeFile } from "node:fs/promises";
import { basename, extname, join } from "node:path";

import type { BrandAsset, GitHubRepoMetadata, ReadmeContext, RepoReference, StoredReferenceAsset } from "./types.js";

function extensionFromUrl(url: string, fallback = ".png") {
  try {
    const parsed = new URL(url);
    const ext = extname(parsed.pathname);
    return ext || fallback;
  } catch {
    return fallback;
  }
}

function mimeFromExtension(ext: string) {
  switch (ext.toLowerCase()) {
    case ".svg":
      return "image/svg+xml";
    case ".jpg":
    case ".jpeg":
      return "image/jpeg";
    case ".webp":
      return "image/webp";
    case ".ico":
      return "image/x-icon";
    default:
      return "image/png";
  }
}

function safeName(value: string) {
  return value.toLowerCase().replace(/[^a-z0-9-]+/g, "-").replace(/^-|-$/g, "");
}

export function resolveBrandAssets(repo: RepoReference, metadata: GitHubRepoMetadata, readme: ReadmeContext): { primaryAsset: BrandAsset; candidates: BrandAsset[] } {
  const imageCandidates: BrandAsset[] = readme.extracted.referencedImages
    .filter((image) => image.kind === "logo" || image.kind === "banner" || image.kind === "hero")
    .map((image) => {
      const type: BrandAsset["type"] = image.kind === "logo" ? "logo" : image.kind === "banner" ? "banner" : "hero";
      return {
        type,
        url: image.absoluteUrl,
        source: "readme_image",
        path: image.src,
        confidence: image.kind === "logo" ? "high" : "medium",
        reason: `README references this image as ${image.kind}.`,
      };
    });

  const officialLogo = imageCandidates.find((asset) => asset.type === "logo");
  const fallbackAvatar: BrandAsset = {
    type: "avatar",
    url: metadata.owner.avatarUrl || `https://github.com/${repo.owner}.png`,
    source: "github_avatar",
    confidence: "fallback",
    reason: "No official logo was found in repo files, README images, or verified homepage assets.",
  };

  return {
    primaryAsset: officialLogo ?? fallbackAvatar,
    candidates: officialLogo ? imageCandidates : [...imageCandidates, fallbackAvatar],
  };
}

export async function storeReferenceAsset(projectAssetDir: string, repo: RepoReference, asset: BrandAsset): Promise<StoredReferenceAsset> {
  await mkdir(projectAssetDir, { recursive: true });
  const ext = extensionFromUrl(asset.url);
  const repoSlug = safeName(repo.repo);
  const ownerSlug = safeName(repo.owner);
  const fileName =
    asset.type === "avatar"
      ? `${ownerSlug}-github-avatar${ext}`
      : asset.type === "logo"
        ? `${repoSlug}-logo${ext}`
        : `${repoSlug}-${asset.type}${ext}`;
  const localPath = join(projectAssetDir, fileName);
  const body = `Mock saved reference asset\nsource=${asset.url}\ntype=${asset.type}\n`;
  await writeFile(localPath, body, "utf8");

  return {
    ...asset,
    localPath,
    fileName: basename(localPath),
    mimeType: mimeFromExtension(ext),
    sizeBytes: Buffer.byteLength(body),
  };
}
