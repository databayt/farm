import livestock from "./livestock.json"

// The livestock house drawn in the pattern of the bar plan (src/components/bar/bar-plan.tsx): thin lines, no colour,
// bold capitals and dimensions in millimetres. The open side and the feed passage face down the page, toward the
// paddock and the viewer of the 3D. Units are metres, the house's centre at 0,0, y toward the passage.

const { house, pens, fittings, ramp, tank } = livestock
const thin = { fill: "none", stroke: "currentColor", strokeWidth: 0.75, vectorEffect: "non-scaling-stroke" } as const
const medium = { ...thin, strokeWidth: 1.6 } as const
const faint = { ...thin, strokeWidth: 0.5, strokeOpacity: 0.45 } as const
const dashed = { ...thin, strokeDasharray: "4 3" } as const
const label = {
  fontFamily: "var(--font-sans), ui-sans-serif, system-ui, sans-serif",
  fontSize: 0.17,
  fontWeight: 700,
  letterSpacing: "0.04em",
  fill: "currentColor",
} as const
const small = { ...label, fontSize: 0.12, fontWeight: 600 } as const

const f = (n: number) => +n.toFixed(3)
const mm = (m: number) => Math.round(m * 1000).toLocaleString("en-US")
const rect = (x0: number, y0: number, x1: number, y1: number) => ({ x: f(x0), y: f(y0), width: f(x1 - x0), height: f(y1 - y0) })

function Dimension({ x0, x1, y }: { x0: number; x1: number; y: number }) {
  const tick = 0.07
  return (
    <g>
      <line x1={x0} x2={x1} y1={y} y2={y} {...thin} />
      {[x0, x1].map((x) => <line key={x} x1={f(x - tick)} x2={f(x + tick)} y1={f(y + tick)} y2={f(y - tick)} {...thin} />)}
      <text x={f((x0 + x1) / 2)} y={f(y - 0.08)} textAnchor="middle" style={small}>{mm(x1 - x0)}</text>
    </g>
  )
}
// the same, standing: the text turned to read up the page
function DimensionUp({ y0, y1, x }: { y0: number; y1: number; x: number }) {
  const tick = 0.07
  const cy = f((y0 + y1) / 2)
  return (
    <g>
      <line x1={x} x2={x} y1={y0} y2={y1} {...thin} />
      {[y0, y1].map((y) => <line key={y} x1={f(x - tick)} x2={f(x + tick)} y1={f(y + tick)} y2={f(y - tick)} {...thin} />)}
      <text x={f(x - 0.08)} y={cy} textAnchor="middle" transform={`rotate(-90 ${f(x - 0.08)} ${cy})`} style={small}>{mm(y1 - y0)}</text>
    </g>
  )
}

