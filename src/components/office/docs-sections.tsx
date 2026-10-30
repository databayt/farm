import type * as React from "react"

import { PointsLead } from "@/components/docs/points-table"
import { RoomPointsTable } from "@/components/docs/room-points"
import { circuits, netLinks, netPoints, points } from "@/components/office/data"

// The office's reference sections, moved off /en/office onto /docs/office-points as the studio's are
// (scripts/sync-docs.mjs places them under MDX headings). Each row's id (pt-L1, pt-AP1…) is where a tag on the page's
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

export function OfficeStatus(): React.JSX.Element {
  return (
    <p className="text-muted-foreground">
      Design intent. Places and sizes come from office.json; the electrical costs are the studio&rsquo;s placeholder
      prices (AS-21) until three quotes come in, and the network gear is neither sourced nor priced.
    </p>
  )
}
