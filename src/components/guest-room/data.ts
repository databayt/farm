import { type RoomPoint, withLoads } from "@/components/docs/room-points"
import room from "@/components/guest-room/guest-room.json"
import { words } from "@/components/guest-room/words"
import type { Locale } from "@/components/internationalization/config"
import { overlay } from "@/components/internationalization/words"

// The guest room's electrics (guest-room.json `electric`), read by /en/guest-room and by its docs page
// (/docs/guest-room-points) alike, as src/components/studio/data.ts is the studio's.

export const D = "/designs/guest-room"
export const E = room.electric
export const points = E.points as RoomPoint[]
export const circuits = withLoads(E.circuits, points)

// The same, in the reader's language: guest-room.json's words with their Kinyarwanda laid over them by id (words.tsx)
export function guestRoomData(lang: Locale) {
  if (lang === "en") return { points, circuits }
  const j = words[lang].json
  return { points: overlay(points, j.points), circuits: overlay(circuits, j.circuits) }
}
