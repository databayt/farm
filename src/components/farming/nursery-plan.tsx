import farming from "./farming.json"

// The seedling nursery drawn in the pattern of the studio's plan (public/designs/studio/render/plan.svg): its shade-
// net walls in a line with the poles solid, the two benches of trays and the path between them, the door at the end
// toward the field; the zones named in one row above and only the two overall dimensions. Metres, the house's long
// side across the page. Sizes from src/components/farming/farming.json, all [A]. In currentColor.

const { nursery: N } = farming
const line = { fill: "none", stroke: "currentColor", strokeWidth: 0.9, vectorEffect: "non-scaling-stroke" } as const
const fine = { ...line, strokeWidth: 0.5 } as const
const dashed = { ...line, strokeDasharray: "4 3" } as const
const solid = { fill: "currentColor" } as const
const font = { fontFamily: "Helvetica, Arial, sans-serif", fill: "currentColor" } as const
const label = { ...font, fontSize: 0.2, fontWeight: 700, letterSpacing: "0.03em" } as const
const small = { ...font, fontSize: 0.15 } as const

const f = (n: number) => +n.toFixed(3)
const mm = (m: number) => Math.round(m * 1000).toLocaleString("en-US")

function Dimension({ x0, x1, y }: { x0: number; x1: number; y: number }) {
  const tick = 0.08, cx = f((x0 + x1) / 2)
  return (
    <g>
      <line x1={x0} x2={x1} y1={y} y2={y} {...line} />
      {[x0, x1].map((x) => <line key={x} x1={f(x - tick)} x2={f(x + tick)} y1={f(y + tick)} y2={f(y - tick)} {...line} />)}
      <rect x={f(cx - 0.4)} y={f(y - 0.12)} width={0.8} height={0.24} className="fill-background" />
      <text x={cx} y={f(y + 0.05)} textAnchor="middle" style={small}>{mm(x1 - x0)}</text>
    </g>
  )
}
// the same, standing: the text turned to read down the page, as the studio's
function DimensionUp({ y0, y1, x }: { y0: number; y1: number; x: number }) {
  const tick = 0.08, cy = f((y0 + y1) / 2)
  return (
    <g>
      <line x1={x} x2={x} y1={y0} y2={y1} {...line} />
      {[y0, y1].map((y) => <line key={y} x1={f(x - tick)} x2={f(x + tick)} y1={f(y + tick)} y2={f(y - tick)} {...line} />)}
      <rect x={f(x - 0.12)} y={f(cy - 0.4)} width={0.24} height={0.8} className="fill-background" />
      <text x={f(x + 0.05)} y={cy} textAnchor="middle" transform={`rotate(90 ${f(x + 0.05)} ${cy})`} style={small}>{mm(y1 - y0)}</text>
    </g>
  )
}

export function NurseryPlan({ title, className }: { title: string; className?: string }) {
  const L = N.l, W = N.w, b = N.bench, t = N.tray
  const d0 = W / 2 - N.door / 2, d1 = W / 2 + N.door / 2 // the door, in the end toward the field
  const benches = [b.inset, W - b.inset - b.d] // their back edges, along the two long sides
  const across = Math.floor(b.d / t.w), along = Math.floor(b.l / t.l)
  const posts = Array.from({ length: Math.round(L / N.post) + 1 }, (_, k) => k * N.post)
  return (
    <svg viewBox={`-0.85 -0.75 ${f(L + 1.95)} ${f(W + 1.45)}`} role="img" aria-label={title} className={className}>
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

      {/* What is where, in one row above, as the studio's BED, SEATING, GALLEY, BATH */}
      <text x={f(b.inset + b.l / 2)} y={-0.3} textAnchor="middle" style={label}>SEEDLING TRAYS</text>
      <text x={f(b.inset + b.l / 2)} y={f(W / 2 + 0.07)} textAnchor="middle" style={small}>PATH</text>
      <text x={N.tap.x} y={f(N.tap.y + 0.3)} textAnchor="middle" style={small}>TAP</text>
      <text x={L} y={-0.3} textAnchor="end" style={label}>DOOR · TO THE FIELD →</text>

      <Dimension x0={0} x1={L} y={f(W + 0.45)} />
      <DimensionUp y0={0} y1={W} x={-0.5} />
    </svg>
  )
}
