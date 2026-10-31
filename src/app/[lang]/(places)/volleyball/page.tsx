import type { Metadata } from "next"
import Link from "next/link"

import { DocsSection, DrawingSection, ModelSection, PageHero, RailSection, ServiceSection, railCards } from "@/components/page/sections"
import { BuildUp } from "@/components/docs/build-up"
import { TaggedFigure } from "@/components/docs/tagged-figure"
import { TennisPlan } from "@/components/tennis/tennis-plan"
import { CourtSwitch } from "@/components/volleyball/court-switch"
import { D, m, NET_POINTS } from "@/components/volleyball/data"
import { CourtDrainageDiagram } from "@/components/volleyball/drainage-diagram"
import { NetDiagram } from "@/components/volleyball/net-diagram"
import { VolleyballPlan } from "@/components/volleyball/volleyball-plan"
import volleyball from "@/components/volleyball/volleyball.json"
import netTags from "../../../../../public/designs/volleyball/render/net-tags.json"
import topPieces from "../../../../../public/designs/volleyball/render/top-pieces.json"

// The volleyball court, in /en/studio's pattern: the hero, the 2D and the 3D, the court's build-up, the kit, Net and
// posts and Drainage, then the docs cards; the net's points table and the status are on /docs/volleyball-points. Both
// drawings read src/components/volleyball/volleyball.json: the master plan's court on the lawn, 18 x 9 m inside a 3 m free zone to
// the FIVB Official Volleyball Rules, on the lawn's own grass mown short, the net on padded posts, and beyond the far
// free zone two benches under thatched umbrellas and a ball store. Everything past the rules is an assumption.

export const metadata: Metadata = {
  title: "Volleyball · Farm",
  description: "A full-size volleyball court on the lawn, with benches in the shade, at the Digital Farm near Kigali.",
}

const { court: K, net: N, posts: P, benches: B, shade: SH, store: ST, surface: SF, build: BU } = volleyball
const FL = K.l + 2 * K.free, FW = K.w + 2 * K.free // the playing area, court and free zone

// The rails: each part rendered on its own by scripts/site/render/volleyball.html?item=<id>, from the model's own
// meshes or a cut-open sample. Nothing for the court is sourced or priced yet, so no card names a shop or a price.
// lines of tape: side and end lines, the centre line and the two attack lines, as the court draws them
const tapeM = 2 * K.l + 2 * K.w + 3 * K.w
const kitRail = () => railCards(`${D}/render/item`, [
  { id: "ball", title: "Balls", size: "650 to 670 mm around, 260 to 280 g (rule 3.1)", note: "In a light colour or a mix of colours; kept in the ball store with a pump and a gauge." },
  { id: "tape", title: "Line tape", size: `${m(SF.tape)} mm white webbing, about ${tapeM} m, pinned every ${BU.pegs.every} m`, note: "Lines of solid materials are not allowed outdoors (rule 1.2.3): webbing tape pinned flat into the grass with steel U-pins, lifted to mow." },
  { id: "bench", title: `Benches × ${B.x.length}`, size: `${m(B.l)} × ${m(B.d)} mm, seat at ${m(B.h)} mm`, note: "Slatted timber on two trestles, 1 m back from the free zone, one each side of the centre line." },
  { id: "umbrella", title: `Thatched umbrellas × ${B.x.length}`, size: `${m(SH.r * 2)} across, eave at ${m(SH.eave)} mm, top ${m(SH.top)} mm`, note: "A timber pole behind each bench under a cone of thatch, like those on today's camping lawn." },
  { id: "store", title: "Ball store", size: `${m(ST.l)} × ${m(ST.d)} × ${m(ST.h)} mm`, note: "A lockable timber chest at the bench row's end toward the compound: the balls, a pump, the net and the pads between games. It seats two." },
])
const netRail = () => railCards(`${D}/render/item`, [
  { id: "footing", title: "Footings and sleeves × 2", size: `${m(P.footing.w)} mm square, ${m(P.footing.depth)} mm deep, the sleeve cast in`, note: "S1, S2 · concrete, the top flush with the grass; a cap closes the sleeve when the post is out." },
  { id: "post", title: "Posts × 2", size: `${m(P.h)} mm high, ${m(P.d)} mm steel tube`, note: `P1, P2 · ${m(P.out)} mm outside the side lines, no guy wires (rule 2.5); padded to ${m(P.pad.h)} mm, the winch (W) on the near post at ${m(P.winch)} mm.` },
  { id: "net", title: "Net", size: `${m(N.l)} × ${m(N.d)} mm, ${m(N.mesh)} mm square mesh`, note: `N · black mesh with a ${m(N.top)} mm white band along its top over the cable, a ${m(N.foot)} mm band at its foot, and a white side band over each side line.` },
  { id: "antenna", title: "Antennae × 2", size: `${m(N.antenna.l)} mm long, ${m(N.antenna.d)} mm thick, the top ${m(N.antenna.above)} mm striped`, note: "A1, A2 · flexible rods at the side bands' outer edges, on opposite faces of the net, in 100 mm stripes of red and white (rule 2.4)." },
])

