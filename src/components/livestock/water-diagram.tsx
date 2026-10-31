// The yard's water drawn inline, in the field's water diagram's pattern (src/components/farming/water-diagram.tsx), so it
// runs full width and follows the theme: the farm's line fills the 1,000 L tank by the shed through a float valve; from
// the outlet valve at its foot the 20 mm yard line feeds a float valve in each trough, and a bucket tap fills the
// buckets for the dogs' bowl. Every point and length comes from the water section of
// src/components/livestock/livestock.json. A line's colour is what it carries, as in the 3D drawing below it, and every
// line carries its run, so colour never works alone.

export const WATER_COLOUR = { farm: "#1d4e89", supply: "#2f7ed8", riser: "#5fb0ea", valve: "#d9822b" }

import { getWords } from "@/components/internationalization/words"

import { words } from "./words"

const W = 1600
const H = 470
const TOP = 70 // the farm line and the tank
const LOW = 270 // the yard line

function Unit({ x, y, title, sub, dashed = false, muted = false, w = 170 }: {
  x: number; y: number; title: string; sub?: string; dashed?: boolean; muted?: boolean; w?: number
}) {
  return (
    <g>
      <rect x={x - w / 2} y={y - 30} width={w} height={60} rx={10} strokeDasharray={dashed ? "6 6" : undefined}
        className={muted ? "fill-muted" : "fill-background"} />
      <text x={x} y={y - 4} textAnchor="middle" stroke="none" className="fill-foreground text-[16px] font-semibold">{title}</text>
      {sub ? <text x={x} y={y + 17} textAnchor="middle" stroke="none" className="fill-muted-foreground text-[13px]">{sub}</text> : null}
    </g>
  )
}

export async function WaterDiagram({ tank, yardM, need, peak, days }: {
  tank: number; yardM: number; need: [number, number]; peak: number; days: [number, number]
}) {
  const t = (await getWords(words)).water.diagram
  const litres = tank.toLocaleString("en-US")
  const notes = t.notes(need[0], need[1], peak, days[0], days[1])
  const line = (kind: keyof typeof WATER_COLOUR, d: string, width = 3.5, dash?: string) => (
    <path d={d} style={{ stroke: WATER_COLOUR[kind] }} strokeWidth={width} strokeLinejoin="round" strokeDasharray={dash} />
  )
  const label = (id: string, sub: string, x: number, y: number, anchor: "start" | "middle" | "end" = "start") => (
    <text x={x} y={y} textAnchor={anchor} stroke="none" className="fill-muted-foreground text-[13px]">
      <tspan className="fill-foreground font-semibold">{id}</tspan> {sub}
    </text>
  )
  // a valve: a bow tie on the line, as on a plumber's drawing
  const valve = (x: number, y: number, id: string, vertical = false, at: [number, number, "start" | "middle" | "end"] = [18, 5, "start"]) => (
    <g>
      <path d={`M${x - 11} ${y - 7} l22 14 v-14 l-22 14 z`} transform={vertical ? `rotate(90 ${x} ${y})` : undefined}
        style={{ fill: WATER_COLOUR.valve, stroke: WATER_COLOUR.valve }} />
      <text x={x + at[0]} y={y + at[1]} textAnchor={at[2]} stroke="none" className="fill-foreground text-[13px] font-semibold">{id}</text>
    </g>
  )
  const key: [keyof typeof WATER_COLOUR, string, number][] = [["farm", t.key.farm, 900], ["supply", t.key.supply, 1080],
    ["riser", t.key.riser, 1260], ["valve", t.key.valve, 1450]]
  const tx = 560 // the tank
  return (
    <svg viewBox={`0 0 ${W} ${H}`} role="img" className="stroke-foreground h-auto w-full min-w-[960px]"
      strokeWidth={2} strokeLinecap="round" fill="none"
      aria-label={t.label(litres, yardM)}>
      {/* the farm's water, off the drawing */}
      <Unit x={110} y={TOP} title={t.farm.title} sub={t.farm.sub} dashed />
      {line("farm", `M195 ${TOP} H${tx - 170}`, 5, "10 8")}
      {label("F1", t.underFence, 215, TOP - 14)}
      {valve(tx - 140, TOP, "FV", false, [0, -16, "middle"])}
      <text x={tx - 140} y={TOP + 34} textAnchor="middle" stroke="none" className="fill-muted-foreground text-[13px]">{t.float}</text>
      {line("farm", `M${tx - 128} ${TOP} H${tx - 95}`, 5)}
      <Unit x={tx} y={TOP} title={t.tank(litres)} sub={t.tankSub} w={190} />

      {/* key: a line's colour is what it carries */}
      {key.map(([k, text, x]) => (
        <g key={k} transform={`translate(${x} ${TOP})`}>
          <line x1={0} y1={0} x2={26} y2={0} strokeWidth={k === "farm" ? 5 : 3.5} style={{ stroke: WATER_COLOUR[k] }} />
          <text x={36} y={5} stroke="none" className="fill-foreground text-[15px]">{text}</text>
        </g>
      ))}

      {/* down the tank's base: the outlet valve, the bucket tap, then the yard line along the front of the eaves */}
      {line("supply", `M${tx} ${TOP + 30} V${LOW}`)}
      {valve(tx, TOP + 75, "V1", true, [-18, 5, "end"])}
      {valve(tx, TOP + 140, "TP", true, [-18, 5, "end"])}
      {line("riser", `M${tx} ${TOP + 140} H${tx + 260}`, 3, "4 6")}
      <Unit x={tx + 360} y={TOP + 140} title={t.buckets.title} sub={t.buckets.sub} muted w={210} />
      {line("supply", `M${tx} ${LOW} H170`)}
      {line("supply", `M${tx} ${LOW} H1440`)}
      {label("S1", t.yard(yardM), tx + 20, LOW - 14)}
      {([["W1", t.west, 300], ["W2", t.east, 1180]] as const).map(([id, name, x]) => (
        <g key={id}>
          <circle cx={x} cy={LOW} r={5} stroke="none" style={{ fill: WATER_COLOUR.supply }} />
          {line("riser", `M${x} ${LOW} V${LOW + 60}`)}
          <Unit x={x} y={LOW + 90} title={name} sub={t.trough(id)} w={230} />
        </g>
      ))}

      <text x={110} y={H - 46} stroke="none" className="fill-muted-foreground text-[14px]">
        {notes[0]}
      </text>
      <text x={110} y={H - 22} stroke="none" className="fill-muted-foreground text-[14px]">
        {notes[1]}
      </text>
    </svg>
  )
}
