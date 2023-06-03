import { migrate } from "drizzle-orm/libsql/migrator";
import { db } from "~/services/db.server";

(async function main() {
  await migrate(db, {
    migrationsFolder: "./app/db/migrations",
  });
})();
