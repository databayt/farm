import compound from "./compound.json"

// The compound drawn like the studio's plan (/en/studio, render/plan.svg): heavy outlines for the
// containers, thin lines for the rest, bold capitals and dimensions in millimetres, no colour. North
// is up, so the public road is at the top and the lake at the bottom (D-021). Every number is a
// metre in compound.json, which the 3D model (scripts/site/render/compound.html) is built from too.

type Box = readonly number[]
type Point = readonly number[]
type Unit = (typeof compound.units)[number]

// Line weights in screen pixels at any size, as a plot style sets them.
const heavy = { fill: "none", stroke: "currentColor", strokeWidth: 2.2, vectorEffect: "non-scaling-stroke" } as const
const medium = { ...heavy, strokeWidth: 1.2 } as const
const thin = { ...heavy, strokeWidth: 0.75 } as const
// The page colour knocks openings out of a wall line and keeps lettering clear of the lines under it.
const PAGE = "var(--background)"
const knock = { stroke: PAGE, strokeWidth: 5, vectorEffect: "non-scaling-stroke" } as const

const label = {
  fontFamily: "var(--font-sans), ui-sans-serif, system-ui, sans-serif",
  fontSize: 0.95,
  fontWeight: 700,
  letterSpacing: "0.06em",
  fill: "currentColor",
  stroke: PAGE,
  strokeWidth: 0.4,
  paintOrder: "stroke",
} as const
const small = { ...label, fontSize: 0.72, fontWeight: 600 } as const

const f = (n: number) => +n.toFixed(3)
const mm = (m: number) => Math.round(m * 1000).toLocaleString("en-US")
const at = ([x0, y0, x1, y1]: Box) => ({ x: x0, y: y0, width: f(x1 - x0), height: f(y1 - y0) })

// A smooth line through points (Catmull-Rom as cubic Béziers), for the shore.
function smooth(points: Point[]) {
  let d = `M${points[0][0]} ${points[0][1]}`
  for (let i = 0; i < points.length - 1; i++) {
    const [p0, p1, p2, p3] = [points[i - 1] ?? points[i], points[i], points[i + 1], points[i + 2] ?? points[i + 1]]
    d += `C${f(p1[0] + (p2[0] - p0[0]) / 6)} ${f(p1[1] + (p2[1] - p0[1]) / 6)} `
    d += `${f(p2[0] - (p3[0] - p1[0]) / 6)} ${f(p2[1] - (p3[1] - p1[1]) / 6)} ${p2[0]} ${p2[1]}`
  }
  return d
}

// A window or glazed wall: the wall line knocked out, the glazing as a thin double line.
function Glazing({ x1, y1, x2, y2 }: { x1: number; y1: number; x2: number; y2: number }) {
  const across = x1 === x2
  return (
    <g>
      <line x1={x1} y1={y1} x2={x2} y2={y2} {...knock} />
      <rect
        {...(across ? at([x1 - 0.07, y1, x1 + 0.07, y2]) : at([x1, y1 - 0.07, x2, y1 + 0.07]))}
        {...thin}
      />
    </g>
  )
}

// A door: the wall knocked out and the leaf open into the room, its swing dashed.
function Door({ hinge: [hx, hy], along: [ax, ay], into: [ix, iy], width: w }: {
  hinge: Point
  along: Point
  into: Point
  width: number
}) {
  const [ex, ey] = [f(hx + ax * w), f(hy + ay * w)]
  const [lx, ly] = [f(hx + ix * w), f(hy + iy * w)]
  const sweep = ix * ay - iy * ax > 0 ? 1 : 0
  return (
    <g>
      <line x1={hx} y1={hy} x2={ex} y2={ey} {...knock} />
      <path d={`M${hx} ${hy}L${lx} ${ly}`} {...thin} />
      <path d={`M${lx} ${ly}A${w} ${w} 0 0 ${sweep} ${ex} ${ey}`} {...thin} strokeDasharray="3 3" />
    </g>
  )
}

