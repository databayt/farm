import type { Metadata } from "next"

import { DrawingSection, ModelSection, PageHero } from "@/components/page/sections"
import { GuestRoomPlan } from "@/components/guest-room/guest-room-plan"

// One guest room, as /en/camp is one camp: a full-screen hero, then the 2D and the 3D. Both drawings read
// src/components/guest-room/guest-room.json: a third of the saffron container block from the footage, a
// barred window and a red door onto the timber veranda, a double bed under the back window, a wardrobe, a
// desk under the front window, two chairs and a table outside.

export const metadata: Metadata = {
  title: "The guest room · Farm",
  description: "A room for two in the container block, with a double bed, its own shower and WC, and a timber veranda with lake views, at the Digital Farm near Kigali.",
}

const D = "/designs/guest-room"

export default function GuestRoomPage() {
  return (
    <main className="w-full flex-1">
      {/* First screen: a STAND-IN until the Nano Banana remaster (handoff in ~/Desktop/guest-room-nano-banana).
          It is the guest-room block as it stands today, cut from the 2026-10-25 footage (assets/library/footage/2026-10-25/IMG_3171,
          people- and umbrella-free) to 2400 x 1340. The block sits right, so the words keep the open lawn
          bottom-left. */}
      <PageHero src={`${D}/render/guest-room-hero.jpg`} width={2400} height={1340} className="bg-[#c9d3dc]" imgClassName="object-[65%_60%]"
        title="A quiet room, with the veranda for mornings"
        alt="The guest-room block today: two saffron-yellow shipping containers joined into one long building, red-framed barred windows each beside a red door, on a green lawn with a pop-up tent to the left, trees and a cloudy sky behind." />

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
    </main>
  )
}
