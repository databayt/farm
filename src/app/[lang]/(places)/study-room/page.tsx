import type { Metadata } from "next"
import { LocaleLink as Link } from "@/components/internationalization/locale-link"

import { DocsSection, DrawingSection, ModelSection, PageHero, RailSection, ServiceSection } from "@/components/page/sections"
import { tagInfo } from "@/components/docs/room-points"
import { RoomWiring } from "@/components/docs/room-wiring"
import { TaggedFigure } from "@/components/docs/tagged-figure"
import { cornerRail, electricRail, tableRail } from "@/components/study-room/rails"
import { allLinks, circuits, D, E, points } from "@/components/study-room/data"
import { StudyRoomPlan } from "@/components/study-room/study-room-plan"
import electricTags from "../../../../../public/designs/study-room/render/electric-tags.json"

// The study room, in /en/studio's pattern: the hero, the 2D and the 3D, the rails, Electric with the Wi-Fi, then the
// docs cards; the points table and the status are on /docs/study-room-points. Both drawings read
// src/components/study-room/study-room.json: the compound's teal 40 ft container on a stone plinth, glazed
// doors behind timber louvres onto a 2 m deck, furnished with one long table for eight, a screen wall, a bookshelf
// wall and a reading corner.

export const metadata: Metadata = {
  title: "The study room · Farm",
  description: "A room for eight to meet, train or work on a project together, glazed onto a deck with lake views, at the Digital Farm near Kigali.",
}

// The Electric section: study-room.json `electric` and `network` (the Wi-Fi; read in data.ts), drawn by RoomWiring,
// rendered by study-room.html?view=electric
const designA = Math.round(circuits.reduce((n, c) => n + (c.design_A ?? 0), 0) * 10) / 10

// The study room's docs pages, as the docs sidebar groups them (D-059), linked from the end of this page.
const DOCS = [
  { href: "/docs/study-room", title: "Execution plan", text: "Every step of fitting out the study room, in the studio's order, from the survey to the first workshop." },
  { href: "/docs/study-room/materials", title: "Materials", text: "The table and the screen, the reading corner and each electric device, with its size, source and cost." },
  { href: "/docs/study-room/electric", title: "Electric", text: "The four circuits with the Wi-Fi, the first and second fix, the tests and every point." },
]

export default function StudyRoomPage() {
  return (
    <main className="w-full flex-1">
      {/* First screen: the founder's Nano Banana render of the study room (2026-10-31); master kept at
          assets/study-room/hero-gemini.jpeg (2752 x 1536), cut to 2400 x 1340. It departs from the drawings in two
          things: no timber louvres over the glazing, and the middle doors stand open. The room sits centre with the
          deck across the bottom, so the image centres. */}
      <PageHero src={`${D}/render/study-room-hero.jpg`} width={2400} height={1340} className="bg-[#c9a36a]" imgClassName="object-[50%_50%]"
        title="A room to meet, train and build"
        alt="A long teal shipping container seen square-on at golden hour, its front glazed with white-framed sliding doors, the middle pair open: inside, a long oak table with eight oak chairs and a few laptops under three rattan pendants, a big screen and a lectern on the left, two ochre armchairs before a full-height bookshelf on the right, fig plants between; a wide honey-coloured timber deck with a broad step on a stone plinth, on a lawn among banana plants and trees." />

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
        figure={<TaggedFigure table="/docs/study-room/electric" src={`${D}/render/electric-line.png`} aspect={electricTags.aspect} tags={electricTags.tags}
          alt="Line drawing of the study room from the deck: the unit board on the back wall by the reading corner, the circuits running along the ceiling edge, in blue down to the five pendants, the switches and the two wall fans, orange to a double socket low on the back wall behind each pair of seats, the screen wall and the reading corner, the Wi-Fi's cable in purple from the entry box to the ceiling access point, and magenta to the screen's data outlet."
          info={tagInfo(points, allLinks)} />}
        note={<>
          Every run goes up into the ceiling, along it and straight down to its device, in conduit inside the linings. A double
          socket sits low on the back wall behind each pair of seats, so each of the eight has its own. The Wi-Fi comes from the office&rsquo;s
          switch: the outdoor cable enters at NE and powers the access point AP1 over its cable. Each tag opens its row in
          the <Link href="/docs/study-room/electric#points" className="underline underline-offset-4">points table</Link>.
        </>}
        real={{ src: `${D}/render/electric-real.webp`, width: 2400, height: 1000, caption: "Rendered from the design model",
          alt: "The same view rendered as finished: the white unit board on the back wall by the reading corner, a double socket behind each pair of seats, the rattan pendants in a row, the two wall fans, and the access point and smoke alarm on the ceiling line." }}
        rail={electricRail} />

      <DocsSection cards={DOCS} ownPlan />
    </main>
  )
}
