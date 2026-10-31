import type * as React from "react"

import { frw, rwf } from "@/lib/format"
import { type BomLine, type BomSection, BomTable } from "@/components/docs/bom-table"
import { PointsLead, PointsTable } from "@/components/docs/points-table"
import { bomFor, cropsFor, D, waterPoints } from "@/components/farming/data"
import { words } from "@/components/farming/words"
import type { Locale } from "@/components/internationalization/config"
import { dictionary } from "@/components/internationalization/dictionaries"
import { getLocale } from "@/components/internationalization/locale"
import plan from "../../../public/designs/farming/data/plan.json"

// The field's reference sections, on its docs pages (D-059: guide/farming/*.md embeds them; scripts/sync-docs.mjs
// renders each as <Name />): the water points (each row's id, pt-M1, pt-V1…, is where a tag on the page's water drawing
// links), what the galley needs, the planting calendar and the bill of materials. Every number is the generator's
// (scripts/site/farming.mjs).

export async function FarmingWaterPoints(): Promise<React.JSX.Element> {
  const lang = await getLocale()
  const points = waterPoints(lang), t = dictionary(lang).table
  return (
    <>
      <PointsLead count={points.length} href="/farming#water" drawing={words[lang].points.drawing} />
      <PointsTable columns={[{ label: t.what }, { label: t.where, muted: true }, { label: t.size }]}
        rows={points.map((p) => ({ id: p.id, colour: p.colour, cells: [p.what, p.where, p.size] }))} />
    </>
  )
}

// the plate, the week and the beds, crop by crop
export async function FarmingPlate(): Promise<React.JSX.Element> {
  const lang = await getLocale()
  const w = words[lang].plate, crops = cropsFor(lang)
  return (
    <>
      <p className="text-muted-foreground">
        {w.lead({ ...plan, plantedM2: frw(plan.plantedM2) })}
      </p>
      <div className="mt-6 overflow-x-auto rounded-xl border">
        <table className="w-full text-sm">
          <thead className="text-muted-foreground bg-muted/40">
            <tr>
              <th className="px-3 py-2 text-start font-medium">{w.crop}</th>
              <th className="px-3 py-2 text-end font-medium whitespace-nowrap">{w.perGuest}</th>
              <th className="px-3 py-2 text-end font-medium whitespace-nowrap">{w.fullWeek}</th>
              <th className="px-3 py-2 text-end font-medium whitespace-nowrap">{w.averageWeek}</th>
              <th className="px-3 py-2 text-end font-medium whitespace-nowrap">{w.bedsStart}</th>
              <th className="text-muted-foreground px-3 py-2 text-end font-medium whitespace-nowrap">{w.fullHouse}</th>
            </tr>
          </thead>
          <tbody>
            {crops.map((c) => (
              <tr key={c.id} className="border-t">
                <td className="px-3 py-2">{c.name}</td>
                <td className="px-3 py-2 text-end tabular-nums">{c.g} g</td>
                <td className="px-3 py-2 text-end tabular-nums">{c.kgWeek} kg</td>
                <td className="text-muted-foreground px-3 py-2 text-end tabular-nums">{c.averageKgWeek} kg</td>
                <td className="px-3 py-2 text-end tabular-nums">{c.planted}</td>
                <td className="text-muted-foreground px-3 py-2 text-end tabular-nums">{c.beds}</td>
              </tr>
            ))}
          </tbody>
          <tfoot>
            <tr className="border-t-2 font-semibold">
              <td className="px-3 py-3">{w.all}</td>
              <td className="px-3 py-3 text-end tabular-nums">{crops.reduce((n, c) => n + c.g, 0)} g</td>
              <td className="px-3 py-3 text-end tabular-nums">{plan.kgWeek} kg</td>
              <td className="px-3 py-3 text-end tabular-nums">{plan.averageKgWeek} kg</td>
              <td className="px-3 py-3 text-end tabular-nums">{w.of(plan.bedsNeeded, plan.bedsTotal)}</td>
              <td className="text-muted-foreground px-3 py-3 text-end tabular-nums">{plan.bedsFull}</td>
            </tr>
          </tfoot>
        </table>
      </div>
      <p className="text-muted-foreground mt-3 text-sm">
        {w.foot}
      </p>
    </>
  )
}

// planting so the harvest never stops: the batches, and the three seasons
export async function FarmingCalendar(): Promise<React.JSX.Element> {
  const lang = await getLocale()
  const w = words[lang].calendar, crops = cropsFor(lang)
  return (
    <>
      <p className="text-muted-foreground">{w.lead}</p>
      <div className="mt-6 overflow-x-auto rounded-xl border">
        <table className="w-full text-sm">
          <thead className="text-muted-foreground bg-muted/40">
            <tr>
              <th className="px-3 py-2 text-start font-medium">{w.crop}</th>
              <th className="px-3 py-2 text-start font-medium">{w.plant}</th>
              <th className="px-3 py-2 text-end font-medium whitespace-nowrap">{w.nursery}</th>
              <th className="px-3 py-2 text-end font-medium whitespace-nowrap">{w.toFirst}</th>
              <th className="px-3 py-2 text-end font-medium whitespace-nowrap">{w.picking}</th>
            </tr>
          </thead>
          <tbody>
            {crops.map((c) => (
              <tr key={c.id} className="border-t">
                <td className="px-3 py-2">{c.name}</td>
                <td className="px-3 py-2">{w.every(c.batch, c.every)}</td>
                <td className="px-3 py-2 text-end tabular-nums">{c.nursery ? w.wk(c.nursery) : w.inPlace}</td>
                <td className="px-3 py-2 text-end tabular-nums">{w.wk(c.firstWeeks)}</td>
                <td className="px-3 py-2 text-end tabular-nums">{w.wk(c.harvestWeeks)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="mt-6 grid gap-4 md:grid-cols-3">
        {w.seasons.map((s) => (
          <div key={s.title} className="rounded-xl border p-5">
            <h3 className="font-semibold">{s.title}</h3>
            <p className="text-muted-foreground mt-2 text-sm leading-relaxed">{s.text}</p>
          </div>
        ))}
      </div>
    </>
  )
}

// the bill of materials to start the field, a row per section of lines, in the studio's table
function bomSections(lang: Locale): BomSection[] {
  const { sections, units } = words[lang].bom
  const by = new Map<string, BomLine[]>()
  for (const l of bomFor(lang)) by.set(sections[l.section] ?? l.section, [...(by.get(sections[l.section] ?? l.section) ?? []), { item: l.item, qty: l.qty, unit: units[l.unit] ?? l.unit, price: l.rwf, total: l.total }])
  return [...by].map(([name, lines]) => {
    const total = lines.reduce((n, l) => n + l.total, 0)
    return { name, groups: [{ name, lines, total }], total, lines: lines.length }
  })
}

export async function FarmingBom(): Promise<React.JSX.Element> {
  const lang = await getLocale()
  const w = words[lang].bom
  return (
    <>
      <p className="text-muted-foreground">{w.lead(plan.bedsNeeded, plan.fenceM, rwf(plan.total))}</p>
      <BomTable sections={bomSections(lang)} contingency={{ label: w.contingency, rwf: plan.contingency }}
        total={{ label: w.total, rwf: plan.total }} />
      <p className="text-muted-foreground mt-3 text-sm">
        {w.data}{" "}
        {["crops.csv", "bom.csv", "plan.json"].map((f, i) => (
          <span key={f}>{i ? " · " : ""}<a href={`${D}/data/${f}`} download className="underline underline-offset-4">{f}</a></span>
        ))}
      </p>
    </>
  )
}
