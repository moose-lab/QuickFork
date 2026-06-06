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
    expect(sitemap).toContain("<loc>https://seekersai.com/help</loc>");
    expect(sitemap).toContain("<loc>https://seekersai.com/privacy</loc>");
    expect(sitemap).toContain("<loc>https://seekersai.com/terms</loc>");
    expect(sitemap).not.toContain("quickfork-oavdz7vn6");
    expect(sitemap).toBe(renderSitemapXml());

    for (const link of sitemapMarketingLinks) {
      expect(sitemap).toContain(`<loc>${link.canonicalUrl}</loc>`);
    }
    expect(sitemap).toContain("<loc>https://seekersai.com/product/cold-start-launch-materials</loc>");
    expect(sitemap).toContain("<loc>https://seekersai.com/product/github-repo-launch-materials-map</loc>");
    expect(sitemap).toContain("<loc>https://seekersai.com/product/github-repo-visual-explainer</loc>");
    expect(sitemap).toContain("<loc>https://seekersai.com/product/github-repo-to-launch-deck</loc>");
    expect(sitemap).toContain("<loc>https://seekersai.com/product/github-repo-to-product-outreach</loc>");
    expect(sitemap).toContain("<loc>https://seekersai.com/product/repository-launch-package-pilot</loc>");
    expect(sitemap).toContain("<loc>https://seekersai.com/use-cases/ai-project-launch</loc>");
    expect(sitemap).toContain("<loc>https://seekersai.com/resources/github-repo-launch-demand-map</loc>");
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
    expect(llms).toContain("https://seekersai.com/product/source-backed-launch-assets");
    expect(llms).toContain("Source Backed Launch Assets");
    expect(llms).toContain(
      "reviewable README, social, deck, outreach, and visual materials generated from repository evidence",
    );
    expect(llms).toContain("https://seekersai.com/product/cold-start-launch-materials");
    expect(llms).toContain("Cold Start Launch Materials");
    expect(llms).toContain(
      "source-backed README, social, deck, visual, and outreach drafts generated from one public GitHub repository URL",
    );
    expect(llms).toContain("https://seekersai.com/product/github-repo-launch-materials-map");
    expect(llms).toContain("GitHub Repo Launch Materials Map");
    expect(llms).toContain(
      "source-backed channel plan for README, social, deck, visual, and outreach assets from one repository URL",
    );
    expect(llms).toContain("https://seekersai.com/product/readme-marketing-cards");
    expect(llms).toContain("README Marketing Cards");
    expect(llms).toContain(
      "README-first hero cards, GitHub social preview direction, and launch visuals grounded in repository evidence",
    );
    expect(llms).toContain("https://seekersai.com/product/github-repo-visual-explainer");
    expect(llms).toContain("GitHub Repo Visual Explainer");
    expect(llms).toContain(
      "source-backed story maps, README hero cards, GitHub social previews, and deck-ready visual launch assets",
    );
    expect(llms).toContain("https://seekersai.com/product/github-repo-to-launch-deck");
    expect(llms).toContain("GitHub Repository Pitch Deck Generator");
    expect(llms).toContain(
      "deck-ready launch brief, slide outline, Product Hunt story, and outreach narrative from repository evidence",
    );
    expect(llms).toContain("https://seekersai.com/product/github-repo-to-product-outreach");
    expect(llms).toContain("GitHub Repo Product Outreach");
    expect(llms).toContain(
      "source-backed outreach brief, launch email sequence, community post angle, partner note, and human review checklist from repository evidence",
    );
    expect(llms).toContain("https://seekersai.com/product/repository-launch-package-pilot");
    expect(llms).toContain("Repository Launch Package Pilot");
    expect(llms).toContain(
      "full launch package pilot for README, social, deck, outreach, visual explainer, review, and measurement work",
    );
    expect(llms).toContain("https://seekersai.com/use-cases/ai-project-launch");
    expect(llms).toContain("AI project launch");
    expect(llms).toContain("https://seekersai.com/resources/open-source-launch-checklist");
    expect(llms).toContain("Open Source Launch Checklist");
    expect(llms).toContain("source-backed README, social preview, Product Hunt, deck, outreach, and post-launch learning");
    expect(llms).toContain("https://seekersai.com/resources/github-repo-launch-demand-map");
    expect(llms).toContain("GitHub Repo Launch Demand");
    expect(llms).toContain("https://seekersai.com/tools/github-repo-launch-readiness-score");
    expect(llms).toContain("GitHub Repo Launch Readiness Score");
    expect(llms).toContain(
      "100-point source-backed readiness score for README trust, repository preview, audience feedback, launch assets, and follow-up measurement",
    );
    expect(llms).toContain("https://seekersai.com/resources/github-project-marketing-card-guide");
    expect(llms).toContain("https://seekersai.com/compare/chatgpt-open-source-launch-copy");
    expect(llms).toContain("https://seekersai.com/examples/qwenlm-flashqla-launch-card");
    expect(llms).toContain(
      "source-backed launch package example with target-user discovery, story map, README, social, deck, and outreach outputs",
    );
    expect(llms).toContain("https://seekersai.com/help");
    expect(llms).toContain("https://seekersai.com/privacy");
    expect(llms).toContain("https://seekersai.com/terms");
  });

  it("sets homepage metadata for canonical public discovery", () => {
    const index = readProjectFile("index.html");

    expect(index).toContain(
      "<title>QuickFork - Repo-to-Social Launch Assets for Developer Cold Starts</title>",
    );
    expect(index).toContain('<link rel="canonical" href="https://seekersai.com/" />');
    expect(index).toContain(
      'content="QuickFork turns a public GitHub repository into source-backed launch assets: infographic, README hero, X/LinkedIn copy, square card, and reviewable proof for developer cold starts."',
    );
    expect(index).toContain(
      '<meta property="og:title" content="QuickFork - Repo-to-Social Launch Assets for Developer Cold Starts" />',
    );
    expect(index).toContain(
      '<meta name="twitter:title" content="QuickFork - Repo-to-Social Launch Assets for Developer Cold Starts" />',
    );
    expect(index).toContain('<meta property="og:url" content="https://seekersai.com/" />');
    expect(index).toContain('"@type": "SoftwareApplication"');
    expect(index).toContain('"@type": "FAQPage"');
    expect(index).not.toContain("Launch-Ready Marketing Assets");
    expect(index).not.toContain("marketing card");
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
        { source: "/contact", destination: "/index.html" },
        { source: "/help", destination: "/index.html" },
        { source: "/privacy", destination: "/index.html" },
        { source: "/terms", destination: "/index.html" },
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
