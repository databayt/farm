import type { Metadata } from "next"

import { DrawingSection, ModelSection, PageHero } from "@/components/page/sections"
import { LivestockPlan } from "@/components/livestock/livestock-plan"

// The livestock yard, as /en/bar is one bar: a full-screen hero, then the 2D and the 3D. Both drawings read
// src/components/livestock/livestock.json: the starting herd of 6 goats and 4 sheep (D-030) in a thatched pole
// shelter with a day yard for each species and a keeper's lane between them (D-037), the feed store, the tank and
// the compost bays that close the loop to the field. Every size is an assumption until the farm's vet checks it.

export const metadata: Metadata = {
  title: "The livestock · Farm",
  description: "Six goats and four sheep in a thatched pole shelter with their own yards, part of the farm’s loop from field to compost, at the Digital Farm near Kigali.",
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
        <LivestockPlan title="Plan: a thatched pole shelter 7,000 by 3,600 mm on a fieldstone plinth behind a palisade windbreak; from west to east a goat pen of 10.8 m² for 6 goats, a kidding pen, a sheep pen of 7.2 m² for 4 sheep and a lockable feed store, each pen with a slatted bamboo sleeping platform along the back, a hay rack and a mineral box; in front, a post-and-rail goat yard with climbing stones and a sheep yard with a shade tree, a keeper’s lane between them to the paddock gate, a trough in each yard; behind the store the tank, fodder baskets and three compost bays."
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
