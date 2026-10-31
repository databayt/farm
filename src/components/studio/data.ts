import { readFileSync } from "node:fs"
import { join } from "node:path"

import type { Locale } from "@/components/internationalization/config"
import { words } from "@/components/studio/words"

// The studio generator's outputs (public/designs/studio, scripts/studio), read on the server by /en/studio and by
// the studio's docs pages alike.

export { frw, rwf } from "@/lib/format"
export const D = "/designs/studio"
export const mm = (n: number) => n.toLocaleString("en-US")
export const degC = (s = "") => s.replace(/(\d) C\b/g, "$1 °C").replace(/(\d)-(\d)/g, "$1–$2")

// The generator's CSVs: plain commas, quotes only around fields that hold one.
export function readCsv(file: string): Record<string, string>[] {
  const [head, ...lines] = readFileSync(join(process.cwd(), "public/designs/studio/data", file), "utf8").trim().split("\n")
  const cells = (line: string) => [...line.matchAll(/("[^"]*"|[^,]*)(,|$)/g)].slice(0, -1).map((m) => m[1].replace(/^"|"$/g, ""))
  const keys = cells(head)
  return lines.map((l) => Object.fromEntries(cells(l).map((v, i) => [keys[i], v])))
}

// The same CSV in the reader's language: the words the page and the docs show (a point's or a fitting's description,
// a circuit's serves, a run's note) with their Kinyarwanda laid over them by row key (words.tsx `json`). Keys, models,
// items and numbers stay as the generator wrote them, so lookups by them still work; /en gets readCsv's rows as they are.
export function studioCsv(file: string, lang: Locale): Record<string, string>[] {
  const rows = readCsv(file)
  if (lang === "en") return rows
  const j = words[lang].json
  const over: Record<string, (r: Record<string, string>) => Record<string, string | undefined>> = {
    "points.csv": (r) => ({ description: j.points[r.point] }),
    "circuits.csv": (r) => ({ serves: j.circuits[r.circuit] }),
    "fittings.csv": (r) => ({ ...j.fittings[r.point] }),
    "pipes.csv": (r) => ({ note: j.pipes[r.run] }),
  }
  const f = over[file]
  if (!f) return rows
  return rows.map((r) => {
    const o = Object.fromEntries(Object.entries(f(r)).filter(([, v]) => v !== undefined)) as Record<string, string>
    return { ...r, ...o }
  })
}

// A BOM line's words in the reader's language, by its English (an electrical line named after its point takes that
// point's words); null where the Kinyarwanda has none, so the caller keeps its own English
export function bomItem(item: string, lang: Locale): string | null {
  if (lang === "en") return null
  const j = words[lang].json
  if (j.bom[item]) return j.bom[item]
  const point = readCsv("points.csv").find((p) => p.description === item)
  return point ? j.points[point.point] ?? null : null
}
