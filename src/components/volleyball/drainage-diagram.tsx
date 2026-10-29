// Where the court's rain goes, drawn inline so it runs full width and follows the theme: the levelled plane in two long
// sections, along the court's 24 m and across its 15 m, each falling at most the rules' 5 mm a metre, the rain soaking
// into the grass and the rest running off onto the lawn beyond the free zone. Heights are drawn twenty times the length
// scale, or the fall would not show. Every number comes from volleyball.json (court, surface, drainage).

const W = 1600
const H = 470
const WATER = "#2f7ed8"

export function CourtDrainageDiagram({ length, width, fall }: { length: number; width: number; fall: number }) {
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
          <tspan className="fill-foreground font-semibold">{name}</tspan> {span} m, falling at most 1 in {Math.round(1 / fall)}: up to {Math.round(drop * 1000)} mm from end to end
        </text>
        <text x={x1 + 70} y={surf(span) + 24} stroke="none" className="fill-muted-foreground text-[13px]">onto the lawn</text>
      </g>
    )
  }
  return (
    <svg viewBox={`0 0 ${W} ${H}`} role="img" className="stroke-foreground h-auto w-full min-w-[960px]"
      strokeWidth={2} strokeLinecap="round" fill="none"
      aria-label={`Drainage of the court: the ${length} by ${width} m playing area is levelled to one plane falling no more than ${fall * 1000} mm a metre, the way the lawn already falls; rain soaks into the grass and a heavy shower runs off across it onto the lawn beyond the free zone. Along the ${length} m that is up to ${Math.round(length * fall * 1000)} mm, across the ${width} m up to ${Math.round(width * fall * 1000)} mm.`}>
      {section(180, length, "Along the court")}
      {section(360, width, "Or across it")}
      <text x={1160} y={300} stroke="none" className="fill-muted-foreground text-[14px]">
        <tspan x={1160} dy={0}>One plane, falling one way: which way is read on site.</tspan>
        <tspan x={1160} dy={22}>No drain under the court; the grass takes the rain.</tspan>
        <tspan x={1160} dy={22}>If water lies after the first rains: a gravel</tspan>
        <tspan x={1160} dy={22}>trench along the low side, not part of the build.</tspan>
      </text>
      <text x={60} y={H - 16} stroke="none" className="fill-muted-foreground text-[14px]">
        Heights drawn twenty times the length scale · design intent, the lawn&rsquo;s fall not measured yet
      </text>
    </svg>
  )
}
