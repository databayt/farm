import type { Metadata } from "next"
import { LocaleLink as Link } from "@/components/internationalization/locale-link"

import { DocsSection, DrawingSection, ModelSection, PageHero, RailSection, ServiceSection } from "@/components/page/sections"
import { tagInfo } from "@/components/docs/room-points"
import { RoomWiring } from "@/components/docs/room-wiring"
import { TaggedFigure } from "@/components/docs/tagged-figure"
import { bathRail, bedRail, electricRail, roomRail } from "@/components/guest-room/rails"
import { circuits, D, E, guestRoomData } from "@/components/guest-room/data"
import { words } from "@/components/guest-room/words"
import { dictionary } from "@/components/internationalization/dictionaries"
import { hasLocale, i18n } from "@/components/internationalization/config"
import { getLocale } from "@/components/internationalization/locale"
import { GuestRoomPlan } from "@/components/guest-room/guest-room-plan"
import electricTags from "../../../../../public/designs/guest-room/render/electric-tags.json"

// One guest room, in /en/studio's pattern: the hero, the 2D and the 3D, the rails, Electric, then the docs cards; the
// points table and the status are on /docs/guest-room-points. Both drawings read src/components/guest-room/guest-room.json: a third of the saffron container block from the footage, a
// barred window and a red door onto the timber veranda, a double bed under the back window, a wardrobe and a
// desk beside it, the en-suite (shower, WC, basin) across the front-left corner (D-061), two chairs and a table outside.

export async function generateMetadata({ params }: PageProps<"/[lang]/guest-room">): Promise<Metadata> {
  const { lang } = await params
  return words[hasLocale(lang) ? lang : i18n.defaultLocale].meta
}

// The Electric section: room.electric (guest-room.json, read in data.ts), drawn by RoomWiring, rendered by
// guest-room.html?view=electric
const designA = Math.round(circuits.reduce((n, c) => n + (c.design_A ?? 0), 0) * 10) / 10

export default async function GuestRoomPage() {
  const lang = await getLocale()
  const w = words[lang], t = dictionary(lang).page
  const { points, circuits: wired } = guestRoomData(lang)
  const link = (href: string, text: string) => <Link href={href} className="underline underline-offset-4">{text}</Link>
  return (
    <main className="w-full flex-1">
      {/* First screen: the founder's Nano Banana render of the guest-room block (2026-10-30), made from the brief in
          ~/Desktop/guest-room-nano-banana; master kept at assets/guest-room/hero-gemini.png (1671 x 941, the barred-window
          variant beside it), upscaled to 2400 x 1340. It departs from the drawings: a teal block, not saffron; cream
          doors and plain windows, not red barred ones; a timber pergola over the veranda, a step to each room. The
          block fills the middle, so the words sit on the lawn bottom-left. */}
      <PageHero src={`${D}/render/guest-room-hero.jpg`} width={2400} height={1340} className="bg-[#8a9a52]" imgClassName="object-[50%_55%]"
        title={w.hero.title}
        alt={w.hero.alt} />

      {/* 2D, full screen: the room's plan (src/components/guest-room/guest-room-plan.tsx), in the text colour,
          measured as the studio's plan is. */}
      <DrawingSection id="plans" title={t.plan}>
        <GuestRoomPlan className="h-auto w-full lg:h-full lg:w-auto" />
      </DrawingSection>

      {/* 3D, in the 2D section's pattern: a line drawing of the room seen from the front with its front wall
          and ceiling off, then the same view rendered. Both from scripts/site/render/guest-room.html. */}
      <ModelSection line={`${D}/render/guest-room-line.png`} real={`${D}/render/guest-room-real.webp`} width={2400} height={1800}
        lineAlt={w.model.lineAlt}
        realAlt={w.model.realAlt} />

      {/* The rails, in the studio's pattern: each piece on its own (guest-room.html?item=<id>), the card in focus
          showing its size, source and cost below. */}
      <RailSection id="bedroom" title={w.sections.bed} items={bedRail(lang)} />
      <RailSection id="furniture" title={w.sections.room} items={roomRail(lang)} />
      <RailSection id="bathroom" title={w.sections.bath} items={bathRail(lang)} />

      {/* Electric, in the studio's pattern: the room's wiring drawn full width from the farm's supply to every circuit,
          then the installation in the 3D view's camera (render/electric-line.png, every run in its circuit's colour,
          every point tagged), the finished room (render/electric-real.webp), then each device on its own. All three from
          scripts/site/render/guest-room.html?view=electric and ?item=<model>, built from guest-room.json. */}
      <ServiceSection id="electrical" title={t.electric}
        diagram={<RoomWiring circuits={wired} mainA={E.main_A} board={w.electric.board}
          supply={w.electric.supply}
          notes={w.electric.notes(designA, E.main_A)} />}
        figure={<TaggedFigure table="/docs/guest-room/electric" src={`${D}/render/electric-line.png`} aspect={electricTags.aspect} tags={electricTags.tags}
          alt={w.electric.figureAlt}
          info={tagInfo(points, wired)} />}
        note={w.electric.note(link)}
        real={{ src: `${D}/render/electric-real.webp`, width: 2400, height: 1800, caption: t.rendered,
          alt: w.electric.realAlt }}
        rail={electricRail(lang)} />

      <DocsSection cards={w.docs} />
    </main>
  )
}
