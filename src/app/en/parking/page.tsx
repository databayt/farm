import type { Metadata } from "next"
import Link from "next/link"

import { BlurImg } from "@/components/atom/blur-img"
import { Button } from "@/components/ui/button"
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
      <section className="relative h-svh min-h-[520px] w-full overflow-hidden bg-[#cfdbe4]">
        <BlurImg src={`${D}/render/parking-hero.jpg`} width={2400} height={1340} fetchPriority="high"
          alt="A fieldstone wall under a timber cap with DIGITAL FARM in warm-white LED capitals on a dark steel panel, beside two fieldstone pillars, one with a lantern, and a timber gate braced in an X standing open on a drive of grey stone setts; through it a lawn of grass pavers and a road of setts to a second gate, shade trees over the wall and a line of tall trees in the haze, a green hedge along the boundary and a red dirt road in front."
          className="absolute inset-0 size-full object-cover object-[43%_55%]" />
        <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/70 via-black/35 to-transparent">
          <div className="w-full px-4 pt-24 pb-10 md:px-10 md:pb-14">
            <p className="text-sm text-white/80">Digital Farm</p>
            <h1 className="mt-3 max-w-2xl text-4xl font-semibold tracking-tight text-balance text-white md:text-6xl">
              Parking on grass, just inside the gate
            </h1>
            <Button asChild className="mt-6">
              <Link href="/#enquire">Book it now</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* 2D, full screen: the way in's plan (src/components/parking/parking-plan.tsx), in the text colour. */}
      <section id="plans">
        <div className="flex flex-col px-4 pt-10 pb-6 md:px-10 lg:h-svh lg:min-h-[560px]">
          <h2 className="text-3xl font-semibold tracking-tight">2D</h2>
          <div className="mt-6 flex min-h-0 flex-1 items-center justify-center">
            <ParkingPlan title="Plan: a parking lawn of grass pavers 22,000 by 6,000 mm in a fieldstone edging; along its west end five bays of 2,600 mm, sett strips 4,000 mm long between them and a log wheel stop in each, cars in bays 1 and 3; 3,400 mm behind the strips the 7,600 mm sign wall, lettered DIGITAL FARM on its road face, and beside it the 4,400 mm gate, its leaves opening inward; a hedge along the boundary, a turn of setts from the public road through the gate, four shade trees, and the rock road, 4,000 mm wide, leaving the far edge for the inner gate."
              className="h-auto w-full lg:h-full lg:w-auto" />
          </div>
        </div>
      </section>

      {/* 3D, in the 2D section's pattern: a line drawing of the way in seen from beyond the public road, the gate shut,
          then the same view rendered. Both from scripts/site/render/parking.html. */}
      <section id="model">
        <div className="flex flex-col px-4 pt-10 pb-6 md:px-10 lg:h-svh lg:min-h-[560px]">
          <h2 className="text-3xl font-semibold tracking-tight">3D</h2>
          <div className="mt-6 flex min-h-0 flex-1 items-center justify-center">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={`${D}/render/parking-line.png`} width={2400} height={1100}
              alt="Line drawing of the way in from beyond the public road: the hedge along the boundary, the sign wall lettered DIGITAL FARM, the gate shut between its pillars, the turn of setts, the parking with its five bays, strips and wheel stops, two cars in their bays, four shade trees and the start of the rock road."
              className="w-full object-contain lg:max-h-full dark:invert" />
          </div>
        </div>
        <figure className="px-4 pb-10 md:px-10">
          <div className="overflow-hidden">
            <BlurImg src={`${D}/render/parking-real.webp`} width={2400} height={1100} loading="lazy"
              alt="The same view rendered in daylight: a red dirt road, a clipped green hedge, a fieldstone sign wall with DIGITAL FARM glowing in warm-white LED letters on dark steel, a timber gate braced in an X between fieldstone pillars, grey granite setts, a lawn of grass pavers in a fieldstone edging with sett strips and eucalyptus wheel stops, a white four-by-four and a silver hatchback, and young shade trees casting shadows on the grass."
              className="h-auto w-full" />
          </div>
          <figcaption className="text-muted-foreground mt-2 text-sm">Rendered from the design model</figcaption>
        </figure>
      </section>
    </main>
  )
}
