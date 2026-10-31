import { railCards } from "@/components/page/sections"
import { type RailItem } from "@/components/docs/item-rail"
import B from "@/components/bar/bar.json"
import { barData, D } from "@/components/bar/data"
import { words } from "@/components/bar/words"
import type { Locale } from "@/components/internationalization/config"
import { metres } from "@/components/galley/service-diagrams"
import type { Rail } from "@/components/docs/rail-table"
import { dictionary } from "@/components/internationalization/dictionaries"

// The bar's rails, moved off its page so that the page (/[lang]/bar) and its Materials page in the docs
// (D-059) read one list.
// The equipment, the power and the water, in the studio's pattern (the galley's diagrams; the water and the power read
// in data.ts). Every size comes from bar.json; nothing is sourced or priced yet, so no card names a shop or a price.
const I = B.inside, LO = B.lounge
const m = (n: number) => `${+n.toFixed(2)} m`
const span = (u: { x0: number; x1: number }) => u.x1 - u.x0

// The Equipment rail: each piece rendered on its own by bar.html?item=<id>, from the 3D's own meshes
export function equipmentRail(lang: Locale): RailItem[] {
  const t = words[lang].rails.equipment
  const { ELECTRIC } = barData(lang)
  const kw = (id: string) => ELECTRIC.circuits.find((c) => c.id === id)?.kw
  const fridges = I.front.units.filter((u) => u.id === "fridge")
  const sink = I.front.units.find((u) => u.id === "sink")!
  return railCards(`${D}/render/equipment`, [
    { id: "coffee", title: t.coffee.title, size: t.coffee.size(m(span(I.back.coffee))), note: t.coffee.note(kw("C3")) },
    { id: "grinder", title: t.grinder.title, size: t.grinder.size(m(span(I.back.grinder))), note: t.grinder.note },
    { id: "fridge", title: t.fridge.title(fridges.length), size: t.fridge.size(m(span(fridges[0])), m(I.front.d)), note: t.fridge.note },
    { id: "sink", title: t.sink.title, size: t.sink.size(m(span(sink)), m(I.front.d)), note: t.sink.note },
    { id: "shelves", title: t.shelves.title, size: t.shelves.size(m(span(I.back)), m(I.back.shelf), I.back.shelves.map((h) => m(h)).join(", ")), note: t.shelves.note },
    { id: "store", title: t.store.title, size: t.store.size(m(span(I.store)), m(I.store.d), m(I.store.h)), note: t.store.note },
    { id: "chair", title: t.chair.title(LO.pairs.length * 2), size: t.chair.size(m(LO.chair.w), m(LO.chair.d), m(LO.chair.seat)), note: t.chair.note },
    { id: "table", title: t.table.title(LO.pairs.length), size: t.table.size(m(LO.table.r * 2), m(LO.table.h)), note: t.table.note },
  ], lang)
}

const WATER_PARTS = ["meter", "scalefilter", "heater", "mixer", "aav", "greasetrap"] as const
export function waterRail(lang: Locale): RailItem[] {
  const t = words[lang].rails.water
  const { WATER } = barData(lang)
  const parts = WATER_PARTS.map((item) => {
    const p = WATER.points.find((q) => q.item === item)!
    return { id: item, title: t[item], size: p.size, note: `${p.id} · ${p.where}.` }
  })
  const of = (...sys: string[]) => WATER.runs.filter((r) => sys.includes(r.system))
  return railCards(`${D}/render/water`, [...parts,
    { id: "ppr", title: t.ppr.title, size: metres(of("cold", "hot"), lang), note: t.ppr.note },
    { id: "upvc", title: t.upvc.title, size: metres(of("waste"), lang), note: t.upvc.note },
  ], lang)
}

const DEVICES = ["board", "isolator", "socket", "single", "ceiling", "strip", "bar", "switch", "alarm", "earth"]
export function electricRail(lang: Locale): RailItem[] {
  const t = words[lang].rails.electric
  const { ELECTRIC } = barData(lang)
  return railCards(`${D}/render/electric`, DEVICES.map((model) => {
    const pts = ELECTRIC.points.filter((p) => p.model === model)
    const on = [...new Set(pts.map((p) => p.circuit).filter(Boolean))]
    return { id: model, title: pts.length > 1 ? `${t[model]} × ${pts.length}` : t[model], size: pts[0].size,
      note: `${pts.map((p) => p.id).join(", ")}${on.length ? ` · ${on.join(", ")}` : ""} · ${[...new Set(pts.map((p) => p.what))].join("; ")}` }
  }), lang)
}

// every rail, as the Materials page lists them
export function rails(lang: Locale): Rail[] {
  const t = dictionary(lang).page
  return [
    { title: t.equipment, items: equipmentRail(lang) },
    { title: t.electric, items: electricRail(lang) },
    { title: t.plumbing, items: waterRail(lang) },
  ]
}
