import type { Metadata } from "next"

import { DocsSection, DrawingSection, ModelSection, PageHero, RailSection, ServiceSection, TextSection } from "@/components/page/sections"
import { type RailItem } from "@/components/docs/item-rail"
import { TaggedFigure } from "@/components/docs/tagged-figure"
import B from "@/components/bar/bar.json"
import { BarPlan } from "@/components/bar/bar-plan"
import { PointsTable } from "@/components/galley/points-table"
import { type Circuit, type ElectricPoint, PowerDiagram, runLength, type WaterPoint, type WaterRun, WaterDiagram } from "@/components/galley/service-diagrams"
import electricTags from "../../../../public/designs/bar/render/electric-tags.json"
import waterTags from "../../../../public/designs/bar/render/water-tags.json"

// The bar, as /en/camp is one camp: a full-screen hero, then the 2D and the 3D. Both drawings read
// src/components/bar/bar.json: the red 20 ft container on its stone plinth, the long hatch open onto the
// courtyard under a propped flap, a timber counter with five stools on a deck, and inside a work counter with
// fridges and a sink, a back bar with the coffee machine and the juice station, a door at the north end.

export const metadata: Metadata = {
  title: "The bar · Farm",
  description: "Coffee, fresh juice and cold drinks from a red container bar on the courtyard, at the Digital Farm near Kigali.",
}

const D = "/designs/bar"

// The equipment, the water and the power, in the studio's pattern (the galley's diagrams and points table). Every
// size comes from bar.json; nothing is sourced or priced yet, so no card names a shop or a price.
const WATER = B.water as unknown as { points: WaterPoint[]; runs: WaterRun[]; colours: Record<string, string>; heater: { litres: number; kw: number } }
const ELECTRIC = B.electric as unknown as { points: ElectricPoint[]; circuits: Circuit[]; colours: Record<string, string>; supply: { title: string; sub: string; main: string; mainSub: string } }
const I = B.inside
const m = (n: number) => `${+n.toFixed(2)} m`
const span = (u: { x0: number; x1: number }) => u.x1 - u.x0

type Card = { id: string; title: string; size: string; note: string }
function cards(dir: string, items: Card[]): RailItem[] {
  return items.map((x) => ({
    src: `${D}/render/${dir}/${x.id}.webp`, alt: x.title, title: x.title, note: x.note,
    details: [{ label: "Dimensions", value: x.size }, { label: "Where to buy", value: "Not sourced yet" }, { label: "Cost", value: "Not priced yet" }],
  }))
}

