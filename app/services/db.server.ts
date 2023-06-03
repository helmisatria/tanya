import { drizzle } from "drizzle-orm/libsql";
import { createClient } from "@libsql/client";

import invariant from "tiny-invariant";
import { config } from "dotenv";

config();

invariant(process.env.DATABASE_URL, "Missing DATABASE_URL");
invariant(process.env.TURSO_DB_TOKEN, "Missing TURSO_DB_TOKEN");

const client = createClient({
  url: process.env.DATABASE_URL as string,
  authToken: process.env.TURSO_DB_TOKEN as string,
});

export const db = drizzle(client);
