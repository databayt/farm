import type { Metadata } from "next"
import { LocaleLink as Link } from "@/components/internationalization/locale-link"

import { DocsSection, DrawingSection, ModelSection, PageHero, RailSection, ServiceSection } from "@/components/page/sections"
import { BuildUp } from "@/components/docs/build-up"
import { PipeDiagram } from "@/components/docs/pipe-diagram"
import { TaggedFigure } from "@/components/docs/tagged-figure"
import { WiringDiagram } from "@/components/docs/wiring-diagram"
import { hasLocale, i18n } from "@/components/internationalization/config"
import { dictionary } from "@/components/internationalization/dictionaries"
import { getLocale } from "@/components/internationalization/locale"
import { D, readCsv, studioCsv } from "@/components/studio/data"
import { bathRail, bedRail, electricRail, galleyRail, plumbingRail, seatingRail } from "@/components/studio/rails"
import { words } from "@/components/studio/words"
import electricTags from "../../../../../public/designs/studio/render/electric-tags.json"
import floorPieces from "../../../../../public/designs/studio/render/floor-pieces.json"
import plumbingTags from "../../../../../public/designs/studio/render/plumbing-tags.json"
import wallPieces from "../../../../../public/designs/studio/render/wall-pieces.json"

// Public showcase of the container-studio design package (study/studio, D-014..D-016).
// Every number here comes from the generated package; the docs hold the evidence. Its words, in English and
// Kinyarwanda, are in src/components/studio/words.tsx; its rails in rails.ts.

export async function generateMetadata({ params }: PageProps<"/[lang]/studio">): Promise<Metadata> {
  const { lang } = await params
  return words[hasLocale(lang) ? lang : i18n.defaultLocale].meta
}

// a fitting's tag takes the colour of the water it gives: hot over cold, so the heater reads as hot; drains and the
// vent for the points that only take those
const WARMTH = ["tempered", "hot", "cold", "soil", "waste", "vent"]
function fittingColour(f: Record<string, string>, pipes: Record<string, string>[]) {
  const runs = pipes.filter((p) => f.runs.split(" ").includes(p.run))
  return runs.sort((a, b) => WARMTH.indexOf(a.system) - WARMTH.indexOf(b.system))[0]?.colour
}

