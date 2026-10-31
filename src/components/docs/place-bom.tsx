import type * as React from "react"

import { bomWords } from "@/components/docs/bom-lines"
import { type BomSection, BomTable } from "@/components/docs/bom-table"
import type { Locale } from "@/components/internationalization/config"
import { bill, type Bill, type Line } from "@/lib/bom"
import { rwf } from "@/lib/format"

// A place's bill of materials on its Materials page (D-059): its lines (the place's bom.ts) built into a bill
// (src/lib/bom.ts) and set in the studio's table, its units in the reader's words, after one line saying how much of
// it is priced.

export function tableSections(b: Bill, lang: Locale): BomSection[] {
  const units = bomWords[lang].units
  return b.sections.map((s) => ({
    name: s.name, total: s.total, lines: s.lines, priced: s.priced,
    groups: s.groups.map((g) => ({ ...g, lines: g.lines.map((l) => ({ ...l, unit: units[l.unit] ?? l.unit })) })),
  }))
}

export function PlaceBom({ lines, lang }: { lines: Line[]; lang: Locale }): React.JSX.Element {
  const t = bomWords[lang], b = bill(lines)
  return (
    <>
      <p className="text-muted-foreground">{t.lead(b.priced, b.lines, rwf(b.total))}</p>
      <BomTable sections={tableSections(b, lang)} contingency={{ label: t.contingency, rwf: b.contingency }} total={{ label: t.total, rwf: b.total }} />
    </>
  )
}
