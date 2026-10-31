import type { Metadata } from "next"
import { LocaleLink as Link } from "@/components/internationalization/locale-link"

import { frw } from "@/lib/format"
import { DocsSection, DrawingSection, ModelSection, PageHero, RailSection, ServiceSection, railCards } from "@/components/page/sections"
import { BuildUp } from "@/components/docs/build-up"
import { type RailItem } from "@/components/docs/item-rail"
import { TaggedFigure } from "@/components/docs/tagged-figure"
import { cropsFor, D, I, waterPoints } from "@/components/farming/data"
import { words } from "@/components/farming/words"
import { hasLocale, i18n, type Locale } from "@/components/internationalization/config"
import { dictionary } from "@/components/internationalization/dictionaries"
import { getLocale } from "@/components/internationalization/locale"
import { FarmingPlan } from "@/components/farming/farming-plan"
import { NurseryPlan } from "@/components/farming/nursery-plan"
import { WaterDiagram } from "@/components/farming/water-diagram"
import plan from "../../../../../public/designs/farming/data/plan.json"
import topPieces from "../../../../../public/designs/farming/render/top-pieces.json"
import waterTags from "../../../../../public/designs/farming/render/water-tags.json"

// The vegetable field, in /en/studio's pattern: the hero, the field's 2D and 3D and the nursery's, the field's build-up,
// the crops and Water, then the docs cards; what the galley needs, the planting calendar, the water points, the bill of
// materials are on its docs pages (/docs/farming). It grows every vegetable the galley needs to feed the farm's
// guests (founder, 2026-10-28). Every number comes from scripts/site/farming.mjs, which sizes the beds to a full
// house every day from src/components/farming/farming.json; the facts and sources are guide/grow/vegetables.md.

export async function generateMetadata({ params }: PageProps<"/[lang]/farming">): Promise<Metadata> {
  const { lang } = await params
  return words[hasLocale(lang) ? lang : i18n.defaultLocale].meta
}

// The Crops rail: one bed of each crop rendered on its own (scripts/site/render/farming.html?item=<id>)
function cropRail(lang: Locale): RailItem[] {
  const t = words[lang].crops
  return cropsFor(lang).map((c) => ({
    src: `${D}/render/crop/${c.id}.webp`, alt: t.alt(c.name, c.rows), title: c.name,
    details: [
      { label: t.forGalley, value: t.kg(c.kgWeek, c.averageKgWeek) },
      { label: t.beds, value: t.bedsValue(c.planted, c.beds, c.batch, c.every) },
      { label: t.firstHarvest, value: t.first(c.firstWeeks, c.nursery, c.harvestWeeks) },
    ],
    note: t.note(c.spacing, c.watch, c.yieldNote),
  }))
}

// The Water rail, in the studio's Plumbing rail's pattern: each part of the drip installation rendered on its own
// (farming.html?part=<id>), its size and length from plan.irrigation, its cost from the field's BOM (placeholders
// until quoted). Nothing is sourced yet; the guide names Holland Greentech for drip and Davis & Shirtliff for pumps,
// neither contacted.
const line = (re: RegExp) => plan.bom.find((l) => re.test(l.item))!
function waterRail(lang: Locale): RailItem[] {
  const w = words[lang].water, t = w.rail
  const drip = line(/^Drip tape/), pipe = line(/^Supply and header/), valve = line(/^Valve and fittings/), filter = line(/^Disc filter/), main = line(/^Main pipe/)
  return railCards(`${D}/render/water`, [
    { id: "tank", title: t.tank.title, size: t.tank.size, where: t.tank.where, cost: t.tank.cost, note: t.tank.note(plan.water.dryLow, plan.water.dryHigh) },
    { id: "filter", title: t.filter.title, size: t.filter.size, where: w.greentech, cost: w.estimate(frw(filter.total)), note: t.filter.note },
    { id: "main", title: t.main.title, size: t.main.size(main.qty, I.main.dn), cost: w.estimate(frw(main.total)), note: t.main.note },
    { id: "valve", title: t.valve.title(valve.qty), size: t.valve.size, cost: w.each(frw(valve.rwf), valve.qty),
      note: t.valve.note(I.valves.map((v) => v.id).join(", ")) },
    { id: "header", title: t.header.title, size: t.header.size(pipe.qty), cost: w.estimate(frw(pipe.total)), note: t.header.note },
    { id: "drip", title: t.drip.title, size: t.drip.size(frw(drip.qty)), where: w.greentech, cost: w.estimate(frw(drip.total)), note: t.drip.note(I.lines) },
  ], lang)
}

