import type { Metadata } from "next"
import { LocaleLink as Link } from "@/components/internationalization/locale-link"

import { frw } from "@/lib/format"
import { DocsSection, DrawingSection, ModelSection, PageHero, RailSection, ServiceSection } from "@/components/page/sections"
import { BuildUp } from "@/components/docs/build-up"
import { TaggedFigure } from "@/components/docs/tagged-figure"
import { animalRail, manureRail, waterRail, yardRail } from "@/components/livestock/rails"
import { D, days, high, low, peak, POINT_COLOUR, tank, yardM } from "@/components/livestock/data"
import livestock from "@/components/livestock/livestock.json"
import { LivestockPlan } from "@/components/livestock/livestock-plan"
import { ManureDiagram } from "@/components/livestock/manure-diagram"
import { WaterDiagram } from "@/components/livestock/water-diagram"
import buildPieces from "../../../../../public/designs/livestock/render/build-pieces.json"
import waterTags from "../../../../../public/designs/livestock/render/water-tags.json"

// The livestock yard, in /en/studio's pattern: the hero, the 2D and the 3D, the shed's build-up, the animal and yard
// rails, Water and Manure, then the docs cards; the water points, what the yard drinks and the status are on
// its docs pages (/docs/livestock). Both drawings read src/components/livestock/livestock.json: the starting herd of 6 goats and 4 sheep (D-030) in a thatched pole
// shelter's open hall (D-037) inside one outline (D-039), opening onto the village yard they share by day with the
// farm friends, 3 cats and the doves, and with the guests (D-038, D-040); the 2 guard dogs' run, the feed store, the
// tank and the compost bays that close the loop to the field. Every size is an assumption until the farm's vet
// checks it.

export const metadata: Metadata = {
  title: "The livestock · Farm",
  description: "Goats and sheep in one village yard by a thatched shelter, with three cats, free-flying doves and two guard dogs, part of the farm’s loop from field to compost, at the Digital Farm near Kigali.",
}

const { pens: PN, compost: CO, shelter: SH, water: WV } = livestock

// The livestock's docs pages, as the docs sidebar groups them (D-059), linked from the end of this page.
const DOCS = [
  { href: "/docs/livestock", title: "Execution plan", text: "The checks before any animal, the shed and the yard, the daily care and the rules, for 6 goats and 4 sheep." },
  { href: "/docs/livestock/materials", title: "Materials", text: "The animals, the yard's fittings, the water and the manure loop, each with its size and source." },
  { href: "/docs/livestock/water", title: "Water", text: "The tank, the buried line and the float troughs, what the yard drinks a day, and every point." },
]

