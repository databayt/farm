import type * as React from "react"

import { PointsLead, PointsTable } from "@/components/docs/points-table"
import { electricPoints, plumbingPoints } from "@/components/public-bathroom/data"

// The public bathroom's reference sections, moved off /en/public-bathroom onto /docs/public-bathroom-points as the
// studio's are (scripts/sync-docs.mjs places them under MDX headings). Each row's id (pt-DB, pt-SV…) is where a tag on
// the page's electrical or plumbing drawing links.

export function PublicBathroomElectricPoints(): React.JSX.Element {
  return (
    <>
      <PointsLead count={electricPoints.length} href="/en/public-bathroom#electrical" drawing="bathroom's electrical drawing" />
      <PointsTable columns={[{ label: "What" }, { label: "Size or circuit", muted: true }]}
        rows={electricPoints.map((p) => ({ id: p.id, colour: p.colour, cells: [p.what, p.size] }))} />
    </>
  )
}

export function PublicBathroomPlumbingPoints(): React.JSX.Element {
  return (
    <>
      <PointsLead count={plumbingPoints.length} href="/en/public-bathroom#plumbing" drawing="bathroom's plumbing drawing" />
      <PointsTable columns={[{ label: "What" }, { label: "Pipes", muted: true }, { label: "Size" }]}
        rows={plumbingPoints.map((p) => ({ id: p.id, colour: p.colour, cells: [p.what, p.runs, p.size] }))} />
    </>
  )
}

export function PublicBathroomStatus(): React.JSX.Element {
  return (
    <p className="text-muted-foreground">
      Design intent. Every size, run and device comes from public-bathroom.json, for the plumber and the electrician to
      confirm; nothing is sourced or priced yet. The septic tank was sized for the two studios: the campers, the bar and
      the fire pit must be added before it is built.
    </p>
  )
}
