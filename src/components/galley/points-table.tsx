// The points table under a service, in the field's water points' pattern: a row per tagged point, its anchor
// (#pt-<id>) the target of the tag on the drawing above, its dot the colour of the run that feeds it.

export function PointsTable({ head, rows }: { head: string[]; rows: { id: string; colour?: string; cells: string[] }[] }) {
  return (
    <div className="mt-6 overflow-x-auto rounded-xl border">
      <table className="w-full text-sm">
        <thead className="text-muted-foreground bg-muted/40">
          <tr>
            {["Point", ...head].map((h) => <th key={h} className="px-3 py-2 text-start font-medium">{h}</th>)}
          </tr>
        </thead>
        <tbody>
          {rows.map((r) => (
            <tr key={r.id} id={`pt-${r.id}`} className="scroll-mt-24 border-t target:bg-muted/60">
              <td className="px-3 py-2 font-medium whitespace-nowrap">
                <span className="me-2 inline-block size-2 rounded-full" style={{ background: r.colour ?? "currentColor" }} />{r.id}
              </td>
              {r.cells.map((c, i) => <td key={i} className={i === 1 ? "text-muted-foreground px-3 py-2" : "px-3 py-2"}>{c}</td>)}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
