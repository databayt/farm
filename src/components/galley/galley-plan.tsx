import { getWords } from "@/components/internationalization/words"

import galley from "./galley.json"
import { words } from "./words"

// The galley drawn in the pattern of the office plan (src/components/office/office-plan.tsx): thin lines, no
// colour, bold capitals and dimensions in millimetres. Seen from the courtyard, as the 3D's front view: the
// doors and the windows face down the page (north), the staff door's end (west, the study room's side) to the
// left. Units are metres, x from the west end, y toward the front, the container's centre line at y = 0. It is
// long: the viewBox is wide.

const { container: box, front: fr, worktop: wt, basin, hooks, cold, dry, line, hood, bench, pass, cleaning, bins, plates } = galley
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
const small = { ...label, fontSize: 0.12, fontWeight: 600 } as const

const f = (n: number) => +n.toFixed(3)
const mm = (m: number) => Math.round(m * 1000).toLocaleString("en-US")
const rect = (x0: number, y0: number, x1: number, y1: number) => ({ x: f(x0), y: f(y0), width: f(x1 - x0), height: f(y1 - y0) })

function Dimension({ x0, x1, y }: { x0: number; x1: number; y: number }) {
  const tick = 0.08
  return (
    <g>
      <line x1={x0} x2={x1} y1={y} y2={y} {...thin} />
      {[x0, x1].map((x) => <line key={x} x1={f(x - tick)} x2={f(x + tick)} y1={f(y + tick)} y2={f(y - tick)} {...thin} />)}
      <text x={f((x0 + x1) / 2)} y={f(y - 0.09)} textAnchor="middle" style={small}>{mm(x1 - x0)}</text>
    </g>
  )
}
// the same, standing: the figure reads up the page beside the line
function Rise({ y0, y1, x }: { y0: number; y1: number; x: number }) {
  const tick = 0.08, my = f((y0 + y1) / 2)
  return (
    <g>
      <line x1={x} x2={x} y1={y0} y2={y1} {...thin} />
      {[y0, y1].map((y) => <line key={y} x1={f(x - tick)} x2={f(x + tick)} y1={f(y + tick)} y2={f(y - tick)} {...thin} />)}
      <text x={f(x + 0.1)} y={my} transform={`rotate(-90 ${f(x + 0.1)} ${my})`} textAnchor="middle" style={small}>{mm(y1 - y0)}</text>
    </g>
  )
}

// a window across the wall's thickness: the wall's lines knocked out, the reveal's lines and the glass between
function Window({ x0, x1, y0, y1 }: { x0: number; x1: number; y0: number; y1: number }) {
  return (
    <g>
      <rect {...rect(x0, y0 - 0.02, x1, y1 + 0.02)} fill="var(--background)" stroke="none" />
      {[x0, x1].map((x) => <line key={x} x1={x} x2={x} y1={y0} y2={y1} {...thin} />)}
      {[y0, (y0 + y1) / 2, y1].map((y) => <line key={y} x1={x0} x2={x1} y1={f(y)} y2={f(y)} {...thin} />)}
    </g>
  )
}

// a word on two lines, centred on x, the first line's baseline at y
function Stack({ x, y, words }: { x: number; y: number; words: string[] }) {
  return (
    <>
      {words.map((w, k) => <text key={w} x={f(x)} y={f(y + k * 0.15)} textAnchor="middle" style={small}>{w}</text>)}
    </>
  )
}

