import type { Metadata } from "next"
import Link from "next/link"

import { BlurImg } from "@/components/atom/blur-img"
import { Button } from "@/components/ui/button"
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
      <section className="relative h-svh min-h-[520px] w-full overflow-hidden bg-[#bbc0b9]">
        <BlurImg src={`${D}/render/volleyball-hero.jpg`} width={2400} height={1340} fetchPriority="high"
          alt="A volleyball court on a lawn mown in stripes, in low late-afternoon sun: white lines on the grass, a black net with white bands between two padded posts, red and white antennae, a white ball on the grass by the net, timber benches under two thatched umbrellas and a timber chest beyond it, and a row of trees behind."
          className="absolute inset-0 size-full object-cover object-[70%_60%]" />
        <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/70 via-black/35 to-transparent">
          <div className="w-full px-4 pt-24 pb-10 md:px-10 md:pb-14">
            <p className="text-sm text-white/80">Digital Farm</p>
            <h1 className="mt-3 max-w-2xl text-4xl font-semibold tracking-tight text-balance text-white md:text-6xl">
              Volleyball on the lawn until sunset
            </h1>
            <Button asChild className="mt-6">
              <Link href="/#enquire">Book it now</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* 2D, full screen: the court's plan (src/components/volleyball/volleyball-plan.tsx), in the text colour. */}
      <section id="plans">
        <div className="flex flex-col px-4 pt-10 pb-6 md:px-10 lg:h-svh lg:min-h-[560px]">
          <h2 className="text-3xl font-semibold tracking-tight">2D</h2>
          <div className="mt-6 flex min-h-0 flex-1 items-center justify-center">
            <VolleyballPlan title="Plan: a court 18 by 9 m inside a 3 m free zone, 24 by 15 m in all, its lines 50 mm wide inside the court; the centre line under the net, an attack line 3 m each side of it marking the front zones, and the service zones behind the end lines; the net's posts 1 m outside the side lines with an antenna over each side line, a ball by the net; beyond the far free zone two benches under thatched umbrellas and a ball store."
              className="h-auto w-full lg:h-full lg:w-auto" />
          </div>
        </div>
      </section>

      {/* 3D, in the 2D section's pattern: a line drawing of the court seen from the open lawn, then the same view
          rendered. Both from scripts/site/render/volleyball.html. */}
      <section id="model">
        <div className="flex flex-col px-4 pt-10 pb-6 md:px-10 lg:h-svh lg:min-h-[560px]">
          <h2 className="text-3xl font-semibold tracking-tight">3D</h2>
          <div className="mt-6 flex min-h-0 flex-1 items-center justify-center">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={`${D}/render/volleyball-line.png`} width={2400} height={1100}
              alt="Line drawing of the court from the open lawn: the free zone's edge, the side and end lines, the centre line and the two attack lines, the net's cords between its two posts with an antenna over each side line, a ball by the net, and beyond the far free zone two benches under thatched umbrellas and the ball store."
              className="w-full object-contain lg:max-h-full dark:invert" />
          </div>
        </div>
        <figure className="px-4 pb-10 md:px-10">
          <div className="overflow-hidden">
            <BlurImg src={`${D}/render/volleyball-real.webp`} width={2400} height={1100} loading="lazy"
              alt="The same view rendered: grass mown short in light and dark stripes inside the longer lawn, white tape lines, a black net with white bands on dark green padded posts, red and white antennae, a white ball on the grass, timber benches and a timber chest, and two thatched umbrellas casting their shadows."
              className="h-auto w-full" />
          </div>
          <figcaption className="text-muted-foreground mt-2 text-sm">Rendered from the design model</figcaption>
        </figure>
      </section>
    </main>
  )
}
