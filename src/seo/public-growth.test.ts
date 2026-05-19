import { readFileSync } from "node:fs";
import { join } from "node:path";

import { describe, expect, it } from "vitest";

import { sitemapMarketingLinks } from "../marketing/link-catalog";
import { renderLlmsTxt, renderSitemapXml } from "./seo-assets";

function readProjectFile(path: string) {
  return readFileSync(join(process.cwd(), path), "utf8");
}

describe("public growth infrastructure", () => {
  it("publishes crawler directives with the canonical sitemap", () => {
    const robots = readProjectFile("public/robots.txt");

    expect(robots).toContain("User-agent: *");
    expect(robots).toContain("Allow: /");
    expect(robots).toContain("Sitemap: https://seekersai.com/sitemap.xml");
  });

  it("publishes a canonical sitemap for the production domain", () => {
    const sitemap = readProjectFile("public/sitemap.xml");

    expect(sitemap).toContain("<loc>https://seekersai.com/</loc>");
    expect(sitemap).not.toContain("quickfork-oavdz7vn6");
    expect(sitemap).toBe(renderSitemapXml());

    for (const link of sitemapMarketingLinks) {
      expect(sitemap).toContain(`<loc>${link.canonicalUrl}</loc>`);
    }
    expect(sitemap).not.toContain("utm_");
    expect(sitemap).not.toContain("/contact?intent=");
  });

  it("publishes machine-readable AI context for crawlers and agents", () => {
    const llms = readProjectFile("public/llms.txt");

    expect(llms).toContain("# QuickFork");
    expect(llms).toContain("https://seekersai.com/");
    expect(llms).toContain("GitHub repository");
    expect(llms).toBe(renderLlmsTxt());
    expect(llms).toContain("https://seekersai.com/product/github-repo-to-launch-package");
    expect(llms).toContain("https://seekersai.com/resources/github-project-marketing-card-guide");
    expect(llms).toContain("https://seekersai.com/compare/chatgpt-open-source-launch-copy");
    expect(llms).toContain("https://seekersai.com/examples/qwenlm-flashqla-launch-card");
  });

  it("sets homepage metadata for canonical public discovery", () => {
    const index = readProjectFile("index.html");

    expect(index).toContain("<title>QuickFork - GitHub Repository to Launch-Ready Marketing Assets</title>");
    expect(index).toContain('<link rel="canonical" href="https://seekersai.com/" />');
    expect(index).toMatch(/<meta\s+name="description"/);
    expect(index).toContain('<meta property="og:url" content="https://seekersai.com/" />');
    expect(index).toContain('"@type": "SoftwareApplication"');
  });

  it("documents the production GA4 environment variable", () => {
    const envExample = readProjectFile(".env.example");

    expect(envExample).toContain("VITE_GA_MEASUREMENT_ID=");
  });

  it("rewrites semantic marketing routes to the client shell for direct crawler visits", () => {
    const vercelConfig = JSON.parse(readProjectFile("vercel.json")) as {
      rewrites: Array<{ source: string; destination: string }>;
    };

    expect(vercelConfig.rewrites).toEqual(
      expect.arrayContaining([
        { source: "/product/:path*", destination: "/index.html" },
        { source: "/use-cases/:path*", destination: "/index.html" },
        { source: "/resources/:path*", destination: "/index.html" },
        { source: "/compare/:path*", destination: "/index.html" },
        { source: "/examples/:path*", destination: "/index.html" },
        { source: "/tools/:path*", destination: "/index.html" },
        { source: "/templates/:path*", destination: "/index.html" },
      ]),
    );
  });
});
