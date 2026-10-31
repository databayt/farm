import type { Metadata } from "next"

import { DocsSection, DrawingSection, ModelSection, PageHero, RailSection } from "@/components/page/sections"
import { BuildUp } from "@/components/docs/build-up"
import { DiningPlan } from "@/components/dining/dining-plan"
import dining from "@/components/dining/dining.json"
import { furnitureRail, structureRail } from "@/components/dining/rails"
import { words } from "@/components/dining/words"
import { hasLocale, i18n } from "@/components/internationalization/config"
import { dictionary } from "@/components/internationalization/dictionaries"
import { getLocale } from "@/components/internationalization/locale"
import buildPieces from "../../../../../public/designs/dining/render/build-pieces.json"

// The dining area, in /en/studio's pattern as the camp is: the hero, the 2D and the 3D, the build as it goes up (the
// wall and the arches stand today, the mesh is going on), its structure and its furniture, then the docs cards. Every
// drawing reads src/components/dining/dining.json, after the founder's photos of 2026-10-31 (media dn-3279 to
// dn-3282) and his choices (D-069): 24 seats at once, a grass thatch on the mesh. Its lamps' power is not designed,
// so it has no service sections yet.

export async function generateMetadata({ params }: PageProps<"/[lang]/dining">): Promise<Metadata> {
  const { lang } = await params
  return words[hasLocale(lang) ? lang : i18n.defaultLocale].meta
}

const D = "/designs/dining"
const P = buildPieces.tags
const { wall, frame, mesh, thatch, floor, tables } = dining
const mm = (m: number) => Math.round(m * 1000)

export default async function DiningPage() {
  const lang = await getLocale()
  const w = words[lang], t = dictionary(lang).page
  return (
    <main className="w-full flex-1">
      {/* First screen: the founder's Nano Banana render of the dining area (2026-10-31), made from the brief in
          ~/Desktop/dining-nano-banana (his photo dn-3279 as the site, the 3D's hero as the layout); master kept at
          assets/dining/hero-gemini.jpeg (2752 x 1536), cut to 2400 x 1340. It departs from the drawings in two things:
          the arches read as steel rather than eucalyptus, and the way in is a gap in the front wall, not the east end. The
          words keep the red ground bottom-left. */}
      <PageHero src={`${D}/render/dining-hero.jpg`} width={2400} height={1340} className="bg-[#b3653f]" imgClassName="object-[50%_50%]"
        title={w.hero.title}
        alt={w.hero.alt} />

      {/* 2D, full screen: the dining area's plan (src/components/dining/dining-plan.tsx), in the text colour. */}
      <DrawingSection id="plans" title={t.plan}>
        <DiningPlan className="h-auto w-full lg:h-full lg:w-auto" />
      </DrawingSection>

      {/* 3D, in the 2D section's pattern: a line drawing from the front with the thatch and the mesh on the back half
          only, then the same view rendered. Both from scripts/site/render/dining.html. */}
      <ModelSection line={`${D}/render/dining-line.png`} real={`${D}/render/dining-real.webp`} width={2400} height={1100}
        lineAlt={w.model.lineAlt}
        realAlt={w.model.realAlt} />

      {/* Build, in the studio's Floor pattern: pinned while the area goes up in fast motion, seen from the south-east so
          the room shows through the open east end: the wall, the frame, the mesh, the thatch, then the floor and the
          furniture. Each layer is rendered alone with the earlier ones hiding what they hide
          (dining.html?build=<layer>, which also writes the pieces' rectangles, render/build-pieces.json). */}
      <section id="build">
        <BuildUp title={w.build.title} base={`${D}/render/build-ground.webp`} aspect={buildPieces.aspect}
          baseAlt={w.build.baseAlt}
          builds={[
            { secs: 2.4, label: w.build.builds[0], groups: [
              { src: `${D}/render/build-wall.webp`, rects: P.wall, kind: "spray", from: 0, to: 0.8 },
            ] },
            { secs: 2.4, label: w.build.builds[1], groups: [
              { src: `${D}/render/build-frame.webp`, rects: P.frame, kind: "drop", from: 0, to: 0.85, rise: 40 },
            ] },
            { secs: 1.6, label: w.build.builds[2], groups: [
              { src: `${D}/render/build-mesh.webp`, rects: P.mesh, kind: "unroll", from: 0, to: 1 },
            ] },
            { secs: 2, label: w.build.builds[3], groups: [
              { src: `${D}/render/build-thatch.webp`, rects: P.thatch, kind: "wipe", from: 0, to: 0.9 },
            ] },
            { secs: 2.4, label: w.build.builds[4], groups: [
              { src: `${D}/render/build-floor.webp`, rects: P.floor, kind: "wipe", from: 0, to: 0.3 },
              { src: `${D}/render/build-furnish.webp`, rects: P.furnish, kind: "drop", from: 0.35, to: 0.9, rise: 30 },
            ] },
          ]}
          stages={w.build.stages({ length: wall.length, width: wall.width, h: wall.h, t: wall.t, arches: frame.arches,
            crown: frame.crown, grid: mm(mesh.grid), thatch: mm(thatch.t), eave: mm(thatch.eave), floor: mm(floor.t),
            seats: tables.seats * 4 })} />
      </section>

      {/* Structure and furniture: each part on its own (dining.html?item=<id>), its size, source and cost below the card
          in focus. */}
      <RailSection id="structure" title={w.sections.structure} items={structureRail(lang)} />
      <RailSection id="furniture" title={w.sections.furniture} items={furnitureRail(lang)} />

      <DocsSection cards={w.docs} />
    </main>
  )
}
