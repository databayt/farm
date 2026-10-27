import type { Metadata } from "next"
import Link from "next/link"

import { Button } from "@/components/ui/button"
import { CompoundPlan } from "@/components/home/compound-plan"

// The camping lawn, in the studio page's pattern (/en/studio): a full-screen hero, then the 2D and the 3D.
// Both drawings come from the homepage's compound (src/components/home/compound.json, D-022), cropped to the
// six tents, the fire pit with its stools and the long table.

export const metadata: Metadata = {
  title: "The camp · Farm",
  description: "Six pop-up tents on the lawn round a stone fire pit, by the lake, at the Digital Farm near Kigali.",
}

const D = "/designs/camp"

export default function CampPage() {
  return (
    <main className="w-full flex-1">
      {/* First screen: the camping lawn today (public/footage/IMG_3172, 2026-10-25) until the Nano Banana render
          from the same photo replaces camp-hero.jpg: same name, no code change. */}
      <section className="relative h-svh min-h-[520px] w-full overflow-hidden bg-[#c9d3dc]">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={`${D}/render/camp-hero.jpg`} width={2400} height={1800} fetchPriority="high"
          alt="Six hexagonal pop-up tents in off-white canvas, one with a green fly, on a green lawn by a stone fire pit with a concrete cap, a yellow container guest building with red doors on the right, and trees with the lake behind."
          className="absolute inset-0 size-full object-cover object-[50%_60%]" />
        <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/70 via-black/35 to-transparent">
          <div className="w-full px-4 pt-24 pb-10 md:px-10 md:pb-14">
            <p className="text-sm text-white/80">Digital Farm</p>
            <h1 className="mt-3 max-w-2xl text-4xl font-semibold tracking-tight text-balance text-white md:text-6xl">
              Camp by the fire, under the stars
            </h1>
            <Button asChild className="mt-6">
              <Link href="/#enquire">Book it now</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* 2D, full screen: the homepage's compound plan cropped to the camp (inherits the text colour, so it
          follows dark mode by itself). */}
      <section id="plans">
        <div className="flex flex-col px-4 pt-10 pb-6 md:px-10 lg:h-svh lg:min-h-[560px]">
          <h2 className="text-3xl font-semibold tracking-tight">2D</h2>
          <div className="mt-6 flex min-h-0 flex-1 items-center justify-center">
            <CompoundPlan view="camp" title="Plan: six hexagonal tents on the lawn, the round fire pit with eight stools round it, and the long table with two benches beyond."
              className="h-auto w-full lg:h-full lg:w-auto" />
          </div>
        </div>
      </section>

      {/* 3D, in the 2D section's pattern: a line drawing of the camp seen from the gates' side, then the same
          view rendered. Both from scripts/site/render/compound.html?part=camp. */}
      <section id="model">
        <div className="flex flex-col px-4 pt-10 pb-6 md:px-10 lg:h-svh lg:min-h-[560px]">
          <h2 className="text-3xl font-semibold tracking-tight">3D</h2>
          <div className="mt-6 flex min-h-0 flex-1 items-center justify-center">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={`${D}/render/camp-line.png`} width={2400} height={1260}
              alt="Line drawing of the camp: six hexagonal tents, the fire pit ringed by eight log stools, and the long table with its benches beyond."
              className="w-full object-contain lg:max-h-full dark:invert" />
          </div>
        </div>
        <figure className="px-4 pb-10 md:px-10">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={`${D}/render/camp-real.webp`} width={2400} height={1260} loading="lazy"
            alt="The same view rendered: off-white canvas tents with dark mesh windows, one under a green fly, on mown grass; a fieldstone fire pit with a concrete cap and eight log stools; a long timber table with two benches."
            className="h-auto w-full" />
          <figcaption className="text-muted-foreground mt-2 text-sm">Rendered from the design model</figcaption>
        </figure>
      </section>
    </main>
  )
}
