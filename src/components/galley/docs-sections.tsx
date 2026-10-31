import type * as React from "react"

import { CircuitsTable } from "@/components/docs/circuits-table"
import { PointsLead, PointsTable } from "@/components/docs/points-table"
import { RailTable } from "@/components/docs/rail-table"
import { RunsTable } from "@/components/docs/runs-table"
import { circuitColour, ELECTRIC, WATER, waterColour } from "@/components/galley/data"
import { rails } from "@/components/galley/rails"
import { runLength } from "@/components/galley/service-diagrams"

// The galley's reference sections, on its docs pages (D-059: guide/galley/*.md embeds them; scripts/sync-docs.mjs
// renders each as <Name />). Each row's id (pt-DB, pt-SV…) is where a tag on the page's
// electrical or plumbing drawing links.

export function GalleyElectricPoints(): React.JSX.Element {
  return (
    <>
      <PointsLead count={ELECTRIC.points.length} href="/en/galley#electrical" drawing="galley's electrical drawing" />
      <PointsTable columns={[{ label: "What" }, { label: "Circuit", muted: true }, { label: "Size" }]}
        rows={ELECTRIC.points.map((p) => ({ id: p.id, colour: circuitColour(p), cells: [p.what, p.circuit || "—", p.size] }))} />
    </>
  )
}

export function GalleyPlumbingPoints(): React.JSX.Element {
  return (
    <>
      <PointsLead count={WATER.points.length} href="/en/galley#plumbing" drawing="galley's plumbing drawing">
        The runs: {WATER.runs.map((r) => `${r.id} ${r.dn} mm, ${runLength(r)} m`).join(" · ")}.
      </PointsLead>
      <PointsTable columns={[{ label: "What" }, { label: "Where", muted: true }, { label: "Size" }]}
        rows={WATER.points.map((p) => ({ id: p.id, colour: waterColour(p), cells: [p.what, p.where, p.size] }))} />
    </>
  )
}

// What to buy: every rail on the page, as one table (the Materials page)
export function GalleyMaterials(): React.JSX.Element {
  return <RailTable rails={rails} />
}

// The circuits behind the points (the Electric page)
export function GalleyCircuits(): React.JSX.Element {
  return <CircuitsTable circuits={ELECTRIC.circuits} />
}

// The pipe runs behind the fittings (the Plumbing page)
export function GalleyRuns(): React.JSX.Element {
  return <RunsTable runs={WATER.runs} colours={WATER.colours} />
}
