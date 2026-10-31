import type { Metadata } from "next"
import { LocaleLink as Link } from "@/components/internationalization/locale-link"

import { DocsSection, DrawingSection, ModelSection, PageHero, RailSection, ServiceSection } from "@/components/page/sections"
import { TaggedFigure } from "@/components/docs/tagged-figure"
import { electricRail, equipmentRail, waterRail } from "@/components/galley/rails"
import { circuitColour, D, galleyData, waterColour } from "@/components/galley/data"
import { words } from "@/components/galley/words"
import { dictionary } from "@/components/internationalization/dictionaries"
import { hasLocale, i18n } from "@/components/internationalization/config"
import { getLocale } from "@/components/internationalization/locale"
import { GalleyPlan } from "@/components/galley/galley-plan"
import { PowerDiagram, WaterDiagram } from "@/components/galley/service-diagrams"
import electricTags from "../../../../../public/designs/galley/render/electric-tags.json"
import waterTags from "../../../../../public/designs/galley/render/water-tags.json"

// The galley, in /en/studio's pattern: the hero, the 2D and the 3D, the Equipment rail, Electric and Plumbing, then the
// docs cards; its points, circuits and runs are on its docs pages (/docs/galley). Both drawings read
// src/components/galley/galley.json: the teal 40 ft container on its stone plinth beside the study room, two doors
// and two windows on the courtyard side, fitted as the staff kitchen that cooks breakfast and dinner for a full
// house (D-028, D-031): the founder's long worktop with two sinks under the windows, the stores by the staff door,
// a cooking line under an extract hood, and the pass by the service door.

export async function generateMetadata({ params }: PageProps<"/[lang]/galley">): Promise<Metadata> {
  const { lang } = await params
  return words[hasLocale(lang) ? lang : i18n.defaultLocale].meta
}

export default async function GalleyPage() {
  const lang = await getLocale()
  const w = words[lang], t = dictionary(lang).page
  const { ELECTRIC, WATER } = galleyData(lang)
  const link = (href: string, text: string) => <Link href={href} className="underline underline-offset-4">{text}</Link>
  return (
    <main className="w-full flex-1">
      {/* First screen: the founder's Nano Banana render of the galley (2026-10-30, second version), made from the
          brief in ~/Desktop/galley-nano-banana; master kept at assets/galley/hero-gemini.png (1536 x 1024, the first
          version beside it as hero-gemini-1.png), cut to 2400 x 1340. It departs from the drawings in one thing: the
          doors are cream, not red. The galley sits centre, so the words keep the lawn bottom-left. */}
      <PageHero src={`${D}/render/galley-hero.jpg`} width={2400} height={1340} className="bg-[#8a9a52]" imgClassName="object-[55%_50%]"
        title={w.hero.title}
        alt={w.hero.alt} />

      {/* 2D, full screen: the galley's plan (src/components/galley/galley-plan.tsx), in the text colour. It is
          long, so it takes the full width. */}
      <DrawingSection id="plans" title={t.plan}>
        <GalleyPlan className="h-auto w-full lg:h-full lg:w-auto lg:max-w-full" />
      </DrawingSection>

      {/* 3D, in the 2D section's pattern: a line drawing of the galley seen from the courtyard with its front wall
          and roof off, then the same view rendered. Both from scripts/site/render/galley.html. */}
      <ModelSection line={`${D}/render/galley-line.png`} real={`${D}/render/galley-real.webp`} width={2400} height={1000}
        lineAlt={w.model.lineAlt}
        realAlt={w.model.realAlt} />

      {/* Equipment: one card per piece, rendered on its own from the 3D's meshes (galley.html?item=<id>) */}
      <RailSection id="equipment" title={t.equipment} items={equipmentRail(lang)} />

      {/* Electric, in the studio's pattern: the galley's single line drawn full width, then the installation in the 3D
          view's camera (render/electric-line.png: every circuit up from the board into the ceiling, along its own track
          and down to its points, every point tagged), the same view rendered, then each device on its own. All from
          galley.html?view=electric, built from galley.json's electric. */}
      <ServiceSection id="electrical" title={t.electric}
        diagram={<PowerDiagram supply={ELECTRIC.supply} circuits={ELECTRIC.circuits} colours={ELECTRIC.colours}
          notes={w.electric.notes(Math.round(ELECTRIC.circuits.reduce((n, c) => n + c.kw, 0)))}
          label={w.electric.label(ELECTRIC.circuits.length)} />}
        figure={<TaggedFigure table="/docs/galley/electric" src={`${D}/render/electric-line.png`} aspect={electricTags.aspect} tags={electricTags.tags}
          alt={w.electric.figureAlt}
          info={Object.fromEntries(ELECTRIC.points.filter((p) => p.at).map((p) => [p.id, { label: p.what, colour: circuitColour(p) }]))} />}
        note={w.electric.note(link)}
        real={{ src: `${D}/render/electric-real.webp`, width: 2400, height: 1000, caption: w.electric.caption,
          alt: w.electric.realAlt }}
        rail={electricRail(lang)} />

      {/* Plumbing, in the studio's pattern: the galley's water drawn full width, then the installation in the 3D
          view's camera (render/water-line.png: the fit-out in grey, every run in its colour, dashed under the floor,
          every point tagged), the same view rendered (render/water-real.webp), then each part on its own. All from
          galley.html?view=water, built from galley.json's water. */}
      <ServiceSection id="plumbing" title={t.plumbing}
        diagram={<WaterDiagram runs={WATER.runs} colours={WATER.colours}
          valve={{ id: "SV", ...w.water.valve }}
          heater={{ id: "WH", ...w.water.heater(WATER.heater.litres, WATER.heater.kw) }}
          outlets={[
            { id: "HB", ...w.water.outlets.HB, cold: true, hot: true, drain: "D2" },
            { id: "DF", ...w.water.outlets.DF, cold: true },
            { id: "PS", ...w.water.outlets.PS, cold: true, hot: true, drain: "D3" },
            { id: "WS", ...w.water.outlets.WS, cold: true, hot: true, drain: "D4", aav: true },
            { id: "PR", ...w.water.outlets.PR, cold: true, hot: true },
            { id: "FG", ...w.water.outlets.FG, drain: "D5" },
            { id: "D6", ...w.water.outlets.D6, cold: true, drain: "D6" },
          ]}
          trap={{ id: "GT", ...w.water.trap }}
          notes={w.water.notes}
          label={w.water.label} />}
        figure={<TaggedFigure table="/docs/galley/plumbing" src={`${D}/render/water-line.png`} aspect={waterTags.aspect} tags={waterTags.tags}
          alt={w.water.figureAlt}
          info={Object.fromEntries(WATER.points.filter((p) => p.at).map((p) => [p.id, { label: p.what, colour: waterColour(p) }]))} />}
        note={w.water.note(link)}
        real={{ src: `${D}/render/water-real.webp`, width: 2400, height: 1000, caption: w.water.caption,
          alt: w.water.realAlt }}
        rail={waterRail(lang)} />

      <DocsSection cards={w.docs} />
    </main>
  )
}
