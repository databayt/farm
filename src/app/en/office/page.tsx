import type { Metadata } from "next"
import Link from "next/link"

import { DocsSection, DrawingSection, ModelSection, PageHero, RailSection, ServiceSection, railCards } from "@/components/page/sections"
import { deviceRail, tagInfo } from "@/components/docs/room-points"
import { RoomWiring } from "@/components/docs/room-wiring"
import { TaggedFigure } from "@/components/docs/tagged-figure"
import { circuits, D, E, N, netLinks, netPoints, points } from "@/components/office/data"
import { NetworkDiagram } from "@/components/office/network-diagram"
import { OfficePlan } from "@/components/office/office-plan"
import office from "@/components/office/office.json"
import electricTags from "../../../../public/designs/office/render/electric-tags.json"
import networkTags from "../../../../public/designs/office/render/network-tags.json"

// The office, in /en/studio's pattern: the hero, the 2D and the 3D, the rail, Electric and Network, then the docs
// cards; the points tables and the status are on /docs/office-points. Both drawings read src/components/office/office.json: the saffron 20 ft container raised on its steel frame, first in the
// south row beside the studios, with a deck, railings and a stair in front, furnished as the farm's
// reception and work office.

export const metadata: Metadata = {
  title: "The office · Farm",
  description: "The farm's office, a lounge and a programmer's workroom: a saffron container on a raised deck by the courtyard, at the Digital Farm near Kigali.",
}

const m2 = (n: number) => +n.toFixed(2)

// The Furniture and equipment rail: each piece rendered on its own by scripts/site/render/office.html?item=<id>,
// sized from office.json. Nothing is sourced or priced yet.
const { sofa, workstation: ws, cafe } = office
const furnitureRail = railCards(`${D}/render/furniture`, [
  { id: "sofa", title: "L sofa", size: `${m2(sofa.x1 - office.container.inner.x0)} × ${m2(office.container.inner.y1 - office.container.inner.y0)} m, ${m2(sofa.d)} m deep`,
    note: "One piece: its short leg across the whole cargo-door end, its long leg along the back wall, a corner seat between." },
  { id: "sofatable", title: "Low table", size: `${m2(sofa.table.x1 - sofa.table.x0)} × ${m2(sofa.table.y1 - sofa.table.y0)} m, 0.41 m high`, note: "Medium Oak, in front of the sofa." },
  { id: "bigdesk", title: "Big desk", size: `${m2(office.container.inner.y1 - office.container.inner.y0)} × ${m2(ws.d)} m, 0.75 m high`,
    note: "Across the whole far end wall, for a programmer and gamer; panel ends and a modesty panel." },
  { id: "display", title: "Studio Display", size: `${m2(ws.display.w)} m wide, its stand foot ${m2(ws.display.foot)} m deep`, note: "One, centred on the desk. Apple's size from memory [A], not yet sourced." },
  { id: "macstudio", title: "Mac Studio", size: `${m2(ws.mac.w)} × ${m2(ws.mac.w)} m, 0.095 m high`, note: "On the desk beside the display. Apple's size from memory [A], not yet sourced." },
  { id: "keyboard", title: "Keyboard and mouse", size: "About 0.44 × 0.13 m", note: "In front of the display." },
  { id: "gamingchair", title: "Gaming chair", size: "Five-star base on castors, a tall winged back with a headrest", note: "Facing the desk and the wall." },
  { id: "cafetable", title: "Ahwa table", size: `Ø ${m2(cafe.table.r * 2)} m, ${m2(cafe.table.h)} m high`, note: "Marble top on a cast-iron pedestal, as in a traditional Egyptian cafe; on the deck." },
  { id: "cafechair", title: "Ahwa chairs × 2", size: `${m2(cafe.chair.w)} × ${m2(cafe.chair.d)} m, seat ${m2(cafe.chair.seat)} m`,
    note: "Dark wood with woven rush seats, either side of the table, looking out over the garden." },
])

// The Electric and Network sections: office.json `electric` and `network` (read in data.ts), drawn by RoomWiring and
// NetworkDiagram, rendered by office.html?view=electric|network
const designA = Math.round(circuits.reduce((n, c) => n + (c.design_A ?? 0), 0) * 10) / 10

// The office's own docs page first, as the studio's are, then the guides behind the page.
const DOCS = [
  { href: "/docs/office-points", title: "Electric and network points", text: "Every light, socket, cable and network point on the drawings above, with its circuit, and where the design stands." },
  { href: "/docs/digital", title: "The digital farm", text: "Bookings, payments, the gate, water, power and the books on simple digital tools, and in what order." },
  { href: "/docs/iot-architecture", title: "IoT architecture", text: "One gateway, one uplink: connectivity, hardware, monitoring, security and working offline." },
  { href: "/docs/power", title: "Power", text: "Grid, solar or both, and the batteries that keep the Wi-Fi and the cameras up." },
]

