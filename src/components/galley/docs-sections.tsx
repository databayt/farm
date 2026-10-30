import type * as React from "react"

import { PointsLead, PointsTable } from "@/components/docs/points-table"
import { circuitColour, ELECTRIC, WATER, waterColour } from "@/components/galley/data"
import { runLength } from "@/components/galley/service-diagrams"

// The galley's reference sections, moved off /en/galley onto /docs/galley-points as the studio's are
// (scripts/sync-docs.mjs places them under MDX headings). Each row's id (pt-DB, pt-SV…) is where a tag on the page's
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

export function GalleyStatus(): React.JSX.Element {
  return (
    <p className="text-muted-foreground">
      Design intent. Places and sizes come from galley.json: the pipe sizes until the plumber checks them, the ratings
      until a RURA class A electrician certifies. The cooking line is drawn electric; gas or electric is still open.
      Nothing is sourced or priced yet.
    </p>
  )
}
