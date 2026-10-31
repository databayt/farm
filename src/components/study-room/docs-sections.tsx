import type * as React from "react"

import { CircuitsTable } from "@/components/docs/circuits-table"
import { PointsLead } from "@/components/docs/points-table"
import { RailTable } from "@/components/docs/rail-table"
import { RoomPointsTable } from "@/components/docs/room-points"
import { getLocale } from "@/components/internationalization/locale"
import { studyRoomData } from "@/components/study-room/data"
import { rails } from "@/components/study-room/rails"
import { words } from "@/components/study-room/words"

// The study room's reference sections, on its docs pages (D-059: guide/study-room/*.md embeds them; scripts/sync-docs.mjs
// renders each as <Name />). Each row's id (pt-L1, pt-AP1…) is where a tag on the page's
// electrical drawing links; the Wi-Fi's points share the drawing and the table.

export async function StudyRoomElectricPoints(): Promise<React.JSX.Element> {
  const lang = await getLocale()
  const { points, allLinks } = studyRoomData(lang), w = words[lang]
  return (
    <>
      <PointsLead count={points.length} href="/study-room#electrical" drawing={w.pointsDrawing}>
        {w.wifiAmong}
      </PointsLead>
      <RoomPointsTable points={points} circuits={allLinks} />
    </>
  )
}

// What to buy: every rail on the page, as one table (the Materials page)
export async function StudyRoomMaterials(): Promise<React.JSX.Element> {
  return <RailTable rails={rails(await getLocale())} />
}

// The circuits behind the points (the Electric page)
export async function StudyRoomCircuits(): Promise<React.JSX.Element> {
  return <CircuitsTable circuits={studyRoomData(await getLocale()).circuits} />
}
