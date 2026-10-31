import type * as React from "react"

import { barData, circuitColour, waterColour } from "@/components/bar/data"
import { rails } from "@/components/bar/rails"
import { CircuitsTable } from "@/components/docs/circuits-table"
import { PointsLead, PointsTable } from "@/components/docs/points-table"
import { RailTable } from "@/components/docs/rail-table"
import { RunsTable } from "@/components/docs/runs-table"
import { runLength } from "@/components/galley/service-diagrams"
import { words } from "@/components/bar/words"
import { dictionary } from "@/components/internationalization/dictionaries"
import { getLocale } from "@/components/internationalization/locale"

// The bar's reference sections, on its docs pages (D-059: guide/bar/*.md embeds them; scripts/sync-docs.mjs renders
// each as <Name />). Each row's id (pt-DB, pt-SV…) is where a tag on the page's electrical or plumbing
// drawing links.

export async function BarElectricPoints(): Promise<React.JSX.Element> {
  const lang = await getLocale()
  const { ELECTRIC } = barData(lang), t = dictionary(lang).table
  return (
    <>
      <PointsLead count={ELECTRIC.points.length} href="/bar#electrical" drawing={words[lang].pointsDrawing.electric} />
      <PointsTable columns={[{ label: t.what }, { label: t.circuit, muted: true }, { label: t.size }]}
        rows={ELECTRIC.points.map((p) => ({ id: p.id, colour: circuitColour(p), cells: [p.what, p.circuit || "—", p.size] }))} />
    </>
  )
}

export async function BarPlumbingPoints(): Promise<React.JSX.Element> {
  const lang = await getLocale()
  const { WATER } = barData(lang), t = dictionary(lang).table
  return (
    <>
      <PointsLead count={WATER.points.length} href="/bar#plumbing" drawing={words[lang].pointsDrawing.plumbing}>
        {words[lang].theRuns} {WATER.runs.map((r) => `${r.id} ${r.dn} mm, ${runLength(r)} m`).join(" · ")}.
      </PointsLead>
      <PointsTable columns={[{ label: t.what }, { label: t.where, muted: true }, { label: t.size }]}
        rows={WATER.points.map((p) => ({ id: p.id, colour: waterColour(p), cells: [p.what, p.where, p.size] }))} />
    </>
  )
}

// What to buy: every rail on the page, as one table (the Materials page)
export async function BarMaterials(): Promise<React.JSX.Element> {
  return <RailTable rails={rails(await getLocale())} />
}

// The circuits behind the points (the Electric page)
export async function BarCircuits(): Promise<React.JSX.Element> {
  return <CircuitsTable circuits={barData(await getLocale()).ELECTRIC.circuits} />
}

// The pipe runs behind the fittings (the Plumbing page)
export async function BarRuns(): Promise<React.JSX.Element> {
  const { WATER } = barData(await getLocale())
  return <RunsTable runs={WATER.runs} colours={WATER.colours} />
}
