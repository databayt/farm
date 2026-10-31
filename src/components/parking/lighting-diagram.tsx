// The way in's lighting drawn inline, in the field's water diagram's pattern (src/components/farming/water-diagram.tsx),
// so it runs full width and follows the theme: the compound's board, the feed down the rock road in its duct, the box on
// the back of the sign wall, and from it the sign's letters and the outer gate's lantern. The routes and the box come
// from parking.json lighting; a line's colour is what it carries, as in the 3D drawing below it, and every line carries
// its tag, so colour never works alone.

export const LIGHT_COLOUR = { feed: "#1d4e89", lamp: "#2f7ed8", sign: "#d9822b" }

import { getWords } from "@/components/internationalization/words"

import { words } from "./words"

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

export async function LightingDiagram({ feedM, lampM }: { feedM: number; lampM: number }) {
  const t = (await getWords(words)).lighting.diagram
  const line = (kind: keyof typeof LIGHT_COLOUR, d: string) => (
    <path d={d} style={{ stroke: LIGHT_COLOUR[kind] }} strokeWidth={4} strokeLinejoin="round" />
  )
  const label = (id: string, sub: string, x: number, y: number, anchor: "start" | "middle" | "end" = "start") => (
    <text x={x} y={y} textAnchor={anchor} stroke="none" className="fill-muted-foreground text-[13px]">
      <tspan className="fill-foreground font-semibold">{id}</tspan> {sub}
    </text>
  )
  const key: [keyof typeof LIGHT_COLOUR, string, number][] = [["feed", t.key.feed, 820], ["lamp", t.key.lamp, 990], ["sign", t.key.sign, 1210]]
  const Y = 170 // the main row
  return (
    <svg viewBox={`0 0 ${W} ${H}`} role="img" className="stroke-foreground h-auto w-full min-w-[960px]"
      strokeWidth={2} strokeLinecap="round" fill="none"
      aria-label={t.label(feedM, lampM)}>
      {key.map(([k, text, x]) => (
        <g key={k} transform={`translate(${x} 40)`}>
          <line x1={0} y1={0} x2={26} y2={0} strokeWidth={4} style={{ stroke: LIGHT_COLOUR[k] }} />
          <text x={36} y={5} stroke="none" className="fill-foreground text-[15px]">{text}</text>
        </g>
      ))}

      {/* the compound's board: where the circuit starts and is protected */}
      <Unit x={150} y={Y - 41} title={t.board.title} sub={t.board.sub} sub2={t.board.sub2} dashed w={220} />
      {line("feed", `M260 ${Y} H560`)}
      {/* the inner gate's lantern, teed off on the way */}
      {line("lamp", `M420 ${Y} V${Y + 120}`)}
      <circle cx={420} cy={Y} r={5} stroke="none" style={{ fill: LIGHT_COLOUR.feed }} />
      <Unit x={420} y={Y + 120} title={t.l2.title} sub={t.l2.sub} w={200} />
      {line("feed", `M560 ${Y} H760`)}
      {label("LF", t.lf, 470, Y - 18, "middle")}
      {label("LD", t.ld(feedM), 470, Y - 38, "middle")}

      {/* the box on the back of the sign wall */}
      <rect x={760} y={Y - 70} width={300} height={140} rx={12} className="fill-muted" />
      <text x={910} y={Y - 42} textAnchor="middle" stroke="none" className="fill-foreground text-[16px] font-semibold">{t.box}</text>
      {[[t.parts[0], Y - 20], [t.parts[1], Y + 10], [t.parts[2], Y + 40]].map(([t, y]) => (
        <g key={t}>
          <rect x={790} y={Number(y) - 4} width={240} height={26} rx={6} className="fill-background" />
          <text x={910} y={Number(y) + 14} textAnchor="middle" stroke="none" className="fill-foreground text-[13px]">{t}</text>
        </g>
      ))}

      {/* out of the box: the letters through the wall, the lantern behind the hedge */}
      {line("sign", `M1060 ${Y - 30} H1260`)}
      <Unit x={1370} y={Y - 61} title={t.sg.title} sub={t.sg.sub} w={220} />
      {label("", t.wall, 1160, Y - 42, "middle")}
      {line("lamp", `M1060 ${Y + 40} H1160 V${Y + 160} H1260`)}
      <Unit x={1370} y={Y + 129} title={t.l1.title} sub={t.l1.sub} w={220} />
      {label("", t.hedge(lampM), 1148, Y + 150, "end")}

      <text x={60} y={H - 46} stroke="none" className="fill-muted-foreground text-[14px]">
        {t.notes[0]}
      </text>
      <text x={60} y={H - 22} stroke="none" className="fill-muted-foreground text-[14px]">
        {t.notes[1]}
      </text>
    </svg>
  )
}
