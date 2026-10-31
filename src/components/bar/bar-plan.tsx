import { getWords } from "@/components/internationalization/words"

import bar from "./bar.json"
import { words } from "./words"

// The bar drawn in the pattern of the camp plan (src/components/camp/camp-plan.tsx): thin lines, no colour,
// bold capitals and dimensions in millimetres. The hatch faces down the page, toward the courtyard and the
// viewer of the 3D. Units are metres, the container's centre at 0,0, y toward the hatch.

const { container, hatch, counter, deck, stools, inside } = bar
const thin = { fill: "none", stroke: "currentColor", strokeWidth: 0.75, vectorEffect: "non-scaling-stroke" } as const
const medium = { ...thin, strokeWidth: 1.6 } as const
const faint = { ...thin, strokeWidth: 0.5, strokeOpacity: 0.45 } as const
const dashed = { ...thin, strokeDasharray: "4 3" } as const
const label = {
  fontFamily: "var(--font-sans), ui-sans-serif, system-ui, sans-serif",
  fontSize: 0.13,
  fontWeight: 700,
  letterSpacing: "0.04em",
  fill: "currentColor",
} as const
const small = { ...label, fontSize: 0.1, fontWeight: 600 } as const

const f = (n: number) => +n.toFixed(3)
const mm = (m: number) => Math.round(m * 1000).toLocaleString("en-US")
const rect = (x0: number, y0: number, x1: number, y1: number) => ({ x: f(x0), y: f(y0), width: f(x1 - x0), height: f(y1 - y0) })

function Dimension({ x0, x1, y }: { x0: number; x1: number; y: number }) {
  const tick = 0.06
  return (
    <g>
      <line x1={x0} x2={x1} y1={y} y2={y} {...thin} />
      {[x0, x1].map((x) => <line key={x} x1={f(x - tick)} x2={f(x + tick)} y1={f(y + tick)} y2={f(y - tick)} {...thin} />)}
      <text x={f((x0 + x1) / 2)} y={f(y - 0.07)} textAnchor="middle" style={small}>{mm(x1 - x0)}</text>
    </g>
  )
}
// the same, standing: the text turned to read up the page
function DimensionUp({ y0, y1, x }: { y0: number; y1: number; x: number }) {
  const tick = 0.06
  const cy = f((y0 + y1) / 2)
  return (
    <g>
      <line x1={x} x2={x} y1={y0} y2={y1} {...thin} />
      {[y0, y1].map((y) => <line key={y} x1={f(x - tick)} x2={f(x + tick)} y1={f(y + tick)} y2={f(y - tick)} {...thin} />)}
      <text x={f(x - 0.07)} y={cy} textAnchor="middle" transform={`rotate(-90 ${f(x - 0.07)} ${cy})`} style={small}>{mm(y1 - y0)}</text>
    </g>
  )
}

