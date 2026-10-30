import B from "@/components/bar/bar.json"
import { type Circuit, type ElectricPoint, type WaterPoint, type WaterRun } from "@/components/galley/service-diagrams"

// The bar's water and power (bar.json `water`, `electric`, in the galley's pattern), read by /en/bar and by its docs
// page (/docs/bar-points) alike, as src/components/studio/data.ts is the studio's.

export const D = "/designs/bar"
export const WATER = B.water as unknown as { points: WaterPoint[]; runs: WaterRun[]; colours: Record<string, string>; heater: { litres: number; kw: number } }
export const ELECTRIC = B.electric as unknown as { points: ElectricPoint[]; circuits: Circuit[]; colours: Record<string, string>; supply: { title: string; sub: string; main: string; mainSub: string } }

// a water point's dot: the warmest water it takes (hot over cold), or the drain or the vent for the points that only take those
const WARMTH: Record<string, string> = { meter: "cold", scalefilter: "cold", coffeefeed: "cold", heater: "hot", mixer: "hot", aav: "vent" }
export const waterColour = (p: WaterPoint): string => WATER.colours[WARMTH[p.item ?? ""] ?? "waste"]
export const circuitColour = (p: ElectricPoint): string => ELECTRIC.colours[ELECTRIC.circuits.find((c) => c.id === p.circuit)?.group ?? "spare"]
