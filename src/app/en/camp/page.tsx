import type { Metadata } from "next"

import { DrawingSection, ModelSection, PageHero } from "@/components/page/sections"
import { CampPlan } from "@/components/camp/camp-plan"

// One camp, as /en/studio is one studio: a full-screen hero, then the 2D and the 3D. Both drawings read
// src/components/camp/camp.json, after the hero (the Nano Banana render): the footage's hexagonal pop-up on the
// grass, its door rolled up, furnished as a floor lounge.

export const metadata: Metadata = {
  title: "The camp · Farm",
  description: "A tent for two on its own timber deck, by the fire pit and with lake views, at the Digital Farm near Kigali.",
}

const D = "/designs/camp"

export default function CampPage() {
  return (
    <main className="w-full flex-1">
      {/* First screen: the founder's Nano Banana render of the camp (2026-10-27), made from the footage's tent
          (IMG_3172) and the 3D layout; master kept at assets/camp/hero-gemini.jpeg (2752 px), cut to 2400 x 1340.
          The tent sits right, so the words keep the open lawn bottom-left. */}
      <PageHero src={`${D}/render/camp-hero.jpg`} width={2400} height={1340} className="bg-[#c9d3dc]" imgClassName="object-[65%_60%]"
        title="A tent with lake views and fire-pit nights"
        alt="A hexagonal pop-up tent in off-white canvas with beige trim at golden hour, its door open on a low cushioned chair, floor cushions, a striped rug, a lantern and a tea tray, on a green lawn with more tents, trees and the lake behind." />

      {/* 2D, full screen: the camp's plan (src/components/camp/camp-plan.tsx), in the text colour. */}
      <DrawingSection id="plans" title="2D">
        <CampPlan title="Plan: a hexagonal tent 2.8 m across, its door rolled up; inside, a floor chair and a folded throw on the left, a futon with a cushion and two stacked cushions on the right, a striped rug in the middle with a tea board, and a lantern at the back."
          className="h-auto w-full lg:h-full lg:w-auto" />
      </DrawingSection>

      {/* 3D, in the 2D section's pattern: a line drawing of the camp seen from the front with its front walls
          off, then the same view rendered. Both from scripts/site/render/camp.html. */}
      <ModelSection line={`${D}/render/camp-line.png`} real={`${D}/render/camp-real.webp`} width={2400} height={1100}
        lineAlt="Line drawing of the camp from the front with the front walls off: the floor chair, the futon with its cushion, the stacked cushions, the throw, the tea board on the rug and the lantern at the back."
        realAlt="The same view rendered in golden-hour light on the lawn: off-white canvas with beige trim and mesh windows, a tan floor chair, a white futon with a patterned cushion, a striped rug with a clay teapot and cups on a tea board, and a lit lantern." />
    </main>
  )
}
