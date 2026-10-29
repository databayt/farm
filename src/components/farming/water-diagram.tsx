// The field's water drawn inline, in the studio's pipe diagram's pattern, so it runs full width and follows the
// theme. Top row: the farm's source and tank, the disc filter and the 40 mm main to the gate; below, the 32 mm supply
// along the main path to a valve for each block, and each block's header with its drip lines, a line for every planted
// bed and a dashed one for a bed resting. Every length, block and bed comes from plan.irrigation
// (scripts/site/farming.mjs). A line's colour is what it carries, as in the 3D drawing below it, and every line carries
// its run, so colour never works alone.

type Valve = { id: string; block: string; at: number[]; beds: number }
type Irrigation = { main: { dn: number; m: number }; pipe32m: number; dripM: number; lines: number; valves: Valve[] }

export const WATER_COLOUR = { main: "#1d4e89", supply: "#2f7ed8", drip: "#5fb0ea", valve: "#d9822b" }

const W = 1600
const TOP = 56 // the source row
const SUP = 210 // the supply line
const VAL = 268 // the valves
const BLK = 340 // the blocks

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

export function WaterDiagram({ irrigation, perBlock, dry }: { irrigation: Irrigation; perBlock: number; dry: [number, number] }) {
  const { main, valves } = irrigation
  // the blocks by column: the middle aisle's first, then the gate end's, as the supply reaches them
  const cols = [...new Set(valves.map((v) => v.block.slice(1)))].sort()
  const order = cols.flatMap((c) => valves.filter((v) => v.block.endsWith(c)))
  const x0 = 170, step = (W - 2 * x0) / (order.length - 1)
  const X = (i: number) => x0 + i * step
  const line = (kind: keyof typeof WATER_COLOUR, d: string, width = 3.5) => (
    <path d={d} style={{ stroke: WATER_COLOUR[kind] }} strokeWidth={width} strokeLinejoin="round" />
  )
  const label = (id: string, sub: string, x: number, y: number, anchor: "start" | "middle" | "end" = "start") => (
    <text x={x} y={y} textAnchor={anchor} stroke="none" className="fill-muted-foreground text-[13px]">
      <tspan className="fill-foreground font-semibold">{id}</tspan> {sub}
    </text>
  )
  const H = 640
  const gateX = W - 65
  const key: [keyof typeof WATER_COLOUR, string, number][] = [["main", "Main 40 mm", 760], ["supply", "Supply and headers 32 mm", 920],
    ["drip", "Drip line 16 mm", 1160], ["valve", "Block valve", 1330]]
  return (
    <svg viewBox={`0 0 ${W} ${H}`} role="img" className="stroke-foreground h-auto w-full min-w-[960px]"
      strokeWidth={2} strokeLinecap="round" fill="none"
      aria-label={`Water diagram: the farm's source fills the tank by the compound; its pump pushes the water through a disc filter into a ${main.dn} mm main, ${main.m} m to the field's gate; inside, a 32 mm supply runs along the main path to a valve for each of the ${valves.length} blocks, and each block's header feeds two drip lines down every planted bed`}>
      {/* the farm's water: the source and the tank with its pump, shared with the compound */}
      <Unit x={100} y={TOP - 30} title="Source" sub="borehole or mains" dashed />
      {line("main", `M175 ${TOP} H240`)}
      <Unit x={330} y={TOP - 30} title="Tank + pump" sub="the farm's, by the compound" dashed w={180} />
      {line("main", `M420 ${TOP} H470`)}
      <Unit x={545} y={TOP - 30} title="Disc filter" sub="F · 1 inch" muted />
      {line("main", `M620 ${TOP} H680 V${TOP + 70} H${gateX} V${SUP - 30}`, 5)}
      {label("M1", `${main.dn} mm PE · ${main.m} m, down to the garden walk and along it`, 700, TOP + 92)}

      {/* key: a line's colour is what it carries */}
      {key.map(([k, text, x]) => (
        <g key={k} transform={`translate(${x} ${TOP})`}>
          <line x1={0} y1={0} x2={26} y2={0} strokeWidth={k === "main" ? 5 : 3.5} style={{ stroke: WATER_COLOUR[k] }} />
          <text x={36} y={5} stroke="none" className="fill-foreground text-[15px]">{text}</text>
        </g>
      ))}

      {/* the gate, then the supply along the main path to every block's valve */}
      <Unit x={gateX} y={SUP - 30} title="Gate" sub="the field" muted w={110} />
      {line("supply", `M${gateX - 55} ${SUP} H${X(0)}`)}
      {label("S1", "32 mm · along the main path and the aisles", X(0), SUP - 14)}
      {order.map((v, i) => (
        <g key={v.id}>
          <circle cx={X(i)} cy={SUP} r={5} stroke="none" style={{ fill: WATER_COLOUR.supply }} />
          {line("supply", `M${X(i)} ${SUP} V${VAL}`)}
          {/* the valve: a bow tie on the line, as on a plumber's drawing */}
          <path d={`M${X(i) - 11} ${VAL} l22 14 v-14 l-22 14 z`} transform={`translate(0 -7)`} style={{ fill: WATER_COLOUR.valve, stroke: WATER_COLOUR.valve }} />
          <text x={X(i) + 18} y={VAL + 5} stroke="none" className="fill-foreground text-[13px] font-semibold">{v.id}</text>
          {line("supply", `M${X(i)} ${VAL + 7} V${BLK}`)}
          <Block x={X(i)} id={v.block} planted={v.beds} of={perBlock} />
        </g>
      ))}

      <text x={110} y={H - 46} stroke="none" className="fill-muted-foreground text-[14px]">
        {irrigation.lines} drip lines, {irrigation.dripM.toLocaleString("en-US")} m in all · {irrigation.pipe32m} m of 32 mm supply and
        headers · in the driest months the beds drink {dry[0]} to {dry[1]} m³ a day, run at dawn or dusk, one block at a time if the flow is short
      </text>
      <text x={110} y={H - 22} stroke="none" className="fill-muted-foreground text-[14px]">
        Flush the lines and check every emitter before planting · the source and its flow wait for the 6-hour borehole test · design intent
      </text>
    </svg>
  )
}

// A block: its header across the bed ends, then a drip line down each bed, solid when planted, dashed when resting
function Block({ x, id, planted, of }: { x: number; id: string; planted: number; of: number }) {
  const w = 150, gap = w / of
  return (
    <g>
      <path d={`M${x - w / 2 + gap / 2} ${BLK} H${x + w / 2 - gap / 2}`} style={{ stroke: WATER_COLOUR.supply }} strokeWidth={3.5} />
      {Array.from({ length: of }, (_, k) => (
        <path key={k} d={`M${x - w / 2 + gap / 2 + k * gap} ${BLK} V${BLK + 150}`} strokeWidth={1.8}
          strokeDasharray={k < planted ? undefined : "4 6"} style={{ stroke: k < planted ? WATER_COLOUR.drip : undefined }}
          className={k < planted ? undefined : "stroke-muted-foreground"} />
      ))}
      <text x={x} y={BLK + 180} textAnchor="middle" stroke="none" className="fill-foreground text-[16px] font-semibold">Block {id}</text>
      <text x={x} y={BLK + 200} textAnchor="middle" stroke="none" className="fill-muted-foreground text-[13px]">
        {planted} of {of} beds on drip
      </text>
    </g>
  )
}
