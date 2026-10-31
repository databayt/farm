import type { Metadata } from "next"
import { LocaleLink as Link } from "@/components/internationalization/locale-link"

import { frw } from "@/lib/format"
import { DocsSection, DrawingSection, ModelSection, PageHero, RailSection, ServiceSection } from "@/components/page/sections"
import { BuildUp } from "@/components/docs/build-up"
import { TaggedFigure } from "@/components/docs/tagged-figure"
import { animalRail, manureRail, waterRail, yardRail } from "@/components/livestock/rails"
import { D, days, high, low, peak, POINT_COLOUR, pointsFor, tank, yardM } from "@/components/livestock/data"
import livestock from "@/components/livestock/livestock.json"
import { words } from "@/components/livestock/words"
import { dictionary } from "@/components/internationalization/dictionaries"
import { hasLocale, i18n } from "@/components/internationalization/config"
import { getLocale } from "@/components/internationalization/locale"
import { LivestockPlan } from "@/components/livestock/livestock-plan"
import { ManureDiagram } from "@/components/livestock/manure-diagram"
import { WaterDiagram } from "@/components/livestock/water-diagram"
import buildPieces from "../../../../../public/designs/livestock/render/build-pieces.json"
import waterTags from "../../../../../public/designs/livestock/render/water-tags.json"

// The livestock yard, in /en/studio's pattern: the hero, the 2D and the 3D, the shed's build-up, the animal and yard
// rails, Water and Manure, then the docs cards; the water points, what the yard drinks and the status are on
// its docs pages (/docs/livestock). Both drawings read src/components/livestock/livestock.json: the starting herd of 6 goats and 4 sheep (D-030) in a thatched pole
// shelter's open hall (D-037) inside one outline (D-039), opening onto the village yard they share by day with the
// farm friends, 3 cats and the doves, and with the guests (D-038, D-040); the 2 guard dogs' run, the feed store, the
// tank and the compost bays that close the loop to the field. Every size is an assumption until the farm's vet
// checks it.

export async function generateMetadata({ params }: PageProps<"/[lang]/livestock">): Promise<Metadata> {
  const { lang } = await params
  return words[hasLocale(lang) ? lang : i18n.defaultLocale].meta
}

const { pens: PN, compost: CO, shelter: SH } = livestock


