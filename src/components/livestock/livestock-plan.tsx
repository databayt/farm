import livestock from "./livestock.json"

// The livestock house drawn in the pattern of the studio's plan (public/designs/studio/render/plan.svg): solid walls
// in black, fittings in thin outline, the rooms named in one row above and only the two overall dimensions. The
// open side and the feed passage face down the page, toward the paddock and the viewer of the 3D. Units are metres,
// the house's centre at 0,0, y toward the passage. All in currentColor, so the page sets its colour.

const { house, pens, fittings, ramp, tank } = livestock
const WALL = 0.08 // the solid back wall, the ends and the feed store, drawn as in the studio's plan
const FENCE = 0.04 // the partitions and the pens' front fence, 1.2 m high
const line = { fill: "none", stroke: "currentColor", strokeWidth: 0.9, vectorEffect: "non-scaling-stroke" } as const
const dashed = { ...line, strokeDasharray: "4 3" } as const
const solid = { fill: "currentColor" } as const
const font = { fontFamily: "Helvetica, Arial, sans-serif", fill: "currentColor" } as const
const label = { ...font, fontSize: 0.15, fontWeight: 700, letterSpacing: "0.03em" } as const
const small = { ...font, fontSize: 0.11 } as const

const f = (n: number) => +n.toFixed(3)
const mm = (m: number) => Math.round(m * 1000).toLocaleString("en-US")
const rect = (x0: number, y0: number, x1: number, y1: number) => ({ x: f(x0), y: f(y0), width: f(x1 - x0), height: f(y1 - y0) })

function Dimension({ x0, x1, y }: { x0: number; x1: number; y: number }) {
  const tick = 0.06
  return (
    <g>
      <line x1={x0} x2={x1} y1={y} y2={y} {...line} />
      {[x0, x1].map((x) => <line key={x} x1={f(x - tick)} x2={f(x + tick)} y1={f(y + tick)} y2={f(y - tick)} {...line} />)}
      <rect {...rect((x0 + x1) / 2 - 0.22, y - 0.08, (x0 + x1) / 2 + 0.22, y + 0.08)} className="fill-background" />
      <text x={f((x0 + x1) / 2)} y={f(y + 0.04)} textAnchor="middle" style={small}>{mm(x1 - x0)}</text>
    </g>
  )
}
// the same, standing: the text turned to read down the page, as the studio's
function DimensionUp({ y0, y1, x }: { y0: number; y1: number; x: number }) {
  const tick = 0.06
  const cy = f((y0 + y1) / 2)
  return (
    <g>
      <line x1={x} x2={x} y1={y0} y2={y1} {...line} />
      {[y0, y1].map((y) => <line key={y} x1={f(x - tick)} x2={f(x + tick)} y1={f(y + tick)} y2={f(y - tick)} {...line} />)}
      <rect {...rect(x - 0.08, cy - 0.22, x + 0.08, cy + 0.22)} className="fill-background" />
      <text x={f(x + 0.04)} y={cy} textAnchor="middle" transform={`rotate(90 ${f(x + 0.04)} ${cy})`} style={small}>{mm(y1 - y0)}</text>
    </g>
  )
}

