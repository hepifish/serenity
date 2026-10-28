// Share previews (Open Graph / Twitter): 1200×630 JPGs from the real photos.
// WhatsApp, Facebook and LinkedIn are unreliable with WebP and large files.
// Run after changing a hero photo: node scripts/og-images.mjs
import fs from "node:fs";
import path from "node:path";
import sharp from "sharp";

const W = 1200, H = 630, OUT = "public/og";
// The photo that stands for each apartment: the one behind its page title (pageHeroIndex in src/lib/apartments.ts).
const APARTMENTS = {
  "film-studio": { src: "public/images/film/Serenity2024-29.webp", at: "centre" },
  "gothic-chambers": { src: "public/images/gotic/Serenity2024-22.webp", at: "centre" },
  "art-station": { src: "public/images/art/Serenity2024-56.webp", at: "centre" },
  "pink-panther": { src: "public/images/pink/pink-10.webp", at: "left" },
};
// In the narrow home panels each photo shows what makes it itself: the posters, the vaults, the prints, the panther.
const PANELS = [
  { src: "public/images/film/Serenity2024-29.webp", at: "right" },
  { src: "public/images/gotic/Serenity2024-22.webp", at: "centre" },
  { src: "public/images/art/Serenity2024-56.webp", at: "left" },
  { src: "public/images/pink/pink-01.webp", at: "left" },
];

fs.mkdirSync(OUT, { recursive: true });
const jpg = (img) => img.jpeg({ quality: 80, mozjpeg: true });

for (const [slug, { src, at }] of Object.entries(APARTMENTS)) {
  await jpg(sharp(src).resize(W, H, { fit: "cover", position: at })).toFile(path.join(OUT, `${slug}.jpg`));
}

// Home: the four apartments side by side, like the hero's doors.
const GAP = 4, panel = Math.floor((W - GAP * 3) / 4);
const panels = await Promise.all(
  PANELS.map(({ src, at }) => sharp(src).resize(panel, H, { fit: "cover", position: at }).toBuffer()),
);
await jpg(
  sharp({ create: { width: W, height: H, channels: 3, background: "#0e0b10" } }).composite(
    panels.map((input, i) => ({ input, top: 0, left: i * (panel + GAP) + (i === 3 ? W - 4 * panel - 3 * GAP : 0) })),
  ),
).toFile(path.join(OUT, "home.jpg"));

for (const f of fs.readdirSync(OUT)) console.log(f, Math.round(fs.statSync(path.join(OUT, f)).size / 1024), "KB");
