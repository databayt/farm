import type * as React from "react"

import { frw } from "@/lib/format"
import { PointsLead, PointsTable } from "@/components/docs/points-table"
import { RailTable } from "@/components/docs/rail-table"
import { days, herd, high, low, NEED, peak, POINT_COLOUR, r0, ROWS, tank } from "@/components/livestock/data"
import livestock from "@/components/livestock/livestock.json"
import { rails } from "@/components/livestock/rails"

// The yard's reference sections, on its docs pages (D-059: guide/livestock/*.md embeds them; scripts/sync-docs.mjs
// renders each as <Name />). Each row's id (pt-T, pt-W1…) is where a tag on the page's
// water drawing links; what the yard drinks is an estimate [E], its method under the table.

const { water: WV, friends: FR } = livestock

export function LivestockWaterPoints(): React.JSX.Element {
  return (
    <>
      <PointsLead count={WV.points.length} href="/en/livestock#water" drawing="yard's water drawing" />
      <PointsTable columns={[{ label: "What" }, { label: "Where", muted: true }, { label: "Size" }]}
        rows={WV.points.map((p) => ({ id: p.id, colour: POINT_COLOUR[p.id], cells: [p.what, p.where, p.size] }))} />
    </>
  )
}

export function LivestockWaterNeed(): React.JSX.Element {
  return (
    <>
      <p className="text-muted-foreground">
        About {r0(low)} to {r0(high)} litres a day for the {herd} goats and sheep, the dogs, the cats and the doves, and up
        to about {r0(peak)} when the does and the ewes are in milk in the dry season. A full {frw(tank)} L tank holds{" "}
        {days[0]} to {days[1]} days of it if the farm&rsquo;s line stops.
      </p>
      <div className="mt-6 overflow-x-auto rounded-xl border">
        <table className="w-full text-sm">
          <thead className="text-muted-foreground bg-muted/40">
            <tr>
              <th className="px-3 py-2 text-start font-medium">Animals</th>
              <th className="px-3 py-2 text-end font-medium">Head</th>
              <th className="px-3 py-2 text-end font-medium whitespace-nowrap">L a head a day</th>
              <th className="px-3 py-2 text-end font-medium whitespace-nowrap">L a day</th>
              <th className="px-3 py-2 text-start font-medium">Basis</th>
            </tr>
          </thead>
          <tbody>
            {ROWS.map((r) => (
              <tr key={r.what} className="border-t">
                <td className="px-3 py-2">{r.what}</td>
                <td className="px-3 py-2 text-end tabular-nums">{r.head}</td>
                <td className="px-3 py-2 text-end whitespace-nowrap tabular-nums">{r.per[0]} to {r.per[1]}</td>
                <td className="px-3 py-2 text-end whitespace-nowrap tabular-nums">{r0(r.head * r.per[0])} to {r0(r.head * r.per[1])}</td>
                <td className="text-muted-foreground px-3 py-2">{r.basis}</td>
              </tr>
            ))}
            <tr className="border-t">
              <td className="px-3 py-2">Cats and doves</td>
              <td className="px-3 py-2 text-end tabular-nums">{FR.cats.head} + doves</td>
              <td className="px-3 py-2 text-end">–</td>
              <td className="px-3 py-2 text-end whitespace-nowrap tabular-nums">under {NEED.small[1]}</td>
              <td className="text-muted-foreground px-3 py-2">[A AS-29]</td>
            </tr>
          </tbody>
          <tfoot>
            <tr className="border-t-2 font-semibold">
              <td className="px-3 py-3">The yard</td>
              <td className="px-3 py-3" />
              <td className="px-3 py-3" />
              <td className="px-3 py-3 text-end whitespace-nowrap tabular-nums">{r0(low)} to {r0(high)}</td>
              <td className="text-muted-foreground px-3 py-3 font-normal">[E] the sum; up to {r0(peak)} in milk</td>
            </tr>
          </tfoot>
        </table>
      </div>
      <p className="text-muted-foreground mt-3 text-sm">
        Method [E]: head counts from the yard&rsquo;s design (D-030) times litres a head a day. A goat drinks 2 to 3 times
        its dry-matter intake at maintenance, about 1.5 to 3.3 L a day, and 4 to 5 times when lactating (LVS-27), so a doe
        or a ewe in milk is taken at 5/3 of the top figure. The sheep, the dogs, the cats and the doves are assumptions
        (AS-29) until the vet checks them. Heat and the dry season push every figure to the top of its range; the feed, not
        the water, caps the herd at about 20 does on 5 ha.
      </p>
    </>
  )
}

// What to buy: every rail on the page, as one table (the Materials page)
export function LivestockMaterials(): React.JSX.Element {
  return <RailTable rails={rails} />
}
