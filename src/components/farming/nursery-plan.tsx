import { getWords } from "@/components/internationalization/words"

import farming from "./farming.json"
import { words } from "./words"

// The seedling nursery drawn in the pattern of the studio's plan (public/designs/studio/render/plan.svg): its shade-
// net walls in a line with the poles solid, the two benches of trays and the path between them, the door at the end
// toward the field; dimensioned as the studio's: the zones named small in one row above, each thing measured on
// its own with a light broken line and slash ticks, the overall length below and the width on the far side. Metres, the house's long
// side across the page. Sizes from src/components/farming/farming.json, all [A]. In currentColor.

const { nursery: N } = farming
const line = { fill: "none", stroke: "currentColor", strokeWidth: 0.9, vectorEffect: "non-scaling-stroke" } as const
const fine = { ...line, strokeWidth: 0.5 } as const
const dashed = { ...line, strokeDasharray: "4 3" } as const
const solid = { fill: "currentColor" } as const
const font = { fontFamily: "Helvetica, Arial, sans-serif", fill: "currentColor" } as const
const label = { ...font, fontSize: 0.115, fontWeight: 700, letterSpacing: "0.03em" } as const
const small = { ...font, fontSize: 0.095 } as const

const f = (n: number) => +n.toFixed(3)
const mm = (m: number) => Math.round(m * 1000).toLocaleString("en-US")

// Dimensions as the studio's plan draws them: a thin line broken round its number, a slash tick at each end with
// the line running on a little past it; each measures one thing
const TICK = 0.05, OVER = 0.05, GAP = 0.045
const textW = (n: string) => n.length * 0.058 + 2 * GAP
function Dimension({ x0, x1, y, text }: { x0: number; x1: number; y: number; text?: string }) {
  const t = text ?? mm(x1 - x0), cx = (x0 + x1) / 2, h = textW(t) / 2
  return (
    <g>
      <line x1={f(x0 - OVER)} x2={f(cx - h)} y1={y} y2={y} {...fine} />
      <line x1={f(cx + h)} x2={f(x1 + OVER)} y1={y} y2={y} {...fine} />
      {[x0, x1].map((x) => <line key={x} x1={f(x - TICK)} x2={f(x + TICK)} y1={f(y + TICK)} y2={f(y - TICK)} {...line} />)}
      <text x={f(cx)} y={f(y + 0.033)} textAnchor="middle" style={small}>{t}</text>
    </g>
  )
}
// the same, standing: the text turned to read down the page
function DimensionUp({ y0, y1, x }: { y0: number; y1: number; x: number }) {
  const t = mm(y1 - y0), cy = (y0 + y1) / 2, h = textW(t) / 2
  return (
    <g>
      <line y1={f(y0 - OVER)} y2={f(cy - h)} x1={x} x2={x} {...fine} />
      <line y1={f(cy + h)} y2={f(y1 + OVER)} x1={x} x2={x} {...fine} />
      {[y0, y1].map((y) => <line key={y} x1={f(x - TICK)} x2={f(x + TICK)} y1={f(y + TICK)} y2={f(y - TICK)} {...line} />)}
      <text x={f(x + 0.033)} y={f(cy)} textAnchor="middle" transform={`rotate(90 ${f(x + 0.033)} ${f(cy)})`} style={small}>{t}</text>
    </g>
  )
}

// `title` (the drawing's accessible name) defaults to the page's; the docs pass the guide's own.
export async function NurseryPlan({ title, className }: { title?: string; className?: string }) {
  const w = (await getWords(words)).nursery
  title ??= w.title
  const L = N.l, W = N.w, b = N.bench, t = N.tray
  const d0 = W / 2 - N.door / 2, d1 = W / 2 + N.door / 2 // the door, in the end toward the field
  const benches = [b.inset, W - b.inset - b.d] // their back edges, along the two long sides
  const across = Math.floor(b.d / t.w), along = Math.floor(b.l / t.l)
  const posts = Array.from({ length: Math.round(L / N.post) + 1 }, (_, k) => k * N.post)
  return (
    <svg viewBox={`-0.4 -0.6 ${f(L + 1.6)} ${f(W + 1.0)}`} role="img" aria-label={title} className={className}>
      {/* The shade-net walls, the poles every 2 m solid, the door in the end toward the field, its swing dashed */}
      <path d={`M${L} ${f(d0)}L${L} 0L0 0L0 ${W}L${L} ${W}L${L} ${f(d1)}`} {...line} />
      {posts.flatMap((x) => [0, W].map((y) => <rect key={`${x}-${y}`} x={f(x - 0.06)} y={f(y - 0.06)} width={0.12} height={0.12} {...solid} />))}
      <line x1={L} x2={f(L + N.door * 0.7)} y1={f(d1)} y2={f(d1 - N.door * 0.7)} {...line} />
      <path d={`M${L} ${f(d0)}A${N.door} ${N.door} 0 0 1 ${f(L + N.door * 0.7)} ${f(d1 - N.door * 0.7)}`} {...dashed} />

      {/* The two benches along the long sides, each a grid of seedling trays */}
      {benches.map((y0) => (
        <g key={y0}>
          <rect x={b.inset} y={f(y0)} width={b.l} height={b.d} {...line} />
          {Array.from({ length: along }, (_, i) => Array.from({ length: across }, (_, j) => (
            <rect key={`${i}-${j}`} x={f(b.inset + 0.04 + i * t.l)} y={f(y0 + 0.04 + j * t.w)} width={f(t.l - 0.03)} height={f(t.w - 0.03)} {...fine} />
          )))}
        </g>
      ))}
      {/* The tap by the door */}
      <circle cx={N.tap.x} cy={N.tap.y} r={0.09} {...line} />

      {/* What is where, in one row above, each with its size under it, as the studio's BED 1,640 · SEATING 1,300 */}
      <text x={f(b.inset + b.l / 2)} y={-0.42} textAnchor="middle" style={label}>{w.labels.trays}</text>
      <text x={f(L - 0.4)} y={-0.42} textAnchor="middle" style={label}>{w.labels.door}</text>
      <Dimension x0={b.inset} x1={f(b.inset + b.l)} y={-0.2} />
      <text x={f(b.inset + b.l / 2)} y={f(W / 2 + 0.035)} textAnchor="middle" style={small}>{w.labels.path}</text>
      <text x={N.tap.x} y={f(N.tap.y + 0.22)} textAnchor="middle" style={small}>{w.labels.tap}</text>

      {/* One thing each: a bench's depth, the path between the benches, a tray, the door, the overall sizes */}
      <DimensionUp y0={benches[0]} y1={f(benches[0] + b.d)} x={-0.2} />
      <DimensionUp y0={benches[1]} y1={f(benches[1] + b.d)} x={-0.2} />
      <DimensionUp y0={f(benches[0] + b.d)} y1={benches[1]} x={f(b.inset + b.l * 0.75)} />
      <Dimension x0={f(b.inset + 0.04)} x1={f(b.inset + 0.04 + t.l)} y={f(benches[1] - 0.15)} />
      <DimensionUp y0={f(d0)} y1={f(d1)} x={f(L - 0.2)} />
      <Dimension x0={0} x1={L} y={f(W + 0.25)} />
      <DimensionUp y0={0} y1={W} x={f(L + 1.05)} />
    </svg>
  )
}
