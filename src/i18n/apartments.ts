import type { Locale } from "./config";
import type { ApartmentCopy, ApartmentSlug } from "@/lib/apartments";
import en from "./apartments-en";
import ro from "./apartments-ro";
import de from "./apartments-de";

const COPY: Record<Locale, Record<ApartmentSlug, ApartmentCopy>> = { en, ro, de };
export const apartmentCopy = (l: Locale, s: ApartmentSlug) => COPY[l][s];
