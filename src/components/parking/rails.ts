import { railCards } from "@/components/page/sections"
import { type RailItem } from "@/components/docs/item-rail"
import { baseM3, boxM2, D, edgingM, gravelM2, m, pegs, stripM, topM3 } from "@/components/parking/data"
import parking from "@/components/parking/parking.json"
import { words } from "@/components/parking/words"
import type { Locale } from "@/components/internationalization/config"
import type { Rail } from "@/components/docs/rail-table"

// The parking's rails, moved off its page so that the page (/[lang]/parking) and its Materials page in the docs
// (D-059) read one list, in the reader's language (words.tsx).
const { parking: PK, build: B, drainage: DR, lighting: LT } = parking
const r1 = (n: number) => +n.toFixed(1)

// The Parts rail: each part rendered on its own by scripts/site/render/parking.html?item=<id>, from the model's own
// meshes or a patch of them. Nothing at the way in is sourced or priced yet, so no card names a shop or a price.
export const partsRail = (lang: Locale): RailItem[] => {
  const t = words[lang].rails
  return railCards(`${D}/render/item`, [
    { id: "gate", title: t.gate.title, size: t.gate.size(m(parking.gate.x[1] - parking.gate.x[0]), m(parking.gate.leaf)), note: t.gate.note },
    { id: "sign", title: t.sign.title, size: t.sign.size(m(parking.sign.box[2] - parking.sign.box[0]), m(parking.sign.h), m(parking.sign.box[3] - parking.sign.box[1])), note: t.sign.note },
    { id: "gravel", title: t.gravel.title, size: t.gravel.size(Math.round(gravelM2), r1(baseM3), r1(topM3)), note: t.gravel.note },
    { id: "edging", title: t.edging.title, size: t.edging.size(m(PK.edging.h), m(PK.edging.w), Math.round(edgingM + stripM), pegs), note: t.edging.note },
    { id: "setts", title: t.setts.title, size: t.setts.size, note: t.setts.note },
    { id: "stop", title: t.stop.title(PK.bays.length - 1), size: t.stop.size(m(PK.stops.l), m(PK.stops.r * 2)), note: t.stop.note },
    { id: "tree", title: t.tree.title(parking.trees.list.length), size: t.tree.size(parking.trees.h, parking.trees.crown), note: t.tree.note },
  ], lang)
}
export const lightRail = (lang: Locale): RailItem[] => {
  const t = words[lang].rails
  return railCards(`${D}/render/item`, [
    { id: "bollard", title: t.bollard.title(LT.bollards.at.length), size: t.bollard.size(m(LT.bollards.h), m(LT.bollards.d)), note: t.bollard.note },
    { id: "lantern", title: t.lanterns.title, size: t.lanterns.size, note: t.lanterns.note },
    { id: "solar", title: t.solar.title, size: t.solar.size(m(LT.panel.x[1] - LT.panel.x[0]), m(LT.panel.d), LT.panel.watts, m(LT.box.w), m(LT.box.h[1] - LT.box.h[0])), note: t.solar.note },
    { id: "sign", title: t.letters.title, size: t.letters.size(m(parking.sign.box[2] - parking.sign.box[0] - 2 * parking.sign.panel.inset), m(parking.sign.panel.y1 - parking.sign.panel.y0)), note: t.letters.note },
  ], lang)
}
export const drainRail = (lang: Locale): RailItem[] => {
  const t = words[lang].rails
  return railCards(`${D}/render/item`, [
    { id: "layers", title: t.layers.title, size: t.layers.size(m(B.gravel), m(B.base), Math.round(boxM2)), note: t.layers.note },
    { id: "trench", title: t.trench.title, size: t.trench.size(m(DR.trench.w), m(DR.trench.depth), (DR.trench.y[1] - DR.trench.y[0]).toFixed(1), m(DR.trench.pipe)), note: t.trench.note },
    { id: "soakaway", title: t.soakaway.title, size: t.soakaway.size(DR.pit.size, DR.pit.depth), note: t.soakaway.note },
  ], lang)
}

// every rail, as the Materials page lists them
export function rails(lang: Locale): Rail[] {
  const t = words[lang].sections
  return [
    { title: t.parts, items: partsRail(lang) },
    { title: t.lighting, items: lightRail(lang) },
    { title: t.drainage, items: drainRail(lang) },
  ]
}
