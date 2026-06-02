import { readFileSync } from "node:fs";
import { join } from "node:path";

import { describe, expect, it } from "vitest";

import {
  getDistributedMarketingUrl,
  getMarketingLinkByPath,
  getMarketingLinkBySlug,
  marketingLinks,
  marketingPageLinks,
  sitemapMarketingLinks,
} from "../marketing/link-catalog";
import { getMarketingPageDescription, getMarketingPageHeadline, getMarketingPageTitle } from "../marketing/page-content";

const inventoryPath = "docs/marketing/data/semantic-link-inventory.csv";
const requiredHeaders = [
  "status",
  "funnel_stage",
  "buyer_stage",
  "persona",
  "intent_cluster",
  "page_type",
  "slug",
  "canonical_url",
  "primary_keyword",
  "primary_cta",
  "utm_source",
  "utm_medium",
  "utm_campaign",
  "utm_content",
  "crm_campaign",
  "distributed_url",
] as const;

function parseInventory() {
  const source = readFileSync(join(process.cwd(), inventoryPath), "utf8").trim();
  const [headerLine, ...lines] = source.split(/\r?\n/);
  const headers = headerLine.split(",");
  const rows = lines.map((line) => {
    const values = line.split(",");
    return Object.fromEntries(headers.map((header, index) => [header, values[index] ?? ""]));
  });

  return { headers, rows };
}

describe("semantic marketing link inventory", () => {
  it("contains the required columns and first-batch links", () => {
    const { headers, rows } = parseInventory();

    expect(headers).toEqual([...requiredHeaders]);
    expect(rows.length).toBeGreaterThanOrEqual(16);
    expect(rows.map((row) => row.canonical_url)).toContain(
      "https://seekersai.com/resources/github-project-marketing-card-guide",
    );
    expect(rows.map((row) => row.canonical_url)).toContain(
      "https://seekersai.com/product/github-repo-to-launch-deck",
    );
    expect(rows.map((row) => row.canonical_url)).toContain(
      "https://seekersai.com/product/github-repo-to-product-outreach",
    );
    expect(rows.map((row) => row.canonical_url)).toContain(
      "https://seekersai.com/compare/chatgpt-open-source-launch-copy",
    );
  });

  it("keeps canonical URLs clean and distributed URLs attribution-ready", () => {
    const { rows } = parseInventory();
    const canonicalUrls = new Set<string>();
    const crmCampaignByUtmCampaign = new Map<string, string>();

    for (const row of rows) {
      const canonicalUrl = new URL(row.canonical_url);
      const distributedUrl = new URL(row.distributed_url);

      expect(["draft", "ready", "published"]).toContain(row.status);
      expect(["top", "middle", "bottom"]).toContain(row.funnel_stage);
      expect(["awareness", "consideration", "decision", "implementation"]).toContain(row.buyer_stage);
      expect(canonicalUrl.hostname).toBe("seekersai.com");
      expect(distributedUrl.hostname).toBe("seekersai.com");
      expect(canonicalUrl.searchParams.has("utm_source")).toBe(false);
      expect(canonicalUrl.searchParams.has("utm_medium")).toBe(false);
      expect(canonicalUrl.searchParams.has("utm_campaign")).toBe(false);
      expect(canonicalUrl.searchParams.has("utm_content")).toBe(false);
      expect(distributedUrl.origin + distributedUrl.pathname).toBe(canonicalUrl.origin + canonicalUrl.pathname);
      expect(distributedUrl.searchParams.get("utm_source")).toBe(row.utm_source);
      expect(distributedUrl.searchParams.get("utm_medium")).toBe(row.utm_medium);
      expect(distributedUrl.searchParams.get("utm_campaign")).toBe(row.utm_campaign);
      expect(distributedUrl.searchParams.get("utm_content")).toBe(row.utm_content);
      expect(row.utm_source).toMatch(/^[a-z0-9_-]+$/);
      expect(row.utm_medium).toMatch(/^[a-z0-9_-]+$/);
      expect(row.utm_campaign).toMatch(/^[a-z0-9_-]+$/);
      expect(row.utm_content).toMatch(/^[a-z0-9_-]+$/);
      expect(row.crm_campaign).toMatch(/^2026_q[1-4]_[a-z0-9_]+$/);
      expect(canonicalUrls.has(row.canonical_url)).toBe(false);
      canonicalUrls.add(row.canonical_url);

      const existingCrmCampaign = crmCampaignByUtmCampaign.get(row.utm_campaign);
      if (existingCrmCampaign) {
        expect(row.crm_campaign).toBe(existingCrmCampaign);
      } else {
        crmCampaignByUtmCampaign.set(row.utm_campaign, row.crm_campaign);
      }
    }
  });
});

