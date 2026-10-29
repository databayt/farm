// The yard's water drawn inline, in the field's water diagram's pattern (src/components/farming/water-diagram.tsx), so it
// runs full width and follows the theme: the farm's line fills the 1,000 L tank by the shed through a float valve; from
// the outlet valve at its foot the 20 mm yard line feeds a float valve in each trough, and a bucket tap fills the
// buckets for the dogs' bowl. Every point and length comes from the water section of
// src/components/livestock/livestock.json. A line's colour is what it carries, as in the 3D drawing below it, and every
// line carries its run, so colour never works alone.

export const WATER_COLOUR = { farm: "#1d4e89", supply: "#2f7ed8", riser: "#5fb0ea", valve: "#d9822b" }

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

export function WaterDiagram({ tank, yardM, need, peak, days }: {
  tank: number; yardM: number; need: [number, number]; peak: number; days: [number, number]
}) {
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
  const key: [keyof typeof WATER_COLOUR, string, number][] = [["farm", "The farm’s line", 900], ["supply", "Yard line 20 mm", 1080],
    ["riser", "Riser to a trough", 1260], ["valve", "Valve or tap", 1450]]
  const tx = 560 // the tank
  return (
    <svg viewBox={`0 0 ${W} ${H}`} role="img" className="stroke-foreground h-auto w-full min-w-[960px]"
      strokeWidth={2} strokeLinecap="round" fill="none"
      aria-label={`Water diagram: the farm's water line fills the ${tank.toLocaleString("en-US")} litre tank by the shed through a float valve; from the outlet valve at the tank's foot a 20 mm line, about ${yardM} m, runs buried to a float valve in each of the two troughs, and a bucket tap fills the buckets for the dogs' bowl`}>
      {/* the farm's water, off the drawing */}
      <Unit x={110} y={TOP} title="Farm line" sub="from the farm’s water" dashed />
      {line("farm", `M195 ${TOP} H${tx - 170}`, 5, "10 8")}
      {label("F1", "under the back fence", 215, TOP - 14)}
      {valve(tx - 140, TOP, "FV", false, [0, -16, "middle"])}
      <text x={tx - 140} y={TOP + 34} textAnchor="middle" stroke="none" className="fill-muted-foreground text-[13px]">float valve</text>
      {line("farm", `M${tx - 128} ${TOP} H${tx - 95}`, 5)}
      <Unit x={tx} y={TOP} title={`Tank ${tank.toLocaleString("en-US")} L`} sub="T · on a stone base 1.2 m high" w={190} />

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
      <Unit x={tx + 360} y={TOP + 140} title="Buckets" sub="B · the dogs’ bowl, the cats" muted w={210} />
      {line("supply", `M${tx} ${LOW} H170`)}
      {line("supply", `M${tx} ${LOW} H1440`)}
      {label("S1", `20 mm PE · about ${yardM} m, buried 30 cm`, tx + 20, LOW - 14)}
      {([["W1", "West trough", 300], ["W2", "East trough", 1180]] as const).map(([id, name, x]) => (
        <g key={id}>
          <circle cx={x} cy={LOW} r={5} stroke="none" style={{ fill: WATER_COLOUR.supply }} />
          {line("riser", `M${x} ${LOW} V${LOW + 60}`)}
          <Unit x={x} y={LOW + 90} title={name} sub={`${id} · float valve, 1.0 × 0.35 m`} w={230} />
        </g>
      ))}

      <text x={110} y={H - 46} stroke="none" className="fill-muted-foreground text-[14px]">
        The yard drinks about {need[0]} to {need[1]} L a day, up to about {peak} L with does and ewes in milk in the dry season [E] ·
        a full tank lasts about {days[0]} to {days[1]} days if the farm line stops
      </text>
      <text x={110} y={H - 22} stroke="none" className="fill-muted-foreground text-[14px]">
        The tank stands only about 1.2 m above the troughs, so their floats are low-pressure ones · sizes and routes are design intent
      </text>
    </svg>
  )
}