export function LivestockPlan({ title, className }: { title: string; className?: string }) {
  const L = house.l / 2, W = house.w / 2, t = house.wall
  const fy = W - house.passage.d // the pens' front fence on the passage
  const { rack, trough, mineral } = fittings
  const store = pens.list.find((p) => p.id === "store")!
  const animals = pens.list.filter((p) => p.id !== "store")
  // slats drawn at 0.25 m so they read as a slatted floor, not a grey fill
  const slats = Array.from({ length: Math.floor((store.x0 + L) / 0.25) }, (_, k) => f(-L + (k + 1) * 0.25)).filter((x) => x < store.x0 - 0.05)
  return (
    <svg viewBox="-6.45 -2.95 11.4 5.75" role="img" aria-label={title} className={className}>
      {/* The roof overhead (dashed), 0.6 m past the walls all round */}
      <rect {...rect(-L - house.roof.over, -W - house.roof.over, L + house.roof.over, W + house.roof.over)} {...dashed} />

      {/* The solid back wall and the two ends, the pens' slatted floor, the passage's boards */}
      <path d={`M${-L} ${W}L${-L} ${-W}L${L} ${-W}L${L} ${W}`} {...medium} />
      <path d={`M${f(-L + t)} ${W}L${f(-L + t)} ${f(-W + t)}L${f(L - t)} ${f(-W + t)}L${f(L - t)} ${W}`} {...thin} />
      <line x1={-L} x2={L} y1={W} y2={W} {...thin} />
      {slats.map((x) => <line key={x} x1={x} x2={x} y1={f(-W + t)} y2={f(fy)} {...faint} />)}

      {/* Partitions between the pens, solid to 1.2 m; the feed store walled to the roof */}
      {pens.list.slice(1).map((p) => <line key={p.id} x1={p.x0} x2={p.x0} y1={f(-W + t)} y2={f(fy)} {...(p.id === "store" ? medium : thin)} />)}
      <line x1={store.x0} x2={store.x0} y1={f(fy)} y2={W} {...medium} />

      {/* The front fence on the passage with a gate into each pen (its swing dashed), the store's lockable door */}
      {animals.map((p) => {
        const g1 = f(p.x1 - 0.12), w = Math.min(pens.gate, p.x1 - p.x0 - 0.24), a = f(g1 - w)
        return (
          <g key={p.id}>
            <line x1={p.x0} x2={a} y1={f(fy)} y2={f(fy)} {...medium} />
            <line x1={g1} x2={p.x1} y1={f(fy)} y2={f(fy)} {...medium} />
            <line x1={g1} x2={g1} y1={f(fy)} y2={f(fy + w)} {...thin} />
            <path d={`M${a} ${f(fy)}A${f(w)} ${f(w)} 0 0 0 ${g1} ${f(fy + w)}`} {...faint} />
          </g>
        )
      })}
      <line x1={store.x0} x2={f(store.x1 - 0.85)} y1={f(fy)} y2={f(fy)} {...medium} />
      <line x1={f(store.x1 - 0.15)} x2={L} y1={f(fy)} y2={f(fy)} {...medium} />
      <line x1={f(store.x1 - 0.85)} x2={f(store.x1 - 0.85)} y1={f(fy)} y2={f(fy + 0.7)} {...thin} />
      <path d={`M${f(store.x1 - 0.15)} ${f(fy)}A0.7 0.7 0 0 1 ${f(store.x1 - 0.85)} ${f(fy + 0.7)}`} {...faint} />

      {/* On each pen's front fence, filled from the passage: the hay rack, the trough, the mineral box */}
      {animals.map((p) => {
        const r0 = p.x0 + 0.15, r1 = r0 + p.rack
        const t0 = r1 + 0.1, t1 = t0 + p.trough
        return (
          <g key={p.id}>
            <rect {...rect(r0, fy - rack.d, r1, fy - 0.02)} {...thin} />
            {Array.from({ length: Math.round(p.rack / 0.1) - 1 }, (_, k) => f(r0 + (k + 1) * 0.1)).map((x) => (
              <line key={x} x1={x} x2={x} y1={f(fy - rack.d)} y2={f(fy - 0.02)} {...faint} />
            ))}
            {p.trough ? <rect {...rect(t0, fy - trough.d, t1, fy - 0.02)} rx={0.05} {...thin} /> : null}
            {p.trough ? <rect {...rect(t1 + 0.08, fy - mineral.d, t1 + 0.08 + mineral.w, fy - 0.02)} {...thin} /> : null}
          </g>
        )
      })}

      {/* The feed store: sacks on a pallet, shelves on the back wall */}
      <rect {...rect(store.x0 + 0.1, -W + t + 0.05, store.x1 - 0.1, -W + t + 0.4)} {...dashed} />
      <rect {...rect(store.x0 + 0.12, -0.6, store.x1 - 0.12, 0.6)} {...faint} />
      {[-0.42, 0, 0.42].map((y) => <rect key={y} {...rect(store.x0 + 0.18, y - 0.18, store.x1 - 0.18, y + 0.18)} rx={0.06} {...thin} />)}

      {/* The ramp down to the paddock from the passage's west end, its cleats; the tank at the back east corner */}
      <rect {...rect(-L - ramp.l, fy, -L, W)} {...thin} />
      {Array.from({ length: Math.floor(ramp.l / ramp.cleat) - 1 }, (_, k) => f(-L - (k + 1) * ramp.cleat)).map((x) => (
        <line key={x} x1={x} x2={x} y1={f(fy)} y2={W} {...faint} />
      ))}
      <circle cx={tank.x} cy={tank.y} r={tank.r} {...thin} />
      <circle cx={tank.x} cy={tank.y} r={f(tank.r * 0.3)} {...faint} />

      {animals.map((p) => (
        <g key={p.id}>
          <text x={f((p.x0 + p.x1) / 2)} y={p.id === "kidding" ? -0.75 : -0.6} textAnchor="middle" style={p.id === "kidding" ? small : label}>{p.label}</text>
          <text x={f((p.x0 + p.x1) / 2)} y={p.id === "kidding" ? -0.55 : -0.36} textAnchor="middle" style={small}>
            {p.head ? `${p.head} HEAD · ${f((p.x1 - p.x0) * (fy + W))} m²` : `${f((p.x1 - p.x0) * (fy + W))} m²`}
          </text>
        </g>
      ))}
      <text x={f(-L + 0.9)} y={f(fy - rack.d - 0.12)} textAnchor="middle" style={small}>HAY RACK</text>
      <text x={f(-L + 2.05)} y={f(fy - trough.d - 0.12)} textAnchor="middle" style={small}>TROUGH</text>
      <text x={f((store.x0 + store.x1) / 2)} y={-0.85} textAnchor="middle" style={label}>FEED</text>
      <text x={-2.4} y={f(W - 0.38)} textAnchor="middle" style={small}>FEED PASSAGE</text>
      <text x={f(-L - ramp.l / 2)} y={f(fy - 0.15)} textAnchor="middle" style={small}>RAMP</text>
      <text x={tank.x} y={f(tank.y + tank.r + 0.22)} textAnchor="middle" style={small}>TANK</text>
      <text x={0} y={f(W + house.roof.over + 0.32)} textAnchor="middle" style={small}>OPEN ABOVE 1,200 · TOWARD THE PADDOCK</text>
      <Dimension x0={-L} x1={L} y={-2.75} />
      {pens.list.map((p) => <Dimension key={p.id} x0={p.x0} x1={p.x1} y={f(-W - 0.25)} />)}
      <DimensionUp y0={-W} y1={f(fy)} x={-4.4} />
      <DimensionUp y0={f(fy)} y1={W} x={L + 0.9} />
    </svg>
  )
}
