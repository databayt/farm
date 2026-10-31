import { labourLine } from "@/components/docs/bom-lines"
import type { Locale } from "@/components/internationalization/config"
import { baseM3, boxM2, edgingM, gravelM2, pegs, stripM, topM3 } from "@/components/parking/data"
import P from "@/components/parking/parking.json"
import { words } from "@/components/parking/words"
import type { Line } from "@/lib/bom"

// The way in's bill of materials (D-065), every quantity from parking.json and data.ts: the gate, the sign wall and
// the hedge; the gravel parking in its timber edging; the turn and the rock road in setts; the solar lights; the
// trench and the soakaway; the trees. Little of it is a part the studio buys, so most lines wait for quotes: the
// bill is first a list of quantities to ask for them.

const r1 = (n: number) => Math.round(n * 10) / 10
const r2 = (n: number) => Math.round(n * 100) / 100
// a polygon's area (the turn's mouth), and the length of the rock road's centre line, a cubic Bézier
const area = (pts: number[][]) => Math.abs(pts.reduce((n, [x, y], i) => { const [u, v] = pts[(i + 1) % pts.length]; return n + x * v - u * y }, 0)) / 2
function curveLength(c: number[][], steps = 60): number {
  const at = (t: number) => [0, 1].map((i) => (1 - t) ** 3 * c[0][i] + 3 * (1 - t) ** 2 * t * c[1][i] + 3 * (1 - t) * t ** 2 * c[2][i] + t ** 3 * c[3][i])
  let n = 0, prev = at(0)
  for (let k = 1; k <= steps; k++) { const p = at(k / steps); n += Math.hypot(p[0] - prev[0], p[1] - prev[1]); prev = p }
  return n
}

export function parkingBom(lang: Locale): Line[] {
  const t = words[lang].bom, s = t.sections
  const { gate: G, sign: S, hedge: H, parking: PK, turn: T, road: R, rockRoad: RR, drainage: DR, lighting: LT, trees: TR } = P
  const [gl, gr] = G.x, p = G.post, front = G.y - p / 2
  const turn = area([[gl, PK.box[1]], [gl, front], [gl - p, front], [gl - p - T.splay, R.edge], [gr + p + T.splay, R.edge], [gr + p, front], [gr, front], [gr, PK.box[1]]])
  const roadL = curveLength(RR.curve), setts = turn + (RR.width - 2 * RR.edging) * roadL
  const panel = (S.box[2] - S.box[0] - 2 * S.panel.inset) * (S.panel.y1 - S.panel.y0)
  const hedge = H.runs.reduce((n, [a, b]) => n + b - a, 0)
  // the edging, the strips and the pegs in treated eucalyptus: 150 x 50 boards, 50 x 50 x 400 pegs, a tenth for offcuts
  const timber = ((edgingM + stripM) * PK.edging.h * PK.edging.w + pegs * 0.05 * 0.05 * 0.4) * 1.1
  const trenchL = DR.trench.y[1] - DR.trench.y[0], pipeL = trenchL + Math.hypot(DR.trench.x - DR.pit.at[0], DR.trench.y[0] - DR.pit.at[1])
  return [
    { section: s.entrance, item: t.gate(+(gr - gl).toFixed(1)), qty: 1, unit: "set" },
    { section: s.entrance, item: t.innerGate, qty: 1, unit: "set" },
    { section: s.entrance, item: t.sign(+(S.box[2] - S.box[0]).toFixed(1), S.h), qty: 1, unit: "each" },
    // the letters' panel: 2 mm steel sheet, 15.7 kg a square metre, a fifth more for its frame, priced as the studio's fabricated steel
    { section: s.entrance, item: t.panel(r1(panel)), qty: Math.round(panel * 15.7 * 1.2), unit: "kg", part: "steel_kg" },
    { section: s.entrance, item: t.letters, qty: 1, unit: "set" },
    { section: s.entrance, item: t.hedge(r1(hedge)), qty: Math.ceil(hedge * 3), unit: "each" },
    labourLine(lang, "mason", s.entrance),
    { section: s.parking, item: t.geotextile, qty: r1(boxM2 * 1.1), unit: "m2" },
    { section: s.parking, item: t.base(r1(gravelM2)), qty: r1(baseM3 * 1.3), unit: "m3" },
    { section: s.parking, item: t.gravel, qty: r1(topM3 * 1.2), unit: "m3" },
    { section: s.parking, item: t.edging(Math.round(edgingM + stripM), pegs), qty: r2(timber), unit: "m3", part: "timber_m3" },
    { section: s.parking, item: t.stops, qty: PK.bays.length - 1, unit: "each" },
    labourLine(lang, "builder", s.parking),
    { section: s.road, item: t.setts(r1(roadL)), qty: r1(setts * 1.05), unit: "m2" },
    { section: s.road, item: t.roadEdging, qty: r1(2 * RR.edging * roadL), unit: "m2" },
    { section: s.road, item: t.sand, qty: r1(setts * 0.05), unit: "m3" },
    labourLine(lang, "mason", s.road),
    { section: s.lights, item: t.bollard, qty: LT.bollards.at.length, unit: "each" },
    { section: s.lights, item: t.footing, qty: LT.bollards.at.length, unit: "each" },
    { section: s.lights, item: t.lantern, qty: 2, unit: "each" },
    { section: s.lights, item: t.solarPanel(LT.panel.watts), qty: 1, unit: "each" },
    { section: s.lights, item: t.kitBox, qty: 1, unit: "set" },
    labourLine(lang, "electrician", s.lights),
    { section: s.drainage, item: t.stone, qty: r1((trenchL * DR.trench.w * DR.trench.depth + DR.pit.size ** 2 * DR.pit.depth) * 1.1), unit: "m3" },
    { section: s.drainage, item: t.wrap, qty: r1((2 * (DR.trench.w + DR.trench.depth) * trenchL + 5 * DR.pit.size ** 2) * 1.15), unit: "m2" },
    { section: s.drainage, item: t.pipe(Math.round(DR.trench.pipe * 1000)), qty: r1(pipeL * 1.1), unit: "m" },
    { section: s.drainage, item: t.cover(DR.pit.size), qty: 1, unit: "each" },
    { section: s.trees, item: t.tree, qty: TR.list.length, unit: "each" },
    labourLine(lang, "gardener", s.trees),
  ]
}
