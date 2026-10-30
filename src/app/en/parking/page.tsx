import type { Metadata } from "next"

import { DocsSection, DrawingSection, ModelSection, PageHero, RailSection, ServiceSection, TextSection, railCards } from "@/components/page/sections"
import { BuildUp } from "@/components/docs/build-up"
import { TaggedFigure } from "@/components/docs/tagged-figure"
import { DRAIN_COLOUR, DrainageDiagram } from "@/components/parking/drainage-diagram"
import { LIGHT_COLOUR, LightingDiagram } from "@/components/parking/lighting-diagram"
import { ParkingPlan } from "@/components/parking/parking-plan"
import parking from "@/components/parking/parking.json"
import drainTags from "../../../../public/designs/parking/render/drain-tags.json"
import lightTags from "../../../../public/designs/parking/render/light-tags.json"
import topPieces from "../../../../public/designs/parking/render/top-pieces.json"

// The way in, as /en/studio is the studio: a full-screen hero, the 2D and the 3D, then how the green parking is built,
// its parts, and the two services it needs, where the rain goes and the lights. Every drawing reads
// src/components/parking/parking.json, in compound.json's true metres: the outer gate off the public road, the sign
// wall lettered DIGITAL FARM, the green parking with its five bays under shade trees, and the start of the rock road
// to the inner gate. What the plan leaves open (a full house, a minibus's turn, reversing out) is in the json; how it is
// built, drained and lit is design intent [A] until a builder sees the ground.

export const metadata: Metadata = {
  title: "Parking · Farm",
  description: "Five bays on grass pavers under shade trees, just inside the gate and the DIGITAL FARM sign wall, at the Digital Farm near Kigali.",
}

const D = "/designs/parking"
const { parking: PK, build: B, drainage: DR, lighting: LT } = parking
const m = (n: number) => Math.round(n * 1000).toLocaleString("en-US")
const len = (pts: number[][]) => pts.slice(1).reduce((n, p, i) => n + Math.hypot(p[0] - pts[i][0], p[1] - pts[i][1]), 0)

// what the parking takes, from the plan: the paver area inside the edging, the blocks, the sub-base, the sett strips
const [x0, y0, x1, y1] = PK.box, e = PK.edging.w
const paverM2 = (x1 - x0 - 2 * e) * (y1 - y0 - 2 * e) - (4 - Math.PI) * (PK.r - e) ** 2
const blocks = Math.ceil(paverM2 / (B.paver.l * B.paver.w))
const subM3 = ((x1 - x0) * (y1 - y0) - (4 - Math.PI) * PK.r ** 2) * B.subbase
const stripSetts = (PK.bays.length - 1) * Math.round((PK.strips.l - e) / 0.1)
const feedM = Math.round(len(LT.route.feed))
const lampM = Math.round(len(LT.route.lantern) + 2.2) // and up inside the pillar to the lantern

