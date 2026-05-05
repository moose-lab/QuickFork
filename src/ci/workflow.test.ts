import { readFileSync } from "node:fs";
import { resolve } from "node:path";

import { describe, expect, it } from "vitest";

const workflow = readFileSync(
  resolve(process.cwd(), ".github/workflows/ci.yml"),
  "utf8",
);
const vercelConfig = readFileSync(
  resolve(process.cwd(), "vercel.json"),
  "utf8",
);

describe("GitHub Actions CI/CD workflow", () => {
  it("verifies the app before deployment", () => {
    expect(workflow).toContain("npm ci");
    expect(workflow).toContain("npm test");
    expect(workflow).toContain("npm run build");
  });

  it("deploys production to Vercel from main after verification passes", () => {
    expect(workflow).toContain("deploy-production:");
    expect(workflow).toContain("needs: verify");
    expect(workflow).toContain("github.ref == 'refs/heads/main'");
    expect(workflow).toContain("environment: production");
    expect(workflow).toContain("vercel pull --yes --environment=production");
    expect(workflow).toContain("vercel build --prod");
    expect(workflow).toContain("vercel deploy --prebuilt --prod");
  });

  it("keeps Vercel credentials in GitHub Secrets", () => {
    expect(workflow).toContain("secrets.VERCEL_TOKEN");
    expect(workflow).toContain("secrets.VERCEL_ORG_ID");
    expect(workflow).toContain("secrets.VERCEL_PROJECT_ID");
    expect(workflow).not.toMatch(/VERCEL_TOKEN\s*=\s*["'][^"']+["']/);
  });

  it("uses GitHub Actions as the single production deployment trigger", () => {
    expect(vercelConfig).toContain('"git"');
    expect(vercelConfig).toContain('"deploymentEnabled": false');
  });
});
