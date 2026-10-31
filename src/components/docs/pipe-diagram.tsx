// The studio's water drawn inline (not a paper sheet), in the wiring diagram's pattern, so it runs full width and
// follows the theme. Top row: the farm's water into the studio's stop valve, filter and meter; below, the cold line
// to every outlet and the instant heater, whose hose is the only hot (D-053), then the drains out to the farm's
// septic tank and, apart, its grease trap. Every run, size and rating comes from the generator's CSVs (pipes.csv, fittings.csv,
// site-water.csv). A line's colour is what it carries, as in the 3D drawing below it; drains are heavier, the vent
// dashed, and every line carries its run, so colour never works alone.

import type * as React from "react"

import { getWords } from "@/components/internationalization/words"
import { words } from "@/components/studio/words"

type Row = Record<string, string>

const W = 1600
const TOP = 56 // the supply row
const COLD = 150 // the cold line
const FIX = 410 // the outlets
const DRAIN = 548 // the bathroom's drains join here
const X = { DF: 150, KT: 360, SH: 640, BT: 900, WC: 1160, V: 1372, IC: 1480 }

function Unit({ x, y, title, sub, dashed = false, muted = false }: {
  x: number; y: number; title: string; sub?: string; dashed?: boolean; muted?: boolean
}) {
  return (
    <g>
      <rect x={x - 75} y={y} width={150} height={60} rx={10} strokeDasharray={dashed ? "6 6" : undefined}
        className={muted ? "fill-muted" : "fill-background"} />
      <text x={x} y={y + 26} textAnchor="middle" stroke="none" className="fill-foreground text-[16px] font-semibold">
        {title}
      </text>
      {sub ? <text x={x} y={y + 47} textAnchor="middle" stroke="none" className="fill-muted-foreground text-[13px]">{sub}</text> : null}
    </g>
  )
}

const deg = (s = "") => s.replace(/(\d) C\b/g, "$1 °C").replace(/(\d)-(\d)/g, "$1–$2")

