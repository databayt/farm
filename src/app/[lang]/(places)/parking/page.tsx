import type { Metadata } from "next"
import { LocaleLink as Link } from "@/components/internationalization/locale-link"

import { DocsSection, DrawingSection, ModelSection, PageHero, RailSection, ServiceSection } from "@/components/page/sections"
import { BuildUp } from "@/components/docs/build-up"
import { drainRail, lightRail, partsRail } from "@/components/parking/rails"
import { TaggedFigure } from "@/components/docs/tagged-figure"
import { blocks, D, DRAIN_POINTS, e, feedM, lampM, LIGHT_POINTS, m, subM3, x0, x1, y0, y1 } from "@/components/parking/data"
import { DrainageDiagram } from "@/components/parking/drainage-diagram"
import { LightingDiagram } from "@/components/parking/lighting-diagram"
import { ParkingPlan } from "@/components/parking/parking-plan"
import parking from "@/components/parking/parking.json"
import drainTags from "../../../../../public/designs/parking/render/drain-tags.json"
import lightTags from "../../../../../public/designs/parking/render/light-tags.json"
import topPieces from "../../../../../public/designs/parking/render/top-pieces.json"

// The way in, in /en/studio's pattern: the hero, the 2D and the 3D, then how the green parking is built, its parts, the
// two services it needs, the lights and where the rain goes, and the docs cards; the points tables are
// on its docs pages (/docs/parking). Every drawing reads
// src/components/parking/parking.json, in compound.json's true metres: the outer gate off the public road, the sign
// wall lettered DIGITAL FARM, the green parking with its five bays under shade trees, and the start of the rock road
// to the inner gate. What the plan leaves open (a full house, a minibus's turn, reversing out) is in the json; how it is
// built, drained and lit is design intent [A] until a builder sees the ground.

export const metadata: Metadata = {
  title: "Parking · Farm",
  description: "Five bays on grass pavers under shade trees, just inside the gate and the DIGITAL FARM sign wall, at the Digital Farm near Kigali.",
}

const { parking: PK, build: B, drainage: DR } = parking

// The parking's docs pages, as the docs sidebar groups them (D-059), linked from the end of this page.
const DOCS = [
  { href: "/docs/parking", title: "Execution plan", text: "Every step of building the way in: the green parking, its edging and strips, the lights and the drain." },
  { href: "/docs/parking/materials", title: "Materials", text: "The gate, the sign, the pavers, the setts and the trees, the lights and the drainage, each with its size." },
  { href: "/docs/parking/lighting", title: "Lighting", text: "The feed down the rock road, the box on the sign wall, the lanterns and the letters, with every point." },
  { href: "/docs/parking/drainage", title: "Drainage", text: "The pavers and the sub-base as the drain, the falls, the trench and the soakaway, with every point." },
]

