// The stock one bed (kit K4) needs, priced with the BOM's placeholders, from render/bed/parts.json
// (scripts/studio/render/bed_parts.py, which nests the bed's parts on their own sheets).
import bed from "../../public/designs/studio/render/bed/parts.json"

export function bedStock() {
  const sheets18 = bed.sheets.filter((s) => s.material === "PLY18").length
  const sheets12 = bed.sheets.filter((s) => s.material === "PLY12").length
  const edge = Math.ceil(bed.parts.reduce((n, p) => n + p.edgeM, 0))
  const hardware = bed.hardware.reduce((n, h) => n + h.qty * h.price, 0)
  const total = sheets18 * bed.prices.PLY18 + sheets12 * bed.prices.PLY12 + edge * bed.prices.edgeband + hardware
  return { sheets18, sheets12, edge, total }
}
