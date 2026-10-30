import { type RoomPoint, withLoads } from "@/components/docs/room-points"
import room from "@/components/guest-room/guest-room.json"

// The guest room's electrics (guest-room.json `electric`), read by /en/guest-room and by its docs page
// (/docs/guest-room-points) alike, as src/components/studio/data.ts is the studio's.

export const D = "/designs/guest-room"
export const E = room.electric
export const points = E.points as RoomPoint[]
export const circuits = withLoads(E.circuits, points)
