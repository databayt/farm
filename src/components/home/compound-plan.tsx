import compound from "./compound.json"

// The compound drawn in the pattern of the studio's plan (/en/studio, render/plan.svg): solid black
// container walls, thin lines for everything else, bold capitals beside each building and dimensions in
// millimetres, no colour, no surroundings. The founder reads it turned 180° from compound.json's
// north-up frame (D-022): the study room at the top, the gates at the bottom. Units are metres.

type Box = readonly number[]
type Point = readonly number[]
type Unit = (typeof compound.units)[number]

// Flip the north-up layout top to bottom inside a 46 m square (study room at the top, gates at the
// bottom, guest rooms and bar on the left), then spread it sideways for a wide screen: positions move
// apart across the drawing, every building keeps its size.
const SIZE = 46
const { factor: SPREAD, mid: MID } = compound.spread
const X = (x: number) => MID + (x - MID) * SPREAD
const P = ([x, y]: Point) => [X(x), SIZE - y]
const B = ([x0, y0, x1, y1]: Box) => {
  const shift = X((x0 + x1) / 2) - (x0 + x1) / 2
  return [x0 + shift, SIZE - y1, x1 + shift, SIZE - y0]
}
const VIEW = [-8, 0.6, 51.5, 55.5]

const WALL = 0.14 // a container wall at drawing scale, solid as the studio's walls
const thin = { fill: "none", stroke: "currentColor", strokeWidth: 0.75, vectorEffect: "non-scaling-stroke" } as const
const medium = { ...thin, strokeWidth: 1.2 } as const
const wall = { fill: "none", stroke: "currentColor", strokeWidth: WALL, strokeLinejoin: "miter" } as const
// The page colour knocks openings out of a wall.
const PAGE = "var(--background)"
const label = {
  fontFamily: "var(--font-sans), ui-sans-serif, system-ui, sans-serif",
  fontSize: 0.6,
  fontWeight: 700,
  letterSpacing: "0.04em",
  fill: "currentColor",
} as const
const small = { ...label, fontSize: 0.5, fontWeight: 600 } as const

const f = (n: number) => +n.toFixed(3)
const mm = (m: number) => Math.round(m * 1000).toLocaleString("en-US")
const at = ([x0, y0, x1, y1]: Box) => ({ x: f(x0), y: f(y0), width: f(x1 - x0), height: f(y1 - y0) })

// An opening in a wall: the wall knocked out between two points.
function Gap({ a, b }: { a: Point; b: Point }) {
  return <line x1={a[0]} y1={a[1]} x2={b[0]} y2={b[1]} stroke={PAGE} strokeWidth={WALL + 0.12} />
}

// A window or glass wall: the gap with a thin glazing line across it.
function Glazing({ a, b }: { a: Point; b: Point }) {
  return (
    <g>
      <Gap a={a} b={b} />
      <line x1={a[0]} y1={a[1]} x2={b[0]} y2={b[1]} {...thin} />
    </g>
  )
}

// A door: the gap, the leaf open into the room and its swing dashed.
function Door({ hinge: [hx, hy], along: [ax, ay], into: [ix, iy], width: w }: {
  hinge: Point
  along: Point
  into: Point
  width: number
}) {
  const end = [f(hx + ax * w), f(hy + ay * w)]
  const [lx, ly] = [f(hx + ix * w), f(hy + iy * w)]
  const sweep = ix * ay - iy * ax > 0 ? 1 : 0
  return (
    <g>
      <Gap a={[hx, hy]} b={end} />
      <path d={`M${hx} ${hy}L${lx} ${ly}`} {...thin} />
      <path d={`M${lx} ${ly}A${w} ${w} 0 0 ${sweep} ${end[0]} ${end[1]}`} {...thin} strokeDasharray="3 3" />
    </g>
  )
}

