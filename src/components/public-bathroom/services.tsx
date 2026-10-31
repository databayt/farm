import { getLocale } from "@/components/internationalization/locale"

import { bathData } from "./data"
import bath from "./public-bathroom.json"
import { words } from "./words"

// The public bathroom's water and power drawn inline, in the studio's pipe and wiring diagrams' pattern
// (src/components/docs/pipe-diagram.tsx, wiring-diagram.tsx), so they run full width and follow the theme. Every run,
// size, circuit and point comes from public-bathroom.json (plumbing, electric), which the 3D drawings below read too; a
// run's length is measured off its path there [E]. A line's colour is what it carries, and every line carries its id,
// so colour never works alone.

const W = 1600
type Pt = number[]
const { plumbing: PL, electric: EL } = bath

// a run's length in metres, along every path it has
export function runLength(paths: Pt[][]) {
  let m = 0
  for (const p of paths) for (let i = 1; i < p.length; i++) m += Math.hypot(...p[i].map((v, k) => v - p[i - 1][k]))
  return m
}
const RUN = Object.fromEntries(PL.runs.map((r) => [r.run, { ...r, m: runLength(r.paths) }]))
export const runs = Object.values(RUN)

function Unit({ x, y, title, sub, dashed = false, muted = false, w = 150 }: {
  x: number; y: number; title: string; sub?: string; dashed?: boolean; muted?: boolean; w?: number
}) {
  return (
    <g>
      <rect x={x - w / 2} y={y} width={w} height={60} rx={10} strokeDasharray={dashed ? "6 6" : undefined}
        className={muted ? "fill-muted" : "fill-background"} />
      <text x={x} y={y + 26} textAnchor="middle" stroke="none" className="fill-foreground text-[16px] font-semibold">{title}</text>
      {sub ? <text x={x} y={y + 47} textAnchor="middle" stroke="none" className="fill-muted-foreground text-[13px]">{sub}</text> : null}
    </g>
  )
}

const colour = (id: string) => PL.colours[RUN[id].system as keyof typeof PL.colours]

