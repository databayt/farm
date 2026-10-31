import { railCards } from "@/components/page/sections"
import { type RailItem } from "@/components/docs/item-rail"
import type { Locale } from "@/components/internationalization/config"
import { dictionary } from "@/components/internationalization/dictionaries"
import { D, degC, frw, mm, readCsv, studioCsv } from "@/components/studio/data"
import { words } from "@/components/studio/words"
import { bedStock } from "@/lib/bed-stock"

// The studio's rails, moved off its page (/[lang]/studio) beside its words: each piece rendered on its own by
// scripts/studio/render/room.html?item=<id>, with what it measures, where it comes from and what it costs. Prices are
// the BOM's placeholders (AS-21) until quoted.

// The Bed rail
export function bedRail(lang: Locale): RailItem[] {
  const t = words[lang].rails, b = t.bed
  const k5 = readCsv("cut-list.csv").filter((r) => r.kit === "K5")
    .reduce((a, r) => a + (Number(r.length_mm) * Number(r.width_mm)) / 1e6, 0)
  const board = (k5 / (2.44 * 1.22)) * 45_000
  const items = [
    { id: "bed", title: b.bed.title, size: b.bed.size, where: b.bed.where, cost: b.bed.cost(frw(Math.round(bedStock().total))), note: b.bed.note },
    { id: "mattress", title: b.mattress.title, size: b.mattress.size, where: b.mattress.where, cost: t.est(frw(180_000)), note: b.mattress.note },
    { id: "sheets", title: b.sheets.title, size: b.sheets.size },
    { id: "duvet", title: b.duvet.title, size: b.duvet.size },
    { id: "pillow", title: b.pillow.title, size: b.pillow.size },
    { id: "bedside", title: b.bedside.title, size: b.bedside.size, where: b.bedside.where, cost: b.bedside.cost(frw(Math.round(board))), note: b.bedside.note },
    { id: "lamp", title: b.lamp.title, size: b.lamp.size, cost: t.est(frw(35_000)), note: b.lamp.note },
    { id: "walllamp", title: b.walllamp.title, size: b.walllamp.size, where: b.walllamp.where, cost: t.est(frw(15_000)), note: b.walllamp.note },
  ]
  return railCards(`${D}/render/bedroom`, items, lang)
}

// board for the pieces the workshop cuts (cut-list.csv), priced by the share of each sheet they take
const SHEET_RWF: Record<string, number> = { PLY18: 45_000, PLY12: 35_000 }
function boardCost(keep: (id: string) => boolean) {
  return readCsv("cut-list.csv").filter((r) => keep(r.id)).reduce((n, r) =>
    n + (r.material === "WTOP38" ? 90_000 : ((Number(r.length_mm) * Number(r.width_mm)) / (2440 * 1220)) * (SHEET_RWF[r.material] ?? 0)), 0)
}
const hundreds = (n: number) => frw(Math.round(n / 100) * 100)
const est = (lang: Locale, n: number) => words[lang].rails.est(hundreds(n))
const built = (lang: Locale, n: number, what: "board" | "both" | "worktop" = "board") => `RWF ${hundreds(n)} ${words[lang].rails.built[what]}`

