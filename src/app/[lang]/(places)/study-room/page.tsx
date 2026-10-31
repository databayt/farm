import type { Metadata } from "next"
import { LocaleLink as Link } from "@/components/internationalization/locale-link"

import { DocsSection, DrawingSection, ModelSection, PageHero, RailSection, ServiceSection } from "@/components/page/sections"
import { tagInfo } from "@/components/docs/room-points"
import { RoomWiring } from "@/components/docs/room-wiring"
import { TaggedFigure } from "@/components/docs/tagged-figure"
import { cornerRail, electricRail, tableRail } from "@/components/study-room/rails"
import { circuits, D, E, studyRoomData } from "@/components/study-room/data"
import { words } from "@/components/study-room/words"
import { dictionary } from "@/components/internationalization/dictionaries"
import { hasLocale, i18n } from "@/components/internationalization/config"
import { getLocale } from "@/components/internationalization/locale"
import { StudyRoomPlan } from "@/components/study-room/study-room-plan"
import electricTags from "../../../../../public/designs/study-room/render/electric-tags.json"

// The study room, in /en/studio's pattern: the hero, the 2D and the 3D, the rails, Electric with the Wi-Fi, then the
// docs cards; the points table and the status are on /docs/study-room-points. Both drawings read
// src/components/study-room/study-room.json: the compound's teal 40 ft container on a stone plinth, glazed
// doors behind timber louvres onto a 2 m deck, furnished with one long table for eight, a screen wall, a bookshelf
// wall and a reading corner.

export async function generateMetadata({ params }: PageProps<"/[lang]/study-room">): Promise<Metadata> {
  const { lang } = await params
  return words[hasLocale(lang) ? lang : i18n.defaultLocale].meta
}

// The Electric section: study-room.json `electric` and `network` (the Wi-Fi; read in data.ts), drawn by RoomWiring,
// rendered by study-room.html?view=electric
const designA = Math.round(circuits.reduce((n, c) => n + (c.design_A ?? 0), 0) * 10) / 10

export default async function StudyRoomPage() {
  const lang = await getLocale()
  const w = words[lang], t = dictionary(lang).page
  const { points, circuits: wired, allLinks } = studyRoomData(lang)
  const link = (href: string, text: string) => <Link href={href} className="underline underline-offset-4">{text}</Link>
  return (
    <main className="w-full flex-1">
      {/* First screen: the founder's Nano Banana render of the study room (2026-10-31); master kept at
          assets/study-room/hero-gemini.jpeg (2752 x 1536), cut to 2400 x 1340. It departs from the drawings in two
          things: no timber louvres over the glazing, and the middle doors stand open. The room sits centre with the
          deck across the bottom, so the image centres. */}
      <PageHero src={`${D}/render/study-room-hero.jpg`} width={2400} height={1340} className="bg-[#c9a36a]" imgClassName="object-[50%_50%]"
        title={w.hero.title}
        alt={w.hero.alt} />

      {/* 2D, full screen: the study room's plan (src/components/study-room/study-room-plan.tsx), in the text
          colour. It is long, so it takes the full width. */}
      <DrawingSection id="plans" title={t.plan}>
        <StudyRoomPlan className="h-auto w-full lg:h-full lg:w-auto lg:max-w-full" />
      </DrawingSection>

      {/* 3D, in the 2D section's pattern: a line drawing of the study room seen from the deck with its front
          wall off, then the same view rendered. Both from scripts/site/render/study-room.html. */}
      <ModelSection line={`${D}/render/study-room-line.png`} real={`${D}/render/study-room-real.webp`} width={2400} height={1000}
        lineAlt={w.model.lineAlt}
        realAlt={w.model.realAlt} />

      {/* The rails, in the studio's pattern: each piece on its own (study-room.html?item=<id>), the card in focus
          showing its size, source and cost below. */}
      <RailSection id="table" title={w.sections.table} items={tableRail(lang)} />
      <RailSection id="reading" title={w.sections.reading} items={cornerRail(lang)} />

      {/* Electric, in the studio's pattern: the room's wiring drawn full width from the farm's supply to every circuit,
          then the installation in the 3D view's camera with the Wi-Fi's cables too (render/electric-line.png, every run
          in its colour, every point tagged), the finished room (render/electric-real.webp), then each device on its own.
          All from scripts/site/render/study-room.html?view=electric and ?item=<model>, built from study-room.json. */}
      <ServiceSection id="electrical" title={t.electric}
        diagram={<RoomWiring circuits={wired} mainA={E.main_A} board={w.electric.board}
          supply={w.electric.supply}
          notes={w.electric.notes(designA, E.main_A)} />}
        figure={<TaggedFigure table="/docs/study-room/electric" src={`${D}/render/electric-line.png`} aspect={electricTags.aspect} tags={electricTags.tags}
          alt={w.electric.figureAlt}
          info={tagInfo(points, allLinks)} />}
        note={w.electric.note(link)}
        real={{ src: `${D}/render/electric-real.webp`, width: 2400, height: 1000, caption: t.rendered,
          alt: w.electric.realAlt }}
        rail={electricRail(lang)} />

      <DocsSection cards={w.docs} />
    </main>
  )
}