export default async function LivestockPage() {
  const lang = await getLocale()
  const w = words[lang], t = dictionary(lang).page
  const link = (href: string, text: string) => <Link href={href} className="underline underline-offset-4">{text}</Link>
  return (
    <main className="w-full flex-1">
      {/* First screen: the founder's Nano Banana remake (2026-10-29, D-046) of the reference photo on the farm: the shed,
          the lashed rails and the baskets of the photo, the yard open on Rwanda's terraced green hills with eucalyptus
          and banana plants, the herd in the yard and two sheep in the shed, the dovecote, the cats' house, the tank, the
          compost bays and the dogs' kennels. Served at its native 1678 x 937 (original: assets/livestock/hero-gemini.png). */}
      <PageHero src={`${D}/render/livestock-hero.jpg`} width={1678} height={937} className="bg-[#b9bdb4]" imgClassName="object-[55%_55%]"
        title={w.hero.title}
        alt={w.hero.alt} />

      {/* 2D, full screen: the house's plan (src/components/livestock/livestock-plan.tsx), in the text colour. */}
      <DrawingSection id="plans" title={t.plan}>
        <LivestockPlan className="h-auto w-full lg:h-full lg:w-auto" />
      </DrawingSection>

      {/* 3D, in the 2D section's pattern: the yard seen straight on from the paddock with the roof off, as a line
          drawing, then rendered. Both from scripts/site/render/livestock.html. */}
      <ModelSection line={`${D}/render/livestock-line.png`} real={`${D}/render/livestock-real.webp`} width={2400} height={1400}
        lineAlt={w.model.lineAlt}
        realAlt={w.model.realAlt} />

      {/* Shed, pinned while it goes up in fast motion, seen low from the front: the stone-edged plinth, the barked frame,
          the boards, the thatch, then the straw and the fittings. Renders: livestock.html?build=<layer>; the pieces'
          rectangles: render/build-pieces.json. */}
      <section id="shed">
        <BuildUp title={w.shed.title} base={`${D}/render/build-base.webp`} aspect={buildPieces.aspect}
          baseAlt={w.shed.baseAlt}
          builds={[
            { secs: 2.6, label: w.shed.builds[0], groups: [
              { src: `${D}/render/build-posts.webp`, rects: buildPieces.posts, kind: "drop", from: 0, to: 0.4, rise: 60 },
              { src: `${D}/render/build-beams.webp`, rects: buildPieces.beams, kind: "drop", from: 0.45, to: 0.85, rise: 40 },
            ] },
            { secs: 2.8, label: w.shed.builds[1], groups: [
              { src: `${D}/render/build-boards.webp`, rects: buildPieces.boards, kind: "drop", from: 0, to: 0.85, rise: 30 },
            ] },
            { secs: 2.6, label: w.shed.builds[2], groups: [
              { src: `${D}/render/build-rafters.webp`, rects: buildPieces.rafters, kind: "drop", from: 0, to: 0.3, rise: 40 },
              { src: `${D}/render/build-thatch.webp`, rects: buildPieces.thatch, kind: "spray", from: 0.4, to: 0.9 },
            ] },
            { secs: 2.2, label: w.shed.builds[3], groups: [
              { src: `${D}/render/build-litter.webp`, rects: buildPieces.litter, kind: "wipe", from: 0, to: 0.4 },
              { src: `${D}/render/build-fit.webp`, rects: buildPieces.fit, kind: "drop", from: 0.45, to: 0.9, rise: 30 },
            ] },
          ]}
          stages={w.shed.stages({ l: SH.l, d: SH.d, plinth: SH.plinth.h * 100, eaves: SH.roof.eaves, ridge: SH.roof.ridge, over: SH.roof.over,
            perHead: frw(Math.round((SH.l * SH.d) / PN.head * 10) / 10), head: PN.head })} />
      </section>

      {/* Animals and the yard's things: one card each, rendered on its own from the 3D's meshes; the card in focus shows
          its numbers below. */}
      <RailSection id="animals" title={w.sections.animals} items={animalRail(lang)} />
      <RailSection id="yard" title={w.sections.yard} items={yardRail(lang)} />

      {/* Water, in the studio's Plumbing pattern: the yard's water drawn full width from the farm's line to every trough
          (water-diagram.tsx), then the yard closer in with every run in its colour and every point tagged
          (render/water-line.png, water-tags.json), the same view rendered (render/water-real.webp), then each part on
          its own. All from livestock.html?view=water and ?item=, built from livestock.json's water section. */}
      <ServiceSection id="water" title={w.sections.water}
        diagram={<WaterDiagram tank={tank} yardM={yardM} need={[Math.round(low), Math.round(high)]} peak={Math.round(peak)} days={days} />}
        figure={<TaggedFigure table="/docs/livestock/water" src={`${D}/render/water-line.png`} aspect={waterTags.aspect} tags={waterTags.tags}
          alt={w.water.figureAlt}
          info={Object.fromEntries(pointsFor(lang).map((p) => [p.id, { label: p.what, colour: POINT_COLOUR[p.id] }]))} />}
        note={w.water.note(link)}
        real={{ src: `${D}/render/water-real.webp`, width: 2400, height: 1400,
          caption: w.water.caption,
          alt: w.water.realAlt }}
        rail={waterRail(lang)} />

      {/* Manure, in the services' pattern: the loop from the shed's litter through the compost bays to the beds and back,
          drawn full width (manure-diagram.tsx), then the bays and the baskets on their own. */}
      <ServiceSection id="manure" title={w.sections.manure}
        diagram={<ManureDiagram bay={CO.bay} bays={CO.n} />}
        rail={manureRail(lang)} />

      <DocsSection cards={w.docs} />
    </main>
  )
}
