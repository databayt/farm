import type { Metadata } from "next"
import Link from "next/link"

import { BlurImg } from "@/components/atom/blur-img"
import { Button } from "@/components/ui/button"
import { GalleyPlan } from "@/components/galley/galley-plan"

// The galley, as /en/office is one office: a full-screen hero, then the 2D and the 3D. Both drawings read
// src/components/galley/galley.json: the teal 40 ft container on its stone plinth beside the study room, two doors
// and two windows on the courtyard side, fitted as the staff kitchen that cooks breakfast and dinner for a full
// house (D-028, D-031): the founder's long worktop with two sinks under the windows, the stores by the staff door,
// a cooking line under an extract hood, and the pass by the service door.

export const metadata: Metadata = {
  title: "The galley · Farm",
  description: "The farm's staff kitchen: a teal container with a long worktop and two sinks, cooking breakfast and dinner from the field for the guests, at the Digital Farm near Kigali.",
}

const D = "/designs/galley"

export default function GalleyPage() {
  return (
    <main className="w-full flex-1">
      {/* First screen: a STAND-IN until the founder's Nano Banana remaster. For now it is the design model rendered
          from eye level in the courtyard (scripts/site/render/galley.html?mode=real&hero=1, 2400 x 1340), in
          daylight. The galley sits right, so the words keep the open lawn bottom-left. */}
      <section className="relative h-svh min-h-[520px] w-full overflow-hidden bg-[#c4d3dc]">
        <BlurImg src={`${D}/render/galley-hero.jpg`} width={2400} height={1340} fetchPriority="high"
          alt="A long teal shipping container on a fieldstone plinth on a green lawn under a blue sky: two red doors with glazed panels near its ends, each up two stone steps, two white-framed windows between them with steel taps and shelves inside, and a steel extract fan on the roof."
          className="absolute inset-0 size-full object-cover object-[68%_55%]" />
        <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/70 via-black/35 to-transparent">
          <div className="w-full px-4 pt-24 pb-10 md:px-10 md:pb-14">
            <p className="text-sm text-white/80">Digital Farm</p>
            <h1 className="mt-3 max-w-2xl text-4xl font-semibold tracking-tight text-balance text-white md:text-6xl">
              Breakfast and dinner, cooked from the field
            </h1>
            <Button asChild className="mt-6">
              <Link href="/#enquire">Book it now</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* 2D, full screen: the galley's plan (src/components/galley/galley-plan.tsx), in the text colour. It is
          long, so it takes the full width. */}
      <section id="plans">
        <div className="flex flex-col px-4 pt-10 pb-6 md:px-10 lg:h-svh lg:min-h-[560px]">
          <h2 className="text-3xl font-semibold tracking-tight">2D</h2>
          <div className="mt-6 flex min-h-0 flex-1 items-center justify-center">
            <GalleyPlan title="Plan: a 40 ft container 12,192 by 2,438 mm on a stone plinth, a door near each end of its front up two stone steps and two windows between them; inside, a hand-wash basin and apron hooks by the staff door at the left end, then the 7,800 mm stainless worktop under the windows with the harvest bench, the prep sink, the prep bench, the wash-up sink and the dish drop by the service door; along the back wall an upright freezer and a two-door fridge, the dry store's shelving, the range, griddle and fryer under the extract hood with a 900 mm aisle in front of them, a cold bench, the pass with its gantry and a cleaning cupboard; two bins and a plate cupboard at the right end."
              className="h-auto w-full lg:h-full lg:w-auto lg:max-w-full" />
          </div>
        </div>
      </section>

      {/* 3D, in the 2D section's pattern: a line drawing of the galley seen from the courtyard with its front wall
          and roof off, then the same view rendered. Both from scripts/site/render/galley.html. */}
      <section id="model">
        <div className="flex flex-col px-4 pt-10 pb-6 md:px-10 lg:h-svh lg:min-h-[560px]">
          <h2 className="text-3xl font-semibold tracking-tight">3D</h2>
          <div className="mt-6 flex min-h-0 flex-1 items-center justify-center">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={`${D}/render/galley-line.png`} width={2400} height={1000}
              alt="Line drawing of the galley from the courtyard with the front wall and roof off: the stone plinth with the steps at its two doors, the long worktop on steel legs along the front with its two sinks and taps, crates of vegetables, chopping boards, pots on the undershelf and racks of plates, and along the back wall an upright freezer and a two-door fridge, shelves of sacks, tubs and jars, a range with pots, a griddle and a fryer under the hood and its duct, a cold bench, the pass with heat lamps over plates, a tall cleaning cupboard, two bins and a fire blanket at the far end."
              className="w-full object-contain lg:max-h-full dark:invert" />
          </div>
        </div>
        <figure className="px-4 pb-10 md:px-10">
          <div className="overflow-hidden">
            <BlurImg src={`${D}/render/galley-real.webp`} width={2400} height={1000} loading="lazy"
              alt="The same view rendered: the teal container on a fieldstone plinth on the lawn, white walls and a grey resin floor, brushed steel worktops, fridges, shelving and hood, crates of greens, tomatoes and onions, a tray of eggs and a bowl of fruit on the cold bench, plated dinners under the glowing heat lamps, a white cleaning cupboard, green bins and a red fire blanket by the service door."
              className="h-auto w-full" />
          </div>
          <figcaption className="text-muted-foreground mt-2 text-sm">Rendered from the design model</figcaption>
        </figure>
      </section>
    </main>
  )
}
