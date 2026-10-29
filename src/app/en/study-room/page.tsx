import type { Metadata } from "next"

import { DrawingSection, ModelSection, PageHero } from "@/components/page/sections"
import { StudyRoomPlan } from "@/components/study-room/study-room-plan"

// The study room, as /en/camp is one camp: a full-screen hero, then the 2D and the 3D. Both drawings read
// src/components/study-room/study-room.json: the compound's teal 40 ft container on a stone plinth, glazed
// doors behind timber louvres onto a 2 m deck, furnished with six desks for twelve, a screen wall, a bookshelf
// wall and a reading corner. The hero is a stand-in until the Nano Banana remaster.

export const metadata: Metadata = {
  title: "The study room · Farm",
  description: "A quiet room for twelve to study, work or teach, glazed onto a deck with lake views, at the Digital Farm near Kigali.",
}

const D = "/designs/study-room"

export default function StudyRoomPage() {
  return (
    <main className="w-full flex-1">
      {/* First screen: a STAND-IN until the Nano Banana remaster (brief and references in the founder's
          study-room-nano-banana folder). It is today's footage still of the courtyard lawn (IMG_3171, via
          assets/today/aerial.png) with the lake through the trees on the left, where the study room will
          stand, cut to 2400 x 1340. The buildings sit right, so the words keep the open lawn bottom-left. */}
      <PageHero src={`${D}/render/study-room-hero.jpg`} width={2400} height={1340} className="bg-[#c9d3dc]" imgClassName="object-[60%_50%]"
        title="A quiet room to learn, with the lake outside"
        alt="The farm's courtyard lawn today under a soft overcast sky: pop-up tents on the grass, a yellow container with red doors on the right, trees and the lake glinting behind them on the left." />

      {/* 2D, full screen: the study room's plan (src/components/study-room/study-room-plan.tsx), in the text
          colour. It is long, so it takes the full width. */}
      <DrawingSection id="plans" title="2D">
        <StudyRoomPlan title="Plan: a 40 ft container 12.2 m long and 2.4 m wide, glazed doors behind timber louvres along its front onto a 2 m deck with a broad step; inside, a screen wall at the left end with a cabinet, a whiteboard and a lectern, six desks against the back wall with two chairs each facing the screen, then a reading corner with two armchairs, a side table, a lamp and a rug, and a bookshelf wall across the right end."
          className="h-auto w-full lg:h-full lg:w-auto lg:max-w-full" />
      </DrawingSection>

      {/* 3D, in the 2D section's pattern: a line drawing of the study room seen from the deck with its front
          wall off, then the same view rendered. Both from scripts/site/render/study-room.html. */}
      <ModelSection line={`${D}/render/study-room-line.png`} real={`${D}/render/study-room-real.webp`} width={2400} height={1000}
        lineAlt="Line drawing of the study room from the deck with the front wall off: a screen on a slatted panel at the left end, a whiteboard, six desks with two chairs each, pendant lights in a row, an air conditioner on the back wall, two armchairs on a rug by a floor lamp, and a full-height bookshelf at the right end, the wide deck and its step in front."
        realAlt="The same view rendered: a teal container with an oak plank floor and off-white walls, oak desks and chairs with oat seat pads and a few laptops, rattan pendants, a black screen on oak slats, ochre armchairs on a striped rug, shelves full of books, green plants, and a honey-coloured eucalyptus deck on the lawn." />
    </main>
  )
}
