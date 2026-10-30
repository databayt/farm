import type { Metadata } from "next"
import Link from "next/link"

import { frw } from "@/lib/format"
import { DocsSection, DrawingSection, ModelSection, PageHero, RailSection, ServiceSection, TextSection, railCards } from "@/components/page/sections"
import { RoomPointsTable, type RoomPoint, deviceRail, tagInfo, withLoads } from "@/components/docs/room-points"
import { RoomWiring } from "@/components/docs/room-wiring"
import { TaggedFigure } from "@/components/docs/tagged-figure"
import { GuestRoomPlan } from "@/components/guest-room/guest-room-plan"
import room from "@/components/guest-room/guest-room.json"
import electricTags from "../../../../public/designs/guest-room/render/electric-tags.json"

// One guest room, as /en/camp is one camp: a full-screen hero, then the 2D and the 3D. Both drawings read
// src/components/guest-room/guest-room.json: a third of the saffron container block from the footage, a
// barred window and a red door onto the timber veranda, a double bed under the back window, a wardrobe, a
// desk under the front window, two chairs and a table outside.

export const metadata: Metadata = {
  title: "The guest room · Farm",
  description: "A room for two in the container block, with a double bed, its own shower and WC, and a timber veranda with lake views, at the Digital Farm near Kigali.",
}

const D = "/designs/guest-room"
const m2 = (n: number) => +n.toFixed(2)

// The furniture rails: each piece rendered on its own by scripts/site/render/guest-room.html?item=<id>, sized from
// guest-room.json. Nothing is sourced or quoted yet; where the studio already carries a placeholder price for the
// same piece (AS-21), the card repeats it as an estimate.
const { bed, bedsides: bs, bench, wardrobe, desk, hooks, rug, veranda } = room
const bedRail = railCards(`${D}/render/furniture`, [
  { id: "bed", title: "Bed frame", size: `${m2(bed.w)} × ${m2(bed.l)} m mattress, frame ${m2(bed.frame)} m high, headboard ${m2(bed.headboard)} m`,
    note: "A solid Medium Oak frame with its headboard on the back wall, under the barred window." },
  { id: "mattress", title: "Mattress", size: `${bed.w * 100} × ${bed.l * 100} × ${Math.round(bed.mattress * 100)} cm`,
    where: "Not sourced yet (the studio's: Rwanda Foam Ltd, Kigali)", cost: `RWF ${frw(180_000)} (estimate, as the studio's)` },
  { id: "bedding", title: "Bedding", size: `Duvet, two pillows and a cushion for ${bed.w * 100} × ${bed.l * 100} cm`, note: "White bedding with a mustard throw at the foot." },
  { id: "bedside", title: `Bedside tables × 2`, size: `${m2(bs.w)} × ${m2(bs.d)} m, ${m2(bs.h)} m high`, note: "A top and a lower shelf on four legs, one each side of the bed." },
  { id: "lamp", title: "Table lamps × 2", size: "Ø 0.26 m linen shade, 0.42 m high", cost: `RWF ${frw(35_000)} each × 2 (estimate, as the studio's)`,
    note: "One on each bedside table, plugged into the socket beside it (P1, P2): a lamp on both sides of the bed (D-029)." },
  { id: "bench", title: "Luggage bench", size: `${m2(bench.w)} × ${m2(bench.d)} m, ${m2(bench.h)} m high`, note: "Slatted, across the foot of the bed." },
  { id: "rug", title: "Rug", size: `${m2(rug.w)} × ${m2(rug.d)} m`, note: "A flat-woven rug under the lower two thirds of the bed." },
])
const roomRail = railCards(`${D}/render/furniture`, [
  { id: "wardrobe", title: "Wardrobe", size: `${m2(wardrobe.w)} × ${m2(wardrobe.d)} m, ${m2(wardrobe.h)} m high`, note: "Two doors, on the left wall between the joint's post and the desk." },
  { id: "desk", title: "Desk", size: `${m2(desk.x1 - desk.x0)} × ${m2(desk.d)} m, ${m2(desk.h)} m high`, note: "Under the front window, with a reading lamp and the socket P3 beside it." },
  { id: "chair", title: "Desk chair", size: `${m2(desk.chair.w)} × ${m2(desk.chair.d)} m, seat ${m2(desk.chair.seat)} m, back ${m2(desk.chair.back)} m` },
  { id: "hooks", title: "Coat hooks", size: `A ${m2(hooks.y1 - hooks.y0)} m rail of four hooks at ${m2(hooks.h)} m`, note: "On the right wall, clear of the door's swing." },
  { id: "verandachair", title: "Veranda chairs × 2", size: `${m2(veranda.chair.w)} × ${m2(veranda.chair.d)} m, seat ${m2(veranda.chair.seat)} m, back ${m2(veranda.chair.back)} m`,
    note: "Slatted, under the front window, as on the camp's porch." },
  { id: "verandatable", title: "Veranda table", size: `Ø ${m2(veranda.table.r * 2)} m, ${m2(veranda.table.h)} m high`, note: "A pedestal table between the chairs, with a lantern." },
])

