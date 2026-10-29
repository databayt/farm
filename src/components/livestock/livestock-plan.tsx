import livestock from "./livestock.json"

// The livestock yard drawn in the pattern of the studio's plan (public/designs/studio/render/plan.svg): solid walls
// in black, fittings in thin outline, the shelter's rooms named in one row above and only the two overall
// dimensions. The shelter opens down the page onto the two yards and the lane between them, toward the paddock and
// the viewer of the 3D. Units are metres, the shelter's centre at 0,0, y toward the yards. All in currentColor, so
// the page sets its colour.

const { shelter, pens, platform, fittings, yards, palisade, stones, tree, tank, baskets, compost } = livestock
const WALL = 0.1 // the pole back wall and the ends, and the feed store's boarded walls
const FENCE = 0.04 // the pole hurdles between the pens and on their fronts, 1.2 m high
const line = { fill: "none", stroke: "currentColor", strokeWidth: 0.9, vectorEffect: "non-scaling-stroke" } as const
const fine = { ...line, strokeWidth: 0.6 } as const
const dashed = { ...line, strokeDasharray: "4 3" } as const
const solid = { fill: "currentColor" } as const
const font = { fontFamily: "Helvetica, Arial, sans-serif", fill: "currentColor" } as const
const label = { ...font, fontSize: 0.17, fontWeight: 700, letterSpacing: "0.03em" } as const
const small = { ...font, fontSize: 0.13 } as const

const f = (n: number) => +n.toFixed(3)
const mm = (m: number) => Math.round(m * 1000).toLocaleString("en-US")
const rect = (x0: number, y0: number, x1: number, y1: number) => ({ x: f(x0), y: f(y0), width: f(x1 - x0), height: f(y1 - y0) })

// A run of post-and-rail fence: the rails as one line, a round post at each end and at most every yards.post metres
function Fence({ x0, y0, x1, y1 }: { x0: number; y0: number; x1: number; y1: number }) {
  const n = Math.max(1, Math.ceil(Math.hypot(x1 - x0, y1 - y0) / yards.post))
  return (
    <g>
      <line x1={f(x0)} y1={f(y0)} x2={f(x1)} y2={f(y1)} {...line} />
      {Array.from({ length: n + 1 }, (_, k) => (
        <circle key={k} cx={f(x0 + ((x1 - x0) * k) / n)} cy={f(y0 + ((y1 - y0) * k) / n)} r={0.07} {...solid} />
      ))}
    </g>
  )
}
// A gate hung at (x, y): closed along (cx, cy), drawn open along (ox, oy), its swing dashed
function Gate({ x, y, w, c, o }: { x: number; y: number; w: number; c: [number, number]; o: [number, number] }) {
  const sweep = c[0] * o[1] - c[1] * o[0] > 0 ? 1 : 0
  return (
    <g>
      <line x1={x} y1={y} x2={f(x + o[0] * w)} y2={f(y + o[1] * w)} {...line} />
      <path d={`M${f(x + c[0] * w)} ${f(y + c[1] * w)}A${w} ${w} 0 0 ${sweep} ${f(x + o[0] * w)} ${f(y + o[1] * w)}`} {...dashed} />
    </g>
  )
}

function Dimension({ x0, x1, y }: { x0: number; x1: number; y: number }) {
  const tick = 0.07, cx = f((x0 + x1) / 2)
  return (
    <g>
      <line x1={x0} x2={x1} y1={y} y2={y} {...line} />
      {[x0, x1].map((x) => <line key={x} x1={f(x - tick)} x2={f(x + tick)} y1={f(y + tick)} y2={f(y - tick)} {...line} />)}
      <rect {...rect(cx - 0.32, y - 0.1, cx + 0.32, y + 0.1)} className="fill-background" />
      <text x={cx} y={f(y + 0.045)} textAnchor="middle" style={small}>{mm(x1 - x0)}</text>
    </g>
  )
}
// the same, standing: the text turned to read down the page, as the studio's
function DimensionUp({ y0, y1, x }: { y0: number; y1: number; x: number }) {
  const tick = 0.07, cy = f((y0 + y1) / 2)
  return (
    <g>
      <line x1={x} x2={x} y1={y0} y2={y1} {...line} />
      {[y0, y1].map((y) => <line key={y} x1={f(x - tick)} x2={f(x + tick)} y1={f(y + tick)} y2={f(y - tick)} {...line} />)}
      <rect {...rect(x - 0.1, cy - 0.32, x + 0.1, cy + 0.32)} className="fill-background" />
      <text x={f(x + 0.045)} y={cy} textAnchor="middle" transform={`rotate(90 ${f(x + 0.045)} ${cy})`} style={small}>{mm(y1 - y0)}</text>
    </g>
  )
}

