import room from "./study-room.json"

// The study room drawn in the pattern of the camp plan (src/components/camp/camp-plan.tsx): thin lines, no
// colour, bold capitals and dimensions in millimetres. The glazing faces down the page, toward the viewer of
// the 3D's front view, so the screen wall (east) is on the left and the bookshelf wall (west) on the right.
// Units are metres, the container's centre at 0,0, y toward the glazing. It is long: the viewBox is wide.

const { container: box, room: r, glazing, deck, desks, screen, shelves, reading, plants, lights, ac } = room
const thin = { fill: "none", stroke: "currentColor", strokeWidth: 0.75, vectorEffect: "non-scaling-stroke" } as const
const medium = { ...thin, strokeWidth: 1.6 } as const
const faint = { ...thin, strokeWidth: 0.5, strokeOpacity: 0.45 } as const
const dashed = { ...thin, strokeDasharray: "4 3" } as const
const label = {
  fontFamily: "var(--font-sans), ui-sans-serif, system-ui, sans-serif",
  fontSize: 0.19,
  fontWeight: 700,
  letterSpacing: "0.04em",
  fill: "currentColor",
} as const
const small = { ...label, fontSize: 0.14, fontWeight: 600 } as const

const f = (n: number) => +n.toFixed(3)
const mm = (m: number) => Math.round(m * 1000).toLocaleString("en-US")
const rect = (x0: number, y0: number, x1: number, y1: number) => ({ x: f(x0), y: f(y0), width: f(x1 - x0), height: f(y1 - y0) })

function Dimension({ x0, x1, y }: { x0: number; x1: number; y: number }) {
  const tick = 0.08
  return (
    <g>
      <line x1={x0} x2={x1} y1={y} y2={y} {...thin} />
      {[x0, x1].map((x) => <line key={x} x1={f(x - tick)} x2={f(x + tick)} y1={f(y + tick)} y2={f(y - tick)} {...thin} />)}
      <text x={f((x0 + x1) / 2)} y={f(y - 0.1)} textAnchor="middle" style={small}>{mm(x1 - x0)}</text>
    </g>
  )
}
// the same, standing up: the text turned to read from the right
function Upright({ y0, y1, x }: { y0: number; y1: number; x: number }) {
  const tick = 0.08, cy = f((y0 + y1) / 2)
  return (
    <g>
      <line x1={x} x2={x} y1={y0} y2={y1} {...thin} />
      {[y0, y1].map((y) => <line key={y} x1={f(x - tick)} x2={f(x + tick)} y1={f(y + tick)} y2={f(y - tick)} {...thin} />)}
      <text x={f(x + 0.1)} y={cy} textAnchor="middle" transform={`rotate(-90 ${f(x + 0.1)} ${cy})`} style={small}>{mm(y1 - y0)}</text>
    </g>
  )
}

