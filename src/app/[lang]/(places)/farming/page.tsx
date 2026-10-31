import type { Metadata } from "next"
import { LocaleLink as Link } from "@/components/internationalization/locale-link"

import { frw } from "@/lib/format"
import { DocsSection, DrawingSection, ModelSection, PageHero, RailSection, ServiceSection, railCards } from "@/components/page/sections"
import { BuildUp } from "@/components/docs/build-up"
import { type RailItem } from "@/components/docs/item-rail"
import { TaggedFigure } from "@/components/docs/tagged-figure"
import { crops, D, I, WATER_POINTS } from "@/components/farming/data"
import { FarmingPlan } from "@/components/farming/farming-plan"
import { NurseryPlan } from "@/components/farming/nursery-plan"
import { WaterDiagram } from "@/components/farming/water-diagram"
import plan from "../../../../../public/designs/farming/data/plan.json"
import topPieces from "../../../../../public/designs/farming/render/top-pieces.json"
import waterTags from "../../../../../public/designs/farming/render/water-tags.json"

// The vegetable field, in /en/studio's pattern: the hero, the field's 2D and 3D and the nursery's, the field's build-up,
// the crops and Water, then the docs cards; what the galley needs, the planting calendar, the water points, the bill of
// materials are on its docs pages (/docs/farming). It grows every vegetable the galley needs to feed the farm's
// guests (founder, 2026-10-28). Every number comes from scripts/site/farming.mjs, which sizes the beds to a full
// house every day from src/components/farming/farming.json; the facts and sources are guide/grow/vegetables.md.

export const metadata: Metadata = {
  title: "The field · Farm",
  description: "Every vegetable on the guests' plates grown on the farm: raised beds on drip by the galley, at the Digital Farm near Kigali.",
}

// The Crops rail: one bed of each crop rendered on its own (scripts/site/render/farming.html?item=<id>)
function cropRail(): RailItem[] {
  return crops.map((c) => ({
    src: `${D}/render/crop/${c.id}.webp`, alt: `Three metres of a bed of ${c.name.toLowerCase()} in ${c.rows} ${c.rows === 1 ? "row" : "rows"} on drip.`, title: c.name,
    details: [
      { label: "For the galley", value: `${c.kgWeek} kg a week on a full house, ${c.averageKgWeek} kg on an average one` },
      { label: "Beds", value: `${c.planted} at the start (${c.beds} for a full house), planted ${c.batch} at a time every ${c.every === 1 ? "week" : `${c.every} weeks`}` },
      { label: "First harvest", value: `${c.firstWeeks} weeks ${c.nursery ? `after transplanting (${c.nursery} weeks in the nursery first)` : "after sowing"}, then ${c.harvestWeeks} weeks of picking` },
    ],
    note: `Spacing ${c.spacing} cm. Watch for ${c.watch}. Yield: ${c.yieldNote}.`,
  }))
}

// The Water rail, in the studio's Plumbing rail's pattern: each part of the drip installation rendered on its own
// (farming.html?part=<id>), its size and length from plan.irrigation, its cost from the field's BOM (placeholders
// until quoted). Nothing is sourced yet; the guide names Holland Greentech for drip and Davis & Shirtliff for pumps,
// neither contacted.
const line = (re: RegExp) => plan.bom.find((l) => re.test(l.item))!
function waterRail(): RailItem[] {
  const drip = line(/^Drip tape/), pipe = line(/^Supply and header/), valve = line(/^Valve and fittings/), filter = line(/^Disc filter/), main = line(/^Main pipe/)
  return railCards(`${D}/render/water`, [
    { id: "tank", title: "Tank and pump", size: "Sized to the borehole's tested flow", where: "The farm's, by the compound", cost: "Not in the field's budget: the farm's water",
      note: `T · the farm's tank and booster pump, shared with the compound. The field takes ${plan.water.dryLow} to ${plan.water.dryHigh} m³ a day in the driest months.` },
    { id: "filter", title: "Disc filter", size: "1 inch, at the tank", where: "Not sourced yet: Holland Greentech sells drip (not contacted)", cost: `RWF ${frw(filter.total)} (estimate)`,
      note: "F · stops the grit that blocks emitters. Open and rinse its discs every week." },
    { id: "main", title: "Main pipe", size: `${main.qty} m of ${I.main.dn} mm PE`, cost: `RWF ${frw(main.total)} (estimate)`,
      note: "M1 · from the tank down to the garden walk and along it to the field's gate, buried 30 cm." },
    { id: "valve", title: `Block valves × ${valve.qty}`, size: "A 32 mm ball valve on a tee, in a valve box", cost: `RWF ${frw(valve.rwf)} each × ${valve.qty} (estimate)`,
      note: `${I.valves.map((v) => v.id).join(", ")} · each block waters on its own, so a short flow can run them one after another.` },
    { id: "header", title: "Supply and headers", size: `${pipe.qty} m of 32 mm PE, with start connectors`, cost: `RWF ${frw(pipe.total)} (estimate)`,
      note: "S1 and H · along the main path and the aisles, then across each block's gate-side end, a start connector for every drip line." },
    { id: "drip", title: "Drip lines", size: `${frw(drip.qty)} m of 16 mm tape, two lines a bed`, where: "Not sourced yet: Holland Greentech sells drip (not contacted)", cost: `RWF ${frw(drip.total)} (estimate)`,
      note: `DL · ${I.lines} lines, 10 m each, down every planted bed; an end closure on each, flushed open once a month.` },
  ])
}

