import type { Metadata } from "next"

import { DrawingSection, ModelSection, PageHero } from "@/components/page/sections"
import { LivestockPlan } from "@/components/livestock/livestock-plan"

// The livestock yard, as /en/bar is one bar: a full-screen hero, then the 2D and the 3D. Both drawings read
// src/components/livestock/livestock.json: the starting herd of 6 goats and 4 sheep (D-030) in a thatched pole
// shelter's open hall (D-037) inside one outline (D-039), opening onto the village yard they share by day with the
// farm friends, 3 cats and the doves, and with the guests (D-038, D-040); the 2 guard dogs' run, the feed store, the
// tank and the compost bays that close the loop to the field. Every size is an assumption until the farm's vet
// checks it.

export const metadata: Metadata = {
  title: "The livestock · Farm",
  description: "Goats and sheep in one village yard by a thatched shelter, with three cats, free-flying doves and two guard dogs, part of the farm’s loop from field to compost, at the Digital Farm near Kigali.",
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
        <LivestockPlan title="Plan: one outline 17,200 by 9,600 mm, a pole palisade at the back and a post-and-rail fence round the rest with one gate to the paddock. Inside, a thatched pole shelter 7,000 by 3,600 mm on a fieldstone plinth: one open hall for the herd with a slatted bamboo sleeping platform along the back, two hay racks, the goats’ mineral box high and the sheep’s low, movable kidding hurdles at the east end, a front rail with two gates, and the lockable feed store; the village yard for the herd, the farm friends and the guests, with troughs, climbing stones, a shade tree, a log bench, a dovecote and a cats’ house on posts; behind the store the tank, fodder baskets and three compost bays, and the guard dogs’ run with two kennels in the back east corner."
          className="h-auto w-full lg:h-full lg:w-auto" />
      </DrawingSection>

      {/* 3D, in the 2D section's pattern: the yard seen straight on from the paddock with the roof off, as a line
          drawing, then rendered. Both from scripts/site/render/livestock.html. */}
      <ModelSection line={`${D}/render/livestock-line.png`} real={`${D}/render/livestock-real.webp`} width={2400} height={1400}
        lineAlt="Line drawing of the livestock yard from the paddock with the roofs off: one outline, the palisade behind and a post-and-rail fence round the rest with a two-leaf gate; the shelter of upright poles on its fieldstone plinth with one long bamboo sleeping platform, two hay racks, the kidding hurdles and the front rail with two gates, the boarded feed store; goats and sheep mixing in the yard, one goat on a stone, troughs, a bench, the dovecote and the cats’ house on posts, three cats, the guarded tree; the tank, the baskets, the compost bays and the dogs’ run with two kennels in the back corner."
        realAlt="The same view rendered: grey-brown eucalyptus poles lashed with pale sisal, golden straw litter in the hall, red-brown earth and straw in the yard, brown, black, tan and white goats and white sheep with black faces, a ginger cat on its house and a grey and a black cat in the yard, doves on the dovecote, a green tank, woven baskets of green fodder, the compost bays and a tan and a black dog in their run." />
    </main>
  )
}
