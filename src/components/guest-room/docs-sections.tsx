import type * as React from "react"

import { CircuitsTable } from "@/components/docs/circuits-table"
import { PointsLead } from "@/components/docs/points-table"
import { RailTable } from "@/components/docs/rail-table"
import { RoomPointsTable } from "@/components/docs/room-points"
import { circuits, points } from "@/components/guest-room/data"
import { rails } from "@/components/guest-room/rails"

// The guest room's reference sections, on its docs pages (D-059: guide/guest-room/*.md embeds them; scripts/sync-docs.mjs
// renders each as <Name />). Each row's id (pt-L1, pt-P1…) is where a tag on the page's
// electrical drawing links.

export function GuestRoomElectricPoints(): React.JSX.Element {
  return (
    <>
      <PointsLead count={points.length} href="/en/guest-room#electrical" drawing="guest room's electrical drawing" />
      <RoomPointsTable points={points} circuits={circuits} />
    </>
  )
}

// What to buy: every rail on the page, as one table (the Materials page)
export function GuestRoomMaterials(): React.JSX.Element {
  return <RailTable rails={rails} />
}

// The circuits behind the points (the Electric page)
export function GuestRoomCircuits(): React.JSX.Element {
  return <CircuitsTable circuits={circuits} />
}
