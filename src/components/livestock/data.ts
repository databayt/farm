import { frw } from "@/lib/format"
import livestock from "@/components/livestock/livestock.json"
import { WATER_COLOUR } from "@/components/livestock/water-diagram"

// The yard's water (livestock.json `water`), read by /en/livestock (the diagram, the rail, the tags) and by its docs
// page (/docs/livestock-points: the points and what the yard drinks) alike, as src/components/studio/data.ts is the
// studio's.

export const D = "/designs/livestock"
const { animals: AN, tank: TK, fittings: FT, water: WV } = livestock

// the water: every run and point in livestock.json's water section; the litres a day from its need block [E]
const len = (path: number[][]) => path.slice(1).reduce((s, p, i) => s + Math.hypot(p[0] - path[i][0], p[1] - path[i][1]), 0)
export const yardM = Math.round(len(WV.runs.find((r) => r.id === "S1")!.path) + TK.stand + 2 * (FT.trough.h + 0.3))
export const NEED = WV.need
export const herd = AN.goats.length + AN.sheep.length
export const ROWS = [
  { what: "Goats", head: AN.goats.length, per: NEED.goat, basis: "[V LVS-27]: 2 to 3 times dry-matter intake at maintenance" },
  { what: "Sheep", head: AN.sheep.length, per: NEED.sheep, basis: "[A AS-29]: as goats" },
  { what: "Guard dogs", head: AN.dogs.length, per: NEED.dog, basis: "[A AS-29]" },
]
export const low = ROWS.reduce((s, r) => s + r.head * r.per[0], 0) + NEED.small[0]
export const high = ROWS.reduce((s, r) => s + r.head * r.per[1], 0) + NEED.small[1]
// does and ewes in milk drink 4 to 5 times dry matter instead of 2 to 3 [V LVS-27]: up to 5/3 of the top figure [E]
export const peak = herd * NEED.goat[1] * NEED.lactating + AN.dogs.length * NEED.dog[1] + NEED.small[1]
export const tank = 1000
export const days: [number, number] = [Math.floor(tank / high), Math.floor(tank / low)]
export const r0 = (n: number) => frw(Math.round(n))

export const POINT_COLOUR: Record<string, string> = { F1: WATER_COLOUR.farm, FV: WATER_COLOUR.farm, T: WATER_COLOUR.farm, V1: WATER_COLOUR.valve,
  TP: WATER_COLOUR.valve, S1: WATER_COLOUR.supply, W1: WATER_COLOUR.riser, W2: WATER_COLOUR.riser, B: WATER_COLOUR.riser }
