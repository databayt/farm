import { railCards } from "@/components/page/sections"
import { type RailItem } from "@/components/docs/item-rail"
import { D, ELECTRIC, WATER } from "@/components/galley/data"
import G from "@/components/galley/galley.json"
import { metres } from "@/components/galley/service-diagrams"
import type { Rail } from "@/components/docs/rail-table"

// The galley's rails, moved off its page so that the page (/[lang]/galley) and its Materials page in the docs
// (D-059) read one list.
// The equipment, the power and the water, in the studio's pattern (the water and the power read in data.ts). Every
// size comes from galley.json; nothing is sourced or priced yet, so no card names a shop or a price.
const m = (n: number) => `${+n.toFixed(2)} m`
const span = (u: { x0: number; x1: number }) => u.x1 - u.x0

// The Equipment rail: each piece rendered on its own by galley.html?item=<id>, from the 3D's own meshes
export function equipmentRail() {
  const unit = (id: string) => [...G.cold.units, ...G.line.units].find((u) => u.id === id)!
  const sinks = Object.fromEntries(G.worktop.sinks.map((s) => [s.id, s]))
  const kw = (id: string) => ELECTRIC.circuits.find((c) => c.serves.toLowerCase().startsWith(id))?.kw
  return railCards(`${D}/render/equipment`, [
    { id: "range", title: "Range and oven", size: `${m(span(unit("range")))} × ${m(G.line.d)}, ${m(G.line.h)} high`, note: `Six rings over an oven, about ${kw("range")} kW if electric (a design value: gas or electric is still open).` },
    { id: "griddle", title: "Griddle", size: `${m(span(unit("griddle")))} × ${m(G.line.d)}, ${m(G.line.h)} high`, note: `A steel plate behind a grease channel, about ${kw("griddle")} kW if electric.` },
    { id: "fryer", title: "Fryer", size: `${m(span(unit("fryer")))} × ${m(G.line.d)}, ${m(G.line.h)} high`, note: `One tank, two baskets, about ${kw("fryer")} kW if electric.` },
    { id: "hood", title: "Extract hood", size: `${m(span(G.hood))} × ${m(G.hood.d)}, lower edge ${m(G.hood.y0)} up, ${G.hood.duct * 1000} mm duct`, note: "A stainless canopy, its duct up through the roof to the fan; the line only runs while the fan runs." },
    { id: "freezer", title: "Upright freezer", size: `${m(span(unit("freezer")))} × ${m(G.cold.d)}, ${m(G.cold.h)} high`, note: "Stainless, one door, across from the staff door." },
    { id: "fridge", title: "Two-door fridge", size: `${m(span(unit("fridge")))} × ${m(G.cold.d)}, ${m(G.cold.h)} high`, note: "Stainless upright, where the harvest, the eggs and the deliveries go first." },
    { id: "bench", title: "Cold bench", size: `${m(span(G.bench))} × ${m(G.bench.d)}, ${m(G.bench.h)} high`, note: "An undercounter fridge with two doors under a stainless top: breakfast's eggs, milk and fruit." },
    { id: "pass", title: "The pass", size: `${m(span(G.pass))} × ${m(G.pass.d)}, ${m(G.pass.h)} high, gantry at ${m(G.pass.gantry)}`, note: "A heated plate cupboard under a heated top, three heat lamps under the gantry's shelf." },
    { id: "worktop", title: "Worktop and two sinks", size: `${m(span(G.worktop))} × ${m(G.worktop.d)}, ${m(G.worktop.h)} high`, note: `Stainless on legs with an undershelf. Prep sink ${sinks.prep.w * 1000} × ${sinks.prep.d * 1000} mm, ${sinks.prep.depth * 1000} deep; wash-up sink ${sinks.wash.w * 1000} × ${sinks.wash.d * 1000} mm, ${sinks.wash.depth * 1000} deep, with a pre-rinse spray.` },
    { id: "dry", title: "Dry store shelving", size: `${m(span(G.dry))} × ${m(G.dry.d)}, ${G.dry.shelves.length} shelves to ${m(G.dry.shelves.at(-1)!)}`, note: "Stainless: sacks of rice, flour and beans below, tubs, oil, jars and tins above." },
    { id: "basin", title: "Hand-wash basin", size: `${m(span(G.basin))} × ${m(G.basin.d)}, ${m(G.basin.h)} high`, note: "Hands only, by the staff door: a hands-free tap, soap and paper towels beside it." },
    { id: "cleaning", title: "Cleaning cupboard", size: `${m(span(G.cleaning))} × ${m(G.cleaning.d)}, ${m(G.cleaning.h)} high`, note: "Mops, buckets and the cleaning products, apart from the food." },
    { id: "plates", title: "Plate cupboard", size: `${m(G.container.inner.x1 - G.plates.x0)} × ${m(G.container.inner.y1 - G.plates.y0)}, ${m(G.plates.h)} high`, note: "Clean plates, bowls and cutlery by the service door, a landing for trays on top." },
    { id: "bins", title: "Pedal bins × 2", size: `${m(G.bins.w)} × ${m(G.bins.d)}, ${m(G.bins.h)} high each`, note: "One for scraps (to the hens and the compost), one for waste." },
    { id: "fire", title: "Fire point", size: "An extinguisher on its bracket, a fire blanket above it", note: "For cooking-oil fires, on the east end wall by the service door." },
  ])
}