// The Parts rail: each part rendered on its own by scripts/site/render/parking.html?item=<id>, from the model's own
// meshes or a patch of them. Nothing at the way in is sourced or priced yet, so no card names a shop or a price.
const partsRail = () => railCards(`${D}/render/item`, [
  { id: "gate", title: "Outer gate", size: `${m(parking.gate.x[1] - parking.gate.x[0])} between the pillars, leaves ${m(parking.gate.leaf)} high`,
    note: "Two timber leaves of vertical boards on a frame braced in an X, black iron strap hinges and a latch, opening inward; fieldstone pillars 600 mm square under timber caps." },
  { id: "sign", title: "Sign wall", size: `${m(parking.sign.box[2] - parking.sign.box[0])} long, ${m(parking.sign.h)} high, ${m(parking.sign.box[3] - parking.sign.box[1])} thick`,
    note: "Fieldstone under a timber cap; on its road face a dark steel panel with DIGITAL FARM in warm-white LED capitals." },
  { id: "lantern", title: "Pillar lantern", size: "About 140 mm square, 260 mm high, on the pillar's cap",
    note: "L1 on the outer gate's left pillar, L2 on the inner gate's right one: outdoor-rated, on the dusk-to-dawn circuit below." },
  { id: "pavers", title: "Grass pavers", size: `${m(B.paver.l)} × ${m(B.paver.w)} × ${m(B.paver.h)} mm blocks, ${Math.round(paverM2)} m², about ${blocks.toLocaleString("en-US")} blocks`,
    note: "Concrete blocks with sixteen open cells, laid butted on the bedding, the cells filled with topsoil and seeded. Shown with the front row not yet grown." },
  { id: "setts", title: "Granite setts", size: `About 100 mm; ${stripSetts} in the bay strips, and the turn and the rock road`,
    note: "Grey granite in mixed tones, laid by hand on sand: in segmental arcs on the turn and the rock road, in single rows between the bays." },
  { id: "stop", title: `Wheel stops × ${PK.bays.length - 1}`, size: `${m(PK.stops.l)} long, ${m(PK.stops.r * 2)} across`,
    note: "Barked and oiled eucalyptus logs, pinned to the ground 450 mm from the far edge." },
  { id: "tree", title: `Shade trees × ${parking.trees.list.length}`, size: `About ${parking.trees.h} m tall at planting, the crown from ${parking.trees.crown} m`,
    note: "Young broad-canopied trees; the species is not chosen yet (the render brief names neem and acacia)." },
])
const lightRail = () => railCards(`${D}/render/item`, [
  { id: "enclosure", title: "Box on the sign wall", size: `${m(LT.box.w)} × ${m(LT.box.h[1] - LT.box.h[0])} × ${m(LT.box.d)} mm, IP65`,
    note: "EB · an isolator, a dusk-to-dawn photocell with a timer, and the 24 V driver for the letters; the ducts come up into it from below." },
  { id: "sign", title: "Sign letters", size: `Panel ${m(parking.sign.box[2] - parking.sign.box[0] - 2 * parking.sign.panel.inset)} × ${m(parking.sign.panel.y1 - parking.sign.panel.y0)} mm`,
    note: "SG · DIGITAL FARM in warm-white LED capitals at 24 V from the driver in the box." },
  { id: "lantern", title: "Lanterns × 2", size: "About 140 mm square, 260 mm high",
    note: "L1 on the outer gate, fed from the box; L2 on the inner gate, teed off the feed on its way down." },
  { id: "duct", title: "Duct and cable", size: `${m(LT.duct.d)} mm duct, about ${feedM + lampM} m, ${m(LT.duct.depth)} mm down`,
    note: "LF, LD · outdoor armoured cable in a buried duct with a draw wire, a warning tape laid over it." },
])
const drainRail = () => railCards(`${D}/render/item`, [
  { id: "layers", title: "The build-up", size: `Pavers ${m(B.paver.h)}, bedding ${m(B.bedding)}, sub-base ${m(B.subbase)} mm`,
    note: `P · the parking cut open: about ${Math.round(subM3)} m³ of crushed stone under the pavers holds the rain while it soaks away.` },
  { id: "pavers", title: "Grass pavers", size: `${Math.round(paverM2)} m² of open cells`,
    note: "P · the rain falls through the grass in the cells, so the lot needs no gully." },
  { id: "trench", title: "Gravel trench", size: `${m(DR.trench.w)} × ${m(DR.trench.depth)} mm, ${(DR.trench.y[1] - DR.trench.y[0]).toFixed(1)} m long, a ${m(DR.trench.pipe)} mm perforated pipe`,
    note: "T1 · across the west end, 400 mm outside the edging: clean 20 to 40 mm stone in geotextile, falling 1 in 100 to the pit." },
  { id: "soakaway", title: "Soakaway pit", size: `${DR.pit.size} × ${DR.pit.size} m, ${DR.pit.depth} m deep, a slab cover`,
    note: "SK · stone in a geotextile wrap; sized again after a percolation test on site." },
])

