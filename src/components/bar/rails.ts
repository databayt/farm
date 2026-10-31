import { railCards } from "@/components/page/sections"
import { type RailItem } from "@/components/docs/item-rail"
import B from "@/components/bar/bar.json"
import { D, ELECTRIC, WATER } from "@/components/bar/data"
import { metres } from "@/components/galley/service-diagrams"
import type { Rail } from "@/components/docs/rail-table"

// The bar's rails, moved off its page so that the page (/[lang]/bar) and its Materials page in the docs
// (D-059) read one list.
// The equipment, the power and the water, in the studio's pattern (the galley's diagrams; the water and the power read
// in data.ts). Every size comes from bar.json; nothing is sourced or priced yet, so no card names a shop or a price.
const I = B.inside
const m = (n: number) => `${+n.toFixed(2)} m`
const span = (u: { x0: number; x1: number }) => u.x1 - u.x0

// The Equipment rail: each piece rendered on its own by bar.html?item=<id>, from the 3D's own meshes
export function equipmentRail() {
  const kw = (id: string) => ELECTRIC.circuits.find((c) => c.id === id)?.kw
  const fridges = I.front.units.filter((u) => u.id === "fridge")
  const sink = I.front.units.find((u) => u.id === "sink")!
  return railCards(`${D}/render/equipment`, [
    { id: "coffee", title: "Coffee machine", size: `${m(span(I.back.coffee))} wide, two groups, on the back bar`, note: `Plumbed in, through a scale filter, its drip tray drained; about ${kw("C3")} kW on its own circuit (a design value).` },
    { id: "grinder", title: "Grinder", size: `${m(span(I.back.grinder))} wide, beside the machine`, note: "Beans in the hopper, ground to order." },
    { id: "juicer", title: "Juicer", size: `About Ø 0.24 m, on the back bar`, note: "For the passion fruit, pineapple and tree tomato in the crates beside it." },
    { id: "fruit", title: "Fruit crates × 3", size: `${m(span(I.back.fruit))} of the back bar`, note: "Passion fruit, pineapple and tree tomato for the juicer." },
    { id: "blender", title: "Blender", size: `${m(span(I.back.blender))} wide`, note: "Smoothies and frozen juice." },
    { id: "fridge", title: `Under-counter fridge × ${fridges.length}`, size: `${m(span(fridges[0]))} wide, ${m(I.front.d)} deep, under the work counter`, note: "Glass doors: juice, milk and soft drinks." },
    { id: "sink", title: "Sink unit", size: `${m(span(sink))} wide, ${m(I.front.d)} deep`, note: "A steel bowl in the oak worktop, a goose-neck mixer, the 15 L heater under it." },
    { id: "shelves", title: "Open shelves", size: `${m(span(I.back))} long, ${m(I.back.shelf)} deep, at ${I.back.shelves.map((h) => m(h)).join(", ")}`, note: "Medium Oak on black brackets, each lit from beneath: cups, glasses, jars and bottles." },
    { id: "store", title: "Store cupboard", size: `${m(span(I.store))} wide, ${m(I.store.d)} deep, ${m(I.store.h)} high`, note: "Beans, cups, glasses and stock." },
    { id: "stool", title: `Stools × ${B.stools.x.length}`, size: `Seat Ø ${m(B.stools.r * 2)}, ${m(B.stools.seat)} above the deck`, note: "Steel frame, Medium Oak seat and a footrest ring, at the outside counter." },
  ])
}

const WATER_PARTS: { item: string; title: string }[] = [
  { item: "meter", title: "Stop valve, filter and meter" }, { item: "scalefilter", title: "Scale filter" }, { item: "heater", title: "Under-sink heater" },
  { item: "mixer", title: "Sink mixer" }, { item: "aav", title: "Air admittance valve" }, { item: "greasetrap", title: "Grease trap" },
]
export function waterRail(): RailItem[] {
  const parts = WATER_PARTS.map(({ item, title }) => {
    const p = WATER.points.find((q) => q.item === item)!
    return { id: item, title, size: p.size, note: `${p.id} · ${p.where}.` }
  })
  const of = (...sys: string[]) => WATER.runs.filter((r) => sys.includes(r.system))
  return railCards(`${D}/render/water`, [...parts,
    { id: "ppr", title: "PP-R supply pipe", size: metres(of("cold", "hot")), note: "Under the floor across the aisle, then straight up into the units; PN20, welded joints." },
    { id: "upvc", title: "uPVC drain pipe", size: metres(of("waste")), note: "The sink and the machine's drip tray down through the floor to the collector, at 1:40 or steeper." },
  ])
}

const DEVICES: { model: string; title: string }[] = [
  { model: "board", title: "Distribution board" }, { model: "isolator", title: "Switched spurs" }, { model: "socket", title: "Double socket" },
  { model: "single", title: "Fridge socket" }, { model: "socket66", title: "Outside socket IP66" }, { model: "ceiling", title: "Ceiling light" },
  { model: "strip", title: "Shelf LED strips" }, { model: "bar", title: "Flap light bar" }, { model: "switch", title: "Light switch" },
  { model: "alarm", title: "Smoke alarm" }, { model: "earth", title: "Earth rod" },
]
export function electricRail(): RailItem[] {
  return railCards(`${D}/render/electric`, DEVICES.map(({ model, title }) => {
    const pts = ELECTRIC.points.filter((p) => p.model === model)
    const on = [...new Set(pts.map((p) => p.circuit).filter(Boolean))]
    return { id: model, title: pts.length > 1 ? `${title} × ${pts.length}` : title, size: pts[0].size,
      note: `${pts.map((p) => p.id).join(", ")}${on.length ? ` · ${on.join(", ")}` : ""} · ${[...new Set(pts.map((p) => p.what))].join("; ")}` }
  }))
}

// on the flap and under the outside counter: left out of the view with the hatch wall, so untagged on it

// every rail, as the Materials page lists them
export const rails: Rail[] = [
  { title: "Equipment", items: equipmentRail() },
  { title: "Electric", items: electricRail() },
  { title: "Plumbing", items: waterRail() },
]
