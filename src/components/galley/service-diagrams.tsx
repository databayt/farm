// The galley's and the bar's services drawn inline, in the studio's wiring and pipe diagrams' pattern (and the field's
// water diagram's), so they run full width and follow the theme. Both read the building's JSON (`water`, `electric`):
// the water from the farm's supply through the stop valve to every outlet, the heater and its hot, then the drains to
// the grease trap; the power from the farm's site board through the main switch to one RCBO per circuit. A line's
// colour is what it carries, as in the 3D drawing below it, and every line carries its id, so colour never works alone.

type Pt = [number, number, number]
export type WaterRun = { id: string; system: "cold" | "hot" | "waste" | "vent"; dn: number; note: string; paths: Pt[][] }
export type WaterPoint = { id: string; what: string; where: string; size: string; at: Pt | null; item?: string }
export type Circuit = { id: string; serves: string; device: string; cable: number; kw: number; group: string; phases: number; stop?: boolean }
export type ElectricPoint = { id: string; what: string; circuit: string; at: Pt | null; face: string; model: string; size: string; control?: boolean }

// a run's length: its polylines, summed, to the nearest 0.1 m
export function runLength(run: { paths: Pt[][] }) {
  let m = 0
  for (const path of run.paths) for (let i = 1; i < path.length; i++) m += Math.hypot(...path[i].map((v, k) => v - path[i - 1][k]))
  return Math.round(m * 10) / 10
}

// the pipe a set of runs takes, by size, for a rail card: "6.2 m of 20 mm, 3.1 m of 40 mm"
export function metres(runs: WaterRun[]): string {
  return [...runs.reduce((a, r) => a.set(r.dn, (a.get(r.dn) ?? 0) + runLength(r)), new Map<number, number>())]
    .map(([dn, n]) => `${+n.toFixed(1)} m of ${dn} mm`).join(", ")
}

const W = 1600

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

export type Outlet = { id: string; title: string; sub: string; cold?: boolean; hot?: boolean; drain?: string; aav?: boolean }

