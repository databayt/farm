import { WATER_COLOUR } from "@/components/farming/water-diagram"
import plan from "../../../public/designs/farming/data/plan.json"

// The field's plan (public/designs/farming/data/plan.json, written by scripts/site/farming.mjs), read by /en/farming
// (the rails, the diagram, the tags) and by its docs page (/docs/farming-plan) alike, as src/components/studio/data.ts
// is the studio's.

export const D = "/designs/farming"
export const I = plan.irrigation
// the crops, the biggest share of the plate first
export const crops = [...plan.crops].sort((a, b) => b.kgWeek - a.kgWeek)

// the water points, for the tags on the drawing and the table on the docs page
export const WATER_POINTS = [
  { id: "T", what: "Tank and booster pump", where: "The farm's, by the compound, off the drawing", size: "To the borehole test", colour: WATER_COLOUR.main },
  { id: "F", what: "Disc filter", where: "At the tank, off the drawing", size: "1 inch", colour: WATER_COLOUR.main },
  { id: "M1", what: "Main", where: "From the tank to the gate", size: `${I.main.dn} mm PE, ${I.main.m} m`, colour: WATER_COLOUR.main },
  { id: "S1", what: "Supply", where: "Along the main path to the middle aisle, then up and down each column's end", size: `32 mm PE`, colour: WATER_COLOUR.supply },
  ...I.valves.map((v) => ({ id: v.id, what: `Valve, block ${v.block}`, where: `Where block ${v.block}'s header leaves the supply`, size: `32 mm ball valve, ${v.beds} beds on drip`, colour: WATER_COLOUR.valve })),
  { id: "H", what: "Headers", where: "Across each block's gate-side end", size: "32 mm PE, 16.5 m a block", colour: WATER_COLOUR.supply },
  { id: "DL", what: "Drip lines", where: "Two down every planted bed", size: `16 mm tape, ${I.lines} lines of 10 m`, colour: WATER_COLOUR.drip },
]