// `title` (the drawing's accessible name) defaults to the page's; the docs pass the guide's own.
export async function GalleyPlan({ title, className }: { title?: string; className?: string }) {
  const w = await getWords(words)
  const name = w.plan.labels
  title ??= w.plan.title
  const L = box.l, H = box.w / 2
  const { x0: ix0, x1: ix1, y0: iy0, y1: iy1 } = box.inner
  const [[s0, s1], [e0, e1]] = fr.doors
  const { d: sd, over } = fr.steps
  const wz = iy1 - wt.d // the worktop's front edge, on the aisle
  const bowls = wt.sinks.map((s) => ({ ...s, a: s.x - s.w / 2, b: s.x + s.w / 2, c0: wz + (wt.d - s.d) / 2 }))
  const lz = iy0 + line.d // the cooking line's front
  const [range, griddle, fryer] = line.units
  const rings = [1, 3, 5].flatMap((k) => [0.2, 0.44].map((dz) => [f(range.x0 + ((range.x1 - range.x0) * k) / 6), f(iy0 + dz)]))
  const bx0 = ix1 - bins.off - bins.d
  return (
    <svg viewBox="-0.75 -2.15 13.7 4.8" role="img" aria-label={title} className={className}>
      {/* The stone plinth, the steel box and its lining, cut for the two doors; the two windows across the
          front wall; a pair of stone steps up to each door */}
      <rect {...rect(-0.1, -H - 0.1, L + 0.1, H + 0.1)} {...faint} />
      <path d={`M${s0} ${f(H)}H0V${f(-H)}H${L}V${f(H)}H${e1}M${s1} ${f(H)}H${e0}`} {...medium} />
      <path d={`M${s0} ${iy1}H${ix0}V${iy0}H${ix1}V${iy1}H${e1}M${s1} ${iy1}H${e0}`} {...thin} />
      {[s0, s1, e0, e1].map((x) => <line key={x} x1={x} x2={x} y1={iy1} y2={f(H)} {...thin} />)}
      {fr.windows.map(([a, b]) => <Window key={a} x0={a} x1={b} y0={iy1} y1={f(H)} />)}
      {fr.doors.map(([a, b]) => (
        <g key={a}>
          <rect {...rect(a - over, H + 0.1, b + over, H + 0.1 + 2 * sd)} {...thin} />
          <line x1={f(a - over)} x2={f(b + over)} y1={f(H + 0.1 + sd)} y2={f(H + 0.1 + sd)} {...thin} />
        </g>
      ))}
      {/* both doors open in, hinged at the side nearer the end, their swings faint */}
      <line x1={s0} x2={s0} y1={iy1} y2={f(iy1 - (s1 - s0))} {...medium} />
      <path d={`M${s1} ${iy1}A${f(s1 - s0)} ${f(s1 - s0)} 0 0 0 ${s0} ${f(iy1 - (s1 - s0))}`} {...faint} />
      <line x1={e1} x2={e1} y1={iy1} y2={f(iy1 - (e1 - e0))} {...medium} />
      <path d={`M${e0} ${iy1}A${f(e1 - e0)} ${f(e1 - e0)} 0 0 1 ${e1} ${f(iy1 - (e1 - e0))}`} {...faint} />

      {/* The staff door's corner: the hand-wash basin, the apron hooks on the end wall */}
      <rect {...rect(basin.x0, iy1 - basin.d, basin.x1, iy1)} rx={0.04} {...thin} />
      <ellipse cx={f((basin.x0 + basin.x1) / 2)} cy={f(iy1 - basin.d / 2 + 0.02)} rx={0.15} ry={0.1} {...thin} />
      <line x1={f(ix0 + 0.04)} x2={f(ix0 + 0.04)} y1={hooks.y0} y2={hooks.y1} {...medium} />

      {/* The long worktop under the windows, its two sinks; the front edge turned down along the aisle */}
      <rect {...rect(wt.x0, wz, wt.x1, iy1)} {...thin} />
      <line x1={wt.x0} x2={wt.x1} y1={f(wz + 0.03)} y2={f(wz + 0.03)} {...faint} />
      {bowls.map((s) => <rect key={s.id} {...rect(s.a, s.c0, s.b, s.c0 + s.d)} rx={0.05} {...thin} />)}

      {/* Along the back wall: the freezer and the fridge, the dry store's shelving */}
      {cold.units.map((u) => (
        <g key={u.id}>
          <rect {...rect(u.x0, iy0, u.x1, iy0 + cold.d)} {...thin} />
          <line x1={f(u.x0 + 0.02)} x2={f(u.x1 - 0.02)} y1={f(iy0 + cold.d - 0.03)} y2={f(iy0 + cold.d - 0.03)} {...faint} />
        </g>
      ))}
      <rect {...rect(dry.x0, iy0, dry.x1, iy0 + dry.d)} {...thin} />
      <rect {...rect(dry.x0 + 0.03, iy0 + 0.03, dry.x1 - 0.03, iy0 + dry.d - 0.03)} {...faint} />

      {/* The cooking line: the range's six rings, the griddle's plate, the fryer's two baskets; the hood over
          them dashed, and the 900 mm aisle in front */}
      {line.units.map((u) => <rect key={u.id} {...rect(u.x0, iy0, u.x1, lz)} {...thin} />)}
      {rings.map(([x, y]) => (
        <g key={`${x}${y}`}>
          <circle cx={x} cy={y} r={0.085} {...thin} />
          <circle cx={x} cy={y} r={0.03} {...faint} />
        </g>
      ))}
      <rect {...rect(griddle.x0 + 0.05, iy0 + 0.05, griddle.x1 - 0.05, lz - 0.22)} {...faint} />
      {[0, 1].map((k) => {
        const w = (fryer.x1 - fryer.x0 - 0.15) / 2, a = fryer.x0 + 0.05 + k * (w + 0.05)
        return <rect key={k} {...rect(a, iy0 + 0.08, a + w, lz - 0.22)} {...faint} />
      })}
      <rect {...rect(hood.x0, iy0, hood.x1, iy0 + hood.d)} {...dashed} />

      {/* The cold bench, the pass with its gantry overhead (dashed), the cleaning cupboard */}
      <rect {...rect(bench.x0, iy0, bench.x1, iy0 + bench.d)} {...thin} />
      <rect {...rect(pass.x0, iy0, pass.x1, iy0 + pass.d)} {...thin} />
      <rect {...rect(pass.x0 + 0.03, iy0 + 0.02, pass.x1 - 0.03, iy0 + pass.shelf)} {...dashed} />
      <rect {...rect(cleaning.x0, iy0, cleaning.x1, iy0 + cleaning.d)} {...thin} />

      {/* The east end: two bins on the end wall, the plate cupboard in the corner by the service door */}
      {bins.y.map((y) => <rect key={y} {...rect(bx0, y - bins.w / 2, bx0 + bins.d, y + bins.w / 2)} rx={0.04} {...thin} />)}
      <rect {...rect(plates.x0, plates.y0, ix1, iy1)} {...thin} />

      <text x={f(basin.x0 + 0.05)} y={f(iy1 - basin.d - 0.1)} style={small}>{name.handWash}</text>
      <text x={f((wt.x0 + bowls[0].a) / 2)} y={f(wz + 0.37)} textAnchor="middle" style={small}>{name.harvest}</text>
      <Stack x={bowls[0].x} y={f(bowls[0].c0 + 0.2)} words={name.prepSink} />
      <text x={f((bowls[0].b + bowls[1].a) / 2)} y={f(wz + 0.37)} textAnchor="middle" style={small}>{name.prepBench}</text>
      <Stack x={bowls[1].x} y={f(bowls[1].c0 + 0.2)} words={name.washSink} />
      <text x={f((bowls[1].b + wt.x1) / 2)} y={f(wz + 0.37)} textAnchor="middle" style={small}>{name.dishDrop}</text>
      {cold.units.map((u) => (
        <text key={u.id} x={f((u.x0 + u.x1) / 2)} y={f(iy0 + cold.d / 2 + 0.04)} textAnchor="middle" style={small}>{name.units[u.id] ?? u.id.toUpperCase()}</text>
      ))}
      <text x={f((dry.x0 + dry.x1) / 2)} y={f(iy0 + dry.d / 2 + 0.04)} textAnchor="middle" style={small}>{name.dry}</text>
      {line.units.map((u) => (
        <text key={u.id} x={f((u.x0 + u.x1) / 2)} y={f(lz - 0.07)} textAnchor="middle" style={small}>{name.units[u.id] ?? u.id.toUpperCase()}</text>
      ))}
      <text x={f((hood.x0 + hood.x1) / 2)} y={f(iy0 + hood.d + 0.15)} textAnchor="middle" style={small}>{name.hood}</text>
      <text x={f((bench.x0 + bench.x1) / 2)} y={f(iy0 + 0.25)} textAnchor="middle" style={small}>{name.bench}</text>
      <text x={f((pass.x0 + pass.x1) / 2)} y={f(iy0 + pass.d - 0.1)} textAnchor="middle" style={small}>{name.pass}</text>
      <text x={f((cleaning.x0 + cleaning.x1) / 2)} y={f(iy0 + cleaning.d / 2 + 0.04)} textAnchor="middle" style={small}>{name.cleaning}</text>
      {bins.y.map((y) => <text key={y} x={f(bx0 + bins.d / 2)} y={f(y + 0.04)} textAnchor="middle" style={small}>{name.bin}</text>)}
      <text x={f((plates.x0 + ix1) / 2)} y={f((plates.y0 + iy1) / 2 + 0.04)} textAnchor="middle" style={small}>{name.plates}</text>
      <text x={f((s0 + s1) / 2)} y={f(H + 0.1 + 2 * sd + 0.2)} textAnchor="middle" style={small}>{name.staffDoor}</text>
      <text x={f((e0 + e1) / 2)} y={f(H + 0.1 + 2 * sd + 0.2)} textAnchor="middle" style={small}>{name.serviceDoor}</text>
      <text x={f(L / 2)} y={f(-H - 0.2)} textAnchor="middle" style={label}>{name.galley}</text>
      <Dimension x0={0} x1={L} y={f(-H - 0.6)} />
      <Dimension x0={wt.x0} x1={wt.x1} y={f(H + 0.1 + 2 * sd + 0.55)} />
      <Rise y0={f(-H)} y1={f(H)} x={f(L + 0.4)} />
      <Rise y0={f(lz)} y1={f(wz)} x={f(range.x0 + 0.22)} />
    </svg>
  )
}
