import type { Metadata } from "next"
import Link from "next/link"

import { BlurImg } from "@/components/atom/blur-img"
import { Button } from "@/components/ui/button"
import { PublicBathroomPlan } from "@/components/public-bathroom/public-bathroom-plan"

// The public bathroom, as /en/office is the office: a full-screen hero, then the 2D and the 3D. Both drawings read
// src/components/public-bathroom/public-bathroom.json: the teal 20 ft container on its stone plinth beside the galley,
// one door and two high windows toward the courtyard (as the homepage draws it); inside, the founder's two toilet
// rooms, two hand basins and a urinal (D-022): the toilet rooms along the front, a passage behind them to the
// cleaner's cupboard, the basins in the lobby and the urinal in a room of its own. Every size inside is an assumption.

export const metadata: Metadata = {
  title: "The public bathroom · Farm",
  description: "Two toilet rooms, a urinal and two hand basins in a teal container by the courtyard, for the camp, the bar lounge and the fire pit, at the Digital Farm near Kigali.",
}

const D = "/designs/public-bathroom"

export default function PublicBathroomPage() {
  return (
    <main className="w-full flex-1">
      {/* First screen: a STAND-IN until the founder's Nano Banana remaster. For now it is the design model rendered
          from eye level in the courtyard (scripts/site/render/public-bathroom.html?mode=real&hero=1, 2400 x 1340),
          front wall and roof on. The bathroom sits right, so the words keep the open lawn bottom-left. */}
      <section className="relative h-svh min-h-[520px] w-full overflow-hidden bg-[#c9d6df]">
        <BlurImg src={`${D}/render/public-bathroom-hero.jpg`} width={2400} height={1340} fetchPriority="high"
          alt="A teal shipping container on a fieldstone plinth on a green lawn under a blue sky: two small white-framed windows of frosted glass and a red door with a frosted glass panel and a lamp above it, a concrete-capped stone landing and step in front of the door."
          className="absolute inset-0 size-full object-cover object-[62%_60%]" />
        <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/70 via-black/35 to-transparent">
          <div className="w-full px-4 pt-24 pb-10 md:px-10 md:pb-14">
            <p className="text-sm text-white/80">Digital Farm</p>
            <h1 className="mt-3 max-w-2xl text-4xl font-semibold tracking-tight text-balance text-white md:text-6xl">
              Toilets and hand basins for the camp
            </h1>
            <Button asChild className="mt-6">
              <Link href="/#enquire">Book it now</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* 2D, full screen: the bathroom's plan (src/components/public-bathroom/public-bathroom-plan.tsx), in the text
          colour. */}
      <section id="plans">
        <div className="flex flex-col px-4 pt-10 pb-6 md:px-10 lg:h-svh lg:min-h-[560px]">
          <h2 className="text-3xl font-semibold tracking-tight">2D</h2>
          <div className="mt-6 flex min-h-0 flex-1 items-center justify-center">
            <PublicBathroomPlan title="Plan: a 20 ft container 6,058 by 2,438 mm on a stone plinth, with a 1,500 mm landing and a step in front of its door; inside, two toilet rooms 1,350 by 1,200 mm along the front wall, each with a WC under its window, opening off a 900 mm passage behind them that ends at the cleaner's cupboard; the lobby inside the door with two basins on a counter against the back wall, paper towels and a bin past it and a floor drain; and the urinal in its own room at the east end."
              className="h-auto w-full lg:h-full lg:w-auto" />
          </div>
        </div>
      </section>

      {/* 3D, in the 2D section's pattern: a line drawing of the bathroom seen from the courtyard with its front wall
          and roof off, then the same view rendered. Both from scripts/site/render/public-bathroom.html. */}
      <section id="model">
        <div className="flex flex-col px-4 pt-10 pb-6 md:px-10 lg:h-svh lg:min-h-[560px]">
          <h2 className="text-3xl font-semibold tracking-tight">3D</h2>
          <div className="mt-6 flex min-h-0 flex-1 items-center justify-center">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={`${D}/render/public-bathroom-line.png`} width={2400} height={1100}
              alt="Line drawing of the bathroom from the courtyard with its front wall and roof off: the container on its plinth, the landing and the step; two toilet rooms, each with a WC and a roll holder, their back wall cut low to show the passage behind and the tall cleaner's cupboard at its end; the lobby with two bowls on a counter under a long mirror, a soap dispenser, paper towels over a bin and a floor drain; and the urinal with its flush valve and an extract fan in the end room."
              className="w-full object-contain lg:max-h-full dark:invert" />
          </div>
        </div>
        <figure className="px-4 pb-10 md:px-10">
          <div className="overflow-hidden">
            <BlurImg src={`${D}/render/public-bathroom-real.webp`} width={2400} height={1100} loading="lazy"
              alt="The same view rendered: teal corrugated steel on a fieldstone plinth, white wall tiles under off-white paint, warm grey floor tiles, white WCs, a white urinal and two white bowls, chrome taps, a Medium Oak counter and cleaner's cupboard, a long mirror, and a concrete-capped landing and step on the lawn."
              className="h-auto w-full" />
          </div>
          <figcaption className="text-muted-foreground mt-2 text-sm">Rendered from the design model</figcaption>
        </figure>
      </section>
    </main>
  )
}