// Top row: the farm's water, the stop valve set; the cold line to the heater at the right, the hot back from it; a row
// of outlets fed from either; their drains to one collector, the grease trap and the soak pit.
export function WaterDiagram({ runs, colours, valve, heater, outlets, trap, notes, label }: {
  runs: WaterRun[]; colours: Record<string, string>; valve: Outlet; heater: Outlet; outlets: Outlet[]; trap: Outlet
  notes: [string, string]; label: string
}) {
  const run = Object.fromEntries(runs.map((r) => [r.id, r]))
  const byKind = (s: string) => runs.filter((r) => r.system === s)
  const [main, cold] = byKind("cold"), hot = byKind("hot")[0], waste = byKind("waste")
  const collector = waste.reduce((a, r) => (r.dn > a.dn ? r : a))
  const TOP = 56, COLD = 160, HOT = 225, FIX = 300, DRAIN = 470, H = 700
  const hx = 1460
  const x0 = 150, step = Math.min(400, (1290 - x0) / Math.max(1, outlets.length - 1))
  const X = (i: number) => x0 + i * step
  const line = (system: string, d: string, dashed = false) => (
    <path d={d} style={{ stroke: colours[system] }} strokeWidth={system === "waste" ? 5 : 3.5} strokeLinejoin="round"
      strokeDasharray={dashed ? "9 7" : undefined} />
  )
  const tag = (id: string, x: number, y: number, anchor: "start" | "middle" | "end" = "start") => (
    <text x={x} y={y} textAnchor={anchor} stroke="none" className="fill-muted-foreground text-[13px]">
      <tspan className="fill-foreground font-semibold">{id}</tspan> {run[id] ? `${run[id].dn} mm · ${runLength(run[id])} m` : ""}
    </text>
  )
  const coldX = outlets.map((o, i) => (o.cold ? X(i) - 22 : null)).filter((x): x is number => x !== null)
  const hotX = outlets.map((o, i) => (o.hot ? X(i) + 22 : null)).filter((x): x is number => x !== null)
  const drainX = outlets.map((o, i) => (o.drain ? X(i) : null)).filter((x): x is number => x !== null)
  const key: [string, string, number, boolean?][] = [["cold", "Cold", 1000], ["hot", "Hot", 1100], ["waste", "Drain", 1190], ["vent", "Vent (air admittance)", 1295, true]]
  return (
    <svg viewBox={`0 0 ${W} ${H}`} role="img" className="stroke-foreground h-auto w-full min-w-[960px]"
      strokeWidth={2} strokeLinecap="round" fill="none" aria-label={label}>
      {/* the farm's water: the tank and its booster pump, shared with the compound */}
      <Unit x={100} y={TOP - 30} title="Farm water" sub="tank + booster pump" dashed />
      {line("cold", `M175 ${TOP} H255`)}
      {tag(main.id, 215, TOP + 56, "middle")}
      <Unit x={330} y={TOP - 30} title={valve.title} sub={`${valve.id} · ${valve.sub}`} muted />
      {line("cold", `M405 ${TOP} H460 V${COLD}`)}
      {line("cold", `M${Math.min(460, ...coldX)} ${COLD} H${hx - 75}`)}
      {tag(cold.id, 480, COLD - 12)}

      {/* key: a line's colour is what it carries */}
      {key.map(([k, text, x, dashed]) => (
        <g key={k} transform={`translate(${x} ${TOP})`}>
          <line x1={0} y1={0} x2={26} y2={0} strokeWidth={k === "waste" ? 5 : 3.5} strokeDasharray={dashed ? "6 5" : undefined} style={{ stroke: colours[k] }} />
          <text x={36} y={5} stroke="none" className="fill-foreground text-[15px]">{text}</text>
        </g>
      ))}

      {/* the heater at the end of the cold line, its hot back along the outlets */}
      <Unit x={hx} y={COLD - 30} title={heater.title} sub={`${heater.id} · ${heater.sub}`} w={190} />
      {line("hot", `M${hx} ${COLD + 30} V${HOT} H${Math.min(...hotX)}`)}
      {tag(hot.id, hx - 12, HOT + 22, "end")}

      {/* the outlets, each fed from the lines above it and draining to the collector below */}
      {outlets.map((o, i) => (
        <g key={o.id}>
          {o.cold ? <>{line("cold", `M${X(i) - 22} ${COLD} V${FIX}`)}<circle cx={X(i) - 22} cy={COLD} r={5} stroke="none" style={{ fill: colours.cold }} /></> : null}
          {o.hot ? <>{line("hot", `M${X(i) + 22} ${HOT} V${FIX}`)}<circle cx={X(i) + 22} cy={HOT} r={5} stroke="none" style={{ fill: colours.hot }} /></> : null}
          <Unit x={X(i)} y={FIX} title={o.title} sub={`${o.id} · ${o.sub}`} w={Math.min(170, step - 12)} />
          {o.drain ? (
            <>
              {line("waste", `M${X(i)} ${FIX + 60} V${DRAIN}`)}
              <circle cx={X(i)} cy={DRAIN} r={6} stroke="none" style={{ fill: colours.waste }} />
              {o.drain !== collector.id ? tag(o.drain, X(i) + 8, DRAIN - 34) : null}
              {o.aav ? (
                <g>
                  {line("vent", `M${X(i)} ${FIX + 100} H${X(i) - 44} V${FIX + 76}`, true)}
                  <text x={X(i) - 44} y={FIX + 120} textAnchor="middle" stroke="none" className="fill-foreground text-[13px] font-semibold">AV</text>
                </g>
              ) : null}
            </>
          ) : null}
        </g>
      ))}

      {/* the collector, the grease trap and the soak pit */}
      {line("waste", `M${Math.min(...drainX)} ${DRAIN} H${hx - 75}`)}
      {tag(collector.id, Math.min(...drainX), DRAIN + 26)}
      <text x={Math.min(...drainX)} y={DRAIN + 46} stroke="none" className="fill-muted-foreground text-[13px]">under the floor, at 1:40 or steeper</text>
      <Unit x={hx} y={DRAIN - 30} title={trap.title} sub={`${trap.id} · ${trap.sub}`} muted w={190} />
      {line("waste", `M${hx} ${DRAIN + 30} V${DRAIN + 80}`)}
      <Unit x={hx} y={DRAIN + 80} title="Soak pit" sub="SP · never the septic tank" dashed w={190} />

      <text x={x0 - 40} y={H - 46} stroke="none" className="fill-muted-foreground text-[14px]">{notes[0]}</text>
      <text x={x0 - 40} y={H - 22} stroke="none" className="fill-muted-foreground text-[14px]">{notes[1]}</text>
    </svg>
  )
}

