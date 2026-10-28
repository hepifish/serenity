import postgres from "postgres";

// One pooled client per server instance. Neon wants TLS; local Docker does not.
const url = process.env.DATABASE_URL;

declare global {
  var __sql: postgres.Sql | undefined;
}

export const sql: postgres.Sql =
  globalThis.__sql ??
  postgres(url ?? "postgres://localhost/serenity", {
    ssl: url?.includes("localhost") || url?.includes("127.0.0.1") ? false : "require",
    max: 5,
    idle_timeout: 20,
    transform: { undefined: null },
  });

if (process.env.NODE_ENV !== "production") globalThis.__sql = sql;
