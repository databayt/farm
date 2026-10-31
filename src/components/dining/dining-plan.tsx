import { getWords } from "@/components/internationalization/words"
import { HDim, Name, Note, VDim } from "@/components/drawing/dims"
import { frame } from "@/components/drawing/geometry"

import dining from "./dining.json"
import { words } from "./words"

// The dining area drawn in the camp plan's pattern (src/components/camp/camp-plan.tsx): thin lines, no colour, the
// dimensions as the studio's plan sets them. The front wall faces down the page, toward the viewer of the 3D's front
// view; west is left. The mud-brick wall is hatched solid, the arches and the ridge pole overhead are dashed, the
// thatch's eave a faint line outside the wall. Units are metres, the middle at 0,0, y toward the front wall.

const { wall, frame: arch, thatch, tables, bench, counter } = dining
const thin = { fill: "none", stroke: "currentColor", strokeWidth: 0.75, vectorEffect: "non-scaling-stroke" } as const
const medium = { ...thin, strokeWidth: 1.8 } as const
const faint = { ...thin, strokeWidth: 0.5, strokeOpacity: 0.5 } as const
const dashed = { ...thin, strokeDasharray: "5 4", strokeOpacity: 0.6 } as const

const f = (n: number) => +n.toFixed(3)
const box = (x0: number, y0: number, x1: number, y1: number) => ({ x: f(x0), y: f(y0), width: f(x1 - x0), height: f(y1 - y0) })

const L2 = wall.length / 2, W2 = wall.width / 2, t = wall.t, dw = wall.door.w / 2
const IX = L2 - t, IY = W2 - t
const E = W2 + thatch.eave
const archXs = Array.from({ length: arch.arches }, (_, i) => -L2 + t / 2 + (i * (wall.length - t)) / (arch.arches - 1))
// the drawing, then how far its dimensions reach past it (studio mm): two tiers above and below, the name right
const { k, viewBox } = frame({ x0: -L2, y0: -E, x1: L2, y1: E }, { top: 14, right: 26, bottom: 14, left: 14 })

// `title` (the drawing's accessible name) defaults to the page's; the docs pass the guide's own.
export async function DiningPlan({ title, className }: { title?: string; className?: string }) {
  const w = await getWords(words)
  const name = w.plan.labels
  title ??= w.plan.title
  const benchY = (s: number) => [s * (tables.y - tables.w / 2 - bench.gap - bench.w / 2), s * (tables.y + tables.w / 2 + bench.gap + bench.w / 2)]
  const x0 = tables.x - tables.l / 2, x1 = tables.x + tables.l / 2
  const seat = tables.l / tables.seats
  return (
    <svg viewBox={viewBox} role="img" aria-label={title} className={className}>
      {/* The thatch's eave outside the long walls, and its ends over the end walls */}
      <rect {...box(-L2 - 0.15, -E, L2 + 0.15, E)} {...faint} />

      {/* The mud-brick wall, solid, the door a gap in the east end */}
      <path {...medium} fillRule="evenodd" fill="currentColor" fillOpacity={0.18}
        d={`M${-L2} ${-W2}H${L2}V${-dw}H${f(IX)}V${-IY}H${-IX}V${IY}H${f(IX)}V${dw}H${L2}V${W2}H${-L2}Z`} />
      <line x1={L2} x2={L2} y1={-dw} y2={dw} {...dashed} />

      {/* Overhead: the arches across, the ridge pole along the crown, dashed */}
      {archXs.map((x) => <line key={x} x1={f(x)} x2={f(x)} y1={-W2 + t / 2} y2={W2 - t / 2} {...dashed} />)}
      <line x1={-L2 + 0.05} x2={L2 - 0.05} y1={0} y2={0} {...dashed} />

      {/* The serving counter against the west wall */}
      <rect {...box(-IX, -counter.l / 2, -IX + counter.w, counter.l / 2)} {...thin} fill="var(--background)" />
      {[-0.7, 0, 0.7].map((y) => <circle key={y} cx={f(-IX + counter.w / 2)} cy={y} r={0.16} {...faint} />)}

      {/* Two long tables, a bench each side, the seats ticked along the benches */}
      {[-1, 1].map((s) => (
        <g key={s}>
          <rect {...box(x0, s * tables.y - tables.w / 2, x1, s * tables.y + tables.w / 2)} {...thin} fill="var(--background)" />
          {benchY(s).map((by) => (
            <g key={by}>
              <rect {...box(x0, by - bench.w / 2, x1, by + bench.w / 2)} {...thin} fill="var(--background)" />
              {Array.from({ length: tables.seats - 1 }, (_, i) => f(x0 + (i + 1) * seat)).map((x) => (
                <line key={x} x1={x} x2={x} y1={f(by - bench.w / 2)} y2={f(by + bench.w / 2)} {...faint} />
              ))}
            </g>
          ))}
        </g>
      ))}

      <Note k={k} x={tables.x} y={-tables.y}>{name.table}</Note>
      <Note k={k} x={tables.x} y={tables.y}>{name.table}</Note>
      <Note k={k} x={f(-IX + counter.w / 2)} y={0} rotate={-90}>{name.counter}</Note>
      <Note k={k} x={f((x1 + IX) / 2)} y={0}>{name.door}</Note>
      <Name k={k} x={L2 + 0.4} y={0} anchor="start">{name.dining}</Name>

      {/* The outline overall, the inside clear, the door and the tables */}
      <HDim k={k} x0={-L2} x1={L2} y={-E} side="top" at={2} />
      <HDim k={k} x0={x0} x1={x1} y={-E} side="top" at={1} prefix={name.tableDim} />
      <VDim k={k} y0={-W2} y1={W2} x={-L2} side="left" at={2} />
      <VDim k={k} y0={-IY} y1={IY} x={-L2} side="left" at={1} prefix={name.insideDim} />
      <HDim k={k} x0={-IX} x1={IX} y={E} side="bottom" at={2} prefix={name.insideDim} />
    </svg>
  )
}