// A gate, simply: its two posts and the gate closed between them.
function Gate({ x: [left, right], y, post }: { x: Point; y: number; post: number }) {
  return (
    <g>
      {[left - post, right].map((x) => (
        <rect key={x} {...at([x, y - post / 2, x + post, y + post / 2])} fill="currentColor" />
      ))}
      <line x1={left} x2={right} y1={y} y2={y} {...medium} />
    </g>
  )
}

// A dimension: extension lines, a line with oblique ticks, the value on it, as the studio plan does.
function Dimension({ a, b, offset }: { a: Point; b: Point; offset: number }) {
  const vertical = a[0] === b[0]
  const [dx, dy] = vertical ? [offset, 0] : [0, offset]
  const [sx, sy] = [Math.sign(dx), Math.sign(dy)]
  const [ax, ay, bx, by] = [f(a[0] + dx), f(a[1] + dy), f(b[0] + dx), f(b[1] + dy)]
  const tick = (x: number, y: number) => `M${f(x - 0.3)} ${f(y + 0.3)}L${f(x + 0.3)} ${f(y - 0.3)}`
  const [mx, my] = [f((ax + bx) / 2), f((ay + by) / 2)]
  return (
    <g>
      <path
        d={`M${f(a[0] + sx * 0.3)} ${f(a[1] + sy * 0.3)}L${f(ax + sx * 0.4)} ${f(ay + sy * 0.4)}M${f(b[0] + sx * 0.3)} ${f(b[1] + sy * 0.3)}L${f(bx + sx * 0.4)} ${f(by + sy * 0.4)}`}
        {...thin}
      />
      <path d={`M${ax} ${ay}L${bx} ${by}${tick(ax, ay)}${tick(bx, by)}`} {...thin} />
      <text
        x={mx}
        y={my}
        textAnchor="middle"
        dominantBaseline="central"
        transform={vertical ? `rotate(90 ${mx} ${my})` : undefined}
        style={{ ...small, fontWeight: 500, stroke: PAGE, strokeWidth: 0.6, paintOrder: "stroke" }}
      >
        {mm(vertical ? Math.abs(b[1] - a[1]) : Math.abs(b[0] - a[0]))}
      </text>
    </g>
  )
}

// The joined guest-room pair, its doors and windows onto the veranda on the courtyard side (right).
function GuestRooms({ unit }: { unit: Unit }) {
  const [x0, y0, x1, y1] = B(unit.box)
  const n = unit.rooms ?? 3
  const room = (y1 - y0) / n
  const v = unit.veranda ?? 1.5
  return (
    <g>
      <rect {...at([x1, y0, x1 + v, y1])} {...thin} />
      <rect {...at([x0, y0, x1, y1])} {...wall} />
      {Array.from({ length: n }, (_, k) => f(y0 + k * room)).map((y, k) => (
        <g key={y}>
          {k ? <line x1={x0} x2={x1} y1={y} y2={y} stroke="currentColor" strokeWidth={WALL * 0.7} /> : null}
          <Door hinge={[x1, f(y + 0.6)]} along={[0, 1]} into={[-1, 0]} width={0.9} />
          <Glazing a={[x1, f(y + 2.2)]} b={[x1, f(y + 3.4)]} />
        </g>
      ))}
      <Dimension a={[x0, y0]} b={[x0, y1]} offset={-1.2} />
      <Dimension a={[x0, y0]} b={[x1, y0]} offset={-1.2} />
      <text x={f(x0 - 2.9)} y={f((y0 + y1) / 2)} textAnchor="middle" transform={`rotate(-90 ${f(x0 - 2.9)} ${f((y0 + y1) / 2)})`} style={label}>
        {unit.label}
      </text>
    </g>
  )
}

// The bar, in line with the guest rooms: its serving hatch and counter on the courtyard side.
function Bar({ unit, east }: { unit: Unit; east: number }) {
  // flush with the guest rooms' courtyard side after the spread, as on the layout
  const [a, y0, b, y1] = B(unit.box)
  const [x0, x1] = [east - (b - a), east]
  const [h0, h1] = (unit.hatch ?? [0, 0]).map((y) => SIZE - y).sort((a, b) => a - b)
  return (
    <g>
      <rect {...at([x0, y0, x1, y1])} {...wall} />
      <Gap a={[x1, h0]} b={[x1, h1]} />
      <rect {...at([x1, h0, x1 + 0.4, h1])} {...thin} />
      <text x={f(x0 - 0.7)} y={f((y0 + y1) / 2 + 0.32)} textAnchor="end" style={label}>
        {unit.label}
      </text>
    </g>
  )
}

