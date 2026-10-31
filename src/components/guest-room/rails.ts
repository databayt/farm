import { frw } from "@/lib/format"
import { deviceRail } from "@/components/docs/room-points"
import type { Rail } from "@/components/docs/rail-table"
import { railCards } from "@/components/page/sections"
import { D, points } from "@/components/guest-room/data"
import room from "@/components/guest-room/guest-room.json"

// The guest room's rails, moved off its page so that the page (/[lang]/guest-room) and its Materials page in the docs
// (D-059) read one list.
const m2 = (n: number) => +n.toFixed(2)

// The furniture rails: each piece rendered on its own by scripts/site/render/guest-room.html?item=<id>, sized from
// guest-room.json. Nothing is sourced or quoted yet; where the studio already carries a placeholder price for the
// same piece (AS-21), the card repeats it as an estimate.
const { bed, bedsides: bs, bench, wardrobe, desk, hooks, rug, veranda, bath } = room
export const bedRail = railCards(`${D}/render/furniture`, [
  { id: "bed", title: "Bed frame", size: `${m2(bed.w)} × ${m2(bed.l)} m mattress, frame ${m2(bed.frame)} m high, headboard ${m2(bed.headboard)} m`,
    note: "A solid Medium Oak frame with its headboard on the back wall, under the barred window." },
  { id: "mattress", title: "Mattress", size: `${bed.w * 100} × ${bed.l * 100} × ${Math.round(bed.mattress * 100)} cm`,
    where: "Not sourced yet (the studio's: Rwanda Foam Ltd, Kigali)", cost: `RWF ${frw(180_000)} (estimate, as the studio's)` },
  { id: "bedding", title: "Bedding", size: `Duvet, two pillows and a cushion for ${bed.w * 100} × ${bed.l * 100} cm`, note: "White bedding with a mustard throw at the foot." },
  { id: "bedside", title: `Bedside tables × 2`, size: `${m2(bs.w)} × ${m2(bs.d)} m, ${m2(bs.h)} m high`, note: "A top and a lower shelf on four legs, one each side of the bed." },
  { id: "lamp", title: "Table lamps × 2", size: "Ø 0.26 m linen shade, 0.42 m high", cost: `RWF ${frw(35_000)} each × 2 (estimate, as the studio's)`,
    note: "One on each bedside table, plugged into the socket beside it (P1, P2): a lamp on both sides of the bed (D-029)." },
  { id: "bench", title: "Luggage bench", size: `${m2(bench.w)} × ${m2(bench.d)} m, ${m2(bench.h)} m high`, note: "Slatted, across the foot of the bed." },
  { id: "rug", title: "Rug", size: `${m2(rug.w)} × ${m2(rug.d)} m`, note: "A flat-woven rug under the lower two thirds of the bed." },
])
export const roomRail = railCards(`${D}/render/furniture`, [
  { id: "wardrobe", title: "Wardrobe", size: `${m2(wardrobe.w)} × ${m2(wardrobe.d)} m, ${m2(wardrobe.h)} m high`, note: "Two doors, on the left wall beside the bed, short of the joint's post." },
  { id: "desk", title: "Desk", size: `${m2(desk.y1 - desk.y0)} × ${m2(desk.d)} m, ${m2(desk.h)} m high`, note: "On the right wall beside the bed, with a reading lamp and the socket P3 over it." },
  { id: "chair", title: "Desk chair", size: `${m2(desk.chair.w)} × ${m2(desk.chair.d)} m, seat ${m2(desk.chair.seat)} m, back ${m2(desk.chair.back)} m` },
  { id: "hooks", title: "Coat hooks", size: `A ${m2(hooks.y1 - hooks.y0)} m rail of four hooks at ${m2(hooks.h)} m`, note: "On the right wall, clear of the door's swing." },
  { id: "verandachair", title: "Veranda chairs × 2", size: `${m2(veranda.chair.w)} × ${m2(veranda.chair.d)} m, seat ${m2(veranda.chair.seat)} m, back ${m2(veranda.chair.back)} m`,
    note: "Slatted, under the front window, as on the camp's porch." },
  { id: "verandatable", title: "Veranda table", size: `Ø ${m2(veranda.table.r * 2)} m, ${m2(veranda.table.h)} m high`, note: "A pedestal table between the chairs, with a lantern." },
])

// The en-suite's rail (D-061), in the furniture's pattern: each fixture rendered on its own by guest-room.html?item=<id>.
// The studio carries no placeholder price for a floor-standing WC or a vessel basin, so none is quoted here.
const { tray, wc, basin } = bath
export const bathRail = railCards(`${D}/render/furniture`, [
  { id: "shower", title: "Walk-in shower", size: `${m2(tray.x1 - tray.x0)} × ${m2(tray.y1 - tray.y0)} m tray, a ${m2(bath.screen.h)} m fixed glass screen`,
    note: "A low tray with a centre drain, the glass screen beside the WC, a riser rail with the hand shower; the instant heater (H1) on the left wall, as the studio's (D-053)." },
  { id: "wc", title: "WC", size: `${m2(wc.w)} × ${m2(wc.d)} m, seat at ${m2(wc.seat)} m, cistern ${m2(wc.cistern.h)} m high`,
    note: "Floor-standing with a low close-coupled cistern, so it sits under the front window's sill." },
  { id: "basin", title: "Basin and console", size: `${m2(basin.x1 - basin.x0)} × ${m2(basin.d)} m, top at ${m2(basin.h)} m`,
    note: `A vessel basin on a timber console with a pillar tap; a ${m2(basin.mirror.w)} × ${m2(basin.mirror.h)} m mirror above it.` },
])

// each kind of electric device on its own, as the page's service rails show them
export const electricRail = deviceRail(points, (m) => `${D}/render/electric/${m}.webp`, {
  isolator: { title: "Isolators" },
  heater: { cost: `RWF ${frw(90_000)} (estimate, as the studio's)` },
})

// every rail, as the Materials page lists them
export const rails: Rail[] = [
  { title: "Bed", items: bedRail },
  { title: "Room and veranda", items: roomRail },
  { title: "Bathroom", items: bathRail },
  { title: "Electric", items: electricRail },
]
