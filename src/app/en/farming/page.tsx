import type { Metadata } from "next"
import Link from "next/link"

import { DrawingSection, ModelSection, PageHero } from "@/components/page/sections"
import { Button } from "@/components/ui/button"
import { BuildUp } from "@/components/docs/build-up"
import { ItemRail, type RailItem } from "@/components/docs/item-rail"
import { FarmingPlan } from "@/components/farming/farming-plan"
import { LivestockPlan } from "@/components/livestock/livestock-plan"
import plan from "../../../../public/designs/farming/data/plan.json"
import topPieces from "../../../../public/designs/farming/render/top-pieces.json"

// The vegetable field, as /en/studio is the studio: grow every vegetable the galley needs to feed the farm's
// guests (founder, 2026-10-28). Every number comes from scripts/site/farming.mjs, which sizes the beds to a full
// house every day from src/components/farming/farming.json; the facts and sources are guide/grow/vegetables.md.

export const metadata: Metadata = {
  title: "The field · Farm",
  description: "Every vegetable on the guests' plates grown on the farm: raised beds on drip by the galley, at the Digital Farm near Kigali.",
}

const D = "/designs/farming"
const frw = (n: number) => n.toLocaleString("en-US")
const rwf = (n: number) => `RWF ${(n / 1e6).toFixed(1)}M`
const crops = [...plan.crops].sort((a, b) => b.kgWeek - a.kgWeek)

// The Crops rail: one bed of each crop rendered on its own (scripts/site/render/farming.html?item=<id>)
function cropRail(): RailItem[] {
  return crops.map((c) => ({
    src: `${D}/render/crop/${c.id}.webp`, alt: `Three metres of a bed of ${c.name.toLowerCase()} in ${c.rows} ${c.rows === 1 ? "row" : "rows"} on drip.`, title: c.name,
    details: [
      { label: "For the galley", value: `${c.kgWeek} kg a week on a full house, ${c.averageKgWeek} kg on an average one` },
      { label: "Beds", value: `${c.beds}, planted ${c.batch} at a time every ${c.every === 1 ? "week" : `${c.every} weeks`}` },
      { label: "First harvest", value: `${c.firstWeeks} weeks ${c.nursery ? `after transplanting (${c.nursery} weeks in the nursery first)` : "after sowing"}, then ${c.harvestWeeks} weeks of picking` },
    ],
    note: `Spacing ${c.spacing} cm. Watch for ${c.watch}. Yield: ${c.yieldNote}.`,
  }))
}

// the bill of materials, a row per section of lines
function bomSections() {
  const by = new Map<string, typeof plan.bom>()
  for (const l of plan.bom) by.set(l.section, [...(by.get(l.section) ?? []), l])
  return [...by].map(([name, lines]) => ({ name, lines, total: lines.reduce((n, l) => n + l.total, 0) }))
}

