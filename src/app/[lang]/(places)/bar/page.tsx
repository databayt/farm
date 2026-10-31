import type { Metadata } from "next"
import { LocaleLink as Link } from "@/components/internationalization/locale-link"

import { DocsSection, DrawingSection, ModelSection, PageHero, RailSection, ServiceSection } from "@/components/page/sections"
import { TaggedFigure } from "@/components/docs/tagged-figure"
import { electricRail, equipmentRail, waterRail } from "@/components/bar/rails"
import { BarPlan } from "@/components/bar/bar-plan"
import { circuitColour, D, ELECTRIC, WATER, waterColour } from "@/components/bar/data"
import { PowerDiagram, WaterDiagram } from "@/components/galley/service-diagrams"
import electricTags from "../../../../../public/designs/bar/render/electric-tags.json"
import waterTags from "../../../../../public/designs/bar/render/water-tags.json"

// The bar, in /en/studio's pattern: the hero, the 2D and the 3D, the Equipment rail, Electric and Plumbing, then the
// docs cards; its points, circuits and runs are on its docs pages (/docs/bar). Both drawings read src/components/bar/bar.json: the red 20 ft container on its stone plinth, the long hatch open onto the
// courtyard under a propped flap, a timber counter with five stools on a deck, and inside a work counter with
// fridges and a sink, a back bar with the coffee machine and the juice station, a door at the north end.

export const metadata: Metadata = {
  title: "The bar · Farm",
  description: "Coffee, fresh juice and cold drinks from a red container bar on the courtyard, at the Digital Farm near Kigali.",
}

const OUTSIDE = ["L5", "P5"]

// The bar's docs pages, as the docs sidebar groups them (D-059), linked from the end of this page.
const DOCS = [
  { href: "/docs/bar", title: "Execution plan", text: "Every step of fitting out the bar, from the survey to the first night it opens." },
  { href: "/docs/bar/materials", title: "Materials", text: "The equipment, each electric device and each plumbing part, with its size, where to buy it and its cost." },
  { href: "/docs/bar/electric", title: "Electric", text: "The seven circuits, the first and second fix, the tests and every socket and light, inside and out." },
  { href: "/docs/bar/plumbing", title: "Plumbing", text: "The supply, the small heater, the drains to the grease trap, the tests, and every run, tap and drain." },
]