export function LivestockPlan({ title, className }: { title: string; className?: string }) {
  const L = shelter.l / 2, W = shelter.d / 2
  const store = pens.list.find((p) => p.id === "store")!
  const animals = pens.list.filter((p) => p.id !== "store")
  const [lane0, lane1] = yards.lane
  const Y = yards.y1
  const g = pens.gate
  const door = 0.7
  const x0 = palisade.x0 - 0.25, x1 = compost.x0 + compost.bay + 0.75
  const top = palisade.y - 0.6, bottom = Y + 1.1
  return (
    <svg viewBox={`${f(x0)} ${f(top)} ${f(x1 - x0)} ${f(bottom - top)}`} role="img" aria-label={title} className={className}>
      {/* The palisade windbreak behind the shelter: upright poles shoulder to shoulder */}
      {Array.from({ length: Math.floor((palisade.x1 - palisade.x0) / 0.14) + 1 }, (_, k) => (
        <circle key={k} cx={f(palisade.x0 + k * 0.14)} cy={palisade.y} r={0.06} {...solid} />
      ))}

      {/* The fieldstone plinth's edge, then the shelter: pole back wall and ends to the eaves, the feed store boarded,
          its door on the east gable */}
      <rect {...rect(-L - shelter.plinth.edge, -W - shelter.plinth.edge, L + shelter.plinth.edge, W + shelter.plinth.edge)} {...fine} />
      <rect {...rect(-L, -W, L, -W + WALL)} {...solid} />
      <rect {...rect(-L, -W, -L + WALL, W)} {...solid} />
      <rect {...rect(L - WALL, -W, L, 0)} {...solid} />
      <rect {...rect(L - WALL, door, L, W)} {...solid} />
      <Gate x={L} y={door} w={door} c={[0, -1]} o={[1, 0]} />
      <rect {...rect(store.x0 - WALL / 2, -W + WALL, store.x0 + WALL / 2, W)} {...solid} />
      <rect {...rect(store.x0, W - WALL, L, W)} {...solid} />

      {/* The hurdles between the pens; each pen's front onto its yard, a gate in it (the kidding pen's onto the lane) */}
      {animals.slice(1).map((p) => <rect key={p.id} {...rect(p.x0 - FENCE / 2, -W + WALL, p.x0 + FENCE / 2, W)} {...solid} />)}
      {animals.map((p, i) => {
        const a = f(p.x1 - 0.1 - g)
        return (
          <g key={p.id}>
            <rect {...rect(i ? p.x0 : -L + WALL, W - FENCE / 2, a, W + FENCE / 2)} {...solid} />
            <rect {...rect(p.x1 - 0.1, W - FENCE / 2, p.x1 - FENCE / 2, W + FENCE / 2)} {...solid} />
            <Gate x={f(p.x1 - 0.1)} y={W} w={g} c={[-1, 0]} o={[0, 1]} />
          </g>
        )
      })}

      {/* In each pen: the slatted bamboo sleeping platform along the back, the hay rack on the west side, the mineral
          box on the east */}
      {animals.map((p) => {
        const px0 = (p.x0 === -L ? p.x0 + WALL : p.x0 + FENCE / 2) + 0.03, px1 = p.x1 - FENCE / 2 - 0.03
        const py0 = -W + WALL, py1 = -W + WALL + platform.d
        const ry = py1 + 0.15
        return (
          <g key={p.id}>
            <rect {...rect(px0, py0, px1, py1)} {...line} />
            {Array.from({ length: Math.floor((px1 - px0) / 0.25) }, (_, k) => f(px0 + (k + 1) * 0.25)).filter((x) => x < px1 - 0.05).map((x) => (
              <line key={x} x1={x} x2={x} y1={f(py0)} y2={f(py1)} {...fine} />
            ))}
            <rect {...rect(px0, ry, px0 + fittings.rack.d, ry + p.rack)} {...line} />
            {p.head ? <rect {...rect(px1 - fittings.mineral.d, ry, px1, ry + fittings.mineral.w)} {...line} /> : null}
          </g>
        )
      })}

      {/* The feed store: three sacks on a pallet */}
      {[-0.95, -0.5, -0.05].map((y) => <rect key={y} {...rect(store.x0 + 0.18, y - 0.18, store.x1 - 0.18, y + 0.18)} rx={0.07} {...line} />)}

      {/* The yards: post-and-rail of round poles, the lane between them, a gate from each yard into the lane and the
          lane's gate to the paddock, two leaves; a float trough in each yard under the eaves */}
      <Fence x0={-L} y0={W} x1={yards.goats.x0} y1={W} />
      <Fence x0={yards.goats.x0} y0={W} x1={yards.goats.x0} y1={Y} />
      <Fence x0={yards.goats.x0} y0={Y} x1={lane0} y1={Y} />
      <Fence x0={L} y0={W} x1={yards.sheep.x1} y1={W} />
      <Fence x0={yards.sheep.x1} y0={W} x1={yards.sheep.x1} y1={Y} />
      <Fence x0={yards.sheep.x1} y0={Y} x1={lane1} y1={Y} />
      {[lane0, lane1].map((x, i) => (
        <g key={x}>
          <Fence x0={x} y0={W} x1={x} y1={4} />
          <Fence x0={x} y0={4 + yards.gate} x1={x} y1={Y} />
          <Gate x={x} y={f(4 + yards.gate)} w={yards.gate} c={[0, -1]} o={[i ? -1 : 1, 0]} />
          <Gate x={x} y={Y} w={f((lane1 - lane0) / 2)} c={[i ? -1 : 1, 0]} o={[0, -1]} />
        </g>
      ))}
      {animals.filter((p) => p.trough).map((p) => {
        const t0 = (p.x0 + p.x1) / 2 - p.trough / 2 - 0.4
        return <rect key={p.id} {...rect(t0, W + 0.4, t0 + p.trough, W + 0.4 + fittings.trough.d)} rx={0.08} {...line} />
      })}

      {/* Stones in the goat yard to climb; a shade tree in the sheep yard, its trunk in a pole guard */}
      {stones.list.map((s) => <ellipse key={s.x} cx={s.x} cy={s.y} rx={s.r} ry={f(s.r * 0.75)} transform={`rotate(-15 ${s.x} ${s.y})`} {...line} />)}
      <circle cx={tree.x} cy={tree.y} r={tree.crown} {...dashed} />
      <circle cx={tree.x} cy={tree.y} r={tree.guard} {...line} />
      <circle cx={tree.x} cy={tree.y} r={0.13} {...solid} />

      {/* Behind the store: the tank on its stand, the fodder baskets by the door, the three compost bays open to the path */}
      <circle cx={tank.x} cy={tank.y} r={tank.r} {...line} />
      {baskets.list.map((b) => (
        <g key={b.x}>
          <circle cx={b.x} cy={b.y} r={b.r} {...line} />
          <circle cx={b.x} cy={b.y} r={f(b.r * 0.7)} {...fine} />
        </g>
      ))}
      {Array.from({ length: compost.n }, (_, k) => {
        const by = compost.y0 + k * compost.bay, bx = compost.x0, b = compost.bay
        return (
          <g key={k}>
            <path d={`M${bx} ${f(by)}L${f(bx + b)} ${f(by)}L${f(bx + b)} ${f(by + b)}L${bx} ${f(by + b)}`} {...line} />
            {[[bx, by], [bx + b, by], [bx + b, by + b], [bx, by + b]].map(([x, y]) => <circle key={`${x}-${y}`} cx={f(x)} cy={f(y)} r={0.07} {...solid} />)}
          </g>
        )
      })}

      {/* The shelter's rooms named in one row above, as the studio's BED, SEATING, GALLEY, BATH; the yards in place */}
      {pens.list.map((p) => <text key={p.id} x={f((p.x0 + p.x1) / 2)} y={f(palisade.y - 0.25)} textAnchor="middle" style={label}>{p.label}</text>)}
      <text x={tank.x} y={f(palisade.y - 0.25)} textAnchor="middle" style={label}>TANK</text>
      <text x={f(compost.x0 + compost.bay / 2)} y={f(palisade.y - 0.25)} textAnchor="middle" style={label}>COMPOST</text>
      <text x={-2.6} y={3.6} textAnchor="middle" style={label}>GOAT YARD</text>
      <text x={1.6} y={3.4} textAnchor="middle" style={label}>SHEEP YARD</text>
      <text x={0} y={5.9} textAnchor="middle" transform="rotate(-90 0 5.9)" style={small}>LANE</text>
      <text x={0} y={f(bottom - 0.12)} textAnchor="middle" style={small}>TO THE PADDOCK</text>

      <Dimension x0={yards.goats.x0} x1={yards.sheep.x1} y={f(Y + 0.5)} />
      <DimensionUp y0={-W} y1={Y} x={f(compost.x0 + compost.bay + 0.4)} />
    </svg>
  )
}