// A 20 ft container on a raised deck facing the courtyard (down the drawing), steps at the middle.
// Studios have a 3 m glass wall, a dashed roof terrace overhead and a stair at their end; the office
// a glazed door and a window.
function RowUnit({ unit, dimension }: { unit: Unit; dimension?: boolean }) {
  const [x0, y0, x1, y1] = B(unit.box)
  const deck = unit.deck ?? 1.5
  const cx = f((x0 + x1) / 2)
  const edge = f(y1 + deck)
  return (
    <g>
      <rect {...at([x0, y1, x1, edge])} {...thin} />
      <path d={`M${f(cx - 0.6)} ${edge}H${x0}V${y1}M${f(cx + 0.6)} ${edge}H${x1}V${y1}`} {...medium} />
      <rect {...at([x0, y0, x1, y1])} {...wall} />
      {unit.terrace ? (
        <>
          <Glazing a={[f(cx - 1.5), y1]} b={[f(cx + 1.5), y1]} />
          <rect {...at([x1, y0 + 0.15, x1 + 0.75, y1 - 0.15])} {...thin} />
        </>
      ) : (
        <>
          <Door hinge={[f(cx - 1.6), y1]} along={[1, 0]} into={[0, -1]} width={0.9} />
          <Glazing a={[f(cx - 0.2), y1]} b={[f(cx + 1.4), y1]} />
        </>
      )}
      <text x={cx} y={f(y0 - 0.8)} textAnchor="middle" style={label}>
        {unit.label}
      </text>
      {dimension ? <Dimension a={[x0, y0]} b={[x1, y0]} offset={-2.4} /> : null}
    </g>
  )
}

// The study room: one 40 ft container, a band of glazed doors onto its deck (down the drawing).
function Study({ unit, west }: { unit: Unit; west: number }) {
  // its west end stays in line with the guest rooms after the spread (D-022)
  const [a, y0, b, y1] = B(unit.box)
  const [x0, x1] = [west, west + (b - a)]
  const deck = unit.deck ?? 2
  const [g0, g1] = [x0 + 0.6, x1 - 0.6]
  return (
    <g>
      <rect {...at([x0, y1, x1, y1 + deck])} {...thin} />
      <rect {...at([x0, y0, x1, y1])} {...wall} />
      <Glazing a={[f(g0), y1]} b={[f(g1), y1]} />
      <text x={f((x0 + x1) / 2)} y={f(y0 - 0.8)} textAnchor="middle" style={label}>
        {unit.label}
      </text>
    </g>
  )
}

// Beside the study room, two buildings of their own. The galley, a 40 ft container: a worktop along the
// back wall with two sinks. The public bathroom, a 20 ft container: two toilet rooms, two hand basins
// and a urinal, one door from the courtyard side.
function Galley({ unit }: { unit: Unit }) {
  const [x0, y0, x1, y1] = B(unit.box)
  return (
    <g>
      <rect {...at([x0, y0, x1, y1])} {...wall} />
      <rect {...at([x0 + 0.1, y0 + 0.1, x1 - 0.1, y0 + 0.7])} {...thin} />
      {[0.3, 0.7].map((k) => (
        <circle key={k} cx={f(x0 + (x1 - x0) * k)} cy={f(y0 + 0.4)} r={0.2} {...thin} />
      ))}
      <Door hinge={[f(x0 + 1.2), y1]} along={[1, 0]} into={[0, -1]} width={0.9} />
      <Door hinge={[f(x1 - 1.2), y1]} along={[-1, 0]} into={[0, -1]} width={0.9} />
      <text x={f((x0 + x1) / 2)} y={f(y0 - 0.8)} textAnchor="middle" style={label}>
        {unit.label}
      </text>
    </g>
  )
}

