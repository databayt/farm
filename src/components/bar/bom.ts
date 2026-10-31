import B from "@/components/bar/bar.json"
import { words } from "@/components/bar/words"
import { type Electric, boardLines, carcassArea, electricLines, labourLine, liningLines, type Water, waterLines } from "@/components/docs/bom-lines"
import type { Locale } from "@/components/internationalization/config"
import type { Line } from "@/lib/bom"

// The bar's bill of materials (D-065), every quantity from bar.json: the equipment, the joinery as boards and pieces,
// the linings of the box, the deck and its lounge, the electrics and the water. Priced where the studio prices the
// same part (src/components/site/prices.json); the machines, the fridges, the furniture and the labour wait for quotes.

const K = B.container, I = B.inside, D = B.deck, LO = B.lounge
const r2 = (n: number) => Math.round(n * 100) / 100

export function barBom(lang: Locale): Line[] {
  const w = words[lang], t = w.bom
  const span = (u: { x0: number; x1: number }) => u.x1 - u.x0
  // the inside of the box: its length and width inside the walls, its height under the lined ceiling
  const inside = { l: K.l - 2 * K.wall, w: K.w - 2 * K.wall, h: K.h - K.floor - 0.15 }
  // the joinery as board: the work counter's carcasses, the back bar's, its three shelves and the store cupboard
  const top = B.hatch.sill - 0.1
  const m2 = carcassArea({ l: span(I.front), d: I.front.d, h: top }) + carcassArea({ l: span(I.back), d: I.back.d, h: top })
    + I.back.shelves.length * span(I.back) * I.back.shelf + carcassArea({ l: span(I.store), d: I.store.d, h: I.store.h })
  const doors = Math.round(span(I.back) / 0.6) + 2 + 1 // the back bar's, the front cupboard's two, the sink unit's
  // the deck: 25 mm boards and the step on 50 x 100 joists at 400 mm, on two bearers, a tenth for offcuts
  const deckM2 = span(D) * (D.d - 0.1) + span(D.step) * D.step.d
  const joists = (Math.ceil(span(D) / 0.4) + 1) * (D.d - 0.1) * 0.005 + 2 * span(D) * 0.01
  const sec = { equipment: t.sections.equipment, outside: t.sections.outside }
  const fridges = I.front.units.filter((u) => u.id === "fridge").length
  return [
    { section: sec.equipment, item: t.coffee, qty: 1, unit: "each" },
    { section: sec.equipment, item: t.grinder, qty: 1, unit: "each" },
    { section: sec.equipment, item: t.fridge, qty: fridges, unit: "each" },
    { section: sec.equipment, item: t.sink, qty: 1, unit: "each", part: "sink" },
    { section: t.sections.joinery, item: t.counter(+span(I.front).toFixed(1)), qty: 1, unit: "each" },
    { section: t.sections.joinery, item: t.back(+span(I.back).toFixed(1), I.back.shelves.length), qty: 1, unit: "each" },
    { section: t.sections.joinery, item: t.store, qty: 1, unit: "each" },
    ...boardLines(lang, { m2, worktop: span(I.front) + span(I.back), hinges: doors * 2 + 1, runners: 3, handles: doors + 3 }, t.sections.joinery),
    labourLine(lang, "carpenter", t.sections.joinery),
    ...liningLines(lang, { ...inside, ends: 1, open: span(B.hatch) * (B.hatch.head - B.hatch.sill) }),
    { section: sec.outside, item: t.ledge, qty: 1, unit: "each", status: "reuse" },
    { section: sec.outside, item: t.struts, qty: B.hatch.flap.struts, unit: "each" },
    { section: sec.outside, item: t.deck(r2(deckM2)), qty: r2((deckM2 * 0.025 + joists) * 1.1), unit: "m3", part: "timber_m3" },
    { section: sec.outside, item: t.pads, qty: 2 * (Math.ceil(span(D) / 1.5) + 1), unit: "each" },
    { section: sec.outside, item: t.chair, qty: LO.pairs.length * 2, unit: "each" },
    { section: sec.outside, item: t.table, qty: LO.pairs.length, unit: "each" },
    labourLine(lang, "welder", sec.outside),
    ...electricLines(lang, B.electric as unknown as Electric, { name: (m) => w.rails.electric[m] ?? m }),
    ...waterLines(lang, B.water as unknown as Water, {
      name: (k) => (w.rails.water as unknown as Record<string, string>)[k] ?? k, skip: ["coffeefeed"],
    }),
  ]
}
