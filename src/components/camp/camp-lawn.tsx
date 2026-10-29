import compound from "../home/compound.json"
import bathroom from "../public-bathroom/public-bathroom.json"

// The camping lawn and what serves it, in the 2D's pattern (thin lines in the text colour, bold capitals): the
// six tents of compound.json `outdoor`, the fire pit they end at, the public bathroom whose toilets and basins the
// campers use (D-022), and the buildings round the courtyard for bearings. Positions are the provisional plan's
// (compound.json, D-022: illustrative, not surveyed), at true scale and WITHOUT the homepage's sideways spread, so
// the distances are the plan's own; the drawing is turned as the homepage's 2D is (the study-room row at the top).
// The tent cluster ends at the fire pit's west edge, as both homepage drawings place it.

const SIZE = 46 // the homepage's flip: y' = SIZE - y
const { courtyard, outdoor, units } = compound
const [pitX, pitY0, pitR, pitInner] = courtyard.firePit
const pitY = SIZE - pitY0
const t = outdoor.tent
const shift = pitX - pitR - (Math.max(...outdoor.tents.map(([x]) => x)) + t)
const tents = outdoor.tents.map(([x, y]) => [x + shift, SIZE - y])

const bath = units.find((u) => u.id === "bath")!
const [bx0, by0, bx1, by1] = bath.box
const door = [bx0 + (bathroom.front.door.x0 + bathroom.front.door.x1) / 2, SIZE - by0] // its front faces the courtyard
const dist = (a: number[], b: number[]) => Math.hypot(a[0] - b[0], a[1] - b[1])
const near = (p: number[]) => tents.reduce((m, q) => (dist(q, p) < dist(m, p) ? q : m))
const far = (p: number[]) => tents.reduce((m, q) => (dist(q, p) > dist(m, p) ? q : m))
// straight-line metres, rounded: from the tents' centres to the bathroom's door, from their walls to the fire pit's edge
export const LAWN = {
  bathNear: Math.round(dist(near(door), door)),
  bathFar: Math.round(dist(far(door), door)),
  pitNear: Math.round(dist(near([pitX, pitY]), [pitX, pitY]) - pitR - t),
  pitFar: Math.round(dist(far([pitX, pitY]), [pitX, pitY]) - pitR - t),
  tents: tents.length,
}

const f = (n: number) => +n.toFixed(3)
const thin = { fill: "none", stroke: "currentColor", strokeWidth: 0.75, vectorEffect: "non-scaling-stroke" } as const
const medium = { ...thin, strokeWidth: 1.8 } as const
const faint = { ...thin, strokeWidth: 0.5, strokeOpacity: 0.5 } as const
const route = { ...thin, strokeDasharray: "5 4" } as const
const label = {
  fontFamily: "var(--font-sans), ui-sans-serif, system-ui, sans-serif",
  fontSize: 0.75,
  fontWeight: 700,
  letterSpacing: "0.04em",
  fill: "currentColor",
} as const
const small = { ...label, fontSize: 0.55, fontWeight: 600 } as const
const hex = (cx: number, cy: number) =>
  Array.from({ length: 6 }, (_, k) => [f(cx + t * Math.cos((k * Math.PI) / 3)), f(cy + t * Math.sin((k * Math.PI) / 3))])
const rect = ([x0, y0, x1, y1]: number[]) => ({ x: x0, y: f(SIZE - y1), width: f(x1 - x0), height: f(y1 - y0) })

