import type { Config } from "drizzle-kit";
 
export default {
  schema: "./app/db/db-schema.ts",
  out: "./app/db/migrations",
  breakpoints: true,
} satisfies Config;