import { DRAIN_COLOUR } from "@/components/parking/drainage-diagram"
import { LIGHT_COLOUR } from "@/components/parking/lighting-diagram"
import parking from "@/components/parking/parking.json"
import { words } from "@/components/parking/words"
import type { Locale } from "@/components/internationalization/config"

// The way in's quantities and points (parking.json), read by /[lang]/parking (the rails, the build-up, the tags) and by
// its docs pages (the points tables) alike, as src/components/studio/data.ts is the studio's.

export const D = "/designs/parking"
const { parking: PK, build: B, drainage: DR, lighting: LT } = parking
// metres as millimetres, grouped: 1.2 becomes "1,200"
export const m = (n: number): string => Math.round(n * 1000).toLocaleString("en-US")

// what the parking takes, from the plan (D-065): the gravel inside the edging, its base and top in compacted m³, the
// geotextile under the whole box, the edging round it and the timber strips between the bays
export const [x0, y0, x1, y1] = PK.box, e = PK.edging.w
const rounded = (w: number, h: number, r: number) => w * h - (4 - Math.PI) * r ** 2
export const gravelM2 = rounded(x1 - x0 - 2 * e, y1 - y0 - 2 * e, PK.r - e)
export const boxM2 = rounded(x1 - x0, y1 - y0, PK.r)
export const baseM3 = gravelM2 * B.base
export const topM3 = gravelM2 * B.gravel
export const edgingM = 2 * (x1 - x0 + (y1 - y0)) - 8 * PK.r + 2 * Math.PI * PK.r
export const stripM = (PK.bays.length - 1) * (PK.strips.l - e)
export const pegs = Math.ceil(edgingM / PK.edging.peg) + (PK.bays.length - 1) * Math.ceil(PK.strips.l / PK.edging.peg)

// the bollards, numbered west to east, and where each stands, in the reader's language
const BAYS = PK.bays
const bollardWhere = (lang: Locale, [x]: number[]): string => {
  const t = words[lang].points.B
  const i = BAYS.indexOf(x)
  return i > 0 && i < BAYS.length - 1 ? t.between(i, i + 1) : i === BAYS.length - 1 ? t.open : t.road
}

// the points, for the tags on the drawings and the tables on the docs pages, in the reader's language (words.tsx)
export type Point = { id: string; what: string; where: string; size: string; colour: string }
export function lightPoints(lang: Locale): Point[] {
  const t = words[lang].points
  return [
    ...LT.bollards.at.map((p, i) => ({ id: `B${i + 1}`, what: t.B.what, where: bollardWhere(lang, p), size: t.B.size(m(LT.bollards.h), m(LT.bollards.d)), colour: LIGHT_COLOUR.lamp })),
    { id: "L1", ...t.L1, colour: LIGHT_COLOUR.lamp },
    { id: "L2", ...t.L2, colour: LIGHT_COLOUR.lamp },
    { id: "SP", what: t.SP.what, where: t.SP.where, size: t.SP.size(m(LT.panel.x[1] - LT.panel.x[0]), m(LT.panel.d), LT.panel.watts), colour: LIGHT_COLOUR.solar },
    { id: "EB", what: t.EB.what, where: t.EB.where, size: t.EB.size(m(LT.box.w), m(LT.box.h[1] - LT.box.h[0])), colour: LIGHT_COLOUR.solar },
    { id: "SG", ...t.SG, colour: LIGHT_COLOUR.sign },
  ]
}
export function drainPoints(lang: Locale): Point[] {
  const t = words[lang].points
  return [
    { id: "P", what: t.P.what, where: t.P.where, size: t.P.size(m(B.gravel), m(B.base)), colour: DRAIN_COLOUR.fall },
    { id: "F1", what: t.F1.what, where: t.F1.where, size: t.F1.size(Math.round(1 / DR.lot), m((x1 - x0) * DR.lot), x1 - x0), colour: DRAIN_COLOUR.fall },
    { id: "F2", what: t.F2.what, where: t.F2.where, size: t.F2.size(Math.round(1 / DR.turn)), colour: DRAIN_COLOUR.fall },
    { id: "F3", what: t.F3.what, where: t.F3.where, size: t.F3.size(Math.round(1 / DR.road)), colour: DRAIN_COLOUR.fall },
    { id: "T1", what: t.T1.what, where: t.T1.where, size: t.T1.size(m(DR.trench.w), m(DR.trench.depth), m(DR.trench.pipe)), colour: DRAIN_COLOUR.trench },
    { id: "SK", what: t.SK.what, where: t.SK.where, size: t.SK.size(DR.pit.size, DR.pit.depth), colour: DRAIN_COLOUR.pit },
  ]
}
