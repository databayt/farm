import type * as React from "react"

import { CircuitsTable } from "@/components/docs/circuits-table"
import { PointsLead } from "@/components/docs/points-table"
import { RailTable } from "@/components/docs/rail-table"
import { RoomPointsTable } from "@/components/docs/room-points"
import { circuits, netLinks, netPoints, points } from "@/components/office/data"
import { rails } from "@/components/office/rails"

// The office's reference sections, on its docs pages (D-059: guide/office/*.md embeds them; scripts/sync-docs.mjs
// renders each as <Name />). Each row's id (pt-L1, pt-AP1…) is where a tag on the page's
// electrical or network drawing links.

export function OfficeElectricPoints(): React.JSX.Element {
  return (
    <>
      <PointsLead count={points.length} href="/en/office#electrical" drawing="office's electrical drawing" />
      <RoomPointsTable points={points} circuits={circuits} />
    </>
  )
}

export function OfficeNetworkPoints(): React.JSX.Element {
  return (
    <>
      <PointsLead count={netPoints.length} href="/en/office#network" drawing="office's network drawing" />
      <RoomPointsTable points={netPoints} circuits={netLinks} />
    </>
  )
}

// What to buy: every rail on the page, as one table (the Materials page)
export function OfficeMaterials(): React.JSX.Element {
  return <RailTable rails={rails} />
}

// The circuits behind the points (the Electric page)
export function OfficeCircuits(): React.JSX.Element {
  return <CircuitsTable circuits={circuits} />
}
