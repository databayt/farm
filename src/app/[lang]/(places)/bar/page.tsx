import type { Metadata } from "next"
import { LocaleLink as Link } from "@/components/internationalization/locale-link"

import { DocsSection, DrawingSection, ModelSection, PageHero, RailSection, ServiceSection } from "@/components/page/sections"
import { TaggedFigure } from "@/components/docs/tagged-figure"
import { electricRail, equipmentRail, waterRail } from "@/components/bar/rails"
import { BarPlan } from "@/components/bar/bar-plan"
import { barData, circuitColour, D, waterColour } from "@/components/bar/data"
import { words } from "@/components/bar/words"
import { dictionary } from "@/components/internationalization/dictionaries"
import { hasLocale, i18n } from "@/components/internationalization/config"
import { getLocale } from "@/components/internationalization/locale"
import { PowerDiagram, WaterDiagram } from "@/components/galley/service-diagrams"
import electricTags from "../../../../../public/designs/bar/render/electric-tags.json"
import waterTags from "../../../../../public/designs/bar/render/water-tags.json"

// The bar, in /en/studio's pattern: the hero, the 2D and the 3D, the Equipment rail, Electric and Plumbing, then the
// docs cards; its points, circuits and runs are on its docs pages (/docs/bar). Both drawings read src/components/bar/bar.json: the red 20 ft container on its stone plinth, the long hatch open onto the
// courtyard under a propped flap, a timber counter with five stools on a deck, and inside a work counter with
// fridges and a sink, a back bar with the coffee machine and the juice station, a door at the north end.

export async function generateMetadata({ params }: PageProps<"/[lang]/bar">): Promise<Metadata> {
  const { lang } = await params
  return words[hasLocale(lang) ? lang : i18n.defaultLocale].meta
}

const OUTSIDE = ["L5", "P5"]

export default async function BarPage() {
  const lang = await getLocale()
  const w = words[lang], t = dictionary(lang).page
  const { ELECTRIC, WATER } = barData(lang)
  const link = (href: string, text: string) => <Link href={href} className="underline underline-offset-4">{text}</Link>
  return (
    <main className="w-full flex-1">
      {/* First screen: the founder's Nano Banana render of the bar (2026-10-30), made from the brief in
          ~/Desktop/bar-nano-banana; master kept at assets/bar/hero-gemini.png (1672 x 941), upscaled to 2400 x 1340.
          Seen square on, the bar centred; the words sit on the deck and the lawn bottom-left. */}
      <PageHero src={`${D}/render/bar-hero.jpg`} width={2400} height={1340} className="bg-[#8a9a52]" imgClassName="object-[50%_55%]"
        title={w.hero.title}
        alt={w.hero.alt} />

      {/* 2D, full screen: the bar's plan (src/components/bar/bar-plan.tsx), in the text colour. */}
      <DrawingSection id="plans" title={t.plan}>
        <BarPlan className="h-auto w-full lg:h-full lg:w-auto" />
      </DrawingSection>

      {/* 3D, in the 2D section's pattern: a line drawing of the bar seen from the courtyard with its roof off,
          then the same view rendered. Both from scripts/site/render/bar.html. */}
      <ModelSection line={`${D}/render/bar-line.png`} real={`${D}/render/bar-real.webp`} width={2400} height={1100}
        lineAlt={w.model.lineAlt}
        realAlt={w.model.realAlt} />

      {/* Equipment: one card per piece, rendered on its own from the 3D's meshes (bar.html?item=<id>) */}
      <RailSection id="equipment" title={t.equipment} items={equipmentRail(lang)} />

      {/* Electric, in the studio's pattern: the single line drawn full width, then the installation in the 3D view's
          camera, lower, with the hatch wall, the deck and the stools left out (every circuit up from the board to the
          ceiling, along its own track and down to its points, every point tagged), the same view rendered, then each
          device on its own. All from bar.html?view=electric. */}
      <ServiceSection id="electrical" title={t.electric}
        diagram={<PowerDiagram supply={ELECTRIC.supply} circuits={ELECTRIC.circuits} colours={ELECTRIC.colours}
          notes={w.electric.notes(Math.round(ELECTRIC.circuits.reduce((n, c) => n + c.kw, 0) * 10) / 10)}
          label={w.electric.label(ELECTRIC.circuits.length)} />}
        figure={<TaggedFigure table="/docs/bar/electric" src={`${D}/render/electric-line.png`} aspect={electricTags.aspect} tags={electricTags.tags.filter((t) => !OUTSIDE.includes(t.id))}
          alt={w.electric.figureAlt}
          info={Object.fromEntries(ELECTRIC.points.filter((p) => p.at).map((p) => [p.id, { label: p.what, colour: circuitColour(p) }]))} />}
        note={w.electric.note(link)}
        real={{ src: `${D}/render/electric-real.webp`, width: 2400, height: 1100,
          caption: w.electric.caption,
          alt: w.electric.realAlt }}
        rail={electricRail(lang)} />

      {/* Plumbing, in the studio's pattern: the bar's water drawn full width, then the installation in the same lower
          camera with the units opened too (render/water-line.png: the fit-out in grey, every run in its colour, dashed under the floor, every point
          tagged), the same view rendered, then each part on its own. All from bar.html?view=water. */}
      <ServiceSection id="plumbing" title={t.plumbing}
        diagram={<WaterDiagram runs={WATER.runs} colours={WATER.colours}
          valve={{ id: "SV", ...w.water.valve }}
          heater={{ id: "WH", ...w.water.heater(WATER.heater.litres) }}
          outlets={[
            { id: "SF", ...w.water.outlets.SF, cold: true },
            { id: "EM", ...w.water.outlets.EM, cold: true, drain: "D2" },
            { id: "ST", ...w.water.outlets.ST, cold: true, hot: true, drain: "D1", aav: true },
          ]}
          trap={{ id: "GT", ...w.water.trap }}
          notes={w.water.notes}
          label={w.water.label} />}
        figure={<TaggedFigure table="/docs/bar/plumbing" src={`${D}/render/water-line.png`} aspect={waterTags.aspect} tags={waterTags.tags}
          alt={w.water.figureAlt}
          info={Object.fromEntries(WATER.points.filter((p) => p.at).map((p) => [p.id, { label: p.what, colour: waterColour(p) }]))} />}
        note={w.water.note(link)}
        real={{ src: `${D}/render/water-real.webp`, width: 2400, height: 1100,
          caption: w.water.caption,
          alt: w.water.realAlt }}
        rail={waterRail(lang)} />

      <DocsSection cards={w.docs} />
    </main>
  )
}
