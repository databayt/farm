import type { Metadata } from "next"
import { LocaleLink as Link } from "@/components/internationalization/locale-link"

import { DocsSection, DrawingSection, ModelSection, PageHero, RailSection, ServiceSection, railCards } from "@/components/page/sections"
import { BuildUp } from "@/components/docs/build-up"
import { TaggedFigure } from "@/components/docs/tagged-figure"
import { D, info } from "@/components/public-bathroom/data"
import { PublicBathroomPlan } from "@/components/public-bathroom/public-bathroom-plan"
import bath from "@/components/public-bathroom/public-bathroom.json"
import { BathPipeDiagram, BathWiringDiagram, runs } from "@/components/public-bathroom/services"
import electricTags from "../../../../../public/designs/public-bathroom/render/electric-tags.json"
import plumbingTags from "../../../../../public/designs/public-bathroom/render/plumbing-tags.json"
import topPieces from "../../../../../public/designs/public-bathroom/render/top-pieces.json"

// The public bathroom, in /en/studio's pattern: the hero, the 2D and the 3D, then how it is built, its fixtures, its two
// services, Electric and Plumbing, and the docs cards; the points tables and the status are on
// /docs/public-bathroom-points. Every drawing reads src/components/public-bathroom/public-bathroom.json:
// the teal 20 ft container on its stone plinth beside the galley, one door and two high windows toward the courtyard;
// inside, the founder's two toilet rooms, two hand basins and a urinal (D-022). Every size, run and device is an
// assumption [A]; nothing is sourced or priced yet, so no card names a shop or a price.

export const metadata: Metadata = {
  title: "The public bathroom · Farm",
  description: "Two toilet rooms, a urinal and two hand basins in a teal container by the courtyard, for the camp, the bar lounge and the fire pit, at the Digital Farm near Kigali.",
}

const mm = (m: number) => Math.round(m * 1000).toLocaleString("en-US")
const { toilets: TO, basins: BA, urinal: UR, cupboard: CU, passage: PA, towels: TW, plumbing: PL, electric: EL } = bath

// The Fixtures rail: each piece rendered on its own by public-bathroom.html?item=<id> (the 3D view's own meshes)
function fixturesRail() {
  const c = TO.wc.cistern
  return railCards(`${D}/render/fixtures`, [
    { id: "wc", title: "WCs × 2", size: `Floor-standing, close-coupled cistern ${mm(c.w)} × ${mm(c.d)} mm, ${mm(c.h)} mm high; ${mm(TO.wc.out)} mm into the room, seat at ${mm(TO.wc.seat)} mm`,
      note: "One against each toilet room's back wall, facing the door, with a soft-close seat and a dual-flush button." },
    { id: "basin", title: "Basin counter", size: `${(BA.x1 - BA.x0).toFixed(2)} × ${BA.d.toFixed(2)} m, top at ${BA.top.toFixed(2)} m; two bowls`,
      note: "Two white bowls on a Medium Oak counter on black steel brackets, open below so the floor washes clean; a push tap behind each bowl." },
    { id: "urinal", title: "Urinal", size: `${mm(UR.w)} mm wide, rim at ${mm(UR.rim)} mm, ${mm(UR.out)} mm from the wall`,
      note: "In its own room in the row, between the toilet rooms and the basins, its flush valve above it, so nobody at the basins sees it." },
    { id: "mirror", title: "Mirror", size: `${(BA.mirror.x1 - BA.mirror.x0).toFixed(2)} × ${(BA.mirror.y1 - BA.mirror.y0).toFixed(2)} m`,
      note: "Over the counter, in a thin black frame." },
    { id: "soap", title: "Soap dispenser", size: "About 100 × 80 × 170 mm", note: "One between the two bowls." },
    { id: "towels", title: "Paper towels and bin", size: `Dispenser ${mm(TW.w)} mm wide; lidded bin Ø ${mm(TW.bin * 2)} mm, 0.5 m high`,
      note: "On the east end wall beside the counter." },
    { id: "roll", title: "Roll holders × 2", size: "One roll, on the wall beside each WC", note: `About ${mm(TO.roll.at)} mm above the floor.` },
    { id: "cupboard", title: "Cleaner's cupboard", size: `${(CU.x1 - CU.x0).toFixed(2)} × ${(PA.y1 - PA.y0).toFixed(2)} m, floor to ceiling`,
      where: "Built in the workshop, like the studio's units", note: "At the corridor's end: a mop and bucket below, shelves of paper, soap and cleaning things above, the stop valve and meter low inside." },
  ])
}

