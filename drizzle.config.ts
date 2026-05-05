import { defineConfig } from "drizzle-kit";

const databaseUrl = process.env.DATABASE_URL;

if (!databaseUrl && process.env.npm_lifecycle_event === "db:migrate") {
  throw new Error("DATABASE_URL is required before running Drizzle migrations.");
}

export default defineConfig({
  schema: "./src/server/db/schema.ts",
  out: "./drizzle",
  dialect: "postgresql",
  dbCredentials: {
    url: databaseUrl ?? "postgresql://quickfork:quickfork@localhost:5432/quickfork",
  },
});