// The Equipment rail: each piece rendered on its own by bar.html?item=<id>, from the 3D's own meshes
function equipmentRail() {
  const kw = (id: string) => ELECTRIC.circuits.find((c) => c.id === id)?.kw
  const fridges = I.front.units.filter((u) => u.id === "fridge")
  const sink = I.front.units.find((u) => u.id === "sink")!
  return cards("equipment", [
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
const metres = (rs: WaterRun[]) => [...rs.reduce((a, r) => a.set(r.dn, (a.get(r.dn) ?? 0) + runLength(r)), new Map<number, number>())]
  .map(([dn, n]) => `${+n.toFixed(1)} m of ${dn} mm`).join(", ")
function waterRail(): RailItem[] {
  const parts = WATER_PARTS.map(({ item, title }) => {
    const p = WATER.points.find((q) => q.item === item)!
    return { id: item, title, size: p.size, note: `${p.id} · ${p.where}.` }
  })
  const of = (...sys: string[]) => WATER.runs.filter((r) => sys.includes(r.system))
  return cards("water", [...parts,
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
function electricRail(): RailItem[] {
  return cards("electric", DEVICES.map(({ model, title }) => {
    const pts = ELECTRIC.points.filter((p) => p.model === model)
    const on = [...new Set(pts.map((p) => p.circuit).filter(Boolean))]
    return { id: model, title: pts.length > 1 ? `${title} × ${pts.length}` : title, size: pts[0].size,
      note: `${pts.map((p) => p.id).join(", ")}${on.length ? ` · ${on.join(", ")}` : ""} · ${[...new Set(pts.map((p) => p.what))].join("; ")}` }
  }))
}

const WARMTH: Record<string, string> = { meter: "cold", scalefilter: "cold", coffeefeed: "cold", heater: "hot", mixer: "hot", aav: "vent" }
const waterColour = (p: WaterPoint) => WATER.colours[WARMTH[p.item ?? ""] ?? "waste"]
// on the flap and under the outside counter: left out of the view with the hatch wall, so untagged on it
const OUTSIDE = ["L5", "P5"]
const circuitColour = (p: ElectricPoint) => ELECTRIC.colours[ELECTRIC.circuits.find((c) => c.id === p.circuit)?.group ?? "spare"]

const DOCS = [
  { href: "/docs/first-90-days", title: "Execution plan", text: "The first 90 days, gate by gate and week by week, then the five-year roadmap." },
  { href: "/docs/operations", title: "Operations", text: "The bar lounge in the evening, the galley's food for it, and settling the bar at check-out." },
  { href: "/docs/power", title: "Power", text: "Grid, solar or both, and what the bar draws: fridges, lights, music and the coffee machine." },
  { href: "/docs/plumber", title: "Plumber", text: "The supply pressure, the pipe sizes, the drains and the grease trap, and the tests before it opens." },
  { href: "/docs/electrician", title: "Electrician", text: "The board, the circuits and the tests, to a RURA class A electrician's certificate." },
]

export default function BarPage() {
  return (
    <main className="w-full flex-1">
      {/* First screen: a STAND-IN until the founder's Nano Banana remaster (handoff in ~/Desktop/bar-nano-banana).
          For now it is the design model rendered from eye level on the lawn (scripts/site/render/bar.html
          ?mode=real&hero=1, 2400 x 1340). The bar sits right, so the words keep the open lawn bottom-left. */}
      <PageHero src={`${D}/render/bar-hero.jpg`} width={2400} height={1340} className="bg-[#e3d6c4]" imgClassName="object-[70%_60%]"
        title="Coffee, fresh juice and a stool at the hatch"
        alt="The bar: an oxide-red shipping container on a stone plinth, its long hatch open under a flap propped on two black struts, a timber counter with five high stools on a timber deck, shelves and a warm light inside." />

      {/* 2D, full screen: the bar's plan (src/components/bar/bar-plan.tsx), in the text colour. */}
      <DrawingSection id="plans" title="2D">
        <BarPlan title="Plan: a 20 ft container 6,058 by 2,438 mm on a stone plinth, a 2,600 mm hatch in the courtyard wall with the flap propped out over a timber counter and five stools on a deck; inside, a work counter under the hatch with a cupboard, two fridges, a sink and drawers, a back bar with the coffee machine, the juicer and fruit crates under three shelves, a tall store cupboard, and the cargo doors at the north end as the way in."
          className="h-auto w-full lg:h-full lg:w-auto" />
      </DrawingSection>

      {/* 3D, in the 2D section's pattern: a line drawing of the bar seen from the courtyard with its roof off,
          then the same view rendered. Both from scripts/site/render/bar.html. */}
      <ModelSection line={`${D}/render/bar-line.png`} real={`${D}/render/bar-real.webp`} width={2400} height={1100}
        lineAlt="Line drawing of the bar from the courtyard with the roof off: the container on its plinth, the flap propped open over the hatch, the counter and five stools on the deck, and inside the back bar with the coffee machine, the juicer, fruit crates and three shelves of cups, jars and bottles."
        realAlt="The same view rendered: oxide-red corrugated steel, a warm light under the flap, Medium Oak counters and shelves lit from beneath, a steel espresso machine, crates of passion fruit, pineapple and tree tomato, oak-seated stools on a timber deck on the lawn." />

      {/* Equipment: one card per piece, rendered on its own from the 3D's meshes (bar.html?item=<id>) */}
      <RailSection id="equipment" title="Equipment" items={equipmentRail()} />

      {/* Water, in the studio's Plumbing pattern: the bar's water drawn full width, then the installation in the 3D
          view's camera, lower, with the hatch wall, the deck and the stools left out and the units opened
          (render/water-line.png: the fit-out in grey, every run in its colour, dashed under the floor, every point
          tagged), the same view rendered, then each part on its own. All from bar.html?view=water. */}
      <ServiceSection id="water" title="Water"
        diagram={<WaterDiagram runs={WATER.runs} colours={WATER.colours}
          valve={{ id: "SV", title: "Stop valve", sub: "filter · meter" }}
          heater={{ id: "WH", title: `Heater ${WATER.heater.litres} L`, sub: "under the sink" }}
          outlets={[
            { id: "SF", title: "Scale filter", sub: "for the machine", cold: true },
            { id: "EM", title: "Coffee machine", sub: "feed · drip tray", cold: true, drain: "D2" },
            { id: "ST", title: "Sink", sub: "mixer", cold: true, hot: true, drain: "D1", aav: true },
          ]}
          trap={{ id: "GT", title: "Grease trap", sub: "outside the south end" }}
          notes={["Pressure 2.5 to 3 bar from the farm's booster pump · every drain at 1:40 or steeper · the bar's water never reaches the septic tank",
            "Sizes are design intent until the plumber checks them · nothing sourced or priced yet"]}
          label="Water diagram: the farm's water through the bar's stop valve, filter and meter in the back bar's cupboard; cold through a scale filter to the coffee machine and under the floor to the sink unit, where a 15 litre heater gives the sink its hot; the sink and the machine's drip tray drain to a collector, a small grease trap and a soak pit." />}
        figure={<TaggedFigure src={`${D}/render/water-line.png`} aspect={waterTags.aspect} tags={waterTags.tags}
          alt="Line drawing of the bar from the courtyard, lower, with the hatch wall, the deck and the stools left out and the units opened, the fit-out in grey: the main dashed under the south end to the valve set under the coffee machine, the scale filter beside it, cold dashed under the floor across the aisle to the sink unit with its small heater, hot in red up to the mixer, and the drains dashed under the floor to the grease trap outside the south end."
          info={Object.fromEntries(WATER.points.filter((p) => p.at).map((p) => [p.id, { label: p.what, colour: waterColour(p) }]))} />}
        note={<>
          Supplies cross the aisle under the floor and rise straight into the units; drains drop through the floor and fall
          to the grease trap, dashed where the floor hides them. The hatch wall, the deck and the stools are left out and
          the units drawn open, so the pipes show. Each tag opens its row in the{" "}
          <a href="#water-points" className="underline underline-offset-4">points table</a>. Outside the drawing: the main
          comes in from the farm&rsquo;s tank and booster pump, and the grease trap (GT) empties to a soak pit (SP).
        </>}
        real={{ src: `${D}/render/water-real.webp`, width: 2400, height: 1100,
          caption: <>Rendered from the design model, the hatch wall left out and the units opened</>,
          alt: "The same view rendered with the hatch wall left out and the units opened: the blue meter and the white scale filter under the coffee machine, green pipes up into the sink unit, the white under-sink heater, and the grease trap's lid on the lawn by the south end." }}
        rail={waterRail()} />

      <TextSection id="water-points" title="Water points"
        lead={<>The runs: {WATER.runs.map((r) => `${r.id} ${r.dn} mm, ${runLength(r)} m`).join(" · ")}.</>}>
        <PointsTable head={["What", "Where", "Size"]}
          rows={WATER.points.map((p) => ({ id: p.id, colour: waterColour(p), cells: [p.what, p.where, p.size] }))} />
      </TextSection>

      {/* Electric, in the studio's pattern: the single line drawn full width, then the installation in the same lower
          camera (every circuit up from the board to the ceiling, along its own track and down to its points, every point
          tagged), the same view rendered, then each device on its own. All from bar.html?view=electric. */}
      <ServiceSection id="electric" title="Electric"
        diagram={<PowerDiagram supply={ELECTRIC.supply} circuits={ELECTRIC.circuits} colours={ELECTRIC.colours}
          notes={[`About ${Math.round(ELECTRIC.circuits.reduce((n, c) => n + c.kw, 0) * 10) / 10} kW connected; the power guide gives the bar 5 kWh a day, but its 2 kW peak leaves out the coffee machine: with it, nearer 5 kW`,
            "TT earthing on the bar's own rod (E1) · ratings are design intent until a RURA class A electrician certifies"]}
          label={`Single-line diagram: the farm's site board at 230 volts into a 40 amp main switch with surge protection, then one RCBO for each of ${ELECTRIC.circuits.length} circuits: the lights inside, the back bar's sockets, the coffee machine, the fridges, the water heater, the outside light and socket, and a spare.`} />}
        figure={<TaggedFigure src={`${D}/render/electric-line.png`} aspect={electricTags.aspect} tags={electricTags.tags.filter((t) => !OUTSIDE.includes(t.id))}
          alt="Line drawing of the bar from the courtyard, lower, with the hatch wall, the deck and the stools left out: the board on the back wall by the way in, every circuit rising into the ceiling along its own track and down to the ceiling lights and shelf strips in blue, the sockets in orange, and the coffee machine's and the heater's spurs in green."
          info={Object.fromEntries(ELECTRIC.points.filter((p) => p.at).map((p) => [p.id, { label: p.what, colour: circuitColour(p) }]))} />}
        note={<>
          Every circuit rises from the board into the ceiling, runs along its own track and drops straight to its device.
          Each tag opens its row in the <a href="#electric-points" className="underline underline-offset-4">points table</a>.
          Outside the drawing: the supply comes in buried from the farm&rsquo;s site board, the light bar (L5) is under the
          flap and the outside socket (P5) under the counter, both left out with the hatch wall, and the earth rod (E1) is in
          a pit outside the north end.
        </>}
        real={{ src: `${D}/render/electric-real.webp`, width: 2400, height: 1100,
          caption: <>Rendered from the design model, the hatch wall left out and the units opened</>,
          alt: "The same view rendered with the hatch wall left out: white conduit along the ceiling and down the walls to the board by the way in, the ceiling lights, the sockets over the back bar, and the spurs beside the coffee machine and in the sink unit." }}
        rail={electricRail()} />

      <TextSection id="electric-points" title="Electric points">
        <PointsTable head={["What", "Circuit", "Size"]}
          rows={ELECTRIC.points.map((p) => ({ id: p.id, colour: circuitColour(p), cells: [p.what, p.circuit || "—", p.size] }))} />
      </TextSection>

      <DocsSection cards={DOCS} />
    </main>
  )
}