export default async function StudioPage() {
  const lang = await getLocale()
  const w = words[lang], t = dictionary(lang).page
  const link = (href: string, text: string) => <Link href={href} className="underline underline-offset-4">{text}</Link>
  const circuits = studioCsv("circuits.csv", lang)
  const demand = Object.fromEntries(readCsv("demand.csv").map((r) => [r.item, r.amps]))
  const points = studioCsv("points.csv", lang)
  const pipes = studioCsv("pipes.csv", lang)
  const fittings = studioCsv("fittings.csv", lang)
  const water = Object.fromEntries(readCsv("site-water.csv").map((r) => [r.item, r.value]))
  return (
    <main className="w-full flex-1">
      {/* First screen: a photoreal concept render of the finished studio (D-018), made in Gemini (2026-10-27):
          the yellow container on its red deck in the eucalyptus, the slider half open on the bed, a steel ladder up to
          the lounge chairs on the roof. Shared from Gemini at 1376 px and upscaled 4x with Real-ESRGAN (x4plus).
          No "Concept render" badge on it: the founder took it off (2026-10-27), an exception to D-018's label. */}
      <PageHero src={`${D}/render/studio-hero.jpg`} width={2400} height={1340} className="bg-[#a9c8df]" imgClassName="object-[50%_55%]"
        title={w.hero.title}
        alt={w.hero.alt} />

      {/* 2D, full screen: the simplified plan fills the screen; 3D follows straight after. */}
      <DrawingSection id="plans" title={t.plan}>
        {/* The simplified plan (render/plan.svg, black on transparent; inverted in dark mode), written by
            the generator, across the full width. */}
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={`${D}/render/plan.svg`} alt={w.planAlt}
          className="w-full object-contain lg:max-h-full dark:invert" />
      </DrawingSection>

      {/* 3D, full screen and in the 2D section's pattern: a black-and-white line drawing of the furnished
          room seen from the front (render/front-line.png, inverted in dark mode), then the same view rendered
          realistically (render/front-real.jpg). Both come from scripts/studio/render/room.html, built from
          render/scene.json. */}
      <ModelSection line={`${D}/render/front-line.png`} real={`${D}/render/front-real.jpg`} width={2400} height={1100}
        lineAlt={w.model.lineAlt}
        realAlt={w.model.realAlt} />

      {/* Floor, pinned while it builds up in fast motion, seen from above: the empty container, then flat
          wood sheets screwed down, then the planks, then the bathroom's vinyl. Renders: scripts/studio/render/floor.html. */}
      <section id="floor">
        <BuildUp title={w.floor.title} base={`${D}/render/floor-base.webp`} aspect={floorPieces.aspect}
          baseAlt={w.floor.baseAlt}
          builds={[
            { secs: 2.4, label: w.floor.builds[0], groups: [
              { src: `${D}/render/floor-sheets.webp`, rects: floorPieces.sheets, kind: "drop", from: 0, to: 0.75, rise: 60 },
              { src: `${D}/render/floor-screws.webp`, rects: floorPieces.sheets, kind: "fix", from: 0, to: 0.75 },
            ] },
            { secs: 3.2, label: w.floor.builds[1], groups: [
              { src: `${D}/render/floor-planks.webp`, rects: floorPieces.planks, kind: "drop", from: 0, to: 0.85, rise: 30 },
            ] },
            { secs: 1.2, label: w.floor.builds[2], groups: [
              { src: `${D}/render/floor-vinyl.webp`, rects: [floorPieces.vinyl], kind: "unroll", from: 0, to: 1 },
            ] },
          ]}
          stages={w.floor.stages} />
      </section>

      {/* Wall, in the floor's pattern: the back wall seen straight on, the bare corrugated steel first, then
          its lining put up in fast motion and painted off-white. Renders: scripts/studio/render/wall.html. */}
      <section id="wall">
        <BuildUp title={w.wall.title} base={`${D}/render/wall-base.webp`} aspect={wallPieces.aspect}
          baseAlt={w.wall.baseAlt}
          builds={[
            { secs: 2.8, label: w.wall.builds[0], groups: [
              { src: `${D}/render/wall-battens.webp`, rects: wallPieces.battens, kind: "drop", from: 0, to: 0.35 },
              { src: `${D}/render/wall-foam.webp`, rects: wallPieces.foam, kind: "spray", from: 0.45, to: 0.85 },
            ] },
            { secs: 2, label: w.wall.builds[1], groups: [
              { src: `${D}/render/wall-panels.webp`, rects: wallPieces.panels, kind: "drop", from: 0, to: 0.7, rise: 60 },
              { src: `${D}/render/wall-screws.webp`, rects: wallPieces.panels, kind: "fix", from: 0, to: 0.7 },
            ] },
            { secs: 2, label: w.wall.builds[2], groups: [
              { src: `${D}/render/wall-paint.webp`, rects: wallPieces.paint, kind: "wipe", from: 0, to: 0.85 },
            ] },
            { secs: 2.4, label: w.wall.builds[3], groups: [
              { src: `${D}/render/wall-cement.webp`, rects: wallPieces.cement, kind: "drop", from: 0, to: 0, rise: 60 },
              { src: `${D}/render/wall-tiles.webp`, rects: wallPieces.tiles, kind: "drop", from: 0.25, to: 0.85, rise: 24 },
            ] },
          ]}
          stages={w.wall.stages} />
      </section>

      {/* Bed: the bed corner as a rail of product cards (after databayt.org's products rail); the card in focus
          shows its size, source and cost below. */}
      <RailSection id="bedroom" title={w.sections.bed} items={bedRail(lang)} />
      <RailSection id="seating" title={w.sections.seating} items={seatingRail(lang)} />
      <RailSection id="galley" title={w.sections.galley} items={galleyRail(lang)} />
      <RailSection id="bath" title={w.sections.bath} items={bathRail(lang)} />

      {/* Electric: a plain title, then the studio's wiring drawn full width from its inlet to every circuit. Where the
          power comes from is a site decision; the studio only needs a supply in its inlet. Below it the installation in
          the 3D view's camera (render/electric-line.png, every run in its circuit's colour and every point tagged), the
          finished room (render/electric-real.jpg), then each device on its own. All three come from
          scripts/studio/render/room.html?view=electric, built from render/scene.json. */}
      <ServiceSection id="electrical" title={t.electric}
        diagram={<WiringDiagram circuits={circuits} demand={demand} />}
        figure={<TaggedFigure table="/docs/studio/electric" src={`${D}/render/electric-line.png`} aspect={electricTags.aspect} tags={electricTags.tags}
          alt={w.electric.figureAlt}
          info={Object.fromEntries(points.map((p) => [p.point, { label: p.description,
            colour: circuits.find((c) => c.circuit === p.circuit)?.colour }]))} />}
        note={w.electric.note(link, points.filter((p) => p.circuit === "C6" && !electricTags.tags.some((t) => t.id === p.point)).map((p) => p.point).join(", "))}
        real={{ src: `${D}/render/electric-real.jpg`, width: 2400, height: 1100, caption: t.rendered,
          alt: w.electric.realAlt }}
        rail={electricRail(lang)} />

      {/* Plumbing, in the Electric section's pattern: the studio's water drawn full width, from the farm's supply
          through the stop valve to every outlet and on to the drains. Below it the installation in the 3D view's camera
          with the sink base cut open and the bathroom's wet walls stripped to the foam (render/plumbing-line.png: every
          run in its system's colour, dashed where a wall or the floor still hides it, every fitting tagged), the
          finished room (render/plumbing-real.jpg), then each fitting on its own. All three come from
          scripts/studio/render/room.html?view=plumbing, built from render/scene.json. */}
      <ServiceSection id="plumbing" title={t.plumbing}
        diagram={<PipeDiagram pipes={pipes} fittings={fittings} water={water} />}
        figure={<TaggedFigure table="/docs/studio/plumbing" src={`${D}/render/plumbing-line.png`} aspect={plumbingTags.aspect} tags={plumbingTags.tags}
          alt={w.plumbing.figureAlt}
          info={Object.fromEntries(fittings.map((f) => [f.point, { label: f.description, colour: fittingColour(f, pipes) }]))} />}
        note={w.plumbing.note(link)}
        real={{ src: `${D}/render/plumbing-real.jpg`, width: 2400, height: 1100,
          caption: w.plumbing.caption(),
          alt: w.plumbing.realAlt }}
        rail={plumbingRail(lang)} />

      {/* The reference sections live in the docs (scripts/sync-docs.mjs, src/components/studio/docs-sections.tsx):
          the bill of materials, the circuit and pipe schedules with their points, and the studio's features and
          downloads. A card each, after the execution plan's. */}
      <DocsSection cards={w.docs} />
    </main>
  )
}
