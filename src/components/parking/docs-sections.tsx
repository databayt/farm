import type * as React from "react"

import { PointsLead, PointsTable } from "@/components/docs/points-table"
import { RailTable } from "@/components/docs/rail-table"
import { drainPoints, lightPoints } from "@/components/parking/data"
import { rails } from "@/components/parking/rails"
import { words } from "@/components/parking/words"
import { dictionary } from "@/components/internationalization/dictionaries"
import type { Locale } from "@/components/internationalization/config"
import { getLocale } from "@/components/internationalization/locale"

// The way in's reference sections, on its docs pages (D-059: guide/parking/*.md embeds them; scripts/sync-docs.mjs
// renders each as <Name />). Each row's id (pt-EB, pt-T1…) is where a tag on the page's
// lighting or drainage drawing links.

const columns = (lang: Locale) => {
  const t = dictionary(lang).table
  return [{ label: t.what }, { label: t.where, muted: true }, { label: t.size }]
}

export async function ParkingLightingPoints(): Promise<React.JSX.Element> {
  const lang = await getLocale()
  const points = lightPoints(lang)
  return (
    <>
      <PointsLead count={points.length} href="/parking#lighting" drawing={words[lang].points.lightDrawing} />
      <PointsTable columns={columns(lang)} rows={points.map((p) => ({ id: p.id, colour: p.colour, cells: [p.what, p.where, p.size] }))} />
    </>
  )
}

export async function ParkingDrainagePoints(): Promise<React.JSX.Element> {
  const lang = await getLocale()
  const points = drainPoints(lang)
  return (
    <>
      <PointsLead count={points.length} href="/parking#drainage" drawing={words[lang].points.drainDrawing} />
      <PointsTable columns={columns(lang)} rows={points.map((p) => ({ id: p.id, colour: p.colour, cells: [p.what, p.where, p.size] }))} />
    </>
  )
}

// What to buy: every rail on the page, as one table (the Materials page)
export async function ParkingMaterials(): Promise<React.JSX.Element> {
  return <RailTable rails={rails(await getLocale())} />
}
