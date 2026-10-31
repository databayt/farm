import { getWords } from "@/components/internationalization/words"
import { Chain, HDim, Name, Note, VDim } from "@/components/drawing/dims"
import { frame } from "@/components/drawing/geometry"

import bar from "./bar.json"
import { words } from "./words"

// The bar drawn in the pattern of the camp plan (src/components/camp/camp-plan.tsx): thin lines, no colour, and its
// dimensions as the studio's plan sets them (src/components/drawing): the back wall's chain with its names; under the
// step, the deck's chain (a lounge at each end, the hatch between) named as the studio's zones, the deck's length and
// the box's; at the west end the inside's chain and the lounge's across the deck, then the overall width and the
// deck's depth; the step and the cargo doors' opening. The hatch faces down the page, toward the courtyard and the
// viewer of the 3D. Units are metres, the container's centre at 0,0, y toward the hatch (D-065).

const { container, hatch, ledge, deck, lounge, inside } = bar
const thin = { fill: "none", stroke: "currentColor", strokeWidth: 0.75, vectorEffect: "non-scaling-stroke" } as const
const medium = { ...thin, strokeWidth: 1.6 } as const
const faint = { ...thin, strokeWidth: 0.5, strokeOpacity: 0.45 } as const
const dashed = { ...thin, strokeDasharray: "4 3" } as const
const solid = { ...thin, fill: "var(--background)" } as const // the furniture hides the deck's boards under it

const f = (n: number) => +n.toFixed(3)
const rect = (x0: number, y0: number, x1: number, y1: number) => ({ x: f(x0), y: f(y0), width: f(x1 - x0), height: f(y1 - y0) })

const L = container.l / 2, W = container.w / 2, t = container.wall
const [ix, iy] = [L - t, W - t] // the inside faces
const { step } = deck
const dy1 = W + deck.d, sy1 = dy1 + step.d // the deck's outer edge, the step's
// the lounge across the deck: the chairs' backs and fronts, the tables' near and far edges; a chair's arms and back
const { chair, table } = lounge
const cy0 = W + 0.1 + lounge.wall, cy1 = cy0 + chair.d
const ty0 = cy1 + table.off, ty1 = ty0 + 2 * table.r
const ARM = 0.08, BACK = 0.14
// the drawing, then how far its dimensions reach past it (studio mm): the names over the back wall's chain, the
// deck's chain with its names and the two lengths under the step, two tiers at the west end, and the cargo door's
// leaf swung open at the east end
const { k, viewBox } = frame({ x0: -L, y0: -W, x1: L + inside.door.leaf, y1: sy1 }, { top: 14, right: 3, bottom: 25, left: 13 })

