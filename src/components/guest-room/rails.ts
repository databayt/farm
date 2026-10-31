import { frw } from "@/lib/format"
import { deviceRail } from "@/components/docs/room-points"
import type { Rail } from "@/components/docs/rail-table"
import type { RailItem } from "@/components/docs/item-rail"
import { D, guestRoomData } from "@/components/guest-room/data"
import room from "@/components/guest-room/guest-room.json"
import { words } from "@/components/guest-room/words"
import type { Locale } from "@/components/internationalization/config"
import { dictionary } from "@/components/internationalization/dictionaries"
import { railCards } from "@/components/page/sections"

// The guest room's rails, moved off its page so that the page (/[lang]/guest-room) and its Materials page in the docs
// (D-059) read one list, in the reader's language.
const m2 = (n: number) => +n.toFixed(2)

// The furniture rails: each piece rendered on its own by scripts/site/render/guest-room.html?item=<id>, sized from
// guest-room.json. Nothing is sourced or quoted yet; where the studio already carries a placeholder price for the
// same piece (AS-21), the card repeats it as an estimate.
const { bed, bedsides: bs, bench, wardrobe, desk, hooks, rug, veranda, bath } = room
export function bedRail(lang: Locale): RailItem[] {
  const t = words[lang].rails
  return railCards(`${D}/render/furniture`, [
    { id: "bed", title: t.bed.title, size: t.bed.size(m2(bed.w), m2(bed.l), m2(bed.frame), m2(bed.headboard)), note: t.bed.note },
    { id: "mattress", title: t.mattress.title, size: t.mattress.size(bed.w * 100, bed.l * 100, Math.round(bed.mattress * 100)),
      where: t.mattress.where, cost: t.mattress.cost(frw(180_000)) },
    { id: "bedding", title: t.bedding.title, size: t.bedding.size(bed.w * 100, bed.l * 100), note: t.bedding.note },
    { id: "bedside", title: t.bedside.title, size: t.bedside.size(m2(bs.w), m2(bs.d), m2(bs.h)), note: t.bedside.note },
    { id: "lamp", title: t.lamp.title, size: t.lamp.size, cost: t.lamp.cost(frw(35_000)), note: t.lamp.note },
    { id: "bench", title: t.bench.title, size: t.bench.size(m2(bench.w), m2(bench.d), m2(bench.h)), note: t.bench.note },
    { id: "rug", title: t.rug.title, size: t.rug.size(m2(rug.w), m2(rug.d)), note: t.rug.note },
  ], lang)
}
export function roomRail(lang: Locale): RailItem[] {
  const t = words[lang].rails
  return railCards(`${D}/render/furniture`, [
    { id: "wardrobe", title: t.wardrobe.title, size: t.wardrobe.size(m2(wardrobe.w), m2(wardrobe.d), m2(wardrobe.h)), note: t.wardrobe.note },
    { id: "desk", title: t.desk.title, size: t.desk.size(m2(desk.y1 - desk.y0), m2(desk.d), m2(desk.h)), note: t.desk.note },
    { id: "chair", title: t.chair.title, size: t.chair.size(m2(desk.chair.w), m2(desk.chair.d), m2(desk.chair.seat), m2(desk.chair.back)) },
    { id: "hooks", title: t.hooks.title, size: t.hooks.size(m2(hooks.y1 - hooks.y0), m2(hooks.h)), note: t.hooks.note },
    { id: "verandachair", title: t.verandachair.title,
      size: t.verandachair.size(m2(veranda.chair.w), m2(veranda.chair.d), m2(veranda.chair.seat), m2(veranda.chair.back)), note: t.verandachair.note },
    { id: "verandatable", title: t.verandatable.title, size: t.verandatable.size(m2(veranda.table.r * 2), m2(veranda.table.h)), note: t.verandatable.note },
  ], lang)
}

// The en-suite's rail (D-061), in the furniture's pattern: each fixture rendered on its own by guest-room.html?item=<id>.
// The studio carries no placeholder price for a floor-standing WC or a vessel basin, so none is quoted here.
const { tray, wc, basin } = bath
export function bathRail(lang: Locale): RailItem[] {
  const t = words[lang].rails
  return railCards(`${D}/render/furniture`, [
    { id: "shower", title: t.shower.title, size: t.shower.size(m2(tray.x1 - tray.x0), m2(tray.y1 - tray.y0), m2(bath.screen.h)), note: t.shower.note },
    { id: "wc", title: t.wc.title, size: t.wc.size(m2(wc.w), m2(wc.d), m2(wc.seat), m2(wc.cistern.h)), note: t.wc.note },
    { id: "basin", title: t.basin.title, size: t.basin.size(m2(basin.x1 - basin.x0), m2(basin.d), m2(basin.h)),
      note: t.basin.note(m2(basin.mirror.w), m2(basin.mirror.h)) },
  ], lang)
}

// each kind of electric device on its own, as the page's service rails show them
export function electricRail(lang: Locale): RailItem[] {
  const t = words[lang].rails
  return deviceRail(guestRoomData(lang).points, (m) => `${D}/render/electric/${m}.webp`, {
    isolator: { title: t.isolators },
    heater: { cost: t.heaterCost(frw(90_000)) },
  }, lang)
}

// every rail, as the Materials page lists them
export function rails(lang: Locale): Rail[] {
  const s = words[lang].sections
  return [
    { title: s.bed, items: bedRail(lang) },
    { title: s.room, items: roomRail(lang) },
    { title: s.bath, items: bathRail(lang) },
    { title: dictionary(lang).page.electric, items: electricRail(lang) },
  ]
}
