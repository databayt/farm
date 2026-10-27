import compound from "./compound.json"

// The compound drawn in the pattern of the studio's plan (/en/studio, render/plan.svg): solid black
// container walls, thin lines for everything else, bold capitals beside each building and dimensions in
// millimetres, no colour, no surroundings. The founder reads it turned 180° from compound.json's
// north-up frame (D-022): the study room at the top, the gates at the bottom. Units are metres.

type Box = readonly number[]
type Point = readonly number[]
type Unit = (typeof compound.units)[number]

// Turn the north-up layout half a turn inside a 46 m square.
const SIZE = 46
const P = ([x, y]: Point) => [SIZE - x, SIZE - y]
const B = ([x0, y0, x1, y1]: Box) => [SIZE - x1, SIZE - y1, SIZE - x0, SIZE - y0]
const VIEW = [3.5, 0.6, 46, 45.4]

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

// A two-leaf gate between posts, both leaves open into the site (up the drawing).
function Gate({ x: [left, right], y, post }: { x: Point; y: number; post: number }) {
  const leaf = (right - left) / 2
  const reach = f(leaf * Math.SQRT1_2)
  const middle = left + leaf
  return (
    <g>
      {[left - post, right].map((x) => (
        <rect key={x} {...at([x, y - post / 2, x + post, y + post / 2])} fill="currentColor" />
      ))}
      <path d={`M${left} ${y}L${f(left + reach)} ${f(y - reach)}M${right} ${y}L${f(right - reach)} ${f(y - reach)}`} {...medium} />
      <path
        d={`M${middle} ${y}A${leaf} ${leaf} 0 0 0 ${f(left + reach)} ${f(y - reach)}M${middle} ${y}A${leaf} ${leaf} 0 0 1 ${f(right - reach)} ${f(y - reach)}`}
        {...thin}
        strokeDasharray="3 3"
      />
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

// The joined guest-room pair, its doors and windows onto the veranda on the courtyard side (left).
function GuestRooms({ unit }: { unit: Unit }) {
  const [x0, y0, x1, y1] = B(unit.box)
  const n = unit.rooms ?? 3
  const room = (y1 - y0) / n
  const v = unit.veranda ?? 1.5
  return (
    <g>
      <rect {...at([x0 - v, y0, x0, y1])} {...thin} />
      <rect {...at([x0, y0, x1, y1])} {...wall} />
      {Array.from({ length: n }, (_, k) => f(y0 + k * room)).map((y, k) => (
        <g key={y}>
          {k ? <line x1={x0} x2={x1} y1={y} y2={y} stroke="currentColor" strokeWidth={WALL * 0.7} /> : null}
          <Door hinge={[x0, f(y + 0.6)]} along={[0, 1]} into={[1, 0]} width={0.9} />
          <Glazing a={[x0, f(y + 2.2)]} b={[x0, f(y + 3.4)]} />
        </g>
      ))}
      <Dimension a={[x1, y0]} b={[x1, y1]} offset={1.2} />
      <Dimension a={[x0, y0]} b={[x1, y0]} offset={-1.2} />
      <text x={f(x1 + 2.9)} y={f((y0 + y1) / 2)} textAnchor="middle" transform={`rotate(90 ${f(x1 + 2.9)} ${f((y0 + y1) / 2)})`} style={label}>
        {unit.label}
      </text>
    </g>
  )
}

// The bar, in line with the guest rooms: its serving hatch and counter on the courtyard side.
function Bar({ unit }: { unit: Unit }) {
  const [x0, y0, x1, y1] = B(unit.box)
  const [h0, h1] = (unit.hatch ?? [0, 0]).map((y) => SIZE - y).sort((a, b) => a - b)
  return (
    <g>
      <rect {...at([x0, y0, x1, y1])} {...wall} />
      <Gap a={[x0, h0]} b={[x0, h1]} />
      <rect {...at([x0 - 0.4, h0, x0, h1])} {...thin} />
      <text x={f(x1 + 0.7)} y={f((y0 + y1) / 2 + 0.32)} style={label}>
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
          <rect {...at([x0 - 0.75, y0 + 0.15, x0, y1 - 0.15])} {...thin} />
        </>
      ) : (
        <>
          <Door hinge={[f(cx + 1.6), y1]} along={[-1, 0]} into={[0, -1]} width={0.9} />
          <Glazing a={[f(cx - 1.4), y1]} b={[f(cx + 0.2), y1]} />
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
function Study({ unit }: { unit: Unit }) {
  const [x0, y0, x1, y1] = B(unit.box)
  const deck = unit.deck ?? 2
  const [g0, g1] = [x0 + 0.6, x1 - 0.6]
  return (
    <g>
      <rect {...at([x0, y1, x1, y1 + deck])} {...thin} />
      <rect {...at([x0, y0, x1, y1])} {...wall} />
      <Glazing a={[f(g0), y1]} b={[f(g1), y1]} />
      <text x={f(x0 - 0.7)} y={f((y0 + y1) / 2 + 0.32)} textAnchor="end" style={label}>
        {unit.label}
      </text>
    </g>
  )
}

export function CompoundPlan({ title, className }: { title: string; className?: string }) {
  const { parking, courtyard } = compound
  const units = Object.fromEntries(compound.units.map((u) => [u.id, u])) as Record<string, Unit>
  const row = compound.units.filter((u) => u.kind === "20" && u.front === "north")
  const turn = (g: { x: Point; y: number; post: number }) => ({ x: [SIZE - g.x[1], SIZE - g.x[0]], y: SIZE - g.y, post: g.post })
  const road = compound.rockRoad.curve.map(P)
  const roadPath = `M${road[0].join(" ")}C${road[1].join(" ")} ${road[2].join(" ")} ${road[3].join(" ")}`
  const [px0, py0, px1, py1] = B(parking.box)
  const [pitX, pitY] = P(courtyard.firePit)
  const [, , pitR, pitInner] = courtyard.firePit
  const sign = B(compound.sign)
  const [cx0, cy0] = B(courtyard.box)
  return (
    <svg viewBox={`${VIEW[0]} ${VIEW[1]} ${VIEW[2] - VIEW[0]} ${VIEW[3] - VIEW[1]}`} role="img" aria-label={title} className={className}>
      {/* The study room, then the row of office and two studios, the bar and the guest rooms */}
      <Study unit={units.study} />
      {row.map((unit) => (
        <RowUnit key={unit.id} unit={unit} dimension={unit.id === "studio-two"} />
      ))}
      <Bar unit={units.bar} />
      <GuestRooms unit={units.rooms} />

      {/* The courtyard: no outline, only its name and the stone fire pit */}
      <circle cx={pitX} cy={pitY} r={pitR} {...medium} />
      <circle cx={pitX} cy={pitY} r={pitInner} {...thin} />
      <text x={pitX} y={f(pitY - pitR - 0.6)} textAnchor="middle" style={small}>
        FIRE PIT
      </text>
      <text x={f(cx0 + 0.8)} y={f(cy0 + 1.6)} style={label}>
        COURTYARD
      </text>

      {/* The inner gate, the rock road down to the parking, the outer gate and the sign wall */}
      <Gate {...turn(compound.innerGate)} />
      <rect {...at([px0, py0, px1, py1])} rx={0.4} {...thin} />
      {parking.bays.slice(1).map((x) => (
        <line key={x} x1={f(SIZE - x)} x2={f(SIZE - x)} y1={py0} y2={f(SIZE - 6)} {...thin} />
      ))}
      <path d={roadPath} fill="none" stroke="currentColor" strokeWidth={compound.rockRoad.width} />
      <path d={roadPath} fill="none" stroke={PAGE} strokeWidth={compound.rockRoad.width - 0.16} />
      <text x={f(px0 + 0.6)} y={f(py0 + 1.4)} style={label}>
        PARKING
      </text>
      <Gate {...turn(compound.gate)} />
      <rect {...at(sign)} fill="currentColor" />
      <text x={f(sign[2] + 0.5)} y={f(sign[3] - 0.05)} style={small}>
        DIGITAL FARM
      </text>
    </svg>
  )
}
