import type { Metadata } from "next"
import { LocaleLink as Link } from "@/components/internationalization/locale-link"

import { DocsSection, DrawingSection, ModelSection, PageHero, RailSection, ServiceSection } from "@/components/page/sections"
import { BuildUp } from "@/components/docs/build-up"
import { drainRail, lightRail, partsRail } from "@/components/parking/rails"
import { TaggedFigure } from "@/components/docs/tagged-figure"
import { blocks, D, drainPoints, e, feedM, lampM, lightPoints, m, subM3, x0, x1, y0, y1 } from "@/components/parking/data"
import { DrainageDiagram } from "@/components/parking/drainage-diagram"
import { LightingDiagram } from "@/components/parking/lighting-diagram"
import { ParkingPlan } from "@/components/parking/parking-plan"
import parking from "@/components/parking/parking.json"
import { words } from "@/components/parking/words"
import { dictionary } from "@/components/internationalization/dictionaries"
import { hasLocale, i18n } from "@/components/internationalization/config"
import { getLocale } from "@/components/internationalization/locale"
import drainTags from "../../../../../public/designs/parking/render/drain-tags.json"
import lightTags from "../../../../../public/designs/parking/render/light-tags.json"
import topPieces from "../../../../../public/designs/parking/render/top-pieces.json"

// The way in, in /en/studio's pattern: the hero, the 2D and the 3D, then how the green parking is built, its parts, the
// two services it needs, the lights and where the rain goes, and the docs cards; the points tables are
// on its docs pages (/docs/parking). Every drawing reads
// src/components/parking/parking.json, in compound.json's true metres: the outer gate off the public road, the sign
// wall lettered DIGITAL FARM, the green parking with its five bays under shade trees, and the start of the rock road
// to the inner gate. What the plan leaves open (a full house, a minibus's turn, reversing out) is in the json; how it is
// built, drained and lit is design intent [A] until a builder sees the ground.

export async function generateMetadata({ params }: PageProps<"/[lang]/parking">): Promise<Metadata> {
  const { lang } = await params
  return words[hasLocale(lang) ? lang : i18n.defaultLocale].meta
}

const { parking: PK, build: B, drainage: DR } = parking


