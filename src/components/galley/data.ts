import G from "@/components/galley/galley.json"
import { type Circuit, type ElectricPoint, type WaterPoint, type WaterRun } from "@/components/galley/service-diagrams"

// The galley's water and power (galley.json `water`, `electric`), read by /en/galley and by its docs page
// (/docs/galley-points) alike, as src/components/studio/data.ts is the studio's.

export const D = "/designs/galley"
export const WATER = G.water as unknown as { points: WaterPoint[]; runs: WaterRun[]; colours: Record<string, string>; heater: { litres: number; kw: number } }
export const ELECTRIC = G.electric as unknown as { points: ElectricPoint[]; circuits: Circuit[]; colours: Record<string, string>; supply: { title: string; sub: string; main: string; mainSub: string } }

// a water point's dot: the warmest water it takes (hot over cold), or the drain or the vent for the points that only take those
const WARMTH: Record<string, string> = { meter: "cold", filter: "cold", heater: "hot", mixer: "hot", prerinse: "hot", basintap: "hot", aav: "vent" }
export const waterColour = (p: WaterPoint): string => WATER.colours[WARMTH[p.item ?? ""] ?? "waste"]
export const circuitColour = (p: ElectricPoint): string => ELECTRIC.colours[ELECTRIC.circuits.find((c) => c.id === p.circuit)?.group ?? "spare"]
