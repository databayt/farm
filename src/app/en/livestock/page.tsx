import type { Metadata } from "next"

import { DrawingSection, ModelSection, PageHero } from "@/components/page/sections"
import { LivestockPlan } from "@/components/livestock/livestock-plan"

// The livestock yard, as /en/bar is one bar: a full-screen hero, then the 2D and the 3D. Both drawings read
// src/components/livestock/livestock.json: the starting herd of 6 goats and 4 sheep (D-030) in a thatched pole
// shelter (D-037) opening onto one village yard they share by day with the farm friends, the ducks, the rabbits,
// the doves and the cats, and with the guests (D-038); the guard dogs' run, the feed store, the tank and the compost
// bays that close the loop to the field. Every size is an assumption until the farm's vet checks it.

export const metadata: Metadata = {
  title: "The livestock · Farm",
  description: "Goats, sheep, ducks, rabbits, doves and cats in one village yard by a thatched shelter, guard dogs on watch, part of the farm’s loop from field to compost, at the Digital Farm near Kigali.",
}

const D = "/designs/livestock"

export default function LivestockPage() {
  return (
    <main className="w-full flex-1">
      {/* First screen: a STAND-IN until the founder's Nano Banana remaster. For now it is the design model from eye
          level in the paddock (scripts/site/render/livestock.html?mode=real&hero=1, 2400 x 1340): the thatched shelter,
          the palisade, the village yard with the dovecote and the shade tree, which is also the remaster's layout reference. */}
      <PageHero src={`${D}/render/livestock-hero.jpg`} width={2400} height={1340} className="bg-[#d9d4c6]" imgClassName="object-[60%_60%]"
        title="Goats and sheep on open pasture"
        alt="A thatched shelter of upright eucalyptus poles behind a pole palisade, a village yard in front fenced with lashed round-pole rails, goats and sheep together on the straw, climbing stones, a dovecote on a pole with doves, and a shade tree in a pole guard, on open grass." />

      {/* 2D, full screen: the house's plan (src/components/livestock/livestock-plan.tsx), in the text colour. */}
      <DrawingSection id="plans" title="2D">
        <LivestockPlan title="Plan: a thatched pole shelter 7,000 by 3,600 mm on a fieldstone plinth behind a palisade windbreak; from west to east a goat pen, a kidding pen, a sheep pen and a lockable feed store, each pen with a slatted bamboo sleeping platform, a hay rack and its own mineral box; in front, one village yard 18,700 mm across for the herd, the farm friends and the guests, with troughs, climbing stones, a shade tree, a log bench, a dovecote and a cats’ house on posts, and in its west wing the ducks’ house and pond on a gravel apron and the rabbits’ hutch and fenced run; one gate to the paddock; behind the store the tank, fodder baskets, three compost bays and the guard dogs’ run with two kennels."
          className="h-auto w-full lg:h-full lg:w-auto" />
      </DrawingSection>

      {/* 3D, in the 2D section's pattern: the yard seen straight on from the paddock with the roof off, as a line
          drawing, then rendered. Both from scripts/site/render/livestock.html. */}
      <ModelSection line={`${D}/render/livestock-line.png`} real={`${D}/render/livestock-real.webp`} width={2400} height={1400}
        lineAlt="Line drawing of the livestock yard from the paddock with the roofs off: the palisade behind, the shelter of upright poles on its fieldstone plinth with a bamboo sleeping platform and a hay rack in each pen, pole hurdles and gates, the boarded feed store; the village yard with goats and sheep mixing, one goat on a stone, troughs, a bench, the dovecote and the cats’ house on posts, the ducks on and by their pond, the rabbits in their run, the guarded tree and the gate; to the right the tank, the baskets, the compost bays and the dogs’ run with two kennels and two dogs."
        realAlt="The same view rendered: grey-brown eucalyptus poles lashed with pale sisal, golden straw litter in the pens, red-brown earth and straw in the yard, brown, black, tan and white goats and white sheep with black faces, white ducks on a blue pond, grey rabbits, a ginger cat on its house, doves on the dovecote, a green tank, woven baskets of green fodder, the compost bays and a tan and a black dog in their run." />
    </main>
  )
}
