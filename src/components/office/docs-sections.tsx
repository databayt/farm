import type * as React from "react"

import { CircuitsTable } from "@/components/docs/circuits-table"
import { PointsLead } from "@/components/docs/points-table"
import { RailTable } from "@/components/docs/rail-table"
import { RoomPointsTable } from "@/components/docs/room-points"
import { getLocale } from "@/components/internationalization/locale"
import { officeData } from "@/components/office/data"
import { rails } from "@/components/office/rails"
import { words } from "@/components/office/words"

// The office's reference sections, on its docs pages (D-059: guide/office/*.md embeds them; scripts/sync-docs.mjs
// renders each as <Name />). Each row's id (pt-L1, pt-AP1…) is where a tag on the page's
// electrical or network drawing links.

export async function OfficeElectricPoints(): Promise<React.JSX.Element> {
  const lang = await getLocale()
  const { points, circuits } = officeData(lang)
  return (
    <>
      <PointsLead count={points.length} href="/office#electrical" drawing={words[lang].pointsDrawing.electric} />
      <RoomPointsTable points={points} circuits={circuits} />
    </>
  )
}

export async function OfficeNetworkPoints(): Promise<React.JSX.Element> {
  const lang = await getLocale()
  const { netPoints, netLinks } = officeData(lang)
  return (
    <>
      <PointsLead count={netPoints.length} href="/office#network" drawing={words[lang].pointsDrawing.network} />
      <RoomPointsTable points={netPoints} circuits={netLinks} />
    </>
  )
}

// What to buy: every rail on the page, as one table (the Materials page)
export async function OfficeMaterials(): Promise<React.JSX.Element> {
  return <RailTable rails={rails(await getLocale())} />
}

// The circuits behind the points (the Electric page)
export async function OfficeCircuits(): Promise<React.JSX.Element> {
  return <CircuitsTable circuits={officeData(await getLocale()).circuits} />
}
