import type { Metadata } from "next"
import { LocaleLink as Link } from "@/components/internationalization/locale-link"

import { DocsSection, DrawingSection, ModelSection, PageHero, RailSection, ServiceSection } from "@/components/page/sections"
import { tagInfo } from "@/components/docs/room-points"
import { RoomWiring } from "@/components/docs/room-wiring"
import { TaggedFigure } from "@/components/docs/tagged-figure"
import { electricRail, furnitureRail, networkRail } from "@/components/office/rails"
import { circuits, D, E, officeData } from "@/components/office/data"
import { words } from "@/components/office/words"
import { dictionary } from "@/components/internationalization/dictionaries"
import { hasLocale, i18n } from "@/components/internationalization/config"
import { getLocale } from "@/components/internationalization/locale"
import { NetworkDiagram } from "@/components/office/network-diagram"
import { OfficePlan } from "@/components/office/office-plan"
import electricTags from "../../../../../public/designs/office/render/electric-tags.json"
import networkTags from "../../../../../public/designs/office/render/network-tags.json"

// The office, in /en/studio's pattern: the hero, the 2D and the 3D, the rail, Electric and Network, then the docs
// cards; the points tables and the status are on /docs/office-points. Both drawings read src/components/office/office.json: the saffron 20 ft container raised on its steel frame, first in the
// south row beside the studios, with a deck, railings and a stair in front, furnished as the farm's
// reception and work office.

export async function generateMetadata({ params }: PageProps<"/[lang]/office">): Promise<Metadata> {
  const { lang } = await params
  return words[hasLocale(lang) ? lang : i18n.defaultLocale].meta
}

// The Electric and Network sections: office.json `electric` and `network` (read in data.ts), drawn by RoomWiring and
// NetworkDiagram, rendered by office.html?view=electric|network
const designA = Math.round(circuits.reduce((n, c) => n + (c.design_A ?? 0), 0) * 10) / 10

export default async function OfficePage() {
  const lang = await getLocale()
  const w = words[lang], t = dictionary(lang).page
  const { points, netPoints, circuits: wired, netLinks, netCircuits } = officeData(lang)
  const link = (href: string, text: string) => <Link href={href} className="underline underline-offset-4">{text}</Link>
  return (
    <main className="w-full flex-1">
      {/* First screen: the founder's Nano Banana render of the office (2026-10-30), made from the brief in
          ~/Desktop/office-nano-banana; master kept at assets/office/hero-gemini.jpg (1024 px), upscaled to 2400 x 1340.
          It departs from the drawings: a navy container, glass across the whole front, a low deck with no railings or
          stair. The container sits centre, so the words keep the lawn bottom-left. */}
      <PageHero src={`${D}/render/office-hero.jpg`} width={2400} height={1340} className="bg-[#7d8f5a]" imgClassName="object-[50%_55%]"
        title={w.hero.title}
        alt={w.hero.alt} />

      {/* 2D, full screen: the office's plan (src/components/office/office-plan.tsx), in the text colour. */}
      <DrawingSection id="plans" title={t.plan}>
        <OfficePlan className="h-auto w-full lg:h-full lg:w-auto" />
      </DrawingSection>

      {/* 3D, in the 2D section's pattern: a line drawing of the office seen from the front with its front wall
          and roof off, then the same view rendered. Both from scripts/site/render/office.html. */}
      <ModelSection line={`${D}/render/office-line.png`} real={`${D}/render/office-real.webp`} width={2400} height={1100}
        lineAlt={w.model.lineAlt}
        realAlt={w.model.realAlt} />

      {/* The rail, in the studio's pattern: each piece on its own (office.html?item=<id>), the card in focus showing its
          size, source and cost below. */}
      <RailSection id="furniture" title={w.sections.furniture} items={furnitureRail(lang)} />

      {/* Electric, in the studio's pattern: the office's wiring drawn full width from the farm's supply to every circuit,
          the installation in the 3D view's camera (render/electric-line.png, every run in its circuit's colour, every
          point tagged), the finished office (render/electric-real.webp),
          then each device on its own. All from scripts/site/render/office.html?view=electric and ?item=<model>. */}
      <ServiceSection id="electrical" title={t.electric}
        diagram={<RoomWiring circuits={wired} mainA={E.main_A} board={w.electric.board}
          supply={w.electric.supply}
          notes={w.electric.notes(designA, E.main_A)} />}
        figure={<TaggedFigure table="/docs/office/electric" src={`${D}/render/electric-line.png`} aspect={electricTags.aspect} tags={electricTags.tags}
          alt={w.electric.figureAlt}
          info={tagInfo(points, wired)} />}
        note={w.electric.note(link)}
        real={{ src: `${D}/render/electric-real.webp`, width: 2400, height: 1100, caption: t.rendered,
          alt: w.electric.realAlt }}
        rail={electricRail(lang)} />

      {/* Network, in the Electric section's pattern: the farm's network from the office (the IoT architecture's base,
          taken as the office [A]) drawn full width, then the installation in the 3D view's camera (render/network-line.png,
          every cable in its colour, every point tagged), then each part on its own (office.html?item=<model>). */}
      <ServiceSection id="network" title={w.sections.network}
        diagram={<NetworkDiagram links={netCircuits} points={netPoints} />}
        figure={<TaggedFigure table="/docs/office/electric" src={`${D}/render/network-line.png`} aspect={networkTags.aspect} tags={networkTags.tags}
          alt={w.network.figureAlt}
          info={tagInfo(netPoints, netLinks)} />}
        note={w.network.note(link)}
        rail={networkRail(lang)} />

      <DocsSection cards={w.docs} />
    </main>
  )
}
