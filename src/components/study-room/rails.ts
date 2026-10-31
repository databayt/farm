import { deviceRail } from "@/components/docs/room-points"
import type { Rail } from "@/components/docs/rail-table"
import { railCards } from "@/components/page/sections"
import { D, points } from "@/components/study-room/data"
import room from "@/components/study-room/study-room.json"

// The study room's rails, moved off its page so that the page (/[lang]/study-room) and its Materials page in the docs
// (D-059) read one list.
const m2 = (n: number) => +n.toFixed(2)

// The rails: each piece rendered on its own by scripts/site/render/study-room.html?item=<id>, sized from
// study-room.json. Nothing is sourced or priced yet.
const { table, screen, shelves, reading, room: inner } = room
export const tableRail = railCards(`${D}/render/furniture`, [
  { id: "table", title: "Long table", size: `${m2(table.l)} × ${m2(table.w)} m, ${m2(table.h)} m high`,
    note: `Down the middle of the room, ${table.seats.length} seats along each side; a double socket on the back wall behind each pair.` },
  { id: "chair", title: `Chairs × ${table.seats.length * 2}`, size: `${m2(table.chair.w)} × ${m2(table.chair.d)} m, seat ${m2(table.chair.seat)} m, back ${m2(table.chair.back)} m`,
    note: "Oak with an oat seat pad, facing each other across the table." },
  { id: "screen", title: "Screen", size: `86 inch, ${m2(screen.w)} × ${m2(screen.h)} m, its foot at ${m2(screen.y0)} m`,
    note: "Flat on the east end wall on a low-profile bracket; it casts over the Wi-Fi, with P5 and the data outlet D1 behind its cabinet." },
  { id: "cabinet", title: "Screen cabinet", size: `${m2(screen.cabinet.l)} × ${m2(screen.cabinet.d)} m, ${m2(screen.cabinet.h)} m high` },
  { id: "lectern", title: "Lectern", size: `${m2(screen.lectern.w)} × ${m2(screen.lectern.d)} m, ${m2(screen.lectern.h)} m high`, note: "A standing table for whoever is presenting or teaching." },
])
export const cornerRail = railCards(`${D}/render/furniture`, [
  { id: "shelves", title: "Bookshelf wall", size: `${m2(inner.front - inner.back)} m wide, ${m2(shelves.d)} m deep, full height`,
    note: `${shelves.bays} bays of ${shelves.rows} shelves across the west end wall.` },
  { id: "armchair", title: "Armchairs × 2", size: `${m2(reading.chair.w)} × ${m2(reading.chair.d)} m, seat ${m2(reading.chair.seat)} m`, note: "Upholstered, angled toward the glazing." },
  { id: "sidetable", title: "Side table", size: `Ø ${m2(reading.table.r * 2)} m, ${m2(reading.table.h)} m high` },
  { id: "floorlamp", title: "Floor lamp", size: `${m2(reading.lamp.h)} m high`, note: "Plugged into the socket P6 in the corner." },
  { id: "rug", title: "Rug", size: `${m2(reading.rug.x[1] - reading.rug.x[0])} × ${m2(reading.rug.y[1] - reading.rug.y[0])} m`, note: "Woven, under the reading corner." },
])

// each kind of electric device on its own, as the page's service rails show them
export const electricRail = deviceRail(points, (m) => `${D}/render/electric/${m}.webp`, { pendant: { size: "Ø 380 mm dome on a cord, 1.95 m above the floor" }, wallfan: { size: "Ø 400 mm, on a short arm" } })

// every rail, as the Materials page lists them
export const rails: Rail[] = [
  { title: "Table and screen", items: tableRail },
  { title: "Reading corner", items: cornerRail },
  { title: "Electric", items: electricRail },
]