// A breaker drawn down from (x, y), 60 tall, as the studio's; with `rcd`, the ring of an RCBO
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

function Earth({ x, y }: { x: number; y: number }) {
  return (
    <g>
      <line x1={x} y1={y} x2={x} y2={y + 14} />
      {[22, 14, 6].map((w, i) => <line key={w} x1={x - w / 2} y1={y + 14 + i * 6} x2={x + w / 2} y2={y + 14 + i * 6} />)}
    </g>
  )
}

function wrap(text: string, n = 16): string[] {
  const out: string[] = []
  for (const word of text.split(" ")) {
    const last = out.at(-1)
    if (last && (last + " " + word).length <= n) out[out.length - 1] = last + " " + word
    else out.push(word)
  }
  return out
}

const GROUPS: Record<string, string> = { lights: "Lights", sockets: "Sockets", fixed: "Fixed appliances" }

// The single-line diagram: the farm's site board, the main switch with its surge protection, the busbar and one RCBO
// per circuit, each with its rating, cable and design load. Circuits marked `stop` hang off one contactor (K) that the
// emergency stop drops.
export function PowerDiagram({ supply, circuits, colours, notes, label }: {
  supply: { title: string; sub: string; main: string; mainSub: string }; circuits: Circuit[]; colours: Record<string, string>
  notes: [string, string]; label: string
}) {
  const TOP = 50, BUS = 250, x0 = 110
  const step = (W - 2 * x0) / Math.max(1, circuits.length - 1)
  const at = (i: number) => x0 + i * step
  const H = BUS + 330
  const src = 100, main = 470, spd = 700, feed = W - x0
  const stops = circuits.map((c, i) => (c.stop ? at(i) : null)).filter((x): x is number => x !== null)
  const groups = [...new Set(circuits.map((c) => c.group))].filter((g) => GROUPS[g])
  const kY = BUS + 78
  return (
    <svg viewBox={`0 0 ${W} ${H}`} role="img" className="stroke-foreground h-auto w-full min-w-[960px]"
      strokeWidth={2} strokeLinecap="round" fill="none" aria-label={label}>
      <rect x={src - 80} y={TOP - 34} width={160} height={68} rx={12} strokeDasharray="6 6" />
      <text x={src} y={TOP - 4} textAnchor="middle" stroke="none" className="fill-foreground text-[17px] font-semibold">{supply.title}</text>
      <text x={src} y={TOP + 18} textAnchor="middle" stroke="none" className="fill-muted-foreground text-[13px]">grid + solar</text>
      <text x={src - 80} y={TOP + 64} stroke="none" className="fill-muted-foreground text-[14px]">{supply.sub}</text>
      <line x1={src + 80} y1={TOP} x2={main - 30} y2={TOP} />

      {/* the main switch, drawn on its side */}
      <g transform={`rotate(-90 ${main} ${TOP}) translate(0 ${-30})`}><Breaker x={main} y={TOP} /></g>
      <text x={main} y={TOP + 64} textAnchor="middle" stroke="none" className="fill-foreground text-[17px] font-semibold">{supply.main}</text>
      <text x={main} y={TOP + 86} textAnchor="middle" stroke="none" className="fill-muted-foreground text-[14px]">{supply.mainSub}</text>
      <line x1={main + 30} y1={TOP} x2={feed} y2={TOP} />
      <circle cx={spd} cy={TOP} r={4} className="fill-foreground" />
      <line x1={spd} y1={TOP} x2={spd} y2={TOP + 40} />
      <rect x={spd - 50} y={TOP + 40} width={100} height={44} rx={8} />
      <text x={spd} y={TOP + 68} textAnchor="middle" stroke="none" className="fill-foreground text-[16px] font-semibold">SPD type 2</text>
      <line x1={spd} y1={TOP + 84} x2={spd} y2={TOP + 100} />
      <Earth x={spd} y={TOP + 100} />
      <text x={spd + 22} y={TOP + 130} stroke="none" className="fill-muted-foreground text-[13px]">E1 · earth rod</text>
      <line x1={feed} y1={TOP} x2={feed} y2={BUS} />

      {groups.map((g, i) => (
        <g key={g} transform={`translate(${900 + i * 150} ${TOP + 100})`}>
          <line x1={0} y1={0} x2={26} y2={0} strokeWidth={5} style={{ stroke: colours[g] }} />
          <text x={36} y={5} stroke="none" className="fill-foreground text-[15px]">{GROUPS[g]}</text>
        </g>
      ))}

      <line x1={x0} y1={BUS} x2={feed} y2={BUS} strokeWidth={4} />
      {circuits.map((c, i) => {
        const x = at(i), spare = c.group === "spare"
        return (
          <g key={c.id} className={spare ? "opacity-50" : undefined}>
            <Breaker x={x} y={BUS} rcd={!spare} />
            <text x={x + 22} y={BUS + 34} stroke="none" className="fill-muted-foreground text-[13px]">{c.device}</text>
            <line x1={x} y1={BUS + 60} x2={x} y2={BUS + 100} strokeWidth={5} style={{ stroke: colours[c.group] }} />
            <text x={x} y={BUS + 130} textAnchor="middle" stroke="none" className="fill-foreground text-[21px] font-bold">{c.id}</text>
            <text x={x} y={BUS + 153} textAnchor="middle" stroke="none" className="fill-muted-foreground text-[13px]">
              {c.cable} mm²{c.phases === 3 ? " · 5-core" : ""}
            </text>
            {c.kw ? <text x={x} y={BUS + 172} textAnchor="middle" stroke="none" className="fill-muted-foreground text-[13px]">about {c.kw} kW</text> : null}
            <text x={x} y={BUS + 198} textAnchor="middle" stroke="none" className="fill-foreground text-[14px]">
              {wrap(c.serves, Math.max(10, Math.floor(step / 8))).map((l, j) => <tspan key={j} x={x} dy={j ? 18 : 0}>{l}</tspan>)}
            </text>
          </g>
        )
      })}

      {/* the emergency stop drops one contactor, K, on every cooking circuit */}
      {stops.length ? (
        <g>
          <line x1={stops[0] - 40} y1={kY} x2={stops.at(-1)!} y2={kY} strokeDasharray="6 6" strokeWidth={1.5} />
          <circle cx={stops[0] - 40} cy={kY} r={4} className="fill-foreground" />
          <text x={stops[0] - 48} y={kY + 5} textAnchor="end" stroke="none" className="fill-foreground text-[14px] font-semibold">ES</text>
          {stops.map((x) => (
            <g key={x}>
              <rect x={x - 12} y={kY - 12} width={24} height={24} rx={4} className="fill-background" />
              <text x={x} y={kY + 6} textAnchor="middle" stroke="none" className="fill-foreground text-[14px] font-semibold">K</text>
            </g>
          ))}
        </g>
      ) : null}

      <text x={x0} y={H - 46} stroke="none" className="fill-muted-foreground text-[14px]">{notes[0]}</text>
      <text x={x0} y={H - 22} stroke="none" className="fill-muted-foreground text-[14px]">{notes[1]}</text>
    </svg>
  )
}
