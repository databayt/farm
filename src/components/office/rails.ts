import { deviceRail } from "@/components/docs/room-points"
import type { Rail } from "@/components/docs/rail-table"
import { railCards } from "@/components/page/sections"
import { D, netPoints, points } from "@/components/office/data"
import office from "@/components/office/office.json"

// The office's rails, moved off its page so that the page (/[lang]/office) and its Materials page in the docs
// (D-059) read one list.
const m2 = (n: number) => +n.toFixed(2)

// The Furniture and equipment rail: each piece rendered on its own by scripts/site/render/office.html?item=<id>,
// sized from office.json. Nothing is sourced or priced yet.
const { sofa, workstation: ws, cafe } = office
export const furnitureRail = railCards(`${D}/render/furniture`, [
  { id: "sofa", title: "L sofa", size: `${m2(sofa.x1 - office.container.inner.x0)} × ${m2(office.container.inner.y1 - office.container.inner.y0)} m, ${m2(sofa.d)} m deep`,
    note: "One piece: its short leg across the whole cargo-door end, its long leg along the back wall, a corner seat between." },
  { id: "sofatable", title: "Low table", size: `${m2(sofa.table.x1 - sofa.table.x0)} × ${m2(sofa.table.y1 - sofa.table.y0)} m, 0.41 m high`, note: "Medium Oak, in front of the sofa." },
  { id: "bigdesk", title: "Big desk", size: `${m2(office.container.inner.y1 - office.container.inner.y0)} × ${m2(ws.d)} m, 0.75 m high`,
    note: "Across the whole far end wall, for a programmer and gamer; panel ends and a modesty panel." },
  { id: "display", title: "Studio Display", size: `${m2(ws.display.w)} m wide, its stand foot ${m2(ws.display.foot)} m deep`, note: "One, centred on the desk. Apple's size from memory [A], not yet sourced." },
  { id: "macstudio", title: "Mac Studio", size: `${m2(ws.mac.w)} × ${m2(ws.mac.w)} m, 0.095 m high`, note: "On the desk beside the display. Apple's size from memory [A], not yet sourced." },
  { id: "keyboard", title: "Keyboard and mouse", size: "About 0.44 × 0.13 m", note: "In front of the display." },
  { id: "gamingchair", title: "Gaming chair", size: "Five-star base on castors, a tall winged back with a headrest", note: "Facing the desk and the wall." },
  { id: "cafetable", title: "Ahwa table", size: `Ø ${m2(cafe.table.r * 2)} m, ${m2(cafe.table.h)} m high`, note: "Marble top on a cast-iron pedestal, as in a traditional Egyptian cafe; on the deck." },
  { id: "cafechair", title: "Ahwa chairs × 2", size: `${m2(cafe.chair.w)} × ${m2(cafe.chair.d)} m, seat ${m2(cafe.chair.seat)} m`,
    note: "Dark wood with woven rush seats, either side of the table, looking out over the garden." },
])

// each kind of electric device on its own and each piece of network gear, as the page's service rails show them
export const electricRail = deviceRail(points, (m) => `${D}/render/electric/${m}.webp`)
export const networkRail = deviceRail(netPoints, (m) => `${D}/render/network/${m}.webp`)

// every rail, as the Materials page lists them
export const rails: Rail[] = [
  { title: "Furniture and equipment", items: furnitureRail },
  { title: "Electric", items: electricRail },
  { title: "Network", items: networkRail },
]
