import type { Metadata } from "next"
import Link from "next/link"

import { BlurImg } from "@/components/atom/blur-img"
import { Button } from "@/components/ui/button"
import { GuestRoomPlan } from "@/components/guest-room/guest-room-plan"

// One guest room, as /en/camp is one camp: a full-screen hero, then the 2D and the 3D. Both drawings read
// src/components/guest-room/guest-room.json: a third of the saffron container block from the footage, a
// barred window and a red door onto the timber veranda, a double bed under the back window, a wardrobe, a
// desk under the front window, two chairs and a table outside.

export const metadata: Metadata = {
  title: "The guest room · Farm",
  description: "A room for two in the saffron container block, a double bed and a timber veranda by the lake, at the Digital Farm near Kigali.",
}

const D = "/designs/guest-room"

export default function GuestRoomPage() {
  return (
    <main className="w-full flex-1">
      {/* First screen: a STAND-IN until the Nano Banana remaster (handoff in ~/Desktop/guest-room-nano-banana).
          It is the guest-room block as it stands today, cut from the 2026-10-25 footage (public/footage/IMG_3171,
          people- and umbrella-free) to 2400 x 1340. The block sits right, so the words keep the open lawn
          bottom-left. */}
      <section className="relative h-svh min-h-[520px] w-full overflow-hidden bg-[#c9d3dc]">
        <BlurImg src={`${D}/render/guest-room-hero.jpg`} width={2400} height={1340} fetchPriority="high"
          alt="The guest-room block today: two saffron-yellow shipping containers joined into one long building, red-framed barred windows each beside a red door, on a green lawn with a pop-up tent to the left, trees and a cloudy sky behind."
          className="absolute inset-0 size-full object-cover object-[65%_60%]" />
        <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/70 via-black/35 to-transparent">
          <div className="w-full px-4 pt-24 pb-10 md:px-10 md:pb-14">
            <p className="text-sm text-white/80">Digital Farm</p>
            <h1 className="mt-3 max-w-2xl text-4xl font-semibold tracking-tight text-balance text-white md:text-6xl">
              A quiet room, with the veranda for mornings
            </h1>
            <Button asChild className="mt-6">
              <Link href="/#enquire">Book it now</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* 2D, full screen: the room's plan (src/components/guest-room/guest-room-plan.tsx), in the text colour. */}
      <section id="plans">
        <div className="flex flex-col px-4 pt-10 pb-6 md:px-10 lg:h-svh lg:min-h-[560px]">
          <h2 className="text-3xl font-semibold tracking-tight">2D</h2>
          <div className="mt-6 flex min-h-0 flex-1 items-center justify-center">
            <GuestRoomPlan title="Plan: one guest room 4.06 m wide and 4.88 m deep, a third of the container block, with a 1.5 m veranda in front. A double bed against the back wall under a window, a bedside table each side and a bench at its foot on a rug; a wardrobe on the left wall; a desk and chair under the front window; the door on the front right opening in; coat hooks on the right wall; red steel posts at the joint across the middle; two chairs and a round table on the veranda."
              className="h-auto w-full lg:h-full lg:w-auto" />
          </div>
        </div>
      </section>

      {/* 3D, in the 2D section's pattern: a line drawing of the room seen from the front with its front wall
          and ceiling off, then the same view rendered. Both from scripts/site/render/guest-room.html. */}
      <section id="model">
        <div className="flex flex-col px-4 pt-10 pb-6 md:px-10 lg:h-svh lg:min-h-[560px]">
          <h2 className="text-3xl font-semibold tracking-tight">3D</h2>
          <div className="mt-6 flex min-h-0 flex-1 items-center justify-center">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={`${D}/render/guest-room-line.png`} width={2400} height={1800}
              alt="Line drawing of the guest room from the front with the front wall and ceiling off: the double bed with two pillows under the barred back window, bedside tables with lamps, a bench at the foot on a rug, the wardrobe on the left, the desk and chair by the front, the door open against the right, the joint's beam overhead, and two chairs and a table on the veranda with the step down."
              className="w-full object-contain lg:max-h-full dark:invert" />
          </div>
        </div>
        <figure className="px-4 pb-10 md:px-10">
          <div className="overflow-hidden">
            <BlurImg src={`${D}/render/guest-room-real.webp`} width={2400} height={1800} loading="lazy"
              alt="The same view rendered: cream walls, an oak plank floor and Medium Oak furniture, white bedding with a mustard throw on a striped rug, the red-framed barred window, red steel posts and beam, the red door open, and timber chairs and a table with a lantern on the veranda over the lawn."
              className="h-auto w-full" />
          </div>
          <figcaption className="text-muted-foreground mt-2 text-sm">Rendered from the design model</figcaption>
        </figure>
      </section>
    </main>
  )
}
