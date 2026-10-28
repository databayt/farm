import parking from "./parking.json"

// The way in drawn in the pattern of the livestock plan (src/components/livestock/livestock-plan.tsx): thin lines,
// no colour, bold capitals and dimensions in millimetres. It is turned as the homepage plan turns the compound
// (src/components/home/compound-plan.tsx), compound.json's y flipped: the public road runs along the bottom of the
// page, the sign wall stands left of the gate and the rock road leaves at the top. Units are metres in
// compound.json's frame at true size; the homepage spreads the way in sideways, this plan does not.

const { road, turn, gate, sign, hedge, parking: lot, rockRoad, trees, cars } = parking
const thin = { fill: "none", stroke: "currentColor", strokeWidth: 0.75, vectorEffect: "non-scaling-stroke" } as const
const medium = { ...thin, strokeWidth: 1.6 } as const
const faint = { ...thin, strokeWidth: 0.5, strokeOpacity: 0.45 } as const
const dashed = { ...thin, strokeDasharray: "4 3" } as const
const label = {
  fontFamily: "var(--font-sans), ui-sans-serif, system-ui, sans-serif",
  fontSize: 0.5,
  fontWeight: 700,
  letterSpacing: "0.04em",
  fill: "currentColor",
} as const
const small = { ...label, fontSize: 0.36, fontWeight: 600 } as const
// letters over the pavers, the setts or a dashed crown knock the lines out round them
const halo = { stroke: "var(--background)", strokeWidth: 0.16, strokeLinejoin: "round", paintOrder: "stroke" } as const

const f = (n: number) => +n.toFixed(3)
const mm = (m: number) => Math.round(m * 1000).toLocaleString("en-US")
// compound.json's y runs south, into the farm; the page's runs down it, toward the road
const Y = (y: number) => f(-y)
const rect = (x0: number, y0: number, x1: number, y1: number) => ({ x: f(x0), y: Y(Math.max(y0, y1)), width: f(x1 - x0), height: f(Math.abs(y1 - y0)) })
const path = (p: number[][], close = false) => `M${p.map(([x, y]) => `${f(x)} ${Y(y)}`).join("L")}${close ? "Z" : ""}`

// the rock road's centre line, a cubic Bézier in plan, and the unit normal to its west side
type Curve = readonly (readonly number[])[]
const bezier = (p: Curve, t: number) => {
  const u = 1 - t, k = [u * u * u, 3 * u * u * t, 3 * u * t * t, t * t * t]
  return [0, 1].map((i) => k.reduce((s, c, j) => s + c * p[j][i], 0))
}
const normal = (p: Curve, t: number) => {
  const u = 1 - t, k = [3 * u * u, 6 * u * t, 3 * t * t]
  const [dx, dy] = [0, 1].map((i) => k.reduce((s, c, j) => s + c * (p[j + 1][i] - p[j][i]), 0))
  const n = Math.hypot(dx, dy)
  return [-dy / n, dx / n]
}
// a point d metres off the centre line, west for d > 0
const off = (p: Curve, t: number, d: number) => {
  const [x, y] = bezier(p, t), [nx, ny] = normal(p, t)
  return [x + nx * d, y + ny * d]
}

function Dimension({ x0, x1, y }: { x0: number; x1: number; y: number }) {
  const tick = 0.15, at = Y(y)
  return (
    <g>
      <line x1={x0} x2={x1} y1={at} y2={at} {...thin} />
      {[x0, x1].map((x) => <line key={x} x1={f(x - tick)} x2={f(x + tick)} y1={f(at + tick)} y2={f(at - tick)} {...thin} />)}
      <text x={f((x0 + x1) / 2)} y={f(at - 0.15)} textAnchor="middle" style={{ ...small, ...halo }}>{mm(x1 - x0)}</text>
    </g>
  )
}
// the same, standing: the text turned to read up the page
function DimensionUp({ y0, y1, x }: { y0: number; y1: number; x: number }) {
  const tick = 0.15, cy = f((Y(y0) + Y(y1)) / 2)
  return (
    <g>
      <line x1={x} x2={x} y1={Y(y0)} y2={Y(y1)} {...thin} />
      {[y0, y1].map((y) => <line key={y} x1={f(x - tick)} x2={f(x + tick)} y1={f(Y(y) + tick)} y2={f(Y(y) - tick)} {...thin} />)}
      <text x={f(x - 0.15)} y={cy} textAnchor="middle" transform={`rotate(-90 ${f(x - 0.15)} ${cy})`} style={{ ...small, ...halo }}>{mm(Math.abs(y1 - y0))}</text>
    </g>
  )
}

// A hedge run in plan: its two long sides scalloped, as a hedge is drawn from above.
function Hedge({ x0, x1 }: { x0: number; x1: number }) {
  const n = Math.max(1, Math.round((x1 - x0) / 0.5)), s = (x1 - x0) / n, r = f(s * 0.62)
  const [top, bottom] = [Y(hedge.y + hedge.w / 2), Y(hedge.y - hedge.w / 2)]
  const along = Array.from({ length: n }, (_, k) => `A${r} ${r} 0 0 1 ${f(x0 + (k + 1) * s)} ${top}`).join("")
  const back = Array.from({ length: n }, (_, k) => `A${r} ${r} 0 0 1 ${f(x1 - (k + 1) * s)} ${bottom}`).join("")
  return <path d={`M${f(x0)} ${top}${along}L${f(x1)} ${bottom}${back}Z`} {...thin} />
}

