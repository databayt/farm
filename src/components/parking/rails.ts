import { railCards } from "@/components/page/sections"
import { blocks, D, feedM, lampM, m, paverM2, stripSetts, subM3 } from "@/components/parking/data"
import parking from "@/components/parking/parking.json"
import type { Rail } from "@/components/docs/rail-table"

// The parking's rails, moved off its page so that the page (/[lang]/parking) and its Materials page in the docs
// (D-059) read one list.
const { parking: PK, build: B, drainage: DR, lighting: LT } = parking

// The Parts rail: each part rendered on its own by scripts/site/render/parking.html?item=<id>, from the model's own
// meshes or a patch of them. Nothing at the way in is sourced or priced yet, so no card names a shop or a price.
export const partsRail = () => railCards(`${D}/render/item`, [
  { id: "gate", title: "Outer gate", size: `${m(parking.gate.x[1] - parking.gate.x[0])} between the pillars, leaves ${m(parking.gate.leaf)} high`,
    note: "Two timber leaves of vertical boards on a frame braced in an X, black iron strap hinges and a latch, opening inward; fieldstone pillars 600 mm square under timber caps." },
  { id: "sign", title: "Sign wall", size: `${m(parking.sign.box[2] - parking.sign.box[0])} long, ${m(parking.sign.h)} high, ${m(parking.sign.box[3] - parking.sign.box[1])} thick`,
    note: "Fieldstone under a timber cap; on its road face a dark steel panel with DIGITAL FARM in warm-white LED capitals." },
  { id: "lantern", title: "Pillar lantern", size: "About 140 mm square, 260 mm high, on the pillar's cap",
    note: "L1 on the outer gate's left pillar, L2 on the inner gate's right one: outdoor-rated, on the dusk-to-dawn circuit below." },
  { id: "pavers", title: "Grass pavers", size: `${m(B.paver.l)} × ${m(B.paver.w)} × ${m(B.paver.h)} mm blocks, ${Math.round(paverM2)} m², about ${blocks.toLocaleString("en-US")} blocks`,
    note: "Concrete blocks with sixteen open cells, laid butted on the bedding, the cells filled with topsoil and seeded. Shown with the front row not yet grown." },
  { id: "setts", title: "Granite setts", size: `About 100 mm; ${stripSetts} in the bay strips, and the turn and the rock road`,
    note: "Grey granite in mixed tones, laid by hand on sand: in segmental arcs on the turn and the rock road, in single rows between the bays." },
  { id: "stop", title: `Wheel stops × ${PK.bays.length - 1}`, size: `${m(PK.stops.l)} long, ${m(PK.stops.r * 2)} across`,
    note: "Barked and oiled eucalyptus logs, pinned to the ground 450 mm from the far edge." },
  { id: "tree", title: `Shade trees × ${parking.trees.list.length}`, size: `About ${parking.trees.h} m tall at planting, the crown from ${parking.trees.crown} m`,
    note: "Young broad-canopied trees; the species is not chosen yet (the render brief names neem and acacia)." },
])
export const lightRail = () => railCards(`${D}/render/item`, [
  { id: "enclosure", title: "Box on the sign wall", size: `${m(LT.box.w)} × ${m(LT.box.h[1] - LT.box.h[0])} × ${m(LT.box.d)} mm, IP65`,
    note: "EB · an isolator, a dusk-to-dawn photocell with a timer, and the 24 V driver for the letters; the ducts come up into it from below." },
  { id: "sign", title: "Sign letters", size: `Panel ${m(parking.sign.box[2] - parking.sign.box[0] - 2 * parking.sign.panel.inset)} × ${m(parking.sign.panel.y1 - parking.sign.panel.y0)} mm`,
    note: "SG · DIGITAL FARM in warm-white LED capitals at 24 V from the driver in the box." },
  { id: "lantern", title: "Lanterns × 2", size: "About 140 mm square, 260 mm high",
    note: "L1 on the outer gate, fed from the box; L2 on the inner gate, teed off the feed on its way down." },
  { id: "duct", title: "Duct and cable", size: `${m(LT.duct.d)} mm duct, about ${feedM + lampM} m, ${m(LT.duct.depth)} mm down`,
    note: "LF, LD · outdoor armoured cable in a buried duct with a draw wire, a warning tape laid over it." },
])
export const drainRail = () => railCards(`${D}/render/item`, [
  { id: "layers", title: "The build-up", size: `Pavers ${m(B.paver.h)}, bedding ${m(B.bedding)}, sub-base ${m(B.subbase)} mm`,
    note: `P · the parking cut open: about ${Math.round(subM3)} m³ of crushed stone under the pavers holds the rain while it soaks away.` },
  { id: "pavers", title: "Grass pavers", size: `${Math.round(paverM2)} m² of open cells`,
    note: "P · the rain falls through the grass in the cells, so the lot needs no gully." },
  { id: "trench", title: "Gravel trench", size: `${m(DR.trench.w)} × ${m(DR.trench.depth)} mm, ${(DR.trench.y[1] - DR.trench.y[0]).toFixed(1)} m long, a ${m(DR.trench.pipe)} mm perforated pipe`,
    note: "T1 · across the west end, 400 mm outside the edging: clean 20 to 40 mm stone in geotextile, falling 1 in 100 to the pit." },
  { id: "soakaway", title: "Soakaway pit", size: `${DR.pit.size} × ${DR.pit.size} m, ${DR.pit.depth} m deep, a slab cover`,
    note: "SK · stone in a geotextile wrap; sized again after a percolation test on site." },
])

// every rail, as the Materials page lists them
export const rails: Rail[] = [
  { title: "Parts", items: partsRail() },
  { title: "Lighting", items: lightRail() },
  { title: "Drainage", items: drainRail() },
]
