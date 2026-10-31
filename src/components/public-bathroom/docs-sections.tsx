import type * as React from "react"

import { CircuitsTable } from "@/components/docs/circuits-table"
import { PointsLead, PointsTable } from "@/components/docs/points-table"
import { RailTable } from "@/components/docs/rail-table"
import { RunsTable } from "@/components/docs/runs-table"
import { electricPoints, plumbingPoints } from "@/components/public-bathroom/data"
import bath from "@/components/public-bathroom/public-bathroom.json"
import { rails } from "@/components/public-bathroom/rails"

// The public bathroom's reference sections, on its docs pages (D-059: guide/public-bathroom/*.md embeds them;
// scripts/sync-docs.mjs renders each as <Name />). Each row's id (pt-DB, pt-SV…) is where a tag on
// the page's electrical or plumbing drawing links.

export function PublicBathroomElectricPoints(): React.JSX.Element {
  return (
    <>
      <PointsLead count={electricPoints.length} href="/en/public-bathroom#electrical" drawing="bathroom's electrical drawing" />
      <PointsTable columns={[{ label: "What" }, { label: "Size or circuit", muted: true }]}
        rows={electricPoints.map((p) => ({ id: p.id, colour: p.colour, cells: [p.what, p.size] }))} />
    </>
  )
}

export function PublicBathroomPlumbingPoints(): React.JSX.Element {
  return (
    <>
      <PointsLead count={plumbingPoints.length} href="/en/public-bathroom#plumbing" drawing="bathroom's plumbing drawing" />
      <PointsTable columns={[{ label: "What" }, { label: "Pipes", muted: true }, { label: "Size" }]}
        rows={plumbingPoints.map((p) => ({ id: p.id, colour: p.colour, cells: [p.what, p.runs, p.size] }))} />
    </>
  )
}

// What to buy: every rail on the page, as one table (the Materials page)
export function PublicBathroomMaterials(): React.JSX.Element {
  return <RailTable rails={rails} />
}

// The circuits behind the points (the Electric page)
export function PublicBathroomCircuits(): React.JSX.Element {
  return <CircuitsTable circuits={bath.electric.circuits} />
}

// The pipe runs behind the fittings (the Plumbing page)
export function PublicBathroomRuns(): React.JSX.Element {
  return <RunsTable runs={bath.plumbing.runs} colours={bath.plumbing.colours} />
}
