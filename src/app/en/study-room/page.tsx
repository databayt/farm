import type { Metadata } from "next"

import { DocsSection, DrawingSection, ModelSection, PageHero, RailSection, ServiceSection, TextSection, railCards } from "@/components/page/sections"
import { RoomPointsTable, type RoomPoint, deviceRail, tagInfo, withLoads } from "@/components/docs/room-points"
import { RoomWiring } from "@/components/docs/room-wiring"
import { TaggedFigure } from "@/components/docs/tagged-figure"
import { StudyRoomPlan } from "@/components/study-room/study-room-plan"
import room from "@/components/study-room/study-room.json"
import electricTags from "../../../../public/designs/study-room/render/electric-tags.json"

// The study room, as /en/camp is one camp: a full-screen hero, then the 2D and the 3D. Both drawings read
// src/components/study-room/study-room.json: the compound's teal 40 ft container on a stone plinth, glazed
// doors behind timber louvres onto a 2 m deck, furnished with one long table for eight, a screen wall, a bookshelf
// wall and a reading corner. The hero is a stand-in until the Nano Banana remaster.

export const metadata: Metadata = {
  title: "The study room · Farm",
  description: "A room for eight to meet, train or work on a project together, glazed onto a deck with lake views, at the Digital Farm near Kigali.",
}

const D = "/designs/study-room"
const m2 = (n: number) => +n.toFixed(2)

// The rails: each piece rendered on its own by scripts/site/render/study-room.html?item=<id>, sized from
// study-room.json. Nothing is sourced or priced yet.
const { table, screen, shelves, reading, room: inner } = room
const tableRail = railCards(`${D}/render/furniture`, [
  { id: "table", title: "Long table", size: `${m2(table.l)} × ${m2(table.w)} m, ${m2(table.h)} m high`,
    note: `Down the middle of the room, ${table.seats.length} seats along each side; a double socket on the back wall behind each pair.` },
  { id: "chair", title: `Chairs × ${table.seats.length * 2}`, size: `${m2(table.chair.w)} × ${m2(table.chair.d)} m, seat ${m2(table.chair.seat)} m, back ${m2(table.chair.back)} m`,
    note: "Oak with an oat seat pad, facing each other across the table." },
  { id: "screen", title: "Screen", size: `86 inch, ${m2(screen.w)} × ${m2(screen.h)} m, its foot at ${m2(screen.y0)} m`,
    note: "Flat on the east end wall on a low-profile bracket; it casts over the Wi-Fi, with P5 and the data outlet D1 behind its cabinet." },
  { id: "cabinet", title: "Screen cabinet", size: `${m2(screen.cabinet.l)} × ${m2(screen.cabinet.d)} m, ${m2(screen.cabinet.h)} m high` },
  { id: "lectern", title: "Lectern", size: `${m2(screen.lectern.w)} × ${m2(screen.lectern.d)} m, ${m2(screen.lectern.h)} m high`, note: "A standing table for whoever is presenting or teaching." },
])
const cornerRail = railCards(`${D}/render/furniture`, [
  { id: "shelves", title: "Bookshelf wall", size: `${m2(inner.front - inner.back)} m wide, ${m2(shelves.d)} m deep, full height`,
    note: `${shelves.bays} bays of ${shelves.rows} shelves across the west end wall.` },
  { id: "armchair", title: "Armchairs × 2", size: `${m2(reading.chair.w)} × ${m2(reading.chair.d)} m, seat ${m2(reading.chair.seat)} m`, note: "Upholstered, angled toward the glazing." },
  { id: "sidetable", title: "Side table", size: `Ø ${m2(reading.table.r * 2)} m, ${m2(reading.table.h)} m high` },
  { id: "floorlamp", title: "Floor lamp", size: `${m2(reading.lamp.h)} m high`, note: "Plugged into the socket P6 in the corner." },
  { id: "rug", title: "Rug", size: `${m2(reading.rug.x[1] - reading.rug.x[0])} × ${m2(reading.rug.y[1] - reading.rug.y[0])} m`, note: "Woven, under the reading corner." },
])

// The Electric section: study-room.json `electric` and `network` (the Wi-Fi), drawn by RoomWiring, rendered by
// study-room.html?view=electric
const E = room.electric, N = room.network
const powerPoints = E.points as RoomPoint[], dataPoints = N.points as RoomPoint[]
const points = [...powerPoints, ...dataPoints]
const circuits = withLoads(E.circuits, powerPoints)
const allLinks = [...circuits, ...N.circuits.map((c) => ({ ...c, device: "", cable_mm2: 0 }))]
const designA = Math.round(circuits.reduce((n, c) => n + (c.design_A ?? 0), 0) * 10) / 10

const DOCS = [
  { href: "/docs/power", title: "Power", text: "Grid, solar or both: what the farm uses, building by building, and what each option costs." },
  { href: "/docs/studio-circuits", title: "Circuits and points", text: "The studio's circuits, checked against breaker, cable and voltage drop: the conventions this room follows." },
  { href: "/docs/digital", title: "The digital farm", text: "Bookings, payments, the gate and the books on simple digital tools, and the farm's network." },
  { href: "/docs/master-plan", title: "Master plan", text: "The whole farm on one sheet: where the study room stands, the paths and the services." },
]

