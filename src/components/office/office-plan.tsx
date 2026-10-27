import office from "./office.json"

// The office drawn in the pattern of the camp plan (src/components/camp/camp-plan.tsx): thin lines, no
// colour, bold capitals and dimensions in millimetres. Seen from the deck, as the 3D's front view: the deck
// and the glazing face down the page (north), the stair end to the left. Units are metres, x from the stair
// end, y toward the deck, the container's centre line at y = 0.

const { container: box, glazing, deck, meeting, reception, desk, shelves, printer, screen, ac, fan, plants } = office
const thin = { fill: "none", stroke: "currentColor", strokeWidth: 0.75, vectorEffect: "non-scaling-stroke" } as const
const medium = { ...thin, strokeWidth: 1.6 } as const
const faint = { ...thin, strokeWidth: 0.5, strokeOpacity: 0.45 } as const
const dashed = { ...thin, strokeDasharray: "4 3" } as const
const label = {
  fontFamily: "var(--font-sans), ui-sans-serif, system-ui, sans-serif",
  fontSize: 0.15,
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
// the same, standing: the figure reads up the page beside the line
function Rise({ y0, y1, x }: { y0: number; y1: number; x: number }) {
  const tick = 0.06, my = f((y0 + y1) / 2)
  return (
    <g>
      <line x1={x} x2={x} y1={y0} y2={y1} {...thin} />
      {[y0, y1].map((y) => <line key={y} x1={f(x - tick)} x2={f(x + tick)} y1={f(y + tick)} y2={f(y - tick)} {...thin} />)}
      <text x={f(x + 0.08)} y={my} transform={`rotate(-90 ${f(x + 0.08)} ${my})`} textAnchor="middle" style={small}>{mm(y1 - y0)}</text>
    </g>
  )
}

// an office chair from above: a seat, its back to one side (toward: the way the sitter faces)
function Chair({ x, y, toward, s = 0.5 }: { x: number; y: number; toward: "up" | "down" | "left" | "right"; s?: number }) {
  const h = s / 2, b = 0.08
  const back = { up: rect(x - h, y + h - b, x + h, y + h), down: rect(x - h, y - h, x + h, y - h + b),
    left: rect(x + h - b, y - h, x + h, y + h), right: rect(x - h, y - h, x - h + b, y + h) }[toward]
  return (
    <g>
      <rect {...rect(x - h, y - h, x + h, y + h)} rx={0.06} {...thin} />
      <rect {...back} {...thin} />
    </g>
  )
}

export function OfficePlan({ title, className }: { title: string; className?: string }) {
  const L = box.l, H = box.w / 2
  const { x0: ix0, x1: ix1, y0: iy0, y1: iy1 } = box.inner
  const front = H, edge = H + deck.d, rail = edge - 0.04
  const st = deck.stair, steps = st.risers - 1, sx = -steps * st.tread
  const { x0: g0, x1: g1, panels } = glazing
  const pw = (g1 - g0) / panels
  const boards = Array.from({ length: Math.ceil(L / 0.146) }, (_, k) => f(k * 0.146))
  return (
    <svg viewBox="-1.75 -2.05 8.5 5.75" role="img" aria-label={title} className={className}>
      {/* The steel box with its lining, the glazing open in the front wall, the cargo doors at the stair end */}
      <path d={`M${g0} ${front}H0V${-H}H${L}V${front}H${g1}`} {...medium} />
      <path d={`M${g0} ${iy1}H${ix0}V${iy0}H${ix1}V${iy1}H${g1}`} {...thin} />
      {[g0, g1].map((x) => <line key={x} x1={x} x2={x} y1={iy1} y2={front} {...thin} />)}
      {/* four sliding panels on two tracks; the middle two slid open behind the outer ones */}
      {Array.from({ length: panels }, (_, k) => {
        const x = k === 1 ? g0 + pw * 0.15 : k === 2 ? g1 - pw * 1.15 : g0 + k * pw
        const y = k === 0 || k === 3 ? front - 0.03 : front - 0.08
        return <line key={k} x1={f(x)} x2={f(x + pw)} y1={f(y)} y2={f(y)} {...medium} strokeWidth={1.1} />
      })}
      <line x1={0.04} x2={0.04} y1={-H + 0.25} y2={H - 0.25} {...dashed} />

      {/* The deck on its frame: boards across the front, the railings round its three open sides, the stair
          down off the front corner at the cargo-door end */}
      <rect {...rect(0, front, L, edge)} {...medium} />
      {boards.map((x) => <line key={x} x1={x} x2={x} y1={f(front)} y2={f(edge)} {...faint} />)}
      <path d={`M0.04 ${f(front)}V${f(edge - st.w)}M0.04 ${f(rail)}H${f(L - 0.04)}V${f(front)}`} {...dashed} />
      <rect {...rect(sx, edge - st.w, 0, edge)} {...thin} />
      {Array.from({ length: steps - 1 }, (_, k) => <line key={k} x1={f(sx + (k + 1) * st.tread)} x2={f(sx + (k + 1) * st.tread)} y1={f(edge - st.w)} y2={f(edge)} {...thin} />)}

      {/* The meeting table for four, the screen over it on the end wall, the AC on the back wall, the plant */}
      <circle cx={meeting.x} cy={meeting.y} r={meeting.r} {...thin} />
      {meeting.chairs.map(([x, y]) => (
        <Chair key={`${x}${y}`} x={x} y={y} s={meeting.chair.w}
          toward={x < meeting.x - 0.1 ? "right" : x > meeting.x + 0.1 ? "left" : y < meeting.y ? "down" : "up"} />
      ))}
      <rect {...rect(ix0, screen.y - screen.w / 2, ix0 + 0.05, screen.y + screen.w / 2)} {...thin} />
      <rect {...rect(ac.x0, iy0, ac.x1, iy0 + ac.d)} {...dashed} />
      <circle cx={plants.floor[0]} cy={plants.floor[1]} r={0.17} {...thin} />
      <circle cx={plants.floor[0]} cy={plants.floor[1]} r={0.1} {...faint} />

      {/* The filing wall along the back, the reception desk facing the glazing with its chair behind */}
      <rect {...rect(shelves.x0, iy0, shelves.x1, iy0 + shelves.d)} {...thin} />
      {Array.from({ length: 3 }, (_, k) => {
        const x = shelves.x0 + ((k + 1) * (shelves.x1 - shelves.x0)) / 4
        return <line key={k} x1={f(x)} x2={f(x)} y1={iy0} y2={f(iy0 + shelves.d)} {...faint} />
      })}
      <rect {...rect(reception.x0, reception.y0, reception.x1, reception.y1)} {...thin} />
      <line x1={reception.x0} x2={reception.x1} y1={f(reception.y1 - 0.04)} y2={f(reception.y1 - 0.04)} {...faint} />
      <rect {...rect((reception.x0 + reception.x1) / 2 - 0.27, reception.y0 + 0.1, (reception.x0 + reception.x1) / 2 + 0.27, reception.y0 + 0.16)} {...thin} />
      <Chair x={reception.chair[0]} y={reception.chair[1]} toward="up" />

      {/* The second desk on the far end wall, its chair facing the wall, the fan over it; the printer cabinet */}
      <rect {...rect(desk.x0, desk.y0, desk.x1, desk.y1)} {...thin} />
      <rect {...rect(desk.x1 - 0.2, (desk.y0 + desk.y1) / 2 - 0.27, desk.x1 - 0.14, (desk.y0 + desk.y1) / 2 + 0.27)} {...thin} />
      <Chair x={desk.chair[0]} y={desk.chair[1]} toward="right" />
      <circle cx={f(ix1 - 0.12)} cy={fan.y} r={0.1} {...dashed} />
      <rect {...rect(printer.x0, printer.y0, printer.x1, printer.y1)} {...thin} />
      <rect {...rect(printer.x0 + 0.06, printer.y0 + 0.1, printer.x1 - 0.06, printer.y1 - 0.1)} {...faint} />

      <text x={f((shelves.x0 + shelves.x1) / 2)} y={f(iy0 + shelves.d / 2 + 0.035)} textAnchor="middle" style={small}>FILING</text>
      <text x={f((reception.x0 + reception.x1) / 2)} y={f(reception.y1 - 0.15)} textAnchor="middle" style={small}>RECEPTION</text>
      <text x={meeting.x} y={f(meeting.y + 0.035)} textAnchor="middle" style={small}>MEETING</text>
      <text x={f((desk.x0 + desk.x1) / 2)} y={f(desk.y0 + 0.2)} textAnchor="middle" style={small}>DESK</text>
      <text x={f((printer.x0 + printer.x1) / 2)} y={f((printer.y0 + printer.y1) / 2 + 0.035)} textAnchor="middle" style={small}>PRINT</text>
      <text x={f(ac.x1 + 0.08)} y={f(iy0 + 0.15)} style={small}>AC</text>
      <text x={f(ix0 + 0.1)} y={f(screen.y + screen.w / 2 + 0.14)} style={small}>SCREEN</text>
      <text x={f((g0 + g1) / 2)} y={f(front - 0.16)} textAnchor="middle" style={small}>SLIDING GLAZING</text>
      <text x={f(L / 2)} y={f(edge - 0.55)} textAnchor="middle" style={label}>DECK</text>
      <text x={f(sx + (-sx) / 2)} y={f(edge - st.w - 0.1)} textAnchor="middle" style={small}>STAIR</text>
      <text x={f(L + 0.12)} y={f(-H + 0.3)} style={label}>OFFICE</text>
      <text x={-0.12} y={f(-0.3)} textAnchor="end" style={small}>CARGO</text>
      <text x={-0.12} y={f(-0.16)} textAnchor="end" style={small}>DOORS</text>
      <Dimension x0={0} x1={L} y={-H - 0.45} />
      <Dimension x0={g0} x1={g1} y={edge + 0.4} />
      <Rise y0={-H} y1={front} x={L + 0.45} />
      <Rise y0={front} y1={edge} x={L + 0.45} />
    </svg>
  )
}