// `title` (the drawing's accessible name) defaults to the page's; the docs pass the guide's own.
export async function BarPlan({ title, className }: { title?: string; className?: string }) {
  const w = await getWords(words)
  const name = w.plan.labels
  title ??= w.plan.title
  const L = container.l / 2, W = container.w / 2, t = container.wall
  const [ix, iy] = [L - t, W - t] // the inside faces
  const { front, back, store, door } = inside
  const fy = iy - front.d, by = -iy + back.d
  const cy1 = W + counter.d
  const dy1 = W + deck.d
  const flapOut = (hatch.head - hatch.sill) * Math.sin(((180 - hatch.flap.angle) * Math.PI) / 180) // the flap's reach
  // the deck's boards run along the container, 140 mm a board
  const boards = Array.from({ length: Math.floor(deck.d / 0.14) }, (_, k) => f(W + 0.1 + (k + 1) * 0.14))
  return (
    <svg viewBox="-3.75 -1.95 8.1 5.95" role="img" aria-label={title} className={className}>
      {/* The plinth, a stone course 100 mm proud of the box all round, and the deck in front of the hatch */}
      <rect {...rect(-L - 0.1, -W - 0.1, L + 0.1, W + 0.1)} {...faint} />
      <rect {...rect(deck.x0, W + 0.1, deck.x1, dy1)} {...medium} />
      {boards.map((y) => <line key={y} x1={deck.x0} x2={deck.x1} y1={y} y2={y} {...faint} />)}

      {/* The steel box: its walls, the hatch open in the courtyard wall, the flap propped out over the counter
          (dashed, overhead), the cargo doors at the north end with the right leaf swung open */}
      <path d={`M${f(hatch.x0)} ${W}L${-L} ${W}L${-L} ${-W}L${L} ${-W}L${L} ${W}L${f(hatch.x1)} ${W}`} {...medium} />
      <path d={`M${f(hatch.x0)} ${f(iy)}L${f(-ix)} ${f(iy)}L${f(-ix)} ${f(-iy)}L${f(ix)} ${f(-iy)}L${f(ix)} ${f(iy)}L${f(hatch.x1)} ${f(iy)}`} {...thin} />
      {[hatch.x0, hatch.x1].map((x) => <line key={x} x1={f(x)} x2={f(x)} y1={f(iy)} y2={W} {...thin} />)}
      <line x1={hatch.x0} x2={hatch.x1} y1={W} y2={W} {...faint} />
      <rect {...rect(hatch.x0, W, hatch.x1, W + flapOut)} {...dashed} />
      <rect fill="var(--background)" stroke="none" {...rect(ix, -door.leaf, L + 0.01, door.leaf)} />
      <line x1={f(ix)} x2={f(ix)} y1={-door.leaf} y2={door.leaf} {...faint} />
      <line x1={L} x2={L} y1={-door.leaf} y2={0} {...thin} />
      <line x1={L} x2={f(L + door.leaf)} y1={door.leaf} y2={door.leaf} {...thin} />
      <path d={`M${L} 0A${door.leaf} ${door.leaf} 0 0 1 ${f(L + door.leaf)} ${door.leaf}`} {...faint} />

      {/* Outside: the timber counter along the hatch and five stools */}
      <rect {...rect(hatch.x0 - counter.over, W, hatch.x1 + counter.over, cy1)} {...thin} />
      {stools.x.map((x) => (
        <g key={x}>
          <circle cx={x} cy={f(W + stools.out)} r={stools.r} {...thin} />
          <circle cx={x} cy={f(W + stools.out)} r={f(stools.r * 1.25)} {...faint} />
        </g>
      ))}

      {/* Inside, along the hatch: the work counter, its units under it; the sink's bowl */}
      <rect {...rect(front.x0, fy, front.x1, iy)} {...thin} />
      {front.units.slice(1).map((u) => <line key={u.x0} x1={u.x0} x2={u.x0} y1={f(fy)} y2={f(iy)} {...faint} />)}
      {front.units.filter((u) => u.id === "fridge").map((u) => (
        <rect key={u.x0} {...rect(u.x0 + 0.04, fy + 0.04, u.x1 - 0.04, fy + 0.1)} {...faint} />
      ))}
      {front.units.filter((u) => u.id === "sink").map((u) => (
        <g key={u.x0}>
          <rect {...rect(u.x0 + 0.08, fy + 0.1, u.x1 - 0.08, iy - 0.12)} rx={0.04} {...thin} />
          <circle cx={f((u.x0 + u.x1) / 2)} cy={f(iy - 0.07)} r={0.025} {...thin} />
        </g>
      ))}

      {/* The back bar: its counter, the machines on it, the shelves overhead (dashed), the tall store cupboard */}
      <rect {...rect(back.x0, -iy, back.x1, by)} {...thin} />
      <rect {...rect(back.x0, -iy, back.x1, -iy + back.shelf)} {...dashed} />
      <rect {...rect(back.coffee.x0, -iy + 0.04, back.coffee.x1, by - 0.03)} {...thin} />
      <rect {...rect(back.grinder.x0, -iy + 0.08, back.grinder.x1, -iy + 0.3)} {...thin} />
      <circle cx={f((back.juicer.x0 + back.juicer.x1) / 2)} cy={f(-iy + 0.22)} r={0.13} {...thin} />
      {[0, 1, 2].map((k) => {
        const w = (back.fruit.x1 - back.fruit.x0) / 3
        return <rect key={k} {...rect(back.fruit.x0 + k * w + 0.02, -iy + 0.08, back.fruit.x0 + (k + 1) * w - 0.02, by - 0.06)} {...faint} />
      })}
      <circle cx={f((back.blender.x0 + back.blender.x1) / 2)} cy={f(-iy + 0.22)} r={0.08} {...thin} />
      <rect {...rect(store.x0 + 0.01, -iy, store.x1, -iy + store.d)} {...thin} />
      <path d={`M${f(store.x0 + 0.01)} ${f(-iy)}L${store.x1} ${f(-iy + store.d)}M${store.x1} ${f(-iy)}L${f(store.x0 + 0.01)} ${f(-iy + store.d)}`} {...faint} />

      <text x={f((front.units[1].x0 + front.units[2].x1) / 2)} y={f(fy + 0.36)} textAnchor="middle" style={small}>{name.fridges}</text>
      <text x={f((front.units[3].x0 + front.units[3].x1) / 2)} y={f(fy - 0.08)} textAnchor="middle" style={small}>{name.sink}</text>
      <text x={f((back.coffee.x0 + back.coffee.x1) / 2)} y={f(by + 0.17)} textAnchor="middle" style={small}>{name.coffee}</text>
      <text x={f((back.juicer.x0 + back.fruit.x1) / 2)} y={f(by + 0.17)} textAnchor="middle" style={small}>{name.juice}</text>
      <text x={f((store.x0 + store.x1) / 2)} y={f(-iy + store.d + 0.17)} textAnchor="middle" style={small}>{name.store}</text>
      <text x={f(ix - 0.12)} y={0.04} textAnchor="end" style={small}>{name.door}</text>
      <text x={-1.0} y={0.04} textAnchor="middle" style={label}>{name.bar}</text>
      <text x={0} y={f(cy1 - 0.15)} textAnchor="middle" style={small}>{name.counter}</text>
      <text x={f(deck.x1 - 0.12)} y={f(dy1 - 0.15)} textAnchor="end" style={label}>{name.deck}</text>
      <Dimension x0={-L} x1={L} y={-1.6} />
      <Dimension x0={hatch.x0} x1={hatch.x1} y={f(dy1 + 0.35)} />
      <DimensionUp y0={-W} y1={W} x={-3.45} />
    </svg>
  )
}
