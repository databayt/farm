// The way in's lighting drawn inline, in the field's water diagram's pattern (src/components/farming/water-diagram.tsx),
// so it runs full width and follows the theme: the compound's board, the feed down the rock road in its duct, the box on
// the back of the sign wall, and from it the sign's letters and the outer gate's lantern. The routes and the box come
// from parking.json lighting; a line's colour is what it carries, as in the 3D drawing below it, and every line carries
// its tag, so colour never works alone.

export const LIGHT_COLOUR = { feed: "#1d4e89", lamp: "#2f7ed8", sign: "#d9822b" }

const W = 1600
const H = 470

function Unit({ x, y, title, sub, sub2, dashed = false, muted = false, w = 200 }: {
  x: number; y: number; title: string; sub?: string; sub2?: string; dashed?: boolean; muted?: boolean; w?: number
}) {
  return (
    <g>
      <rect x={x - w / 2} y={y} width={w} height={sub2 ? 82 : 62} rx={10} strokeDasharray={dashed ? "6 6" : undefined}
        className={muted ? "fill-muted" : "fill-background"} />
      <text x={x} y={y + 26} textAnchor="middle" stroke="none" className="fill-foreground text-[16px] font-semibold">{title}</text>
      {sub ? <text x={x} y={y + 47} textAnchor="middle" stroke="none" className="fill-muted-foreground text-[13px]">{sub}</text> : null}
      {sub2 ? <text x={x} y={y + 66} textAnchor="middle" stroke="none" className="fill-muted-foreground text-[13px]">{sub2}</text> : null}
    </g>
  )
}

export function LightingDiagram({ feedM, lampM }: { feedM: number; lampM: number }) {
  const line = (kind: keyof typeof LIGHT_COLOUR, d: string) => (
    <path d={d} style={{ stroke: LIGHT_COLOUR[kind] }} strokeWidth={4} strokeLinejoin="round" />
  )
  const label = (id: string, sub: string, x: number, y: number, anchor: "start" | "middle" | "end" = "start") => (
    <text x={x} y={y} textAnchor={anchor} stroke="none" className="fill-muted-foreground text-[13px]">
      <tspan className="fill-foreground font-semibold">{id}</tspan> {sub}
    </text>
  )
  const key: [keyof typeof LIGHT_COLOUR, string, number][] = [["feed", "Feed, 230 V", 820], ["lamp", "Lantern circuit, 230 V", 990], ["sign", "Letters, 24 V", 1210]]
  const Y = 170 // the main row
  return (
    <svg viewBox={`0 0 ${W} ${H}`} role="img" className="stroke-foreground h-auto w-full min-w-[960px]"
      strokeWidth={2} strokeLinecap="round" fill="none"
      aria-label={`Lighting diagram: the outdoor-lights circuit leaves the compound's board through its RCD and breaker, runs about ${feedM} m in a buried duct down the rock road and across under the parking to a weatherproof box on the back of the sign wall; the box holds an isolator, a dusk-to-dawn photocell with a timer and the 24 V driver for the sign's LED letters, and sends a cable about ${lampM} m behind the hedge to the lantern on the outer gate's left pillar. The inner gate's lantern is on the same circuit.`}>
      {key.map(([k, text, x]) => (
        <g key={k} transform={`translate(${x} 40)`}>
          <line x1={0} y1={0} x2={26} y2={0} strokeWidth={4} style={{ stroke: LIGHT_COLOUR[k] }} />
          <text x={36} y={5} stroke="none" className="fill-foreground text-[15px]">{text}</text>
        </g>
      ))}

      {/* the compound's board: where the circuit starts and is protected */}
      <Unit x={150} y={Y - 41} title="Compound board" sub="RCD 30 mA + breaker" sub2="outdoor-lights circuit" dashed w={220} />
      {line("feed", `M260 ${Y} H560`)}
      {/* the inner gate's lantern, teed off on the way */}
      {line("lamp", `M420 ${Y} V${Y + 120}`)}
      <circle cx={420} cy={Y} r={5} stroke="none" style={{ fill: LIGHT_COLOUR.feed }} />
      <Unit x={420} y={Y + 120} title="Lantern L2" sub="inner gate, right pillar" w={200} />
      {line("feed", `M560 ${Y} H760`)}
      {label("LF", "the feed, in a 50 mm duct 450 mm down", 470, Y - 18, "middle")}
      {label("LD", `about ${feedM} m from the inner gate, under bay 5's sett strip`, 470, Y - 38, "middle")}

      {/* the box on the back of the sign wall */}
      <rect x={760} y={Y - 70} width={300} height={140} rx={12} className="fill-muted" />
      <text x={910} y={Y - 42} textAnchor="middle" stroke="none" className="fill-foreground text-[16px] font-semibold">EB · box on the sign wall</text>
      {[["Isolator", Y - 20], ["Photocell + timer", Y + 10], ["24 V LED driver", Y + 40]].map(([t, y]) => (
        <g key={t}>
          <rect x={790} y={Number(y) - 4} width={240} height={26} rx={6} className="fill-background" />
          <text x={910} y={Number(y) + 14} textAnchor="middle" stroke="none" className="fill-foreground text-[13px]">{t}</text>
        </g>
      ))}

      {/* out of the box: the letters through the wall, the lantern behind the hedge */}
      {line("sign", `M1060 ${Y - 30} H1260`)}
      <Unit x={1370} y={Y - 61} title="SG · sign letters" sub="DIGITAL FARM, LED, 24 V" w={220} />
      {label("", "through the wall", 1160, Y - 42, "middle")}
      {line("lamp", `M1060 ${Y + 40} H1160 V${Y + 160} H1260`)}
      <Unit x={1370} y={Y + 129} title="L1 · lantern" sub="outer gate, left pillar" w={220} />
      {label("", `about ${lampM} m behind the hedge`, 1148, Y + 150, "end")}

      <text x={60} y={H - 46} stroke="none" className="fill-muted-foreground text-[14px]">
        On at dusk by the photocell; the timer can switch the sign off late at night while the lanterns stay on. Ducts with a
        draw wire and a warning tape over them; cables rise inside the pillars and the wall.
      </text>
      <text x={60} y={H - 22} stroke="none" className="fill-muted-foreground text-[14px]">
        Design intent: no lamp, driver or cable is sized or sourced yet, and the compound&rsquo;s board is designed with the farm&rsquo;s power (guide/trades/power.md)
      </text>
    </svg>
  )
}
