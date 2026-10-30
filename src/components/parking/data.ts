import { DRAIN_COLOUR } from "@/components/parking/drainage-diagram"
import { LIGHT_COLOUR } from "@/components/parking/lighting-diagram"
import parking from "@/components/parking/parking.json"

// The way in's quantities and points (parking.json), read by /en/parking (the rails, the build-up, the tags) and by
// its docs page (/docs/parking-points, the points tables) alike, as src/components/studio/data.ts is the studio's.

export const D = "/designs/parking"
const { parking: PK, build: B, drainage: DR, lighting: LT } = parking
// metres as millimetres, grouped: 1.2 becomes "1,200"
export const m = (n: number) => Math.round(n * 1000).toLocaleString("en-US")
const len = (pts: number[][]) => pts.slice(1).reduce((n, p, i) => n + Math.hypot(p[0] - pts[i][0], p[1] - pts[i][1]), 0)

// what the parking takes, from the plan: the paver area inside the edging, the blocks, the sub-base, the sett strips
export const [x0, y0, x1, y1] = PK.box, e = PK.edging.w
export const paverM2 = (x1 - x0 - 2 * e) * (y1 - y0 - 2 * e) - (4 - Math.PI) * (PK.r - e) ** 2
export const blocks = Math.ceil(paverM2 / (B.paver.l * B.paver.w))
export const subM3 = ((x1 - x0) * (y1 - y0) - (4 - Math.PI) * PK.r ** 2) * B.subbase
export const stripSetts = (PK.bays.length - 1) * Math.round((PK.strips.l - e) / 0.1)
export const feedM = Math.round(len(LT.route.feed))
export const lampM = Math.round(len(LT.route.lantern) + 2.2) // and up inside the pillar to the lantern

// the points, for the tags on the drawings and the tables on the docs page
export const LIGHT_POINTS = [
  { id: "LF", what: "Feed", where: "From the compound's board, down the lawn beside the rock road; it enters the drawing at the road's far end", size: `In a ${m(LT.duct.d)} mm duct, ${m(LT.duct.depth)} mm down`, colour: LIGHT_COLOUR.feed },
  { id: "LD", what: "Duct across the parking", where: "Under the sett strip on bay 5's open side, then behind the sign wall", size: `About ${feedM} m from the inner gate to the box`, colour: LIGHT_COLOUR.feed },
  { id: "EB", what: "Box on the sign wall", where: "On the wall's back face at its east end, out of the guests' way", size: `${m(LT.box.w)} × ${m(LT.box.h[1] - LT.box.h[0])} mm, IP65; isolator, photocell and timer, 24 V driver`, colour: LIGHT_COLOUR.feed },
  { id: "SG", what: "Sign letters", where: "The wall's road face", size: "LED, 24 V from the driver", colour: LIGHT_COLOUR.sign },
  { id: "L1", what: "Lantern, outer gate", where: "On the left pillar's cap; its cable behind the hedge and up inside the pillar", size: `About ${lampM} m from the box`, colour: LIGHT_COLOUR.lamp },
  { id: "L2", what: "Lantern, inner gate", where: "On the right pillar, off the drawing; teed off the feed", size: "As L1", colour: LIGHT_COLOUR.lamp },
]
export const DRAIN_POINTS = [
  { id: "P", what: "Pavers and sub-base", where: "The whole lot", size: `Rain soaks through the cells into ${m(B.subbase)} mm of stone`, colour: DRAIN_COLOUR.fall },
  { id: "F1", what: "The lot's fall", where: "Along its length, east to west", size: `1 in ${Math.round(1 / DR.lot)}, ${m((x1 - x0) * DR.lot)} mm over ${x1 - x0} m`, colour: DRAIN_COLOUR.fall },
  { id: "F2", what: "The turn's fall", where: "From the gate back to the public road", size: `1 in ${Math.round(1 / DR.turn)}`, colour: DRAIN_COLOUR.fall },
  { id: "F3", what: "The rock road's crown", where: "To the fieldstone edgings each side", size: `1 in ${Math.round(1 / DR.road)}`, colour: DRAIN_COLOUR.fall },
  { id: "T1", what: "Gravel trench", where: "Across the west end, outside the edging", size: `${m(DR.trench.w)} × ${m(DR.trench.depth)} mm, ${m(DR.trench.pipe)} mm perforated pipe`, colour: DRAIN_COLOUR.trench },
  { id: "SK", what: "Soakaway pit", where: "At the trench's south end, by the hedge", size: `${DR.pit.size} m square, ${DR.pit.depth} m deep; sized after a percolation test`, colour: DRAIN_COLOUR.pit },
]