export function ParkingPlan({ title, className }: { title: string; className?: string }) {
  const [px0, py0, px1, py1] = lot.box
  const e = lot.edging.w
  const [gl, gr] = gate.x
  const p = gate.post
  const [sx0, sy0, sx1, sy1] = sign.box
  const front = gate.y - p / 2 // the pillars' and the sign wall's road face
  const leaf = (gr - gl) / 2
  const x0 = Math.min(...hedge.runs.flat()), x1 = Math.max(...hedge.runs.flat())
  // the turn: between the pillars from the parking to their road face, then splayed out to the road's edge
  const mouth = [[gl, py0], [gl, front], [gl - p, front], [gl - p - turn.splay, road.edge], [gr + p + turn.splay, road.edge],
    [gr + p, front], [gr, front], [gr, py0]]
  // the start of the rock road: its two edges, the edging inside them, and sett arcs across it about every 0.5 m
  const { curve, width, edging, show } = rockRoad
  const ts = Array.from({ length: 25 }, (_, k) => (k * show) / 24)
  const half = width / 2
  const arcs = Array.from({ length: 9 }, (_, k) => ((k + 0.5) * show) / 9)
  const cut = [off(curve, show, half), off(curve, show, -half)]
  // the pavers drawn on a 0.8 m grid, twice the blocks' size, so they read as pavers and not as a grey fill
  const [ix0, iy0, ix1, iy1] = [px0 + e, py0 + e, px1 - e, py1 - e]
  const gridX = Array.from({ length: Math.floor((ix1 - ix0) / 0.8) }, (_, k) => f(ix0 + 0.4 + k * 0.8)).filter((x) => x < ix1 - 0.2)
  const gridY = Array.from({ length: Math.floor((iy1 - iy0) / 0.8) }, (_, k) => f(iy0 + 0.4 + k * 0.8)).filter((y) => y < iy1 - 0.2)
  const bays = lot.bays.slice(0, -1).map((b, i) => ({ n: i + 1, x0: b, x1: lot.bays[i + 1], cx: f((b + lot.bays[i + 1]) / 2) }))
  const stopY = py1 - lot.stops.at
  return (
    <svg viewBox="1.9 -6.1 33.2 15.5" role="img" aria-label={title} className={className}>
      {/* The public road's edge, the hedge along the boundary, the sign wall and the gate's pillars (solid, as the
          homepage plan draws them) */}
      <line x1={x0} x2={x1} y1={Y(road.edge)} y2={Y(road.edge)} {...medium} />
      {hedge.runs.map(([a, b]) => <Hedge key={a} x0={a} x1={b} />)}
      <rect {...rect(sx0, sy0, sx1, sy1)} fill="currentColor" />
      {[gl - p, gr].map((x) => <rect key={x} {...rect(x, gate.y - p / 2, x + p, gate.y + p / 2)} fill="currentColor" />)}

      {/* The turn: setts from the road through the gate to the parking, arcs across them */}
      <path d={path(mouth)} {...thin} />
      {Array.from({ length: 5 }, (_, k) => road.edge + 0.5 + k * 0.5).map((y) => (
        <path key={y} d={`M${f(gl + 0.12)} ${Y(y)}A5 5 0 0 1 ${f(gr - 0.12)} ${Y(y)}`} {...faint} />
      ))}

      {/* The leaves open inward over the drive, their swing dashed */}
      <path d={`M${gl} ${Y(gate.y)}L${gl} ${Y(gate.y + leaf)}M${gr} ${Y(gate.y)}L${gr} ${Y(gate.y + leaf)}`} {...medium} />
      <path d={`M${f(gl + leaf)} ${Y(gate.y)}A${leaf} ${leaf} 0 0 0 ${gl} ${Y(gate.y + leaf)}`} {...dashed} />
      <path d={`M${f(gr - leaf)} ${Y(gate.y)}A${leaf} ${leaf} 0 0 1 ${gr} ${Y(gate.y + leaf)}`} {...dashed} />

      {/* The parking: its fieldstone edging, the pavers inside it */}
      <rect {...rect(px0, py0, px1, py1)} rx={lot.r} {...thin} />
      <rect {...rect(ix0, iy0, ix1, iy1)} rx={f(lot.r - e)} {...thin} />
      {gridX.map((x) => <line key={`x${x}`} x1={x} x2={x} y1={Y(iy1)} y2={Y(iy0)} {...faint} />)}
      {gridY.map((y) => <line key={`y${y}`} x1={ix0} x2={ix1} y1={Y(y)} y2={Y(y)} {...faint} />)}

      {/* The rock road leaving the far edge: its edges and edging, sett arcs across, cut where the plan ends */}
      {[half, half - edging, -half + edging, -half].map((d) => <path key={d} d={path(ts.map((t) => off(curve, t, d)))} {...(Math.abs(d) === half ? thin : faint)} />)}
      {arcs.map((t) => {
        const [a, b] = [off(curve, t, half - edging), off(curve, t, -half + edging)]
        return <path key={t} d={`M${f(a[0])} ${Y(a[1])}A4.5 4.5 0 0 1 ${f(b[0])} ${Y(b[1])}`} {...faint} />
      })}
      <path d={path(cut)} {...thin} strokeDasharray="1 2" />

      {/* The bays: sett strips between them, a wheel stop in each, the two cars nose in to their stops */}
      {lot.bays.slice(1).map((x) => <rect key={x} {...rect(x - lot.strips.w / 2, py1 - lot.strips.l, x + lot.strips.w / 2, py1 - e)} {...thin} fill="var(--background)" />)}
      {bays.map((b) => <rect key={b.n} {...rect(b.cx - lot.stops.l / 2, stopY - lot.stops.r, b.cx + lot.stops.l / 2, stopY + lot.stops.r)} rx={0.06} {...thin} fill="var(--background)" />)}
      {cars.list.map((c) => {
        const b = bays[c.bay - 1]
        const tail = stopY - lot.stops.r - c.wheel - c.axles[1]
        const roof = c.kind === "suv" ? [0.3, 2.6] : [0.45, 2.35]
        return (
          <g key={c.bay}>
            <rect {...rect(b.cx - c.w / 2, tail, b.cx + c.w / 2, tail + c.l)} rx={0.3} {...faint} fill="var(--background)" />
            <rect {...rect(b.cx - c.w / 2 + 0.14, tail + roof[0], b.cx + c.w / 2 - 0.14, tail + roof[1])} rx={0.14} {...faint} />
            <line x1={f(b.cx - c.w / 2 + 0.1)} x2={f(b.cx + c.w / 2 - 0.1)} y1={Y(tail + roof[1] + 0.62)} y2={Y(tail + roof[1] + 0.62)} {...faint} />
          </g>
        )
      })}

      {/* Shade trees: the crowns overhead, dashed, and their trunks */}
      {trees.list.map(([x, y, r]) => (
        <g key={x}>
          <circle cx={x} cy={Y(y)} r={r} {...dashed} />
          <circle cx={x} cy={Y(y)} r={0.12} {...thin} />
        </g>
      ))}

      {bays.map((b) => <text key={b.n} x={b.cx} y={Y(py1 - lot.strips.l - 0.85)} textAnchor="middle" style={small}>{b.n}</text>)}
      <text x={bays[1].cx} y={Y(stopY - 0.62)} textAnchor="middle" style={{ ...small, ...halo }}>WHEEL STOP</text>
      <text x={27.6} y={Y(-1.6)} textAnchor="middle" style={{ ...label, ...halo }}>PARKING</text>
      <text x={27.6} y={Y(-2.25)} textAnchor="middle" style={{ ...small, ...halo }}>GRASS PAVERS</text>
      <text x={27.1} y={Y(3.6)} style={label}>ROCK ROAD</text>
      <text x={27.1} y={Y(3.05)} style={{ ...small, ...halo }}>TO THE INNER GATE</text>
      <text x={f((gl + gr) / 2)} y={Y(gate.y - 0.62)} textAnchor="middle" style={{ ...label, ...halo }}>GATE</text>
      <text x={13.6} y={Y(sy1 + 0.55)} textAnchor="middle" style={label}>SIGN WALL</text>
      <text x={f((sx0 + sx1) / 2)} y={f(Y(sy0) + 0.4)} textAnchor="middle" style={small}>DIGITAL FARM IN LED LETTERS</text>
      <text x={31.4} y={Y(hedge.y + hedge.w / 2 + 0.5)} textAnchor="middle" style={small}>HEDGE</text>
      <text x={trees.list[1][0]} y={f(Y(trees.list[1][1]) - 0.5)} textAnchor="middle" style={{ ...small, ...halo }}>SHADE TREE</text>
      <text x={29.5} y={f(Y(road.edge) + 1.45)} textAnchor="middle" style={label}>PUBLIC ROAD</text>

      {bays.map((b) => <Dimension key={b.n} x0={b.x0} x1={b.x1} y={py1 + 0.12} />)}
      <Dimension x0={off(curve, 0, half)[0]} x1={off(curve, 0, -half)[0]} y={py1 + 0.12} />
      <Dimension x0={px0} x1={px1} y={py1 + 3.4} />
      <DimensionUp y0={py1} y1={py0} x={px0 - 0.75} />
      <DimensionUp y0={py1} y1={py1 - lot.strips.l} x={bays[3].x1 - 0.25} />
      <DimensionUp y0={py1 - lot.strips.l} y1={sy1} x={bays[3].x1 - 0.25} />
      <Dimension x0={sx0} x1={sx1} y={road.edge - 0.75} />
      <Dimension x0={gl} x1={gr} y={road.edge - 0.75} />
    </svg>
  )
}