export default function ParkingPage() {
  return (
    <main className="w-full flex-1">
      {/* First screen: the founder's Nano Banana render of the way in (2026-10-31), made from the brief in
          ~/Desktop/parking-nano-banana; master kept at assets/parking/hero-gemini.jpeg (2752 x 1536), cut to
          2400 x 1340. It departs from the drawings in three things: the letters stand proud on the stone with no
          steel panel, a flower bed runs along the wall's foot, and both pillars carry a lantern. The words keep the
          red road bottom-left. */}
      <PageHero src={`${D}/render/parking-hero.jpg`} width={2400} height={1340} className="bg-[#b8653a]" imgClassName="object-[50%_50%]"
        title="Parking on grass, just inside the gate"
        alt="A fieldstone wall under a timber cap lettered DIGITAL FARM at golden hour, a bed of orange cannas, blue agapanthus and yellow lantana at its foot, beside two fieldstone pillars with lanterns and a honey timber gate braced in an X standing open; a fan of grey granite setts from the red dirt road through the gate onto grass pavers, a white four-by-four parked under broad acacia trees, and a sett road leading on to a second gate among tall eucalyptus." />

      {/* 2D, full screen: the way in's plan (src/components/parking/parking-plan.tsx), in the text colour. */}
      <DrawingSection id="plans" title="2D">
        <ParkingPlan title="Plan: a parking lawn of grass pavers 22,000 by 6,000 mm in a fieldstone edging; along its west end five bays of 2,600 mm, sett strips 4,000 mm long between them and a log wheel stop in each, cars in bays 1 and 3; 3,400 mm behind the strips the 7,600 mm sign wall, lettered DIGITAL FARM on its road face, and beside it the 4,400 mm gate, its leaves opening inward; a hedge along the boundary, a turn of setts from the public road through the gate, four shade trees, and the rock road, 4,000 mm wide, leaving the far edge for the inner gate."
          className="h-auto w-full lg:h-full lg:w-auto" />
      </DrawingSection>

      {/* 3D, in the 2D section's pattern: a line drawing of the way in seen from beyond the public road, the gate shut,
          then the same view rendered. Both from scripts/site/render/parking.html. */}
      <ModelSection line={`${D}/render/parking-line.png`} real={`${D}/render/parking-real.webp`} width={2400} height={1100}
        lineAlt="Line drawing of the way in from beyond the public road: the hedge along the boundary, the sign wall lettered DIGITAL FARM, the gate shut between its pillars, the turn of setts, the parking with its five bays, strips and wheel stops, two cars in their bays, four shade trees and the start of the rock road."
        realAlt="The same view rendered in daylight: a red dirt road, a clipped green hedge, a fieldstone sign wall with DIGITAL FARM glowing in warm-white LED letters on dark steel, a timber gate braced in an X between fieldstone pillars, grey granite setts, a lawn of grass pavers in a fieldstone edging with sett strips and eucalyptus wheel stops, a white four-by-four and a silver hatchback, and young shade trees casting shadows on the grass." />

      {/* Parking, pinned while it builds up in fast motion, seen from above with the road at the bottom: the dug box,
          the sub-base, the edging, the pavers, the grass, the strips and stops. Renders: parking.html?top=<layer>. */}
      <section id="build">
        <BuildUp title="Parking" base={`${D}/render/top-ground.webp`} aspect={topPieces.aspect}
          baseAlt="The parking's place from straight above: the turf lifted and a box of red-brown subsoil dug out, 22 by 6 m with rounded corners, pegged at its corners and strung."
          builds={[
            { secs: 2, label: "Crushed stone spread over the box and rolled.", groups: [
              { src: `${D}/render/top-sub.webp`, rects: topPieces.sub, kind: "wipe", from: 0, to: 0.85 },
            ] },
            { secs: 1.6, label: "The fieldstone edging set round it.", groups: [
              { src: `${D}/render/top-edging.webp`, rects: topPieces.edging, kind: "drop", from: 0, to: 0.8, rise: 30 },
            ] },
            { secs: 3.6, label: "The paver blocks laid, their cells filled with topsoil, then the grass grows up through them.", groups: [
              { src: `${D}/render/top-pavers.webp`, rects: topPieces.pavers, kind: "drop", from: 0, to: 0.4, rise: 40 },
              { src: `${D}/render/top-grass.webp`, rects: topPieces.grass, kind: "wipe", from: 0.5, to: 0.85 },
            ] },
            { secs: 2, label: "Sett strips between the bays, and a wheel stop in each.", groups: [
              { src: `${D}/render/top-marks.webp`, rects: topPieces.strips, kind: "drop", from: 0, to: 0.5, rise: 30 },
              { src: `${D}/render/top-marks.webp`, rects: topPieces.stops, kind: "drop", from: 0.4, to: 0.85, rise: 30 },
            ] },
          ]}
          stages={[
            { title: "The ground, dug out", text: `The turf lifted and the box dug ${m(B.dig)} mm down to firm subsoil, ${x1 - x0} × ${y1 - y0} m with rounded corners, pegged and strung, its floor shaped to the lot's fall.` },
            { title: "Step 1 · Sub-base", text: `${m(B.subbase)} mm of crushed stone, about ${Math.round(subM3)} m³, spread and rolled in layers. It carries the cars and holds the rain.` },
            { title: "Step 2 · Edging", text: `Fieldstone ${m(e)} mm wide set in a concrete haunch round the box, flush with the finished pavers, so they cannot creep.` },
            { title: "Step 3 · Pavers and grass", text: `${m(B.bedding)} mm of sharp sand and topsoil, then about ${blocks.toLocaleString("en-US")} blocks of ${m(B.paver.l)} × ${m(B.paver.w)} mm laid butted, cells filled with topsoil and seeded: ${B.cure}.` },
            { title: "Step 4 · Strips and stops", text: `A row of setts 100 mm wide between neighbouring bays, ${m(PK.strips.l)} mm long, and a eucalyptus log pinned in each bay.` },
          ]} />
      </section>

      {/* Parts: each part of the way in on its own, its size, source and cost below the card in focus. */}
      <RailSection id="parts" title="Parts" items={partsRail()} />

      {/* Lighting, in the studio's Electric pattern: the circuit drawn full width from the compound's board to every
          lamp, then the way in with every duct run in its colour and every point tagged (render/light-line.png,
          light-tags.json), the same view rendered at dusk with the sign and the lantern lit (render/light-real.webp),
          then each part on its own. All from parking.html?view=light and ?item=. */}
      <ServiceSection id="lighting" title="Lighting"
        diagram={<LightingDiagram feedM={feedM} lampM={lampM} />}
        figure={<TaggedFigure table="/docs/parking/lighting" src={`${D}/render/light-line.png`} aspect={lightTags.aspect} tags={lightTags.tags}
          alt="Line drawing of the way in from beyond the road with the lighting's ducts: the feed in dark blue coming down beside the rock road and across under the parking's open end to the box behind the sign wall, the lantern cable in blue along behind the hedge and up the gate's left pillar, and the letters' link in orange through the wall."
          info={Object.fromEntries(LIGHT_POINTS.map((p) => [p.id, { label: p.what, colour: p.colour }]))} />}
        note={<>
          Every run is underground in a duct, drawn here through the wall and the gate that hide it. The circuit is the
          farm&rsquo;s outdoor lights, protected at the compound&rsquo;s board; the box on the sign wall switches it at dusk.
          Each tag opens its row in the{" "}
          <Link href="/docs/parking/lighting#points" className="underline underline-offset-4">points table</Link>. Outside the drawing: the inner
          gate&rsquo;s lantern (L2) and the board the feed leaves from.
        </>}
        real={{ src: `${D}/render/light-real.webp`, width: 2400, height: 1100,
          caption: "Rendered from the design model, at dusk: the letters and the outer gate's lantern lit",
          alt: "The same view after sunset: the lawn and the trees dark, DIGITAL FARM glowing warm white on the sign wall and the lantern on the gate's left pillar lighting the pillar, the setts and the road in front." }}
        rail={lightRail()} />

      {/* Drainage, in the studio's Plumbing pattern: a long section of the lot drawn full width, then the way in as the
          3D sees it with every fall as an arrow, the trench and the pit in their colours and every point tagged
          (render/drain-line.png, drain-tags.json), the same view rendered with what shows of them (render/drain-real.webp),
          then each part on its own. All from parking.html?view=drain and ?item=. */}
      <ServiceSection id="drainage" title="Drainage"
        diagram={<DrainageDiagram box={PK.box} build={B} drainage={DR} />}
        figure={<TaggedFigure table="/docs/parking/drainage" src={`${D}/render/drain-line.png`} aspect={drainTags.aspect} tags={drainTags.tags}
          alt="Line drawing of the way in from beyond the road with arrows of fall: three long arrows along the parking to its west end, two through the gate back to the road and four across the rock road to its edges, the gravel trench in dark blue across the west end and the soakaway pit by the hedge in light blue."
          info={Object.fromEntries(DRAIN_POINTS.map((p) => [p.id, { label: p.what, colour: p.colour }]))} />}
        note={<>
          The pavers and the stone under them are the drain: the rain soaks in where it falls. A storm heavier than the
          stone holds runs along the lot to its west end, into the trench and on to the soakaway. The turn sheds back to the
          road, so the road&rsquo;s water stays out. Each tag opens its row in the{" "}
          <Link href="/docs/parking/drainage#points" className="underline underline-offset-4">points table</Link>. The soil&rsquo;s soakage is not
          tested yet: a percolation test on site sizes the pit, or says the trench must run on to a ditch.
        </>}
        real={{ src: `${D}/render/drain-real.webp`, width: 2400, height: 1100,
          caption: "Rendered from the design model: the trench's stone and the pit's cover are all that show",
          alt: "The same view rendered in daylight: the grass-paver parking in its fieldstone edging, a strip of grey stone across the lawn at its west end and a square concrete cover by the hedge, the sign wall, the gate and the start of the rock road." }}
        rail={drainRail()} />

      <DocsSection cards={DOCS} ownPlan />
    </main>
  )
}
