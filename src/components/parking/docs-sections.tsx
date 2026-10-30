import type * as React from "react"

import { PointsLead, PointsTable } from "@/components/docs/points-table"
import { DRAIN_POINTS, LIGHT_POINTS } from "@/components/parking/data"

// The way in's reference sections, moved off /en/parking onto /docs/parking-points as the studio's are
// (scripts/sync-docs.mjs places them under MDX headings). Each row's id (pt-EB, pt-T1…) is where a tag on the page's
// lighting or drainage drawing links.

const COLUMNS = [{ label: "What" }, { label: "Where", muted: true }, { label: "Size" }]

export function ParkingLightingPoints(): React.JSX.Element {
  return (
    <>
      <PointsLead count={LIGHT_POINTS.length} href="/en/parking#lighting" drawing="way in's lighting drawing" />
      <PointsTable columns={COLUMNS} rows={LIGHT_POINTS.map((p) => ({ id: p.id, colour: p.colour, cells: [p.what, p.where, p.size] }))} />
    </>
  )
}

export function ParkingDrainagePoints(): React.JSX.Element {
  return (
    <>
      <PointsLead count={DRAIN_POINTS.length} href="/en/parking#drainage" drawing="way in's drainage drawing" />
      <PointsTable columns={COLUMNS} rows={DRAIN_POINTS.map((p) => ({ id: p.id, colour: p.colour, cells: [p.what, p.where, p.size] }))} />
    </>
  )
}

export function ParkingStatus(): React.JSX.Element {
  return (
    <p className="text-muted-foreground">
      Design intent [A] until a builder sees the ground: how the parking is built, drained and lit comes from
      parking.json. The soil&rsquo;s soakage is not tested yet, so a percolation test on site sizes the soakaway pit, or
      says the trench must run on to a ditch. Nothing at the way in is sourced or priced yet.
    </p>
  )
}
