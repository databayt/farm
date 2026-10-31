import type * as React from "react"

import { frw } from "@/lib/format"
import { PointsLead, PointsTable } from "@/components/docs/points-table"
import { RailTable } from "@/components/docs/rail-table"
import { days, herd, high, low, NEED, peak, POINT_COLOUR, pointsFor, r0, ROWS, tank } from "@/components/livestock/data"
import livestock from "@/components/livestock/livestock.json"
import { rails } from "@/components/livestock/rails"
import { words } from "@/components/livestock/words"
import { dictionary } from "@/components/internationalization/dictionaries"
import { getLocale } from "@/components/internationalization/locale"

// The yard's reference sections, on its docs pages (D-059: guide/livestock/*.md embeds them; scripts/sync-docs.mjs
// renders each as <Name />). Each row's id (pt-T, pt-W1…) is where a tag on the page's
// water drawing links; what the yard drinks is an estimate [E], its method under the table.

const { friends: FR } = livestock

export async function LivestockWaterPoints(): Promise<React.JSX.Element> {
  const lang = await getLocale()
  const points = pointsFor(lang), t = dictionary(lang).table
  return (
    <>
      <PointsLead count={points.length} href="/livestock#water" drawing={words[lang].need.drawing} />
      <PointsTable columns={[{ label: t.what }, { label: t.where, muted: true }, { label: t.size }]}
        rows={points.map((p) => ({ id: p.id, colour: POINT_COLOUR[p.id], cells: [p.what, p.where, p.size] }))} />
    </>
  )
}

export async function LivestockWaterNeed(): Promise<React.JSX.Element> {
  const w = words[await getLocale()].need
  return (
    <>
      <p className="text-muted-foreground">
        {w.lead(r0(low), r0(high), herd, r0(peak), frw(tank), days[0], days[1])}
      </p>
      <div className="mt-6 overflow-x-auto rounded-xl border">
        <table className="w-full text-sm">
          <thead className="text-muted-foreground bg-muted/40">
            <tr>
              <th className="px-3 py-2 text-start font-medium">{w.animals}</th>
              <th className="px-3 py-2 text-end font-medium">{w.head}</th>
              <th className="px-3 py-2 text-end font-medium whitespace-nowrap">{w.perHead}</th>
              <th className="px-3 py-2 text-end font-medium whitespace-nowrap">{w.perDay}</th>
              <th className="px-3 py-2 text-start font-medium">{w.basis}</th>
            </tr>
          </thead>
          <tbody>
            {ROWS.map((r) => (
              <tr key={r.what} className="border-t">
                <td className="px-3 py-2">{w.rows[r.what] ?? r.what}</td>
                <td className="px-3 py-2 text-end tabular-nums">{r.head}</td>
                <td className="px-3 py-2 text-end whitespace-nowrap tabular-nums">{w.to(r.per[0], r.per[1])}</td>
                <td className="px-3 py-2 text-end whitespace-nowrap tabular-nums">{w.to(r0(r.head * r.per[0]), r0(r.head * r.per[1]))}</td>
                <td className="text-muted-foreground px-3 py-2">{w.bases[r.what] ?? r.basis}</td>
              </tr>
            ))}
            <tr className="border-t">
              <td className="px-3 py-2">{w.small}</td>
              <td className="px-3 py-2 text-end tabular-nums">{w.smallHead(FR.cats.head)}</td>
              <td className="px-3 py-2 text-end">–</td>
              <td className="px-3 py-2 text-end whitespace-nowrap tabular-nums">{w.under(NEED.small[1])}</td>
              <td className="text-muted-foreground px-3 py-2">[A AS-29]</td>
            </tr>
          </tbody>
          <tfoot>
            <tr className="border-t-2 font-semibold">
              <td className="px-3 py-3">{w.yard}</td>
              <td className="px-3 py-3" />
              <td className="px-3 py-3" />
              <td className="px-3 py-3 text-end whitespace-nowrap tabular-nums">{w.to(r0(low), r0(high))}</td>
              <td className="text-muted-foreground px-3 py-3 font-normal">{w.sum(r0(peak))}</td>
            </tr>
          </tfoot>
        </table>
      </div>
      <p className="text-muted-foreground mt-3 text-sm">
        {w.method}
      </p>
    </>
  )
}

// What to buy: every rail on the page, as one table (the Materials page)
export async function LivestockMaterials(): Promise<React.JSX.Element> {
  return <RailTable rails={rails(await getLocale())} />
}
