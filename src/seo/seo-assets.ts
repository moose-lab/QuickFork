import { sitemapMarketingLinks, type MarketingLink, type MarketingPageType } from "../marketing/link-catalog";
import {
  formatMarketingLabel,
  getMarketingPageDescription,
  getMarketingPageTitle,
  getMarketingPageTypeLabel,
} from "../marketing/page-content";

export const seoAssetLastModified = "2026-05-19";

interface SitemapEntry {
  loc: string;
  lastmod: string;
  changefreq: "weekly" | "monthly";
  priority: string;
}

const staticSitemapEntries: readonly SitemapEntry[] = [
  {
    loc: "https://seekersai.com/",
    lastmod: seoAssetLastModified,
    changefreq: "weekly",
    priority: "1.0",
  },
  {
    loc: "https://seekersai.com/llms.txt",
    lastmod: seoAssetLastModified,
    changefreq: "monthly",
    priority: "0.6",
  },
  {
    loc: "https://seekersai.com/pricing.md",
    lastmod: seoAssetLastModified,
    changefreq: "monthly",
    priority: "0.5",
  },
];

const llmsRouteGroups: Array<{ title: string; pageTypes: MarketingPageType[] }> = [
  { title: "Product Pages", pageTypes: ["product"] },
  { title: "Use Cases", pageTypes: ["use_case"] },
  { title: "Resources", pageTypes: ["resource", "tool", "template"] },
  { title: "Comparisons", pageTypes: ["compare"] },
  { title: "Examples", pageTypes: ["example"] },
];

export function getSitemapEntries() {
  const marketingEntries = sitemapMarketingLinks.map((link) => ({
    loc: link.canonicalUrl,
    lastmod: seoAssetLastModified,
    changefreq: "monthly" as const,
    priority: getMarketingPagePriority(link),
  }));

  return [staticSitemapEntries[0], ...marketingEntries, ...staticSitemapEntries.slice(1)];
}

export function renderSitemapXml() {
  const entries = getSitemapEntries()
    .map(
      (entry) => `  <url>
    <loc>${escapeXml(entry.loc)}</loc>
    <lastmod>${entry.lastmod}</lastmod>
    <changefreq>${entry.changefreq}</changefreq>
    <priority>${entry.priority}</priority>
  </url>`,
    )
    .join("\n");

  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${entries}
</urlset>
`;
}

export function renderLlmsTxt() {
  return `# QuickFork

QuickFork turns a GitHub repository into a source-backed launch story and shareable marketing asset package.

## Canonical URL

https://seekersai.com/

## What QuickFork Does

- Accepts a public GitHub repository URL as the primary input.
- Extracts repository metadata, README evidence, topics, metrics, and identity assets.
- Builds a curated project brief for review before public publishing.
- Generates launch copy, image prompts, marketing-card imagery, quality reports, and artifact manifests.
- Supports English, Chinese, and Japanese launch-copy alignment.

## Best-Fit Users

- Open-source maintainers launching a project.
- Developer advocates preparing README, slide, and social assets.
- SaaS founders and indie hackers who need a credible public project story.
- Product marketers who need traceable claims from technical source material.

## Evidence Policy

QuickFork should use repository evidence, official project assets, README content, public metadata, or explicit user input. It should not invent customer numbers, benchmark claims, logos, or unsupported proof points.

## Public Route Inventory

${renderLlmsRouteGroups()}
## Public Resources

- Website: https://seekersai.com/
- Pricing context: https://seekersai.com/pricing.md
- Sitemap: https://seekersai.com/sitemap.xml
`;
}

function renderLlmsRouteGroups() {
  return llmsRouteGroups
    .map((group) => {
      const links = sitemapMarketingLinks.filter((link) => group.pageTypes.includes(link.pageType));
      if (links.length === 0) return "";

      return `### ${group.title}

${links.map(renderLlmsLink).join("\n")}
`;
    })
    .filter(Boolean)
    .join("\n");
}

function renderLlmsLink(link: MarketingLink) {
  return `- ${getMarketingPageTitle(link)}: ${link.canonicalUrl} - ${getMarketingPageTypeLabel(link)}, ${formatMarketingLabel(
    link.buyerStage,
  )}. ${getMarketingPageDescription(link)}`;
}

function getMarketingPagePriority(link: MarketingLink) {
  switch (link.pageType) {
    case "product":
      return "0.8";
    case "use_case":
      return "0.8";
    case "resource":
      return "0.7";
    case "tool":
      return "0.7";
    case "template":
      return "0.6";
    case "example":
      return "0.6";
    case "compare":
      return "0.7";
    case "contact":
      return "0.4";
  }
}

function escapeXml(value: string) {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}
