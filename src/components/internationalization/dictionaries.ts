import type { Locale } from "./config"
import en from "./en.json"
import rw from "./rw.json"

export type Dictionary = typeof en

// The shared words of the site (menu, headers, docs, notices). rw.json is typed against en.json, so a key missing
// from the Kinyarwanda fails the typecheck. A page's own copy lives beside it, in its words.ts (./words.ts).
const dictionaries: Record<Locale, Dictionary> = { en, rw }

export async function getDictionary(locale: Locale): Promise<Dictionary> {
  return dictionaries[locale]
}

// The same, synchronously, for code that is handed the language (a rail, a data reader) rather than awaiting it
export function dictionary(locale: Locale): Dictionary {
  return dictionaries[locale]
}