export default async function FarmingPage() {
  const lang = await getLocale()
  const w = words[lang], t = dictionary(lang).page
  const link = (href: string, text: string) => <Link href={href} className="underline underline-offset-4">{text}</Link>
  return (
    <main className="w-full flex-1">
      {/* First screen: the founder's Nano Banana image of the field (2026-10-29, D-054), made from the handoff in
          ~/Desktop/farming-nano-banana: the same farm and light as the livestock hero, the raised beds and their crops,
          the gate on the main path, the fruit row and the nursery. Cut to 2400 x 1340 from its 2752 px original
          (assets/farming/hero-gemini.jpeg). The baskets and the wheelbarrow keep the lower left under the words. */}
      <PageHero src={`${D}/render/field-hero.jpg`} width={2400} height={1340} className="bg-[#8a7a62]" imgClassName="object-[50%_60%]"
        title={w.hero.title}
        alt={w.hero.alt} />

      {/* 2D, full screen: the field's plan (src/components/farming/farming-plan.tsx), in the text colour. */}
      <DrawingSection id="plans" title={t.plan} full>
        <FarmingPlan className="h-auto w-full" />
      </DrawingSection>

      {/* 3D, in the 2D section's pattern: the whole field from its gate end, as the 2D draws it, with its fence and the
          fruit row behind, as a line drawing, then rendered. Both from scripts/site/render/farming.html (D-053). */}
      <ModelSection line={`${D}/render/field-line.png`} real={`${D}/render/field-real.webp`} width={2400} height={1100}
        caption={w.model.caption}
        lineAlt={w.model.lineAlt}
        realAlt={w.model.realAlt} />

      {/* The seedling nursery, in the 2D's pattern: the shade-net house in the yard where the field's seedlings start,
          its benches of trays and its door toward the field (src/components/farming/nursery-plan.tsx). */}
      <DrawingSection id="nursery" title={w.nursery.section}>
        <NurseryPlan className="h-auto w-full lg:h-full lg:w-auto" />
      </DrawingSection>

      <ModelSection id="nursery-3d" title={w.nursery.section3d} line={`${D}/render/nursery-line.png`} real={`${D}/render/nursery-real.webp`} width={2400} height={1100}
        lineAlt={w.nursery.lineAlt}
        realAlt={w.nursery.realAlt} />

      {/* Field, pinned while one block builds up in fast motion, seen from above: the bare ground, the raised
          beds, the compost, the drip lines, the planting. Renders: farming.html?top=<layer>. */}
      <section id="field">
        <BuildUp title={w.field.title} base={`${D}/render/top-ground.webp`} aspect={topPieces.aspect}
          baseAlt={w.field.baseAlt}
          builds={[
            { secs: 2.4, label: w.field.builds[0], groups: [
              { src: `${D}/render/top-beds.webp`, rects: topPieces.beds, kind: "drop", from: 0, to: 0.8, rise: 40 },
            ] },
            { secs: 1.8, label: w.field.builds[1], groups: [
              { src: `${D}/render/top-compost.webp`, rects: topPieces.beds, kind: "wipe", from: 0, to: 0.85 },
            ] },
            { secs: 2, label: w.field.builds[2], groups: [
              { src: `${D}/render/top-drip.webp`, rects: topPieces.beds, kind: "unroll", from: 0, to: 0.85 },
            ] },
            { secs: 2.8, label: w.field.builds[3], groups: [
              { src: `${D}/render/top-plants.webp`, rects: topPieces.beds, kind: "drop", from: 0, to: 0.85, rise: 20 },
            ] },
          ]}
          stages={w.field.stages(plan.bedsNeeded, plan.bedsTotal)} />
      </section>

      {/* Crops: one card per crop, the biggest share of the plate first; the card in focus shows what it gives. */}
      <RailSection id="crops" title={w.crops.title} items={cropRail(lang)} />

      {/* Water, in the studio's Plumbing pattern: the drip installation drawn full width from the farm's tank to every
          drip line (water-diagram.tsx), then the whole field as the 3D sees it with the crops left out, every run in its
          colour and every point tagged (render/water-line.png, water-tags.json), the same view rendered before
          planting (render/water-real.webp), then each part on its own. All from farming.html?view=water and ?part=. */}
      <ServiceSection id="water" title={w.water.title}
        diagram={<WaterDiagram irrigation={I} perBlock={10} dry={[plan.water.dryLow, plan.water.dryHigh]} />}
        figure={<TaggedFigure table="/docs/farming/water" src={`${D}/render/water-line.png`} aspect={waterTags.aspect} tags={waterTags.tags}
          alt={w.water.figureAlt}
          info={Object.fromEntries(waterPoints(lang).map((p) => [p.id, { label: p.what, colour: p.colour }]))} />}
        note={w.water.note(link)}
        real={{ src: `${D}/render/water-real.webp`, width: 2400, height: 1100,
          caption: w.water.caption,
          alt: w.water.realAlt }}
        rail={waterRail(lang)} />

      <DocsSection cards={w.docs} />
    </main>
  )
}
