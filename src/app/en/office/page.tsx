import type { Metadata } from "next"

import { DocsSection, DrawingSection, ModelSection, PageHero, RailSection, ServiceSection, TextSection } from "@/components/page/sections"
import { type RailItem } from "@/components/docs/item-rail"
import { PointsTable, type RoomPoint, deviceRail, tagInfo, withLoads } from "@/components/docs/room-points"
import { RoomWiring } from "@/components/docs/room-wiring"
import { TaggedFigure } from "@/components/docs/tagged-figure"
import { NetworkDiagram } from "@/components/office/network-diagram"
import { OfficePlan } from "@/components/office/office-plan"
import office from "@/components/office/office.json"
import electricTags from "../../../../public/designs/office/render/electric-tags.json"
import networkTags from "../../../../public/designs/office/render/network-tags.json"

// The office, as /en/camp is one camp: a full-screen hero, then the 2D and the 3D. Both drawings read
// src/components/office/office.json: the saffron 20 ft container raised on its steel frame, first in the
// south row beside the studios, with a deck, railings and a stair in front, furnished as the farm's
// reception and work office.

export const metadata: Metadata = {
  title: "The office · Farm",
  description: "The farm's reception and work office: a saffron container on a raised deck by the courtyard, at the Digital Farm near Kigali.",
}

const D = "/designs/office"
const m2 = (n: number) => +n.toFixed(2)

// The Furniture and equipment rail: each piece rendered on its own by scripts/site/render/office.html?item=<id>,
// sized from office.json. Nothing is sourced or priced yet.
type Row = { id: string; title: string; size: string; note?: string }
function rail(rows: Row[]): RailItem[] {
  return rows.map((x) => ({
    src: `${D}/render/furniture/${x.id}.webp`, alt: x.title, title: x.title, note: x.note,
    details: [{ label: "Dimensions", value: x.size }, { label: "Where to buy", value: "Not sourced yet" }, { label: "Cost", value: "Not priced yet" }],
  }))
}
const { meeting, reception, desk, shelves, printer, screen, ac } = office
const furnitureRail = rail([
  { id: "reception", title: "Reception desk", size: `${m2(reception.x1 - reception.x0)} × ${m2(reception.y1 - reception.y0)} m, ${m2(reception.h)} m high`,
    note: "Panel ends and a modesty panel toward the glazing, as in today's office; fed from the floor box under it (FB)." },
  { id: "officechair", title: "Office chairs × 2", size: "Five-star base on castors, a mesh back", note: "Black mesh chairs, as in today's office." },
  { id: "monitor", title: "Monitors × 2", size: "About 0.56 m wide, with a keyboard", note: "One on each desk." },
  { id: "desk", title: "Second desk", size: `${m2(desk.x1 - desk.x0)} × ${m2(desk.y1 - desk.y0)} m, ${m2(desk.h)} m high`, note: "On the far end wall, its chair facing the wall." },
  { id: "shelves", title: "Filing wall", size: `${m2(shelves.x1 - shelves.x0)} m wide, ${m2(shelves.d)} m deep, ${m2(shelves.h)} m high`,
    note: `Closed cupboards to ${m2(shelves.base)} m, ${shelves.rows} rows of open shelves above for box files.` },
  { id: "printer", title: "Printer cabinet", size: `${m2(printer.x1 - printer.x0)} × ${m2(printer.y1 - printer.y0)} m, ${m2(printer.h)} m high`, note: "In the front corner by the second desk, the printer on it." },
  { id: "table", title: "Meeting table", size: `Ø ${m2(meeting.r * 2)} m, ${m2(meeting.h)} m high`, note: "Round, for four, under the wall screen at the cargo-door end." },
  { id: "woodchair", title: "Meeting chairs × 4", size: `${m2(meeting.chair.w)} × ${m2(meeting.chair.d)} m, seat ${m2(meeting.chair.seat)} m` },
  { id: "screen", title: "Wall screen", size: `${m2(screen.w)} × ${m2(screen.h)} m, its foot at ${m2(screen.bottom)} m`, note: "Shows the farm's map; plugs into P3 and the data outlet D3 under it." },
  { id: "ac", title: "Split AC", size: `${m2(ac.x1 - ac.x0)} × ${m2(ac.y1 - ac.y0)} m, ${m2(ac.d)} m deep`, note: "High on the back wall over the meeting table, on its own circuit (C4) behind the isolator P6." },
])

// The Electric and Network sections: office.json `electric` and `network`, drawn by RoomWiring and NetworkDiagram,
// rendered by office.html?view=electric|network
const E = office.electric, N = office.network
const points = E.points as RoomPoint[], netPoints = N.points as RoomPoint[]
const circuits = withLoads(E.circuits, points)
const netLinks = N.circuits.map((c) => ({ ...c, device: "", cable_mm2: 0 }))
const designA = Math.round(circuits.reduce((n, c) => n + (c.design_A ?? 0), 0) * 10) / 10

const DOCS = [
  { href: "/docs/first-90-days", title: "Execution plan", text: "The first 90 days, gate by gate and week by week, then the five-year roadmap." },
  { href: "/docs/digital", title: "The digital farm", text: "Bookings, payments, the gate, water, power and the books on simple digital tools, and in what order." },
  { href: "/docs/iot-architecture", title: "IoT architecture", text: "One gateway, one uplink: connectivity, hardware, monitoring, security and working offline." },
  { href: "/docs/power", title: "Power", text: "Grid, solar or both, and the batteries that keep the Wi-Fi and the cameras up." },
  { href: "/docs/studio-circuits", title: "Circuits and points", text: "The studio's circuits, checked against breaker, cable and voltage drop: the conventions the office follows." },
]