// The Plumbing rail: each fitting on its own (public-bathroom.html?item=<id>), then the pipe, its metres measured off the runs
function plumbingRail() {
  const metres = (re: RegExp) => {
    const by = new Map<number, number>()
    for (const r of runs.filter((x) => re.test(x.system))) by.set(r.dn, (by.get(r.dn) ?? 0) + r.m)
    return [...by].sort((a, b) => b[0] - a[0]).map(([dn, m]) => `${m.toFixed(1)} m of DN${dn}`).join(", ")
  }
  const f = Object.fromEntries(PL.fittings.map((x) => [x.point, x]))
  return railCards(`${D}/render/plumbing`, [
    { id: "meter", title: "Stop valve, filter and meter", size: `${f.SV.size}, on the main`, note: `SV · ${f.SV.what}.` },
    { id: "pushtap", title: "Push taps × 2", size: "Cold, a push button that closes itself", note: "BT1, BT2 · so no tap is left running." },
    { id: "flushvalve", title: "Urinal flush valve", size: "A timed push button on a 15 mm feed", note: `UV · ${f.UV.what}.` },
    { id: "floordrain", title: "Floor drain", size: f.FD.size, note: `FD · ${f.FD.what}, so the lobby can be washed down.` },
    { id: "chamber", title: "Inspection chamber", size: f.IC1.size, note: `IC1 · ${f.IC1.what}.` },
    { id: "ppr", title: "PP-R supply pipe", size: `${metres(/^cold$/)}, PN20, welded joints`, note: "In the linings 300 mm above the floor, then straight up to each outlet." },
    { id: "upvc", title: "uPVC drain pipe", size: metres(/^(soil|waste)$/), note: "Under the floor and through the plinth, each run falling at least 1:40, a rodding eye at every bend." },
    { id: "vent", title: "Vent and its cage", size: metres(/^vent$/), note: "V1 · up the back wall outside, to 900 mm above the roof." },
  ])
}

// The Electric rail: each device on its own (public-bathroom.html?item=<id>)
function electricRail() {
  const n = EL.points.filter((p) => p.model === "light").length
  return railCards(`${D}/render/electric`, [
    { id: "board", title: "Unit board", size: EL.board.size, note: `DB · ${EL.board.what}.` },
    { id: "light", title: `Ceiling lights × ${n}`, size: "Ø 300 mm, a motion sensor in the middle", note: "L1–L5 · each room lights when someone walks in and goes dark a few minutes after." },
    { id: "fan", title: "Extract fan", size: `Ø ${mm(UR.fan.r * 2)} mm grille`, note: "F1 · in the urinal room, which has no window; it runs with the light and 15 minutes after." },
    { id: "socket", title: "Socket", size: "Double, 146 × 86 mm", note: "P1 · for the cleaner, by the cupboard." },
    { id: "walllight", title: "Light over the door", size: "About 180 × 140 mm, IP65", note: "L6 · outside, on with the path lights from 18:00." },
  ])
}

// The bathroom's own docs page first, as the studio's are, then the guides behind its services.
const DOCS = [
  { href: "/docs/public-bathroom-points", title: "Electric and plumbing points", text: "Every light, socket, tap and drain on the drawings above, with its circuit or its pipes, and where the design stands." },
  { href: "/docs/electrician", title: "Electrician's guide", text: "Boards, RCBOs, earthing and the tests, in the studio's pattern." },
  { href: "/docs/plumber", title: "Plumber's guide", text: "The farm's pipe conventions, the tests before the walls close, and the septic tank's rules." },
  { href: "/docs/power", title: "Power", text: "Grid, solar or both: the site board this bathroom is fed from, and sun for hot water." },
]

