import { deviceRail } from "@/components/docs/room-points"
import type { Rail } from "@/components/docs/rail-table"
import type { RailItem } from "@/components/docs/item-rail"
import type { Locale } from "@/components/internationalization/config"
import { dictionary } from "@/components/internationalization/dictionaries"
import { railCards } from "@/components/page/sections"
import { D, officeData } from "@/components/office/data"
import office from "@/components/office/office.json"
import { words } from "@/components/office/words"

// The office's rails, moved off its page so that the page (/[lang]/office) and its Materials page in the docs
// (D-059) read one list, in the reader's language.
const m2 = (n: number) => +n.toFixed(2)

// The Furniture and equipment rail: each piece rendered on its own by scripts/site/render/office.html?item=<id>,
// sized from office.json. Nothing is sourced or priced yet.
const { sofa, workstation: ws, cafe } = office
const roomW = m2(office.container.inner.y1 - office.container.inner.y0)
export function furnitureRail(lang: Locale): RailItem[] {
  const t = words[lang].rails
  return railCards(`${D}/render/furniture`, [
    { id: "sofa", title: t.sofa.title, size: t.sofa.size(m2(sofa.x1 - office.container.inner.x0), roomW, m2(sofa.d)), note: t.sofa.note },
    { id: "sofatable", title: t.sofatable.title, size: t.sofatable.size(m2(sofa.table.x1 - sofa.table.x0), m2(sofa.table.y1 - sofa.table.y0)), note: t.sofatable.note },
    { id: "bigdesk", title: t.bigdesk.title, size: t.bigdesk.size(roomW, m2(ws.d)), note: t.bigdesk.note },
    { id: "display", title: t.display.title, size: t.display.size(m2(ws.display.w), m2(ws.display.foot)), note: t.display.note },
    { id: "macstudio", title: t.macstudio.title, size: t.macstudio.size(m2(ws.mac.w)), note: t.macstudio.note },
    { id: "keyboard", title: t.keyboard.title, size: t.keyboard.size, note: t.keyboard.note },
    { id: "gamingchair", title: t.gamingchair.title, size: t.gamingchair.size, note: t.gamingchair.note },
    { id: "cafetable", title: t.cafetable.title, size: t.cafetable.size(m2(cafe.table.r * 2), m2(cafe.table.h)), note: t.cafetable.note },
    { id: "cafechair", title: t.cafechair.title, size: t.cafechair.size(m2(cafe.chair.w), m2(cafe.chair.d), m2(cafe.chair.seat)), note: t.cafechair.note },
  ], lang)
}

// each kind of electric device on its own and each piece of network gear, as the page's service rails show them
export const electricRail = (lang: Locale): RailItem[] => deviceRail(officeData(lang).points, (m) => `${D}/render/electric/${m}.webp`, {}, lang)
export const networkRail = (lang: Locale): RailItem[] => deviceRail(officeData(lang).netPoints, (m) => `${D}/render/network/${m}.webp`, {}, lang)

// every rail, as the Materials page lists them
export function rails(lang: Locale): Rail[] {
  const s = words[lang].sections
  return [
    { title: s.furniture, items: furnitureRail(lang) },
    { title: dictionary(lang).page.electric, items: electricRail(lang) },
    { title: s.network, items: networkRail(lang) },
  ]
}
