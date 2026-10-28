import plan from "../../../public/designs/farming/data/plan.json"

// The vegetable field drawn in the pattern of the bar and livestock plans: thin lines, no colour, bold capitals
// and dimensions in millimetres. Everything comes from the generated plan (scripts/site/farming.mjs), in the
// master plan's metres: x to the right, y down the page, the galley off to the right along the garden walk.
// Each bed carries the crop it grows this season; dashed beds rest, or grow for sale.

const { beds, blocks, fence, gate, main, mainY, nursery, walk, crops } = plan
const thin = { fill: "none", stroke: "currentColor", strokeWidth: 0.75, vectorEffect: "non-scaling-stroke" } as const
const medium = { ...thin, strokeWidth: 1.6 } as const
const faint = { ...thin, strokeWidth: 0.5, strokeOpacity: 0.45 } as const
const dashed = { ...thin, strokeDasharray: "4 3" } as const
const label = {
  fontFamily: "var(--font-sans), ui-sans-serif, system-ui, sans-serif",
  fontSize: 1.1,
  fontWeight: 700,
  letterSpacing: "0.04em",
  fill: "currentColor",
} as const
const small = { ...label, fontSize: 0.62, fontWeight: 600 } as const

const f = (n: number) => +n.toFixed(3)
const mm = (m: number) => Math.round(m * 1000).toLocaleString("en-US")
const rect = (x0: number, y0: number, x1: number, y1: number) => ({ x: f(x0), y: f(y0), width: f(x1 - x0), height: f(y1 - y0) })
const NAME: Record<string, string> = Object.fromEntries(crops.map((c) => [c.id, c.name.replace(/ \(.*\)/, "").toUpperCase()]))

function Dimension({ x0, x1, y }: { x0: number; x1: number; y: number }) {
  const tick = 0.4
  return (
    <g>
      <line x1={x0} x2={x1} y1={y} y2={y} {...thin} />
      {[x0, x1].map((x) => <line key={x} x1={f(x - tick)} x2={f(x + tick)} y1={f(y + tick)} y2={f(y - tick)} {...thin} />)}
      <text x={f((x0 + x1) / 2)} y={f(y - 0.45)} textAnchor="middle" style={small}>{mm(x1 - x0)}</text>
    </g>
  )
}
function DimensionUp({ y0, y1, x }: { y0: number; y1: number; x: number }) {
  const tick = 0.4
  const cy = f((y0 + y1) / 2)
  return (
    <g>
      <line x1={x} x2={x} y1={y0} y2={y1} {...thin} />
      {[y0, y1].map((y) => <line key={y} x1={f(x - tick)} x2={f(x + tick)} y1={f(y + tick)} y2={f(y - tick)} {...thin} />)}
      <text x={f(x - 0.45)} y={cy} textAnchor="middle" transform={`rotate(-90 ${f(x - 0.45)} ${cy})`} style={small}>{mm(y1 - y0)}</text>
    </g>
  )
}

export function FarmingPlan({ title, className }: { title: string; className?: string }) {
  const [fx0, fy0, fx1, fy1] = fence
  const gw = 1.5 // half the gate
  const end = walk[1][0]
  const first = blocks[0]
  const b0 = beds.find((b) => b.block === first.id)!
  return (
    <svg viewBox={`${nursery.x - 3} ${fy0 - 5} ${end - nursery.x + 6} ${fy1 - fy0 + 10}`} role="img" aria-label={title} className={className}>
      {/* The fence round the beds, its gate on the garden walk (the swing dashed) */}
      <path d={`M${fx1} ${f(gate[1] - gw)}L${fx1} ${fy0}L${fx0} ${fy0}L${fx0} ${fy1}L${fx1} ${fy1}L${fx1} ${f(gate[1] + gw)}`} {...medium} />
      <line x1={fx1} x2={f(fx1 - 2 * gw)} y1={f(gate[1] - gw)} y2={f(gate[1] - gw)} {...thin} />
      <path d={`M${fx1} ${f(gate[1] + gw)}A${2 * gw} ${2 * gw} 0 0 1 ${f(fx1 - 2 * gw)} ${f(gate[1] - gw)}`} {...faint} />

      {/* The garden walk to the galley, and the main path across the field */}
      <line x1={fx1} x2={end} y1={f(mainY - main / 2)} y2={f(mainY - main / 2)} {...thin} />
      <line x1={fx1} x2={end} y1={f(mainY + main / 2)} y2={f(mainY + main / 2)} {...thin} />
      <text x={f((fx1 + end) / 2)} y={f(mainY + 0.22)} textAnchor="middle" style={small}>TO THE GALLEY →</text>
      <text x={f(fx0 + 6)} y={f(mainY + 0.22)} textAnchor="middle" style={small}>MAIN PATH</text>

      {/* The beds, each with this season's crop; two drip lines along each planted bed */}
      {beds.map((b) => (
        <g key={b.id}>
          <rect {...rect(b.x, b.y, b.x + b.w, b.y + b.h)} {...(b.crop === "rest" ? dashed : thin)} />
          {b.crop === "rest" ? null : [1 / 3, 2 / 3].map((k) => (
            <line key={k} x1={f(b.x + 0.3)} x2={f(b.x + b.w - 0.3)} y1={f(b.y + b.h * k)} y2={f(b.y + b.h * k)} {...faint} />
          ))}
          <text x={f(b.x + b.w / 2)} y={f(b.y + b.h / 2 + 0.22)} textAnchor="middle" style={small}>
            {b.crop === "rest" ? "REST · SALE" : NAME[b.crop]}
          </text>
        </g>
      ))}

      {/* The nursery's shade house in the yard strip, trays on four benches */}
      <rect {...rect(nursery.x, nursery.y, nursery.x + nursery.w, nursery.y + nursery.h)} {...medium} />
      {[0.25, 0.75].map((k) => (
        <rect key={k} {...rect(nursery.x + nursery.w * k - 0.45, nursery.y + 0.6, nursery.x + nursery.w * k + 0.45, nursery.y + nursery.h - 0.6)} {...faint} />
      ))}
      <text x={f(nursery.x + nursery.w / 2)} y={f(nursery.y + nursery.h + 1.3)} textAnchor="middle" style={label}>NURSERY</text>

      <Dimension x0={first.x} x1={f(first.x + first.w)} y={f(fy0 - 1.8)} />
      <Dimension x0={fx0} x1={fx1} y={f(fy1 + 2.6)} />
      <DimensionUp y0={b0.y} y1={f(b0.y + b0.h)} x={f(fx1 + 1.2)} />
      <DimensionUp y0={fy0} y1={fy1} x={f(fx1 + 3.2)} />
    </svg>
  )
}