export default function OfficePage() {
  return (
    <main className="w-full flex-1">
      {/* First screen: a STAND-IN until the Nano Banana remaster (brief: ~/Desktop/office-nano-banana). Today's
          saffron container on its raised deck from the 2026-10-25 footage (assets/library/footage/2026-10-25/IMG_3165), cut to
          2400 x 1340. The container sits centre-right, so the words keep the lawn bottom-left. */}
      <PageHero src={`${D}/render/office-hero.jpg`} width={2400} height={1340} className="bg-[#c9d3dc]" imgClassName="object-[60%_50%]"
        title="An office on the deck, by the courtyard"
        alt="A saffron shipping container raised on a red steel frame, its white-framed glazed doors open onto a timber deck with red pipe railings, on a green lawn with young trees behind under a cloudy sky." />

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
          the installation in the 3D view's camera (render/electric-line.png, every run in its circuit's colour, dashed
          under the floor to the reception's floor box, every point tagged), the finished office (render/electric-real.webp),
          then each device on its own. All from scripts/site/render/office.html?view=electric and ?item=<model>. */}
      <ServiceSection id="electrical" title="Electric"
        diagram={<RoomWiring circuits={circuits} mainA={E.main_A} board="the office's 12-module board, on the back wall"
          supply={{ title: "Site board", sub: "the farm's, off the drawing", cable: "armoured cable, sized to its run" }}
          notes={[`Design ${designA} A on a ${E.main_A} A main switch · one RCBO 30 mA type A per circuit · the studio's conventions (D-021)`,
            "C3 feeds only the network cabinet's UPS · ratings are design intent until a RURA class A electrician designs the supply and certifies"]} />}
        figure={<TaggedFigure src={`${D}/render/electric-line.png`} aspect={electricTags.aspect} tags={electricTags.tags}
          alt="Line drawing of the office from the front: the unit board on the back wall between the AC and the filing wall, its circuits rising along the ceiling edge and down to each point, in blue for the three ceiling lights, the switch and the wall fan, orange for the sockets at the desks, the printer, the screen and the network cabinet, dashed under the floor to the reception desk's floor box, and green for the AC isolator."
          info={tagInfo(points, circuits)} />}
        note={<>
          Every run goes up into the ceiling, along it and straight down to its device, in conduit inside the linings; the
          reception desk stands free, so its run drops behind the board and crosses under the floor to the floor box (FB).
          Each tag opens its row in the <a href="#electric-points" className="underline underline-offset-4">points table</a>.
        </>}
        real={{ src: `${D}/render/electric-real.webp`, width: 2400, height: 1100, caption: "Rendered from the design model",
          alt: "The same view rendered as finished: the white unit board on the back wall, three slim ceiling lights, a two-gang switch by the glazing, sockets over the second desk, the printer and under the screen, the floor box under the reception desk, the wall fan and the red AC isolator beside the split unit." }}
        rail={deviceRail(points, (m) => `${D}/render/electric/${m}.webp`)} />

      <TextSection id="electric-points" title="Electric points">
        <PointsTable points={points} circuits={circuits} />
      </TextSection>

      {/* Network, in the Electric section's pattern: the farm's network from the office (the IoT architecture's base,
          taken as the office [A]) drawn full width, then the installation in the 3D view's camera (render/network-line.png,
          every cable in its colour, every point tagged), then each part on its own (office.html?item=<model>). */}
      <ServiceSection id="network" title="Network"
        diagram={<NetworkDiagram links={N.circuits} points={netPoints} />}
        figure={<TaggedFigure src={`${D}/render/network-line.png`} aspect={networkTags.aspect} tags={networkTags.tags}
          alt="Line drawing of the office from the front: the black wall cabinet on the back wall with the router on top, the PoE switch and the gateway inside and the UPS on the floor under it; a purple cable along the ceiling to the access point, and magenta cables to the data outlets over the second desk and under the screen, dashed under the floor to the reception desk's floor box."
          info={tagInfo(netPoints, netLinks)} />}
        note={<>
          The router, the switch and the gateway sit in one small cabinet on their own circuit (C3) and UPS, so the farm&rsquo;s
          Wi-Fi, its cameras and its sensors keep working through a cut. Cables run with the power, along the ceiling and
          down to each outlet. Each tag opens its row in the <a href="#network-points" className="underline underline-offset-4">points table</a>.
          Signal at the site is unknown until a survey of both networks; buy no radio hardware before it.
        </>}
        rail={deviceRail(netPoints, (m) => `${D}/render/${m === "floorbox" ? "electric" : "network"}/${m}.webp`, { floorbox: { title: "Floor box" } })} />

      <TextSection id="network-points" title="Network points">
        <PointsTable points={netPoints} circuits={netLinks} />
        <p className="text-muted-foreground mt-3 max-w-4xl text-sm text-balance">
          Status: design intent. Places and sizes come from office.json; the electrical costs are the studio&rsquo;s placeholder
          prices (AS-21) until three quotes come in, and the network gear is neither sourced nor priced.
        </p>
      </TextSection>

      <DocsSection cards={DOCS} />
    </main>
  )
}
