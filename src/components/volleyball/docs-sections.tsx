import type * as React from "react"

import { PointsLead, PointsTable } from "@/components/docs/points-table"
import { RailTable } from "@/components/docs/rail-table"
import { NET_POINTS } from "@/components/volleyball/data"
import { rails } from "@/components/volleyball/rails"

// The court's reference sections, on its docs pages (D-059: guide/volleyball/*.md embeds them; scripts/sync-docs.mjs
// renders each as <Name />). Each row's id (pt-S1, pt-N…) is where a tag on the page's net
// drawing links.

export function VolleyballNetPoints(): React.JSX.Element {
  return (
    <>
      <PointsLead count={NET_POINTS.length} href="/en/volleyball#net" drawing="court's net drawing" />
      <PointsTable columns={[{ label: "What" }, { label: "Where", muted: true }, { label: "Size" }]}
        rows={NET_POINTS.map((p) => ({ id: p.id, colour: p.colour, cells: [p.what, p.where, p.size] }))} />
    </>
  )
}

// What to buy: every rail on the page, as one table (the Materials page)
export function VolleyballMaterials(): React.JSX.Element {
  return <RailTable rails={rails} />
}