export default function OfficePage() {
  return (
    <main className="w-full flex-1">
      {/* First screen: the founder's Nano Banana render of the office (2026-10-30), made from the brief in
          ~/Desktop/office-nano-banana; master kept at assets/office/hero-gemini.jpg (1024 px), upscaled to 2400 x 1340.
          It departs from the drawings: a navy container, glass across the whole front, a low deck with no railings or
          stair. The container sits centre, so the words keep the lawn bottom-left. */}
      <PageHero src={`${D}/render/office-hero.jpg`} width={2400} height={1340} className="bg-[#7d8f5a]" imgClassName="object-[50%_55%]"
        title="An office on the deck, by the courtyard"
        alt="A navy-blue shipping container on a low red steel frame with a timber deck in front, its front a wall of white-framed glass doors: inside, a grey L sofa with an oak coffee table and a desk with a monitor and a black gaming chair, lit warm; on the deck, a marble-topped bistro table with a glass of tea and two rush-seated wooden chairs, on a mown lawn before a eucalyptus wood at golden hour." />

      {/* 2D, full screen: the office's plan (src/components/office/office-plan.tsx), in the text colour. */}
      <DrawingSection id="plans" title="2D">
        <OfficePlan title="Plan: a 20 ft container 6,058 by 2,438 mm with a 1,500 mm deck in front and a stair off its corner; inside, one L sofa across the whole cargo-door end and along the back wall, round a low table, and one big programmer's and gamer's desk across the whole far end wall, with a single Studio Display, a Mac Studio and a gaming chair; on the deck, a round ahwa table with two chairs, as in an Egyptian cafe."
          className="h-auto w-full lg:h-full lg:w-auto" />
      </DrawingSection>

      {/* 3D, in the 2D section's pattern: a line drawing of the office seen from the front with its front wall
          and roof off, then the same view rendered. Both from scripts/site/render/office.html. */}
      <ModelSection line={`${D}/render/office-line.png`} real={`${D}/render/office-real.webp`} width={2400} height={1100}
        lineAlt="Line drawing of the office from the front with the front wall off: the container raised on its frame, the deck with railings and the stair, an L sofa across the cargo-door end and along the back wall with a low table, and a big desk across the far end wall with a Studio Display, a Mac Studio and a gaming chair, and on the deck, an Egyptian ahwa table with two chairs."
        realAlt="The same view rendered: saffron corrugated steel, off-white walls and an oak floor, a stone-grey L sofa and a Medium Oak table, a Medium Oak desk with a silver Studio Display and Mac Studio, a black gaming chair, a marble-topped ahwa table with two rush-seated wooden chairs on the deck, on red steel posts with a eucalyptus deck and red railings over the lawn." />

      {/* The rail, in the studio's pattern: each piece on its own (office.html?item=<id>), the card in focus showing its
          size, source and cost below. */}
      <RailSection id="furniture" title="Furniture and equipment" items={furnitureRail} />

      {/* Electric, in the studio's pattern: the office's wiring drawn full width from the farm's supply to every circuit,
          the installation in the 3D view's camera (render/electric-line.png, every run in its circuit's colour, every
          point tagged), the finished office (render/electric-real.webp),
          then each device on its own. All from scripts/site/render/office.html?view=electric and ?item=<model>. */}
      <ServiceSection id="electrical" title="Electric"
        diagram={<RoomWiring circuits={circuits} mainA={E.main_A} board="the office's 12-module board, on the back wall"
          supply={{ title: "Site board", sub: "the farm's, off the drawing", cable: "armoured cable, sized to its run" }}
          notes={[`Design ${designA} A on a ${E.main_A} A main switch · one RCBO 30 mA type A per circuit · the studio's conventions (D-021)`,
            "C3 feeds only the network cabinet's UPS · ratings are design intent until a RURA class A electrician designs the supply and certifies"]} />}
        figure={<TaggedFigure table="/docs/office-points" src={`${D}/render/electric-line.png`} aspect={electricTags.aspect} tags={electricTags.tags}
          alt="Line drawing of the office from the front: the unit board on the back wall over the sofa, its circuits rising along the ceiling edge and down to each point, in blue for the three ceiling lights and the switch, orange for the sockets at the big desk, over the sofa, on the back wall and for the network cabinet's UPS."
          info={tagInfo(points, circuits)} />}
        note={<>
          Every run goes up into the ceiling, along it and straight down to its device, in conduit inside the linings.
          Each tag opens its row in the <Link href="/docs/office-points#electric-points" className="underline underline-offset-4">points table</Link>.
        </>}
        real={{ src: `${D}/render/electric-real.webp`, width: 2400, height: 1100, caption: "Rendered from the design model",
          alt: "The same view rendered as finished: the white unit board on the back wall over the sofa, three slim ceiling lights, a two-gang switch by the glazing, sockets over the big desk, over the sofa's end and on the back wall, and the UPS socket under the network cabinet." }}
        rail={deviceRail(points, (m) => `${D}/render/electric/${m}.webp`)} />

      {/* Network, in the Electric section's pattern: the farm's network from the office (the IoT architecture's base,
          taken as the office [A]) drawn full width, then the installation in the 3D view's camera (render/network-line.png,
          every cable in its colour, every point tagged), then each part on its own (office.html?item=<model>). */}
      <ServiceSection id="network" title="Network"
        diagram={<NetworkDiagram links={N.circuits} points={netPoints} />}
        figure={<TaggedFigure table="/docs/office-points" src={`${D}/render/network-line.png`} aspect={networkTags.aspect} tags={networkTags.tags}
          alt="Line drawing of the office from the front: the black wall cabinet on the back wall beside the big desk with the router on top, the PoE switch and the gateway inside and the UPS on the floor under it; a purple cable along the ceiling to the access point, and a magenta cable to the data outlet over the big desk."
          info={tagInfo(netPoints, netLinks)} />}
        note={<>
          The router, the switch and the gateway sit in one small cabinet on their own circuit (C3) and UPS, so the farm&rsquo;s
          Wi-Fi, its cameras and its sensors keep working through a cut. Cables run with the power, along the ceiling and
          down to each outlet. Each tag opens its row in the <Link href="/docs/office-points#network-points" className="underline underline-offset-4">points table</Link>.
          Signal at the site is unknown until a survey of both networks; buy no radio hardware before it.
        </>}
        rail={deviceRail(netPoints, (m) => `${D}/render/network/${m}.webp`)} />

      <DocsSection cards={DOCS} />
    </main>
  )
}
