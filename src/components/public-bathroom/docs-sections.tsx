import type * as React from "react"

import { CircuitsTable } from "@/components/docs/circuits-table"
import { PointsLead, PointsTable } from "@/components/docs/points-table"
import { RailTable } from "@/components/docs/rail-table"
import { RunsTable } from "@/components/docs/runs-table"
import { bathData } from "@/components/public-bathroom/data"
import bath from "@/components/public-bathroom/public-bathroom.json"
import { rails } from "@/components/public-bathroom/rails"
import { words } from "@/components/public-bathroom/words"
import { dictionary } from "@/components/internationalization/dictionaries"
import { getLocale } from "@/components/internationalization/locale"

// The public bathroom's reference sections, on its docs pages (D-059: guide/public-bathroom/*.md embeds them;
// scripts/sync-docs.mjs renders each as <Name />). Each row's id (pt-DB, pt-SV…) is where a tag on
// the page's electrical or plumbing drawing links.

export async function PublicBathroomElectricPoints(): Promise<React.JSX.Element> {
  const lang = await getLocale()
  const { electricPoints } = bathData(lang), w = words[lang], t = dictionary(lang).table
  return (
    <>
      <PointsLead count={electricPoints.length} href="/public-bathroom#electrical" drawing={w.pointsDrawing.electric} />
      <PointsTable columns={[{ label: t.what }, { label: w.table.sizeOrCircuit, muted: true }]}
        rows={electricPoints.map((p) => ({ id: p.id, colour: p.colour, cells: [p.what, p.size] }))} />
    </>
  )
}

export async function PublicBathroomPlumbingPoints(): Promise<React.JSX.Element> {
  const lang = await getLocale()
  const { plumbingPoints } = bathData(lang), w = words[lang], t = dictionary(lang).table
  return (
    <>
      <PointsLead count={plumbingPoints.length} href="/public-bathroom#plumbing" drawing={w.pointsDrawing.plumbing} />
      <PointsTable columns={[{ label: t.what }, { label: w.table.pipes, muted: true }, { label: t.size }]}
        rows={plumbingPoints.map((p) => ({ id: p.id, colour: p.colour, cells: [p.what, p.runs, p.size] }))} />
    </>
  )
}

// What to buy: every rail on the page, as one table (the Materials page)
export async function PublicBathroomMaterials(): Promise<React.JSX.Element> {
  return <RailTable rails={rails(await getLocale())} />
}

// The circuits behind the points (the Electric page)
export async function PublicBathroomCircuits(): Promise<React.JSX.Element> {
  return <CircuitsTable circuits={bathData(await getLocale()).circuits} />
}

// The pipe runs behind the fittings (the Plumbing page)
export async function PublicBathroomRuns(): Promise<React.JSX.Element> {
  return <RunsTable runs={bathData(await getLocale()).runs} colours={bath.plumbing.colours} />
}
