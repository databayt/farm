import { railCards } from "@/components/page/sections"
import { type RailItem } from "@/components/docs/item-rail"
import { D, galleyData } from "@/components/galley/data"
import G from "@/components/galley/galley.json"
import { words } from "@/components/galley/words"
import { metres } from "@/components/galley/service-diagrams"
import type { Rail } from "@/components/docs/rail-table"
import type { Locale } from "@/components/internationalization/config"
import { dictionary } from "@/components/internationalization/dictionaries"

// The galley's rails, moved off its page so that the page (/[lang]/galley) and its Materials page in the docs
// (D-059) read one list.
// The equipment, the power and the water, in the studio's pattern (the water and the power read in data.ts). Every
// size comes from galley.json; nothing is sourced or priced yet, so no card names a shop or a price.
const m = (n: number) => `${+n.toFixed(2)} m`
const span = (u: { x0: number; x1: number }) => u.x1 - u.x0

// The Equipment rail: each piece rendered on its own by galley.html?item=<id>, from the 3D's own meshes
export function equipmentRail(lang: Locale): RailItem[] {
  const t = words[lang].rails.equipment
  const unit = (id: string) => [...G.cold.units, ...G.line.units].find((u) => u.id === id)!
  const sinks = Object.fromEntries(G.worktop.sinks.map((s) => [s.id, s]))
  const line = (id: string) => t.box(m(span(unit(id))), m(G.line.d), m(G.line.h))
  return railCards(`${D}/render/equipment`, [
    { id: "range", title: t.range.title, size: line("range"), note: t.range.note() },
    { id: "griddle", title: t.griddle.title, size: line("griddle"), note: t.griddle.note() },
    { id: "fryer", title: t.fryer.title, size: line("fryer"), note: t.fryer.note() },
    { id: "hood", title: t.hood.title, size: t.hood.size(m(span(G.hood)), m(G.hood.d), m(G.hood.y0), G.hood.duct * 1000), note: t.hood.note },
    { id: "freezer", title: t.freezer.title, size: t.box(m(span(unit("freezer"))), m(G.cold.d), m(G.cold.h)), note: t.freezer.note },
    { id: "fridge", title: t.fridge.title, size: t.box(m(span(unit("fridge"))), m(G.cold.d), m(G.cold.h)), note: t.fridge.note },
    { id: "bench", title: t.bench.title, size: t.box(m(span(G.bench)), m(G.bench.d), m(G.bench.h)), note: t.bench.note },
    { id: "pass", title: t.pass.title, size: t.pass.size(m(span(G.pass)), m(G.pass.d), m(G.pass.h), m(G.pass.gantry)), note: t.pass.note },
    { id: "worktop", title: t.worktop.title, size: t.box(m(span(G.worktop)), m(G.worktop.d), m(G.worktop.h)),
      note: t.worktop.note(sinks.prep.w * 1000, sinks.prep.d * 1000, sinks.prep.depth * 1000, sinks.wash.w * 1000, sinks.wash.d * 1000, sinks.wash.depth * 1000) },
    { id: "dry", title: t.dry.title, size: t.dry.size(m(span(G.dry)), m(G.dry.d), G.dry.shelves.length, m(G.dry.shelves.at(-1)!)), note: t.dry.note },
    { id: "basin", title: t.basin.title, size: t.box(m(span(G.basin)), m(G.basin.d), m(G.basin.h)), note: t.basin.note },
    { id: "cleaning", title: t.cleaning.title, size: t.box(m(span(G.cleaning)), m(G.cleaning.d), m(G.cleaning.h)), note: t.cleaning.note },
    { id: "plates", title: t.plates.title, size: t.box(m(G.container.inner.x1 - G.plates.x0), m(G.container.inner.y1 - G.plates.y0), m(G.plates.h)), note: t.plates.note },
    { id: "bins", title: t.bins.title, size: t.bins.size(m(G.bins.w), m(G.bins.d), m(G.bins.h)), note: t.bins.note },
    { id: "fire", title: t.fire.title, size: t.fire.size, note: t.fire.note },
  ], lang)
}

// The Water rail, by part; the note names the points that use it
const WATER_PARTS = ["meter", "heater", "mixer", "prerinse", "basintap", "filter", "aav", "gully", "greasetrap"]
export function waterRail(lang: Locale): RailItem[] {
  const t = words[lang].rails.water
  const { WATER } = galleyData(lang)
  const parts = WATER_PARTS.map((item) => {
    const pts = WATER.points.filter((p) => p.item === item), title = t.parts[item]
    return { id: item, title: pts.length > 1 ? `${title} × ${pts.length}` : title, size: pts[0].size, note: `${pts.map((p) => p.id).join(", ")} · ${pts[0].where}.` }
  })
  const of = (...sys: string[]) => WATER.runs.filter((r) => sys.includes(r.system))
  return railCards(`${D}/render/water`, [...parts,
    { id: "ppr", title: t.ppr.title, size: metres(of("cold", "hot"), lang), note: t.ppr.note },
    { id: "upvc", title: t.upvc.title, size: metres(of("waste"), lang), note: t.upvc.note },
  ], lang)
}

// The Electric rail, by device
const DEVICES = ["board", "isolator", "outlet", "estop", "control", "fan", "socket", "single", "batten", "switch", "alarm", "earth"]
export function electricRail(lang: Locale): RailItem[] {
  const t = words[lang].rails.electric
  const { ELECTRIC } = galleyData(lang)
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
