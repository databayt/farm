import type { Metadata } from "next"
import { LocaleLink as Link } from "@/components/internationalization/locale-link"

import { DocsSection, DrawingSection, ModelSection, PageHero, RailSection, ServiceSection } from "@/components/page/sections"
import { BuildUp } from "@/components/docs/build-up"
import { TaggedFigure } from "@/components/docs/tagged-figure"
import { electricRail, fixturesRail, plumbingRail } from "@/components/public-bathroom/rails"
import { bathData, D } from "@/components/public-bathroom/data"
import { words } from "@/components/public-bathroom/words"
import { dictionary } from "@/components/internationalization/dictionaries"
import { hasLocale, i18n } from "@/components/internationalization/config"
import { getLocale } from "@/components/internationalization/locale"
import { PublicBathroomPlan } from "@/components/public-bathroom/public-bathroom-plan"
import { BathPipeDiagram, BathWiringDiagram } from "@/components/public-bathroom/services"
import electricTags from "../../../../../public/designs/public-bathroom/render/electric-tags.json"
import plumbingTags from "../../../../../public/designs/public-bathroom/render/plumbing-tags.json"
import topPieces from "../../../../../public/designs/public-bathroom/render/top-pieces.json"

// The public bathroom, in /en/studio's pattern: the hero, the 2D and the 3D, then how it is built, its fixtures, its two
// services, Electric and Plumbing, and the docs cards; the points tables and the status are on
// its docs pages (/docs/public-bathroom). Every drawing reads src/components/public-bathroom/public-bathroom.json:
// the teal 20 ft container on its stone plinth beside the galley, one door and two high windows toward the courtyard;
// inside, the founder's two toilet rooms, two hand basins and a urinal (D-022). Every size, run and device is an
// assumption [A]; nothing is sourced or priced yet, so no card names a shop or a price.

export async function generateMetadata({ params }: PageProps<"/[lang]/public-bathroom">): Promise<Metadata> {
  const { lang } = await params
  return words[hasLocale(lang) ? lang : i18n.defaultLocale].meta
}

export default async function PublicBathroomPage() {
  const lang = await getLocale()
  const w = words[lang], t = dictionary(lang).page
  const { info } = bathData(lang)
  const link = (href: string, text: string) => <Link href={href} className="underline underline-offset-4">{text}</Link>
  return (
    <main className="w-full flex-1">
      {/* First screen: the founder's Nano Banana render of the bathroom (2026-10-31), made from the brief in
          ~/Desktop/public-bathroom-nano-banana; master kept at assets/public-bathroom/hero-gemini.jpeg (2752 x 1536),
          cut to 2400 x 1340. It departs from the drawings in three things: the door opens out, not in; only one of the
          two basins shows through it; and flower beds run along both ends. The words keep the lawn bottom-left. */}
      <PageHero src={`${D}/render/public-bathroom-hero.jpg`} width={2400} height={1340} className="bg-[#2f6a74]" imgClassName="object-[50%_55%]"
        title={w.hero.title}
        alt={w.hero.alt} />

      {/* 2D, full screen: the bathroom's plan (src/components/public-bathroom/public-bathroom-plan.tsx), in the text
          colour. */}
      <DrawingSection id="plans" title={t.plan}>
        <PublicBathroomPlan className="h-auto w-full lg:h-full lg:w-auto" />
      </DrawingSection>

      {/* 3D, in the 2D section's pattern: a line drawing of the bathroom seen from the courtyard with its front wall
          and roof off, then the same view rendered. Both from scripts/site/render/public-bathroom.html. */}
      <ModelSection line={`${D}/render/public-bathroom-line.png`} real={`${D}/render/public-bathroom-real.webp`} width={2400} height={1100}
        lineAlt={w.model.lineAlt}
        realAlt={w.model.realAlt} />

      {/* Build, pinned while the bathroom goes up in fast motion, seen from straight above with the roof off: the box,
          the first fix, the partitions, the floor tiles, the fittings. Renders: public-bathroom.html?top=<layer>, each
          layer masked by the ones built before it; the piece rectangles in top-pieces.json. */}
      <section id="build">
        <BuildUp title={w.build.title} base={`${D}/render/top-base.webp`} aspect={topPieces.aspect}
          baseAlt={w.build.baseAlt}
          builds={[
            { secs: 2.4, label: w.build.labels[0], groups: [
              { src: `${D}/render/top-pipes.webp`, rects: topPieces.tags.pipes, kind: "wipe", from: 0, to: 0.85 },
            ] },
            { secs: 2, label: w.build.labels[1], groups: [
              { src: `${D}/render/top-walls.webp`, rects: topPieces.tags.walls, kind: "drop", from: 0, to: 0.8, rise: 40 },
            ] },
            { secs: 2, label: w.build.labels[2], groups: [
              { src: `${D}/render/top-floor.webp`, rects: topPieces.tags.floor, kind: "drop", from: 0, to: 0.8, rise: 24 },
            ] },
            { secs: 2.6, label: w.build.labels[3], groups: [
              { src: `${D}/render/top-fittings.webp`, rects: topPieces.tags.fittings, kind: "drop", from: 0, to: 0.85, rise: 30 },
            ] },
          ]}
          stages={w.build.stages} />
      </section>

      {/* Fixtures: one card per piece, the card in focus shows its size, source and cost below. */}
      <RailSection id="fixtures" title={w.fixtures} items={fixturesRail(lang)} />

      {/* Electric, in the studio's pattern: the bathroom's board and circuits (services.tsx), the 3D's view with every cable
          route in its circuit's colour and every device tagged (render/electric-line.png), the same view rendered at
          dusk with the lights on (render/electric-real.webp), then each device. public-bathroom.html?view=electric. */}
      <ServiceSection id="electrical" title={t.electric}
        diagram={<BathWiringDiagram />}
        figure={<TaggedFigure table="/docs/public-bathroom/electric" src={`${D}/render/electric-line.png`} aspect={electricTags.aspect} tags={electricTags.tags} info={info}
          alt={w.electric.figureAlt} />}
        note={w.electric.note(link)}
        real={{ src: `${D}/render/electric-real.webp`, width: 2400, height: 1100, caption: w.electric.caption,
          alt: w.electric.realAlt }}
        rail={electricRail(lang)} />

      {/* Plumbing, in the same pattern: the water drawn full width from the farm's tank to every outlet and on to the
          septic tank (services.tsx), then the 3D's view with every run in its colour, dashed where a wall, the floor or
          the plinth hides it, every fitting tagged (render/plumbing-line.png), the same view rendered with the floor,
          the tiles and the plinth see-through (render/plumbing-real.webp), then each part on its own. All from
          public-bathroom.html?view=plumbing and ?item=. */}
      <ServiceSection id="plumbing" title={t.plumbing}
        diagram={<BathPipeDiagram />}
        figure={<TaggedFigure table="/docs/public-bathroom/plumbing" src={`${D}/render/plumbing-line.png`} aspect={plumbingTags.aspect} tags={plumbingTags.tags} info={info}
          alt={w.plumbing.figureAlt} />}
        note={w.plumbing.note(link)}
        real={{ src: `${D}/render/plumbing-real.webp`, width: 2400, height: 1100,
          caption: w.plumbing.caption,
          alt: w.plumbing.realAlt }}
        rail={plumbingRail(lang)} />

      <DocsSection cards={w.docs} />
    </main>
  )
}
