import type { Metadata } from "next"

import { DrawingSection, ModelSection, PageHero } from "@/components/page/sections"
import { ParkingPlan } from "@/components/parking/parking-plan"

// The way in, as /en/camp is one camp: a full-screen hero, then the 2D and the 3D. Both drawings read
// src/components/parking/parking.json, in compound.json's true metres: the outer gate off the public road, the sign
// wall lettered DIGITAL FARM, the green parking with its five bays under shade trees, and the start of the rock
// road to the inner gate. What the plan leaves open (a full house, a minibus's turn, reversing out) is in the json.

export const metadata: Metadata = {
  title: "Parking · Farm",
  description: "Five bays on grass pavers under shade trees, just inside the gate and the DIGITAL FARM sign wall, at the Digital Farm near Kigali.",
}

const D = "/designs/parking"

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
    </main>
  )
}
