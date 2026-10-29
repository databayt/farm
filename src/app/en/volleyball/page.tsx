import type { Metadata } from "next"

import { DrawingSection, ModelSection, PageHero } from "@/components/page/sections"
import { TennisPlan } from "@/components/tennis/tennis-plan"
import { CourtSwitch } from "@/components/volleyball/court-switch"
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
    </main>
  )
}
