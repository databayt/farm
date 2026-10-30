import { type RoomPoint, withLoads } from "@/components/docs/room-points"
import room from "@/components/study-room/study-room.json"

// The study room's electrics and its Wi-Fi (study-room.json `electric`, `network`), read by /en/study-room and by its
// docs page (/docs/study-room-points) alike, as src/components/studio/data.ts is the studio's.

export const D = "/designs/study-room"
export const E = room.electric
const powerPoints = E.points as RoomPoint[]
export const points = [...powerPoints, ...(room.network.points as RoomPoint[])]
export const circuits = withLoads(E.circuits, powerPoints)
export const allLinks = [...circuits, ...room.network.circuits.map((c) => ({ ...c, device: "", cable_mm2: 0 }))]
