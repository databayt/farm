import type * as React from "react"

import { cn } from "@/lib/utils"
import { LocaleLink as Link } from "@/components/internationalization/locale-link"

// The points table behind a service, on its place's docs page, as the studio's: a row per tagged point, its anchor
// (#pt-<id>) the target of the tag on the page's drawing, its dot the colour of the circuit or the run that feeds it.
// `end` right-aligns a column of numbers; `muted` greys a column of context (where it is, which circuit).

// The line over a points table: how many points, and the drawing on the place's page whose tags open these rows
// (`href`). Points off the drawing (a soak pit, a feed from the farm) have a row but no tag.
export function PointsLead({ count, href, drawing, children }: {
  count: number; href: string; drawing: string; children?: React.ReactNode
}): React.JSX.Element {
  return (
    <p className="text-muted-foreground">
      {count} points. Each tag on the <Link href={href} className="underline underline-offset-4">{drawing}</Link> opens
      its row here.{children ? <> {children}</> : null}
    </p>
  )
}

export type PointsColumn = { label: string; end?: boolean; muted?: boolean }
export type PointsRow = { id: string; colour?: string; cells: React.ReactNode[] }

export function PointsTable({ columns, rows }: { columns: PointsColumn[]; rows: PointsRow[] }): React.JSX.Element {
  return (
    <div className="mt-6 overflow-x-auto rounded-xl border">
      <table className="w-full text-sm">
        <thead className="text-muted-foreground bg-muted/40">
          <tr>
            {[{ label: "Point" }, ...columns].map((c: PointsColumn) => (
              <th key={c.label} className={cn("px-3 py-2 font-medium whitespace-nowrap", c.end ? "text-end" : "text-start")}>{c.label}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((r) => (
            <tr key={r.id} id={`pt-${r.id}`} className="target:bg-muted/60 scroll-mt-24 border-t">
              <td className="px-3 py-2 font-medium whitespace-nowrap">
                <span className="me-2 inline-block size-2 rounded-full" style={{ background: r.colour ?? "currentColor" }} />{r.id}
              </td>
              {r.cells.map((cell, i) => (
                <td key={i} className={cn("px-3 py-2", columns[i]?.end && "text-end whitespace-nowrap tabular-nums",
                  columns[i]?.muted && "text-muted-foreground")}>{cell}</td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
