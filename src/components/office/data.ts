import { type RoomPoint, withLoads } from "@/components/docs/room-points"
import type { Locale } from "@/components/internationalization/config"
import { overlay } from "@/components/internationalization/words"
import office from "@/components/office/office.json"
import { words } from "@/components/office/words"

// The office's electrics and network (office.json `electric`, `network`), read by /en/office and by its docs page
// (/docs/office-points) alike, as src/components/studio/data.ts is the studio's.

export const D = "/designs/office"
export const E = office.electric
export const N = office.network
export const points = E.points as RoomPoint[]
export const netPoints = N.points as RoomPoint[]
export const circuits = withLoads(E.circuits, points)
export const netLinks = N.circuits.map((c) => ({ ...c, device: "", cable_mm2: 0 }))

// The same, in the reader's language: office.json's words with their Kinyarwanda laid over them by id (words.tsx)
export function officeData(lang: Locale) {
  if (lang === "en") return { points, netPoints, circuits, netLinks, netCircuits: N.circuits }
  const j = words[lang].json
  return {
    points: overlay(points, j.points),
    netPoints: overlay(netPoints, j.netPoints),
    circuits: overlay(circuits, j.circuits),
    netLinks: overlay(netLinks, j.netCircuits),
    netCircuits: overlay(N.circuits, j.netCircuits),
  }
}
