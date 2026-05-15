import { readFileSync } from "node:fs";
import { join } from "node:path";

import { describe, expect, it } from "vitest";

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
  });

  it("publishes machine-readable AI context for crawlers and agents", () => {
    const llms = readProjectFile("public/llms.txt");

    expect(llms).toContain("# QuickFork");
    expect(llms).toContain("https://seekersai.com/");
    expect(llms).toContain("GitHub repository");
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
});