// the points, for the tags on the drawings and the tables at the end of each service
const LIGHT_POINTS = [
  { id: "LF", what: "Feed", where: "From the compound's board, down the lawn beside the rock road; it enters the drawing at the road's far end", size: `In a ${m(LT.duct.d)} mm duct, ${m(LT.duct.depth)} mm down`, colour: LIGHT_COLOUR.feed },
  { id: "LD", what: "Duct across the parking", where: "Under the sett strip on bay 5's open side, then behind the sign wall", size: `About ${feedM} m from the inner gate to the box`, colour: LIGHT_COLOUR.feed },
  { id: "EB", what: "Box on the sign wall", where: "On the wall's back face at its east end, out of the guests' way", size: `${m(LT.box.w)} × ${m(LT.box.h[1] - LT.box.h[0])} mm, IP65; isolator, photocell and timer, 24 V driver`, colour: LIGHT_COLOUR.feed },
  { id: "SG", what: "Sign letters", where: "The wall's road face", size: "LED, 24 V from the driver", colour: LIGHT_COLOUR.sign },
  { id: "L1", what: "Lantern, outer gate", where: "On the left pillar's cap; its cable behind the hedge and up inside the pillar", size: `About ${lampM} m from the box`, colour: LIGHT_COLOUR.lamp },
  { id: "L2", what: "Lantern, inner gate", where: "On the right pillar, off the drawing; teed off the feed", size: "As L1", colour: LIGHT_COLOUR.lamp },
]
const DRAIN_POINTS = [
  { id: "P", what: "Pavers and sub-base", where: "The whole lot", size: `Rain soaks through the cells into ${m(B.subbase)} mm of stone`, colour: DRAIN_COLOUR.fall },
  { id: "F1", what: "The lot's fall", where: "Along its length, east to west", size: `1 in ${Math.round(1 / DR.lot)}, ${m((x1 - x0) * DR.lot)} mm over ${x1 - x0} m`, colour: DRAIN_COLOUR.fall },
  { id: "F2", what: "The turn's fall", where: "From the gate back to the public road", size: `1 in ${Math.round(1 / DR.turn)}`, colour: DRAIN_COLOUR.fall },
  { id: "F3", what: "The rock road's crown", where: "To the fieldstone edgings each side", size: `1 in ${Math.round(1 / DR.road)}`, colour: DRAIN_COLOUR.fall },
  { id: "T1", what: "Gravel trench", where: "Across the west end, outside the edging", size: `${m(DR.trench.w)} × ${m(DR.trench.depth)} mm, ${m(DR.trench.pipe)} mm perforated pipe`, colour: DRAIN_COLOUR.trench },
  { id: "SK", what: "Soakaway pit", where: "At the trench's south end, by the hedge", size: `${DR.pit.size} m square, ${DR.pit.depth} m deep; sized after a percolation test`, colour: DRAIN_COLOUR.pit },
]