function Bath({ unit }: { unit: Unit }) {
  const [x0, y0, x1, y1] = B(unit.box)
  const deep = 1.45 // the toilet rooms' depth from the back wall
  const part = { stroke: "currentColor", strokeWidth: WALL * 0.6 } as const
  return (
    <g>
      <rect {...at([x0, y0, x1, y1])} {...wall} />
      {/* two toilet rooms at the left end, each a WC and a door onto the hall */}
      {[0, 1].map((k) => {
        const [a, b] = [x0 + k * 1.3, x0 + (k + 1) * 1.3]
        return (
          <g key={k}>
            <line x1={f(b)} x2={f(b)} y1={y0} y2={f(y0 + deep)} {...part} />
            <line x1={f(a)} x2={f(a + 0.25)} y1={f(y0 + deep)} y2={f(y0 + deep)} {...part} />
            <rect {...at([(a + b) / 2 - 0.22, y0 + 0.1, (a + b) / 2 + 0.22, y0 + 0.75])} rx={0.2} {...thin} />
            <Door hinge={[f(b), f(y0 + deep)]} along={[-1, 0]} into={[0, -1]} width={0.75} />
          </g>
        )
      })}
      {/* two hand basins on the back wall, a urinal on the end wall */}
      {[3.3, 4.2].map((d) => (
        <ellipse key={d} cx={f(x0 + d)} cy={f(y0 + 0.3)} rx={0.28} ry={0.2} {...thin} />
      ))}
      <path d={`M${f(x1)} ${f(y0 + 0.9)}A0.25 0.25 0 0 0 ${f(x1)} ${f(y0 + 1.4)}`} {...thin} />
      <Door hinge={[f(x0 + 3.0), y1]} along={[1, 0]} into={[0, -1]} width={0.9} />
      <text x={f((x0 + x1) / 2)} y={f(y0 - 0.8)} textAnchor="middle" style={label}>
        {unit.label}
      </text>
    </g>
  )
}

// What the 2026-10-25 footage shows outside, as the founder wants it planned (D-022): six small pop-up
// tents on a camping lawn between the guest rooms and the fire pit, ending at the pit, a long timber table with benches
// where today's unfinished platform stands, and stools round the fire pit. Each at true size.
const outdoor = compound.outdoor
function Outdoor() {
  const [pitX, pitY] = P(compound.courtyard.firePit)
  const { count, ring, r } = outdoor.firePitSeats
  const tents = outdoor.tents.map(P)
  const t = outdoor.tent
  const hex = (cx: number, cy: number) => Array.from({ length: 6 }, (_, k) => [f(cx + t * Math.cos((k * Math.PI) / 3)), f(cy + t * Math.sin((k * Math.PI) / 3))])
  const { x, y, length, width, bench, gap } = outdoor.longTable
  const [tx] = P([x, y])
  const ty = SIZE - y
  const rows = [
    [ty - width / 2, ty + width / 2],
    [ty - width / 2 - gap - bench, ty - width / 2 - gap],
    [ty + width / 2 + gap, ty + width / 2 + gap + bench],
  ]
  const left = Math.min(...tents.map(([cx]) => cx)) - t
  const middle = tents.reduce((n, [, cy]) => n + cy, 0) / tents.length
  return (
    <g>
      {Array.from({ length: count }, (_, k) => (k * 2 * Math.PI) / count).map((a) => (
        <circle key={a} cx={f(pitX + ring * Math.cos(a))} cy={f(pitY + ring * Math.sin(a))} r={r} {...thin} />
      ))}
      {tents.map(([cx, cy]) => {
        const p = hex(cx, cy)
        return (
          <g key={`${cx}-${cy}`}>
            <path d={`M${p.map((q) => q.join(" ")).join("L")}Z`} {...thin} />
            <path d={[0, 1, 2].map((k) => `M${p[k].join(" ")}L${p[k + 3].join(" ")}`).join("")} {...thin} />
          </g>
        )
      })}
      <text x={f(left - 0.6)} y={f(middle + 0.18)} textAnchor="end" style={small}>
        CAMPING
      </text>
      {rows.map(([a, b]) => (
        <rect key={a} {...at([tx - length / 2, a, tx + length / 2, b])} {...thin} />
      ))}
    </g>
  )
}

