// Applies every sql/*.sql file in order. Each file is idempotent, so running
// this twice is harmless:  node --env-file=.env.local scripts/migrate.mjs
import { readFileSync, readdirSync } from "node:fs";
import postgres from "postgres";

// --production-build: run by the Vercel build (vercel.json). Production only:
// previews share the live database, so they never change its schema.
if (process.argv.includes("--production-build")) {
  if (process.env.VERCEL_ENV !== "production") { console.log("migrations skipped: not a production build"); process.exit(0); }
  process.env.DATABASE_URL = process.env.DATABASE_URL_UNPOOLED ?? process.env.DATABASE_URL;
}
const url = process.env.DATABASE_URL;
if (!url) throw new Error("DATABASE_URL is not set");
const sql = postgres(url, { ssl: /localhost|127\.0\.0\.1/.test(url) ? false : "require", max: 1, onnotice: () => {} });
for (const f of readdirSync("sql").filter((f) => f.endsWith(".sql")).sort()) {
  // one transaction per file: a failing file leaves nothing half-applied
  await sql.begin((tx) => tx.unsafe(readFileSync(`sql/${f}`, "utf8")));
  console.log("applied", f);
}
await sql.end();
