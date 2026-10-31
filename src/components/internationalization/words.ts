import type { Locale } from "./config"
import { getLocale } from "./locale"

// A page's own words in both languages (D-058), beside the code that shows them: `src/components/<place>/words.ts`
// (or .tsx where a sentence holds a link). The English is the source and the Kinyarwanda is typed against it, so a
// missing key fails the typecheck; a value can be a function for the words around a number.
//
//   const en = { title: "The bar", seats: (n: number) => `${n} stools` }
//   const rw: typeof en = { title: "Akabari", seats: (n) => `Intebe ${n}` }
//   export const words = { en, rw }
export type Words<T> = Record<Locale, T>

// The reader's words in a server component: `const t = await getWords(words)`
export async function getWords<T>(words: Words<T>): Promise<T> {
  return words[await getLocale()]
}

// The words a place's JSON carries (a point's what, where and size, a circuit's serves, a run's note) stay English in
// the JSON, which the render scripts read too; their Kinyarwanda lives beside it in words.ts, keyed by the row's id,
// and is laid over the row on /rw. A row with no entry keeps its English.
export type Overlay<T> = Record<string, Partial<T>>
export function overlay<T extends object>(rows: T[], over: Overlay<T> | undefined, key: (r: T) => string | undefined = (r) => (r as { id?: string }).id): T[] {
  if (!over) return rows
  return rows.map((r) => ({ ...r, ...over[key(r) ?? ""] }))
}
