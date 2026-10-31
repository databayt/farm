import { getWords } from "@/components/internationalization/words"
import { Chain, Dim, HDim, Note } from "@/components/drawing/dims"
import { frame } from "@/components/drawing/geometry"

import farming from "./farming.json"
import { words } from "./words"

// The seedling nursery drawn in the pattern of the studio's plan (public/designs/studio/render/plan.svg): its shade-
// net walls in a line with the poles solid, the two benches of trays and the path between them, the door at the end
// toward the field; dimensioned as the studio's (src/components/drawing): the benches' length named above, the
// benches and the path between them down the side, then the width, the overall length below, a tray and the door inside. Metres, the house's long
// side across the page. Sizes from src/components/farming/farming.json, all [A]. In currentColor.

const { nursery: N } = farming
const line = { fill: "none", stroke: "currentColor", strokeWidth: 0.9, vectorEffect: "non-scaling-stroke" } as const
const fine = { ...line, strokeWidth: 0.5 } as const
const dashed = { ...line, strokeDasharray: "4 3" } as const
const solid = { fill: "currentColor" } as const

const f = (n: number) => +n.toFixed(3)
// the drawing with the door swung open, then its dimensions' reach (studio mm): the names over the top chain, two
// tiers down the side, one below
const { k, viewBox } = frame({ x0: 0, y0: 0, x1: N.l + N.door * 0.7, y1: N.w }, { top: 14, right: 2, bottom: 8, left: 14 })

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
    <svg viewBox={viewBox} role="img" aria-label={title} className={className}>
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

      <Note k={k} x={b.inset + b.l / 2} y={W / 2}>{w.labels.path}</Note>
      <Note k={k} x={N.tap.x} y={N.tap.y + 0.2}>{w.labels.tap}</Note>

      {/* Along the top: the benches' length, named; down the side: each bench, the path between them, then the
          width; the overall length below; inside, a tray and the door */}
      <Chain k={k} along="x" at={[0, b.inset, b.inset + b.l, L]} edge={0} side="top" names={[null, w.labels.trays, w.labels.door]} />
      <Chain k={k} along="y" at={[0, benches[0], benches[0] + b.d, benches[1], benches[1] + b.d, W]} edge={0} side="left" overall />
      <HDim k={k} x0={0} x1={L} y={W} side="bottom" />
      <Dim k={k} a={[b.inset + 0.04, benches[1] - 0.12]} b={[b.inset + 0.04 + t.l, benches[1] - 0.12]} off={0} size={2.2} />
      <Dim k={k} a={[L - 0.2, d0]} b={[L - 0.2, d1]} off={0} size={2.2} />
    </svg>
  )
}
