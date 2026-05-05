import { existsSync, readFileSync } from "node:fs";
import { resolve } from "node:path";

import { describe, expect, it } from "vitest";

function readProjectFile(path: string) {
  const fullPath = resolve(process.cwd(), path);
  return existsSync(fullPath) ? readFileSync(fullPath, "utf8") : "";
}

const packageJson = JSON.parse(readProjectFile("package.json"));
const serverAuth = readProjectFile("src/server/auth.ts");
const authClient = readProjectFile("src/lib/auth-client.ts");
const authApi = readProjectFile("api/auth/[...all].ts");
const dbSchema = readProjectFile("src/server/db/schema.ts");
const drizzleConfig = readProjectFile("drizzle.config.ts");
const vercelConfig = readProjectFile("vercel.json");

describe("auth architecture", () => {
  it("uses Better Auth with Neon and Drizzle dependencies", () => {
    expect(packageJson.dependencies).toMatchObject({
      "@better-auth/drizzle-adapter": expect.any(String),
      "@neondatabase/serverless": expect.any(String),
      "better-auth": expect.any(String),
      "drizzle-orm": expect.any(String),
    });
    expect(packageJson.devDependencies).toMatchObject({
      "drizzle-kit": expect.any(String),
    });
    expect(packageJson.scripts).toMatchObject({
      "db:generate": expect.stringContaining("drizzle-kit generate"),
      "db:migrate": expect.stringContaining("drizzle-kit migrate"),
    });
  });

  it("defines Better Auth core tables in a Drizzle Postgres schema", () => {
    expect(dbSchema).toMatch(/pgTable\(\s*"user"/);
    expect(dbSchema).toMatch(/pgTable\(\s*"session"/);
    expect(dbSchema).toMatch(/pgTable\(\s*"account"/);
    expect(dbSchema).toMatch(/pgTable\(\s*"verification"/);
    expect(dbSchema).toContain('emailVerified: boolean("email_verified")');
    expect(dbSchema).toContain('token: text("token").notNull().unique()');
    expect(dbSchema).toContain('identifier: text("identifier").notNull()');
    expect(dbSchema).toContain('index("account_userId_idx")');
    expect(dbSchema).toContain('index("session_userId_idx")');
    expect(dbSchema).toContain('index("verification_identifier_idx")');
  });

  it("configures Better Auth for Drizzle, email OTP, and Google", () => {
    expect(serverAuth).toContain("betterAuth(");
    expect(serverAuth).toContain("drizzleAdapter");
    expect(serverAuth).toContain('provider: "pg"');
    expect(serverAuth).toContain("emailOTP(");
    expect(serverAuth).toContain("sendVerificationOTP");
    expect(serverAuth).toContain("socialProviders");
    expect(serverAuth).toContain("google");
    expect(serverAuth).toContain("GOOGLE_CLIENT_ID");
    expect(serverAuth).toContain("GOOGLE_CLIENT_SECRET");
  });

  it("mounts Better Auth under Vercel /api/auth/* functions", () => {
    expect(authApi).toContain("toNodeHandler(auth.handler)");
    expect(authApi).toContain("bodyParser: false");
  });

  it("exposes a React auth client with email OTP support", () => {
    expect(authClient).toContain('createAuthClient');
    expect(authClient).toContain('better-auth/react');
    expect(authClient).toContain('emailOTPClient');
  });

  it("routes Vite auth pages without intercepting auth API calls", () => {
    expect(vercelConfig).toContain('"source": "/sign-in"');
    expect(vercelConfig).toContain('"source": "/sign-up"');
    expect(vercelConfig).toContain('"destination": "/index.html"');
  });

  it("can generate Drizzle migrations for the auth schema", () => {
    expect(drizzleConfig).toContain("defineConfig");
    expect(drizzleConfig).toContain("src/server/db/schema.ts");
    expect(drizzleConfig).toContain("DATABASE_URL");
  });
});
