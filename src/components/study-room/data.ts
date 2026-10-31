import { type RoomPoint, withLoads } from "@/components/docs/room-points"
import type { Locale } from "@/components/internationalization/config"
import { overlay } from "@/components/internationalization/words"
import room from "@/components/study-room/study-room.json"
import { words } from "@/components/study-room/words"

// The study room's electrics and its Wi-Fi (study-room.json `electric`, `network`), read by /en/study-room and by its
// docs page (/docs/study-room-points) alike, as src/components/studio/data.ts is the studio's.

export const D = "/designs/study-room"
export const E = room.electric
const powerPoints = E.points as RoomPoint[]
export const points = [...powerPoints, ...(room.network.points as RoomPoint[])]
export const circuits = withLoads(E.circuits, powerPoints)
export const allLinks = [...circuits, ...room.network.circuits.map((c) => ({ ...c, device: "", cable_mm2: 0 }))]

// The same, in the reader's language: study-room.json's words with their Kinyarwanda laid over them by id (words.tsx)
export function studyRoomData(lang: Locale) {
  if (lang === "en") return { points, circuits, allLinks }
  const j = words[lang].json
  return { points: overlay(points, j.points), circuits: overlay(circuits, j.circuits), allLinks: overlay(allLinks, j.circuits) }
}
