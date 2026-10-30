import type * as React from "react"

import { PointsLead } from "@/components/docs/points-table"
import { RoomPointsTable } from "@/components/docs/room-points"
import { circuits, points } from "@/components/guest-room/data"

// The guest room's reference sections, moved off /en/guest-room onto /docs/guest-room-points as the studio's are
// (scripts/sync-docs.mjs places them under MDX headings). Each row's id (pt-L1, pt-P1…) is where a tag on the page's
// electrical drawing links.

export function GuestRoomElectricPoints(): React.JSX.Element {
  return (
    <>
      <PointsLead count={points.length} href="/en/guest-room#electrical" drawing="guest room's electrical drawing" />
      <RoomPointsTable points={points} circuits={circuits} />
    </>
  )
}

export function GuestRoomStatus(): React.JSX.Element {
  return (
    <p className="text-muted-foreground">
      Design intent. Places, sizes and loads come from guest-room.json; costs are the studio&rsquo;s placeholder prices
      (AS-21) until three quotes come in, and nothing is sourced yet.
    </p>
  )
}
