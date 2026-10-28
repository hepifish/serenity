// One-off start for the pricing manager: Booking.com's Standard Rate as read
// from the extranet on 2026-10-28, minus 10%, rounded to 5 RON. After this the
// admin page (/admin/prices) is the source of truth.
//   node --env-file=.env.local scripts/seed-rates.mjs
import { readFileSync } from "node:fs";
import postgres from "postgres";

const url = process.env.DATABASE_URL;
const sql = postgres(url, { ssl: /localhost|127\.0\.0\.1/.test(url) ? false : "require", max: 1 });
const direct = (p) => Math.round((p * 0.9) / 5) * 5;

// Booking's default price for dates it has no specific price for
const defaults = { "film-studio": 250, "gothic-chambers": 200, "art-station": 200 };
for (const [apartment, p] of Object.entries(defaults)) {
  await sql`insert into rates (apartment, base_price, weekend_price, min_nights, cleaning_fee)
            values (${apartment}, ${direct(p)}, null, 2, 175)
            on conflict (apartment) do nothing`;
}

const rows = JSON.parse(readFileSync("scripts/booking-prices-2026-10-28.json", "utf8"));
const slugs = ["film-studio", "gothic-chambers", "art-station"];
for (const [night, ...prices] of rows) {
  for (let i = 0; i < slugs.length; i++) {
    await sql`insert into rate_overrides (apartment, night, price) values (${slugs[i]}, ${night}, ${direct(prices[i])})
              on conflict do nothing`;
  }
}
console.log("seeded", rows.length, "nights x", slugs.length);
await sql.end();