// The Seating, Galley and Bath rails, in the Bed rail's pattern: renders from room.html?item=<id> (the room's
// own meshes, so the picture is the piece in the 3D view); sizes from render/scene.json and the BOM
export function seatingRail(lang: Locale): RailItem[] {
  const s = words[lang].rails.seating
  return railCards(`${D}/render/seating`, [
    { id: "sofa", title: s.sofa.title, size: s.sofa.size, cost: est(lang, 450_000), note: s.sofa.note },
    { id: "table", title: s.table.title, size: s.table.size, where: s.workshop,
      cost: built(lang, boardCost((id) => /^K6-0[1-3]$/.test(id))), note: s.table.note },
    { id: "chairs", title: s.chairs.title, size: s.chairs.size, where: s.workshop,
      cost: built(lang, boardCost((id) => /^K6-(0[4-9]|1[01])$/.test(id)), "both") },
  ], lang)
}
export function galleyRail(lang: Locale): RailItem[] {
  const t = words[lang].rails, g = t.galley
  return railCards(`${D}/render/galley`, [
    { id: "units", title: g.units.title, size: g.units.size, where: g.units.where,
      cost: built(lang, boardCost((id) => /^K3-(0|H-|S-|PL|WT)/.test(id)) + 8 * 1_500, "worktop"), note: g.units.note },
    { id: "fridge", title: g.fridge.title, size: g.fridge.size, where: g.fridge.where, cost: `RWF ${frw(265_000)}`, note: g.fridge.note },
    { id: "hob", title: g.hob.title, size: g.hob.size, cost: est(lang, 250_000), note: g.hob.note },
    { id: "sink", title: g.sink.title, size: g.sink.size, where: t.hardware, cost: est(lang, 70_000 + 45_000), note: g.sink.note },
    { id: "hood", title: g.hood.title, size: g.hood.size, cost: est(lang, 90_000 + boardCost((id) => id === "K3-HS")), note: g.hood.note },
    { id: "overhead", title: g.overhead.title, size: g.overhead.size, where: g.overhead.where,
      cost: built(lang, boardCost((id) => id.startsWith("K3-T-"))), note: g.overhead.note },
  ], lang)
}
export function bathRail(lang: Locale): RailItem[] {
  const t = words[lang].rails, b = t.bath
  return railCards(`${D}/render/bath`, [
    { id: "shower", title: b.shower.title, size: b.shower.size, where: t.hardware, cost: est(lang, 120_000 + 180_000), note: b.shower.note },
    { id: "wc", title: b.wc.title, size: b.wc.size, where: t.hardware, cost: est(lang, 150_000 + 220_000), note: b.wc.note },
    { id: "basin", title: b.basin.title, size: b.basin.size, where: t.hardware, cost: est(lang, 90_000), note: b.basin.note },
    { id: "mirror", title: b.mirror.title, size: b.mirror.size, where: t.hardware, cost: est(lang, 25_000), note: b.mirror.note },
  ], lang)
}

// The Electric rail: one card per device, rendered on its own by room.html?item=<model> (the 3D view's own
// device), its size from points.csv, its cost from the BOM (placeholders, AS-21) and the points that use it.
// Nothing electrical is sourced yet, so no card names a shop.
const DEVICE_CARDS: { models: string[]; src?: string }[] = [
  { models: ["board"] }, { models: ["inlet"] }, { models: ["ceiling"] }, { models: ["bulkhead"] },
  { models: ["walllamp"], src: `${D}/render/bedroom/walllamp.webp` },
  { models: ["strip"] }, { models: ["switch"] }, { models: ["switch65"] }, { models: ["usb"] },
  { models: ["socket2", "socket"] }, { models: ["socket66"] }, { models: ["outlet"] },
  { models: ["isolator"] }, { models: ["wallfan"] }, { models: ["extract"] }, { models: ["alarm"] }, { models: ["earth"] },
]
export function electricRail(lang: Locale): RailItem[] {
  const t = words[lang].rails, r = dictionary(lang).rail
  const points = studioCsv("points.csv", lang)
  // the BOM names each device by its English description
  const english = Object.fromEntries(readCsv("points.csv").map((p) => [p.point, p.description]))
  const bom = readCsv("bom.csv")
  const price = (p: Record<string, string>) => Number(bom.find((b) => b.item === english[p.point])?.unit_price_rwf ?? 0)
  const sum = (re: RegExp) => bom.filter((b) => b.kit === "K8" && re.test(b.item)).reduce((n, b) => n + Number(b.total_per_unit_rwf), 0)
  return DEVICE_CARDS.map(({ models, src }) => {
    const title = t.devices[models[0]]
    const pts = points.filter((p) => models.includes(p.model))
    const [w, h, d] = ["w_mm", "h_mm", "d_mm"].map((k) => Number(pts[0][k]))
    const m = pts[0].model, z = t.deviceSize
    const size = m === "ceiling" || m === "alarm" ? z.round(w, d)
      : m === "strip" ? z.strip(w / 1000, h)
      : m === "earth" ? z.earth(h / 1000, w)
      : models.length > 1 ? z.sockets
      : z.box(w, h, d)
    const each = price(pts[0]), c = t.deviceCost
    const cost = m === "board" ? c.board(frw(each), frw(each + sum(/^(Main breaker|Surge protection|RCBOs|Priority relay|Contactor)/)))
      : m === "inlet" ? c.inlet(frw(each), frw(each + sum(/^(Matching|Cable \d+ mm2 tails)/)))
      : pts.every((p) => price(p) === each) ? c.each(frw(each), pts.length)
      : c.all(frw(pts.reduce((n, p) => n + price(p), 0)), pts.length)
    const on = [...new Set(pts.map((p) => p.circuit).filter(Boolean))]
    return {
      src: src ?? `${D}/render/electric/${m}.webp`, alt: title, title,
      note: `${pts.map((p) => p.point).join(", ")}${on.length ? ` · ${on.join(", ")}` : ""} · ${pts.length === 1 ? pts[0].description : pts.map((p) => p.description).join("; ")}`,
      details: [{ label: r.dimensions, value: size }, { label: r.whereToBuy, value: r.notSourced }, { label: r.cost, value: cost }],
    }
  })
}