export default function LivestockPage() {
  return (
    <main className="w-full flex-1">
      {/* First screen: the founder's Nano Banana remake (2026-10-29, D-046) of the reference photo on the farm: the shed,
          the lashed rails and the baskets of the photo, the yard open on Rwanda's terraced green hills with eucalyptus
          and banana plants, the herd in the yard and two sheep in the shed, the dovecote, the cats' house, the tank, the
          compost bays and the dogs' kennels. Served at its native 1678 x 937 (original: assets/livestock/hero-gemini.png). */}
      <PageHero src={`${D}/render/livestock-hero.jpg`} width={1678} height={937} className="bg-[#b9bdb4]" imgClassName="object-[55%_55%]"
        title="Goats and sheep on open pasture"
        alt="A livestock yard on a Rwandan hillside under a soft grey sky: a shed with a shaggy thatched roof and two sheep inside, goats and black-headed sheep on straw behind a rail fence lashed with rope, a dovecote with white doves and a cats’ house on posts at the left, a water tank and two dog kennels at the right, woven baskets by the gate, banana plants and eucalyptus round the yard, and terraced green hills behind." />

      {/* 2D, full screen: the house's plan (src/components/livestock/livestock-plan.tsx), in the text colour. */}
      <DrawingSection id="plans" title="2D">
        <LivestockPlan title="Plan: one outline 17,200 by 9,600 mm, a post-and-rail fence all round with one gate to the paddock. Inside, the herd’s shed copied from the founder’s photo, 4,400 by 3,000 mm under a thatched gable on a low fieldstone plinth: a boarded back and east end, the west end open behind one rail, the front open between two braced corner posts; inside a straw bale, a plank table with a basket over a lidded crate, and the two mineral boxes. The village yard for the herd, the cats, the doves and the guests, with troughs, climbing stones, a shade tree, a log bench, a dovecote and a cats’ house on posts; by the shed the tank on its stone base with three buckets, fodder baskets and three compost bays, and the guard dogs’ run with two kennels in the back east corner; banana clumps and shrubs round the outside and two vegetable beds in front."
          className="h-auto w-full lg:h-full lg:w-auto" />
      </DrawingSection>

      {/* 3D, in the 2D section's pattern: the yard seen straight on from the paddock with the roof off, as a line
          drawing, then rendered. Both from scripts/site/render/livestock.html. */}
      <ModelSection line={`${D}/render/livestock-line.png`} real={`${D}/render/livestock-real.webp`} width={2400} height={1400}
        lineAlt="Line drawing of the livestock yard from the paddock: one crooked post-and-rail fence all round with a two-leaf gate, banana clumps behind; the shed as in the hero, its steep thatched gable over a boarded back and side and two braced corner posts, two sheep inside by a straw bale and a table; goats and sheep in the yard, one goat on a stone, troughs, a bench, the dovecote and the cats’ house on posts, three cats, the guarded tree; the tank on its stone base with three buckets, the baskets, the compost bays and the dogs’ run with two kennels; two vegetable beds in front."
        realAlt="The same view rendered: banana plants behind a fence of thick crooked rails lashed with rope; the shed of dark weathered boards and heavy barked posts under a shaggy thatch, two white sheep on golden straw; goats and black-headed sheep on red-brown earth and straw, a ginger cat on its house, doves on the dovecote, an earth-brown tank on a stone base with three black buckets, baskets of green fodder, the compost bays, a tan and a black dog in their run, and two beds of cabbages outside the front." />

      {/* Shed, pinned while it goes up in fast motion, seen low from the front: the stone-edged plinth, the barked frame,
          the boards, the thatch, then the straw and the fittings. Renders: livestock.html?build=<layer>; the pieces'
          rectangles: render/build-pieces.json. */}
      <section id="shed">
        <BuildUp title="Shed" base={`${D}/render/build-base.webp`} aspect={buildPieces.aspect}
          baseAlt="The shed's plinth seen low from the front: rammed earth edged with fieldstones, on the white page."
          builds={[
            { secs: 2.6, label: "Four barked corner posts, then the eaves beam, the plate, the tie beams and the braces.", groups: [
              { src: `${D}/render/build-posts.webp`, rects: buildPieces.posts, kind: "drop", from: 0, to: 0.4, rise: 60 },
              { src: `${D}/render/build-beams.webp`, rects: buildPieces.beams, kind: "drop", from: 0.45, to: 0.85, rise: 40 },
            ] },
            { secs: 2.8, label: "Wide boards set upright along the back and the east end.", groups: [
              { src: `${D}/render/build-boards.webp`, rects: buildPieces.boards, kind: "drop", from: 0, to: 0.85, rise: 30 },
            ] },
            { secs: 2.6, label: "The gable rafters, then the grass thatch laid from the eaves up.", groups: [
              { src: `${D}/render/build-rafters.webp`, rects: buildPieces.rafters, kind: "drop", from: 0, to: 0.3, rise: 40 },
              { src: `${D}/render/build-thatch.webp`, rects: buildPieces.thatch, kind: "spray", from: 0.4, to: 0.9 },
            ] },
            { secs: 2.2, label: "Deep straw on the floor, then the bale, the feed table and the mineral boxes.", groups: [
              { src: `${D}/render/build-litter.webp`, rects: buildPieces.litter, kind: "wipe", from: 0, to: 0.4 },
              { src: `${D}/render/build-fit.webp`, rects: buildPieces.fit, kind: "drop", from: 0.45, to: 0.9, rise: 30 },
            ] },
          ]}
          stages={[
            { title: "The plinth", text: `${SH.l} × ${SH.d} m of rammed earth on a plinth ${SH.plinth.h * 100} cm high, edged with fieldstones, so rain runs off and the herd lies dry. At least 200 m from the lake’s flood line (LOC-02).` },
            { title: "Step 1 · Frame", text: "Four heavy barked eucalyptus posts, the eaves beam along the open front and the plate along the back, a tie beam at each end and a knee brace at each front post." },
            { title: "Step 2 · Boards", text: "Dark weathered boards set upright at the back and the east end, against the wind; the west end stays open behind one rail and the front is open." },
            { title: "Step 3 · Thatch", text: `A steep grass thatch on the gable, its eaves ${SH.roof.eaves} m up, the ridge at ${SH.roof.ridge} m, overhanging ${SH.roof.over} m so the troughs stand in its shade.` },
            { title: "Step 4 · Straw and fittings", text: `Deep straw over the earth, ${frw(Math.round((SH.l * SH.d) / PN.head * 10) / 10)} m² a head for ${PN.head} head; a bale, the feed table over its locking crate, and the mineral boxes, the goats’ high and the sheep’s low.` },
          ]} />
      </section>

      {/* Animals and the yard's things: one card each, rendered on its own from the 3D's meshes; the card in focus shows
          its numbers below. */}
      <RailSection id="animals" title="Animals" items={animalRail()} />
      <RailSection id="yard" title="Yard" items={yardRail()} />

      {/* Water, in the studio's Plumbing pattern: the yard's water drawn full width from the farm's line to every trough
          (water-diagram.tsx), then the yard closer in with every run in its colour and every point tagged
          (render/water-line.png, water-tags.json), the same view rendered (render/water-real.webp), then each part on
          its own. All from livestock.html?view=water and ?item=, built from livestock.json's water section. */}
      <ServiceSection id="water" title="Water"
        diagram={<WaterDiagram tank={tank} yardM={yardM} need={[Math.round(low), Math.round(high)]} peak={Math.round(peak)} days={days} />}
        figure={<TaggedFigure table="/docs/livestock/water" src={`${D}/render/water-line.png`} aspect={waterTags.aspect} tags={waterTags.tags}
          alt="Line drawing of the shed, the tank and the troughs from the paddock: the farm's line in dark blue up the tank's side to the float valve under its lid, the outlet valve and the bucket tap in orange on the riser down the tank's stone base, the yard line in blue past the shed's east end and along the front of the eaves, and a light-blue riser up to each trough."
          info={Object.fromEntries(WV.points.map((p) => [p.id, { label: p.what, colour: POINT_COLOUR[p.id] }]))} />}
        note={<>
          The farm&rsquo;s line fills the tank through a float valve; from the tank&rsquo;s foot one buried line feeds a float
          valve in each trough, so the troughs stay full without anyone carrying water. Each tag opens its row in the{" "}
          <Link href="/docs/livestock/water#points" className="underline underline-offset-4">points table</Link>. Off the drawing: the dogs&rsquo;
          bowl (B), filled by bucket from the tap. Where the farm&rsquo;s line comes from waits for the farm&rsquo;s water plan and
          the borehole test, and water for livestock on a farm needs a water use permit (LOC-04).
        </>}
        real={{ src: `${D}/render/water-real.webp`, width: 2400, height: 1400,
          caption: "Rendered from the design model: the yard line drawn on the ground where it runs buried",
          alt: "The same view rendered: the thatched shed with sheep on the straw, the earth-brown tank on its stone base with a black pipe up its side, a brass valve with a red lever and a tap on the riser, the black yard line past the buckets and along the front of the eaves to the two plank troughs of water, goats and sheep in the yard." }}
        rail={waterRail()} />

      {/* Manure, in the services' pattern: the loop from the shed's litter through the compost bays to the beds and back,
          drawn full width (manure-diagram.tsx), then the bays and the baskets on their own. */}
      <ServiceSection id="manure" title="Manure"
        diagram={<ManureDiagram bay={CO.bay} bays={CO.n} />}
        rail={manureRail()} />

      <DocsSection cards={DOCS} ownPlan />
    </main>
  )
}