// A two-leaf gate between posts, both leaves open into the site.
function Gate({ x: [left, right], y, post }: { x: Point; y: number; post: number }) {
  const leaf = (right - left) / 2
  const reach = f(leaf * Math.SQRT1_2)
  const middle = left + leaf
  return (
    <g>
      {[left - post, right].map((x) => (
        <rect key={x} {...at([x, y - post / 2, x + post, y + post / 2])} {...medium} />
      ))}
      <path d={`M${left} ${y}L${f(left + reach)} ${f(y + reach)}M${right} ${y}L${f(right - reach)} ${f(y + reach)}`} {...medium} />
      <path
        d={`M${middle} ${y}A${leaf} ${leaf} 0 0 1 ${f(left + reach)} ${f(y + reach)}M${middle} ${y}A${leaf} ${leaf} 0 0 0 ${f(right - reach)} ${f(y + reach)}`}
        {...thin}
        strokeDasharray="3 3"
      />
    </g>
  )
}

// A tree in plan: canopy and trunk mark; dashed where the canopy overhangs parking.
function Tree({ x, y, r, dashed }: { x: number; y: number; r: number; dashed?: boolean }) {
  return (
    <g>
      <circle cx={x} cy={y} r={r} {...thin} strokeDasharray={dashed ? "4 3" : undefined} />
      <path d={`M${f(x - 0.25)} ${y}H${f(x + 0.25)}M${x} ${f(y - 0.25)}V${f(y + 0.25)}`} {...thin} />
    </g>
  )
}

// A dimension: extension lines, a dimension line with oblique ticks, the value set on the line.
function Dimension({ x1, y1, x2, y2, offset }: { x1: number; y1: number; x2: number; y2: number; offset: number }) {
  const vertical = x1 === x2
  const [dx, dy] = vertical ? [offset, 0] : [0, offset]
  const [sx, sy] = [Math.sign(dx), Math.sign(dy)]
  const [ax, ay, bx, by] = [f(x1 + dx), f(y1 + dy), f(x2 + dx), f(y2 + dy)]
  const tick = (x: number, y: number) => `M${f(x - 0.3)} ${f(y + 0.3)}L${f(x + 0.3)} ${f(y - 0.3)}`
  const [mx, my] = [f((ax + bx) / 2), f((ay + by) / 2)]
  return (
    <g>
      <path
        d={`M${f(x1 + sx * 0.3)} ${f(y1 + sy * 0.3)}L${f(ax + sx * 0.4)} ${f(ay + sy * 0.4)}M${f(x2 + sx * 0.3)} ${f(y2 + sy * 0.3)}L${f(bx + sx * 0.4)} ${f(by + sy * 0.4)}`}
        {...thin}
      />
      <path d={`M${ax} ${ay}L${bx} ${by}${tick(ax, ay)}${tick(bx, by)}`} {...thin} />
      <text
        x={mx}
        y={my}
        textAnchor="middle"
        dominantBaseline="central"
        transform={vertical ? `rotate(-90 ${mx} ${my})` : undefined}
        style={{ ...small, fontWeight: 500, strokeWidth: 0.6 }}
      >
        {mm(vertical ? Math.abs(y2 - y1) : Math.abs(x2 - x1))}
      </text>
    </g>
  )
}

