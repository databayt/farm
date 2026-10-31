import { getWords } from "@/components/internationalization/words"
import { Chain } from "@/components/drawing/dims"
import { frame } from "@/components/drawing/geometry"

import plan from "../../../public/designs/farming/data/plan.json"
import { words } from "./words"

// The vegetable field drawn in the pattern of the studio's plan (public/designs/studio/render/plan.svg) and seen from
// the front: the gate and the garden walk to the galley at the bottom, toward the viewer, as the studio's and the
// livestock yard's. Abstract: the fence a solid band, each bed only its outline, solid where it is planted this season
// and dashed where it rests or grows for sale (the crops are in the Crops section); its dimensions as the studio's plan
// sets them (src/components/drawing): the blocks and paths across the gate side, named, then the field's width; the
// beds' lengths and the paths down the side, then the field's depth. Everything comes from the generated plan (scripts/site/farming.mjs), whose
// metres run x to the galley and y down the master plan; here they are turned a quarter so the gate faces the viewer.

const { beds, fence, gate, main, mainY, fruit } = plan
const line = { fill: "none", stroke: "currentColor", strokeWidth: 0.9, vectorEffect: "non-scaling-stroke" } as const
const dashed = { ...line, strokeDasharray: "4 3" } as const
const solid = { fill: "currentColor" } as const
const font = { fontFamily: "Helvetica, Arial, sans-serif", fill: "currentColor" } as const
const small = { ...font, fontSize: 0.95 } as const

const f = (n: number) => +n.toFixed(3)
const [fx0, fy0, fx1, fy1] = fence
// a quarter turn: the master plan's y becomes across the page (its bottom edge on the left), its x down the page,
// so the fence's galley side, with the gate, is at the bottom
const U = (y: number) => fy1 - y
const V = (x: number) => x - fx0
const box = (x0: number, y0: number, x1: number, y1: number) => {
  const [u0, u1] = [U(y1), U(y0)], [v0, v1] = [V(x0), V(x1)]
  return { x: f(u0), y: f(v0), width: f(u1 - u0), height: f(v1 - v0) }
}
const FENCE = 0.35 // the fence drawn as the studio draws a wall

// The chains: every edge of the fence and the blocks, across the page (U) and down it (V), and what lies between two
// neighbouring edges: a block's beds, the main path out of the gate, a path, or the fence's margin
const blocks = plan.blocks
const across = [...new Set([fy0, fy1, ...blocks.flatMap((b) => [b.y, b.y + b.h])])].map(U).sort((a, b) => a - b)
const down = [...new Set([fx0, fx1, ...blocks.flatMap((b) => [b.x, b.x + b.w])])].map(V).sort((a, b) => a - b)
const W0 = fy1 - fy0, H0 = fx1 - fx0
// the drawing (with the fruit row behind the back fence and the walk out of the gate), then its dimensions' reach:
// three tiers under the gate side and down the right, the names beyond the first
const { k, viewBox } = frame({ x0: 0, y0: -6.4, x1: W0, y1: H0 + 2.4 }, { top: 0, right: 21, bottom: 21, left: 3 })

// `title` (the drawing's accessible name) defaults to the page's; the docs pass the guide's own.
export async function FarmingPlan({ title, className }: { title?: string; className?: string }) {
  const w = (await getWords(words)).plan
  title ??= w.title(plan.bedsTotal, plan.bedsNeeded)
  const W = fy1 - fy0, H = fx1 - fx0 // the fenced field, across and down the page
  const gu = U(gate[1]), gw = 1.5 // the gate, its half width
  const pu = U(mainY) // the main path's middle
  const row = -5.0 // the nursery's pointer, above the fruit row
  // a piece between two edges: a block's beds, the main path, a path, or the margin at the fence
  const piece = (a: number, b: number, along: "u" | "v", ends: number[]) => {
    const m = (a + b) / 2
    const inBlock = blocks.some((bl) => along === "u"
      ? m > U(bl.y + bl.h) && m < U(bl.y)
      : m > V(bl.x) && m < V(bl.x + bl.w))
    if (inBlock) return w.labels.beds
    if (a === ends[0] || b === ends[ends.length - 1]) return null
    return along === "u" && pu > a && pu < b ? w.labels.gate : w.labels.path
  }
  return (
    <svg viewBox={viewBox} role="img" aria-label={title} className={className}>
      {/* The fence, drawn solid as the studio's walls, with the gate in the front toward the galley */}
      <rect x={0} y={0} width={f(W)} height={FENCE} {...solid} />
      <rect x={0} y={0} width={FENCE} height={f(H)} {...solid} />
      <rect x={f(W - FENCE)} y={0} width={FENCE} height={f(H)} {...solid} />
      <rect x={0} y={f(H - FENCE)} width={f(gu - gw)} height={FENCE} {...solid} />
      <rect x={f(gu + gw)} y={f(H - FENCE)} width={f(W - gu - gw)} height={FENCE} {...solid} />
      <path d={`M${f(gu - gw)} ${f(H)}A${2 * gw} ${2 * gw} 0 0 0 ${f(gu + gw)} ${f(H - 2 * gw)}`} {...dashed} />
      <line x1={f(gu + gw)} x2={f(gu + gw)} y1={f(H)} y2={f(H - 2 * gw)} {...line} />

      {/* The beds: an outline each, solid where planted this season, dashed where resting or grown for sale */}
      {beds.map((b) => <rect key={b.id} {...box(b.x, b.y, b.x + b.w, b.y + b.h)} {...(b.crop === "rest" ? dashed : line)} />)}

      {/* The fruit row behind the back fence: banana mats (a star of leaves) and fruit trees (a crown with its trunk) */}
      {fruit.map((t, i) => {
        const cx = U(t.y), cy = V(t.x)
        return t.kind === "banana" ? (
          <g key={i}>
            {Array.from({ length: 6 }, (_, k) => {
              const a = (k / 6) * Math.PI * 2 + 0.3
              return <path key={k} d={`M${f(cx)} ${f(cy)}Q${f(cx + Math.cos(a + 0.35) * t.r * 0.6)} ${f(cy + Math.sin(a + 0.35) * t.r * 0.6)} ${f(cx + Math.cos(a) * t.r)} ${f(cy + Math.sin(a) * t.r)}`} {...line} />
            })}
            <circle cx={f(cx)} cy={f(cy)} r={0.18} {...solid} />
          </g>
        ) : (
          <g key={i}>
            <circle cx={f(cx)} cy={f(cy)} r={t.r} {...dashed} />
            <circle cx={f(cx)} cy={f(cy)} r={0.2} {...solid} />
          </g>
        )
      })}

      {/* The garden walk out of the gate to the galley */}
      <line x1={f(pu - main / 2)} x2={f(pu - main / 2)} y1={f(H)} y2={f(H + 2.4)} {...line} />
      <line x1={f(pu + main / 2)} x2={f(pu + main / 2)} y1={f(H)} y2={f(H + 2.4)} {...line} />

      {/* The nursery, up the yard, pointed to above the fruit row */}
      <text x={f(W)} y={f(row)} textAnchor="end" style={small}>{w.labels.nursery}</text>

      {/* Across the gate side: the blocks and the paths, named, then the field's width; down the side: the beds'
          length and the paths between, then the field's depth */}
      <Chain k={k} along="x" at={across} edge={H} side="bottom" overall
        names={across.slice(1).map((b, i) => piece(across[i], b, "u", across))} />
      <Chain k={k} along="y" at={down} edge={W} side="right" overall
        names={down.slice(1).map((b, i) => piece(down[i], b, "v", down))} />
    </svg>
  )
}
