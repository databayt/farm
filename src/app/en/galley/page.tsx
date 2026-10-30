import type { Metadata } from "next"
import Link from "next/link"

import { DocsSection, DrawingSection, ModelSection, PageHero, RailSection, ServiceSection, railCards } from "@/components/page/sections"
import { type RailItem } from "@/components/docs/item-rail"
import { TaggedFigure } from "@/components/docs/tagged-figure"
import { circuitColour, D, ELECTRIC, WATER, waterColour } from "@/components/galley/data"
import { GalleyPlan } from "@/components/galley/galley-plan"
import G from "@/components/galley/galley.json"
import { metres, PowerDiagram, WaterDiagram } from "@/components/galley/service-diagrams"
import electricTags from "../../../../public/designs/galley/render/electric-tags.json"
import waterTags from "../../../../public/designs/galley/render/water-tags.json"

// The galley, in /en/studio's pattern: the hero, the 2D and the 3D, the Equipment rail, Electric and Plumbing, then the
// docs cards; the points tables and the status are on /docs/galley-points. Both drawings read
// src/components/galley/galley.json: the teal 40 ft container on its stone plinth beside the study room, two doors
// and two windows on the courtyard side, fitted as the staff kitchen that cooks breakfast and dinner for a full
// house (D-028, D-031): the founder's long worktop with two sinks under the windows, the stores by the staff door,
// a cooking line under an extract hood, and the pass by the service door.

export const metadata: Metadata = {
  title: "The galley · Farm",
  description: "The farm's staff kitchen: a teal container with a long worktop and two sinks, cooking breakfast and dinner from the field for the guests, at the Digital Farm near Kigali.",
}

// The equipment, the power and the water, in the studio's pattern (the water and the power read in data.ts). Every
// size comes from galley.json; nothing is sourced or priced yet, so no card names a shop or a price.
const m = (n: number) => `${+n.toFixed(2)} m`
const span = (u: { x0: number; x1: number }) => u.x1 - u.x0