export async function BathPipeDiagram() {
  const w = words[await getLocale()].pipeDiagram, u = w.units
  const TOP = 56, COLD = 150, FIX = 330, SOIL = 500, WASTE = 548
  const X = { WC1: 200, WC2: 430, BT1: 680, BT2: 860, FD: 1050, UV: 1240, IC: 1470 }
  const H = 760
  const pipe = (id: string, d: string) => {
    const s = RUN[id].system
    return <path d={d} style={{ stroke: colour(id) }} strokeLinejoin="round" strokeWidth={s === "soil" || s === "waste" ? 5 : 3.5}
      strokeDasharray={s === "vent" ? "9 7" : undefined} />
  }
  const tag = (id: string, x: number, y: number, anchor: "start" | "middle" | "end" = "start") => (
    <text x={x} y={y} textAnchor={anchor} stroke="none" className="fill-muted-foreground text-[13px]">
      <tspan className="fill-foreground font-semibold">{id}</tspan> DN{RUN[id].dn} · {RUN[id].m.toFixed(1)} m
    </text>
  )
  const tee = (id: string, x: number, y: number) => <circle key={`${id}${x}${y}`} cx={x} cy={y} r={5} stroke="none" style={{ fill: colour(id) }} />
  const key: [string, string, number][] = [["W2", w.key.cold, 1060], ["D1", w.key.drain, 1170], ["V1", w.key.vent, 1290]]
  return (
    <svg viewBox={`0 0 ${W} ${H}`} role="img" className="stroke-foreground h-auto w-full min-w-[960px]"
      strokeWidth={2} strokeLinecap="round" fill="none"
      aria-label={w.label}>
      {/* the farm's water: the tank and booster pump */}
      <Unit x={95} y={TOP - 30} title={w.farmWater.title} sub={w.farmWater.sub} dashed w={160} />
      {pipe("W1", `M175 ${TOP} H255`)}
      {tag("W1", 215, TOP - 40, "middle")}
      <Unit x={330} y={TOP - 30} title={w.valve.title} sub={w.valve.sub} muted />
      {pipe("W2", `M405 ${TOP} H470 V${COLD} H${X.UV}`)}
      {tag("W2", 480, COLD - 12)}

      {key.map(([id, text, x]) => (
        <g key={id} transform={`translate(${x} ${TOP})`}>
          <line x1={0} y1={0} x2={26} y2={0} strokeWidth={RUN[id].system === "soil" ? 5 : 3.5}
            strokeDasharray={RUN[id].system === "vent" ? "9 7" : undefined} style={{ stroke: colour(id) }} />
          <text x={36} y={5} stroke="none" className="fill-foreground text-[15px]">{text}</text>
        </g>
      ))}
      <text x={1060} y={TOP + 34} stroke="none" className="fill-muted-foreground text-[13px]">{w.coldOnly}</text>

      {/* cold, off the trunk along the back wall, to every outlet */}
      {pipe("W3", `M470 ${COLD} H${X.WC1} V${FIX}`)}
      {tee("W2", 470, COLD)}
      {tag("W3", X.WC1 + 8, 250)}
      {pipe("W4", `M${X.WC2} ${COLD} V${FIX}`)}
      {tee("W2", X.WC2, COLD)}
      {tag("W4", X.WC2 + 8, 250)}
      {pipe("W5", `M${X.BT1} ${COLD} V${FIX} M${X.BT2} ${COLD} V${FIX}`)}
      {tee("W2", X.BT1, COLD)}{tee("W2", X.BT2, COLD)}
      {tag("W5", X.BT1 + 8, 250)}
      {pipe("W6", `M${X.UV} ${COLD} V${FIX}`)}
      {tag("W6", X.UV + 8, 250)}

      <Unit x={X.WC1} y={FIX} title={u.WC1.title} sub={u.WC1.sub} />
      <Unit x={X.WC2} y={FIX} title={u.WC2.title} sub={u.WC2.sub} />
      <Unit x={X.BT1} y={FIX} title={u.BT1.title} sub={u.BT1.sub} w={140} />
      <Unit x={X.BT2} y={FIX} title={u.BT2.title} sub={u.BT2.sub} w={140} />
      <Unit x={X.FD} y={FIX} title={u.FD.title} sub={u.FD.sub} />
      <Unit x={X.UV} y={FIX} title={u.UV.title} sub={u.UV.sub} />

      {/* the drains: the WCs to the soil run, the rest to the waste run, both to IC1 */}
      {pipe("D1", `M${X.WC1} ${FIX + 60} V${SOIL} H${X.IC - 75}`)}
      {pipe("D2", `M${X.WC2} ${FIX + 60} V${SOIL}`)}
      {tee("D1", X.WC2, SOIL)}
      {tag("D1", X.WC1 + 10, SOIL - 14)}
      {tag("D2", X.WC2 + 10, SOIL - 50)}
      {pipe("D3", `M${X.BT1} ${FIX + 60} V${WASTE} M${X.BT2} ${FIX + 60} V${WASTE}`)}
      {pipe("D4", `M${X.FD} ${FIX + 60} V${WASTE}`)}
      {pipe("D5", `M${X.UV} ${FIX + 60} V${WASTE} M${X.BT1} ${WASTE} H${X.IC - 75}`)}
      {[X.BT1, X.BT2, X.FD].map((x) => tee("D5", x, WASTE))}
      {tag("D3", X.BT1 + 10, SOIL - 50)}
      {tag("D4", X.FD + 10, SOIL - 50)}
      {tag("D5", X.UV + 10, SOIL - 50)}
      <Unit x={X.IC} y={SOIL - 6} title={u.IC.title} sub={u.IC.sub} dashed />
      {pipe("S1", `M${X.IC} ${SOIL + 54} V640`)}
      {tag("S1", X.IC + 10, 605)}
      <Unit x={X.IC} y={640} title={u.septic.title} sub={u.septic.sub} dashed />

      {/* the vent off the soil run where it leaves the plinth, up the back wall */}
      {pipe("V1", `M${X.IC - 120} ${SOIL} V410`)}
      {tee("D1", X.IC - 120, SOIL)}
      <line x1={X.IC - 132} y1={410} x2={X.IC - 108} y2={410} strokeWidth={2.5} style={{ stroke: colour("V1") }} />
      <text x={X.IC - 100} y={406} stroke="none" className="fill-muted-foreground text-[13px]">
        <tspan className="fill-foreground font-semibold">V1</tspan> DN{RUN.V1.dn} · {w.ventTag}
      </text>

      <text x={110} y={H - 46} stroke="none" className="fill-muted-foreground text-[14px]">{w.notes[0]}</text>
      <text x={110} y={H - 22} stroke="none" className="fill-muted-foreground text-[14px]">{w.notes[1]}</text>
    </svg>
  )
}

// a breaker drawn down from (x, y), as the studio's: lead in, the open contact, lead out; with `rcd`, an RCBO's ring
function Breaker({ x, y, rcd = false }: { x: number; y: number; rcd?: boolean }) {
  return (
    <g>
      <line x1={x} y1={y} x2={x} y2={y + 18} />
      <line x1={x - 5} y1={y + 13} x2={x + 5} y2={y + 23} />
      <line x1={x} y1={y + 18} x2={x + 14} y2={y + 42} />
      <line x1={x} y1={y + 44} x2={x} y2={y + 60} />
      {rcd ? <ellipse cx={x + 4} cy={y + 31} rx={16} ry={7} fill="none" /> : null}
    </g>
  )
}

