import type { Metadata } from "next"

import { DrawingSection, ModelSection, PageHero } from "@/components/page/sections"
import { OfficePlan } from "@/components/office/office-plan"

// The office, as /en/camp is one camp: a full-screen hero, then the 2D and the 3D. Both drawings read
// src/components/office/office.json: the saffron 20 ft container raised on its steel frame, first in the
// south row beside the studios, with a deck, railings and a stair in front, furnished as the farm's
// reception and work office.

export const metadata: Metadata = {
  title: "The office · Farm",
  description: "The farm's reception and work office: a saffron container on a raised deck by the courtyard, at the Digital Farm near Kigali.",
}

const D = "/designs/office"

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
        <OfficePlan title="Plan: a 20 ft container 6,058 by 2,438 mm with a 1,500 mm deck in front and a stair off its corner; inside, a round meeting table for four under a wall screen at the cargo-door end, the reception desk facing the 3 m sliding glazing with a filing wall behind, and a second desk and a printer cabinet at the far end."
          className="h-auto w-full lg:h-full lg:w-auto" />
      </DrawingSection>

      {/* 3D, in the 2D section's pattern: a line drawing of the office seen from the front with its front wall
          and roof off, then the same view rendered. Both from scripts/site/render/office.html. */}
      <ModelSection line={`${D}/render/office-line.png`} real={`${D}/render/office-real.webp`} width={2400} height={1100}
        lineAlt="Line drawing of the office from the front with the front wall off: the container raised on its frame, the deck with railings and the stair, a round table with four chairs, a split AC, the filing wall, the reception desk with a monitor and chair, and a second desk, printer and wall fan at the far end."
        realAlt="The same view rendered: saffron corrugated steel, off-white walls and an oak floor, Medium Oak desks, shelves and meeting chairs, black mesh office chairs, coloured box files, a tall plant, on red steel posts with a eucalyptus deck and red railings over the lawn." />
    </main>
  )
}