// The Equipment rail: each piece rendered on its own by galley.html?item=<id>, from the 3D's own meshes
function equipmentRail() {
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
function waterRail(): RailItem[] {
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
function electricRail(): RailItem[] {
  return railCards(`${D}/render/electric`, DEVICES.map(({ model, title }) => {
    const pts = ELECTRIC.points.filter((p) => p.model === model)
    const on = [...new Set(pts.map((p) => p.circuit).filter(Boolean))]
    return { id: model, title: pts.length > 1 ? `${title} × ${pts.length}` : title, size: pts[0].size,
      note: `${pts.map((p) => p.id).join(", ")}${on.length ? ` · ${on.join(", ")}` : ""} · ${[...new Set(pts.map((p) => p.what))].join("; ")}` }
  }))
}

// The galley's own docs page first, as the studio's are, then the guides behind its services.
const DOCS = [
  { href: "/docs/galley-points", title: "Electric and plumbing points", text: "Every socket, light, tap and drain on the drawings above, the pipe runs, and where the design stands." },
  { href: "/docs/electrician", title: "Electrician's guide", text: "The board, the circuits and the tests, to a RURA class A electrician's certificate." },
  { href: "/docs/plumber", title: "Plumber's guide", text: "The supply pressure, the pipe sizes, the drains and the grease trap, and the tests before anyone moves in." },
  { href: "/docs/power", title: "Power", text: "Grid, solar or both, what the galley draws, and why gas or electric cooking moves the farm's day by about 17 kWh." },
]

export default function GalleyPage() {
  return (
    <main className="w-full flex-1">
      {/* First screen: the founder's Nano Banana render of the galley (2026-10-30, second version), made from the
          brief in ~/Desktop/galley-nano-banana; master kept at assets/galley/hero-gemini.png (1536 x 1024, the first
          version beside it as hero-gemini-1.png), cut to 2400 x 1340. It departs from the drawings in one thing: the
          doors are cream, not red. The galley sits centre, so the words keep the lawn bottom-left. */}
      <PageHero src={`${D}/render/galley-hero.jpg`} width={2400} height={1340} className="bg-[#8a9a52]" imgClassName="object-[55%_50%]"
        title="Breakfast and dinner, cooked from the field"
        alt="A long teal shipping container on a low fieldstone plinth at sunset, seen three-quarter from the left: two cream doors with small windows up stone steps near each end and two white-framed windows between them, glowing warm onto stainless shelves, sinks and a fridge; crates of fresh vegetables and a basket of eggs on the left steps, herbs in terracotta pots along the plinth, on a mown lawn among avocado trees and banana plants." />

      {/* 2D, full screen: the galley's plan (src/components/galley/galley-plan.tsx), in the text colour. It is
          long, so it takes the full width. */}
      <DrawingSection id="plans" title="2D">
        <GalleyPlan title="Plan: a 40 ft container 12,192 by 2,438 mm on a stone plinth, a door near each end of its front up two stone steps and two windows between them; inside, a hand-wash basin and apron hooks by the staff door at the left end, then the 7,800 mm stainless worktop under the windows with the harvest bench, the prep sink, the prep bench, the wash-up sink and the dish drop by the service door; along the back wall an upright freezer and a two-door fridge, the dry store's shelving, the range, griddle and fryer under the extract hood with a 900 mm aisle in front of them, a cold bench, the pass with its gantry and a cleaning cupboard; two bins and a plate cupboard at the right end."
          className="h-auto w-full lg:h-full lg:w-auto lg:max-w-full" />
      </DrawingSection>

      {/* 3D, in the 2D section's pattern: a line drawing of the galley seen from the courtyard with its front wall
          and roof off, then the same view rendered. Both from scripts/site/render/galley.html. */}
      <ModelSection line={`${D}/render/galley-line.png`} real={`${D}/render/galley-real.webp`} width={2400} height={1000}
        lineAlt="Line drawing of the galley from the courtyard with the front wall and roof off: the stone plinth with the steps at its two doors, the long worktop on steel legs along the front with its two sinks and taps, crates of vegetables, chopping boards, pots on the undershelf and racks of plates, and along the back wall an upright freezer and a two-door fridge, shelves of sacks, tubs and jars, a range with pots, a griddle and a fryer under the hood and its duct, a cold bench, the pass with heat lamps over plates, a tall cleaning cupboard, two bins and a fire blanket at the far end."
        realAlt="The same view rendered: the teal container on a fieldstone plinth on the lawn, white walls and a grey resin floor, brushed steel worktops, fridges, shelving and hood, crates of greens, tomatoes and onions, a tray of eggs and a bowl of fruit on the cold bench, plated dinners under the glowing heat lamps, a white cleaning cupboard, green bins and a red fire blanket by the service door." />

      {/* Equipment: one card per piece, rendered on its own from the 3D's meshes (galley.html?item=<id>) */}
      <RailSection id="equipment" title="Equipment" items={equipmentRail()} />

      {/* Electric, in the studio's pattern: the galley's single line drawn full width, then the installation in the 3D
          view's camera (render/electric-line.png: every circuit up from the board into the ceiling, along its own track
          and down to its points, every point tagged), the same view rendered, then each device on its own. All from
          galley.html?view=electric, built from galley.json's electric. */}
      <ServiceSection id="electrical" title="Electric"
        diagram={<PowerDiagram supply={ELECTRIC.supply} circuits={ELECTRIC.circuits} colours={ELECTRIC.colours}
          notes={[`About ${Math.round(ELECTRIC.circuits.reduce((n, c) => n + c.kw, 0))} kW connected; the power guide's peak is 14 kW with diversity, about 25 kWh a day · the emergency stop (ES) drops K on the cooking line`,
            "Drawn for electric cooking: on gas the line needs only its ignition and the day falls to about 8 kWh · ratings are design intent until a RURA class A electrician certifies"]}
          label={`Single-line diagram: the farm's site board at 400 volts three-phase into a main switch with surge protection, then one RCBO for each of ${ELECTRIC.circuits.length} circuits: lights, two worktop socket circuits, the freezer and fridge, the cold bench and the pass, the range, the griddle and the fryer on three-phase circuits dropped together by the emergency stop, the extract fan, the water heater and a spare.`} />}
        figure={<TaggedFigure table="/docs/galley-points" src={`${D}/render/electric-line.png`} aspect={electricTags.aspect} tags={electricTags.tags}
          alt="Line drawing of the galley from the courtyard with the fit-out in grey: the board on the front wall by the staff door with every circuit rising from it into the ceiling, along its own track and down to its points: LED battens in blue, worktop and appliance sockets in orange, the cooking line's isolators and connection boxes, the hood control, the roof fan and the water heater in green."
          info={Object.fromEntries(ELECTRIC.points.filter((p) => p.at).map((p) => [p.id, { label: p.what, colour: circuitColour(p) }]))} />}
        note={<>
          Every circuit rises from the board into the ceiling, runs along its own track and drops straight to its device;
          in a kitchen the conduit stays on the surface, where it can be wiped. Each tag opens its row in the{" "}
          <Link href="/docs/galley-points#electric-points" className="underline underline-offset-4">points table</Link>. Outside the drawing: the
          supply comes in buried from the farm&rsquo;s site board, and the earth rod (E1) is in a pit outside the staff
          door end.
        </>}
        real={{ src: `${D}/render/electric-real.webp`, width: 2400, height: 1000, caption: "Rendered from the design model",
          alt: "The same view rendered: white surface conduit along the ceiling and down the walls to the board by the staff door, the sockets over the worktop, the yellow isolators beside the range, the hood control, the heat alarms and the fan on the roof over the hood." }}
        rail={electricRail()} />

      {/* Plumbing, in the studio's pattern: the galley's water drawn full width, then the installation in the 3D
          view's camera (render/water-line.png: the fit-out in grey, every run in its colour, dashed under the floor,
          every point tagged), the same view rendered (render/water-real.webp), then each part on its own. All from
          galley.html?view=water, built from galley.json's water. */}
      <ServiceSection id="plumbing" title="Plumbing"
        diagram={<WaterDiagram runs={WATER.runs} colours={WATER.colours}
          valve={{ id: "SV", title: "Stop valve", sub: "filter · meter" }}
          heater={{ id: "WH", title: `Heater ${WATER.heater.litres} L`, sub: `${WATER.heater.kw} kW, east end` }}
          outlets={[
            { id: "HB", title: "Hand basin", sub: "hands-free", cold: true, hot: true, drain: "D2" },
            { id: "DF", title: "Drinking filter", sub: "own faucet", cold: true },
            { id: "PS", title: "Prep sink", sub: "mixer", cold: true, hot: true, drain: "D3" },
            { id: "WS", title: "Wash-up sink", sub: "mixer", cold: true, hot: true, drain: "D4", aav: true },
            { id: "PR", title: "Pre-rinse", sub: "spray", cold: true, hot: true },
            { id: "FG", title: "Floor gully", sub: "basket", drain: "D5" },
            { id: "D6", title: "Dishwasher", sub: "capped spare", cold: true, drain: "D6" },
          ]}
          trap={{ id: "GT", title: "Grease trap", sub: "outside the east end" }}
          notes={["Pressure 2.5 to 3 bar from the farm's booster pump · every drain at 1:40 or steeper · the kitchen's water never reaches the septic tank",
            "Sizes are design intent until the plumber checks them · nothing sourced or priced yet"]}
          label="Water diagram: the farm's water through the galley's stop valve, filter and meter; cold along the front wall to the hand basin, the drinking filter, both sinks, the pre-rinse spray and a capped tee for a dishwasher, and on to the 100 litre heater, whose hot comes back to the basin, the sinks and the spray; the basin, the sinks and the floor gully drain to one collector under the plinth, the grease trap and a soak pit." />}
        figure={<TaggedFigure table="/docs/galley-points" src={`${D}/render/water-line.png`} aspect={waterTags.aspect} tags={waterTags.tags}
          alt="Line drawing of the galley from the courtyard with the fit-out in grey: the main coming in dashed under the staff door end to the stop valve by the basin, cold in blue and hot in red along the front wall under the worktop and up to the basin, both sinks and the pre-rinse spray, the 100 litre heater on the east end wall above the bins, and the drains in brown dashed under the plinth to the grease trap outside the east end."
          info={Object.fromEntries(WATER.points.filter((p) => p.at).map((p) => [p.id, { label: p.what, colour: waterColour(p) }]))} />}
        note={<>
          Supplies run along the front wall under the open worktop, then straight up to each outlet; drains drop through
          the floor to one collector under the plinth, dashed where the floor hides them. Each tag opens its row in the{" "}
          <Link href="/docs/galley-points#plumbing-points" className="underline underline-offset-4">points table</Link>. Outside the drawing: the main
          comes in from the farm&rsquo;s tank and booster pump, and the grease trap (GT) empties to the kitchen&rsquo;s own
          soak pit (SP), never the septic tank. The front wall is drawn as a faint outline.
        </>}
        real={{ src: `${D}/render/water-real.webp`, width: 2400, height: 1000, caption: "Rendered from the design model, the pipes drawn as they run",
          alt: "The same view rendered: green supply pipes along the front wall under the stainless worktop and up to the sinks and the basin, the blue meter by the basin, the white heater on the east end wall over the green bins, and the grease trap's lid on the lawn outside the east end." }}
        rail={waterRail()} />

      <DocsSection cards={DOCS} />
    </main>
  )
}
