import type * as React from "react"

import { PointsLead, PointsTable } from "@/components/docs/points-table"
import { NET_POINTS } from "@/components/volleyball/data"

// The court's reference sections, moved off /en/volleyball onto /docs/volleyball-points as the studio's are
// (scripts/sync-docs.mjs places them under MDX headings). Each row's id (pt-S1, pt-N…) is where a tag on the page's net
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

export function VolleyballStatus(): React.JSX.Element {
  return (
    <p className="text-muted-foreground">
      Design intent. The court, its lines, the net and the posts follow the FIVB Official Volleyball Rules; everything
      past them is an assumption [A] in volleyball.json. The footings&rsquo; size waits for a builder to see the soil, and
      nothing for the court is sourced or priced yet.
    </p>
  )
}
