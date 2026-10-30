import { type RoomPoint, withLoads } from "@/components/docs/room-points"
import office from "@/components/office/office.json"

// The office's electrics and network (office.json `electric`, `network`), read by /en/office and by its docs page
// (/docs/office-points) alike, as src/components/studio/data.ts is the studio's.

export const D = "/designs/office"
export const E = office.electric
export const N = office.network
export const points = E.points as RoomPoint[]
export const netPoints = N.points as RoomPoint[]
export const circuits = withLoads(E.circuits, points)
export const netLinks = N.circuits.map((c) => ({ ...c, device: "", cable_mm2: 0 }))
