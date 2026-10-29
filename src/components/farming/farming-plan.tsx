import plan from "../../../public/designs/farming/data/plan.json"

// The vegetable field drawn in the pattern of the studio's plan (public/designs/studio/render/plan.svg) and seen from
// the front: the gate and the garden walk to the galley at the bottom, toward the viewer, as the studio's and the
// livestock yard's. Abstract: the fence a solid band, each bed only its outline, solid where it is planted this season
// and dashed where it rests or grows for sale (the crops are in the Crops section); the zones named in one row above
// and only the two overall dimensions. Everything comes from the generated plan (scripts/site/farming.mjs), whose
// metres run x to the galley and y down the master plan; here they are turned a quarter so the gate faces the viewer.

const { beds, blocks, fence, gate, main, mainY } = plan
const line = { fill: "none", stroke: "currentColor", strokeWidth: 0.9, vectorEffect: "non-scaling-stroke" } as const
const dashed = { ...line, strokeDasharray: "4 3" } as const
const solid = { fill: "currentColor" } as const
const font = { fontFamily: "Helvetica, Arial, sans-serif", fill: "currentColor" } as const
const label = { ...font, fontSize: 1.25, fontWeight: 700, letterSpacing: "0.03em" } as const
const small = { ...font, fontSize: 0.95 } as const

const f = (n: number) => +n.toFixed(3)
const mm = (m: number) => Math.round(m * 1000).toLocaleString("en-US")
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

function Dimension({ x0, x1, y }: { x0: number; x1: number; y: number }) {
  const tick = 0.45, cx = f((x0 + x1) / 2)
  return (
    <g>
      <line x1={x0} x2={x1} y1={y} y2={y} {...line} />
      {[x0, x1].map((x) => <line key={x} x1={f(x - tick)} x2={f(x + tick)} y1={f(y + tick)} y2={f(y - tick)} {...line} />)}
      <rect x={f(cx - 2.6)} y={f(y - 0.75)} width={5.2} height={1.5} className="fill-background" />
      <text x={cx} y={f(y + 0.33)} textAnchor="middle" style={small}>{mm(x1 - x0)}</text>
    </g>
  )
}
// the same, standing: the text turned to read down the page, as the studio's
function DimensionUp({ y0, y1, x }: { y0: number; y1: number; x: number }) {
  const tick = 0.45, cy = f((y0 + y1) / 2)
  return (
    <g>
      <line x1={x} x2={x} y1={y0} y2={y1} {...line} />
      {[y0, y1].map((y) => <line key={y} x1={f(x - tick)} x2={f(x + tick)} y1={f(y + tick)} y2={f(y - tick)} {...line} />)}
      <rect x={f(x - 0.75)} y={f(cy - 2.6)} width={1.5} height={5.2} className="fill-background" />
      <text x={f(x + 0.33)} y={cy} textAnchor="middle" transform={`rotate(90 ${f(x + 0.33)} ${cy})`} style={small}>{mm(y1 - y0)}</text>
    </g>
  )
}

export function FarmingPlan({ title, className }: { title: string; className?: string }) {
  const W = fy1 - fy0, H = fx1 - fx0 // the fenced field, across and down the page
  const gu = U(gate[1]), gw = 1.5 // the gate, its half width
  const pu = U(mainY) // the main path's middle
  // the two rows of blocks nearest the gate; the cut runs just beyond them
  const rows = [...new Set(blocks.map((b) => b.x))].sort((a, b) => a - b)
  const shown = rows.slice(-2), hidden = rows.length - shown.length
  const cut = V(shown[0]) - 0.6
  const bedLen = blocks[0].w
  const top = cut - 2.6, bottom = H + 6.1
  const left = -0.6, right = W + 2.6 // tight round the drawing, so it fills the width
  const row = cut - 1.6 // the names, in one row above the cut
  // the break line across the field where it goes on: straight, with a zigzag at its middle
  const zx = W - 5
  const brk = `M${-0.6} ${f(cut)}L${f(zx - 0.8)} ${f(cut)}L${f(zx - 0.3)} ${f(cut - 0.7)}L${f(zx + 0.3)} ${f(cut + 0.7)}L${f(zx + 0.8)} ${f(cut)}L${f(W + 0.6)} ${f(cut)}`
  return (
    <svg viewBox={`${f(left)} ${f(top)} ${f(right - left)} ${f(bottom - top)}`} role="img" aria-label={title} className={className}>
      {/* The fence, drawn solid as the studio's walls, its sides running on past the break, the gate in the front */}
      <rect x={0} y={f(cut)} width={FENCE} height={f(H - cut)} {...solid} />
      <rect x={f(W - FENCE)} y={f(cut)} width={FENCE} height={f(H - cut)} {...solid} />
      <rect x={0} y={f(H - FENCE)} width={f(gu - gw)} height={FENCE} {...solid} />
      <rect x={f(gu + gw)} y={f(H - FENCE)} width={f(W - gu - gw)} height={FENCE} {...solid} />
      <path d={`M${f(gu - gw)} ${f(H)}A${2 * gw} ${2 * gw} 0 0 0 ${f(gu + gw)} ${f(H - 2 * gw)}`} {...dashed} />
      <line x1={f(gu + gw)} x2={f(gu + gw)} y1={f(H)} y2={f(H - 2 * gw)} {...line} />
      <path d={brk} {...line} />

      {/* The beds of the two rows: an outline each, solid where planted this season, dashed where resting or grown for sale */}
      {beds.filter((b) => b.x >= shown[0]).map((b) => <rect key={b.id} {...box(b.x, b.y, b.x + b.w, b.y + b.h)} {...(b.crop === "rest" ? dashed : line)} />)}

      {/* The garden walk out of the gate to the galley */}
      <line x1={f(pu - main / 2)} x2={f(pu - main / 2)} y1={f(H)} y2={f(H + 2.4)} {...line} />
      <line x1={f(pu + main / 2)} x2={f(pu + main / 2)} y1={f(H)} y2={f(H + 2.4)} {...line} />

      {/* What is where, in one row above, as the studio's BED, SEATING, GALLEY, BATH; what lies past the break */}
      {([[f(pu / 2), "BEDS"], [f(pu), "MAIN PATH"], [f((pu + W) / 2), "BEDS"]] as const).map(([x, t], i) => (
        <text key={i} x={x} y={f(row)} textAnchor="middle" style={label}>{t}</text>
      ))}
      <text x={f(W)} y={f(row)} textAnchor="end" style={small} aria-label={`The field goes on: ${hidden} more rows of blocks, then the nursery`}>THE FIELD GOES ON ↑</text>
      <text x={f(pu)} y={f(H + 3.6)} textAnchor="middle" style={small}>GATE · TO THE GALLEY</text>

      <Dimension x0={0} x1={f(W)} y={f(H + 5.1)} />
      <DimensionUp y0={f(V(shown[1]))} y1={f(V(shown[1]) + bedLen)} x={f(W + 1.5)} />
    </svg>
  )
}
