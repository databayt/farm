import type * as React from "react"

import { PointsLead } from "@/components/docs/points-table"
import { RoomPointsTable } from "@/components/docs/room-points"
import { allLinks, points } from "@/components/study-room/data"

// The study room's reference sections, moved off /en/study-room onto /docs/study-room-points as the studio's are
// (scripts/sync-docs.mjs places them under MDX headings). Each row's id (pt-L1, pt-AP1…) is where a tag on the page's
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

export function StudyRoomStatus(): React.JSX.Element {
  return (
    <p className="text-muted-foreground">
      Design intent. Places, sizes and loads come from study-room.json; electrical costs are the studio&rsquo;s
      placeholder prices (AS-21) until three quotes come in, and the Wi-Fi gear is neither sourced nor priced.
    </p>
  )
}