export default function StudyRoomPage() {
  return (
    <main className="w-full flex-1">
      {/* First screen: a STAND-IN until the Nano Banana remaster (brief and references in the founder's
          study-room-nano-banana folder). It is today's footage still of the courtyard lawn (IMG_3171, via
          assets/today/aerial.png) with the lake through the trees on the left, where the study room will
          stand, cut to 2400 x 1340. The buildings sit right, so the words keep the open lawn bottom-left. */}
      <PageHero src={`${D}/render/study-room-hero.jpg`} width={2400} height={1340} className="bg-[#c9d3dc]" imgClassName="object-[60%_50%]"
        title="A room to meet, train and build, with the lake outside"
        alt="The farm's courtyard lawn today under a soft overcast sky: pop-up tents on the grass, a yellow container with red doors on the right, trees and the lake glinting behind them on the left." />

      {/* 2D, full screen: the study room's plan (src/components/study-room/study-room-plan.tsx), in the text
          colour. It is long, so it takes the full width. */}
      <DrawingSection id="plans" title="2D">
        <StudyRoomPlan title="Plan: a 40 ft container 12.2 m long and 2.4 m wide, glazed doors behind timber louvres along its front onto a 2 m deck with a broad step; inside, a big screen on the left end wall with a cabinet under it and a lectern, one long table down the middle with four chairs along each side, then a reading corner with two armchairs, a side table, a lamp and a rug, and a bookshelf wall across the right end."
          className="h-auto w-full lg:h-full lg:w-auto lg:max-w-full" />
      </DrawingSection>

      {/* 3D, in the 2D section's pattern: a line drawing of the study room seen from the deck with its front
          wall off, then the same view rendered. Both from scripts/site/render/study-room.html. */}
      <ModelSection line={`${D}/render/study-room-line.png`} real={`${D}/render/study-room-real.webp`} width={2400} height={1000}
        lineAlt="Line drawing of the study room from the deck with the front wall off: a big screen on the left end wall, a long table in the middle with eight chairs, three pendant lights over it, two wall fans, two armchairs on a rug by a floor lamp, and a full-height bookshelf at the right end, the wide deck and its step in front."
        realAlt="The same view rendered: a teal container with an oak plank floor and off-white walls, a long oak table with eight oak chairs on oat seat pads and a few laptops, rattan pendants, a big black screen on the end wall, ochre armchairs on a striped rug, shelves full of books, green plants, and a honey-coloured eucalyptus deck on the lawn." />

      {/* The rails, in the studio's pattern: each piece on its own (study-room.html?item=<id>), the card in focus
          showing its size, source and cost below. */}
      <RailSection id="table" title="Table and screen" items={tableRail} />
      <RailSection id="reading" title="Reading corner" items={cornerRail} />

      {/* Electric, in the studio's pattern: the room's wiring drawn full width from the farm's supply to every circuit,
          then the installation in the 3D view's camera with the Wi-Fi's cables too (render/electric-line.png, every run
          in its colour, every point tagged), the finished room (render/electric-real.webp), then each device on its own.
          All from scripts/site/render/study-room.html?view=electric and ?item=<model>, built from study-room.json. */}
      <ServiceSection id="electrical" title="Electric"
        diagram={<RoomWiring circuits={circuits} mainA={E.main_A} board="the room's 12-module board, by the reading corner"
          supply={{ title: "Site board", sub: "the farm's, off the drawing", cable: "armoured cable, sized to its run" }}
          notes={[`Design ${designA} A on a ${E.main_A} A main switch · one RCBO 30 mA type A per circuit · the studio's conventions (D-021)`,
            "Ratings are design intent until a RURA class A electrician designs the supply and certifies the room"]} />}
        figure={<TaggedFigure src={`${D}/render/electric-line.png`} aspect={electricTags.aspect} tags={electricTags.tags}
          alt="Line drawing of the study room from the deck: the unit board on the back wall by the reading corner, the circuits running along the ceiling edge, in blue down to the five pendants, the switches and the two wall fans, orange to a double socket low on the back wall behind each pair of seats, the screen wall and the reading corner, the Wi-Fi's cable in purple from the entry box to the ceiling access point, and magenta to the screen's data outlet."
          info={tagInfo(points, allLinks)} />}
        note={<>
          Every run goes up into the ceiling, along it and straight down to its device, in conduit inside the linings. A double
          socket sits low on the back wall behind each pair of seats, so each of the eight has its own. The Wi-Fi comes from the office&rsquo;s
          switch: the outdoor cable enters at NE and powers the access point AP1 over its cable. Each tag opens its row in
          the <a href="#electric-points" className="underline underline-offset-4">points table</a>.
        </>}
        real={{ src: `${D}/render/electric-real.webp`, width: 2400, height: 1000, caption: "Rendered from the design model",
          alt: "The same view rendered as finished: the white unit board on the back wall by the reading corner, a double socket behind each pair of seats, the rattan pendants in a row, the two wall fans, and the access point and smoke alarm on the ceiling line." }}
        rail={deviceRail(points, (m) => `${D}/render/electric/${m}.webp`, { pendant: { size: "Ø 380 mm dome on a cord, 1.95 m above the floor" }, wallfan: { size: "Ø 400 mm, on a short arm" } })} />

      <TextSection id="electric-points" title="Electric points">
        <RoomPointsTable points={points} circuits={allLinks} />
        <p className="text-muted-foreground mt-3 max-w-4xl text-sm text-balance">
          Status: design intent. Places, sizes and loads come from study-room.json; electrical costs are the studio&rsquo;s
          placeholder prices (AS-21) until three quotes come in, and the Wi-Fi gear is neither sourced nor priced.
        </p>
      </TextSection>

      <DocsSection cards={DOCS} />
    </main>
  )
}
