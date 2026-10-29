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
      {/* First screen: the founder's photo (2026-10-29, D-042), the yard's look and feel: a thatched shed, a palisade,
          crooked rail fences lashed with rope, goats and sheep on straw. Cut to 2400 x 1340 from the 2000 px original
          (assets/livestock/hero-reference.png, above the Lens badge in its corner). The words keep the lower left. */}
      <PageHero src={`${D}/render/livestock-hero.jpg`} width={2400} height={1340} className="bg-[#d9d4c6]" imgClassName="object-[60%_60%]"
        title="Goats and sheep on open pasture"
        alt="A small thatched shed of dark boards and poles, a white goat inside; in front, goats and woolly sheep on earth and straw among straw bales, behind a crooked rail fence of barked poles lashed with rope; a board trough under the rails, cut stone blocks and woven baskets outside; a palisade of upright poles, trees and misty wooded hills behind." />

      {/* 2D, full screen: the house's plan (src/components/livestock/livestock-plan.tsx), in the text colour. */}
      <DrawingSection id="plans" title="2D">
        <LivestockPlan title="Plan: one outline 17,200 by 9,600 mm, a pole palisade at the back and a post-and-rail fence round the rest with one gate to the paddock. Inside, the herd’s shed as the founder’s photo’s, 5,000 by 3,600 mm under a thatched gable on a low fieldstone plinth: a boarded back and east end, the west side open behind two rails, the front open under three braced posts; inside a straw bale, a slatted feed table, a lockable feed bin and the two mineral boxes. The village yard for the herd, the cats, the doves and the guests, with troughs, climbing stones, a shade tree, a log bench, a dovecote and a cats’ house on posts; by the shed the tank, fodder baskets and three compost bays, and the guard dogs’ run with two kennels in the back east corner; shrubs round the outside."
          className="h-auto w-full lg:h-full lg:w-auto" />
      </DrawingSection>

      {/* 3D, in the 2D section's pattern: the yard seen straight on from the paddock with the roof off, as a line
          drawing, then rendered. Both from scripts/site/render/livestock.html. */}
      <ModelSection line={`${D}/render/livestock-line.png`} real={`${D}/render/livestock-real.webp`} width={2400} height={1400}
        lineAlt="Line drawing of the livestock yard from the paddock: one outline, the palisade behind and a crooked post-and-rail fence round the rest with a two-leaf gate; the shed with its boarded back and side, its braced front posts and the rafters of its steep gable, a straw bale, a feed table and a feed bin inside; goats and sheep in the yard, one goat on a stone, troughs, a bench, the dovecote and the cats’ house on posts, three cats, the guarded tree; the tank, the baskets, the compost bays and the dogs’ run with two kennels in the back corner."
        realAlt="The same view rendered: the shed of dark weathered boards with heavy barked posts and the pole rafters of its gable over golden straw, a straw bale and a feed table of hay; thick crooked rails lashed with rope round red-brown earth and straw; brown, black, tan and white goats and white sheep with black faces, a ginger cat on its house and a grey and a black cat, doves on the dovecote, a green tank, baskets of green fodder, the compost bays and a tan and a black dog in their run." />
    </main>
  )
}
