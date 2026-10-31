import type * as React from "react"

import { PointsLead, PointsTable } from "@/components/docs/points-table"
import { RailTable } from "@/components/docs/rail-table"
import { DRAIN_POINTS, LIGHT_POINTS } from "@/components/parking/data"
import { rails } from "@/components/parking/rails"

// The way in's reference sections, on its docs pages (D-059: guide/parking/*.md embeds them; scripts/sync-docs.mjs
// renders each as <Name />). Each row's id (pt-EB, pt-T1…) is where a tag on the page's
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

// What to buy: every rail on the page, as one table (the Materials page)
export function ParkingMaterials(): React.JSX.Element {
  return <RailTable rails={rails} />
}
