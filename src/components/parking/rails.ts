import { railCards } from "@/components/page/sections"
import { blocks, D, feedM, lampM, m, paverM2, stripSetts, subM3 } from "@/components/parking/data"
import parking from "@/components/parking/parking.json"
import { words } from "@/components/parking/words"
import type { Locale } from "@/components/internationalization/config"
import type { Rail } from "@/components/docs/rail-table"

// The parking's rails, moved off its page so that the page (/[lang]/parking) and its Materials page in the docs
// (D-059) read one list, in the reader's language (words.tsx).
const { parking: PK, build: B, drainage: DR, lighting: LT } = parking

// The Parts rail: each part rendered on its own by scripts/site/render/parking.html?item=<id>, from the model's own
// meshes or a patch of them. Nothing at the way in is sourced or priced yet, so no card names a shop or a price.
export const partsRail = (lang: Locale) => {
  const t = words[lang].rails
  return railCards(`${D}/render/item`, [
    { id: "gate", title: t.gate.title, size: t.gate.size(m(parking.gate.x[1] - parking.gate.x[0]), m(parking.gate.leaf)), note: t.gate.note },
    { id: "sign", title: t.sign.title, size: t.sign.size(m(parking.sign.box[2] - parking.sign.box[0]), m(parking.sign.h), m(parking.sign.box[3] - parking.sign.box[1])), note: t.sign.note },
    { id: "lantern", title: t.lantern.title, size: t.lantern.size, note: t.lantern.note },
    { id: "pavers", title: t.pavers.title, size: t.pavers.size(m(B.paver.l), m(B.paver.w), m(B.paver.h), Math.round(paverM2), blocks.toLocaleString("en-US")), note: t.pavers.note },
    { id: "setts", title: t.setts.title, size: t.setts.size(stripSetts), note: t.setts.note },
    { id: "stop", title: t.stop.title(PK.bays.length - 1), size: t.stop.size(m(PK.stops.l), m(PK.stops.r * 2)), note: t.stop.note },
    { id: "tree", title: t.tree.title(parking.trees.list.length), size: t.tree.size(parking.trees.h, parking.trees.crown), note: t.tree.note },
  ], lang)
}
export const lightRail = (lang: Locale) => {
  const t = words[lang].rails
  return railCards(`${D}/render/item`, [
    { id: "enclosure", title: t.enclosure.title, size: t.enclosure.size(m(LT.box.w), m(LT.box.h[1] - LT.box.h[0]), m(LT.box.d)), note: t.enclosure.note },
    { id: "sign", title: t.letters.title, size: t.letters.size(m(parking.sign.box[2] - parking.sign.box[0] - 2 * parking.sign.panel.inset), m(parking.sign.panel.y1 - parking.sign.panel.y0)), note: t.letters.note },
    { id: "lantern", title: t.lanterns.title, size: t.lanterns.size, note: t.lanterns.note },
    { id: "duct", title: t.duct.title, size: t.duct.size(m(LT.duct.d), feedM + lampM, m(LT.duct.depth)), note: t.duct.note },
  ], lang)
}
export const drainRail = (lang: Locale) => {
  const t = words[lang].rails
  return railCards(`${D}/render/item`, [
    { id: "layers", title: t.layers.title, size: t.layers.size(m(B.paver.h), m(B.bedding), m(B.subbase)), note: t.layers.note(Math.round(subM3)) },
    { id: "pavers", title: t.pavers.title, size: t.open.size(Math.round(paverM2)), note: t.open.note },
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