export function CompoundPlan({ title, className }: { title: string; className?: string }) {
  const { parking, courtyard } = compound
  const units = Object.fromEntries(compound.units.map((u) => [u.id, u])) as Record<string, Unit>
  const row = compound.units.filter((u) => u.kind === "20" && u.front === "north")
  const turn = (g: { x: Point; y: number; post: number }) => {
    const [l, r] = [g.x[0], g.x[1]]
    const shift = X((l + r) / 2) - (l + r) / 2
    return { x: [l + shift, r + shift], y: SIZE - g.y, post: g.post }
  }
  const parkingShift = B(parking.box)[0] - parking.box[0]
  const road = compound.rockRoad.curve.map(P)
  const roadPath = `M${road[0].join(" ")}C${road[1].join(" ")} ${road[2].join(" ")} ${road[3].join(" ")}`
  const [px0, py0, px1, py1] = B(parking.box)
  const [pitX, pitY] = P(courtyard.firePit)
  const [, , pitR, pitInner] = courtyard.firePit
  const sign = B(compound.sign)
  const [, cy0, cx1] = B(courtyard.box)
  return (
    <svg viewBox={`${VIEW[0]} ${VIEW[1]} ${VIEW[2] - VIEW[0]} ${VIEW[3] - VIEW[1]}`} role="img" aria-label={title} className={className}>
      {/* The study room, then the row of office and two studios, the bar and the guest rooms */}
      <Study unit={units.study} west={B(units.rooms.box)[0]} />
      <Galley unit={units.galley} />
      <Bath unit={units.bath} />
      {row.map((unit) => (
        <RowUnit key={unit.id} unit={unit} dimension={unit.id === "studio-two"} />
      ))}
      <Bar unit={units.bar} east={B(units.rooms.box)[2]} />
      <GuestRooms unit={units.rooms} />

      {/* The courtyard: no outline, only its name and the stone fire pit */}
      <circle cx={pitX} cy={pitY} r={pitR} {...medium} />
      <circle cx={pitX} cy={pitY} r={pitInner} {...thin} />
      {/* stools round the fire pit, the camping lawn beside it, the long table at the middle studio */}
      <Outdoor />
      <text x={f(pitX + outdoor.firePitSeats.ring + 0.6)} y={f(pitY + 0.18)} style={small}>
        FIRE PIT
      </text>
      <text x={f(cx1 - 0.8)} y={f(cy0 + 1.6)} textAnchor="end" style={label}>
        COURTYARD
      </text>

      {/* The inner gate, the rock road down to the parking, the outer gate and the sign wall */}
      <Gate {...turn(compound.innerGate)} />
      <rect {...at([px0, py0, px1, py1])} rx={0.4} {...thin} />
      {parking.bays.slice(1).map((x) => (
        <line key={x} x1={f(x + parkingShift)} x2={f(x + parkingShift)} y1={py0} y2={f(SIZE - parking.box[1] - 2)} {...thin} />
      ))}
      <path d={roadPath} fill="none" stroke="currentColor" strokeWidth={compound.rockRoad.width} />
      <path d={roadPath} fill="none" stroke={PAGE} strokeWidth={compound.rockRoad.width - 0.16} />
      <text x={f(px1 - 0.6)} y={f(py0 + 1.4)} textAnchor="end" style={label}>
        PARKING
      </text>
      <Gate {...turn(compound.gate)} />
      <rect {...at(sign)} fill="currentColor" />
      <text x={f(sign[0] - 0.5)} y={f(sign[3] - 0.05)} textAnchor="end" style={small}>
        DIGITAL FARM
      </text>
    </svg>
  )
}
