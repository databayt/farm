import type { Metadata } from "next"

import { DrawingSection, ModelSection, PageHero } from "@/components/page/sections"
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
      <PageHero src={`${D}/render/bar-hero.jpg`} width={2400} height={1340} className="bg-[#e3d6c4]" imgClassName="object-[70%_60%]"
        title="Coffee, fresh juice and a stool at the hatch"
        alt="The bar: an oxide-red shipping container on a stone plinth, its long hatch open under a flap propped on two black struts, a timber counter with five high stools on a timber deck, shelves and a warm light inside." />

      {/* 2D, full screen: the bar's plan (src/components/bar/bar-plan.tsx), in the text colour. */}
      <DrawingSection id="plans" title="2D">
        <BarPlan title="Plan: a 20 ft container 6,058 by 2,438 mm on a stone plinth, a 2,600 mm hatch in the courtyard wall with the flap propped out over a timber counter and five stools on a deck; inside, a work counter under the hatch with a cupboard, two fridges, a sink and drawers, a back bar with the coffee machine, the juicer and fruit crates under three shelves, a tall store cupboard, and the cargo doors at the north end as the way in."
          className="h-auto w-full lg:h-full lg:w-auto" />
      </DrawingSection>

      {/* 3D, in the 2D section's pattern: a line drawing of the bar seen from the courtyard with its roof off,
          then the same view rendered. Both from scripts/site/render/bar.html. */}
      <ModelSection line={`${D}/render/bar-line.png`} real={`${D}/render/bar-real.webp`} width={2400} height={1100}
        lineAlt="Line drawing of the bar from the courtyard with the roof off: the container on its plinth, the flap propped open over the hatch, the counter and five stools on the deck, and inside the back bar with the coffee machine, the juicer, fruit crates and three shelves of cups, jars and bottles."
        realAlt="The same view rendered: oxide-red corrugated steel, a warm light under the flap, Medium Oak counters and shelves lit from beneath, a steel espresso machine, crates of passion fruit, pineapple and tree tomato, oak-seated stools on a timber deck on the lawn." />
    </main>
  )
}