// `title` (the drawing's accessible name) defaults to the page's; the docs pass the guide's own.
export async function BarPlan({ title, className }: { title?: string; className?: string }) {
  const w = await getWords(words)
  const name = w.plan.labels
  title ??= w.plan.title
  const { front, back, store, door } = inside
  const fy = iy - front.d, by = -iy + back.d
  const flapOut = (hatch.head - hatch.sill) * Math.sin(((180 - hatch.flap.angle) * Math.PI) / 180) // the flap's reach
  const mid = (hatch.x0 + hatch.x1) / 2
  // the deck's boards run along the container, 140 mm a board
  const boards = Array.from({ length: Math.floor(deck.d / 0.14) }, (_, n) => f(W + 0.1 + (n + 1) * 0.14))
  return (
    <svg viewBox={viewBox} role="img" aria-label={title} className={className}>
      {/* The plinth, a stone course 100 mm proud of the box all round, the deck along the courtyard side and its step */}
      <rect {...rect(-L - 0.1, -W - 0.1, L + 0.1, W + 0.1)} {...faint} />
      <rect {...rect(deck.x0, W + 0.1, deck.x1, dy1)} {...medium} />
      {boards.map((y) => <line key={y} x1={deck.x0} x2={deck.x1} y1={y} y2={y} {...faint} />)}
      <rect {...rect(step.x0, dy1, step.x1, sy1)} {...thin} />

      {/* The steel box: its walls, the hatch open in the courtyard wall, the flap propped out over the ledge (dashed,
          overhead), the cargo doors at the north end with the right leaf swung open */}
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

      {/* Outside: today's steel ledge under the hatch, and at each end of the deck the lounge: two deep chairs, their
          backs to the box, and a low table in front of them */}
      <rect {...rect(hatch.x0, W, hatch.x1, W + ledge.d)} {...thin} />
      {lounge.pairs.map((cx) => (
        <g key={cx}>
          {[cx - lounge.gap / 2 - chair.w, cx + lounge.gap / 2].map((x0) => (
            <g key={x0}>
              <rect {...rect(x0, cy0, x0 + chair.w, cy1)} rx={0.04} {...solid} />
              <path d={`M${f(x0 + ARM)} ${f(cy1)}V${f(cy0 + BACK)}H${f(x0 + chair.w - ARM)}V${f(cy1)}`} {...faint} />
            </g>
          ))}
          <circle cx={cx} cy={f(ty0 + table.r)} r={table.r} {...solid} />
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

      {/* The back bar: its counter, the coffee machine and grinder on it, the shelves overhead (dashed), the tall store
          cupboard */}
      <rect {...rect(back.x0, -iy, back.x1, by)} {...thin} />
      <rect {...rect(back.x0, -iy, back.x1, -iy + back.shelf)} {...dashed} />
      <rect {...rect(back.coffee.x0, -iy + 0.04, back.coffee.x1, by - 0.03)} {...thin} />
      <rect {...rect(back.grinder.x0, -iy + 0.08, back.grinder.x1, -iy + 0.3)} {...thin} />
      <rect {...rect(store.x0 + 0.01, -iy, store.x1, -iy + store.d)} {...thin} />
      <path d={`M${f(store.x0 + 0.01)} ${f(-iy)}L${store.x1} ${f(-iy + store.d)}M${store.x1} ${f(-iy)}L${f(store.x0 + 0.01)} ${f(-iy + store.d)}`} {...faint} />

      <Note k={k} x={(front.units[1].x0 + front.units[2].x1) / 2} y={fy + 0.3}>{name.fridges}</Note>
      <Note k={k} x={(front.units[3].x0 + front.units[3].x1) / 2} y={fy - 0.1}>{name.sink}</Note>
      <Note k={k} x={(back.coffee.x0 + back.coffee.x1) / 2} y={by + 0.12}>{name.coffee}</Note>
      <Note k={k} x={mid} y={W + ledge.d / 2}>{name.ledge}</Note>
      <Note k={k} x={mid} y={dy1 + step.d / 2}>{name.step}</Note>
      <Name k={k} x={mid} y={(W + flapOut + dy1) / 2}>{name.deck}</Name>

      {/* The back wall: its chain inside, named as the studio's zones */}
      <Chain k={k} along="x" at={[-ix, store.x1, back.x1, ix]} edge={-W} side="top" names={[name.store, name.backBar, name.wayIn]} />
      {/* The courtyard side, under the step: the deck's chain, a lounge at each end and the hatch between, its length,
          then the box's */}
      <Chain k={k} along="x" at={[deck.x0, step.x0, step.x1, deck.x1]} edge={dy1} side="bottom" base={step.d / k}
        names={[name.lounge, name.hatch, name.lounge]} overall />
      <HDim k={k} x0={-L} x1={L} y={W} side="bottom" at={4} base={(sy1 - W) / k} />
      {/* The west end: the back bar, the aisle and the work counter, and across the deck the lounge's chairs and
          table; then the overall width and the deck's depth */}
      <Chain k={k} along="y" at={[-iy, by, fy, iy]} edge={-L} side="left" />
      <Chain k={k} along="y" at={[W, cy0, cy1, ty0, ty1, dy1]} edge={-L} side="left" overall={2} />
      <VDim k={k} y0={-W} y1={W} x={-L} side="left" at={2} />
      {/* The step's depth, and the cargo doors' opening, inside */}
      <VDim k={k} y0={dy1} y1={sy1} x={step.x1} side="right" />
      <VDim k={k} y0={-door.leaf} y1={door.leaf} x={ix} side="left" prefix={name.doors} size={2.2} />
    </svg>
  )
}
