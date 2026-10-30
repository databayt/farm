import bath from "@/components/public-bathroom/public-bathroom.json"

// The public bathroom's fittings and devices (public-bathroom.json `plumbing`, `electric`), read by
// /en/public-bathroom (the tags) and by its docs page (/docs/public-bathroom-points, the points tables) alike, as
// src/components/studio/data.ts is the studio's.

export const D = "/designs/public-bathroom"
const { plumbing: PL, electric: EL } = bath

// a fitting's dot: the colour of its first run; a device's: its circuit's
const fitColour = (runs: string) => PL.colours[(PL.runs.find((r) => r.run === runs.split(" ")[0])?.system ?? "cold") as keyof typeof PL.colours]
const circuitColour = (id: string) => EL.colours[(EL.circuits.find((c) => c.circuit === id)?.group ?? "spare") as keyof typeof EL.colours]

export type BathPoint = { id: string; what: string; size: string; runs?: string; colour?: string }
export const plumbingPoints: BathPoint[] = PL.fittings.map((f) => ({ id: f.point, what: f.what, size: f.size, runs: f.runs, colour: fitColour(f.runs) }))
export const electricPoints: BathPoint[] = [
  { id: EL.board.point, what: EL.board.what, size: EL.board.size },
  ...EL.points.map((p) => ({ id: p.point, what: p.what, size: p.circuit || "Earth", colour: p.circuit ? circuitColour(p.circuit) : undefined })),
]
// the tags' info on both drawings
export const info = Object.fromEntries([...plumbingPoints, ...electricPoints].map((p) => [p.id, { label: p.what, colour: p.colour }]))
