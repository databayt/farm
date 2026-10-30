import type * as React from "react"

import { frw } from "@/lib/format"

// A bill of materials on a docs page (the studio's and the field's): a row per section with its total, opening onto
// its lines, sorted into groups when a section has more than one; then the materials and labour, the contingency and
// the total. Native <details>, so it needs no script.

export type BomLine = { item: string; qty: number; unit: string; price: number; total: number; label?: string }
export type BomGroup = { name: string; lines: BomLine[]; total: number }
export type BomSection = { name: string; groups: BomGroup[]; total: number; lines: number }

export function BomTable({ sections, contingency, total }: {
  sections: BomSection[]; contingency: { label: string; rwf: number }; total: { label: string; rwf: number }
}): React.JSX.Element {
  return (
    <div className="mt-6 overflow-hidden rounded-xl border">
      {sections.map((t) => (
        <details key={t.name} className="group border-b">
          <summary className="hover:bg-muted/40 flex cursor-pointer list-none items-center gap-3 px-4 py-3 [&::-webkit-details-marker]:hidden">
            <svg viewBox="0 0 24 24" className="text-muted-foreground size-4 shrink-0 transition-transform group-open:rotate-90 rtl:-scale-x-100"
              fill="none" stroke="currentColor" strokeWidth={2.25} strokeLinecap="round" strokeLinejoin="round" aria-hidden>
              <path d="M9 18l6-6-6-6" />
            </svg>
            <span className="font-semibold">{t.name}</span>
            <span className="text-muted-foreground text-sm">{t.lines} {t.lines === 1 ? "line" : "lines"}</span>
            <span className="ms-auto font-semibold tabular-nums">{frw(t.total)}</span>
          </summary>
          <div className="overflow-x-auto border-t">
            <table className="w-full text-sm">
              <thead className="text-muted-foreground bg-muted/40">
                <tr>
                  <th className="px-3 py-2 ps-11 text-start font-medium">Item</th>
                  <th className="px-3 py-2 text-end font-medium">Qty</th>
                  <th className="px-3 py-2 text-end font-medium whitespace-nowrap">Unit price (RWF)</th>
                  <th className="px-4 py-2 text-end font-medium whitespace-nowrap">Total (RWF)</th>
                </tr>
              </thead>
              {t.groups.map((g) => (
                <tbody key={g.name}>
                  {t.groups.length > 1 ? (
                    <tr className="border-t bg-muted/20">
                      <th colSpan={3} className="px-3 py-2 ps-11 text-start font-medium">{g.name}</th>
                      <td className="text-muted-foreground px-4 py-2 text-end tabular-nums">{frw(g.total)}</td>
                    </tr>
                  ) : null}
                  {g.lines.map((l, i) => (
                    <tr key={`${l.item}-${i}`} className="border-t">
                      <td className="px-3 py-2 ps-11">{l.item}</td>
                      <td className="px-3 py-2 text-end whitespace-nowrap tabular-nums">{l.qty} {l.unit === "each" ? "" : l.unit}</td>
                      <td className="text-muted-foreground px-3 py-2 text-end tabular-nums">{frw(l.price)}</td>
                      <td className="px-4 py-2 text-end tabular-nums">{frw(l.total)}</td>
                    </tr>
                  ))}
                </tbody>
              ))}
            </table>
          </div>
        </details>
      ))}
      <div className="bg-muted/20 flex px-4 py-2.5 text-sm">
        <span>Materials and labour</span>
        <span className="ms-auto tabular-nums">{frw(sections.reduce((n, t) => n + t.total, 0))}</span>
      </div>
      <div className="flex border-t px-4 py-2.5 text-sm">
        <span>{contingency.label}</span>
        <span className="ms-auto tabular-nums">{frw(contingency.rwf)}</span>
      </div>
      <div className="flex border-t-2 px-4 py-3 font-semibold">
        <span>{total.label}</span>
        <span className="ms-auto tabular-nums">{frw(total.rwf)}</span>
      </div>
    </div>
  )
}
