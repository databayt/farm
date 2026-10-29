import type { Metadata } from "next"

import { DrawingSection, ModelSection, PageHero } from "@/components/page/sections"
import { VolleyballPlan } from "@/components/volleyball/volleyball-plan"

// The volleyball court, as /en/camp is one camp: a full-screen hero, then the 2D and the 3D. Both drawings read
// src/components/volleyball/volleyball.json: the master plan's court on the lawn, 18 x 9 m inside a 3 m free zone to
// the FIVB Official Volleyball Rules, on the lawn's own grass mown short, the net on padded posts, and beyond the far
// free zone two benches under thatched umbrellas and a ball store. Everything past the rules is an assumption.

export const metadata: Metadata = {
  title: "Volleyball · Farm",
  description: "A full-size volleyball court on the lawn, with benches in the shade, at the Digital Farm near Kigali.",
}

const D = "/designs/volleyball"

export default function VolleyballPage() {
  return (
    <main className="w-full flex-1">
      {/* First screen: a STAND-IN until the founder's Nano Banana remaster. For now it is the design model rendered
          from eye level on the lawn in late-afternoon sun (scripts/site/render/volleyball.html?mode=real&hero=1,
          2400 x 1340), the master plan's boundary trees behind. The net sits right, so the words keep the open
          grass bottom-left. */}
      <PageHero src={`${D}/render/volleyball-hero.jpg`} width={2400} height={1340} className="bg-[#bbc0b9]" imgClassName="object-[70%_60%]"
        title="Volleyball on the lawn until sunset"
        alt="A volleyball court on a lawn mown in stripes, in low late-afternoon sun: white lines on the grass, a black net with white bands between two padded posts, red and white antennae, a white ball on the grass by the net, timber benches under two thatched umbrellas and a timber chest beyond it, and a row of trees behind." />

      {/* 2D, full screen: the court's plan (src/components/volleyball/volleyball-plan.tsx), in the text colour. */}
      <DrawingSection id="plans" title="2D">
        <VolleyballPlan title="Plan: a court 18 by 9 m inside a 3 m free zone, 24 by 15 m in all, its lines 50 mm wide inside the court; the centre line under the net, an attack line 3 m each side of it marking the front zones, and the service zones behind the end lines; the net's posts 1 m outside the side lines with an antenna over each side line, a ball by the net; beyond the far free zone two benches under thatched umbrellas and a ball store."
          className="h-auto w-full lg:h-full lg:w-auto" />
      </DrawingSection>

      {/* 3D, in the 2D section's pattern: a line drawing of the court seen from the open lawn, then the same view
          rendered. Both from scripts/site/render/volleyball.html. */}
      <ModelSection line={`${D}/render/volleyball-line.png`} real={`${D}/render/volleyball-real.webp`} width={2400} height={1100}
        lineAlt="Line drawing of the court from the open lawn: the free zone's edge, the side and end lines, the centre line and the two attack lines, the net's cords between its two posts with an antenna over each side line, a ball by the net, and beyond the far free zone two benches under thatched umbrellas and the ball store."
        realAlt="The same view rendered: grass mown short in light and dark stripes inside the longer lawn, white tape lines, a black net with white bands on dark green padded posts, red and white antennae, a white ball on the grass, timber benches and a timber chest, and two thatched umbrellas casting their shadows." />
    </main>
  )
}
