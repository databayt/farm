import type * as React from "react"

import { frw, rwf } from "@/lib/format"
import { type BomLine, type BomSection, BomTable } from "@/components/docs/bom-table"
import { PointsLead, PointsTable } from "@/components/docs/points-table"
import { crops, D, WATER_POINTS } from "@/components/farming/data"
import plan from "../../../public/designs/farming/data/plan.json"

// The field's reference sections, moved off /en/farming onto /docs/farming-plan as the studio's are
// (scripts/sync-docs.mjs places them under MDX headings): the water points (each row's id, pt-M1, pt-V1…, is where a tag
// on the page's water drawing links), what the galley needs, the planting calendar, the bill of materials and the
// status. Every number is the generator's (scripts/site/farming.mjs).

export function FarmingWaterPoints(): React.JSX.Element {
  return (
    <>
      <PointsLead count={WATER_POINTS.length} href="/en/farming#water" drawing="field's water drawing" />
      <PointsTable columns={[{ label: "What" }, { label: "Where", muted: true }, { label: "Size" }]}
        rows={WATER_POINTS.map((p) => ({ id: p.id, colour: p.colour, cells: [p.what, p.where, p.size] }))} />
    </>
  )
}

// the plate, the week and the beds, crop by crop
export function FarmingPlate(): React.JSX.Element {
  return (
    <>
      <p className="text-muted-foreground">
        A full house every day is {plan.eaters} people at the galley&rsquo;s table, 22 guests and the team, about{" "}
        {plan.kgWeek} kg of vegetables a week, and would take {plan.bedsFull} beds. The field starts smaller: the two rows of
        blocks nearest the gate, {plan.bedsTotal} beds, {plan.bedsNeeded} of them planted, about {frw(plan.plantedM2)} m² of
        growing area with a quarter more than the plate needs for pests and a failed planting. They give about{" "}
        {plan.grownKgWeek} kg a week: {plan.coverFull} % of a full house and more than an average week ({plan.averageKgWeek} kg),
        whose surplus is sold. On the busiest weeks the galley buys the rest; the other two rows follow the bookings. Behind the field a row of bananas and fruit trees (avocado, mango, lemon, papaya) gives the table its fruit.
      </p>
      <div className="mt-6 overflow-x-auto rounded-xl border">
        <table className="w-full text-sm">
          <thead className="text-muted-foreground bg-muted/40">
            <tr>
              <th className="px-3 py-2 text-start font-medium">Crop</th>
              <th className="px-3 py-2 text-end font-medium whitespace-nowrap">Per guest a day</th>
              <th className="px-3 py-2 text-end font-medium whitespace-nowrap">Full house, a week</th>
              <th className="px-3 py-2 text-end font-medium whitespace-nowrap">Average week</th>
              <th className="px-3 py-2 text-end font-medium whitespace-nowrap">Beds at the start</th>
              <th className="text-muted-foreground px-3 py-2 text-end font-medium whitespace-nowrap">Full house</th>
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
              <td className="px-3 py-3">All vegetables</td>
              <td className="px-3 py-3 text-end tabular-nums">{crops.reduce((n, c) => n + c.g, 0)} g</td>
              <td className="px-3 py-3 text-end tabular-nums">{plan.kgWeek} kg</td>
              <td className="px-3 py-3 text-end tabular-nums">{plan.averageKgWeek} kg</td>
              <td className="px-3 py-3 text-end tabular-nums">{plan.bedsNeeded} of {plan.bedsTotal}</td>
              <td className="text-muted-foreground px-3 py-3 text-end tabular-nums">{plan.bedsFull}</td>
            </tr>
          </tfoot>
        </table>
      </div>
      <p className="text-muted-foreground mt-3 text-sm">
        Grams on the plate are assumed until the cook writes the menu. Eggs come from the hens; events buy what the field can&rsquo;t give.
      </p>
    </>
  )
}

// planting so the harvest never stops: the batches, and the three seasons
export function FarmingCalendar(): React.JSX.Element {
  return (
    <>
      <p className="text-muted-foreground">
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
    </>
  )
}

// the bill of materials to start the field, a row per section of lines, in the studio's table
function bomSections(): BomSection[] {
  const by = new Map<string, BomLine[]>()
  for (const l of plan.bom) by.set(l.section, [...(by.get(l.section) ?? []), { item: l.item, qty: l.qty, unit: l.unit, price: l.rwf, total: l.total }])
  return [...by].map(([name, lines]) => {
    const total = lines.reduce((n, l) => n + l.total, 0)
    return { name, groups: [{ name, lines, total }], total, lines: lines.length }
  })
}

export function FarmingBom(): React.JSX.Element {
  return (
    <>
      <p className="text-muted-foreground">
        Everything to start the {plan.bedsNeeded} beds, the {plan.fenceM} m fence and the nursery: about{" "}
        {rwf(plan.total)} with a 15 % contingency. Prices are placeholders until three quotes come in for each line.
      </p>
      <BomTable sections={bomSections()} contingency={{ label: "Contingency (15 %)", rwf: plan.contingency }}
        total={{ label: "The field, to start", rwf: plan.total }} />
      <p className="text-muted-foreground mt-3 text-sm">
        Data:{" "}
        {["crops.csv", "bom.csv", "plan.json"].map((f, i) => (
          <span key={f}>{i ? " · " : ""}<a href={`${D}/data/${f}`} download className="underline underline-offset-4">{f}</a></span>
        ))}
      </p>
    </>
  )
}

export function FarmingStatus(): React.JSX.Element {
  return (
    <p className="text-muted-foreground">
      Preliminary. The soil, the water and the field&rsquo;s size are not measured yet: the zone follows the
      provisional master plan, the yields are planning figures and the plate is assumed until the cook writes the menu.
    </p>
  )
}