describe("typed semantic marketing link catalog", () => {
  it("mirrors the editable CSV inventory without duplicating derived UTM URLs", () => {
    const { rows } = parseInventory();

    expect(marketingLinks).toHaveLength(rows.length);

    for (const row of rows) {
      const link = getMarketingLinkBySlug(row.slug);

      expect(link).toBeDefined();
      expect(link).toEqual(
        expect.objectContaining({
          status: row.status,
          funnelStage: row.funnel_stage,
          buyerStage: row.buyer_stage,
          persona: row.persona,
          intentCluster: row.intent_cluster,
          pageType: row.page_type,
          slug: row.slug,
          canonicalUrl: row.canonical_url,
          primaryKeyword: row.primary_keyword,
          primaryCta: row.primary_cta,
          crmCampaign: row.crm_campaign,
          utm: {
            source: row.utm_source,
            medium: row.utm_medium,
            campaign: row.utm_campaign,
            content: row.utm_content,
          },
        }),
      );
      expect(getDistributedMarketingUrl(link!)).toBe(row.distributed_url);
    }
  });

  it("keeps sitemap output limited to published crawlable pages", () => {
    const sitemapCanonicalUrls = new Set<string>();
    const sitemapSlugs = new Set<string>();

    for (const link of sitemapMarketingLinks) {
      expect(link.status).toBe("published");
      expect(link.pageType).not.toBe("contact");
      expect(sitemapCanonicalUrls.has(link.canonicalUrl)).toBe(false);
      expect(sitemapSlugs.has(link.slug)).toBe(false);
      sitemapCanonicalUrls.add(link.canonicalUrl);
      sitemapSlugs.add(link.slug);
    }
  });

  it("has typed, valid catalog fields for page generation and CRM attribution", () => {
    const slugs = new Set<string>();
    const canonicalUrls = new Set<string>();

    for (const link of marketingLinks) {
      expect(["draft", "ready", "published"]).toContain(link.status);
      expect(["top", "middle", "bottom"]).toContain(link.funnelStage);
      expect(["awareness", "consideration", "decision", "implementation"]).toContain(link.buyerStage);
      expect(["product", "use_case", "resource", "tool", "template", "example", "compare", "contact"]).toContain(
        link.pageType,
      );
      expect(link.intentCluster).toMatch(/^[a-z0-9_]+$/);
      expect(link.primaryCta).toMatch(/^[a-z0-9_]+$/);
      expect(link.crmCampaign).toBe(`2026_q2_${link.utm.campaign}`);
      expect(slugs.has(link.slug)).toBe(false);
      expect(canonicalUrls.has(link.canonicalUrl)).toBe(false);
      slugs.add(link.slug);
      canonicalUrls.add(link.canonicalUrl);
    }
  });

  it("provides unique page-shell metadata for every crawlable page family", () => {
    const requiredPageTypes = new Set(["product", "use_case", "resource", "tool", "template", "example", "compare"]);
    const actualPageTypes = new Set(marketingPageLinks.map((link) => link.pageType));
    const titles = new Set<string>();
    const descriptions = new Set<string>();
    const headlines = new Set<string>();

    for (const pageType of requiredPageTypes) {
      expect(actualPageTypes.has(pageType)).toBe(true);
    }

    for (const link of marketingPageLinks) {
      const title = getMarketingPageTitle(link);
      const description = getMarketingPageDescription(link);
      const headline = getMarketingPageHeadline(link);

      expect(title).toContain("QuickFork");
      expect(title).toContain(toTitleCase(link.primaryKeyword));
      expect(description).toContain("QuickFork");
      expect(description.toLowerCase()).toContain(link.primaryKeyword.toLowerCase());
      expect(headline).toContain(toTitleCase(link.primaryKeyword));
      expect(`${title} ${description} ${headline}`).not.toMatch(/\b(#1|customers|revenue|cheapest|guaranteed)\b/i);
      expect(titles.has(title)).toBe(false);
      expect(descriptions.has(description)).toBe(false);
      expect(headlines.has(headline)).toBe(false);
      titles.add(title);
      descriptions.add(description);
      headlines.add(headline);
    }
  });

  it("matches canonical page paths from the catalog", () => {
    const link = getMarketingLinkByPath("/resources/github-project-marketing-card-guide");

    expect(link?.slug).toBe("github-project-marketing-card-guide");
    expect(getMarketingLinkByPath("/use-cases/ai-project-launch")?.slug).toBe("ai-project-launch");
    expect(getMarketingLinkByPath("/product/source-backed-launch-assets")).toEqual(
      expect.objectContaining({
        intentCluster: "source_backed_launch_assets",
        primaryKeyword: "source backed launch assets",
      }),
    );
    expect(getMarketingLinkByPath("/product/cold-start-launch-materials")).toEqual(
      expect.objectContaining({
        intentCluster: "cold_start_launch_materials",
        primaryKeyword: "cold start launch materials",
        primaryCta: "generate_launch_card",
      }),
    );
    expect(getMarketingLinkByPath("/product/github-repo-launch-materials-map")).toEqual(
      expect.objectContaining({
        intentCluster: "github_repo_launch_materials_map",
        primaryKeyword: "github repo launch materials map",
      }),
    );
    expect(getMarketingLinkByPath("/product/readme-marketing-cards")).toEqual(
      expect.objectContaining({
        intentCluster: "readme_marketing_cards",
        primaryKeyword: "readme marketing cards",
      }),
    );
    expect(getMarketingLinkByPath("/product/github-repo-to-launch-deck")).toEqual(
      expect.objectContaining({
        intentCluster: "github_repo_to_launch_deck",
        primaryKeyword: "github repository pitch deck generator",
      }),
    );
    expect(getMarketingLinkByPath("/product/github-repo-to-product-outreach")).toEqual(
      expect.objectContaining({
        intentCluster: "github_repo_product_outreach",
        primaryKeyword: "github repo product outreach",
      }),
    );
    expect(getMarketingLinkByPath("/contact")).toBeUndefined();
  });

  it("publishes a source-backed launch assets product page contract", () => {
    const link = getMarketingLinkByPath("/product/source-backed-launch-assets");

    expect(link).toBeDefined();
    expect(getMarketingPageTitle(link!)).toContain("Source Backed Launch Assets");
    expect(getMarketingPageHeadline(link!)).toContain("Source Backed Launch Assets");
    expect(getMarketingPageDescription(link!)).toContain(
      "reviewable README, social, deck, outreach, and visual materials",
    );
    expect(getMarketingPageDescription(link!)).not.toMatch(/guaranteed|rankings|revenue|customers|viral/i);
  });

  it("publishes a cold-start launch materials product hub contract", () => {
    const link = getMarketingLinkByPath("/product/cold-start-launch-materials");

    expect(link).toBeDefined();
    expect(getMarketingPageTitle(link!)).toContain("Cold Start Launch Materials");
    expect(getMarketingPageHeadline(link!)).toContain("Cold Start Launch Materials");
    expect(getMarketingPageDescription(link!)).toContain("README, social, deck, visual, and outreach drafts");
    expect(getMarketingPageDescription(link!)).not.toMatch(/guaranteed|rankings|revenue|customers|viral/i);
  });

  it("publishes a GitHub repo launch materials map product page contract", () => {
    const link = getMarketingLinkByPath("/product/github-repo-launch-materials-map");

    expect(link).toBeDefined();
    expect(getMarketingPageTitle(link!)).toContain("GitHub Repo Launch Materials Map");
    expect(getMarketingPageHeadline(link!)).toContain("GitHub Repo Launch Materials Map");
    expect(getMarketingPageDescription(link!)).toContain("source-backed channel plan");
    expect(getMarketingPageDescription(link!)).not.toMatch(/guaranteed|rankings|revenue|customers|viral/i);
  });

  it("publishes a README marketing cards product page contract", () => {
    const link = getMarketingLinkByPath("/product/readme-marketing-cards");

    expect(link).toBeDefined();
    expect(getMarketingPageTitle(link!)).toContain("README Marketing Cards");
    expect(getMarketingPageHeadline(link!)).toContain("README Marketing Cards");
    expect(getMarketingPageDescription(link!)).toContain("README-first hero cards");
    expect(getMarketingPageDescription(link!)).not.toMatch(/guaranteed|rankings|revenue|customers|viral/i);
  });

  it("publishes a source-backed repo-to-deck brief page contract", () => {
    const link = getMarketingLinkByPath("/product/github-repo-to-launch-deck");

    expect(link).toBeDefined();
    expect(getMarketingPageTitle(link!)).toContain("GitHub Repository Pitch Deck Generator");
    expect(getMarketingPageHeadline(link!)).toContain("GitHub Repository Pitch Deck Generator");
    expect(getMarketingPageDescription(link!)).toContain("deck-ready launch brief");
    expect(getMarketingPageDescription(link!)).not.toMatch(/funding|guaranteed|rankings|revenue/i);
  });

  it("publishes a source-backed repo product outreach page contract", () => {
    const link = getMarketingLinkByPath("/product/github-repo-to-product-outreach");

    expect(link).toBeDefined();
    expect(getMarketingPageTitle(link!)).toContain("GitHub Repo Product Outreach");
    expect(getMarketingPageHeadline(link!)).toContain("GitHub Repo Product Outreach");
    expect(getMarketingPageDescription(link!)).toContain("source-backed outreach brief");
    expect(getMarketingPageDescription(link!)).not.toMatch(
      /spam|scraped|guaranteed|revenue|reply rate|deliverability/i,
    );
  });
});

function toTitleCase(value: string) {
  return value
    .replace(/\b\w/g, (character) => character.toUpperCase())
    .replace(/\bGithub\b/g, "GitHub")
    .replace(/\bAi\b/g, "AI")
    .replace(/\bChatgpt\b/g, "ChatGPT")
    .replace(/\bDevrel\b/g, "DevRel")
    .replace(/\bReadme\b/g, "README")
    .replace(/\bQwenlm\b/g, "QwenLM")
    .replace(/\bFlashqla\b/g, "FlashQLA")
    .replace(/\bDeepseek\b/g, "DeepSeek")
    .replace(/\bTwvp\b/g, "TWVP")
    .replace(/\bCanva\b/g, "Canva");
}
