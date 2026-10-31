import { getWords } from "@/components/internationalization/words"
import { Chain, Dim, HDim, Name, Note, VDim } from "@/components/drawing/dims"
import { frame, mm, tier } from "@/components/drawing/geometry"

import bar from "./bar.json"
import { words } from "./words"

// The bar drawn in the pattern of the camp plan (src/components/camp/camp-plan.tsx): thin lines, no colour, and its
// dimensions as the studio's plan sets them (src/components/drawing): the back wall's chain with its names, the hatch,
// the deck and the overall length on the courtyard side, the depths and the overall width at the west end, the deck's
// and the counter's depths, and the cargo doors' opening inside. The hatch faces down the page, toward the courtyard
// and the viewer of the 3D. Units are metres, the container's centre at 0,0, y toward the hatch.

const { container, hatch, counter, deck, stools, inside } = bar
const thin = { fill: "none", stroke: "currentColor", strokeWidth: 0.75, vectorEffect: "non-scaling-stroke" } as const
const medium = { ...thin, strokeWidth: 1.6 } as const
const faint = { ...thin, strokeWidth: 0.5, strokeOpacity: 0.45 } as const
const dashed = { ...thin, strokeDasharray: "4 3" } as const

const f = (n: number) => +n.toFixed(3)
const rect = (x0: number, y0: number, x1: number, y1: number) => ({ x: f(x0), y: f(y0), width: f(x1 - x0), height: f(y1 - y0) })

const L = container.l / 2, W = container.w / 2, t = container.wall
const [ix, iy] = [L - t, W - t] // the inside faces
const dy1 = W + deck.d // the deck's outer edge
// the drawing, then how far its dimensions reach past it (studio mm): the names over the back wall's chain, the
// three tiers under the deck, two tiers at the west end, and the cargo door's leaf swung open at the east end
const { k, viewBox } = frame({ x0: -L, y0: -W, x1: L + inside.door.leaf, y1: dy1 }, { top: 14, right: 3, bottom: 19, left: 13 })
const under = (dy1 - W) / k // from the courtyard wall down to the deck's edge, in studio mm

// `title` (the drawing's accessible name) defaults to the page's; the docs pass the guide's own.
export async function BarPlan({ title, className }: { title?: string; className?: string }) {
  const w = await getWords(words)
  const name = w.plan.labels
  title ??= w.plan.title
  const { front, back, store, door } = inside
  const fy = iy - front.d, by = -iy + back.d
  const cy1 = W + counter.d
  const flapOut = (hatch.head - hatch.sill) * Math.sin(((180 - hatch.flap.angle) * Math.PI) / 180) // the flap's reach
  // the deck's boards run along the container, 140 mm a board
  const boards = Array.from({ length: Math.floor(deck.d / 0.14) }, (_, n) => f(W + 0.1 + (n + 1) * 0.14))
  return (
    <svg viewBox={viewBox} role="img" aria-label={title} className={className}>
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
      {[0, 1, 2].map((n) => {
        const span = (back.fruit.x1 - back.fruit.x0) / 3
        return <rect key={n} {...rect(back.fruit.x0 + n * span + 0.02, -iy + 0.08, back.fruit.x0 + (n + 1) * span - 0.02, by - 0.06)} {...faint} />
      })}
      <circle cx={f((back.blender.x0 + back.blender.x1) / 2)} cy={f(-iy + 0.22)} r={0.08} {...thin} />
      <rect {...rect(store.x0 + 0.01, -iy, store.x1, -iy + store.d)} {...thin} />
      <path d={`M${f(store.x0 + 0.01)} ${f(-iy)}L${store.x1} ${f(-iy + store.d)}M${store.x1} ${f(-iy)}L${f(store.x0 + 0.01)} ${f(-iy + store.d)}`} {...faint} />

      <Note k={k} x={(front.units[1].x0 + front.units[2].x1) / 2} y={fy + 0.3}>{name.fridges}</Note>
      <Note k={k} x={(front.units[3].x0 + front.units[3].x1) / 2} y={fy - 0.1}>{name.sink}</Note>
      <Note k={k} x={(back.coffee.x0 + back.coffee.x1) / 2} y={by + 0.12}>{name.coffee}</Note>
      <Note k={k} x={(back.juicer.x0 + back.fruit.x1) / 2} y={by + 0.12}>{name.juice}</Note>
      <Note k={k} x={0} y={cy1 - 0.12}>{name.counter}</Note>
      <Name k={k} x={deck.x1 - 0.15} y={dy1 - 0.15} anchor="end">{name.deck}</Name>

      {/* The back wall: its chain inside, named as the studio's zones */}
      <Chain k={k} along="x" at={[-ix, store.x1, back.x1, ix]} edge={-W} side="top" names={[name.store, name.backBar, name.wayIn]} />
      {/* The courtyard side, under the deck: the hatch, the deck's width, then the overall length */}
      <Dim k={k} a={[hatch.x0, W]} b={[hatch.x1, W]} off={under + tier(1)} label={`${name.hatch} ${mm(hatch.x1 - hatch.x0)}`} />
      <HDim k={k} x0={deck.x0} x1={deck.x1} y={dy1} side="bottom" at={2} />
      <Dim k={k} a={[-L, W]} b={[L, W]} off={under + tier(3)} />
      {/* The west end: the back bar, the aisle and the work counter, then the overall width */}
      <Chain k={k} along="y" at={[-iy, by, fy, iy]} edge={-L} side="left" />
      <VDim k={k} y0={-W} y1={W} x={-L} side="left" at={2} />
      {/* The deck's depth and the outside counter's, and the cargo doors' opening, inside */}
      <VDim k={k} y0={W} y1={dy1} x={deck.x1} side="right" />
      <VDim k={k} y0={W} y1={cy1} x={hatch.x1 + counter.over} side="right" size={2.2} />
      <VDim k={k} y0={-door.leaf} y1={door.leaf} x={ix} side="left" prefix={name.doors} size={2.2} />
    </svg>
  )
}
