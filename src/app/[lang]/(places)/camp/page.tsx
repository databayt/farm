import type { Metadata } from "next"

import { DocsSection, DrawingSection, ModelSection, PageHero, RailSection } from "@/components/page/sections"
import { BuildUp } from "@/components/docs/build-up"
import { kitRail } from "@/components/camp/rails"
import { CampLawn, LAWN } from "@/components/camp/camp-lawn"
import { CampPlan } from "@/components/camp/camp-plan"
import camp from "@/components/camp/camp.json"
import { words } from "@/components/camp/words"
import { dictionary } from "@/components/internationalization/dictionaries"
import { hasLocale, i18n } from "@/components/internationalization/config"
import { getLocale } from "@/components/internationalization/locale"
import topPieces from "../../../../../public/designs/camp/render/top-pieces.json"

// One camp, in /en/studio's pattern: a full-screen hero, then the 2D and the 3D. Both drawings read
// src/components/camp/camp.json, after the hero (the Nano Banana render): the footage's hexagonal pop-up on the
// grass, its door rolled up, furnished as a floor lounge. Then the studio's later sections, with what a pitch has:
// the pitch made from above, the kit piece by piece, and the lawn with what serves it. The design brings no power
// and no water to the pitches, so the camp has no service sections.

export async function generateMetadata({ params }: PageProps<"/[lang]/camp">): Promise<Metadata> {
  const { lang } = await params
  return words[hasLocale(lang) ? lang : i18n.defaultLocale].meta
}

const D = "/designs/camp"
const P = topPieces.tags

export default async function CampPage() {
  const lang = await getLocale()
  const w = words[lang], t = dictionary(lang).page
  return (
    <main className="w-full flex-1">
      {/* First screen: the founder's Nano Banana render of the camp (2026-10-27), made from the footage's tent
          (IMG_3172) and the 3D layout; master kept at assets/camp/hero-gemini.jpeg (2752 px), cut to 2400 x 1340.
          The tent sits right, so the words keep the open lawn bottom-left. */}
      <PageHero src={`${D}/render/camp-hero.jpg`} width={2400} height={1340} className="bg-[#c9d3dc]" imgClassName="object-[65%_60%]"
        title={w.hero.title}
        alt={w.hero.alt} />

      {/* 2D, full screen: the camp's plan (src/components/camp/camp-plan.tsx), in the text colour. */}
      <DrawingSection id="plans" title={t.plan}>
        <CampPlan className="h-auto w-full lg:h-full lg:w-auto" />
      </DrawingSection>

      {/* 3D, in the 2D section's pattern: a line drawing of the camp seen from the front with its front walls
          off, then the same view rendered. Both from scripts/site/render/camp.html. */}
      <ModelSection line={`${D}/render/camp-line.png`} real={`${D}/render/camp-real.webp`} width={2400} height={1100}
        lineAlt={w.model.lineAlt}
        realAlt={w.model.realAlt} />

      {/* Pitch, in the studio's Floor pattern: pinned while one pitch is made in fast motion, seen from straight above
          with the tent's hips and top off: the lawn, the groundsheet, the tent, then the room furnished. Renders:
          scripts/site/render/camp.html?top=<layer>, which also writes the pieces' rectangles (render/top-pieces.json). */}
      <section id="pitch">
        <BuildUp title={w.build.title} base={`${D}/render/top-ground.webp`} aspect={topPieces.aspect}
          baseAlt={w.build.baseAlt}
          builds={[
            { secs: 1.4, label: w.build.builds[0], groups: [
              { src: `${D}/render/top-sheet.webp`, rects: P.sheet, kind: "unroll", from: 0, to: 1 },
            ] },
            { secs: 1.6, label: w.build.builds[1], groups: [
              { src: `${D}/render/top-tent.webp`, rects: P.tent, kind: "drop", from: 0, to: 0.6, rise: 40 },
            ] },
            { secs: 2.6, label: w.build.builds[2], groups: [
              { src: `${D}/render/top-rug.webp`, rects: P.rug, kind: "unroll", from: 0, to: 0.3 },
              { src: `${D}/render/top-furnish.webp`, rects: P.furnish, kind: "drop", from: 0.35, to: 0.9, rise: 30 },
            ] },
            { secs: 1.4, label: w.build.builds[3], groups: [
              { src: `${D}/render/top-tea.webp`, rects: P.tea, kind: "drop", from: 0, to: 0.7, rise: 24 },
            ] },
          ]}
          stages={[
            { title: w.build.stages.lawn.title, text: w.build.stages.lawn.text },
            { title: w.build.stages.sheet.title, text: w.build.stages.sheet.text(camp.tent.r * 2) },
            { title: w.build.stages.tent.title, text: w.build.stages.tent.text(camp.tent.shoulder.h, camp.tent.top.h) },
            { title: w.build.stages.furnished.title, text: w.build.stages.furnished.text },
            { title: w.build.stages.ready.title, text: w.build.stages.ready.text },
          ]} />
      </section>

      {/* Kit: one card per piece, rendered on its own from the 3D's meshes (camp.html?item=<id>). */}
      <RailSection id="kit" title={w.kit} items={kitRail(lang)} />

      {/* The lawn: where the pitch stands among the six, and what serves it, from the provisional compound plan
          (src/components/home/compound.json) without the homepage's sideways spread. */}
      <DrawingSection id="lawn" title={w.lawn.title} after={
        <p className="text-muted-foreground max-w-4xl px-4 pb-10 text-sm text-balance md:px-10">
          {w.lawn.text(LAWN)}
        </p>
      }>
        <CampLawn className="h-auto w-full lg:h-full lg:w-auto" />
      </DrawingSection>

      <DocsSection cards={w.docs} />
    </main>
  )
}
