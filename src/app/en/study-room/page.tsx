import type { Metadata } from "next"
import Link from "next/link"

import { Button } from "@/components/ui/button"
import { StudyRoomPlan } from "@/components/study-room/study-room-plan"

// The study room, as /en/camp is one camp: a full-screen hero, then the 2D and the 3D. Both drawings read
// src/components/study-room/study-room.json: the compound's teal 40 ft container on a stone plinth, glazed
// doors behind timber louvres onto a 2 m deck, furnished with six desks for twelve, a screen wall, a bookshelf
// wall and a reading corner. The hero is a stand-in until the Nano Banana remaster.

export const metadata: Metadata = {
  title: "The study room · Farm",
  description: "A quiet room for twelve to study, work or teach, glazed onto a deck by the lake, at the Digital Farm near Kigali.",
}

const D = "/designs/study-room"

export default function StudyRoomPage() {
  return (
    <main className="w-full flex-1">
      {/* First screen: a STAND-IN until the Nano Banana remaster (brief and references in the founder's
          study-room-nano-banana folder). It is today's footage still of the courtyard lawn (IMG_3171, via
          assets/today/aerial.png) with the lake through the trees on the left, where the study room will
          stand, cut to 2400 x 1340. The buildings sit right, so the words keep the open lawn bottom-left. */}
      <section className="relative h-svh min-h-[520px] w-full overflow-hidden bg-[#c9d3dc]">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={`${D}/render/study-room-hero.jpg`} width={2400} height={1340} fetchPriority="high"
          alt="The farm's courtyard lawn today under a soft overcast sky: pop-up tents on the grass, a yellow container with red doors on the right, trees and the lake glinting behind them on the left."
          className="absolute inset-0 size-full object-cover object-[60%_50%]" />
        <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/70 via-black/35 to-transparent">
          <div className="w-full px-4 pt-24 pb-10 md:px-10 md:pb-14">
            <p className="text-sm text-white/80">Digital Farm</p>
            <h1 className="mt-3 max-w-2xl text-4xl font-semibold tracking-tight text-balance text-white md:text-6xl">
              A quiet room to learn, with the lake outside
            </h1>
            <Button asChild className="mt-6">
              <Link href="/#enquire">Book it now</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* 2D, full screen: the study room's plan (src/components/study-room/study-room-plan.tsx), in the text
          colour. It is long, so it takes the full width. */}
      <section id="plans">
        <div className="flex flex-col px-4 pt-10 pb-6 md:px-10 lg:h-svh lg:min-h-[560px]">
          <h2 className="text-3xl font-semibold tracking-tight">2D</h2>
          <div className="mt-6 flex min-h-0 flex-1 items-center justify-center">
            <StudyRoomPlan title="Plan: a 40 ft container 12.2 m long and 2.4 m wide, glazed doors behind timber louvres along its front onto a 2 m deck with a broad step; inside, a screen wall at the left end with a cabinet, a whiteboard and a lectern, six desks against the back wall with two chairs each facing the screen, then a reading corner with two armchairs, a side table, a lamp and a rug, and a bookshelf wall across the right end."
              className="h-auto w-full lg:h-full lg:w-auto lg:max-w-full" />
          </div>
        </div>
      </section>

      {/* 3D, in the 2D section's pattern: a line drawing of the study room seen from the deck with its front
          wall off, then the same view rendered. Both from scripts/site/render/study-room.html. */}
      <section id="model">
        <div className="flex flex-col px-4 pt-10 pb-6 md:px-10 lg:h-svh lg:min-h-[560px]">
          <h2 className="text-3xl font-semibold tracking-tight">3D</h2>
          <div className="mt-6 flex min-h-0 flex-1 items-center justify-center">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={`${D}/render/study-room-line.png`} width={2400} height={1000}
              alt="Line drawing of the study room from the deck with the front wall off: a screen on a slatted panel at the left end, a whiteboard, six desks with two chairs each, pendant lights in a row, an air conditioner on the back wall, two armchairs on a rug by a floor lamp, and a full-height bookshelf at the right end, the wide deck and its step in front."
              className="w-full object-contain lg:max-h-full dark:invert" />
          </div>
        </div>
        <figure className="px-4 pb-10 md:px-10">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={`${D}/render/study-room-real.webp`} width={2400} height={1000} loading="lazy"
            alt="The same view rendered: a teal container with an oak plank floor and off-white walls, oak desks and chairs with oat seat pads and a few laptops, rattan pendants, a black screen on oak slats, ochre armchairs on a striped rug, shelves full of books, green plants, and a honey-coloured eucalyptus deck on the lawn."
            className="h-auto w-full" />
          <figcaption className="text-muted-foreground mt-2 text-sm">Rendered from the design model</figcaption>
        </figure>
      </section>
    </main>
  )
}