// The farming's docs pages, as the docs sidebar groups them (D-059), linked from the end of this page.
const DOCS = [
  { href: "/docs/farming", title: "Execution plan", text: "The seasons, the beds, the crops and the first month step by step, from the soil test to the first harvest." },
  { href: "/docs/farming/materials", title: "Materials", text: "The bill of materials for the first beds: the ground, the water, the fence, the nursery, the seed and the tools." },
  { href: "/docs/farming/water", title: "Water", text: "How the drip is laid from the farm's tank to every bed, what the field drinks, and every point." },
]

export default function FarmingPage() {
  return (
    <main className="w-full flex-1">
      {/* First screen: the founder's Nano Banana image of the field (2026-10-29, D-054), made from the handoff in
          ~/Desktop/farming-nano-banana: the same farm and light as the livestock hero, the raised beds and their crops,
          the gate on the main path, the fruit row and the nursery. Cut to 2400 x 1340 from its 2752 px original
          (assets/farming/hero-gemini.jpeg). The baskets and the wheelbarrow keep the lower left under the words. */}
      <PageHero src={`${D}/render/field-hero.jpg`} width={2400} height={1340} className="bg-[#8a7a62]" imgClassName="object-[50%_60%]"
        title="Everything on the plate, grown here"
        alt="A kitchen-garden field on a Rwandan hillside under a soft grey sky: raised beds of red-brown soil with staked tomatoes, flowering potatoes, carrots, onions, cabbages, red amaranth, kale and chard on drip lines, a rail fence of barked poles with a gate on the main path, a wheelbarrow of compost and baskets of tomatoes, carrots, potatoes and greens in front, a shade-net nursery at the right, and bananas, papaya and eucalyptus before terraced green hills." />

      {/* 2D, full screen: the field's plan (src/components/farming/farming-plan.tsx), in the text colour. */}
      <DrawingSection id="plans" title="2D" full>
        <FarmingPlan title={`Plan, seen from the gate: the field as it starts, the two rows of blocks nearest the gate, ${plan.bedsTotal} raised beds 1.2 by 10 m in blocks of ten either side of a 2 m main path inside a fence 53,500 by 22,500 mm; ${plan.bedsNeeded} planted this season (solid) and the rest resting (dashed); the gate at the front onto the garden walk to the galley; the nursery up the yard.`}
          className="h-auto w-full" />
      </DrawingSection>

      {/* 3D, in the 2D section's pattern: the whole field from its gate end, as the 2D draws it, with its fence and the
          fruit row behind, as a line drawing, then rendered. Both from scripts/site/render/farming.html (D-053). */}
      <ModelSection line={`${D}/render/field-line.png`} real={`${D}/render/field-real.webp`} width={2400} height={1100}
        caption={<>Rendered from the design model: the field as it starts, one season, the fruit row behind</>}
        lineAlt="Line drawing of the whole field from its gate end: two rows of blocks of raised beds either side of the main path, each bed planted with its crop or resting, the wire fence on barked posts with the gate in front, and the fruit row of banana mats and fruit trees behind the back fence."
        realAlt="The same view rendered on the white page: dark beds of tomatoes, beans, cabbages, kale, amaranth, onions, carrots, potatoes and the rest on sandy paths, four resting beds, the fence, and behind it bananas, avocado, mango, lemon and papaya." />

      {/* The seedling nursery, in the 2D's pattern: the shade-net house in the yard where the field's seedlings start,
          its benches of trays and its door toward the field (src/components/farming/nursery-plan.tsx). */}
      <DrawingSection id="nursery" title="Nursery">
        <NurseryPlan title="Plan of the seedling nursery: a shade-net house 8,000 by 4,000 mm on eucalyptus poles every 2 m, two benches 7 m long along its long sides, each holding 48 seedling trays, a 1.2 m path between them, the door at the end toward the field and a tap beside it."
          className="h-auto w-full lg:h-full lg:w-auto" />
      </DrawingSection>

      <ModelSection id="nursery-3d" title="Nursery 3D" line={`${D}/render/nursery-line.png`} real={`${D}/render/nursery-real.webp`} width={2400} height={1100}
        lineAlt="Line drawing of the seedling nursery seen level from the front with its front and roof off: eucalyptus poles every 2 m along the back under a flat frame, two waist-high benches of seedling trays, the door frame at the right end and a tap by it."
        realAlt="The same view rendered: eucalyptus poles, grey-green shade net at the back and the ends, timber benches holding black trays of green seedlings, and a steel tap by the door." />

      {/* Field, pinned while one block builds up in fast motion, seen from above: the bare ground, the raised
          beds, the compost, the drip lines, the planting. Renders: farming.html?top=<layer>. */}
      <section id="field">
        <BuildUp title="Field" base={`${D}/render/top-ground.webp`} aspect={topPieces.aspect}
          baseAlt="One block of the field from straight above: bare sandy ground, pegged out for ten beds."
          builds={[
            { secs: 2.4, label: "Ten beds dug and raised 20 cm, each 1.2 m wide and 10 m long.", groups: [
              { src: `${D}/render/top-beds.webp`, rects: topPieces.beds, kind: "drop", from: 0, to: 0.8, rise: 40 },
            ] },
            { secs: 1.8, label: "Compost spread over each bed.", groups: [
              { src: `${D}/render/top-compost.webp`, rects: topPieces.beds, kind: "wipe", from: 0, to: 0.85 },
            ] },
            { secs: 2, label: "Two drip lines along each bed, fed from the header.", groups: [
              { src: `${D}/render/top-drip.webp`, rects: topPieces.beds, kind: "unroll", from: 0, to: 0.85 },
            ] },
            { secs: 2.8, label: "Seedlings from the nursery planted, and seed sown straight into the beds.", groups: [
              { src: `${D}/render/top-plants.webp`, rects: topPieces.beds, kind: "drop", from: 0, to: 0.85, rise: 20 },
            ] },
          ]}
          stages={[
            { title: "The bare ground", text: "Fenced, tested and marked out: soil samples to RAB, the borehole's flow measured over 6 hours, and the beds pegged across the slope." },
            { title: "Step 1 · Beds", text: `1.2 m wide, 10 m long, raised 20 cm, with 0.5 m paths between them and 1 m between blocks of ten. The start plants ${plan.bedsNeeded} of its ${plan.bedsTotal}.` },
            { title: "Step 2 · Compost", text: "About 250 kg of compost or manure per 100 m² dug into each bed, and lime only if the soil test asks for it." },
            { title: "Step 3 · Drip", text: "Two drip lines per bed from a header pipe and a filter at the tank. Run it for an hour and check every emitter before planting." },
            { title: "Step 4 · Planting", text: "Kale, cabbage, onion, tomato, pepper, eggplant and spinach come from the nursery after 4 to 6 weeks; beans, carrots, amaranth, cucumber and herbs are sown in place." },
          ]} />
      </section>

      {/* Crops: one card per crop, the biggest share of the plate first; the card in focus shows what it gives. */}
      <RailSection id="crops" title="Crops" items={cropRail()} />

      {/* Water, in the studio's Plumbing pattern: the drip installation drawn full width from the farm's tank to every
          drip line (water-diagram.tsx), then the whole field as the 3D sees it with the crops left out, every run in its
          colour and every point tagged (render/water-line.png, water-tags.json), the same view rendered before
          planting (render/water-real.webp), then each part on its own. All from farming.html?view=water and ?part=. */}
      <ServiceSection id="water" title="Water"
        diagram={<WaterDiagram irrigation={I} perBlock={10} dry={[plan.water.dryLow, plan.water.dryHigh]} />}
        figure={<TaggedFigure table="/docs/farming/water" src={`${D}/render/water-line.png`} aspect={waterTags.aspect} tags={waterTags.tags}
          alt="Line drawing of the whole field from its gate end with the crops left out: the main in dark blue coming in through the gate, the supply in blue along the main path and the aisles, an orange valve where each block's header leaves it, the headers across the bed ends, and two light-blue drip lines down every planted bed."
          info={Object.fromEntries(WATER_POINTS.map((p) => [p.id, { label: p.what, colour: p.colour }]))} />}
        note={<>
          The main comes in through the gate from the farm&rsquo;s tank and pump by the compound (T, with the disc filter F,
          off the drawing). Inside, the supply runs along the main path and up and down each column&rsquo;s end; every block
          has its own valve, so a short flow waters one block at a time. Each tag opens its row in the{" "}
          <Link href="/docs/farming/water#points" className="underline underline-offset-4">points table</Link>. Water at dawn or dusk, mulch the
          beds with dry grass, and plant season C only to the flow the borehole test proves. Under 1 ha of irrigation needs no permit.
        </>}
        real={{ src: `${D}/render/water-real.webp`, width: 2400, height: 1100,
          caption: "Rendered from the design model: the beds before planting, so the drip shows",
          alt: "The same view rendered: dark compost beds on sandy paths, two black drip lines down each planted bed, the black supply along the main path and the bed ends with orange valve boxes, the main coming in at the gate, the fence, and the fruit row behind." }}
        rail={waterRail()} />

      <DocsSection cards={DOCS} />
    </main>
  )
}