// The Plumbing rail, in the Electric rail's pattern: each fitting rendered where it stands by room.html?item=<model>
// (the 3D view's own piece), then the pipe; sizes from fittings.csv and the BOM's lengths, costs from the BOM
// (placeholders, AS-21), and a shop where the sourcing notes name one.
export function plumbingRail(lang: Locale): RailItem[] {
  const t = words[lang].rails, p = t.pipe, r = dictionary(lang).rail
  const fittings = studioCsv("fittings.csv", lang)
  const bom = readCsv("bom.csv").filter((b) => b.trade === "plumbing")
  const lines = (re: RegExp) => bom.filter((b) => re.test(b.item))
  const cost = (re: RegExp) => p.cost(frw(lines(re).reduce((n, b) => n + Number(b.total_per_unit_rwf), 0)))
  const metres = (re: RegExp) => {
    const by = new Map<string, number>()
    for (const b of lines(re)) { const dn = b.item.match(/DN\d+/)![0]; by.set(dn, (by.get(dn) ?? 0) + Number(b.qty_per_unit)) }
    return [...by].map(([dn, m]) => p.metres(+m.toFixed(1), dn)).join(", ")
  }
  const f = Object.fromEntries(fittings.map((x) => [x.model, x]))
  const each = (model: string) => est(lang, Number(bom.find((b) => b.item === f[model].item)?.total_per_unit_rwf ?? 0))
  const card = (model: string, title: string, size: string, where: string, cost: string, note?: string): RailItem => ({
    src: `${D}/render/plumbing/${model}.webp`, alt: title, title,
    note: note ?? `${f[model].point} · ${f[model].description}`,
    details: [{ label: r.dimensions, value: size }, { label: r.whereToBuy, value: where }, { label: r.cost, value: cost }],
  })
  const valves = lines(/^Angle valves/)[0]
  return [
    card("meter", p.meter.title, p.meter.size(f.meter.h_mm), r.notSourced, each("meter")),
    card("heater", p.heater.title, p.heater.size(f.heater.w_mm, f.heater.h_mm, f.heater.d_mm, degC(f.heater.rating)),
      r.notSourced, each("heater"), p.heater.note),
    card("kitchentap", p.kitchentap.title, p.kitchentap.size(f.kitchentap.rating), t.hardware, each("kitchentap")),
    card("filter", p.filter.title, p.filter.size(f.filter.w_mm, f.filter.h_mm), r.notSourced, each("filter")),
    card("showerset", p.showerset.title, p.showerset.size(Number(f.showerset.h_mm) / 1000), t.hardware, each("showerset")),
    card("cistern", p.cistern.title, p.cistern.size(f.cistern.w_mm, mm(Number(f.cistern.h_mm)), f.cistern.d_mm), t.hardware, each("cistern")),
    card("basintap", p.basintap.title, p.basintap.size, t.hardware,
      p.basintap.cost(frw(Number(bom.find((b) => b.item === f.basintap.item)?.total_per_unit_rwf ?? 0)))),
    card("anglevalve", p.anglevalve.title(valves.qty_per_unit), p.anglevalve.size, t.hardware,
      p.anglevalve.cost(frw(Number(valves.unit_price_rwf)), valves.qty_per_unit), p.anglevalve.note),
    card("ppr", p.ppr.title, p.ppr.size(metres(/^PPR/)), p.shops, cost(/^PPR/), p.ppr.note),
    card("upvc", p.upvc.title, metres(/^uPVC (soil|waste)/), p.shops, cost(/^uPVC (soil|waste)/), p.upvc.note),
    card("vent", p.vent.title, p.vent.size(metres(/^uPVC vent/)), p.shops, cost(/^(uPVC vent|Air admittance)/), p.vent.note),
  ]
}
