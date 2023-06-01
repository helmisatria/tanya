import type { InferModel } from "drizzle-orm";
import { sqliteTable, text, integer, uniqueIndex } from "drizzle-orm/sqlite-core";

export const users = sqliteTable(
  "users",
  {
    id: integer("id").primaryKey(),
    email: text("email"),
    name: text("name"),
  },
  (table) => {
    return {
      emailIdx: uniqueIndex("email_idx").on(table.email),
    };
  }
);

export type User = InferModel<typeof users>; // return type when queried