export default function PublicBathroomPage() {
  return (
    <main className="w-full flex-1">
      {/* First screen: a STAND-IN until the founder's Nano Banana remaster. For now it is the design model rendered
          from eye level in the courtyard (scripts/site/render/public-bathroom.html?mode=real&hero=1, 2400 x 1340),
          front wall and roof on. The bathroom sits right, so the words keep the open lawn bottom-left. */}
      <PageHero src={`${D}/render/public-bathroom-hero.jpg`} width={2400} height={1340} className="bg-[#c9d6df]" imgClassName="object-[62%_60%]"
        title="Toilets and hand basins for the camp"
        alt="A teal shipping container on a fieldstone plinth on a green lawn under a blue sky: two small white-framed windows of frosted glass and a red door with a frosted glass panel and a lamp above it, a concrete-capped stone landing and step in front of the door." />

      {/* 2D, full screen: the bathroom's plan (src/components/public-bathroom/public-bathroom-plan.tsx), in the text
          colour. */}
      <DrawingSection id="plans" title="2D">
        <PublicBathroomPlan title="Plan: a 20 ft container 6,058 by 2,438 mm on a stone plinth, with a 1,500 mm landing and a step in front of its door at the east end of the front wall; inside, one row against the back wall: two toilet rooms 1,350 by 1,200 mm, each with a WC against the back wall, then the urinal in its own room 900 mm wide, then the two basins on a counter straight across from the door, paper towels and a bin on the end wall beside them and a floor drain; a 900 mm corridor along the front wall, under the two windows, joins them and ends at the cleaner's cupboard."
          className="h-auto w-full lg:h-full lg:w-auto" />
      </DrawingSection>

      {/* 3D, in the 2D section's pattern: a line drawing of the bathroom seen from the courtyard with its front wall
          and roof off, then the same view rendered. Both from scripts/site/render/public-bathroom.html. */}
      <ModelSection line={`${D}/render/public-bathroom-line.png`} real={`${D}/render/public-bathroom-real.webp`} width={2400} height={1100}
        lineAlt="Line drawing of the bathroom from the courtyard with its front wall and roof off: the container on its plinth, the landing and the step; two toilet rooms, each with a WC and a roll holder, their back wall cut low to show the passage behind and the tall cleaner's cupboard at its end; the lobby with two bowls on a counter under a long mirror, a soap dispenser, paper towels over a bin and a floor drain; and the urinal with its flush valve and an extract fan in the end room."
        realAlt="The same view rendered: teal corrugated steel on a fieldstone plinth, white wall tiles under off-white paint, warm grey floor tiles, white WCs, a white urinal and two white bowls, chrome taps, a Medium Oak counter and cleaner's cupboard, a long mirror, and a concrete-capped landing and step on the lawn." />

      {/* Build, pinned while the bathroom goes up in fast motion, seen from straight above with the roof off: the box,
          the first fix, the partitions, the floor tiles, the fittings. Renders: public-bathroom.html?top=<layer>, each
          layer masked by the ones built before it; the piece rectangles in top-pieces.json. */}
      <section id="build">
        <BuildUp title="Build" base={`${D}/render/top-base.webp`} aspect={topPieces.aspect}
          baseAlt="The bathroom's container from straight above, roof off: its bare floor inside the teal walls, the linings tiled, on the fieldstone plinth, with the landing and the step in front."
          builds={[
            { secs: 2.4, label: "First fix: the supply along the walls and the drains up through the floor.", groups: [
              { src: `${D}/render/top-pipes.webp`, rects: topPieces.tags.pipes, kind: "wipe", from: 0, to: 0.85 },
            ] },
            { secs: 2, label: "The partitions stood up and lined.", groups: [
              { src: `${D}/render/top-walls.webp`, rects: topPieces.tags.walls, kind: "drop", from: 0, to: 0.8, rise: 40 },
            ] },
            { secs: 2, label: "The floor tiled, falling to the drain.", groups: [
              { src: `${D}/render/top-floor.webp`, rects: topPieces.tags.floor, kind: "drop", from: 0, to: 0.8, rise: 24 },
            ] },
            { secs: 2.6, label: "The fittings set: the cupboard, the WCs, the basins, the urinal.", groups: [
              { src: `${D}/render/top-fittings.webp`, rects: topPieces.tags.fittings, kind: "drop", from: 0, to: 0.85, rise: 30 },
            ] },
          ]}
          stages={[
            { title: "The box", text: "A 20 ft container on its fieldstone plinth, its outer walls lined and tiled to 1.5 m, its own floor still bare." },
            { title: "Step 1 · First fix", text: "PP-R supply in the linings 300 mm up; uPVC drains under the floor and out through the plinth; every pipe held at 10 bar for an hour before anything closes over it." },
            { title: "Step 2 · Partitions", text: "Timber studs, cement board both sides, 100 mm: between the toilet rooms, behind them on the passage side and round the urinal room." },
            { title: "Step 3 · Floor", text: "Non-slip tiles in warm grey, falling to the lobby's floor drain so the whole floor can be washed down." },
            { title: "Step 4 · Fittings", text: "The cleaner's cupboard, the two WCs and their roll holders, the basin counter with its mirror and soap, the towels and the urinal." },
          ]} />
      </section>

      {/* Fixtures: one card per piece, the card in focus shows its size, source and cost below. */}
      <RailSection id="fixtures" title="Fixtures" items={fixturesRail()} />

      {/* Electric, in the studio's pattern: the bathroom's board and circuits (services.tsx), the 3D's view with every cable
          route in its circuit's colour and every device tagged (render/electric-line.png), the same view rendered at
          dusk with the lights on (render/electric-real.webp), then each device. public-bathroom.html?view=electric. */}
      <ServiceSection id="electrical" title="Electric"
        diagram={<BathWiringDiagram />}
        figure={<TaggedFigure table="/docs/public-bathroom-points" src={`${D}/render/electric-line.png`} aspect={electricTags.aspect} tags={electricTags.tags} info={info}
          alt="Line drawing of the bathroom from the courtyard, faint, with every device dark and every cable route: the unit board on the passage's back wall, blue runs up into the ceiling and across to a round light in each toilet room, the passage, the lobby and the urinal room, and down to the extract fan; another blue run to the front wall over the door; an orange run down to the cleaner's socket." />}
        note={<>
          Every run goes up into the ceiling void, along it and straight down to its device. Each tag opens its row in the{" "}
          <Link href="/docs/public-bathroom-points#electric-points" className="underline underline-offset-4">points table</Link>. Outside the drawing: the light over
          the door (L6) on the front wall, which the drawing leaves off, and the earth rod (E1) in a pit behind the back
          wall below the board. The board&rsquo;s feeder comes from the farm&rsquo;s site board, sized when that is designed.
        </>}
        real={{ src: `${D}/render/electric-real.webp`, width: 2400, height: 1100, caption: "Rendered from the design model, at dusk with the lights on",
          alt: "The same view rendered at dusk: a round ceiling light glowing over each toilet room, the passage, the lobby and the urinal room, the white unit board on the passage's back wall and the extract fan's grille on the east end wall." }}
        rail={electricRail()} />

      {/* Plumbing, in the same pattern: the water drawn full width from the farm's tank to every outlet and on to the
          septic tank (services.tsx), then the 3D's view with every run in its colour, dashed where a wall, the floor or
          the plinth hides it, every fitting tagged (render/plumbing-line.png), the same view rendered with the floor,
          the tiles and the plinth see-through (render/plumbing-real.webp), then each part on its own. All from
          public-bathroom.html?view=plumbing and ?item=. */}
      <ServiceSection id="plumbing" title="Plumbing"
        diagram={<BathPipeDiagram />}
        figure={<TaggedFigure table="/docs/public-bathroom-points" src={`${D}/render/plumbing-line.png`} aspect={plumbingTags.aspect} tags={plumbingTags.tags} info={info}
          alt="Line drawing of the bathroom from the courtyard, faint, with its fittings dark and every pipe run: cold in blue from the stop valve in the cleaner's cupboard along the back wall and up to the two WC cisterns, the two basin taps and the urinal's flush valve; the drains in brown under the floor, the WCs' soil run and the lobby's waste run leaving through the back of the plinth for the inspection chamber; the vent in grey up the back wall." />}
        note={<>
          Supplies run in the linings, then straight up to each outlet; drains run under the floor in the plinth. A run is
          dashed where a wall, the floor or the plinth hides it. Each tag opens its row in the{" "}
          <Link href="/docs/public-bathroom-points#plumbing-points" className="underline underline-offset-4">points table</Link>. Behind the back wall, off the
          floor: IC1 takes both runs, and S1 carries them to the farm&rsquo;s septic tank and soakaway, at least 50 m from
          the borehole. That tank was sized for the two studios; the campers, the bar and the fire pit must be added
          before it is built. Cold only: a shower, should the founder add one, would bring the solar water heater the
          power guide plans for this building.
        </>}
        real={{ src: `${D}/render/plumbing-real.webp`, width: 2400, height: 1100,
          caption: <>Rendered from the design model, the floor, the tiles and the plinth see-through, the pipes in the diagram&rsquo;s colours</>,
          alt: "The same view rendered with the floor, the wall tiles and the plinth see-through: the brown drains under the toilet rooms and the lobby, from each WC, the basins, the floor drain and the urinal, out through the back; the blue supply along the back wall and up to the cisterns, the taps and the urinal's valve; the grey vent rising behind the back wall." }}
        rail={plumbingRail()} />

      <DocsSection cards={DOCS} />
    </main>
  )
}
