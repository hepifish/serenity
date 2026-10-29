import type { ApartmentSlug } from "./apartments";

/** Each apartment's accent colour, on its own so client code (marks, loader) does not pull in the catalogue. */
export const ACCENTS: Record<ApartmentSlug, string> = {
  "film-studio": "#D9A93B",
  "gothic-chambers": "#8F6BB0",
  "art-station": "#C8312C",
  "pink-panther": "#E39AB4",
};