export default async function ParkingPage() {
  const lang = await getLocale()
  const w = words[lang], t = dictionary(lang).page
  const link = (href: string, text: string) => <Link href={href} className="underline underline-offset-4">{text}</Link>
  return (
    <main className="w-full flex-1">
      {/* First screen: the founder's Nano Banana render of the way in (2026-10-31), made from the brief in
          ~/Desktop/parking-nano-banana; master kept at assets/parking/hero-gemini.jpeg (2752 x 1536), cut to
          2400 x 1340. It departs from the drawings in three things: the letters stand proud on the stone with no
          steel panel, a flower bed runs along the wall's foot, and both pillars carry a lantern. The words keep the
          red road bottom-left. */}
      <PageHero src={`${D}/render/parking-hero.jpg`} width={2400} height={1340} className="bg-[#b8653a]" imgClassName="object-[50%_50%]"
        title={w.hero.title}
        alt={w.hero.alt} />

      {/* 2D, full screen: the way in's plan (src/components/parking/parking-plan.tsx), in the text colour. */}
      <DrawingSection id="plans" title={t.plan}>
        <ParkingPlan className="h-auto w-full lg:h-full lg:w-auto" />
      </DrawingSection>

      {/* 3D, in the 2D section's pattern: a line drawing of the way in seen from beyond the public road, the gate shut,
          then the same view rendered. Both from scripts/site/render/parking.html. */}
      <ModelSection line={`${D}/render/parking-line.png`} real={`${D}/render/parking-real.webp`} width={2400} height={1100}
        lineAlt={w.model.lineAlt}
        realAlt={w.model.realAlt} />

      {/* Parking, pinned while it builds up in fast motion, seen from above with the road at the bottom: the dug box,
          the sub-base, the edging, the pavers, the grass, the strips and stops. Renders: parking.html?top=<layer>. */}
      <section id="build">
        <BuildUp title={w.build.title} base={`${D}/render/top-ground.webp`} aspect={topPieces.aspect}
          baseAlt={w.build.baseAlt}
          builds={[
            { secs: 2, label: w.build.builds[0], groups: [
              { src: `${D}/render/top-sub.webp`, rects: topPieces.sub, kind: "wipe", from: 0, to: 0.85 },
            ] },
            { secs: 1.6, label: w.build.builds[1], groups: [
              { src: `${D}/render/top-edging.webp`, rects: topPieces.edging, kind: "drop", from: 0, to: 0.8, rise: 30 },
            ] },
            { secs: 3.6, label: w.build.builds[2], groups: [
              { src: `${D}/render/top-pavers.webp`, rects: topPieces.pavers, kind: "drop", from: 0, to: 0.4, rise: 40 },
              { src: `${D}/render/top-grass.webp`, rects: topPieces.grass, kind: "wipe", from: 0.5, to: 0.85 },
            ] },
            { secs: 2, label: w.build.builds[3], groups: [
              { src: `${D}/render/top-marks.webp`, rects: topPieces.strips, kind: "drop", from: 0, to: 0.5, rise: 30 },
              { src: `${D}/render/top-marks.webp`, rects: topPieces.stops, kind: "drop", from: 0.4, to: 0.85, rise: 30 },
            ] },
          ]}
          stages={w.build.stages({ dig: m(B.dig), w: x1 - x0, d: y1 - y0, subbase: m(B.subbase), m3: Math.round(subM3), edging: m(e),
            bedding: m(B.bedding), blocks: blocks.toLocaleString("en-US"), l: m(B.paver.l), pw: m(B.paver.w), cure: w.build.cure(B.cure), strips: m(PK.strips.l) })} />
      </section>

      {/* Parts: each part of the way in on its own, its size, source and cost below the card in focus. */}
      <RailSection id="parts" title={w.sections.parts} items={partsRail(lang)} />

      {/* Lighting, in the studio's Electric pattern: the circuit drawn full width from the compound's board to every
          lamp, then the way in with every duct run in its colour and every point tagged (render/light-line.png,
          light-tags.json), the same view rendered at dusk with the sign and the lantern lit (render/light-real.webp),
          then each part on its own. All from parking.html?view=light and ?item=. */}
      <ServiceSection id="lighting" title={w.sections.lighting}
        diagram={<LightingDiagram feedM={feedM} lampM={lampM} />}
        figure={<TaggedFigure table="/docs/parking/lighting" src={`${D}/render/light-line.png`} aspect={lightTags.aspect} tags={lightTags.tags}
          alt={w.lighting.figureAlt}
          info={Object.fromEntries(lightPoints(lang).map((p) => [p.id, { label: p.what, colour: p.colour }]))} />}
        note={w.lighting.note(link)}
        real={{ src: `${D}/render/light-real.webp`, width: 2400, height: 1100,
          caption: w.lighting.caption,
          alt: w.lighting.realAlt }}
        rail={lightRail(lang)} />

      {/* Drainage, in the studio's Plumbing pattern: a long section of the lot drawn full width, then the way in as the
          3D sees it with every fall as an arrow, the trench and the pit in their colours and every point tagged
          (render/drain-line.png, drain-tags.json), the same view rendered with what shows of them (render/drain-real.webp),
          then each part on its own. All from parking.html?view=drain and ?item=. */}
      <ServiceSection id="drainage" title={w.sections.drainage}
        diagram={<DrainageDiagram box={PK.box} build={B} drainage={DR} />}
        figure={<TaggedFigure table="/docs/parking/drainage" src={`${D}/render/drain-line.png`} aspect={drainTags.aspect} tags={drainTags.tags}
          alt={w.drainage.figureAlt}
          info={Object.fromEntries(drainPoints(lang).map((p) => [p.id, { label: p.what, colour: p.colour }]))} />}
        note={w.drainage.note(link)}
        real={{ src: `${D}/render/drain-real.webp`, width: 2400, height: 1100,
          caption: w.drainage.caption,
          alt: w.drainage.realAlt }}
        rail={drainRail(lang)} />

      <DocsSection cards={w.docs} />
    </main>
  )
}
