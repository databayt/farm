import type * as React from "react"

import { PointsTable } from "@/components/docs/points-table"

// A place's pipe runs on its Plumbing page (D-059): each run's system, size, length (measured along its paths, as the
// page's drawing routes them) and what it does. The JSONs name a run `id` (the galley, the bar) or `run` (the public
// bathroom).
export type Run = { id?: string; run?: string; system: string; dn: number; note: string; paths: number[][][] }

const length = (r: Run) => {
  let m = 0
  for (const path of r.paths) for (let i = 1; i < path.length; i++) m += Math.hypot(...path[i].map((v, k) => v - path[i - 1][k]))
  return Math.round(m * 10) / 10
}

export function RunsTable({ runs, colours }: { runs: Run[]; colours: Record<string, string> }): React.JSX.Element {
  return (
    <PointsTable first="Run"
      columns={[{ label: "System", muted: true }, { label: "Size", end: true }, { label: "Length", end: true }, { label: "What it does" }]}
      rows={runs.map((r) => ({ id: r.id ?? r.run ?? "", colour: colours[r.system], cells: [r.system, `${r.dn} mm`, `${length(r)} m`, r.note] }))} />
  )
}
