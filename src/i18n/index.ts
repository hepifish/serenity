import type { Locale } from "./config";
import en, { type Dict } from "./en";
import ro from "./ro";
import de from "./de";

const DICTS: Record<Locale, Dict> = { en, ro, de };
export const getDict = (l: Locale): Dict => DICTS[l];
export type { Dict };
