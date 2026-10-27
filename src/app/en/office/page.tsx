import type { Metadata } from "next"
import Link from "next/link"

import { Button } from "@/components/ui/button"
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
          saffron container on its raised deck from the 2026-10-25 footage (public/footage/IMG_3165), cut to
          2400 x 1340. The container sits centre-right, so the words keep the lawn bottom-left. */}
      <section className="relative h-svh min-h-[520px] w-full overflow-hidden bg-[#c9d3dc]">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={`${D}/render/office-hero.jpg`} width={2400} height={1340} fetchPriority="high"
          alt="A saffron shipping container raised on a red steel frame, its white-framed glazed doors open onto a timber deck with red pipe railings, on a green lawn with young trees behind under a cloudy sky."
          className="absolute inset-0 size-full object-cover object-[60%_50%]" />
        <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/70 via-black/35 to-transparent">
          <div className="w-full px-4 pt-24 pb-10 md:px-10 md:pb-14">
            <p className="text-sm text-white/80">Digital Farm</p>
            <h1 className="mt-3 max-w-2xl text-4xl font-semibold tracking-tight text-balance text-white md:text-6xl">
              An office on the deck, by the courtyard
            </h1>
            <Button asChild className="mt-6">
              <Link href="/#enquire">Get in touch</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* 2D, full screen: the office's plan (src/components/office/office-plan.tsx), in the text colour. */}
      <section id="plans">
        <div className="flex flex-col px-4 pt-10 pb-6 md:px-10 lg:h-svh lg:min-h-[560px]">
          <h2 className="text-3xl font-semibold tracking-tight">2D</h2>
          <div className="mt-6 flex min-h-0 flex-1 items-center justify-center">
            <OfficePlan title="Plan: a 20 ft container 6,058 by 2,438 mm with a 1,500 mm deck in front and a stair off its corner; inside, a round meeting table for four under a wall screen at the cargo-door end, the reception desk facing the 3 m sliding glazing with a filing wall behind, and a second desk and a printer cabinet at the far end."
              className="h-auto w-full lg:h-full lg:w-auto" />
          </div>
        </div>
      </section>

      {/* 3D, in the 2D section's pattern: a line drawing of the office seen from the front with its front wall
          and roof off, then the same view rendered. Both from scripts/site/render/office.html. */}
      <section id="model">
        <div className="flex flex-col px-4 pt-10 pb-6 md:px-10 lg:h-svh lg:min-h-[560px]">
          <h2 className="text-3xl font-semibold tracking-tight">3D</h2>
          <div className="mt-6 flex min-h-0 flex-1 items-center justify-center">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={`${D}/render/office-line.png`} width={2400} height={1100}
              alt="Line drawing of the office from the front with the front wall off: the container raised on its frame, the deck with railings and the stair, a round table with four chairs, a split AC, the filing wall, the reception desk with a monitor and chair, and a second desk, printer and wall fan at the far end."
              className="w-full object-contain lg:max-h-full dark:invert" />
          </div>
        </div>
        <figure className="px-4 pb-10 md:px-10">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={`${D}/render/office-real.webp`} width={2400} height={1100} loading="lazy"
            alt="The same view rendered: saffron corrugated steel, off-white walls and an oak floor, Medium Oak desks, shelves and meeting chairs, black mesh office chairs, coloured box files, a tall plant, on red steel posts with a eucalyptus deck and red railings over the lawn."
            className="h-auto w-full" />
          <figcaption className="text-muted-foreground mt-2 text-sm">Rendered from the design model</figcaption>
        </figure>
      </section>
    </main>
  )
}
