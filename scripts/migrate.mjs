// Applies every sql/*.sql file in order. Each file is idempotent, so running
// this twice is harmless:  node --env-file=.env.local scripts/migrate.mjs
import { readFileSync, readdirSync } from "node:fs";
import postgres from "postgres";

const url = process.env.DATABASE_URL;
if (!url) throw new Error("DATABASE_URL is not set");
const sql = postgres(url, { ssl: /localhost|127\.0\.0\.1/.test(url) ? false : "require", max: 1 });
for (const f of readdirSync("sql").filter((f) => f.endsWith(".sql")).sort()) {
  await sql.unsafe(readFileSync(`sql/${f}`, "utf8"));
  console.log("applied", f);
}
await sql.end();
