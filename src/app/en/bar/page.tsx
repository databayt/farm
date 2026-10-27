import type { Metadata } from "next"
import Link from "next/link"

import { BlurImg } from "@/components/atom/blur-img"
import { Button } from "@/components/ui/button"
import { BarPlan } from "@/components/bar/bar-plan"

// The bar, as /en/camp is one camp: a full-screen hero, then the 2D and the 3D. Both drawings read
// src/components/bar/bar.json: the red 20 ft container on its stone plinth, the long hatch open onto the
// courtyard under a propped flap, a timber counter with five stools on a deck, and inside a work counter with
// fridges and a sink, a back bar with the coffee machine and the juice station, a door at the north end.

export const metadata: Metadata = {
  title: "The bar · Farm",
  description: "Coffee, fresh juice and cold drinks from a red container bar on the courtyard, at the Digital Farm near Kigali.",
}

const D = "/designs/bar"

export default function BarPage() {
  return (
    <main className="w-full flex-1">
      {/* First screen: a STAND-IN until the founder's Nano Banana remaster (handoff in ~/Desktop/bar-nano-banana).
          For now it is the design model rendered from eye level on the lawn (scripts/site/render/bar.html
          ?mode=real&hero=1, 2400 x 1340). The bar sits right, so the words keep the open lawn bottom-left. */}
      <section className="relative h-svh min-h-[520px] w-full overflow-hidden bg-[#e3d6c4]">
        <BlurImg src={`${D}/render/bar-hero.jpg`} width={2400} height={1340} fetchPriority="high"
          alt="The bar: an oxide-red shipping container on a stone plinth, its long hatch open under a flap propped on two black struts, a timber counter with five high stools on a timber deck, shelves and a warm light inside."
          className="absolute inset-0 size-full object-cover object-[70%_60%]" />
        <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/70 via-black/35 to-transparent">
          <div className="w-full px-4 pt-24 pb-10 md:px-10 md:pb-14">
            <p className="text-sm text-white/80">Digital Farm</p>
            <h1 className="mt-3 max-w-2xl text-4xl font-semibold tracking-tight text-balance text-white md:text-6xl">
              Coffee, fresh juice and a stool at the hatch
            </h1>
            <Button asChild className="mt-6">
              <Link href="/#enquire">Book it now</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* 2D, full screen: the bar's plan (src/components/bar/bar-plan.tsx), in the text colour. */}
      <section id="plans">
        <div className="flex flex-col px-4 pt-10 pb-6 md:px-10 lg:h-svh lg:min-h-[560px]">
          <h2 className="text-3xl font-semibold tracking-tight">2D</h2>
          <div className="mt-6 flex min-h-0 flex-1 items-center justify-center">
            <BarPlan title="Plan: a 20 ft container 6,058 by 2,438 mm on a stone plinth, a 2,600 mm hatch in the courtyard wall with the flap propped out over a timber counter and five stools on a deck; inside, a work counter under the hatch with a cupboard, two fridges, a sink and drawers, a back bar with the coffee machine, the juicer and fruit crates under three shelves, a tall store cupboard, and the cargo doors at the north end as the way in."
              className="h-auto w-full lg:h-full lg:w-auto" />
          </div>
        </div>
      </section>

      {/* 3D, in the 2D section's pattern: a line drawing of the bar seen from the courtyard with its roof off,
          then the same view rendered. Both from scripts/site/render/bar.html. */}
      <section id="model">
        <div className="flex flex-col px-4 pt-10 pb-6 md:px-10 lg:h-svh lg:min-h-[560px]">
          <h2 className="text-3xl font-semibold tracking-tight">3D</h2>
          <div className="mt-6 flex min-h-0 flex-1 items-center justify-center">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={`${D}/render/bar-line.png`} width={2400} height={1100}
              alt="Line drawing of the bar from the courtyard with the roof off: the container on its plinth, the flap propped open over the hatch, the counter and five stools on the deck, and inside the back bar with the coffee machine, the juicer, fruit crates and three shelves of cups, jars and bottles."
              className="w-full object-contain lg:max-h-full dark:invert" />
          </div>
        </div>
        <figure className="px-4 pb-10 md:px-10">
          <div className="overflow-hidden">
            <BlurImg src={`${D}/render/bar-real.webp`} width={2400} height={1100} loading="lazy"
              alt="The same view rendered: oxide-red corrugated steel, a warm light under the flap, Medium Oak counters and shelves lit from beneath, a steel espresso machine, crates of passion fruit, pineapple and tree tomato, oak-seated stools on a timber deck on the lawn."
              className="h-auto w-full" />
          </div>
          <figcaption className="text-muted-foreground mt-2 text-sm">Rendered from the design model</figcaption>
        </figure>
      </section>
    </main>
  )
}
