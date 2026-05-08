import { neon } from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/neon-http";
import type { NeonHttpDatabase } from "drizzle-orm/neon-http";

import * as schema from "./schema.js";

type QuickForkDatabase = NeonHttpDatabase<typeof schema>;

let cachedDb: QuickForkDatabase | null = null;

function createDb() {
  const databaseUrl = process.env.DATABASE_URL;

  if (!databaseUrl) {
    throw new Error("DATABASE_URL is required for QuickFork authentication.");
  }

  const sql = neon(databaseUrl);
  return drizzle(sql, { schema });
}

export function getDb() {
  if (!cachedDb) {
    cachedDb = createDb();
  }

  return cachedDb;
}

export const db = new Proxy({} as QuickForkDatabase, {
  get(_target, property, receiver) {
    return Reflect.get(getDb(), property, receiver);
  },
});
