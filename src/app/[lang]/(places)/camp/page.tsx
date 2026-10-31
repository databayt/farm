import type { Metadata } from "next"

import { DocsSection, DrawingSection, ModelSection, PageHero, RailSection } from "@/components/page/sections"
import { BuildUp } from "@/components/docs/build-up"
import { kitRail } from "@/components/camp/rails"
import { CampLawn, LAWN } from "@/components/camp/camp-lawn"
import { CampPlan } from "@/components/camp/camp-plan"
import camp from "@/components/camp/camp.json"
import topPieces from "../../../../../public/designs/camp/render/top-pieces.json"

// One camp, in /en/studio's pattern: a full-screen hero, then the 2D and the 3D. Both drawings read
// src/components/camp/camp.json, after the hero (the Nano Banana render): the footage's hexagonal pop-up on the
// grass, its door rolled up, furnished as a floor lounge. Then the studio's later sections, with what a pitch has:
// the pitch made from above, the kit piece by piece, and the lawn with what serves it. The design brings no power
// and no water to the pitches, so the camp has no service sections.

export const metadata: Metadata = {
  title: "The camp · Farm",
  description: "A hexagonal pop-up tent for two pitched on the camping lawn, furnished as a floor lounge by the fire pit, at the Digital Farm near Kigali.",
}

const D = "/designs/camp"
const P = topPieces.tags

// The camp's docs pages, as the docs sidebar groups them (D-059), linked from the end of this page.
const DOCS = [
  { href: "/docs/camp", title: "Execution plan", text: "Every step of pitching and furnishing a tent on the camping lawn, for a guest arriving at dusk." },
  { href: "/docs/camp/materials", title: "Materials", text: "The tent and its kit, piece by piece, with its size, where to buy it and its cost." },
]

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

      {/* Pitch, in the studio's Floor pattern: pinned while one pitch is made in fast motion, seen from straight above
          with the tent's hips and top off: the lawn, the groundsheet, the tent, then the room furnished. Renders:
          scripts/site/render/camp.html?top=<layer>, which also writes the pieces' rectangles (render/top-pieces.json). */}
      <section id="pitch">
        <BuildUp title="Pitch" base={`${D}/render/top-ground.webp`} aspect={topPieces.aspect}
          baseAlt="A patch of mown lawn from straight above."
          builds={[
            { secs: 1.4, label: "A groundsheet laid where the tent will stand.", groups: [
              { src: `${D}/render/top-sheet.webp`, rects: P.sheet, kind: "unroll", from: 0, to: 1 },
            ] },
            { secs: 1.6, label: "The tent popped up over it and pegged at each corner, its door rolled up.", groups: [
              { src: `${D}/render/top-tent.webp`, rects: P.tent, kind: "drop", from: 0, to: 0.6, rise: 40 },
            ] },
            { secs: 2.6, label: "The rug, then the futon, the floor chair, the cushions and the throw.", groups: [
              { src: `${D}/render/top-rug.webp`, rects: P.rug, kind: "unroll", from: 0, to: 0.3 },
              { src: `${D}/render/top-furnish.webp`, rects: P.furnish, kind: "drop", from: 0.35, to: 0.9, rise: 30 },
            ] },
            { secs: 1.4, label: "The tea board on the rug and the lantern at the back.", groups: [
              { src: `${D}/render/top-tea.webp`, rects: P.tea, kind: "drop", from: 0, to: 0.7, rise: 24 },
            ] },
          ]}
          stages={[
            { title: "The lawn", text: "A level patch of the camping lawn, mown short, with nothing under it: the tent stands straight on the grass, with no deck or platform." },
            { title: "Step 1 · Groundsheet", text: `A groundsheet a little smaller than the tent's floor, ${camp.tent.r * 2} m across the corners, so rain runs off rather than under.` },
            { title: "Step 2 · Tent", text: `The pop-up opens over it, its six poles pegged outside the corners, the walls up to ${camp.tent.shoulder.h} m and the top at ${camp.tent.top.h} m. The door rolls up to a strap.` },
            { title: "Step 3 · Furnished", text: "The rug in the middle, the futon along the right wall, the floor chair at the back left, the cushions and the throw inside the door." },
            { title: "Step 4 · Ready", text: "The tea board on the rug and the lantern at the back, for a guest arriving at dusk." },
          ]} />
      </section>

      {/* Kit: one card per piece, rendered on its own from the 3D's meshes (camp.html?item=<id>). */}
      <RailSection id="kit" title="Kit" items={kitRail()} />

      {/* The lawn: where the pitch stands among the six, and what serves it, from the provisional compound plan
          (src/components/home/compound.json) without the homepage's sideways spread. */}
      <DrawingSection id="lawn" title="The lawn" after={
        <p className="text-muted-foreground max-w-4xl px-4 pb-10 text-sm text-balance md:px-10">
          The {LAWN.tents} tents stand on a camping lawn between the guest rooms and the fire pit, {LAWN.pitNear} to {LAWN.pitFar} m
          from its edge. Campers use the public bathroom&rsquo;s two toilet rooms, urinal and basins, {LAWN.bathNear} to{" "}
          {LAWN.bathFar} m from the tents to its door in a straight line. The design brings no power and no water to the pitches:
          light is the lantern, and there are no showers yet (whether the public bathroom takes one is an open question). The
          guest kitchen and BBQ (D-028) are on the master plan&rsquo;s lawn, not yet placed on the compound plan. Distances are
          from the provisional plan, not surveyed.
        </p>
      }>
        <CampLawn title={`Plan of the camping lawn: six hexagonal tents in three rows of two between the guest rooms and the stone fire pit with its eight stools, the cluster ending at the pit's west edge; the public bathroom in the far row of containers, its door ${LAWN.bathNear} to ${LAWN.bathFar} m from the tents in a straight line.`}
          className="h-auto w-full lg:h-full lg:w-auto" />
      </DrawingSection>

      <DocsSection cards={DOCS} />
    </main>
  )
}