export function LivestockPlan({ title, className }: { title: string; className?: string }) {
  const L = house.l / 2, W = house.w / 2
  const fy = W - house.passage.d // the pens' front fence on the passage
  const { rack, trough, mineral } = fittings
  const store = pens.list.find((p) => p.id === "store")!
  const animals = pens.list.filter((p) => p.id !== "store")
  const door = 0.7
  const x0 = -L - ramp.l - 0.15, x1 = tank.x + tank.r + 0.5
  return (
    <svg viewBox={`${f(x0)} ${f(-W - 0.5)} ${f(x1 - x0)} ${f(house.w + 1)}`} role="img" aria-label={title} className={className}>
      {/* The solid back wall and the east end to the roof; the west end stops at the passage, where the ramp comes up */}
      <rect {...rect(-L, -W, L, -W + WALL)} {...solid} />
      <rect {...rect(L - WALL, -W, L, W)} {...solid} />
      <rect {...rect(-L, -W, -L + WALL, fy)} {...solid} />
      {/* The feed passage's open edge toward the paddock, railed */}
      <rect {...rect(-L, W - 0.03, L - WALL, W)} {...line} />

      {/* The partitions between the pens, the feed store walled to the roof and across the passage's end */}
      {animals.slice(1).map((p) => <rect key={p.id} {...rect(p.x0 - FENCE / 2, -W + WALL, p.x0 + FENCE / 2, fy)} {...solid} />)}
      <rect {...rect(store.x0 - WALL / 2, -W + WALL, store.x0 + WALL / 2, W)} {...solid} />

      {/* The front fence on the passage, a gate into each pen swinging out over it, the store's lockable door */}
      {animals.map((p, i) => {
        const g1 = f(p.x1 - 0.12), w = Math.min(pens.gate, p.x1 - p.x0 - 0.24), a = f(g1 - w)
        return (
          <g key={p.id}>
            <rect {...rect(i ? p.x0 : -L + WALL, fy - FENCE / 2, a, fy + FENCE / 2)} {...solid} />
            <rect {...rect(g1, fy - FENCE / 2, p.x1, fy + FENCE / 2)} {...solid} />
            <line x1={g1} x2={g1} y1={f(fy)} y2={f(fy + w)} {...line} />
            <path d={`M${a} ${f(fy)}A${f(w)} ${f(w)} 0 0 0 ${g1} ${f(fy + w)}`} {...dashed} />
          </g>
        )
      })}
      <rect {...rect(store.x0, fy - WALL / 2, store.x1 - door - 0.15, fy + WALL / 2)} {...solid} />
      <rect {...rect(store.x1 - 0.15, fy - WALL / 2, L, fy + WALL / 2)} {...solid} />
      <line x1={f(store.x1 - 0.15 - door)} x2={f(store.x1 - 0.15 - door)} y1={f(fy)} y2={f(fy + door)} {...line} />
      <path d={`M${f(store.x1 - 0.15)} ${f(fy)}A${door} ${door} 0 0 1 ${f(store.x1 - 0.15 - door)} ${f(fy + door)}`} {...dashed} />

      {/* On each pen's front fence, filled from the passage: the hay rack and the trough. The mineral box goes on the
          pen's east partition just behind them: rack, trough and box side by side need 2.3 m, the sheep pen is 2.0 m. */}
      {animals.map((p) => {
        const r0 = p.x0 + 0.1, r1 = r0 + p.rack
        const t0 = r1 + 0.05, t1 = t0 + p.trough
        const mx = p.x1 - FENCE / 2, my = fy - Math.max(rack.d, trough.d) - 0.1
        return (
          <g key={p.id}>
            <rect {...rect(r0, fy - rack.d, r1, fy - FENCE)} {...line} />
            {p.trough ? <rect {...rect(t0, fy - trough.d, t1, fy - FENCE)} rx={0.06} {...line} /> : null}
            {p.trough ? <rect {...rect(mx - mineral.d, my - mineral.w, mx, my)} {...line} /> : null}
          </g>
        )
      })}

      {/* The feed store: a shelf on the back wall, three sacks on a pallet */}
      <rect {...rect(store.x0 + 0.12, -W + WALL, store.x1 - 0.12, -W + 0.4)} {...line} />
      {[-0.42, 0, 0.42].map((y) => <rect key={y} {...rect(store.x0 + 0.18, y - 0.18, store.x1 - 0.18, y + 0.18)} rx={0.07} {...line} />)}

      {/* The ramp down to the paddock from the passage's west end, its cleats; the tank at the back east corner */}
      <rect {...rect(-L - ramp.l, fy, -L, W)} {...line} />
      {Array.from({ length: Math.floor(ramp.l / ramp.cleat) - 1 }, (_, k) => f(-L - (k + 1) * ramp.cleat)).map((x) => (
        <line key={x} x1={x} x2={x} y1={f(fy)} y2={W} {...line} />
      ))}
      <circle cx={tank.x} cy={tank.y} r={tank.r} {...line} />

      {/* The rooms named in one row above, as the studio's BED, SEATING, GALLEY, BATH */}
      {pens.list.map((p) => <text key={p.id} x={f((p.x0 + p.x1) / 2)} y={f(-W - 0.2)} textAnchor="middle" style={label}>{p.label}</text>)}
      <text x={tank.x} y={f(-W - 0.2)} textAnchor="middle" style={label}>TANK</text>
      <text x={f(-L - ramp.l / 2)} y={f(fy - 0.2)} textAnchor="middle" style={label}>RAMP</text>

      <Dimension x0={-L} x1={L} y={f(W + 0.3)} />
      <DimensionUp y0={-W} y1={W} x={f(tank.x + tank.r + 0.25)} />
    </svg>
  )
}
