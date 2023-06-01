import type { LoaderArgs } from "@remix-run/cloudflare";
import { drizzle } from "drizzle-orm/d1";

export const registerDbClient = (context: LoaderArgs["context"]) => {
  const db = drizzle(context.DB as D1Database);
  return db;
};
