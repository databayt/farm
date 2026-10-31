import { railCards } from "@/components/page/sections"
import type { Locale } from "@/components/internationalization/config"
import { D, m, netValues } from "@/components/volleyball/data"
import volleyball from "@/components/volleyball/volleyball.json"
import { words } from "@/components/volleyball/words"
import type { Rail } from "@/components/docs/rail-table"

// The volleyball's rails, moved off its page so that the page (/[lang]/volleyball) and its Materials page in the docs
// (D-059) read one list; their words are in words.tsx.
const { benches: B, shade: SH, store: ST, surface: SF, build: BU, court: K } = volleyball

// The rails: each part rendered on its own by scripts/site/render/volleyball.html?item=<id>, from the model's own
// meshes or a cut-open sample. Nothing for the court is sourced or priced yet, so no card names a shop or a price.
// lines of tape: side and end lines, the centre line and the two attack lines, as the court draws them
const tapeM = 2 * K.l + 2 * K.w + 3 * K.w
export const kitRail = (lang: Locale = "en") => railCards(`${D}/render/item`, words[lang].rails.kit({
  tape: m(SF.tape), tapeM, every: BU.pegs.every, benches: B.x.length, bl: m(B.l), bd: m(B.d), bh: m(B.h),
  across: m(SH.r * 2), eave: m(SH.eave), top: m(SH.top), sl: m(ST.l), sd: m(ST.d), sh: m(ST.h),
}), lang)
export const netRail = (lang: Locale = "en") => railCards(`${D}/render/item`, words[lang].rails.net(netValues), lang)

// every rail, as the Materials page lists them
export function rails(lang: Locale): Rail[] {
  const w = words[lang]
  return [
    { title: w.kit, items: kitRail(lang) },
    { title: w.net.title, items: netRail(lang) },
  ]
}
