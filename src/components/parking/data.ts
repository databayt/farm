import { DRAIN_COLOUR } from "@/components/parking/drainage-diagram"
import { LIGHT_COLOUR } from "@/components/parking/lighting-diagram"
import parking from "@/components/parking/parking.json"
import { words } from "@/components/parking/words"
import type { Locale } from "@/components/internationalization/config"

// The way in's quantities and points (parking.json), read by /[lang]/parking (the rails, the build-up, the tags) and by
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

// the points, for the tags on the drawings and the tables on the docs page, in the reader's language (words.tsx)
export function lightPoints(lang: Locale) {
  const t = words[lang].points
  return [
    { id: "LF", what: t.LF.what, where: t.LF.where, size: t.LF.size(m(LT.duct.d), m(LT.duct.depth)), colour: LIGHT_COLOUR.feed },
    { id: "LD", what: t.LD.what, where: t.LD.where, size: t.LD.size(feedM), colour: LIGHT_COLOUR.feed },
    { id: "EB", what: t.EB.what, where: t.EB.where, size: t.EB.size(m(LT.box.w), m(LT.box.h[1] - LT.box.h[0])), colour: LIGHT_COLOUR.feed },
    { id: "SG", ...t.SG, colour: LIGHT_COLOUR.sign },
    { id: "L1", what: t.L1.what, where: t.L1.where, size: t.L1.size(lampM), colour: LIGHT_COLOUR.lamp },
    { id: "L2", ...t.L2, colour: LIGHT_COLOUR.lamp },
  ]
}
export function drainPoints(lang: Locale) {
  const t = words[lang].points
  return [
    { id: "P", what: t.P.what, where: t.P.where, size: t.P.size(m(B.subbase)), colour: DRAIN_COLOUR.fall },
    { id: "F1", what: t.F1.what, where: t.F1.where, size: t.F1.size(Math.round(1 / DR.lot), m((x1 - x0) * DR.lot), x1 - x0), colour: DRAIN_COLOUR.fall },
    { id: "F2", what: t.F2.what, where: t.F2.where, size: t.F2.size(Math.round(1 / DR.turn)), colour: DRAIN_COLOUR.fall },
    { id: "F3", what: t.F3.what, where: t.F3.where, size: t.F3.size(Math.round(1 / DR.road)), colour: DRAIN_COLOUR.fall },
    { id: "T1", what: t.T1.what, where: t.T1.where, size: t.T1.size(m(DR.trench.w), m(DR.trench.depth), m(DR.trench.pipe)), colour: DRAIN_COLOUR.trench },
    { id: "SK", what: t.SK.what, where: t.SK.where, size: t.SK.size(DR.pit.size, DR.pit.depth), colour: DRAIN_COLOUR.pit },
  ]
}