// The Electric section: room.electric (guest-room.json), drawn by RoomWiring, rendered by guest-room.html?view=electric
const E = room.electric
const points = E.points as RoomPoint[]
const circuits = withLoads(E.circuits, points)
const designA = Math.round(circuits.reduce((n, c) => n + (c.design_A ?? 0), 0) * 10) / 10

const DOCS = [
  { href: "/docs/power", title: "Power", text: "Grid, solar or both: what the farm uses, building by building, and what each option costs." },
  { href: "/docs/studio-circuits", title: "Circuits and points", text: "The studio's circuits, checked against breaker, cable and voltage drop: the conventions this room follows." },
  { href: "/docs/electrician", title: "Electrician's guide", text: "The first fix before the linings close, the second fix, the tests and the certificate." },
  { href: "/docs/master-plan", title: "Master plan", text: "The whole farm on one sheet: where the guest rooms stand, the paths and the services." },
]

export default function GuestRoomPage() {
  return (
    <main className="w-full flex-1">
      {/* First screen: the founder's Nano Banana render of the guest-room block (2026-10-30), made from the brief in
          ~/Desktop/guest-room-nano-banana; master kept at assets/guest-room/hero-gemini.png (1671 x 941, the barred-window
          variant beside it), upscaled to 2400 x 1340. It departs from the drawings: a teal block, not saffron; cream
          doors and plain windows, not red barred ones; a timber pergola over the veranda, a step to each room. The
          block fills the middle, so the words sit on the lawn bottom-left. */}
      <PageHero src={`${D}/render/guest-room-hero.jpg`} width={2400} height={1340} className="bg-[#8a9a52]" imgClassName="object-[50%_55%]"
        title="A quiet room, with the veranda for mornings"
        alt="The guest-room block at sunset: two teal shipping containers joined into one long building on a fieldstone plinth, three rooms each with a cream door and a white-framed window lit warm onto a bed and lamps inside, a timber veranda under a slatted timber pergola along the front with two slatted chairs, a small table with a lantern and potted plants at each room, a step down to the lawn at each door, among avocado trees." />

      {/* 2D, full screen: the room's plan (src/components/guest-room/guest-room-plan.tsx), in the text colour. */}
      <DrawingSection id="plans" title="2D">
        <GuestRoomPlan title="Plan: one guest room 4.06 m wide and 4.88 m deep, a third of the container block, with a 1.5 m veranda in front. A double bed against the back wall under a window, a bedside table each side and a bench at its foot on a rug; a wardrobe on the left wall; a desk and chair under the front window; the door on the front right opening in; coat hooks on the right wall; red steel posts at the joint across the middle; two chairs and a round table on the veranda."
          className="h-auto w-full lg:h-full lg:w-auto" />
      </DrawingSection>

      {/* 3D, in the 2D section's pattern: a line drawing of the room seen from the front with its front wall
          and ceiling off, then the same view rendered. Both from scripts/site/render/guest-room.html. */}
      <ModelSection line={`${D}/render/guest-room-line.png`} real={`${D}/render/guest-room-real.webp`} width={2400} height={1800}
        lineAlt="Line drawing of the guest room from the front with the front wall and ceiling off: the double bed with two pillows under the barred back window, bedside tables with lamps, a bench at the foot on a rug, the wardrobe on the left, the desk and chair by the front, the door open against the right, the joint's beam overhead, and two chairs and a table on the veranda with the step down."
        realAlt="The same view rendered: cream walls, an oak plank floor and Medium Oak furniture, white bedding with a mustard throw on a striped rug, the red-framed barred window, red steel posts and beam, the red door open, and timber chairs and a table with a lantern on the veranda over the lawn." />

      {/* The rails, in the studio's pattern: each piece on its own (guest-room.html?item=<id>), the card in focus
          showing its size, source and cost below. */}
      <RailSection id="bedroom" title="Bed" items={bedRail} />
      <RailSection id="furniture" title="Room and veranda" items={roomRail} />

      {/* Electric, in the studio's pattern: the room's wiring drawn full width from the farm's supply to every circuit,
          then the installation in the 3D view's camera (render/electric-line.png, every run in its circuit's colour,
          every point tagged), the finished room (render/electric-real.webp), then each device on its own. All three from
          scripts/site/render/guest-room.html?view=electric and ?item=<model>, built from guest-room.json. */}
      <ServiceSection id="electrical" title="Electric"
        diagram={<RoomWiring circuits={circuits} mainA={E.main_A} board="the room's 12-module board, by the bed"
          supply={{ title: "Site board", sub: "the farm's, off the drawing", cable: "armoured cable, sized to its run" }}
          notes={[`Design ${designA} A on a ${E.main_A} A main switch · one RCBO 30 mA type A per circuit · the studio's conventions (D-021)`,
            "Ratings are design intent until a RURA class A electrician designs the supply and certifies the room"]} />}
        figure={<TaggedFigure src={`${D}/render/electric-line.png`} aspect={electricTags.aspect} tags={electricTags.tags}
          alt="Line drawing of the guest room from the front with the ceiling and the joint's beam off: the unit board on the right wall by the bed, the circuits rising from its top along the ceiling edge and down to each point, in blue for the lights and the wall fan, orange for the sockets beside the bedside tables, by the desk and on the right wall, and green for the AC isolator high on the back wall."
          info={tagInfo(points, circuits)} />}
        note={<>
          Every run goes up into the ceiling, along it and straight down to its device, in conduit inside the linings.
          Each tag opens its row in the <a href="#electric-points" className="underline underline-offset-4">points table</a>.
          The bedside lamps plug into P1 and P2, so the bed has a lamp on each side (D-029). The room has no bathroom of
          its own in this drawing, so it has no water-heater circuit; the en-suite of{" "}
          <Link href="/docs/decision-log" className="underline underline-offset-4">D-029</Link> would add one, and its plumbing.
        </>}
        real={{ src: `${D}/render/electric-real.webp`, width: 2400, height: 1800, caption: "Rendered from the design model",
          alt: "The same view rendered as finished: the white unit board on the right wall, sockets with USB-C beside both bedside tables, a double socket by the desk and on the right wall, a two-gang switch by the door, the wall fan high on the left wall, the red AC isolator high on the back wall, and slim ceiling lights and a smoke alarm." }}
        rail={deviceRail(points, (m) => `${D}/render/electric/${m}.webp`)} />

      <TextSection id="electric-points" title="Electric points">
        <RoomPointsTable points={points} circuits={circuits} />
        <p className="text-muted-foreground mt-3 max-w-4xl text-sm text-balance">
          Status: design intent. Places, sizes and loads come from guest-room.json; costs are the studio&rsquo;s placeholder
          prices (AS-21) until three quotes come in, and nothing is sourced yet.
        </p>
      </TextSection>

      <DocsSection cards={DOCS} />
    </main>
  )
}
