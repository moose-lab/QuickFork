import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";

describe("vite local API routes", () => {
  it("registers the generations API on the Vite dev server", () => {
    const config = readFileSync("vite.config.ts", "utf8");

    expect(config).toContain("quickfork-local-api-routes");
    expect(config).toContain("loadEnv(mode, process.cwd(), \"\")");
    expect(config).toContain("Object.assign(process.env");
    expect(config).toContain('server.middlewares.use("/api/generations"');
    expect(config).toContain("generationsHandler(req, res)");
  });
});
