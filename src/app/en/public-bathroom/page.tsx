import type { Metadata } from "next"

import { DrawingSection, ModelSection, PageHero } from "@/components/page/sections"
import { PublicBathroomPlan } from "@/components/public-bathroom/public-bathroom-plan"

// The public bathroom, as /en/office is the office: a full-screen hero, then the 2D and the 3D. Both drawings read
// src/components/public-bathroom/public-bathroom.json: the teal 20 ft container on its stone plinth beside the galley,
// one door and two high windows toward the courtyard (as the homepage draws it); inside, the founder's two toilet
// rooms, two hand basins and a urinal (D-022): the toilet rooms along the front, a passage behind them to the
// cleaner's cupboard, the basins in the lobby and the urinal in a room of its own. Every size inside is an assumption.

export const metadata: Metadata = {
  title: "The public bathroom · Farm",
  description: "Two toilet rooms, a urinal and two hand basins in a teal container by the courtyard, for the camp, the bar lounge and the fire pit, at the Digital Farm near Kigali.",
}

const D = "/designs/public-bathroom"

export default function PublicBathroomPage() {
  return (
    <main className="w-full flex-1">
      {/* First screen: a STAND-IN until the founder's Nano Banana remaster. For now it is the design model rendered
          from eye level in the courtyard (scripts/site/render/public-bathroom.html?mode=real&hero=1, 2400 x 1340),
          front wall and roof on. The bathroom sits right, so the words keep the open lawn bottom-left. */}
      <PageHero src={`${D}/render/public-bathroom-hero.jpg`} width={2400} height={1340} className="bg-[#c9d6df]" imgClassName="object-[62%_60%]"
        title="Toilets and hand basins for the camp"
        alt="A teal shipping container on a fieldstone plinth on a green lawn under a blue sky: two small white-framed windows of frosted glass and a red door with a frosted glass panel and a lamp above it, a concrete-capped stone landing and step in front of the door." />

      {/* 2D, full screen: the bathroom's plan (src/components/public-bathroom/public-bathroom-plan.tsx), in the text
          colour. */}
      <DrawingSection id="plans" title="2D">
        <PublicBathroomPlan title="Plan: a 20 ft container 6,058 by 2,438 mm on a stone plinth, with a 1,500 mm landing and a step in front of its door; inside, two toilet rooms 1,350 by 1,200 mm along the front wall, each with a WC under its window, opening off a 900 mm passage behind them that ends at the cleaner's cupboard; the lobby inside the door with two basins on a counter against the back wall, paper towels and a bin past it and a floor drain; and the urinal in its own room at the east end."
          className="h-auto w-full lg:h-full lg:w-auto" />
      </DrawingSection>

      {/* 3D, in the 2D section's pattern: a line drawing of the bathroom seen from the courtyard with its front wall
          and roof off, then the same view rendered. Both from scripts/site/render/public-bathroom.html. */}
      <ModelSection line={`${D}/render/public-bathroom-line.png`} real={`${D}/render/public-bathroom-real.webp`} width={2400} height={1100}
        lineAlt="Line drawing of the bathroom from the courtyard with its front wall and roof off: the container on its plinth, the landing and the step; two toilet rooms, each with a WC and a roll holder, their back wall cut low to show the passage behind and the tall cleaner's cupboard at its end; the lobby with two bowls on a counter under a long mirror, a soap dispenser, paper towels over a bin and a floor drain; and the urinal with its flush valve and an extract fan in the end room."
        realAlt="The same view rendered: teal corrugated steel on a fieldstone plinth, white wall tiles under off-white paint, warm grey floor tiles, white WCs, a white urinal and two white bowls, chrome taps, a Medium Oak counter and cleaner's cupboard, a long mirror, and a concrete-capped landing and step on the lawn." />
    </main>
  )
}