// The joined guest-room pair: three rooms across its width, each with a door and a barred window
// onto the veranda; the line where the two containers meet is kept.
function GuestRooms({ unit }: { unit: Unit }) {
  const [x0, y0, x1, y1] = unit.box
  const room = (y1 - y0) / (unit.rooms ?? 3)
  const rooms = Array.from({ length: unit.rooms ?? 3 }, (_, i) => f(y0 + i * room))
  const veranda = unit.veranda ?? 1.5
  return (
    <g>
      <rect {...at(unit.box)} {...heavy} />
      <line x1={f((x0 + x1) / 2)} x2={f((x0 + x1) / 2)} y1={y0} y2={y1} {...thin} strokeDasharray="12 3 2 3" />
      {rooms.slice(1).map((y) => (
        <line key={y} x1={x0} x2={x1} y1={y} y2={y} {...medium} />
      ))}
      <rect {...at([x1, y0, x1 + veranda, y1])} {...thin} />
      {rooms.map((y) => (
        <g key={y}>
          <Door hinge={[x1, f(y + 0.5)]} along={[0, 1]} into={[-1, 0]} width={0.9} />
          <Glazing x1={x1} y1={f(y + 2.2)} x2={x1} y2={f(y + 3.4)} />
          <rect {...at([x1 + veranda, y + 0.4, x1 + veranda + 0.4, y + 1.5])} {...thin} />
        </g>
      ))}
      <Dimension x1={x0} y1={y0} x2={x0} y2={y1} offset={-1.3} />
      <Dimension x1={x0} y1={y1} x2={x1} y2={y1} offset={1.3} />
      <text x={1.9} y={f((y0 + y1) / 2)} textAnchor="middle" transform={`rotate(-90 1.9 ${f((y0 + y1) / 2)})`} style={label}>
        {unit.label}
      </text>
    </g>
  )
}

// A 20 ft container on a raised deck facing the courtyard: the deck's railing on three sides with
// steps down at the middle. Studios have a 3 m glass wall, a roof terrace (dashed, overhead) and a
// stair at their east end; the office has a glazed door and a window.
function RowUnit({ unit }: { unit: Unit }) {
  const [x0, y0, x1, y1] = unit.box
  const deck = unit.deck ?? 1.5
  const cx = f((x0 + x1) / 2)
  const front = f(y0 - deck)
  return (
    <g>
      <rect {...at([x0, front, x1, y0])} {...thin} />
      <path d={`M${f(cx - 0.6)} ${front}H${x0}V${y0}M${f(cx + 0.6)} ${front}H${x1}V${y0}`} {...medium} />
      <rect {...at([cx - 0.6, front - 0.85, cx + 0.6, front])} {...thin} />
      <path d={`M${f(cx - 0.6)} ${f(front - 0.28)}H${f(cx + 0.6)}M${f(cx - 0.6)} ${f(front - 0.56)}H${f(cx + 0.6)}`} {...thin} />
      <rect {...at(unit.box)} {...heavy} />
      {unit.terrace ? (
        <>
          <Glazing x1={f(cx - 1.5)} y1={y0} x2={f(cx + 1.5)} y2={y0} />
          <rect {...at([x0 + 0.35, y0 + 0.35, x1 - 0.35, y1 - 0.35])} {...thin} strokeDasharray="6 4" />
          <rect {...at([x1, y0 + 0.15, x1 + 0.75, y1 - 0.15])} {...thin} />
          {[0.45, 0.8, 1.15, 1.5, 1.85].map((d) => (
            <line key={d} x1={x1} x2={f(x1 + 0.75)} y1={f(y0 + d)} y2={f(y0 + d)} {...thin} />
          ))}
        </>
      ) : (
        <>
          <Door hinge={[f(cx - 1.6), y0]} along={[1, 0]} into={[0, 1]} width={0.9} />
          <Glazing x1={f(cx - 0.2)} y1={y0} x2={f(cx + 1.4)} y2={y0} />
        </>
      )}
      <text x={cx} y={f(y1 + 1.3)} textAnchor="middle" style={label}>
        {unit.label}
      </text>
    </g>
  )
}

// The bar: a 20 ft container in line with the guest rooms, its serving hatch and counter on the
// courtyard side under a flap (dashed, overhead).
function Bar({ unit }: { unit: Unit }) {
  const [x0, y0, x1, y1] = unit.box
  const [h0, h1] = unit.hatch ?? [y0 + 1.5, y1 - 1.5]
  return (
    <g>
      <rect {...at(unit.box)} {...heavy} />
      <line x1={x1} y1={h0} x2={x1} y2={h1} {...knock} />
      <rect {...at([x1, h0, x1 + 0.4, h1])} {...thin} />
      <rect {...at([x1, h0, x1 + 0.9, h1])} {...thin} strokeDasharray="4 3" />
      <text x={f(x0 - 0.6)} y={f((y0 + y1) / 2 + 0.33)} textAnchor="end" style={label}>
        {unit.label}
      </text>
    </g>
  )
}

