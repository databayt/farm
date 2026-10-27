import type { Metadata } from "next"
import Link from "next/link"

import { BlurImg } from "@/components/atom/blur-img"
import { Button } from "@/components/ui/button"
import { CampPlan } from "@/components/camp/camp-plan"

// One camp, as /en/studio is one studio: a full-screen hero, then the 2D and the 3D. Both drawings read
// src/components/camp/camp.json, after the hero (the Nano Banana render): the footage's hexagonal pop-up on the
// grass, its door rolled up, furnished as a floor lounge.

export const metadata: Metadata = {
  title: "The camp · Farm",
  description: "A tent for two on its own timber deck, by the lake and the fire pit, at the Digital Farm near Kigali.",
}

const D = "/designs/camp"

export default function CampPage() {
  return (
    <main className="w-full flex-1">
      {/* First screen: the founder's Nano Banana render of the camp (2026-10-27), made from the footage's tent
          (IMG_3172) and the 3D layout; master kept at assets/camp/hero-gemini.jpeg (2752 px), cut to 2400 x 1340.
          The tent sits right, so the words keep the open lawn bottom-left. */}
      <section className="relative h-svh min-h-[520px] w-full overflow-hidden bg-[#c9d3dc]">
        <BlurImg src={`${D}/render/camp-hero.jpg`} width={2400} height={1340} fetchPriority="high"
          alt="A hexagonal pop-up tent in off-white canvas with beige trim at golden hour, its door open on a low cushioned chair, floor cushions, a striped rug, a lantern and a tea tray, on a green lawn with more tents, trees and the lake behind."
          className="absolute inset-0 size-full object-cover object-[65%_60%]" />
        <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/70 via-black/35 to-transparent">
          <div className="w-full px-4 pt-24 pb-10 md:px-10 md:pb-14">
            <p className="text-sm text-white/80">Digital Farm</p>
            <h1 className="mt-3 max-w-2xl text-4xl font-semibold tracking-tight text-balance text-white md:text-6xl">
              A tent by the lake, with fire-pit nights
            </h1>
            <Button asChild className="mt-6">
              <Link href="/#enquire">Book it now</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* 2D, full screen: the camp's plan (src/components/camp/camp-plan.tsx), in the text colour. */}
      <section id="plans">
        <div className="flex flex-col px-4 pt-10 pb-6 md:px-10 lg:h-svh lg:min-h-[560px]">
          <h2 className="text-3xl font-semibold tracking-tight">2D</h2>
          <div className="mt-6 flex min-h-0 flex-1 items-center justify-center">
            <CampPlan title="Plan: a hexagonal tent 2.8 m across, its door rolled up; inside, a floor chair and a folded throw on the left, a futon with a cushion and two stacked cushions on the right, a striped rug in the middle with a tea board, and a lantern at the back."
              className="h-auto w-full lg:h-full lg:w-auto" />
          </div>
        </div>
      </section>

      {/* 3D, in the 2D section's pattern: a line drawing of the camp seen from the front with its front walls
          off, then the same view rendered. Both from scripts/site/render/camp.html. */}
      <section id="model">
        <div className="flex flex-col px-4 pt-10 pb-6 md:px-10 lg:h-svh lg:min-h-[560px]">
          <h2 className="text-3xl font-semibold tracking-tight">3D</h2>
          <div className="mt-6 flex min-h-0 flex-1 items-center justify-center">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={`${D}/render/camp-line.png`} width={2400} height={1100}
              alt="Line drawing of the camp from the front with the front walls off: the floor chair, the futon with its cushion, the stacked cushions, the throw, the tea board on the rug and the lantern at the back."
              className="w-full object-contain lg:max-h-full dark:invert" />
          </div>
        </div>
        <figure className="px-4 pb-10 md:px-10">
          <div className="overflow-hidden">
            <BlurImg src={`${D}/render/camp-real.webp`} width={2400} height={1100} loading="lazy"
              alt="The same view rendered in golden-hour light on the lawn: off-white canvas with beige trim and mesh windows, a tan floor chair, a white futon with a patterned cushion, a striped rug with a clay teapot and cups on a tea board, and a lit lantern."
              className="h-auto w-full" />
          </div>
          <figcaption className="text-muted-foreground mt-2 text-sm">Rendered from the design model</figcaption>
        </figure>
      </section>
    </main>
  )
}
