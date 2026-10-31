// Where the court's rain goes, drawn inline so it runs full width and follows the theme: the levelled plane in two long
// sections, along the court's 24 m and across its 15 m, each falling at most the rules' 5 mm a metre, the rain soaking
// into the grass and the rest running off onto the lawn beyond the free zone. Heights are drawn twenty times the length
// scale, or the fall would not show. Every number comes from volleyball.json (court, surface, drainage); the words
// are in words.tsx, in `lang`.

import type { Locale } from "@/components/internationalization/config"
import { words } from "@/components/volleyball/words"

const W = 1600
const H = 470
const WATER = "#2f7ed8"

export function CourtDrainageDiagram({ length, width, fall, lang = "en" }: { length: number; width: number; fall: number; lang?: Locale }) {
  const w = words[lang].drainageDiagram
  const S = 55, V = 20 * S // px a metre along, and up
  const section = (y: number, span: number, name: string) => {
    const x0 = 120, x1 = x0 + span * S, drop = span * fall
    const surf = (m: number) => y - (span - m) * fall * V // high at the start, falling to the end
    return (
      <g>
        <path d={`M${x0 - 60} ${surf(0)} H${x0} L${x1} ${surf(span)} H${x1 + 90}`} strokeWidth={2.5} />
        <path d={`M${x0} ${surf(0)} L${x1} ${surf(span)} L${x1} ${y + 26} L${x0} ${y + 26} Z`} className="fill-muted" stroke="none" />
        <path d={`M${x0} ${surf(0)} L${x1} ${surf(span)}`} strokeWidth={2.5} />
        {Array.from({ length: Math.floor(span / 3) }, (_, k) => 1.5 + k * 3).map((m) => (
          <path key={m} d={`M${x0 + m * S} ${surf(m) - 40} V${surf(m) + 16} M${x0 + m * S - 5} ${surf(m) + 6} L${x0 + m * S} ${surf(m) + 16} L${x0 + m * S + 5} ${surf(m) + 6}`}
            style={{ stroke: WATER }} strokeWidth={2} />
        ))}
        <path d={`M${x1 - 120} ${surf(span) - 18} L${x1 + 60} ${surf(span) - 6} M${x1 + 48} ${surf(span) - 14} L${x1 + 60} ${surf(span) - 6} L${x1 + 46} ${surf(span) + 1}`}
          style={{ stroke: WATER }} strokeWidth={3} />
        <text x={x0} y={y + 48} stroke="none" className="fill-muted-foreground text-[13px]">
          <tspan className="fill-foreground font-semibold">{name}</tspan>{w.section(span, Math.round(1 / fall), Math.round(drop * 1000))}
        </text>
        <text x={x1 + 70} y={surf(span) + 24} stroke="none" className="fill-muted-foreground text-[13px]">{w.onto}</text>
      </g>
    )
  }
  return (
    <svg viewBox={`0 0 ${W} ${H}`} role="img" className="stroke-foreground h-auto w-full min-w-[960px]"
      strokeWidth={2} strokeLinecap="round" fill="none"
      aria-label={w.aria(length, width, fall * 1000, Math.round(length * fall * 1000), Math.round(width * fall * 1000))}>
      {section(180, length, w.along)}
      {section(360, width, w.across)}
      <text x={1160} y={300} stroke="none" className="fill-muted-foreground text-[14px]">
        {w.notes.map((line, k) => <tspan key={k} x={1160} dy={k ? 22 : 0}>{line}</tspan>)}
      </text>
      <text x={60} y={H - 16} stroke="none" className="fill-muted-foreground text-[14px]">
        {w.footer}
      </text>
    </svg>
  )
}
