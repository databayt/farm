import type * as React from "react"

import { CircuitsTable } from "@/components/docs/circuits-table"
import { PointsLead } from "@/components/docs/points-table"
import { RailTable } from "@/components/docs/rail-table"
import { RoomPointsTable } from "@/components/docs/room-points"
import { allLinks, circuits, points } from "@/components/study-room/data"
import { rails } from "@/components/study-room/rails"

// The study room's reference sections, on its docs pages (D-059: guide/study-room/*.md embeds them; scripts/sync-docs.mjs
// renders each as <Name />). Each row's id (pt-L1, pt-AP1…) is where a tag on the page's
// electrical drawing links; the Wi-Fi's points share the drawing and the table.

export function StudyRoomElectricPoints(): React.JSX.Element {
  return (
    <>
      <PointsLead count={points.length} href="/en/study-room#electrical" drawing="study room's electrical drawing">
        The Wi-Fi&rsquo;s points are among them.
      </PointsLead>
      <RoomPointsTable points={points} circuits={allLinks} />
    </>
  )
}

// What to buy: every rail on the page, as one table (the Materials page)
export function StudyRoomMaterials(): React.JSX.Element {
  return <RailTable rails={rails} />
}

// The circuits behind the points (the Electric page)
export function StudyRoomCircuits(): React.JSX.Element {
  return <CircuitsTable circuits={circuits} />
}
