import { deviceRail } from "@/components/docs/room-points"
import type { Rail } from "@/components/docs/rail-table"
import type { RailItem } from "@/components/docs/item-rail"
import type { Locale } from "@/components/internationalization/config"
import { dictionary } from "@/components/internationalization/dictionaries"
import { railCards } from "@/components/page/sections"
import { D, studyRoomData } from "@/components/study-room/data"
import room from "@/components/study-room/study-room.json"
import { words } from "@/components/study-room/words"

// The study room's rails, moved off its page so that the page (/[lang]/study-room) and its Materials page in the docs
// (D-059) read one list, in the reader's language.
const m2 = (n: number) => +n.toFixed(2)

// The rails: each piece rendered on its own by scripts/site/render/study-room.html?item=<id>, sized from
// study-room.json. Nothing is sourced or priced yet.
const { table, screen, shelves, reading, room: inner } = room
export function tableRail(lang: Locale): RailItem[] {
  const t = words[lang].rails
  return railCards(`${D}/render/furniture`, [
    { id: "table", title: t.table.title, size: t.table.size(m2(table.l), m2(table.w), m2(table.h)), note: t.table.note(table.seats.length) },
    { id: "chair", title: t.chair.title(table.seats.length * 2), size: t.chair.size(m2(table.chair.w), m2(table.chair.d), m2(table.chair.seat), m2(table.chair.back)),
      note: t.chair.note },
    { id: "screen", title: t.screen.title, size: t.screen.size(m2(screen.w), m2(screen.h), m2(screen.y0)), note: t.screen.note },
    { id: "cabinet", title: t.cabinet.title, size: t.cabinet.size(m2(screen.cabinet.l), m2(screen.cabinet.d), m2(screen.cabinet.h)) },
    { id: "lectern", title: t.lectern.title, size: t.lectern.size(m2(screen.lectern.w), m2(screen.lectern.d), m2(screen.lectern.h)), note: t.lectern.note },
  ], lang)
}
export function cornerRail(lang: Locale): RailItem[] {
  const t = words[lang].rails
  return railCards(`${D}/render/furniture`, [
    { id: "shelves", title: t.shelves.title, size: t.shelves.size(m2(inner.front - inner.back), m2(shelves.d)), note: t.shelves.note(shelves.bays, shelves.rows) },
    { id: "armchair", title: t.armchair.title, size: t.armchair.size(m2(reading.chair.w), m2(reading.chair.d), m2(reading.chair.seat)), note: t.armchair.note },
    { id: "sidetable", title: t.sidetable.title, size: t.sidetable.size(m2(reading.table.r * 2), m2(reading.table.h)) },
    { id: "floorlamp", title: t.floorlamp.title, size: t.floorlamp.size(m2(reading.lamp.h)), note: t.floorlamp.note },
    { id: "rug", title: t.rug.title, size: t.rug.size(m2(reading.rug.x[1] - reading.rug.x[0]), m2(reading.rug.y[1] - reading.rug.y[0])), note: t.rug.note },
  ], lang)
}

// each kind of electric device on its own, as the page's service rails show them
export function electricRail(lang: Locale): RailItem[] {
  const t = words[lang].rails
  return deviceRail(studyRoomData(lang).points, (m) => `${D}/render/electric/${m}.webp`, { pendant: { size: t.pendant }, wallfan: { size: t.wallfan } }, lang)
}

// every rail, as the Materials page lists them
export function rails(lang: Locale): Rail[] {
  const s = words[lang].sections
  return [
    { title: s.table, items: tableRail(lang) },
    { title: s.reading, items: cornerRail(lang) },
    { title: dictionary(lang).page.electric, items: electricRail(lang) },
  ]
}