// The words are the reader's (src/components/studio/words.tsx `pipes`); pass the fittings in their language too
// (studioCsv), so the ratings read in it.
export async function PipeDiagram({ pipes, fittings, water }: { pipes: Row[]; fittings: Row[]; water: Record<string, string> }): Promise<React.JSX.Element> {
  const t = (await getWords(words)).pipes
  const run = Object.fromEntries(pipes.map((p) => [p.run, p]))
  const fit = Object.fromEntries(fittings.map((f) => [f.point, f]))
  const sys = (id: string) => run[id]?.system ?? ""
  const H = 740
  // a run's path in its colour: heavier for a drain, dashed for the vent
  const pipe = (id: string, d: string) => (
    <path d={d} style={{ stroke: run[id]?.colour }} strokeLinejoin="round"
      strokeWidth={sys(id) === "soil" || sys(id) === "waste" ? 5 : 3.5} strokeDasharray={sys(id) === "vent" ? "9 7" : undefined} />
  )
  // a run's id and size beside its line
  const tag = (id: string, x: number, y: number, anchor: "start" | "middle" | "end" = "start") => (
    <text x={x} y={y} textAnchor={anchor} stroke="none" className="fill-muted-foreground text-[13px]">
      <tspan className="fill-foreground font-semibold">{id}</tspan> DN{run[id]?.dn}
    </text>
  )
  const tee = (id: string, x: number, y: number) => (
    <circle key={`${x} ${y}`} cx={x} cy={y} r={5} stroke="none" style={{ fill: run[id]?.colour }} />
  )
  const [kw, , hot] = (fit.WH?.rating ?? "").split(", ")
  // the key, each entry as wide as its label
  const key: [string, string, number, boolean?][] = [["W1", t.cold, 1000], ["H1", t.hot(deg(hot)), 1110],
    ["D1", t.drain, 1275], ["V1", t.vent, 1400, true]]
  return (
    <svg viewBox={`0 0 ${W} ${H}`} role="img" className="h-auto w-full min-w-[960px] stroke-foreground"
      strokeWidth={2} strokeLinecap="round" fill="none"
      aria-label={t.label(kw, deg(hot))}>
      {/* the farm's water: the tank and the booster pump, shared by the studios */}
      <rect x={20} y={TOP - 34} width={140} height={68} rx={12} strokeDasharray="6 6" />
      <text x={90} y={TOP - 4} textAnchor="middle" stroke="none" className="fill-foreground text-[17px] font-semibold">{t.farm}</text>
      <text x={90} y={TOP + 18} textAnchor="middle" stroke="none" className="fill-muted-foreground text-[14px]">
        {t.tank(water.tank_m3)}
      </text>
      {pipe("W1", `M160 ${TOP} H255`)}
      {tag("W1", 208, TOP - 12, "middle")}
      <text x={90} y={TOP + 64} textAnchor="middle" stroke="none" className="fill-muted-foreground text-[13px]">
        {t.booster(water.pump_lpm)}
      </text>

      {/* the studio's own valve set, in the sink base */}
      <rect x={255} y={TOP - 34} width={150} height={68} rx={12} className="fill-muted" />
      <text x={330} y={TOP - 4} textAnchor="middle" stroke="none" className="fill-foreground text-[17px] font-semibold">{t.valve}</text>
      <text x={330} y={TOP + 18} textAnchor="middle" stroke="none" className="fill-muted-foreground text-[14px]">{t.valveSub}</text>
      {pipe("W1", `M405 ${TOP} H470 V${COLD}`)}

      {/* key: a line's colour is what it carries */}
      {key.map(([id, label, x, dashed]) => (
        <g key={id} transform={`translate(${x} ${TOP})`}>
          <line x1={0} y1={0} x2={26} y2={0} strokeWidth={sys(id) === "soil" ? 5 : 3.5} strokeDasharray={dashed ? "9 7" : undefined}
            style={{ stroke: run[id]?.colour }} />
          <text x={36} y={5} stroke="none" className="fill-foreground text-[15px]">{label}</text>
        </g>
      ))}

      {/* cold, to every outlet and the heater */}
      {pipe("W1", `M${X.DF} ${FIX} V${COLD} H${X.WC} V${FIX}`)}
      {tee("W1", 470, COLD)}
      {[X.KT, X.SH, X.BT].map((x) => tee("W1", x, COLD))}
      {pipe("W3", `M${X.KT} ${COLD} V${FIX}`)}
      {tag("W3", X.KT + 8, 290)}
      {pipe("W2", `M${X.SH} ${COLD} V200`)}
      {tag("W2", X.SH + 8, 185)}
      {pipe("W5", `M${X.BT} ${COLD} V${FIX}`)}
      {tag("W5", X.BT + 8, 290)}
      {tag("W4", X.WC + 8, 290)}

      {/* the instant heater, its hose (H1) the only hot, down to the shower */}
      <Unit x={X.SH} y={200} title={t.heater} sub={`WH · ${kw}`} />
      {pipe("H1", `M${X.SH} 260 V${FIX}`)}
      <text x={X.SH + 8} y={340} stroke="none" className="fill-muted-foreground text-[13px]">
        <tspan className="fill-foreground font-semibold">H1</tspan> {t.hose} · {deg(hot)}
      </text>

      {/* the outlets */}
      <Unit x={X.DF} y={FIX} title={t.df.title} sub={t.df.sub} />
      <Unit x={X.KT} y={FIX} title={t.kt.title} sub={t.kt.sub(fit.KT?.rating)} />
      <Unit x={X.SH} y={FIX} title={t.sh.title} sub={`SH · ${deg(fit.SH?.rating)}`} />
      <Unit x={X.BT} y={FIX} title={t.bt.title} sub={t.bt.sub(fit.BT?.rating)} />
      <Unit x={X.WC} y={FIX} title={t.wc.title} sub={`WC · ${fit.WC?.rating}`} />

      {/* drains: the kitchen sink apart to the grease trap; the rest to the inspection chamber and the septic tank */}
      {pipe("D4", `M${X.KT} 470 V600`)}
      {tag("D4", X.KT + 10, 540)}
      <Unit x={X.KT} y={600} title={t.trap.title} sub={t.trap.sub} dashed />
      {pipe("D2", `M${X.SH} 470 V${DRAIN} H${X.IC - 75}`)}
      {pipe("D3", `M${X.BT} 470 V${DRAIN}`)}
      {pipe("D1", `M${X.WC} 470 V${DRAIN}`)}
      {[X.BT, X.WC].map((x) => tee("D1", x, DRAIN))}
      {tag("D2", X.SH - 10, 512, "end")}
      {tag("D3", X.BT - 10, 512, "end")}
      {tag("D1", X.WC - 10, 512, "end")}
      <Unit x={X.IC} y={DRAIN - 28} title="IC1" sub={t.ic} dashed />
      <path d={`M${X.IC} ${DRAIN + 32} V610`} strokeWidth={5} style={{ stroke: run.D1?.colour }} />
      <Unit x={X.IC} y={610} title={t.septic.title} sub={t.septic.sub(water.septic_m3)} dashed />

      {/* the vent off the soil run, up end B past the roof */}
      {pipe("V1", `M${X.V} ${DRAIN} V318`)}
      {tee("D1", X.V, DRAIN)}
      <line x1={X.V - 12} y1={318} x2={X.V + 12} y2={318} strokeWidth={2.5} style={{ stroke: run.V1?.colour }} />
      {tag("V1", X.V + 20, 314)}
      <text x={X.V + 20} y={334} stroke="none" className="fill-muted-foreground text-[13px]">{t.roof}</text>

      <text x={110} y={H - 46} stroke="none" className="fill-muted-foreground text-[14px]">
        {t.notes[0]}
      </text>
      <text x={110} y={H - 22} stroke="none" className="fill-muted-foreground text-[14px]">
        {t.notes[1]}
      </text>
    </svg>
  )
}
