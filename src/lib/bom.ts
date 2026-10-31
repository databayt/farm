import catalogue from "@/components/site/prices.json"

// Every place's bill of materials, built one way (the plan of 2026-10-31, D-064). A place lists its lines in its
// own bom.ts, each with a quantity from its drawing's numbers; a line is priced from the shared catalogue
// (src/components/site/prices.json, written by scripts/site/prices.py from the studio generator's prices), so the
// same part costs the same in every place and a quote recorded once reprices them all. A line the catalogue does
// not price stays unpriced ("not priced yet") rather than take a made-up figure, and the bill says how many of its
// lines carry a price. Reused and owned lines cost nothing.

export type Status = "buy" | "reuse" | "owned"
/** A unit price and where it comes from: label V (a published price, its id in study/registers/prices.csv) or A (a
 *  placeholder under an assumption, AS-21 for the studio's catalogue). */
export type Price = { rwf: number; label: string; source: string }
export type Line = {
  section: string
  group?: string
  item: string
  qty: number
  unit: string
  /** a key of the catalogue (prices.json `parts`), priced as the studio prices it */
  part?: string
  /** a price of its own, for a line the catalogue does not hold (its label and source required) */
  price?: Price
  status?: Status
}

type Catalogue = { contingency: number; parts: Record<string, { rwf: number; label: string; source: string; note: string }> }
const C = catalogue as Catalogue
export const CONTINGENCY = C.contingency

/** The catalogue's price for a part, or undefined when it has none. */
export function partPrice(key: string | undefined): Price | undefined {
  const p = key ? C.parts[key] : undefined
  return p ? { rwf: p.rwf, label: p.label, source: p.source } : undefined
}

// Device models drawn on the places' electric pages (their JSON `electric.points[].model`), as the catalogue's parts.
// A place passes its own for a model that is a different thing there (the galley's roof fan is not a wall fan).
export const MODEL_PART: Record<string, string | undefined> = {
  board: "db", ceiling: "luminaire", pendant: "luminaire", light: "luminaire", walllight: "luminaire", strip: "luminaire",
  batten: "luminaire", bar: "bulkhead", bulkhead: "bulkhead", switch: "switch", switch2: "switch", switch65: "switch65",
  socket: "socket2", socket2: "socket2", single: "socket", usb: "usbsocket", socket66: "socket66", isolator: "isolator",
  outlet: "fcu", alarm: "alarm", earth: "earthrod", fan: "fan", wallfan: "fan", heater: "heater_instant",
}
// A cable size as the catalogue's part
export const cablePart = (mm2: number): string | undefined => C.parts[`cable${mm2.toFixed(1)}`] ? `cable${mm2.toFixed(1)}` : undefined
// A pipe by its system and size, as the catalogue's part: PP-R for supply (DN20 takes the 15 mm feeds), uPVC for
// drains and vents, the next size up where the catalogue has no exact one
export function pipePart(system: string, dn: number): string | undefined {
  const sizes: [number, string][] = system === "cold" || system === "hot"
    ? [[20, "pipe_ppr20"], [25, "pipe_ppr25"]]
    : [[40, "pipe_upvc40"], [50, "pipe_upvc50"], [75, "pipe_upvc75"], [110, "pipe_upvc110"]]
  return sizes.find(([d]) => d >= dn)?.[1]
}

/** A line's unit price: its own, else its part's, else none. Reused and owned lines are priced at nothing. */
export function priceOf(l: Line): Price | null {
  if (l.status === "reuse" || l.status === "owned") return { rwf: 0, label: "", source: "" }
  return l.price ?? partPrice(l.part) ?? null
}

export type BillLine = { item: string; qty: number; unit: string; price: number | null; total: number | null; label?: string; source?: string; status: Status }
export type BillGroup = { name: string; lines: BillLine[]; total: number }
export type BillSection = { name: string; groups: BillGroup[]; total: number; lines: number; priced: number }
export type Bill = { sections: BillSection[]; subtotal: number; contingency: number; total: number; lines: number; priced: number }

const round = (n: number) => Math.round(n * 100) / 100

/** The bill: its sections and groups in the order the lines first name them, each with the total of its priced
 *  lines, then the contingency on the priced subtotal and the total. */
export function bill(lines: Line[], contingency = CONTINGENCY): Bill {
  const sections = new Map<string, Map<string, BillLine[]>>()
  for (const l of lines) {
    if (l.qty <= 0) continue
    const p = priceOf(l), qty = round(l.qty)
    const row: BillLine = { item: l.item, qty, unit: l.unit, price: p ? p.rwf : null, total: p ? Math.round(qty * p.rwf) : null,
      label: p?.label || undefined, source: p?.source || undefined, status: l.status ?? "buy" }
    const groups = sections.get(l.section) ?? sections.set(l.section, new Map()).get(l.section)!
    const g = l.group ?? l.section
    groups.set(g, [...(groups.get(g) ?? []), row])
  }
  const out: BillSection[] = [...sections].map(([name, groups]) => {
    const gs = [...groups].map(([g, rows]) => ({ name: g, lines: rows, total: rows.reduce((n, r) => n + (r.total ?? 0), 0) }))
    const rows = gs.flatMap((g) => g.lines)
    return { name, groups: gs, total: gs.reduce((n, g) => n + g.total, 0), lines: rows.length, priced: rows.filter((r) => r.price !== null).length }
  })
  const subtotal = out.reduce((n, s) => n + s.total, 0)
  const extra = Math.round(subtotal * contingency)
  return { sections: out, subtotal, contingency: extra, total: subtotal + extra,
    lines: out.reduce((n, s) => n + s.lines, 0), priced: out.reduce((n, s) => n + s.priced, 0) }
}
