import type * as React from "react"

import { dimension, mm, STUDIO, tier, type DimGeom, type Pt } from "./geometry"

// Every plan's dimensions, drawn as the studio's plan draws them (geometry.ts), in the text colour so that a plan
// needs no invert in the dark: the studio's #555 extension lines, #333 dimension lines and #111 ticks and figures
// become the text colour at falling strengths. Plain server components; k is the plan's scaleFor(width, height).

const font = "var(--font-sans), ui-sans-serif, system-ui, sans-serif"
const stroke = (opacity: number, width: number) =>
  ({ fill: "none", stroke: "currentColor", strokeOpacity: opacity, strokeWidth: width, vectorEffect: "non-scaling-stroke" }) as const
const EXT = stroke(0.55, 0.6), LINE = stroke(0.75, 0.8), TICK = stroke(0.95, 1.3)

type Side = "top" | "bottom" | "left" | "right"

function Drawn({ g, label, value }: { g: DimGeom; label: string; value: number }): React.JSX.Element {
  const { at, angle, size, inline } = g.text
  return (
    <g data-dim="" data-mm={Math.round(value * 1000)}>
      {g.ext.map(([p, q], i) => <line key={`e${i}`} x1={p[0]} y1={p[1]} x2={q[0]} y2={q[1]} {...EXT} />)}
      {g.line.map(([p, q], i) => <line key={`l${i}`} x1={p[0]} y1={p[1]} x2={q[0]} y2={q[1]} {...LINE} />)}
      {g.ticks.map(([p, q], i) => <line key={`t${i}`} x1={p[0]} y1={p[1]} x2={q[0]} y2={q[1]} {...TICK} />)}
      <text x={at[0]} y={at[1]} fontSize={size} fontFamily={font} fontWeight={500} fill="currentColor" textAnchor="middle"
        dominantBaseline={inline ? "central" : "auto"} transform={angle ? `rotate(${angle} ${at[0]} ${at[1]})` : undefined}>
        {label}
      </text>
    </g>
  )
}

/** A dimension from a to b, its line `off` studio millimetres to the left of a→b. */
export function Dim({ k, a, b, off, label, size = STUDIO.figure }: {
  k: number; a: Pt; b: Pt; off: number; label?: string; size?: number
}): React.JSX.Element {
  const value = Math.hypot(b[0] - a[0], b[1] - a[1])
  const text = label ?? mm(value)
  return <Drawn g={dimension(a, b, off, k, text, size)} label={text} value={value} />
}

/** A horizontal dimension of the edge at y from x0 to x1, drawn above or below it at a tier (1, 2, 3 …). */
export function HDim({ k, x0, x1, y, side = "bottom", at = 1, label, prefix, size = STUDIO.figure }: {
  k: number; x0: number; x1: number; y: number; side?: "top" | "bottom"; at?: number; label?: string; prefix?: string; size?: number
}): React.JSX.Element {
  const [a, b] = x0 < x1 ? [x0, x1] : [x1, x0]
  const off = (side === "bottom" ? 1 : -1) * tier(at)
  const text = label ?? `${prefix ? `${prefix} ` : ""}${mm(b - a)}`
  return <Drawn g={dimension([a, y], [b, y], off, k, text, size)} label={text} value={b - a} />
}

/** A vertical dimension of the edge at x from y0 to y1, drawn left or right of it at a tier; it reads down the page. */
export function VDim({ k, y0, y1, x, side = "left", at = 1, label, prefix, size = STUDIO.figure }: {
  k: number; y0: number; y1: number; x: number; side?: "left" | "right"; at?: number; label?: string; prefix?: string; size?: number
}): React.JSX.Element {
  const [a, b] = y0 < y1 ? [y0, y1] : [y1, y0]
  const off = (side === "left" ? 1 : -1) * tier(at)
  const text = label ?? `${prefix ? `${prefix} ` : ""}${mm(b - a)}`
  return <Drawn g={dimension([x, a], [x, b], off, k, text, size)} label={text} value={b - a} />
}

/**
 * A chain along one edge: a dimension between each pair of neighbours in `at`, the names (bold capitals) beyond the
 * line over each piece, then the overall at the next tier when `overall` is set, as the studio's zone chain on its
 * back wall. `along` is the axis the chain runs on; `edge` the other coordinate of the measured edge.
 */
export function Chain({ k, along, at, edge, side, tier: t = 1, names, overall = false, size = STUDIO.figure }: {
  k: number; along: "x" | "y"; at: readonly number[]; edge: number; side: Side; tier?: number
  names?: readonly (string | null)[]; overall?: boolean; size?: number
}): React.JSX.Element {
  const pieces = at.slice(1).map((v, i) => [at[i], v] as const)
  const nameOff = (tier(t) + STUDIO.names) * k * (side === "top" || side === "left" ? -1 : 1)
  return (
    <g>
      {pieces.map(([p, q], i) => along === "x"
        ? <HDim key={i} k={k} x0={p} x1={q} y={edge} side={side === "top" ? "top" : "bottom"} at={t} size={size} />
        : <VDim key={i} k={k} y0={p} y1={q} x={edge} side={side === "right" ? "right" : "left"} at={t} size={size} />)}
      {names?.map((n, i) => {
        if (!n || !pieces[i]) return null
        const mid = (pieces[i][0] + pieces[i][1]) / 2
        return along === "x"
          ? <Name key={`n${i}`} k={k} x={mid} y={edge + nameOff}>{n}</Name>
          : <Name key={`n${i}`} k={k} x={edge + nameOff} y={mid} rotate={90}>{n}</Name>
      })}
      {overall && (along === "x"
        ? <HDim k={k} x0={at[0]} x1={at[at.length - 1]} y={edge} side={side === "top" ? "top" : "bottom"} at={t + 1} size={size} />
        : <VDim k={k} y0={at[0]} y1={at[at.length - 1]} x={edge} side={side === "right" ? "right" : "left"} at={t + 1} size={size} />)}
    </g>
  )
}

/** A name on the plan in the studio's bold capitals (2.6 studio mm), centred on its point. */
export function Name({ k, x, y, children, size = STUDIO.name, anchor = "middle", rotate }: {
  k: number; x: number; y: number; children: React.ReactNode; size?: number; anchor?: "start" | "middle" | "end"; rotate?: number
}): React.JSX.Element {
  return (
    <text x={+x.toFixed(4)} y={+y.toFixed(4)} fontSize={+(size * k).toFixed(4)} fontFamily={font} fontWeight={700}
      letterSpacing="0.04em" fill="currentColor" textAnchor={anchor} dominantBaseline="central"
      transform={rotate ? `rotate(${rotate} ${+x.toFixed(4)} ${+y.toFixed(4)})` : undefined}>
      {children}
    </text>
  )
}

/** A note on the plan, smaller and lighter than a name (2.2 studio mm). */
export function Note({ k, x, y, children, anchor = "middle", rotate }: {
  k: number; x: number; y: number; children: React.ReactNode; anchor?: "start" | "middle" | "end"; rotate?: number
}): React.JSX.Element {
  return (
    <text x={+x.toFixed(4)} y={+y.toFixed(4)} fontSize={+(STUDIO.inner * k).toFixed(4)} fontFamily={font} fontWeight={600}
      fill="currentColor" textAnchor={anchor} dominantBaseline="central"
      transform={rotate ? `rotate(${rotate} ${+x.toFixed(4)} ${+y.toFixed(4)})` : undefined}>
      {children}
    </text>
  )
}
