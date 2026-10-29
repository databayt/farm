import livestock from "./livestock.json"

// The livestock yard drawn in the pattern of the studio's plan (public/designs/studio/render/plan.svg): solid walls
// in black, fittings in thin outline, what is where named in one row above and only the two overall dimensions.
// One outline holds it all (D-039): the palisade at the back, one post-and-rail fence round the rest. The shelter's
// open hall faces down the page onto the village yard, toward the paddock and the viewer of the 3D. Units are
// metres, the shelter's centre at 0,0, y toward the yard. All in currentColor, so the page sets its colour.

const { shelter, pens, platform, fittings, yards, palisade, stones, tree, tank, baskets, compost, dogs, friends } = livestock
const WALL = 0.1 // the pole back wall and the ends, and the feed store's boarded walls
const FENCE = 0.04 // the rail and gates across the hall's open front
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
type Box = { x0: number; x1: number; y0: number; y1: number }
const box = (b: Box) => rect(b.x0, b.y0, b.x1, b.y1)

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
// A gate hung at (x, y): closed along c, drawn open along o, its swing dashed
function Gate({ x, y, w, c, o }: { x: number; y: number; w: number; c: [number, number]; o: [number, number] }) {
  const sweep = c[0] * o[1] - c[1] * o[0] > 0 ? 1 : 0
  return (
    <g>
      <line x1={f(x)} y1={f(y)} x2={f(x + o[0] * w)} y2={f(y + o[1] * w)} {...line} />
      <path d={`M${f(x + c[0] * w)} ${f(y + c[1] * w)}A${f(w)} ${f(w)} 0 0 ${sweep} ${f(x + o[0] * w)} ${f(y + o[1] * w)}`} {...dashed} />
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
  const L = shelter.l / 2, W = shelter.d / 2, E = shelter.plinth.edge
  const { hall, kidding, store } = pens
  const Y = yards.y1
  const door = 0.7
  const { ducks, rabbits, dovecote, cats, bench } = friends
  const yg = yards.gate, dg = dogs.gate
  const x0 = yards.x0 - 0.3, x1 = yards.x1 + 0.75
  const top = palisade.y - 0.6, bottom = Y + 1.1
  const row = palisade.y - 0.25 // the names, in one row above the palisade
  const px0 = hall.x0 + WALL + 0.03, px1 = hall.x1 - WALL / 2 - 0.03 // the sleeping platform
  const py0 = -W + WALL, py1 = -W + WALL + platform.d
  const front = [hall.x0 + WALL, ...pens.gates.flatMap((g) => [g, g + pens.gate]), hall.x1] // rail runs between the gates
  return (
    <svg viewBox={`${f(x0)} ${f(top)} ${f(x1 - x0)} ${f(bottom - top)}`} role="img" aria-label={title} className={className}>
      {/* The outline: the palisade of upright poles at the back, one post-and-rail fence round the rest, one gate of
          two leaves to the paddock */}
      {Array.from({ length: Math.floor((palisade.x1 - palisade.x0) / 0.14) + 1 }, (_, k) => (
        <circle key={k} cx={f(palisade.x0 + k * 0.14)} cy={palisade.y} r={0.06} {...solid} />
      ))}
      <Fence x0={yards.x0} y0={yards.y0} x1={yards.x0} y1={Y} />
      <Fence x0={yards.x0} y0={Y} x1={yg.x0} y1={Y} />
      <Fence x0={f(yg.x0 + yg.w)} y0={Y} x1={yards.x1} y1={Y} />
      <Fence x0={yards.x1} y0={Y} x1={yards.x1} y1={yards.y0} />
      {[yg.x0, yg.x0 + yg.w].map((x, i) => <Gate key={x} x={x} y={Y} w={yg.w / 2} c={[i ? -1 : 1, 0]} o={[0, -1]} />)}

      {/* The shelter on its fieldstone plinth: pole back wall and ends to the eaves, the feed store boarded with its
          door on the east gable */}
      <rect {...rect(-L - E, -W - E, L + E, W + E)} {...fine} />
      <rect {...rect(-L, -W, L, -W + WALL)} {...solid} />
      <rect {...rect(-L, -W, -L + WALL, W)} {...solid} />
      <rect {...rect(L - WALL, -W, L, 0)} {...solid} />
      <rect {...rect(L - WALL, door, L, W)} {...solid} />
      <Gate x={L} y={door} w={door} c={[0, -1]} o={[1, 0]} />
      <rect {...rect(store.x0 - WALL / 2, -W + WALL, store.x0 + WALL / 2, W)} {...solid} />
      <rect {...rect(store.x0, W - WALL, L, W)} {...solid} />

      {/* The hall's open front: a rail and two gates, shut at night */}
      {front.filter((_, i) => i % 2 === 0).map((a, i) => <rect key={a} {...rect(a, W - FENCE / 2, front[i * 2 + 1], W + FENCE / 2)} {...solid} />)}
      {pens.gates.map((g) => <Gate key={g} x={g + pens.gate} y={W} w={pens.gate} c={[-1, 0]} o={[0, 1]} />)}

      {/* In the hall: the bamboo sleeping platform along the whole back, the movable kidding hurdles (dashed), the hay
          racks on the west wall and in the middle, the goats' mineral box high, the sheep's low */}
      <rect {...rect(px0, py0, px1, py1)} {...line} />
      {Array.from({ length: Math.floor((px1 - px0) / 0.25) }, (_, k) => f(px0 + (k + 1) * 0.25)).filter((x) => x < px1 - 0.05).map((x) => (
        <line key={x} x1={x} x2={x} y1={f(py0)} y2={f(py1)} {...fine} />
      ))}
      <path d={`M${kidding.x0} ${f(py1)}L${kidding.x0} ${f(W - 0.15)}`} {...dashed} />
      {fittings.racks.map((r) => <rect key={r.x0} {...box(r)} {...line} />)}
      {fittings.minerals.map((m) => <rect key={m.x0} {...box(m)} {...line} />)}

      {/* The feed store: three sacks on a pallet */}
      {[-0.95, -0.5, -0.05].map((y) => <rect key={y} {...rect(store.x0 + 0.18, y - 0.18, store.x1 - 0.18, y + 0.18)} rx={0.07} {...line} />)}

      {/* In the yard: the troughs under the eaves, stones to climb, the shade tree in its pole guard */}
      {fittings.troughs.map((t) => <rect key={t.x0} {...rect(t.x0, W + 0.4, t.x1, W + 0.4 + fittings.trough.d)} rx={0.08} {...line} />)}
      {stones.list.map((s) => <ellipse key={s.x} cx={s.x} cy={s.y} rx={s.r} ry={f(s.r * 0.75)} transform={`rotate(-15 ${s.x} ${s.y})`} {...line} />)}
      <circle cx={tree.x} cy={tree.y} r={tree.crown} {...dashed} />
      <circle cx={tree.x} cy={tree.y} r={tree.guard} {...line} />
      <circle cx={tree.x} cy={tree.y} r={0.13} {...solid} />

      {/* The farm friends: the duck house and the pond on its gravel apron, the rabbits' hutch with its run built on,
          the dovecote on its pole, the cats' house on a post, a log bench */}
      <rect {...box(ducks.house)} {...line} />
      <line x1={ducks.house.x0} x2={ducks.house.x1} y1={f((ducks.house.y0 + ducks.house.y1) / 2)} y2={f((ducks.house.y0 + ducks.house.y1) / 2)} {...fine} />
      <ellipse cx={ducks.pond.x} cy={ducks.pond.y} rx={f(ducks.pond.rx + ducks.pond.apron)} ry={f(ducks.pond.ry + ducks.pond.apron)} {...dashed} />
      <ellipse cx={ducks.pond.x} cy={ducks.pond.y} rx={ducks.pond.rx} ry={ducks.pond.ry} {...line} />
      <ellipse cx={ducks.pond.x} cy={ducks.pond.y} rx={f(ducks.pond.rx - 0.12)} ry={f(ducks.pond.ry - 0.12)} {...fine} />
      <rect {...box(rabbits.hutch)} {...line} />
      <line x1={f((rabbits.hutch.x0 + rabbits.hutch.x1) / 2)} x2={f((rabbits.hutch.x0 + rabbits.hutch.x1) / 2)} y1={rabbits.hutch.y0} y2={rabbits.hutch.y1} {...fine} />
      <rect {...box(rabbits.run)} {...fine} />
      <rect {...rect(dovecote.x - dovecote.s / 2, dovecote.y - dovecote.s / 2, dovecote.x + dovecote.s / 2, dovecote.y + dovecote.s / 2)} {...line} />
      <circle cx={dovecote.x} cy={dovecote.y} r={0.07} {...solid} />
      <rect {...rect(cats.house.x - cats.house.s / 2, cats.house.y - cats.house.s / 2, cats.house.x + cats.house.s / 2, cats.house.y + cats.house.s / 2)} {...line} />
      <circle cx={cats.house.x} cy={cats.house.y} r={0.07} {...solid} />
      <rect {...rect(bench.x0, bench.y - 0.15, bench.x1, bench.y + 0.15)} rx={0.12} {...line} />

      {/* Behind the store: the tank, the fodder baskets, the three compost bays with their removable front rail
          (dashed) */}
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
            <line x1={bx} x2={bx} y1={f(by)} y2={f(by + b)} {...dashed} />
            {[[bx, by], [bx + b, by], [bx + b, by + b], [bx, by + b]].map(([x, y]) => <circle key={`${x}-${y}`} cx={f(x)} cy={f(y)} r={0.07} {...solid} />)}
          </g>
        )
      })}

      {/* The guard dogs' run in the outline's back east corner, the one fenced place inside: two raised kennels, a
          shade roof (dashed) over the back, a water bowl, a gate onto the yard */}
      <Fence x0={dogs.x0} y0={dogs.y0} x1={dogs.x0} y1={dogs.y1} />
      <Fence x0={dogs.x0} y0={dogs.y1} x1={dg.x0} y1={dogs.y1} />
      <Fence x0={f(dg.x0 + dg.w)} y0={dogs.y1} x1={dogs.x1} y1={dogs.y1} />
      <Gate x={f(dg.x0 + dg.w)} y={dogs.y1} w={dg.w} c={[-1, 0]} o={[0, -1]} />
      <rect {...rect(dogs.x0, dogs.shade.y0, dogs.x1, dogs.shade.y1)} {...dashed} />
      {dogs.kennels.map((k) => (
        <g key={k.x0}>
          <rect {...box(k)} {...line} />
          <line x1={k.x0} x2={k.x1} y1={f((k.y0 + k.y1) / 2)} y2={f((k.y0 + k.y1) / 2)} {...fine} />
        </g>
      ))}
      <circle cx={dogs.bowl.x} cy={dogs.bowl.y} r={dogs.bowl.r} {...line} />

      {/* What is where, in one row above, as the studio's BED, SEATING, GALLEY, BATH; the rest in place */}
      {([
        [(ducks.house.x0 + ducks.house.x1) / 2, "DUCKS"], [(rabbits.hutch.x0 + rabbits.hutch.x1) / 2, "RABBITS"],
        [(hall.x0 + kidding.x0) / 2, hall.label], [(store.x0 + store.x1) / 2, store.label], [tank.x, "TANK"],
        [compost.x0 + compost.bay / 2, "COMPOST"], [(dogs.x0 + dogs.x1) / 2, "DOGS"],
      ] as const).map(([x, t]) => <text key={t} x={f(x)} y={f(row)} textAnchor="middle" style={label}>{t}</text>)}
      <text x={f((kidding.x0 + kidding.x1) / 2)} y={f(W - 0.35)} textAnchor="middle" style={small}>{kidding.label}</text>
      <text x={-1.0} y={3.4} textAnchor="middle" style={label}>VILLAGE YARD</text>
      <text x={ducks.pond.x} y={f(ducks.pond.y + 0.05)} textAnchor="middle" style={small}>POND</text>
      <text x={dovecote.x} y={f(dovecote.y + dovecote.s / 2 + 0.22)} textAnchor="middle" style={small}>DOVES</text>
      <text x={cats.house.x} y={f(cats.house.y + cats.house.s / 2 + 0.22)} textAnchor="middle" style={small}>CATS</text>
      <text x={f((bench.x0 + bench.x1) / 2)} y={f(bench.y + 0.4)} textAnchor="middle" style={small}>BENCH</text>
      <text x={f(yg.x0 + yg.w / 2)} y={f(bottom - 0.12)} textAnchor="middle" style={small}>TO THE PADDOCK · GUESTS</text>

      <Dimension x0={yards.x0} x1={yards.x1} y={f(Y + 0.5)} />
      <DimensionUp y0={yards.y0} y1={Y} x={f(yards.x1 + 0.4)} />
    </svg>
  )
}
