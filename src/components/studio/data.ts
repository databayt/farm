import { readFileSync } from "node:fs"
import { join } from "node:path"

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
