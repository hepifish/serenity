// Pink Panther's starting prices: Booking.com Standard Rate read 2026-10-28,
// minus 10%, rounded to 5 RON. Afterwards /admin/prices is the source of truth.
//   node --env-file=.env.local scripts/seed-pink.mjs
import postgres from "postgres";

const url = process.env.DATABASE_URL;
const sql = postgres(url, { ssl: /localhost|127\.0\.0\.1/.test(url) ? false : "require", max: 1 });
const direct = (p) => Math.round((p * 0.9) / 5) * 5;
const A = "pink-panther";

// December and later fall back to Booking's December base of 350.
await sql`insert into rates (apartment, base_price, weekend_price, min_nights, cleaning_fee)
          values (${A}, ${direct(350)}, ${direct(420)}, 2, 150) on conflict (apartment) do nothing`;

const nights = {};
for (let d = new Date("2026-10-28T00:00:00Z"); d <= new Date("2026-11-26T00:00:00Z"); d.setUTCDate(d.getUTCDate() + 1)) nights[d.toISOString().slice(0, 10)] = 160;
Object.assign(nights, {
  "2026-11-27": 200, "2026-11-28": 550, "2026-11-29": 550, "2026-11-30": 550, "2026-12-01": 550,
  "2026-12-24": 500, "2026-12-25": 500,
});
for (const [night, p] of Object.entries(nights)) {
  await sql`insert into rate_overrides (apartment, night, price) values (${A}, ${night}, ${direct(p)}) on conflict do nothing`;
}
console.log("seeded pink-panther", Object.keys(nights).length, "custom nights");
await sql.end();
