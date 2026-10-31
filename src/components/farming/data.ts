import { WATER_COLOUR } from "@/components/farming/water-diagram"
import { words } from "@/components/farming/words"
import type { Locale } from "@/components/internationalization/config"
import { overlay } from "@/components/internationalization/words"
import plan from "../../../public/designs/farming/data/plan.json"

// The field's plan (public/designs/farming/data/plan.json, written by scripts/site/farming.mjs), read by /[lang]/farming
// (the rails, the diagram, the tags) and by its docs page (/docs/farming-plan) alike, as src/components/studio/data.ts
// is the studio's.

export const D = "/designs/farming"
export const I = plan.irrigation
// the crops, the biggest share of the plate first, plan.json's words with their Kinyarwanda laid over by id (words.tsx)
export const crops = [...plan.crops].sort((a, b) => b.kgWeek - a.kgWeek)
export function cropsFor(lang: Locale): typeof crops {
  return lang === "en" ? crops : overlay(crops, words[lang].json.crops)
}

// the bill of materials, its items in the reader's language (the section stays the grouping key; bom-table names it)
export function bomFor(lang: Locale): typeof plan.bom {
  return lang === "en" ? plan.bom : overlay(plan.bom, words[lang].json.bom, (l) => l.item)
}

// the water points, for the tags on the drawing and the table on the docs page
export function waterPoints(lang: Locale) {
  const t = words[lang].points
  return [
    { id: "T", ...t.T, colour: WATER_COLOUR.main },
    { id: "F", ...t.F, colour: WATER_COLOUR.main },
    { id: "M1", what: t.M1.what, where: t.M1.where, size: t.M1.size(I.main.dn, I.main.m), colour: WATER_COLOUR.main },
    { id: "S1", ...t.S1, colour: WATER_COLOUR.supply },
    ...I.valves.map((v) => ({ id: v.id, what: t.V.what(v.block), where: t.V.where(v.block), size: t.V.size(v.beds), colour: WATER_COLOUR.valve })),
    { id: "H", ...t.H, colour: WATER_COLOUR.supply },
    { id: "DL", what: t.DL.what, where: t.DL.where, size: t.DL.size(I.lines), colour: WATER_COLOUR.drip },
  ]
}