// The court's own docs page first, as the studio's are, then the guides behind the page.
const DOCS = [
  { href: "/docs/volleyball-points", title: "Net points", text: "The footings, the posts, the winch, the net and the antennae on the drawing above, with where each is and its size." },
  { href: "/docs/master-plan", title: "Master plan", text: "Where the court sits on the lawn, the 24 × 15 m it takes and the trees kept clear of it." },
  { href: "/docs/site-inspection", title: "Site inspection", text: "The one structured site visit that measures the lawn the court is levelled on." },
  { href: "/docs/operations", title: "How the farm runs", text: "How guests spend a day at the farm, volleyball among what they do." },
]

export default function VolleyballPage() {
  return (
    <main className="w-full flex-1">
      {/* First screen: the founder's Nano Banana render of the court (2026-10-30), made from the brief in
          ~/Desktop/volleyball-nano-banana; master kept at assets/volleyball/hero-gemini.png (1672 x 941), upscaled to
          2400 x 1340. The net sits right, so the words keep the open grass bottom-left. */}
      <PageHero src={`${D}/render/volleyball-hero.jpg`} width={2400} height={1340} className="bg-[#c9a46a]" imgClassName="object-[60%_55%]"
        title="Volleyball on the lawn until sunset"
        alt="A grass volleyball court on a lakeside lawn at sunset: white lines on short green grass, a net with a white top band and red-and-white antennae between two dark-green padded posts, a white ball on the grass by the net; beyond it two timber benches under thatched umbrellas and a timber chest, young trees, and the lake shining under low hills." />

      {/* 2D, full screen, with a switch between the two games the lawn can take: the volleyball court
          (src/components/volleyball/volleyball-plan.tsx) and a tennis court on the same net line
          (src/components/tennis/tennis-plan.tsx), each with a point at the serve drawn over it, in the text colour. */}
      <DrawingSection id="plans" title="2D">
        <CourtSwitch courts={[
          { id: "volleyball", label: "Volleyball", plan: (
            <VolleyballPlan title="Plan: a court 18 by 9 m inside a 3 m free zone, 24 by 15 m in all, its lines 50 mm wide inside the court; the centre line under the net, an attack line 3 m each side of it marking the front zones and run on past the side lines in short dashes, and the service zones behind the end lines; the net's posts 1 m outside the side lines with an antenna over each side line; beyond the far free zone two benches under thatched umbrellas and a ball store. Over it a match at the serve: six players a side in rotation order, the server in the left service zone, the ball's flight across the net to the seam between two receivers, the 1st referee on a stand at the near post and the 2nd by the far post."
              className="h-auto w-full lg:h-full lg:w-auto" />
          ) },
          { id: "tennis", label: "Tennis", plan: (
            <TennisPlan title="Plan: a tennis court 23.77 by 10.97 m on the same lawn and net line, with a run-back of 5.49 m behind each baseline and a run-off of 3.05 m beside each side line, 34.75 by 17.07 m in all, the volleyball's 24 by 15 m dashed inside it; singles and doubles side lines, the service lines 6.40 m from the net, four service boxes and a centre mark on each baseline; the net 914 mm at the centre and 1,070 mm at the posts, with singles sticks. Over it a singles point: the server right of the centre mark serving across to the deuce court, the receiver behind the far baseline."
              className="h-auto w-full lg:h-full lg:w-auto" />
          ) },
        ]} />
      </DrawingSection>

      {/* 3D, in the 2D section's pattern: a line drawing of the court seen from the open lawn, then the same view
          rendered. Both from scripts/site/render/volleyball.html. */}
      <ModelSection line={`${D}/render/volleyball-line.png`} real={`${D}/render/volleyball-real.webp`} width={2400} height={1100}
        lineAlt="Line drawing of the court from the open lawn: the free zone's edge, the side and end lines, the centre line and the two attack lines, the net's cords between its two posts with an antenna over each side line, a ball by the net, and beyond the far free zone two benches under thatched umbrellas and the ball store."
        realAlt="The same view rendered: grass mown short in light and dark stripes inside the longer lawn, white tape lines, a black net with white bands on dark green padded posts, red and white antennae, a white ball on the grass, timber benches and a timber chest, and two thatched umbrellas casting their shadows." />

      {/* Court, pinned while it builds up in fast motion, seen from above with the benches' side at the top: the lawn as
          it is, levelled with its footings, grassed and mown, lined, then the net. Renders: volleyball.html?top=<layer>. */}
      <section id="build">
        <BuildUp title="Court" base={`${D}/render/top-ground.webp`} aspect={topPieces.aspect}
          baseAlt="The lawn where the court goes, from straight above: longer grass, worn bare in patches where guests already play."
          builds={[
            { secs: 3, label: "The playing area levelled with sandy topsoil, then the two post footings cast.", groups: [
              { src: `${D}/render/top-level.webp`, rects: topPieces.level, kind: "wipe", from: 0, to: 0.55 },
              { src: `${D}/render/top-footings.webp`, rects: topPieces.footings, kind: "drop", from: 0.65, to: 0.8, rise: 30 },
            ] },
            { secs: 2, label: "The grass grown back and mown short in passes.", groups: [
              { src: `${D}/render/top-grass.webp`, rects: topPieces.grass, kind: "wipe", from: 0, to: 0.85 },
            ] },
            { secs: 2, label: "The lines of white tape pinned down.", groups: [
              { src: `${D}/render/top-lines.webp`, rects: topPieces.lines, kind: "wipe", from: 0, to: 0.85 },
            ] },
            { secs: 1.4, label: "The posts dropped into their sleeves and the net hung.", groups: [
              { src: `${D}/render/top-net.webp`, rects: topPieces.net, kind: "drop", from: 0, to: 0, rise: 40 },
            ] },
          ]}
          stages={[
            { title: "The lawn as it is", text: `Where guests already play round a net. The ${FL} × ${FW} m it takes is pegged out, the trees kept 4 m off it and nothing over it below ${K.clear} m.` },
            { title: "Step 1 · Level and footings", text: `The bumps cut and the hollows filled with about ${m(BU.topdress)} mm of sandy topsoil, rolled to one plane falling no more than ${SF.fall * 1000} mm a metre; two footings ${m(P.footing.w)} mm square and ${m(P.footing.depth)} mm deep cast with their sleeves.` },
            { title: "Step 2 · Grass", text: `The bare patches seeded and the whole mown short in passes, the lawn round it left longer: ${BU.settle}.` },
            { title: "Step 3 · Lines", text: `${m(SF.tape)} mm white tape inside the ${K.l} × ${K.w} m, pinned every ${BU.pegs.every} m and at each corner and crossing; the centre line and an attack line ${K.attack} m each side.` },
            { title: "Step 4 · Net", text: `The posts dropped into their sleeves, the net hung at ${m(N.men)} mm for men or ${m(N.women)} mm for women, an antenna over each side line.` },
          ]} />
      </section>

      {/* Kit: what the court needs beside the net, each on its own; the card in focus shows its size, source and cost. */}
      <RailSection id="kit" title="Kit" items={kitRail()} />

      {/* Net and posts, in the studio's service pattern: the net system drawn full width along the net line with the
          ground cut open under the posts, then the net close up as the 3D sees it with the footings drawn through the
          grass in orange and every point tagged (render/net-line.png, net-tags.json), the same view rendered
          (render/net-real.webp), then each part on its own. All from volleyball.html?view=net and ?item=. */}
      <ServiceSection id="net" title="Net and posts"
        diagram={<NetDiagram net={N} posts={P} courtW={K.w} />}
        figure={<TaggedFigure table="/docs/volleyball-points" src={`${D}/render/net-line.png`} aspect={netTags.aspect} tags={netTags.tags}
          alt="Line drawing of the net close up from the open lawn: the two padded posts with the net between them, an antenna over each side line, the winch on the near post, the court lines on the grass, and under each post its footing and sleeve drawn through the grass in orange."
          info={Object.fromEntries(NET_POINTS.map((p) => [p.id, { label: p.what, colour: p.colour }]))} />}
        note={<>
          Each post drops into a steel sleeve cast in its footing, so it stands without guy wires and lifts out to mow or for
          the rains. The footings are drawn through the grass. Each tag opens its row in the{" "}
          <Link href="/docs/volleyball-points#net-points" className="underline underline-offset-4">points table</Link>. The footings&rsquo; size waits
          for a builder to see the soil.
        </>}
        real={{ src: `${D}/render/net-real.webp`, width: 2400, height: 1100, caption: "Rendered from the design model",
          alt: "The same view rendered: the black net with its white top band between two dark green padded posts, red and white antennae, the white tape lines on grass mown in stripes, and the footings' concrete tops flush with the grass." }}
        rail={netRail()} />

      {/* Drainage: the court is a lawn and needs no drain of its own, so this service is its diagram alone: the
          levelled plane's fall along and across the playing area (volleyball.json drainage). No lights: play stops at
          sunset (volleyball.json lighting). */}
      <ServiceSection id="drainage" title="Drainage"
        diagram={<CourtDrainageDiagram length={FL} width={FW} fall={SF.fall} />} />

      <DocsSection cards={DOCS} />
    </main>
  )
}
