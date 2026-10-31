import { getWords } from "@/components/internationalization/words"

import livestock from "./livestock.json"
import { words } from "./words"

// The livestock yard drawn in the pattern of the studio's plan (public/designs/studio/render/plan.svg): solid walls
// in black, fittings in thin outline, what is where named in one row above and only the two overall dimensions.
// One outline holds it all (D-039, D-047): one post-and-rail fence all round, as in the hero. The herd's shed,
// as the founder's photo's (D-044), opens down the page onto the village yard, toward the paddock and the viewer of
// the 3D. Units are
// metres, the shelter's centre at 0,0, y toward the yard. All in currentColor, so the page sets its colour.

const { shelter, pens, fittings, yards, stones, tree, tank, baskets, compost, dogs, friends, planting } = livestock
const WALL = 0.1 // the shed's boarded back and east end
const FENCE = 0.04 // the rails along the shed's open west side
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

// `title` (the drawing's accessible name) defaults to the page's; the docs pass the guide's own.
export async function LivestockPlan({ title, className }: { title?: string; className?: string }) {
  const w = (await getWords(words)).plan
  const name = w.labels
  title ??= w.title
  const L = shelter.l / 2, W = shelter.d / 2, E = shelter.plinth.edge
  const Y = yards.y1
  const { dovecote, cats, bench } = friends
  const yg = yards.gate, dg = dogs.gate
  const green = [...planting.shrubs, ...planting.bananas] // the planting round the outline
  const edge = { x0: Math.min(...green.map((b) => b.x - b.r)), x1: Math.max(...green.map((b) => b.x + b.r)),
    y0: Math.min(...green.map((b) => b.y - b.r)), y1: Math.max(...planting.beds.map((b) => b.y1)) }
  const x0 = edge.x0 - 0.3, x1 = edge.x1 + 0.75
  const dimY = edge.y1 + 0.75, top = edge.y0 - 0.3, bottom = dimY + 0.6
  const row = yards.y0 - 0.3 // the names, in one row above the back fence
  return (
    <svg viewBox={`${f(x0)} ${f(top)} ${f(x1 - x0)} ${f(bottom - top)}`} role="img" aria-label={title} className={className}>
      {/* The outline: one post-and-rail fence all round, open on the planting as in the hero, one gate of two leaves
          to the paddock */}
      <Fence x0={yards.x0} y0={yards.y0} x1={yards.x1} y1={yards.y0} />
      <Fence x0={yards.x0} y0={yards.y0} x1={yards.x0} y1={Y} />
      <Fence x0={yards.x0} y0={Y} x1={yg.x0} y1={Y} />
      <Fence x0={f(yg.x0 + yg.w)} y0={Y} x1={yards.x1} y1={Y} />
      <Fence x0={yards.x1} y0={Y} x1={yards.x1} y1={yards.y0} />
      {[yg.x0, yg.x0 + yg.w].map((x, i) => <Gate key={x} x={x} y={Y} w={yg.w / 2} c={[i ? -1 : 1, 0]} o={[0, -1]} />)}

      {/* The shed, as the photo's, on its low fieldstone plinth: the thatch's overhang dashed, the back and the east end
          boarded, the west end open behind one rail, the front open between its two braced corner posts (dots) */}
      <rect {...rect(-L - shelter.roof.over, -W - shelter.roof.over, L + shelter.roof.over, W + shelter.roof.over)} {...dashed} />
      <rect {...rect(-L - E, -W - E, L + E, W + E)} {...fine} />
      <rect {...rect(-L, -W, L, -W + WALL)} {...solid} />
      <rect {...rect(L - WALL, -W, L, W)} {...solid} />
      <rect {...rect(-L + 0.02, -W + WALL, -L + 0.02 + FENCE, W - 0.1)} {...solid} />
      {[-L + 0.09, L - 0.09].map((x) => <circle key={x} cx={f(x)} cy={f(W - 0.09)} r={0.11} {...solid} />)}
      <circle cx={f(-L + 0.09)} cy={f(-W + 0.09)} r={0.11} {...solid} />
      <circle cx={pens.basket.x} cy={pens.basket.y} r={pens.basket.r} {...fine} />

      {/* Inside, as the photo's: the straw bale, the plank table with its basket over the lidded crate; the goats' mineral box
          high on the back wall and the sheep's low */}
      <rect {...box(pens.bale)} rx={0.08} {...line} />
      <rect {...box(pens.table)} {...line} />
      {[0.25, 0.5, 0.75].map((t) => {
        const x = f(pens.table.x0 + (pens.table.x1 - pens.table.x0) * t)
        return <line key={t} x1={x} x2={x} y1={pens.table.y0} y2={pens.table.y1} {...fine} />
      })}
      <rect {...box(pens.bin)} {...line} />
      <line x1={pens.bin.x0} x2={pens.bin.x1} y1={pens.bin.y0} y2={pens.bin.y1} {...fine} />
      {pens.minerals.map((m) => <rect key={m.x0} {...box(m)} {...line} />)}

      {/* In the yard: the troughs under the eaves, stones to climb, the shade tree in its pole guard */}
      {fittings.troughs.map((t) => <rect key={t.x0} {...rect(t.x0, W + 0.4, t.x1, W + 0.4 + fittings.trough.d)} rx={0.08} {...line} />)}
      {stones.list.map((s) => <ellipse key={s.x} cx={s.x} cy={s.y} rx={s.r} ry={f(s.r * 0.75)} transform={`rotate(-15 ${s.x} ${s.y})`} {...line} />)}
      <circle cx={tree.x} cy={tree.y} r={tree.crown} {...dashed} />
      <circle cx={tree.x} cy={tree.y} r={tree.guard} {...line} />
      <circle cx={tree.x} cy={tree.y} r={0.13} {...solid} />

      {/* The farm friends: the dovecote on its pole, the cats' house on a post by the back fence, a log bench */}
      <rect {...rect(dovecote.x - dovecote.s / 2, dovecote.y - dovecote.s / 2, dovecote.x + dovecote.s / 2, dovecote.y + dovecote.s / 2)} {...line} />
      <circle cx={dovecote.x} cy={dovecote.y} r={0.07} {...solid} />
      <rect {...rect(cats.house.x - cats.house.s / 2, cats.house.y - cats.house.s / 2, cats.house.x + cats.house.s / 2, cats.house.y + cats.house.s / 2)} {...line} />
      <circle cx={cats.house.x} cy={cats.house.y} r={0.07} {...solid} />
      <rect {...rect(bench.x0, bench.y - 0.15, bench.x1, bench.y + 0.15)} rx={0.12} {...line} />

      {/* By the shed's east end: the tank, the fodder baskets, the three compost bays with their removable front rail
          (dashed) */}
      <circle cx={tank.x} cy={tank.y} r={tank.r} {...line} />
      <rect {...rect(tank.x - tank.r - 0.08, tank.y - tank.r - 0.08, tank.x + tank.r + 0.08, tank.y + tank.r + 0.08)} {...fine} />
      {tank.buckets.map((b) => <circle key={b.x + b.y} cx={b.x} cy={b.y} r={b.r} {...line} />)}
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

      {/* The planting round the outside of the outline, as in the hero: shrubs as soft crowns, banana clumps as crowns of
          leaves, and the vegetable beds outside the front with their rows */}
      {planting.shrubs.map((b) => <circle key={`${b.x}-${b.y}`} cx={b.x} cy={b.y} r={b.r} {...dashed} />)}
      {planting.bananas.map((b) => (
        <g key={`${b.x}-${b.y}`}>
          {Array.from({ length: 6 }, (_, k) => {
            const a = (k / 6) * Math.PI * 2 + 0.3
            return <path key={k} d={`M${b.x} ${b.y}Q${f(b.x + Math.cos(a + 0.35) * b.r * 0.6)} ${f(b.y + Math.sin(a + 0.35) * b.r * 0.6)} ${f(b.x + Math.cos(a) * b.r)} ${f(b.y + Math.sin(a) * b.r)}`} {...fine} />
          })}
          <circle cx={b.x} cy={b.y} r={0.08} {...solid} />
        </g>
      ))}
      {planting.beds.map((b) => (
        <g key={b.x0}>
          <rect {...box(b)} {...fine} />
          {Array.from({ length: Math.floor((b.x1 - b.x0) / 0.5) }, (_, k) => [0.3, 0.7].map((t) => (
            <circle key={`${k}-${t}`} cx={f(b.x0 + 0.25 + k * 0.5)} cy={f(b.y0 + (b.y1 - b.y0) * t)} r={0.16} {...fine} />
          )))}
        </g>
      ))}

      {/* What is where, in one row above, as the studio's BED, SEATING, GALLEY, BATH; the rest in place */}
      {([
        [cats.house.x, name.cats], [0, name.shed], [tank.x, name.tank],
        [compost.x0 + compost.bay / 2, name.compost], [(dogs.x0 + dogs.x1) / 2, name.dogs],
      ] as const).map(([x, t]) => <text key={t} x={f(x)} y={f(row)} textAnchor="middle" style={label}>{t}</text>)}
      <text x={-1.0} y={3.4} textAnchor="middle" style={label}>{name.yard}</text>
      <text x={dovecote.x} y={f(dovecote.y + dovecote.s / 2 + 0.22)} textAnchor="middle" style={small}>{name.doves}</text>
      <text x={f((bench.x0 + bench.x1) / 2)} y={f(bench.y + 0.4)} textAnchor="middle" style={small}>{name.bench}</text>
      <text x={f(yg.x0 + yg.w / 2)} y={f(bottom - 0.12)} textAnchor="middle" style={small}>{name.paddock}</text>
      <text x={f((planting.beds[1].x0 + planting.beds[1].x1) / 2)} y={f(planting.beds[1].y1 + 0.3)} textAnchor="middle" style={small}>{name.vegetables}</text>

      <Dimension x0={yards.x0} x1={yards.x1} y={f(dimY)} />
      <DimensionUp y0={yards.y0} y1={Y} x={f(edge.x1 + 0.4)} />
    </svg>
  )
}