export async function BathWiringDiagram() {
  const lang = await getLocale(), w = words[lang].wiringDiagram, data = bathData(lang)
  const TOP = 50, BUS = 250, H = 650
  const cs = data.circuits
  const x0 = 380, step = (W - 160 - x0) / (cs.length - 1)
  const what = Object.fromEntries(EL.points.map((p) => [p.point, p.what]))
  // English shortens the point's own words; the Kinyarwanda names each one (words.tsx)
  const short = (id: string) => w.short[id] ?? (what[id] ?? "").replace(/^LED ceiling light with motion sensor, /, "").replace(/,.*$/, "")
  const feed = W - 160
  return (
    <svg viewBox={`0 0 ${W} ${H}`} role="img" className="stroke-foreground h-auto w-full min-w-[960px]"
      strokeWidth={2} strokeLinecap="round" fill="none"
      aria-label={w.label(cs.length)}>
      <rect x={20} y={TOP - 34} width={170} height={68} rx={12} strokeDasharray="6 6" />
      <text x={105} y={TOP - 4} textAnchor="middle" stroke="none" className="fill-foreground text-[17px] font-semibold">{w.siteBoard}</text>
      <text x={105} y={TOP + 18} textAnchor="middle" stroke="none" className="fill-muted-foreground text-[14px]">{w.feeder}</text>
      <line x1={190} y1={TOP} x2={520} y2={TOP} />
      <text x={355} y={TOP - 14} textAnchor="middle" stroke="none" className="fill-muted-foreground text-[14px]">{w.sized}</text>

      {/* the main switch, on its side, then the surge protection to earth */}
      <g transform={`rotate(-90 550 ${TOP}) translate(0 -30)`}><Breaker x={550} y={TOP} /></g>
      <text x={550} y={TOP + 66} textAnchor="middle" stroke="none" className="fill-foreground text-[17px] font-semibold">{w.main}</text>
      <text x={550} y={TOP + 88} textAnchor="middle" stroke="none" className="fill-muted-foreground text-[14px]">{w.mainSub}</text>
      <line x1={580} y1={TOP} x2={feed} y2={TOP} />
      <circle cx={820} cy={TOP} r={4} className="fill-foreground" />
      <line x1={820} y1={TOP} x2={820} y2={TOP + 50} />
      <rect x={770} y={TOP + 50} width={100} height={44} rx={8} />
      <text x={820} y={TOP + 78} textAnchor="middle" stroke="none" className="fill-foreground text-[16px] font-semibold">{w.spd}</text>
      <line x1={820} y1={TOP + 94} x2={820} y2={TOP + 110} />
      {[22, 14, 6].map((w, i) => <line key={w} x1={820 - w / 2} y1={TOP + 110 + i * 6} x2={820 + w / 2} y2={TOP + 110 + i * 6} />)}
      <text x={845} y={TOP + 124} stroke="none" className="fill-muted-foreground text-[14px]">{w.earth}</text>
      <line x1={feed} y1={TOP} x2={feed} y2={BUS} />

      {Object.entries(EL.colours).map(([g, c], i) => (
        <g key={g} transform={`translate(${1030 + i * 120} ${TOP + 110})`}>
          <line x1={0} y1={0} x2={26} y2={0} strokeWidth={5} style={{ stroke: c }} />
          <text x={36} y={5} stroke="none" className="fill-foreground text-[15px]">{w.groups[g]}</text>
        </g>
      ))}

      <line x1={x0} y1={BUS} x2={feed} y2={BUS} strokeWidth={4} />
      {cs.map((c, i) => {
        const x = x0 + i * step, spare = c.group === "spare", pts = c.points ? c.points.split(" ") : []
        return (
          <g key={c.circuit} className={spare ? "opacity-50" : undefined}>
            <Breaker x={x} y={BUS} rcd={!spare} />
            <text x={x + 24} y={BUS + 36} stroke="none" className="fill-muted-foreground text-[14px]">{c.device}</text>
            <line x1={x} y1={BUS + 60} x2={x} y2={BUS + 92} strokeWidth={5} style={{ stroke: EL.colours[c.group as keyof typeof EL.colours] }} />
            <text x={x} y={BUS + 124} textAnchor="middle" stroke="none" className="fill-foreground text-[22px] font-bold">{c.circuit}</text>
            <text x={x} y={BUS + 148} textAnchor="middle" stroke="none" className="fill-muted-foreground text-[14px]">{c.cable_mm2} mm²</text>
            <text x={x} y={BUS + 178} textAnchor="middle" stroke="none" className="fill-foreground text-[15px]">{c.serves}</text>
            {pts.map((p, j) => (
              <text key={p} x={x} y={BUS + 202 + j * 19} textAnchor="middle" stroke="none" className="fill-muted-foreground text-[13px]">
                <tspan className="fill-foreground font-semibold">{p}</tspan> {short(p)}
              </text>
            ))}
          </g>
        )
      })}
      {/* the light over the door switches through the photocell and time switch in the board */}
      <rect x={x0 + step - 34} y={BUS + 64} width={68} height={24} rx={4} className="fill-background" />
      <text x={x0 + step} y={BUS + 81} textAnchor="middle" stroke="none" className="fill-foreground text-[13px] font-semibold">TS · 18:00</text>

      <text x={110} y={H - 22} stroke="none" className="fill-muted-foreground text-[14px]">{w.note}</text>
    </svg>
  )
}
