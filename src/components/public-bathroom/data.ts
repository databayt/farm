import bath from "@/components/public-bathroom/public-bathroom.json"
import { words } from "@/components/public-bathroom/words"
import type { Locale } from "@/components/internationalization/config"
import { overlay } from "@/components/internationalization/words"

// The public bathroom's fittings and devices (public-bathroom.json `plumbing`, `electric`), read by
// /[lang]/public-bathroom (the tags) and by its docs pages (the points tables) alike, as
// src/components/studio/data.ts is the studio's. bathData(lang) lays the Kinyarwanda over the JSON's words (words.tsx).

export const D = "/designs/public-bathroom"
const { plumbing: PL, electric: EL } = bath

// a fitting's dot: the colour of its first run; a device's: its circuit's
const fitColour = (runs: string) => PL.colours[(PL.runs.find((r) => r.run === runs.split(" ")[0])?.system ?? "cold") as keyof typeof PL.colours]
const circuitColour = (id: string) => EL.colours[(EL.circuits.find((c) => c.circuit === id)?.group ?? "spare") as keyof typeof EL.colours]

export type BathPoint = { id: string; what: string; size: string; runs?: string; colour?: string }

export function bathData(lang: Locale) {
  const w = words[lang], j = w.json
  const fittings = overlay(PL.fittings, j.fittings, (f) => f.point)
  const points = overlay(EL.points, j.points, (p) => p.point)
  const board = { ...EL.board, ...j.board }
  const plumbingPoints: BathPoint[] = fittings.map((f) => ({ id: f.point, what: f.what, size: f.size, runs: f.runs, colour: fitColour(f.runs) }))
  const electricPoints: BathPoint[] = [
    { id: board.point, what: board.what, size: board.size },
    ...points.map((p) => ({ id: p.point, what: p.what, size: p.circuit || w.table.earth, colour: p.circuit ? circuitColour(p.circuit) : undefined })),
  ]
  return {
    plumbingPoints, electricPoints, board,
    // the tags' info on both drawings
    info: Object.fromEntries([...plumbingPoints, ...electricPoints].map((p) => [p.id, { label: p.what, colour: p.colour }])),
    circuits: overlay(EL.circuits, j.circuits, (c) => c.circuit),
    runs: overlay(PL.runs, j.runs, (r) => r.run),
    fitting: Object.fromEntries(fittings.map((f) => [f.point, f])),
  }
}
