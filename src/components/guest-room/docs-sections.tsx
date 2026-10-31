import type * as React from "react"

import { CircuitsTable } from "@/components/docs/circuits-table"
import { PointsLead } from "@/components/docs/points-table"
import { RailTable } from "@/components/docs/rail-table"
import { RoomPointsTable } from "@/components/docs/room-points"
import { guestRoomData } from "@/components/guest-room/data"
import { rails } from "@/components/guest-room/rails"
import { words } from "@/components/guest-room/words"
import { getLocale } from "@/components/internationalization/locale"

// The guest room's reference sections, on its docs pages (D-059: guide/guest-room/*.md embeds them; scripts/sync-docs.mjs
// renders each as <Name />). Each row's id (pt-L1, pt-P1…) is where a tag on the page's
// electrical drawing links.

export async function GuestRoomElectricPoints(): Promise<React.JSX.Element> {
  const lang = await getLocale()
  const { points, circuits } = guestRoomData(lang)
  return (
    <>
      <PointsLead count={points.length} href="/guest-room#electrical" drawing={words[lang].pointsDrawing} />
      <RoomPointsTable points={points} circuits={circuits} />
    </>
  )
}

// What to buy: every rail on the page, as one table (the Materials page)
export async function GuestRoomMaterials(): Promise<React.JSX.Element> {
  return <RailTable rails={rails(await getLocale())} />
}

// The circuits behind the points (the Electric page)
export async function GuestRoomCircuits(): Promise<React.JSX.Element> {
  return <CircuitsTable circuits={guestRoomData(await getLocale()).circuits} />
}
