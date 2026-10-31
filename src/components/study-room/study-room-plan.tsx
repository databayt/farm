import { getWords } from "@/components/internationalization/words"
import { Chain, Dim, HDim, Name, Note, VDim } from "@/components/drawing/dims"
import { frame } from "@/components/drawing/geometry"

import room from "./study-room.json"
import { words } from "./words"

// The study room drawn in the pattern of the camp plan (src/components/camp/camp-plan.tsx): thin lines, no colour,
// and its dimensions as the studio's plan sets them (src/components/drawing): along the back wall the screen's end,
// the long table, the reading corner and the bookshelves, named, then the length; the glazing past the deck and its
// step; the box and the deck at the west end; the room's depth and the screen at the east end; the table's width. The glazing faces down the page, toward the viewer of
// the 3D's front view, so the screen wall (east) is on the left and the bookshelf wall (west) on the right.
// Units are metres, the container's centre at 0,0, y toward the glazing. It is long: the viewBox is wide.

const { container: box, room: r, glazing, deck, table, screen, shelves, reading, plants, lights, fans } = room
const thin = { fill: "none", stroke: "currentColor", strokeWidth: 0.75, vectorEffect: "non-scaling-stroke" } as const
const medium = { ...thin, strokeWidth: 1.6 } as const
const faint = { ...thin, strokeWidth: 0.5, strokeOpacity: 0.45 } as const
const dashed = { ...thin, strokeDasharray: "4 3" } as const

const f = (n: number) => +n.toFixed(3)
const rect = (x0: number, y0: number, x1: number, y1: number) => ({ x: f(x0), y: f(y0), width: f(x1 - x0), height: f(y1 - y0) })

const W0 = box.w / 2, front0 = W0 + deck.d, edge0 = front0 + deck.step.d // the deck's edge, then the step's
// the drawing, then its dimensions' reach (studio mm): the names and the length over the back wall, the glazing's name
// past the step, one tier at the east end, two at the west
const { k, viewBox } = frame({ x0: -box.l / 2 - 0.1, y0: -W0 - 0.1, x1: box.l / 2 + 0.1, y1: edge0 }, { top: 19, right: 13, bottom: 14, left: 8 })

