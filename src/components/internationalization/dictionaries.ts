import type { Locale } from "./config"
import en from "./en.json"
import rw from "./rw.json"

export type Dictionary = typeof en

// The shared words of the site (menu, headers, docs, notices). rw.json is typed against en.json, so a key missing
// from the Kinyarwanda fails the typecheck. Page copy is not here yet: it stays in each place's JSON and in
// src/components/home/copy.ts, shown in English on /rw until its Kinyarwanda exists.
const dictionaries: Record<Locale, Dictionary> = { en, rw }

export async function getDictionary(locale: Locale): Promise<Dictionary> {
  return dictionaries[locale]
}
