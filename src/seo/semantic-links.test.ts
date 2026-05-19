import { readFileSync } from "node:fs";
import { join } from "node:path";

import { describe, expect, it } from "vitest";

import {
  getDistributedMarketingUrl,
  getMarketingLinkBySlug,
  marketingLinks,
  sitemapMarketingLinks,
} from "../marketing/link-catalog";

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
});
