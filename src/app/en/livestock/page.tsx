import type { Metadata } from "next"

import { DrawingSection, ModelSection, PageHero } from "@/components/page/sections"
import { LivestockPlan } from "@/components/livestock/livestock-plan"

// The livestock house, as /en/bar is one bar: a full-screen hero, then the 2D and the 3D. Both drawings read
// src/components/livestock/livestock.json: the starting herd of 6 goats and 4 sheep (D-030) in one raised house,
// the two species in their own pens, a kidding pen and a lockable feed store behind a feed passage, a ramp down to
// the paddock and a tank fed from the roof. Every size is an assumption until the farm's vet checks it.

export const metadata: Metadata = {
  title: "The livestock · Farm",
  description: "Six goats and four sheep in a raised timber house on the paddock, at the Digital Farm near Kigali.",
}

const D = "/designs/livestock"

export default function LivestockPage() {
  return (
    <main className="w-full flex-1">
      {/* First screen: a STAND-IN until the founder's Nano Banana remaster. For now it is the design model rendered
          from eye level in the paddock (scripts/site/render/livestock.html?mode=real&hero=1, 2400 x 1340), the herd
          out grazing in front. The house sits right, so the words keep the open grass bottom-left. */}
      <PageHero src={`${D}/render/livestock-hero.jpg`} width={2400} height={1340} className="bg-[#d9d4c6]" imgClassName="object-[60%_60%]"
        title="Goats and sheep on open pasture"
        alt="A raised timber animal house under a dark iron roof on posts over a concrete floor, a cleated ramp down to the grass, and in front of it six goats in brown, black and tan and four white sheep with black faces." />

      {/* 2D, full screen: the house's plan (src/components/livestock/livestock-plan.tsx), in the text colour. */}
      <DrawingSection id="plans" title="2D">
        <LivestockPlan title="Plan: a raised house 7,000 by 3,900 mm under an overhanging roof; from west to east a goat pen of 9 m² for 6 goats, a sheep pen of 6 m² for 4 sheep, a kidding pen of 3 m² and a lockable feed store, all on a slatted floor behind a 900 mm feed passage; each pen has a gate, a hay rack, a trough and a mineral box on its front fence; a cleated ramp runs down from the passage's west end and a tank stands at the back east corner."
          className="h-auto w-full lg:h-full lg:w-auto" />
      </DrawingSection>

      {/* 3D, in the 2D section's pattern: a line drawing of the house seen from the paddock with its roof off,
          then the same view rendered. Both from scripts/site/render/livestock.html. */}
      <ModelSection line={`${D}/render/livestock-line.png`} real={`${D}/render/livestock-real.webp`} width={2400} height={1100}
        lineAlt="Line drawing of the house from the paddock with the roof off: posts on concrete pads, the slatted floor, six goats in the west pen and four sheep in the next, the kidding pen, the feed store with its door, hay racks and gates on the front fence, the railed passage, the ramp and the tank."
        realAlt="The same view rendered on the grass: treated timber boards and posts, a slatted floor, brown, black and tan goats in one pen and white sheep with black faces in the other, hay racks full of hay, blue troughs, black steel gates, sacks in the feed store, a cleated ramp and a green water tank on a block stand." />
    </main>
  )
}
