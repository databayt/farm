// The way in's lighting drawn inline, in the field's water diagram's pattern (src/components/farming/water-diagram.tsx),
// so it runs full width and follows the theme. Since D-065 every light runs on the sun and no cable crosses the
// ground: the bollards and the lanterns each carry their own panel, battery and dusk sensor, and only the sign has a
// kit of parts, its panel on the wall's cap charging a box on the wall's back that feeds the letters. A line's colour
// is what it carries, as in the 3D drawing below it, and every line carries its tag, so colour never works alone.

export const LIGHT_COLOUR = { solar: "#1d4e89", lamp: "#2f7ed8", sign: "#d9822b" }

import type * as React from "react"

import { getWords } from "@/components/internationalization/words"

import { words } from "./words"

const W = 1600
const H = 470

function Unit({ x, y, title, sub, sub2, muted = false, w = 200 }: {
  x: number; y: number; title: string; sub?: string; sub2?: string; muted?: boolean; w?: number
}): React.JSX.Element {
  return (
    <g>
      <rect x={x - w / 2} y={y} width={w} height={sub2 ? 82 : 62} rx={10} className={muted ? "fill-muted" : "fill-background"} />
      <text x={x} y={y + 26} textAnchor="middle" stroke="none" className="fill-foreground text-[16px] font-semibold">{title}</text>
      {sub ? <text x={x} y={y + 47} textAnchor="middle" stroke="none" className="fill-muted-foreground text-[13px]">{sub}</text> : null}
      {sub2 ? <text x={x} y={y + 66} textAnchor="middle" stroke="none" className="fill-muted-foreground text-[13px]">{sub2}</text> : null}
    </g>
  )
}

// a lamp that carries its own panel: a small sun over it, in the lamps' colour
function Sun({ x, y }: { x: number; y: number }): React.JSX.Element {
  return (
    <g style={{ stroke: LIGHT_COLOUR.lamp }} strokeWidth={2.5}>
      <circle cx={x} cy={y} r={9} className="fill-background" />
      {Array.from({ length: 8 }, (_, k) => {
        const a = (k * Math.PI) / 4
        return <line key={k} x1={x + Math.cos(a) * 14} y1={y + Math.sin(a) * 14} x2={x + Math.cos(a) * 20} y2={y + Math.sin(a) * 20} />
      })}
    </g>
  )
}

export async function LightingDiagram({ bollards, watts }: { bollards: number; watts: number }): Promise<React.JSX.Element> {
  const t = (await getWords(words)).lighting.diagram
  const line = (kind: keyof typeof LIGHT_COLOUR, d: string) => (
    <path d={d} style={{ stroke: LIGHT_COLOUR[kind] }} strokeWidth={4} strokeLinejoin="round" />
  )
  const label = (id: string, sub: string, x: number, y: number, anchor: "start" | "middle" | "end" = "start") => (
    <text x={x} y={y} textAnchor={anchor} stroke="none" className="fill-muted-foreground text-[13px]">
      <tspan className="fill-foreground font-semibold">{id}</tspan> {sub}
    </text>
  )
  const key: [keyof typeof LIGHT_COLOUR, string, number][] = [["solar", t.key.solar, 820], ["sign", t.key.sign, 1060]]
  const Y = 170 // the main row
  return (
    <svg viewBox={`0 0 ${W} ${H}`} role="img" className="stroke-foreground h-auto w-full min-w-[960px]"
      strokeWidth={2} strokeLinecap="round" fill="none"
      aria-label={t.label(bollards, watts)}>
      {key.map(([k, text, x]) => (
        <g key={k} transform={`translate(${x} 40)`}>
          <line x1={0} y1={0} x2={26} y2={0} strokeWidth={4} style={{ stroke: LIGHT_COLOUR[k] }} />
          <text x={36} y={5} stroke="none" className="fill-foreground text-[15px]">{text}</text>
        </g>
      ))}

      {/* the lights that carry their own panel, battery and dusk sensor: no line runs to them */}
      <Sun x={170} y={Y - 70} />
      <Unit x={170} y={Y - 41} title={t.bollards.title(bollards)} sub={t.bollards.sub} sub2={t.bollards.sub2} w={250} />
      <Sun x={460} y={Y - 70} />
      <Unit x={460} y={Y - 41} title={t.l1.title} sub={t.l1.sub} w={230} />
      <Unit x={460} y={Y + 69} title={t.l2.title} sub={t.l2.sub} w={230} />
      {label("", t.own, 315, Y + 190, "middle")}

      {/* the sign's kit: the panel on the cap charges the box on the wall's back, which feeds the letters */}
      <Unit x={690} y={Y - 41} title={t.sp.title(watts)} sub={t.sp.sub} w={190} />
      {line("solar", `M785 ${Y - 10} H880`)}
      <rect x={880} y={Y - 70} width={300} height={140} rx={12} className="fill-muted" />
      <text x={1030} y={Y - 42} textAnchor="middle" stroke="none" className="fill-foreground text-[16px] font-semibold">{t.box}</text>
      {[[t.parts[0], Y - 20], [t.parts[1], Y + 10], [t.parts[2], Y + 40]].map(([p, y]) => (
        <g key={p}>
          <rect x={910} y={Number(y) - 4} width={240} height={26} rx={6} className="fill-background" />
          <text x={1030} y={Number(y) + 14} textAnchor="middle" stroke="none" className="fill-foreground text-[13px]">{p}</text>
        </g>
      ))}
      {label("", t.dc, 832, Y + 14, "middle")}
      {line("sign", `M1180 ${Y + 23} H1290`)}
      <Unit x={1400} y={Y - 8} title={t.sg.title} sub={t.sg.sub} w={220} />
      {label("", t.wall, 1235, Y + 9, "middle")}

      <text x={60} y={H - 46} stroke="none" className="fill-muted-foreground text-[14px]">
        {t.notes[0]}
      </text>
      <text x={60} y={H - 22} stroke="none" className="fill-muted-foreground text-[14px]">
        {t.notes[1]}
      </text>
    </svg>
  )
}