// `title` (the drawing's accessible name) defaults to the page's; the docs pass the guide's own.
export async function StudyRoomPlan({ title, className }: { title?: string; className?: string }) {
  const w = await getWords(words)
  const name = w.plan.labels
  title ??= w.plan.title
  const [L, W] = [box.l / 2, box.w / 2]
  const front = W + deck.d
  const [g0, g1] = [-L + glazing.inset, L - glazing.inset]
  const panels = Math.max(2, Math.round((g1 - g0) / glazing.panel))
  const louvres = Array.from({ length: Math.floor((g1 - g0 - 0.15) / glazing.louvres.pitch) + 1 }, (_, k) => f(g0 + 0.15 + k * glazing.louvres.pitch))
  const [lo0, lo1] = glazing.louvres.off
  // the deck's boards run along the room, 140 mm a board
  const boards = Array.from({ length: Math.floor(deck.d / 0.14) }, (_, k) => f(W + (k + 1) * 0.14))
  const st = deck.step
  const { chair } = table
  const [t0, t1] = [table.x - table.l / 2, table.x + table.l / 2]
  const sx0 = r.x1 - shelves.d, bay = (r.front - r.back) / shelves.bays
  return (
    <svg viewBox={viewBox} role="img" aria-label={title} className={className}>
      {/* The stone plinth, the container's steel skin and the lined room inside it; along the front, the
          glazed sliding doors between short steel returns, and the timber louvres standing out in front */}
      <rect {...rect(-L - 0.1, -W - 0.1, L + 0.1, W + 0.1)} {...faint} />
      <path d={`M${f(g0)} ${f(W)}H${-L}V${-W}H${L}V${f(W)}H${f(g1)}`} {...medium} />
      <path d={`M${f(g0)} ${r.front}H${r.x0}V${r.back}H${r.x1}V${r.front}H${f(g1)}`} {...thin} />
      <line x1={f(g0)} x2={f(g1)} y1={f(W - 0.03)} y2={f(W - 0.03)} {...thin} />
      <line x1={f(g0)} x2={f(g1)} y1={f(W - 0.07)} y2={f(W - 0.07)} {...thin} />
      {Array.from({ length: panels + 1 }, (_, k) => f(g0 + ((g1 - g0) * k) / panels)).map((x) => (
        <line key={x} x1={x} x2={x} y1={f(W - 0.1)} y2={f(W)} {...thin} />
      ))}
      {louvres.map((x) => <rect key={x} {...rect(x - glazing.louvres.t / 2, W + lo0, x + glazing.louvres.t / 2, W + lo1)} {...thin} />)}

      {/* The deck, its boards, and the broad step along it */}
      <rect {...rect(-L, W, L, front)} {...medium} />
      {boards.map((y) => <line key={y} x1={-L} x2={L} y1={y} y2={y} {...faint} />)}
      <rect {...rect(-L + st.inset, front, L - st.inset, front + st.d)} {...thin} />

      {/* The screen wall: the big screen flat on the wall, the cabinet under it, the lectern by the aisle */}
      <line x1={f(r.x0 + 0.03)} x2={f(r.x0 + 0.03)} y1={f(screen.y - screen.w / 2)} y2={f(screen.y + screen.w / 2)} {...medium} />
      <rect {...rect(r.x0, screen.y - screen.cabinet.l / 2, r.x0 + screen.cabinet.d, screen.y + screen.cabinet.l / 2)} {...thin} />
      <rect {...rect(screen.lectern.x - screen.lectern.w / 2, screen.lectern.y - screen.lectern.d / 2, screen.lectern.x + screen.lectern.w / 2, screen.lectern.y + screen.lectern.d / 2)} {...thin} />

      {/* The long table down the middle, four chairs along each side facing across it */}
      <rect {...rect(t0, -table.w / 2, t1, table.w / 2)} {...thin} />
      {table.seats.map((dx) => [-1, 1].map((s) => {
        const x = table.x + dx, cy = s * (table.w / 2 + chair.gap + chair.d / 2), back = cy + s * (chair.d / 2 - 0.07)
        return (
          <g key={`${dx}${s}`}>
            <rect {...rect(x - chair.w / 2, cy - chair.d / 2, x + chair.w / 2, cy + chair.d / 2)} rx={0.04} {...thin} />
            <line x1={f(x - chair.w / 2)} x2={f(x + chair.w / 2)} y1={f(back)} y2={f(back)} {...thin} />
          </g>
        )
      }))}

      {/* The bookshelf wall across the west end, its bays */}
      <rect {...rect(sx0, r.back, r.x1, r.front)} {...thin} />
      {Array.from({ length: shelves.bays - 1 }, (_, k) => f(r.back + (k + 1) * bay)).map((y) => (
        <line key={y} x1={f(sx0)} x2={r.x1} y1={y} y2={y} {...thin} />
      ))}
      <line x1={f(sx0 + 0.04)} x2={f(sx0 + 0.04)} y1={r.back} y2={r.front} {...faint} />

      {/* The reading corner: the rug, two armchairs turned toward the glass, the side table and the lamp */}
      <rect {...rect(reading.rug.x[0], reading.rug.y[0], reading.rug.x[1], reading.rug.y[1])} {...faint} />
      <rect {...rect(reading.rug.x[0] + 0.06, reading.rug.y[0] + 0.06, reading.rug.x[1] - 0.06, reading.rug.y[1] - 0.06)} {...faint} />
      {reading.chairs.map(([cx, cy, a]) => {
        const { w, d } = reading.chair
        return (
          <g key={cx} transform={`rotate(${f((-a * 180) / Math.PI)} ${cx} ${cy})`}>
            <rect {...rect(cx - w / 2, cy - d / 2, cx + w / 2, cy + d / 2)} rx={0.1} {...thin} />
            <rect {...rect(cx - w / 2 + 0.13, cy - d / 2 + 0.17, cx + w / 2 - 0.13, cy + d / 2 - 0.04)} rx={0.06} {...thin} />
          </g>
        )
      })}
      <circle cx={reading.table.x} cy={reading.table.y} r={reading.table.r} {...thin} />
      <circle cx={reading.lamp.x} cy={reading.lamp.y} r={0.17} {...thin} />
      <circle cx={reading.lamp.x} cy={reading.lamp.y} r={0.04} {...thin} />

      {/* The plants, and overhead (dashed): the pendants and the two wall fans high on the back wall */}
      {plants.floor.map(([x, y]) => (
        <g key={x}>
          <circle cx={x} cy={y} r={0.2} {...thin} />
          <circle cx={x} cy={y} r={0.11} {...faint} />
        </g>
      ))}
      {lights.pendants.map(([x, y]) => <circle key={`${x}${y}`} cx={x} cy={y} r={0.15} {...dashed} />)}
      {fans.x.map((x) => <circle key={x} cx={x} cy={f(r.back + 0.15)} r={0.18} {...dashed} />)}

      <Note k={k} x={r.x0 + 0.62} y={screen.y} rotate={-90}>{name.screen}</Note>
      <Note k={k} x={table.x} y={0}>{name.seats}</Note>
      <Note k={k} x={reading.table.x} y={reading.rug.y[1] + 0.25}>{name.reading}</Note>
      <Note k={k} x={sx0 - 0.08} y={r.front - 0.12} anchor="end">{name.books}</Note>
      <Name k={k} x={0} y={front - 0.4}>{name.deck}</Name>
      <Note k={k} x={0} y={front + st.d / 2}>{name.step}</Note>

      {/* The back wall: the screen's end, the long table, the reading corner, the bookshelves, named; then the length */}
      <Chain k={k} along="x" at={[r.x0, t0, t1, reading.rug.x[0], sx0, r.x1]} edge={-W} side="top"
        names={[name.screen, name.seats, null, name.reading, name.books]} />
      <HDim k={k} x0={-L} x1={L} y={-W} side="top" at={3} />
      {/* The front, past the deck and its step: the glazing between its steel returns */}
      <Chain k={k} along="x" at={[-L, g0, g1, L]} edge={W} side="bottom" base={(front + st.d - W) / k} names={[null, name.glazing, null]} />
      {/* The west end: the box and the deck, then both */}
      <Chain k={k} along="y" at={[-W, W, front]} edge={L} side="right" overall />
      {/* The east end: the room's depth inside the linings, the screen on its wall */}
      <VDim k={k} y0={r.back} y1={r.front} x={-L} side="left" />
      <VDim k={k} y0={screen.y - screen.w / 2} y1={screen.y + screen.w / 2} x={r.x0} side="right" size={2.2} />
      {/* Inside: the table's width, at its free end */}
      <Dim k={k} a={[t1 + 0.12, -table.w / 2]} b={[t1 + 0.12, table.w / 2]} off={0} size={2.2} />
    </svg>
  )
}