function PointsTable({ points }: { points: typeof LIGHT_POINTS }) {
  return (
    <div className="mt-6 overflow-x-auto rounded-xl border">
      <table className="w-full text-sm">
        <thead className="text-muted-foreground bg-muted/40">
          <tr>
            <th className="px-3 py-2 text-start font-medium">Point</th>
            <th className="px-3 py-2 text-start font-medium">What</th>
            <th className="px-3 py-2 text-start font-medium">Where</th>
            <th className="px-3 py-2 text-start font-medium">Size</th>
          </tr>
        </thead>
        <tbody>
          {points.map((p) => (
            <tr key={p.id} id={`pt-${p.id}`} className="scroll-mt-24 border-t target:bg-muted/60">
              <td className="px-3 py-2 font-medium whitespace-nowrap">
                <span className="me-2 inline-block size-2 rounded-full" style={{ background: p.colour }} />{p.id}
              </td>
              <td className="px-3 py-2">{p.what}</td>
              <td className="text-muted-foreground px-3 py-2">{p.where}</td>
              <td className="px-3 py-2">{p.size}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

const DOCS = [
  { href: "/docs/master-plan", title: "Master plan", text: "The whole farm on one sheet: where the way in sits, the paths and the services; the gate's position still to confirm." },
  { href: "/docs/site-inspection", title: "Site inspection", text: "The one structured site visit that measures the ground the parking, its drainage and its ducts are designed on." },
  { href: "/docs/power", title: "Power", text: "Where the farm's power comes from, with the outdoor lights among the loads that must never stop." },
]

export default function ParkingPage() {
  return (
    <main className="w-full flex-1">
      {/* First screen: a STAND-IN until the founder's Nano Banana remaster. For now it is the design model rendered
          from eye level across the public road (scripts/site/render/parking.html?mode=real&hero=1, 2400 x 1340): the
          sign wall lit, the gate open on the drive, the rock road and the inner gate seen through it. The sign wall
          sits left, so the words keep the road bottom-left. */}
      <PageHero src={`${D}/render/parking-hero.jpg`} width={2400} height={1340} className="bg-[#cfdbe4]" imgClassName="object-[43%_55%]"
        title="Parking on grass, just inside the gate"
        alt="A fieldstone wall under a timber cap with DIGITAL FARM in warm-white LED capitals on a dark steel panel, beside two fieldstone pillars, one with a lantern, and a timber gate braced in an X standing open on a drive of grey stone setts; through it a lawn of grass pavers and a road of setts to a second gate, shade trees over the wall and a line of tall trees in the haze, a green hedge along the boundary and a red dirt road in front." />

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

      {/* Drainage, in the studio's Plumbing pattern: a long section of the lot drawn full width, then the way in as the
          3D sees it with every fall as an arrow, the trench and the pit in their colours and every point tagged
          (render/drain-line.png, drain-tags.json), the same view rendered with what shows of them (render/drain-real.webp),
          then each part on its own. All from parking.html?view=drain and ?item=. */}
      <ServiceSection id="drainage" title="Drainage"
        diagram={<DrainageDiagram box={PK.box} build={B} drainage={DR} />}
        figure={<TaggedFigure src={`${D}/render/drain-line.png`} aspect={drainTags.aspect} tags={drainTags.tags}
          alt="Line drawing of the way in from beyond the road with arrows of fall: three long arrows along the parking to its west end, two through the gate back to the road and four across the rock road to its edges, the gravel trench in dark blue across the west end and the soakaway pit by the hedge in light blue."
          info={Object.fromEntries(DRAIN_POINTS.map((p) => [p.id, { label: p.what, colour: p.colour }]))} />}
        note={<>
          The pavers and the stone under them are the drain: the rain soaks in where it falls. A storm heavier than the
          stone holds runs along the lot to its west end, into the trench and on to the soakaway. The turn sheds back to the
          road, so the road&rsquo;s water stays out. Each tag opens its row in the{" "}
          <a href="#drain-points" className="underline underline-offset-4">points table</a>. The soil&rsquo;s soakage is not
          tested yet: a percolation test on site sizes the pit, or says the trench must run on to a ditch.
        </>}
        real={{ src: `${D}/render/drain-real.webp`, width: 2400, height: 1100,
          caption: "Rendered from the design model: the trench's stone and the pit's cover are all that show",
          alt: "The same view rendered in daylight: the grass-paver parking in its fieldstone edging, a strip of grey stone across the lawn at its west end and a square concrete cover by the hedge, the sign wall, the gate and the start of the rock road." }}
        rail={drainRail()} />

      <TextSection id="drain-points" title="Drainage points">
        <PointsTable points={DRAIN_POINTS} />
      </TextSection>

      {/* Lighting, in the studio's Electric pattern: the circuit drawn full width from the compound's board to every
          lamp, then the way in with every duct run in its colour and every point tagged (render/light-line.png,
          light-tags.json), the same view rendered at dusk with the sign and the lantern lit (render/light-real.webp),
          then each part on its own. All from parking.html?view=light and ?item=. */}
      <ServiceSection id="lighting" title="Lighting"
        diagram={<LightingDiagram feedM={feedM} lampM={lampM} />}
        figure={<TaggedFigure src={`${D}/render/light-line.png`} aspect={lightTags.aspect} tags={lightTags.tags}
          alt="Line drawing of the way in from beyond the road with the lighting's ducts: the feed in dark blue coming down beside the rock road and across under the parking's open end to the box behind the sign wall, the lantern cable in blue along behind the hedge and up the gate's left pillar, and the letters' link in orange through the wall."
          info={Object.fromEntries(LIGHT_POINTS.map((p) => [p.id, { label: p.what, colour: p.colour }]))} />}
        note={<>
          Every run is underground in a duct, drawn here through the wall and the gate that hide it. The circuit is the
          farm&rsquo;s outdoor lights, protected at the compound&rsquo;s board; the box on the sign wall switches it at dusk.
          Each tag opens its row in the{" "}
          <a href="#light-points" className="underline underline-offset-4">points table</a>. Outside the drawing: the inner
          gate&rsquo;s lantern (L2) and the board the feed leaves from.
        </>}
        real={{ src: `${D}/render/light-real.webp`, width: 2400, height: 1100,
          caption: "Rendered from the design model, at dusk: the letters and the outer gate's lantern lit",
          alt: "The same view after sunset: the lawn and the trees dark, DIGITAL FARM glowing warm white on the sign wall and the lantern on the gate's left pillar lighting the pillar, the setts and the road in front." }}
        rail={lightRail()} />

      <TextSection id="light-points" title="Lighting points">
        <PointsTable points={LIGHT_POINTS} />
      </TextSection>

      <DocsSection cards={DOCS} />
    </main>
  )
}
