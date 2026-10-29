// What the volleyball and tennis plans draw alike, in the pattern of the livestock plan: thin lines in the text
// colour, bold capitals, dimensions in millimetres; and the match layer that broadcast pictures of both games lead
// with: players as numbered discs, one team open and one filled, and the serve's flight from the server's hand to
// where it lands. Units are metres.

export const thin = { fill: "none", stroke: "currentColor", strokeWidth: 0.75, vectorEffect: "non-scaling-stroke" } as const
export const medium = { ...thin, strokeWidth: 1.6 } as const
export const faint = { ...thin, strokeWidth: 0.5, strokeOpacity: 0.45 } as const
export const dashed = { ...thin, strokeDasharray: "4 3" } as const
export const label = {
  fontFamily: "var(--font-sans), ui-sans-serif, system-ui, sans-serif",
  fontSize: 0.6,
  fontWeight: 700,
  letterSpacing: "0.04em",
  fill: "currentColor",
} as const
export const small = { ...label, fontSize: 0.42, fontWeight: 600 } as const
// the two tones of a match court: the court a shade darker than the run-off round it, as on every broadcast court
export const tone = { court: { fill: "currentColor", fillOpacity: 0.07 }, run: { fill: "currentColor", fillOpacity: 0.025 } } as const

export const f = (n: number) => +n.toFixed(3)
export const mm = (m: number) => Math.round(m * 1000).toLocaleString("en-US")
export const rect = (x0: number, y0: number, x1: number, y1: number) => ({ x: f(x0), y: f(y0), width: f(x1 - x0), height: f(y1 - y0) })

export function Dimension({ x0, x1, y }: { x0: number; x1: number; y: number }) {
  const tick = 0.17
  return (
    <g>
      <line x1={x0} x2={x1} y1={y} y2={y} {...thin} />
      {[x0, x1].map((x) => <line key={x} x1={f(x - tick)} x2={f(x + tick)} y1={f(y + tick)} y2={f(y - tick)} {...thin} />)}
      <text x={f((x0 + x1) / 2)} y={f(y - 0.2)} textAnchor="middle" style={small}>{mm(x1 - x0)}</text>
    </g>
  )
}
// the same, standing: the text turned to read up the page
export function DimensionUp({ y0, y1, x }: { y0: number; y1: number; x: number }) {
  const tick = 0.17
  const cy = f((y0 + y1) / 2)
  return (
    <g>
      <line x1={x} x2={x} y1={y0} y2={y1} {...thin} />
      {[y0, y1].map((y) => <line key={y} x1={f(x - tick)} x2={f(x + tick)} y1={f(y + tick)} y2={f(y - tick)} {...thin} />)}
      <text x={f(x - 0.2)} y={cy} textAnchor="middle" transform={`rotate(-90 ${f(x - 0.2)} ${cy})`} style={small}>{mm(y1 - y0)}</text>
    </g>
  )
}

// A player: a disc drawn larger than life so it reads, open for one side and filled for the other, its number inside
export function Player({ x, y, n, filled = false, r = 0.42 }: { x: number; y: number; n?: number | string; filled?: boolean; r?: number }) {
  return (
    <g>
      <circle cx={f(x)} cy={f(y)} r={r} {...thin} strokeWidth={1.2} fill={filled ? "currentColor" : "var(--background)"} />
      {n !== undefined && (
        <text x={f(x)} y={f(y + r * 0.38)} textAnchor="middle" style={{ ...label, fontSize: r * 1.05, letterSpacing: 0, fill: filled ? "var(--background)" : "currentColor" }}>{n}</text>
      )}
    </g>
  )
}

// The serve: the ball at the server's hand, its flight dashed and bowed the way it curves on camera, an arrowhead
// at the bounce and a ring where it lands
export function Serve({ from, to, bow = 2, ball = 0.13 }: { from: readonly number[]; to: readonly number[]; bow?: number; ball?: number }) {
  const [x0, y0] = from, [x1, y1] = to
  const len = Math.hypot(x1 - x0, y1 - y0)
  // the control point sits off the middle of the chord, square to it
  const cx = (x0 + x1) / 2 - ((y1 - y0) / len) * bow, cy = (y0 + y1) / 2 + ((x1 - x0) / len) * bow
  const a = Math.atan2(y1 - cy, x1 - cx), h = 0.45, s = 0.2
  const tip = [x1 - Math.cos(a) * 0.3, y1 - Math.sin(a) * 0.3]
  const head = [
    tip,
    [tip[0] - Math.cos(a) * h - Math.sin(a) * s, tip[1] - Math.sin(a) * h + Math.cos(a) * s],
    [tip[0] - Math.cos(a) * h + Math.sin(a) * s, tip[1] - Math.sin(a) * h - Math.cos(a) * s],
  ].map((p) => p.map(f).join(",")).join(" ")
  return (
    <g>
      <path d={`M${f(x0)},${f(y0)} Q${f(cx)},${f(cy)} ${f(tip[0])},${f(tip[1])}`} {...thin} strokeWidth={1.1} strokeDasharray="6 4" />
      <polygon points={head} fill="currentColor" />
      <circle cx={f(x1)} cy={f(y1)} r={0.3} {...thin} />
      <circle cx={f(x0)} cy={f(y0)} r={ball} {...thin} fill="var(--background)" />
    </g>
  )
}
