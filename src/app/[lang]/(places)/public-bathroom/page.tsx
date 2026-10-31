import type { Metadata } from "next"
import { LocaleLink as Link } from "@/components/internationalization/locale-link"

import { DocsSection, DrawingSection, ModelSection, PageHero, RailSection, ServiceSection } from "@/components/page/sections"
import { BuildUp } from "@/components/docs/build-up"
import { TaggedFigure } from "@/components/docs/tagged-figure"
import { electricRail, fixturesRail, plumbingRail } from "@/components/public-bathroom/rails"
import { D, info } from "@/components/public-bathroom/data"
import { PublicBathroomPlan } from "@/components/public-bathroom/public-bathroom-plan"
import { BathPipeDiagram, BathWiringDiagram } from "@/components/public-bathroom/services"
import electricTags from "../../../../../public/designs/public-bathroom/render/electric-tags.json"
import plumbingTags from "../../../../../public/designs/public-bathroom/render/plumbing-tags.json"
import topPieces from "../../../../../public/designs/public-bathroom/render/top-pieces.json"

// The public bathroom, in /en/studio's pattern: the hero, the 2D and the 3D, then how it is built, its fixtures, its two
// services, Electric and Plumbing, and the docs cards; the points tables and the status are on
// its docs pages (/docs/public-bathroom). Every drawing reads src/components/public-bathroom/public-bathroom.json:
// the teal 20 ft container on its stone plinth beside the galley, one door and two high windows toward the courtyard;
// inside, the founder's two toilet rooms, two hand basins and a urinal (D-022). Every size, run and device is an
// assumption [A]; nothing is sourced or priced yet, so no card names a shop or a price.

export const metadata: Metadata = {
  title: "The public bathroom · Farm",
  description: "Two toilet rooms, a urinal and two hand basins in a teal container by the courtyard, for the camp, the bar lounge and the fire pit, at the Digital Farm near Kigali.",
}

// The public bathroom's docs pages, as the docs sidebar groups them (D-059), linked from the end of this page.
const DOCS = [
  { href: "/docs/public-bathroom", title: "Execution plan", text: "Every step of building the bathroom, the septic sized for its users first, from the survey to the first guest." },
  { href: "/docs/public-bathroom/materials", title: "Materials", text: "The fixtures, each electric device and each plumbing part, with its size, where to buy it and its cost." },
  { href: "/docs/public-bathroom/electric", title: "Electric", text: "The board and its four circuits, the first and second fix, the tests and every light, fan and socket." },
  { href: "/docs/public-bathroom/plumbing", title: "Plumbing", text: "The supply, the drains and the vent to the septic tank, the 10 bar test, and every run and fitting." },
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
        lineAlt="Line drawing of the bathroom from the courtyard with its front wall and roof off: the container on its plinth, the landing and the step at the east end; along the back wall in one row, two toilet rooms each with a WC facing its door and a roll holder, the urinal in a room of its own with its flush valve and an extract fan, then two bowls on a counter under a long mirror with a soap dispenser, paper towels over a bin on the end wall and a floor drain; the row's front wall and the cleaner's cupboard cut low along the corridor."
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
            { title: "Step 2 · Partitions", text: "Timber studs, cement board both sides, 100 mm: between the toilet rooms and the urinal room, and along the front of the row with its three doors." },
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
        figure={<TaggedFigure table="/docs/public-bathroom/electric" src={`${D}/render/electric-line.png`} aspect={electricTags.aspect} tags={electricTags.tags} info={info}
          alt="Line drawing of the bathroom from the courtyard, faint, with every device dark and every cable route: the unit board in the lobby on the urinal room's east wall, blue runs up into the ceiling and along the row to a round light in each toilet room, the urinal room, the corridor and the lobby, and down to the extract fan over the urinal; another blue run to the front wall over the door; an orange run along the ceiling and down to the cleaner's socket by the cupboard." />}
        note={<>
          Every run goes up into the ceiling void, along it and straight down to its device. Each tag opens its row in the{" "}
          <Link href="/docs/public-bathroom/electric#points" className="underline underline-offset-4">points table</Link>. Outside the drawing: the light over
          the door (L6) on the front wall, which the drawing leaves off, and the earth rod (E1) in a pit behind the back
          wall below the board. The board&rsquo;s feeder comes from the farm&rsquo;s site board, sized when that is designed.
        </>}
        real={{ src: `${D}/render/electric-real.webp`, width: 2400, height: 1100, caption: "Rendered from the design model, at dusk with the lights on",
          alt: "The same view rendered at dusk: a round ceiling light glowing over each toilet room, the urinal room, the corridor and the lobby, the white unit board on the urinal room's east wall and the extract fan's grille over the urinal." }}
        rail={electricRail()} />

      {/* Plumbing, in the same pattern: the water drawn full width from the farm's tank to every outlet and on to the
          septic tank (services.tsx), then the 3D's view with every run in its colour, dashed where a wall, the floor or
          the plinth hides it, every fitting tagged (render/plumbing-line.png), the same view rendered with the floor,
          the tiles and the plinth see-through (render/plumbing-real.webp), then each part on its own. All from
          public-bathroom.html?view=plumbing and ?item=. */}
      <ServiceSection id="plumbing" title="Plumbing"
        diagram={<BathPipeDiagram />}
        figure={<TaggedFigure table="/docs/public-bathroom/plumbing" src={`${D}/render/plumbing-line.png`} aspect={plumbingTags.aspect} tags={plumbingTags.tags} info={info}
          alt="Line drawing of the bathroom from the courtyard, faint, with its fittings dark and every pipe run: cold in blue from the stop valve in the cleaner's cupboard along the west end wall and the back wall, up to the two WC cisterns, the urinal's flush valve and the two basin taps; the drains in brown under the floor, the WCs' soil run and the basins', the floor drain's and the urinal's waste run leaving through the back of the plinth for the inspection chamber; the vent in grey up the back wall." />}
        note={<>
          Supplies run in the linings, then straight up to each outlet; drains run under the floor in the plinth. A run is
          dashed where a wall, the floor or the plinth hides it. Each tag opens its row in the{" "}
          <Link href="/docs/public-bathroom/plumbing#points" className="underline underline-offset-4">points table</Link>. Behind the back wall, off the
          floor: IC1 takes both runs, and S1 carries them to the farm&rsquo;s septic tank and soakaway, at least 50 m from
          the borehole. That tank was sized for the two studios; the campers, the bar and the fire pit must be added
          before it is built. Cold only: a shower, should the founder add one, would bring the solar water heater the
          power guide plans for this building.
        </>}
        real={{ src: `${D}/render/plumbing-real.webp`, width: 2400, height: 1100,
          caption: <>Rendered from the design model, the floor, the tiles and the plinth see-through, the pipes in the diagram&rsquo;s colours</>,
          alt: "The same view rendered with the floor, the wall tiles and the plinth see-through: the brown drains under the toilet rooms, the urinal room and the lobby, from each WC, the urinal, the basins and the floor drain, out through the back; the blue supply along the back wall and up to the cisterns, the urinal's valve and the taps; the grey vent rising behind the back wall." }}
        rail={plumbingRail()} />

      <DocsSection cards={DOCS} ownPlan />
    </main>
  )
}