export default function FarmingPage() {
  const bom = bomSections()
  const bedsWide = plan.beds.length
  return (
    <main className="w-full flex-1">
      {/* First screen: a STAND-IN until the founder's Nano Banana remaster (handoff in ~/Desktop/farming-nano-banana: the
          livestock hero for the place and the light, the 3D, the 2D and a frame of the site footage). For now it is the
          block by the gate rendered from the main path (scripts/site/render/farming.html?mode=real). */}
      <PageHero src={`${D}/render/field-real.webp`} width={2400} height={1100} className="bg-[#6f9a4a]" imgClassName="object-[50%_45%]"
        title="Everything on the plate, grown here"
        alt="Ten raised beds of red-brown soil on drip lines: herbs nearest, then amaranth, spinach, kale and staked tomatoes at the back, on a sandy path in the grass." />

      {/* 2D, full screen: the field's plan (src/components/farming/farming-plan.tsx), in the text colour. */}
      <DrawingSection id="plans" title="2D">
        <FarmingPlan title={`Plan: ${bedsWide} raised beds 1.2 by 10 m in blocks of ten inside a fence, ${plan.bedsNeeded} of them planted for the galley and the rest resting or grown for sale, a 2 m main path from the gate on the garden walk to the galley, and the nursery's shade house beside the field.`}
          className="h-auto w-full lg:h-full lg:w-auto" />
      </DrawingSection>

      {/* Livestock: the homepage's 2D shows half the field and sends "the whole farm" here (D-035), so the farm's
          other land use is drawn here too, the house's plan from /en/livestock, with a link to its page. */}
      <section id="livestock">
        <div className="flex flex-col px-4 pt-10 pb-6 md:px-10 lg:h-svh lg:min-h-[560px]">
          <div className="flex flex-wrap items-baseline justify-between gap-4">
            <h2 className="text-3xl font-semibold tracking-tight">Livestock</h2>
            <Link href="/en/livestock" className="text-sm underline underline-offset-4">The livestock page</Link>
          </div>
          <p className="text-muted-foreground mt-3 max-w-2xl">Six goats and four sheep share a village yard with cats and doves, beyond the field: their litter goes to the compost bays and back to these beds.</p>
          <div className="mt-6 flex min-h-0 flex-1 items-center justify-center">
            <LivestockPlan title="Plan of the livestock yard: one outline round the herd’s thatched shed, one village yard for the herd, the cats, the doves and the guests, three compost bays and the guard dogs’ run."
              className="h-auto w-full lg:h-full lg:w-auto" />
          </div>
        </div>
      </section>

      {/* 3D, in the 2D section's pattern: the block by the gate from the main path as a line drawing, then
          rendered. Both from scripts/site/render/farming.html. */}
      <ModelSection line={`${D}/render/field-line.png`} real={`${D}/render/field-real.webp`} width={2400} height={1100}
        caption={<>Rendered from the design model: the block by the gate, one season</>}
        lineAlt="Line drawing of one block of ten raised beds seen straight on from the main path: two drip lines along each bed, herbs in the nearest bed, then amaranth, spinach and kale, and tomatoes on stakes at the back."
        realAlt="The same block rendered on the white page: red-brown beds with dark compost, black drip tape, herbs, wine-red amaranth, spinach, kale and staked tomatoes with red and yellow fruit, on a sandy path." />

      {/* Field, pinned while one block builds up in fast motion, seen from above: the bare ground, the raised
          beds, the compost, the drip lines, the planting. Renders: farming.html?top=<layer>. */}
      <section id="field">
        <BuildUp title="Field" base={`${D}/render/top-ground.webp`} aspect={topPieces.aspect}
          baseAlt="One block of the field from straight above: bare sandy ground, pegged out for ten beds."
          builds={[
            { secs: 2.4, label: "Ten beds dug and raised 20 cm, each 1.2 m wide and 10 m long.", groups: [
              { src: `${D}/render/top-beds.webp`, rects: topPieces.beds, kind: "drop", from: 0, to: 0.8, rise: 40 },
            ] },
            { secs: 1.8, label: "Compost spread over each bed.", groups: [
              { src: `${D}/render/top-compost.webp`, rects: topPieces.beds, kind: "wipe", from: 0, to: 0.85 },
            ] },
            { secs: 2, label: "Two drip lines along each bed, fed from the header.", groups: [
              { src: `${D}/render/top-drip.webp`, rects: topPieces.beds, kind: "unroll", from: 0, to: 0.85 },
            ] },
            { secs: 2.8, label: "Seedlings from the nursery planted, and seed sown straight into the beds.", groups: [
              { src: `${D}/render/top-plants.webp`, rects: topPieces.beds, kind: "drop", from: 0, to: 0.85, rise: 20 },
            ] },
          ]}
          stages={[
            { title: "The bare ground", text: "Fenced, tested and marked out: soil samples to RAB, the borehole's flow measured over 6 hours, and the beds pegged across the slope." },
            { title: "Step 1 · Beds", text: `1.2 m wide, 10 m long, raised 20 cm, with 0.5 m paths between them and 1 m between blocks of ten. ${plan.bedsNeeded} beds feed the galley.` },
            { title: "Step 2 · Compost", text: "About 250 kg of compost or manure per 100 m² dug into each bed, and lime only if the soil test asks for it." },
            { title: "Step 3 · Drip", text: "Two drip lines per bed from a header pipe and a filter at the tank. Run it for an hour and check every emitter before planting." },
            { title: "Step 4 · Planting", text: "Kale, cabbage, onion, tomato, pepper, eggplant and spinach come from the nursery after 4 to 6 weeks; beans, carrots, amaranth, cucumber and herbs are sown in place." },
          ]} />
      </section>

      {/* Crops: one card per crop, the biggest share of the plate first; the card in focus shows what it gives. */}
      <section id="crops" className="pt-10 pb-10">
        <h2 className="px-4 text-3xl font-semibold tracking-tight md:px-10">Crops</h2>
        <div className="mt-6">
          <ItemRail items={cropRail()} />
        </div>
      </section>

      <div className="mx-auto w-full max-w-7xl px-4 md:px-6">
        {/* The galley's needs: the plate, the week, the beds */}
        <section id="demand" className="scroll-mt-20 border-t py-16">
          <h2 className="text-3xl font-semibold tracking-tight">What the galley needs</h2>
          <p className="text-muted-foreground mt-3 max-w-3xl text-lg text-balance">
            The field is sized for a full house every day: {plan.eaters} people at the galley&rsquo;s table, 22 guests and
            the team, about {plan.kgWeek} kg of vegetables a week. On an average week ({plan.averageKgWeek} kg) the rest is
            sold. That takes {plan.bedsNeeded} beds, about {frw(plan.plantedM2)} m² of growing area, a quarter more than the
            plate needs for pests and a failed planting.
          </p>
          <div className="mt-6 overflow-x-auto rounded-xl border">
            <table className="w-full text-sm">
              <thead className="text-muted-foreground bg-muted/40">
                <tr>
                  <th className="px-3 py-2 text-start font-medium">Crop</th>
                  <th className="px-3 py-2 text-end font-medium whitespace-nowrap">Per guest a day</th>
                  <th className="px-3 py-2 text-end font-medium whitespace-nowrap">Full house, a week</th>
                  <th className="px-3 py-2 text-end font-medium whitespace-nowrap">Average week</th>
                  <th className="px-3 py-2 text-end font-medium">Beds</th>
                </tr>
              </thead>
              <tbody>
                {crops.map((c) => (
                  <tr key={c.id} className="border-t">
                    <td className="px-3 py-2">{c.name}</td>
                    <td className="px-3 py-2 text-end tabular-nums">{c.g} g</td>
                    <td className="px-3 py-2 text-end tabular-nums">{c.kgWeek} kg</td>
                    <td className="text-muted-foreground px-3 py-2 text-end tabular-nums">{c.averageKgWeek} kg</td>
                    <td className="px-3 py-2 text-end tabular-nums">{c.beds}</td>
                  </tr>
                ))}
              </tbody>
              <tfoot>
                <tr className="border-t-2 font-semibold">
                  <td className="px-3 py-3">All vegetables</td>
                  <td className="px-3 py-3 text-end tabular-nums">{crops.reduce((n, c) => n + c.g, 0)} g</td>
                  <td className="px-3 py-3 text-end tabular-nums">{plan.kgWeek} kg</td>
                  <td className="px-3 py-3 text-end tabular-nums">{plan.averageKgWeek} kg</td>
                  <td className="px-3 py-3 text-end tabular-nums">{plan.bedsNeeded} of {plan.bedsTotal}</td>
                </tr>
              </tfoot>
            </table>
          </div>
          <p className="text-muted-foreground mt-3 text-sm">
            Grams on the plate are assumed until the cook writes the menu. Eggs come from the hens; events buy what the field can&rsquo;t give.
          </p>
        </section>

        {/* Planting so the harvest never stops */}
        <section id="calendar" className="scroll-mt-20 border-t py-16">
          <h2 className="text-3xl font-semibold tracking-tight">Planting so the harvest never stops</h2>
          <p className="text-muted-foreground mt-3 max-w-3xl text-lg text-balance">
            A few beds of each crop go in every few weeks, so something is always ready to pick. Each family moves to
            another family&rsquo;s beds the next season, so no bed grows the same family twice running.
          </p>
          <div className="mt-6 overflow-x-auto rounded-xl border">
            <table className="w-full text-sm">
              <thead className="text-muted-foreground bg-muted/40">
                <tr>
                  <th className="px-3 py-2 text-start font-medium">Crop</th>
                  <th className="px-3 py-2 text-start font-medium">Plant</th>
                  <th className="px-3 py-2 text-end font-medium whitespace-nowrap">Nursery</th>
                  <th className="px-3 py-2 text-end font-medium whitespace-nowrap">To first harvest</th>
                  <th className="px-3 py-2 text-end font-medium whitespace-nowrap">Picking</th>
                </tr>
              </thead>
              <tbody>
                {crops.map((c) => (
                  <tr key={c.id} className="border-t">
                    <td className="px-3 py-2">{c.name}</td>
                    <td className="px-3 py-2">{c.batch} {c.batch === 1 ? "bed" : "beds"} every {c.every === 1 ? "week" : `${c.every} weeks`}</td>
                    <td className="px-3 py-2 text-end tabular-nums">{c.nursery ? `${c.nursery} wk` : "sown in place"}</td>
                    <td className="px-3 py-2 text-end tabular-nums">{c.firstWeeks} wk</td>
                    <td className="px-3 py-2 text-end tabular-nums">{c.harvestWeeks} wk</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="mt-6 grid gap-4 md:grid-cols-3">
            {[
              { title: "Season A · September to February", text: "Raise seedlings for 3 to 8 weeks, transplant with the rains, drip through the January–February lull." },
              { title: "Season B · March to June", text: "Transplant in February and March; the raised beds carry the April rains; drip again from late May." },
              { title: "Season C · July to September", text: "Drip only: plant only what the borehole's proven flow can carry." },
            ].map((s) => (
              <div key={s.title} className="rounded-xl border p-5">
                <h3 className="font-semibold">{s.title}</h3>
                <p className="text-muted-foreground mt-2 text-sm leading-relaxed">{s.text}</p>
              </div>
            ))}
          </div>
        </section>

        <section id="water" className="scroll-mt-20 border-t py-16">
          <h2 className="text-3xl font-semibold tracking-tight">Water</h2>
          <p className="text-muted-foreground mt-3 max-w-3xl text-lg text-balance">
            In the driest months the {frw(plan.plantedM2)} m² of beds drink {plan.water.dryLow} to {plan.water.dryHigh} m³ a
            day, about ten times what the roofs collect, so the borehole or the mains carries the field. Water at dawn or
            dusk, mulch the beds with dry grass, and plant season C only to the flow the test proves. Under 1 ha of
            irrigation needs no permit.
          </p>
        </section>

        {/* The bill of materials to start the field, in the studio's pattern */}
        <section id="bom" className="scroll-mt-20 border-t py-16">
          <h2 className="text-3xl font-semibold tracking-tight">Bill of materials</h2>
          <p className="text-muted-foreground mt-3 max-w-3xl text-lg text-balance">
            Everything to start the {plan.bedsNeeded} beds, the {plan.fenceM} m fence and the nursery: about{" "}
            {rwf(plan.total)} with a 15 % contingency. Prices are placeholders until three quotes come in for each line.
          </p>
          <div className="mt-6 overflow-hidden rounded-xl border">
            {bom.map((t) => (
              <details key={t.name} className="group border-b">
                <summary className="hover:bg-muted/40 flex cursor-pointer list-none items-center gap-3 px-4 py-3 [&::-webkit-details-marker]:hidden">
                  <svg viewBox="0 0 24 24" className="text-muted-foreground size-4 shrink-0 transition-transform group-open:rotate-90 rtl:-scale-x-100"
                    fill="none" stroke="currentColor" strokeWidth={2.25} strokeLinecap="round" strokeLinejoin="round" aria-hidden>
                    <path d="M9 18l6-6-6-6" />
                  </svg>
                  <span className="font-semibold">{t.name}</span>
                  <span className="text-muted-foreground text-sm">{t.lines.length} {t.lines.length === 1 ? "line" : "lines"}</span>
                  <span className="ms-auto font-semibold tabular-nums">{frw(t.total)}</span>
                </summary>
                <div className="overflow-x-auto border-t">
                  <table className="w-full text-sm">
                    <thead className="text-muted-foreground bg-muted/40">
                      <tr>
                        <th className="px-3 py-2 ps-11 text-start font-medium">Item</th>
                        <th className="px-3 py-2 text-end font-medium">Qty</th>
                        <th className="px-3 py-2 text-end font-medium whitespace-nowrap">Unit price (RWF)</th>
                        <th className="px-4 py-2 text-end font-medium whitespace-nowrap">Total (RWF)</th>
                      </tr>
                    </thead>
                    <tbody>
                      {t.lines.map((l) => (
                        <tr key={l.item} className="border-t">
                          <td className="px-3 py-2 ps-11">{l.item}</td>
                          <td className="px-3 py-2 text-end whitespace-nowrap tabular-nums">{l.qty} {l.unit === "each" ? "" : l.unit}</td>
                          <td className="text-muted-foreground px-3 py-2 text-end tabular-nums">{frw(l.rwf)}</td>
                          <td className="px-4 py-2 text-end tabular-nums">{frw(l.total)}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </details>
            ))}
            <div className="bg-muted/20 flex px-4 py-2.5 text-sm">
              <span>Materials and labour</span>
              <span className="ms-auto tabular-nums">{frw(plan.subtotal)}</span>
            </div>
            <div className="flex border-t px-4 py-2.5 text-sm">
              <span>Contingency (15 %)</span>
              <span className="ms-auto tabular-nums">{frw(plan.contingency)}</span>
            </div>
            <div className="flex border-t-2 px-4 py-3 font-semibold">
              <span>The field, to start</span>
              <span className="ms-auto tabular-nums">{frw(plan.total)}</span>
            </div>
          </div>
          <p className="text-muted-foreground mt-3 text-sm">
            Data:{" "}
            {["crops.csv", "bom.csv", "plan.json"].map((f, i) => (
              <span key={f}>{i ? " · " : ""}<a href={`${D}/data/${f}`} download className="underline underline-offset-4">{f}</a></span>
            ))}
          </p>
        </section>

        <section className="mb-16 grid gap-6 md:grid-cols-2">
          <div className="rounded-xl border p-6">
            <h2 className="text-xl font-semibold tracking-tight">The field guide</h2>
            <p className="text-muted-foreground mt-3 text-sm leading-relaxed">
              The first month step by step, the crops, water and pests, in English and Kinyarwanda.
            </p>
            <div className="mt-4 flex flex-wrap gap-2">
              <Button asChild variant="outline"><Link href="/docs/vegetables">Read the guide</Link></Button>
              <Button asChild variant="outline"><a href="/guides/vegetables.pdf" download>PDF</a></Button>
            </div>
          </div>
          <div className="rounded-xl border p-6">
            <h2 className="text-xl font-semibold tracking-tight">Status</h2>
            <p className="text-muted-foreground mt-3 text-sm leading-relaxed">
              Preliminary. The soil, the water and the field&rsquo;s size are not measured yet: the zone follows the
              provisional master plan, the yields are planning figures and the plate is assumed until the cook writes the
              menu. The 3D shows the beds by the gate in one season.
            </p>
          </div>
        </section>
      </div>
    </main>
  )
}