export function CampLawn({ title, className }: { title: string; className?: string }) {
  const nb = near(door), np = near([pitX, pitY])
  // where a route leaves its tent: the tent's edge toward the point
  const edge = (a: number[], b: number[]) => {
    const d = dist(a, b)
    return [f(a[0] + ((b[0] - a[0]) * t) / d), f(a[1] + ((b[1] - a[1]) * t) / d)]
  }
  const toPit = (a: number[]) => {
    const d = dist(a, [pitX, pitY])
    return [f(pitX + ((a[0] - pitX) * pitR) / d), f(pitY + ((a[1] - pitY) * pitR) / d)]
  }
  const [b0, b1] = [edge(nb, door), door]
  const [p0, p1] = [edge(np, [pitX, pitY]), toPit(np)]
  return (
    <svg viewBox="3.5 0.5 39 34.5" role="img" aria-label={title} className={className}>
      {/* the buildings round the courtyard, faint, for bearings; the public bathroom drawn firm */}
      {units.filter((u) => u.id !== "bath").map((u) => (
        <g key={u.id}>
          <rect {...rect(u.box)} {...faint} />
          <text x={f((u.box[0] + u.box[2]) / 2)} y={f(SIZE - (u.box[1] + u.box[3]) / 2 + 0.2)} textAnchor="middle" style={small} fillOpacity={0.55}>
            {u.label}
          </text>
        </g>
      ))}
      <rect {...rect(bath.box)} {...medium} />
      <line x1={f(bx0 + bathroom.front.door.x0)} x2={f(bx0 + bathroom.front.door.x1)} y1={door[1]} y2={door[1]} strokeWidth={4}
        stroke="var(--background)" vectorEffect="non-scaling-stroke" />
      <text x={f((bx0 + bx1) / 2)} y={f(SIZE - by1 - 0.5)} textAnchor="middle" style={label}>PUBLIC BATHROOM</text>
      <text x={door[0]} y={f(door[1] + 0.9)} textAnchor="middle" style={small}>DOOR</text>

      {/* the fire pit and its stools */}
      <circle cx={pitX} cy={pitY} r={pitR} {...medium} />
      <circle cx={pitX} cy={pitY} r={pitInner} {...thin} />
      {Array.from({ length: outdoor.firePitSeats.count }, (_, k) => (k * 2 * Math.PI) / outdoor.firePitSeats.count).map((a) => (
        <circle key={a} cx={f(pitX + outdoor.firePitSeats.ring * Math.cos(a))} cy={f(pitY + outdoor.firePitSeats.ring * Math.sin(a))}
          r={outdoor.firePitSeats.r} {...thin} />
      ))}
      <text x={f(pitX + outdoor.firePitSeats.ring + 0.6)} y={f(pitY + 0.2)} style={label}>FIRE PIT</text>

      {/* the six tents on the camping lawn */}
      {tents.map(([cx, cy]) => {
        const p = hex(cx, cy)
        return (
          <g key={`${cx}-${cy}`}>
            <path d={`M${p.map((q) => q.join(" ")).join("L")}Z`} {...medium} fill="var(--background)" />
            <path d={[0, 1, 2].map((k) => `M${p[k].join(" ")}L${p[k + 3].join(" ")}`).join("")} {...faint} />
          </g>
        )
      })}
      <text x={f(Math.min(...tents.map(([x]) => x)) - t - 0.5)} y={f(tents.reduce((n, [, y]) => n + y, 0) / tents.length + 0.25)}
        textAnchor="end" style={label}>CAMPING LAWN</text>

      {/* straight lines from the nearest tent to the bathroom's door and to the fire pit */}
      <line x1={b0[0]} y1={b0[1]} x2={b1[0]} y2={b1[1]} {...route} />
      <text x={f(b0[0] + (b1[0] - b0[0]) * 0.72 - 0.6)} y={f(b0[1] + (b1[1] - b0[1]) * 0.72)} textAnchor="end" style={small}>
        {LAWN.bathNear}–{LAWN.bathFar} m to the toilets, in a straight line
      </text>
      <line x1={p0[0]} y1={p0[1]} x2={p1[0]} y2={p1[1]} {...route} />
      <text x={f(pitX + 0.6)} y={f(pitY + outdoor.firePitSeats.ring + 1.4)} style={small}>
        {LAWN.pitNear}–{LAWN.pitFar} m from the tents
      </text>
    </svg>
  )
}