export function StudyRoomPlan({ title, className }: { title: string; className?: string }) {
  const [L, W] = [box.l / 2, box.w / 2]
  const front = W + deck.d
  const [g0, g1] = [-L + glazing.inset, L - glazing.inset]
  const panels = Math.max(2, Math.round((g1 - g0) / glazing.panel))
  const louvres = Array.from({ length: Math.floor((g1 - g0 - 0.15) / glazing.louvres.pitch) + 1 }, (_, k) => f(g0 + 0.15 + k * glazing.louvres.pitch))
  const [lo0, lo1] = glazing.louvres.off
  // the deck's boards run along the room, 140 mm a board
  const boards = Array.from({ length: Math.floor(deck.d / 0.14) }, (_, k) => f(W + (k + 1) * 0.14))
  const st = deck.step
  const { chair } = desks
  const sx0 = r.x1 - shelves.d, bay = (r.front - r.back) / shelves.bays
  const scr = screen.panel
  return (
    <svg viewBox="-6.75 -2.05 13.5 6.55" role="img" aria-label={title} className={className}>
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

      {/* The screen wall: the screen on its slatted panel, the cabinet under it, the whiteboard on the back
          wall, the lectern by the aisle */}
      <rect {...rect(r.x0, scr[0], r.x0 + 0.04, scr[1])} {...thin} />
      <line x1={f(r.x0 + 0.07)} x2={f(r.x0 + 0.07)} y1={f((scr[0] + scr[1]) / 2 - screen.w / 2)} y2={f((scr[0] + scr[1]) / 2 + screen.w / 2)} {...medium} />
      <rect {...rect(r.x0, (scr[0] + scr[1]) / 2 - screen.cabinet.l / 2, r.x0 + screen.cabinet.d, (scr[0] + scr[1]) / 2 + screen.cabinet.l / 2)} {...thin} />
      <line x1={screen.whiteboard.x[0]} x2={screen.whiteboard.x[1]} y1={f(r.back + 0.03)} y2={f(r.back + 0.03)} {...medium} />
      <rect {...rect(screen.lectern.x - screen.lectern.w / 2, screen.lectern.y - screen.lectern.d / 2, screen.lectern.x + screen.lectern.w / 2, screen.lectern.y + screen.lectern.d / 2)} {...thin} />

      {/* Six desks against the back wall, two chairs at each facing the screen; the aisle runs along the glass */}
      {desks.x.map((x) => (
        <g key={x}>
          <rect {...rect(x - desks.w / 2, r.back, x + desks.w / 2, r.back + desks.l)} {...thin} />
          {desks.seats.map((y) => {
            const cx = x + desks.w / 2 + chair.gap + chair.d / 2
            return (
              <g key={y}>
                <rect {...rect(cx - chair.d / 2, y - chair.w / 2, cx + chair.d / 2, y + chair.w / 2)} rx={0.04} {...thin} />
                <line x1={f(cx + chair.d / 2 - 0.07)} x2={f(cx + chair.d / 2 - 0.07)} y1={f(y - chair.w / 2)} y2={f(y + chair.w / 2)} {...thin} />
              </g>
            )
          })}
        </g>
      ))}

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

      {/* The plants, and overhead (dashed): the pendants, the air conditioner high on the back wall, the fan */}
      {plants.floor.map(([x, y]) => (
        <g key={x}>
          <circle cx={x} cy={y} r={0.2} {...thin} />
          <circle cx={x} cy={y} r={0.11} {...faint} />
        </g>
      ))}
      {lights.pendants.map(([x, y]) => <circle key={`${x}${y}`} cx={x} cy={y} r={0.15} {...dashed} />)}
      <rect {...rect(ac.x - ac.w / 2, r.back, ac.x + ac.w / 2, r.back + 0.22)} {...dashed} />
      <circle cx={ac.fan.x} cy={f(r.back + 0.15)} r={0.18} {...dashed} />

      <text x={f(r.x0 + 0.62)} y={f((scr[0] + scr[1]) / 2)} textAnchor="middle" transform={`rotate(-90 ${f(r.x0 + 0.62)} ${f((scr[0] + scr[1]) / 2)})`} style={small}>SCREEN</text>
      <text x={f((desks.x[2] + desks.x[3]) / 2 + 0.3)} y={f(r.front - 0.25)} textAnchor="middle" style={small}>12 SEATS</text>
      <text x={f(reading.table.x)} y={f(reading.rug.y[1] + 0.27)} textAnchor="middle" style={small}>READING</text>
      <text x={f(sx0 - 0.08)} y={f(r.front - 0.1)} textAnchor="end" style={small}>BOOKS</text>
      <text x={0} y={-1.45} textAnchor="middle" style={label}>STUDY ROOM</text>
      <text x={0} y={f(W + lo1 + 0.3)} textAnchor="middle" style={small}>GLAZED DOORS BEHIND LOUVRES</text>
      <text x={0} y={f(front - 0.4)} textAnchor="middle" style={label}>DECK</text>
      <text x={0} y={f(front + st.d - 0.12)} textAnchor="middle" style={small}>STEP</text>
      <Dimension x0={-L} x1={L} y={-1.8} />
      <Upright y0={-W} y1={W} x={f(L + 0.35)} />
      <Upright y0={W} y1={front} x={f(L + 0.35)} />
    </svg>
  )
}