export default function BarPage() {
  return (
    <main className="w-full flex-1">
      {/* First screen: the founder's Nano Banana render of the bar (2026-10-30), made from the brief in
          ~/Desktop/bar-nano-banana; master kept at assets/bar/hero-gemini.png (1672 x 941), upscaled to 2400 x 1340.
          Seen square on, the bar centred; the words sit on the deck and the lawn bottom-left. */}
      <PageHero src={`${D}/render/bar-hero.jpg`} width={2400} height={1340} className="bg-[#8a9a52]" imgClassName="object-[50%_55%]"
        title="Coffee, fresh juice and a stool at the hatch"
        alt="An oxide-red shipping container on a fieldstone plinth at golden hour, its long hatch open under a timber canopy on black steel struts: inside, lit shelves of cups, glasses, jars and plain bottles, an espresso machine and grinder, a juicer and crates of oranges, pineapples and tree tomatoes; outside, a timber counter on black brackets with five high stools on a timber deck with one step down to the lawn, among avocado and banana trees." />

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

      {/* Electric, in the studio's pattern: the single line drawn full width, then the installation in the 3D view's
          camera, lower, with the hatch wall, the deck and the stools left out (every circuit up from the board to the
          ceiling, along its own track and down to its points, every point tagged), the same view rendered, then each
          device on its own. All from bar.html?view=electric. */}
      <ServiceSection id="electrical" title="Electric"
        diagram={<PowerDiagram supply={ELECTRIC.supply} circuits={ELECTRIC.circuits} colours={ELECTRIC.colours}
          notes={[`About ${Math.round(ELECTRIC.circuits.reduce((n, c) => n + c.kw, 0) * 10) / 10} kW connected; the power guide gives the bar 5 kWh a day, but its 2 kW peak leaves out the coffee machine: with it, nearer 5 kW`,
            "TT earthing on the bar's own rod (E1) · ratings are design intent until a RURA class A electrician certifies"]}
          label={`Single-line diagram: the farm's site board at 230 volts into a 40 amp main switch with surge protection, then one RCBO for each of ${ELECTRIC.circuits.length} circuits: the lights inside, the back bar's sockets, the coffee machine, the fridges, the water heater, the outside light and socket, and a spare.`} />}
        figure={<TaggedFigure table="/docs/bar/electric" src={`${D}/render/electric-line.png`} aspect={electricTags.aspect} tags={electricTags.tags.filter((t) => !OUTSIDE.includes(t.id))}
          alt="Line drawing of the bar from the courtyard, lower, with the hatch wall, the deck and the stools left out: the board on the back wall by the way in, every circuit rising into the ceiling along its own track and down to the ceiling lights and shelf strips in blue, the sockets in orange, and the coffee machine's and the heater's spurs in green."
          info={Object.fromEntries(ELECTRIC.points.filter((p) => p.at).map((p) => [p.id, { label: p.what, colour: circuitColour(p) }]))} />}
        note={<>
          Every circuit rises from the board into the ceiling, runs along its own track and drops straight to its device.
          Each tag opens its row in the <Link href="/docs/bar/electric#points" className="underline underline-offset-4">points table</Link>.
          Outside the drawing: the supply comes in buried from the farm&rsquo;s site board, the light bar (L5) is under the
          flap and the outside socket (P5) under the counter, both left out with the hatch wall, and the earth rod (E1) is in
          a pit outside the north end.
        </>}
        real={{ src: `${D}/render/electric-real.webp`, width: 2400, height: 1100,
          caption: <>Rendered from the design model, the hatch wall left out and the units opened</>,
          alt: "The same view rendered with the hatch wall left out: white conduit along the ceiling and down the walls to the board by the way in, the ceiling lights, the sockets over the back bar, and the spurs beside the coffee machine and in the sink unit." }}
        rail={electricRail()} />

      {/* Plumbing, in the studio's pattern: the bar's water drawn full width, then the installation in the same lower
          camera with the units opened too (render/water-line.png: the fit-out in grey, every run in its colour, dashed under the floor, every point
          tagged), the same view rendered, then each part on its own. All from bar.html?view=water. */}
      <ServiceSection id="plumbing" title="Plumbing"
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
        figure={<TaggedFigure table="/docs/bar/plumbing" src={`${D}/render/water-line.png`} aspect={waterTags.aspect} tags={waterTags.tags}
          alt="Line drawing of the bar from the courtyard, lower, with the hatch wall, the deck and the stools left out and the units opened, the fit-out in grey: the main dashed under the south end to the valve set under the coffee machine, the scale filter beside it, cold dashed under the floor across the aisle to the sink unit with its small heater, hot in red up to the mixer, and the drains dashed under the floor to the grease trap outside the south end."
          info={Object.fromEntries(WATER.points.filter((p) => p.at).map((p) => [p.id, { label: p.what, colour: waterColour(p) }]))} />}
        note={<>
          Supplies cross the aisle under the floor and rise straight into the units; drains drop through the floor and fall
          to the grease trap, dashed where the floor hides them. The hatch wall, the deck and the stools are left out and
          the units drawn open, so the pipes show. Each tag opens its row in the{" "}
          <Link href="/docs/bar/plumbing#points" className="underline underline-offset-4">points table</Link>. Outside the drawing: the main
          comes in from the farm&rsquo;s tank and booster pump, and the grease trap (GT) empties to a soak pit (SP).
        </>}
        real={{ src: `${D}/render/water-real.webp`, width: 2400, height: 1100,
          caption: <>Rendered from the design model, the hatch wall left out and the units opened</>,
          alt: "The same view rendered with the hatch wall left out and the units opened: the blue meter and the white scale filter under the coffee machine, green pipes up into the sink unit, the white under-sink heater, and the grease trap's lid on the lawn by the south end." }}
        rail={waterRail()} />

      <DocsSection cards={DOCS} ownPlan />
    </main>
  )
}