// The Water rail, by part; the note names the points that use it
const WATER_PARTS: { item: string; title: string }[] = [
  { item: "meter", title: "Stop valve, filter and meter" }, { item: "heater", title: "Water heater" }, { item: "mixer", title: "Sink mixer" },
  { item: "prerinse", title: "Pre-rinse spray" }, { item: "basintap", title: "Hands-free basin tap" }, { item: "filter", title: "Drinking-water filter" },
  { item: "aav", title: "Air admittance valve" }, { item: "gully", title: "Floor gully" }, { item: "greasetrap", title: "Grease trap" },
]
export function waterRail(): RailItem[] {
  const parts = WATER_PARTS.map(({ item, title }) => {
    const pts = WATER.points.filter((p) => p.item === item)
    return { id: item, title: pts.length > 1 ? `${title} × ${pts.length}` : title, size: pts[0].size, note: `${pts.map((p) => p.id).join(", ")} · ${pts[0].where}.` }
  })
  const of = (...sys: string[]) => WATER.runs.filter((r) => sys.includes(r.system))
  return railCards(`${D}/render/water`, [...parts,
    { id: "ppr", title: "PP-R supply pipe", size: metres(of("cold", "hot")), note: "Cold and hot, PN20, welded joints, along the front wall under the worktop and up to each outlet." },
    { id: "upvc", title: "uPVC drain pipe", size: metres(of("waste")), note: "Each waste down through the floor to the collector under the plinth, at 1:40 or steeper." },
  ])
}

// The Electric rail, by device
const DEVICES: { model: string; title: string }[] = [
  { model: "board", title: "Distribution board" }, { model: "isolator", title: "Isolators" }, { model: "outlet", title: "Connection boxes" },
  { model: "estop", title: "Emergency stop" }, { model: "control", title: "Hood control" }, { model: "fan", title: "Roof extract fan" },
  { model: "socket", title: "Double socket IP44" }, { model: "single", title: "Fridge socket" }, { model: "batten", title: "LED batten IP65" },
  { model: "switch", title: "Light switch" }, { model: "alarm", title: "Heat alarm" }, { model: "earth", title: "Earth rod" },
]
export function electricRail(): RailItem[] {
  return railCards(`${D}/render/electric`, DEVICES.map(({ model, title }) => {
    const pts = ELECTRIC.points.filter((p) => p.model === model)
    const on = [...new Set(pts.map((p) => p.circuit).filter(Boolean))]
    return { id: model, title: pts.length > 1 ? `${title} × ${pts.length}` : title, size: pts[0].size,
      note: `${pts.map((p) => p.id).join(", ")}${on.length ? ` · ${on.join(", ")}` : ""} · ${[...new Set(pts.map((p) => p.what))].join("; ")}` }
  }))
}

// every rail, as the Materials page lists them
export const rails: Rail[] = [
  { title: "Equipment", items: equipmentRail() },
  { title: "Electric", items: electricRail() },
  { title: "Plumbing", items: waterRail() },
]