// The study room: one 40 ft container, a band of glazed doors along the side that faces its deck.
function Study({ unit }: { unit: Unit }) {
  const [x0, y0, x1, y1] = unit.box
  const deck = unit.deck ?? 2
  const [g0, g1] = [x0 + 0.6, x1 - 0.6]
  const panes = 6
  return (
    <g>
      <rect {...at([x0, y0 - deck, x1, y0])} {...thin} />
      <rect {...at([x0 + 2, y0 - deck - 0.4, x1 - 2, y0 - deck])} {...thin} />
      <rect {...at(unit.box)} {...heavy} />
      <Glazing x1={f(g0)} y1={y0} x2={f(g1)} y2={y0} />
      {Array.from({ length: panes - 1 }, (_, i) => f(g0 + ((i + 1) * (g1 - g0)) / panes)).map((x) => (
        <line key={x} x1={x} x2={x} y1={f(y0 - 0.07)} y2={f(y0 + 0.07)} {...thin} />
      ))}
      <text x={f(x1 + 0.7)} y={f((y0 + y1) / 2 + 0.33)} style={label}>
        {unit.label}
      </text>
    </g>
  )
}

export function CompoundPlan({ title, className }: { title: string; className?: string }) {
  const [fx0, fy0, fx1, fy1] = compound.frame
  const { parking, courtyard, shore } = compound
  const [pitX, pitY, pitR, pitInner] = courtyard.firePit
  const units = Object.fromEntries(compound.units.map((u) => [u.id, u])) as Record<string, Unit>
  const row = compound.units.filter((u) => u.kind === "20" && u.front === "north")
  const studioTwo = units["studio-two"].box
  const [cx, cy] = compound.north
  const road = compound.rockRoad.curve
  const roadPath = `M${road[0][0]} ${road[0][1]}C${road[1].join(" ")} ${road[2].join(" ")} ${road[3].join(" ")}`
  const { from, to, step } = shore.trees
  const trees = Array.from({ length: Math.floor((to - from) / step + 1e-6) + 1 }, (_, i) => f(from + i * step))
  return (
    <svg
      viewBox={`${fx0} ${fy0} ${fx1 - fx0} ${fy1 - fy0}`}
      role="img"
      aria-label={title}
      className={className}
    >
      {/* Everything stays inside the frame, even where the box is wider than the drawing */}
      <clipPath id="compound-frame">
        <rect x={fx0} y={fy0} width={fx1 - fx0} height={fy1 - fy0} />
      </clipPath>
      <g clipPath="url(#compound-frame)">
        {/* The public road along the top, and the outer gate and sign wall on it */}
        <line x1={fx0} x2={fx1} y1={compound.publicRoad[0]} y2={compound.publicRoad[0]} {...thin} />
        <line x1={fx0} x2={fx1} y1={compound.publicRoad[1]} y2={compound.publicRoad[1]} {...medium} />
        <text x={fx0 + 0.8} y={1.1} style={small}>
          PUBLIC ROAD
        </text>
        <Gate x={compound.gate.x} y={compound.gate.y} post={compound.gate.post} />
        <rect {...at(compound.sign)} {...medium} />
        <text x={f(compound.sign[0] - 0.5)} y={2.55} textAnchor="end" style={small}>
          DIGITAL FARM
        </text>

        {/* Green parking: bays, two cars and the shade trees over them */}
        <rect {...at(parking.box)} rx={0.4} {...medium} />
        {parking.bays.slice(1).map((x) => (
          <line key={x} x1={x} x2={x} y1={6} y2={parking.box[3]} {...thin} />
        ))}
        {parking.cars.map(([x, y]) => (
          <g key={x}>
            <rect {...at([x - 0.9, y, x + 0.9, y + 4.3])} rx={0.5} {...thin} />
            <path d={`M${f(x - 0.75)} ${f(y + 1.4)}H${f(x + 0.75)}M${f(x - 0.75)} ${f(y + 3.4)}H${f(x + 0.75)}`} {...thin} />
          </g>
        ))}
        {compound.shadeTrees.map(([x, y, r]) => (
          <Tree key={x} x={x} y={y} r={r} dashed />
        ))}
        <text x={f(parking.box[2] - 0.6)} y={f(parking.box[3] - 0.7)} textAnchor="end" style={label}>
          PARKING
        </text>

        {/* The rock road, from the parking down to the inner gate: its two edges, the middle knocked out */}
        <path d={roadPath} fill="none" stroke="currentColor" strokeWidth={compound.rockRoad.width} />
        <path d={roadPath} fill="none" stroke={PAGE} strokeWidth={compound.rockRoad.width - 0.16} />
        <text x={27.6} y={13.4} style={small}>
          ROCK ROAD
        </text>
        <Gate x={compound.innerGate.x} y={compound.innerGate.y} post={compound.innerGate.post} />
        <text x={f(compound.innerGate.x[1] + compound.innerGate.post + 0.6)} y={18.15} style={small}>
          INNER GATE
        </text>

        {/* The courtyard lawn and the stone fire pit already on site */}
        <rect {...at(courtyard.box)} rx={courtyard.r} {...thin} />
        {courtyard.stones.map(([x, y]) => (
          <rect key={y} {...at([x - 0.3, y - 0.2, x + 0.3, y + 0.2])} rx={0.12} {...thin} />
        ))}
        <circle cx={pitX} cy={pitY} r={pitR} {...medium} />
        <circle cx={pitX} cy={pitY} r={pitInner} {...thin} />
        <text x={pitX} y={f(pitY + pitR + 1.05)} textAnchor="middle" style={small}>
          FIRE PIT
        </text>
        <text x={f(courtyard.box[2] - 0.7)} y={f(courtyard.box[3] - 0.8)} textAnchor="end" style={label}>
          COURTYARD
        </text>

        {/* The containers: the bar and the guest rooms down the west side, the office and two studios
            along the south of the courtyard, the study room further out toward the lake */}
        <Bar unit={units.bar} />
        <GuestRooms unit={units.rooms} />
        {row.map((unit) => (
          <RowUnit key={unit.id} unit={unit} />
        ))}
        <Dimension x1={studioTwo[0]} y1={studioTwo[3]} x2={studioTwo[2]} y2={studioTwo[3]} offset={2.5} />
        <Study unit={units.study} />

        {/* The shore: a band of trees, then the lake */}
        {trees.map((x, i) => (
          <Tree key={x} x={x} y={shore.trees.y} r={[1.2, 1.4, 1.1][i % 3]} />
        ))}
        <path d={smooth(shore.line)} {...medium} />
        {[50.7, 51.9, 53.1].map((y, n) =>
          Array.from({ length: 13 }, (_, i) => f(fx0 - 5 + i * 5.5 + n * 2.6)).map((x) => (
            <line key={`${y}-${x}`} x1={x} x2={f(x + 2.4)} y1={y} y2={y} {...thin} />
          )),
        )}
        <text x={f(fx1 - 4)} y={52.5} textAnchor="end" style={{ ...label, fontSize: 1.1, letterSpacing: "0.3em" }}>
          LAKE
        </text>

        {/* North */}
        <path d={`M${cx} ${f(cy + 1.6)}V${f(cy - 1.2)}`} {...medium} />
        <path d={`M${f(cx - 0.55)} ${f(cy - 0.6)}L${cx} ${f(cy - 1.8)}L${f(cx + 0.55)} ${f(cy - 0.6)}Z`} fill="currentColor" />
        <text x={cx} y={f(cy - 2.4)} textAnchor="middle" style={label}>
          N
        </text>
      </g>
    </svg>
  )
}
