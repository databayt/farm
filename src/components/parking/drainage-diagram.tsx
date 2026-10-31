// Where the parking's rain goes, drawn inline in the field's water diagram's pattern so it runs full width and follows
// the theme: a long section along the lot from its open east end to the west, the gravel on its compacted base over a
// geotextile, in its timber edging, falling 1 in 100 (D-065), the gravel trench across the west end and the soakaway pit
// it drains to (shown beyond the trench's end). Every depth and fall comes from parking.json build and drainage; heights
// are drawn about four times the length scale so the layers read. The water's colours match the 3D drawing below it.

export const DRAIN_COLOUR = { fall: "#2f7ed8", trench: "#1d4e89", pit: "#5fb0ea" }

type Build = { dig: number; base: number; gravel: number }
type Edging = { w: number; h: number }
type Drainage = { lot: number; turn: number; road: number; trench: { w: number; depth: number; pipe: number; x: number }; pit: { size: number; depth: number } }

import type * as React from "react"

import { getWords } from "@/components/internationalization/words"

import { words } from "./words"

const W = 1600
const H = 540

export async function DrainageDiagram({ box, build, edging, drainage }: {
  box: number[]; build: Build; edging: Edging; drainage: Drainage
}): Promise<React.JSX.Element> {
  const w = (await getWords(words)).drainage.diagram
  const notes = w.notes(Math.round(1 / drainage.turn), Math.round(1 / drainage.road))
  const [x0, , x1] = box
  const HS = 47, VS = 200 // px a metre along, and down (about four times)
  const left = 4.2 // the section's west end, in plan metres
  const X = (x: number) => 80 + (x - left) * HS
  const top = 170 // the lot's west end at its surface
  const S = (x: number) => top - (Math.max(x0, Math.min(x1, x)) - x0) * drainage.lot * VS // the lot's surface
  const layers: [string, number, string][] = [[w.layers[0], build.gravel, "fill-muted"], [w.layers[1], build.base, "fill-muted-foreground/25"]]
  const t = drainage.trench, p = drainage.pit
  const tx0 = X(t.x - t.w / 2), tx1 = X(t.x + t.w / 2)
  const px0 = X(5.4), px1 = X(5.4 + p.size)
  const water = (d: string, w = 3.5) => <path d={d} style={{ stroke: DRAIN_COLOUR.fall }} strokeWidth={w} strokeLinejoin="round" />
  const depth = layers.map((_, i) => layers.slice(0, i).reduce((n, l) => n + l[1], 0)) // each layer's top, below the surface
  return (
    <svg viewBox={`0 0 ${W} ${H}`} role="img" className="stroke-foreground h-auto w-full min-w-[960px]"
      strokeWidth={2} strokeLinecap="round" fill="none"
      aria-label={w.label(Math.round(build.gravel * 1000), Math.round(build.base * 1000), Math.round(1 / drainage.lot), Math.round(t.w * 1000), Math.round(t.depth * 1000), Math.round(t.pipe * 1000), p.size, p.depth)}>
      {/* the layers, west to east, parallel to the falling surface */}
      {layers.map(([name, h, cls], i) => {
        const a = depth[i], b = depth[i] + h
        const pts = `${X(x0)},${S(x0) + a * VS} ${X(x1)},${S(x1) + a * VS} ${X(x1)},${S(x1) + b * VS} ${X(x0)},${S(x0) + b * VS}`
        return (
          <g key={name}>
            <polygon points={pts} className={cls} strokeWidth={1.2} />
            {/* labels spread apart, each on a leader to its layer, since the thin ones are a few pixels deep */}
            <path d={`M${X(x1) + 4} ${S(x1) + ((a + b) / 2) * VS} L${X(x1) + 30} ${S(x1) + [-14, 14, 46][i]}`} strokeWidth={1} className="stroke-muted-foreground" />
            <text x={X(x1) + 36} y={S(x1) + [-14, 14, 46][i] + 5} stroke="none" className="fill-muted-foreground text-[13px]">
              <tspan className="fill-foreground font-semibold">{name}</tspan> {Math.round(h * 1000)} mm
            </text>
          </g>
        )
      })}
      {/* the timber edging at each end, its top a little above the gravel */}
      {[x0, x1 - edging.w].map((x) => (
        <rect key={x} x={X(x) - 1} y={S(x === x0 ? x0 : x1) + (build.dig - edging.h) * VS - 2} width={Math.max(edging.w * HS, 3) + 2} height={edging.h * VS + 2} className="fill-foreground/70" stroke="none" />
      ))}
      {/* the ground: the lawn either side; the geotextile along the dug floor, on its own leader */}
      <path d={`M60 ${top} H${X(x0)} M${X(x1)} ${S(x1)} H${X(x1) + 22}`} strokeWidth={2} />
      <path d={`M${X(x0)} ${S(x0) + build.dig * VS} L${X(x1)} ${S(x1) + build.dig * VS}`} strokeDasharray="2 6" strokeWidth={1.2} />
      <path d={`M${X(x1) + 4} ${S(x1) + build.dig * VS} L${X(x1) + 30} ${S(x1) + 46}`} strokeWidth={1} className="stroke-muted-foreground" />
      <text x={X(x1) + 36} y={S(x1) + 51} stroke="none" className="fill-muted-foreground text-[13px]">
        <tspan className="fill-foreground font-semibold">{w.layers[2]}</tspan>
      </text>

      {/* rain on the gravel, some of it soaking in, then the fall to the west */}
      {[10, 13, 16, 19, 22, 25, 28].map((x) => (
        <g key={x}>{water(`M${X(x)} ${S(x) - 70} V${S(x) + (build.gravel + build.base / 3) * VS}`, 2)}
          <path d={`M${X(x) - 6} ${S(x) - 18} L${X(x)} ${S(x) - 8} L${X(x) + 6} ${S(x) - 18}`} style={{ stroke: DRAIN_COLOUR.fall }} strokeWidth={2} /></g>
      ))}
      {water(`M${X(27)} ${S(27) - 100} L${X(12)} ${S(12) - 100}`)}
      <path d={`M${X(12) + 14} ${S(12) - 110} L${X(12)} ${S(12) - 100} L${X(12) + 14} ${S(12) - 90}`} style={{ stroke: DRAIN_COLOUR.fall }} strokeWidth={3.5} />
      <text x={X(19.5)} y={S(19.5) - 116} textAnchor="middle" stroke="none" className="fill-foreground text-[15px] font-semibold">
        {w.f1(Math.round(1 / drainage.lot), Math.round((x1 - x0) * drainage.lot * 1000), x1 - x0)}
      </text>
      <text x={X(19.5)} y={S(19.5) + (build.dig + 0.18) * VS} textAnchor="middle" stroke="none" className="fill-muted-foreground text-[13px]">
        <tspan className="fill-foreground font-semibold">P</tspan> {w.p}
      </text>

      {/* the trench across the west end, and its pipe on to the pit */}
      <rect x={tx0} y={top} width={tx1 - tx0} height={t.depth * VS} className="fill-muted" strokeDasharray="5 4" style={{ stroke: DRAIN_COLOUR.trench }} />
      <circle cx={(tx0 + tx1) / 2} cy={top + t.depth * VS - 18} r={(t.pipe * VS) / 2} className="fill-background" style={{ stroke: DRAIN_COLOUR.trench }} strokeWidth={3} />
      <path d={`M${(tx0 + tx1) / 2} ${top + t.depth * VS - 18} H${px1}`} style={{ stroke: DRAIN_COLOUR.trench }} strokeWidth={4} />
      <text x={tx1 + 10} y={top + t.depth * VS + 26} stroke="none" className="fill-muted-foreground text-[13px]">
        <tspan className="fill-foreground font-semibold">T1</tspan> {w.t1(Math.round(t.w * 1000), Math.round(t.depth * 1000), Math.round(t.pipe * 1000))}
      </text>

      {/* the soakaway pit, beyond the trench's end */}
      <rect x={px0} y={top} width={px1 - px0} height={p.depth * VS} className="fill-muted" style={{ stroke: DRAIN_COLOUR.pit }} strokeWidth={3} />
      <rect x={px0 - 6} y={top - 10} width={px1 - px0 + 12} height={10} className="fill-foreground/70" stroke="none" />
      <text x={(px0 + px1) / 2} y={top + p.depth * VS + 26} textAnchor="middle" stroke="none" className="fill-muted-foreground text-[13px]">
        <tspan className="fill-foreground font-semibold">SK</tspan> {w.sk(p.size, p.depth)}
      </text>

      <text x={60} y={H - 46} stroke="none" className="fill-muted-foreground text-[14px]">
        {notes[0]}
      </text>
      <text x={60} y={H - 22} stroke="none" className="fill-muted-foreground text-[14px]">
        {notes[1]}
      </text>
    </svg>
  )
}
