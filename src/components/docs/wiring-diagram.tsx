// The studio's single-line wiring diagram drawn inline (not a paper sheet), so it runs full width and follows the
// theme. Top row: whatever supply plugs in, through the inlet and the main breaker; below, one RCBO per circuit.
// Every rating comes from the generator's CSVs (circuits.csv, demand.csv). A drop's colour is what its circuit
// feeds (lights, sockets, fixed appliances), the same colours as the cable runs in the 3D view below it.

import type * as React from "react"

import { getWords } from "@/components/internationalization/words"
import { words } from "@/components/studio/words"

type Circuit = Record<string, string>

const W = 1600
const TOP = 50 // the supply row
const BUS = 260 // the busbar the circuit breakers hang from

// A breaker drawn down from (x, y): lead in, the open contact, lead out. 60 tall. With `rcd`, the ring of an RCBO.
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

// Short lines of at most `n` characters, for the circuit labels under each drop.
function wrap(text: string, n = 20): string[] {
  const out: string[] = []
  for (const word of text.split(" ")) {
    const last = out.at(-1)
    if (last && (last + " " + word).length <= n) out[out.length - 1] = last + " " + word
    else out.push(word)
  }
  return out
}

function Label({ x, y, children, sub, anchor = "middle" }: {
  x: number; y: number; children: string; sub?: string; anchor?: "start" | "middle" | "end"
}) {
  return (
    <text x={x} y={y} textAnchor={anchor} stroke="none" className="fill-foreground text-[17px] font-semibold">
      {children}
      {sub ? <tspan x={x} dy={22} className="fill-muted-foreground text-[14px] font-normal">{sub}</tspan> : null}
    </text>
  )
}

// The words are the reader's (src/components/studio/words.tsx `wiring`); pass the circuits in their language too
// (studioCsv), so each drop names what it serves in it.
export async function WiringDiagram({ circuits, demand }: { circuits: Circuit[]; demand: Record<string, string> }): Promise<React.JSX.Element> {
  const t = (await getWords(words)).wiring
  const GROUPS = t.groups
  const x0 = 110
  const step = (W - 2 * x0) / (circuits.length - 1)
  const H = BUS + 320
  const at = Object.fromEntries(circuits.map((c, i) => [c.circuit, x0 + i * step]))
  const shed = circuits.filter((c) => c.relay)
  const groups = [...new Map(circuits.filter((c) => GROUPS[c.group]).map((c) => [c.group, c.colour]))]
  // supply row, left to right
  const src = 90, inlet = 360, main = 650, spd = 880, feed = W - x0
  const relayY = BUS + 75
  return (
    <svg viewBox={`0 0 ${W} ${H}`} role="img" className="h-auto w-full min-w-[960px] stroke-foreground"
      strokeWidth={2} strokeLinecap="round" fill="none"
      aria-label={t.label(demand.inlet_A, demand.main_A, circuits.length)}>
      {/* the supply: anything at 230 V */}
      <rect x={src - 70} y={TOP - 34} width={140} height={68} rx={12} strokeDasharray="6 6" />
      <text x={src} y={TOP - 4} textAnchor="middle" stroke="none" className="fill-foreground text-[17px] font-semibold">{t.any}</text>
      <text x={src} y={TOP + 18} textAnchor="middle" stroke="none" className="fill-muted-foreground text-[14px]">{t.supply}</text>
      <Label x={src} y={TOP + 66} sub={t.sourcesSub}>{t.sources}</Label>
      <line x1={src + 70} y1={TOP} x2={inlet - 70} y2={TOP} />

      {/* the inlet on the outside of the back wall */}
      <rect x={inlet - 70} y={TOP - 34} width={140} height={68} rx={12} className="fill-muted" />
      <text x={inlet} y={TOP + 6} textAnchor="middle" stroke="none" className="fill-foreground text-[18px] font-semibold">
        {t.inlet(demand.inlet_A)}
      </text>
      <Label x={inlet} y={TOP + 66} sub={t.inletSub}>IP67, 2P+E</Label>
      <line x1={inlet + 70} y1={TOP} x2={main - 30} y2={TOP} />
      <text x={(inlet + main) / 2 + 20} y={TOP - 14} textAnchor="middle" stroke="none"
        className="fill-muted-foreground text-[14px]">{t.tails(demand.tails_mm2)}</text>

      {/* the main breaker, drawn on its side: it protects the inlet and the tails whatever feeds them */}
      <g transform={`rotate(-90 ${main} ${TOP}) translate(0 ${-30})`}><Breaker x={main} y={TOP} /></g>
      <Label x={main} y={TOP + 66} sub={t.mainSub}>{t.main(demand.main_A)}</Label>
      <line x1={main + 30} y1={TOP} x2={feed} y2={TOP} />
      <circle cx={spd} cy={TOP} r={4} className="fill-foreground" />
      <line x1={spd} y1={TOP} x2={spd} y2={TOP + 50} />
      <rect x={spd - 50} y={TOP + 50} width={100} height={44} rx={8} />
      <text x={spd} y={TOP + 78} textAnchor="middle" stroke="none" className="fill-foreground text-[16px] font-semibold">{t.spd}</text>
      <line x1={spd} y1={TOP + 94} x2={spd} y2={TOP + 110} />
      <Earth x={spd} y={TOP + 110} />
      <line x1={feed} y1={TOP} x2={feed} y2={BUS} />

      {/* key: a drop's colour is what its circuit feeds */}
      {groups.map(([g, colour], i) => (
        <g key={g} transform={`translate(${1010 + i * 135} ${TOP + 110})`}>
          <line x1={0} y1={0} x2={26} y2={0} strokeWidth={5} style={{ stroke: colour }} />
          <text x={36} y={5} stroke="none" className="fill-foreground text-[15px]">{GROUPS[g]}</text>
        </g>
      ))}

      {/* busbar and one RCBO per circuit */}
      <line x1={x0} y1={BUS} x2={feed} y2={BUS} strokeWidth={4} />
      {circuits.map((c) => {
        const x = at[c.circuit]
        const spare = !c.design_A
        return (
          <g key={c.circuit} className={spare ? "opacity-50" : undefined}>
            <Breaker x={x} y={BUS} rcd={!spare} />
            <text x={x + 24} y={BUS + 36} stroke="none" className="fill-muted-foreground text-[14px]">{c.device}</text>
            <line x1={x} y1={BUS + 60} x2={x} y2={BUS + 92} strokeWidth={5} style={{ stroke: c.colour }} />
            <text x={x} y={BUS + 124} textAnchor="middle" stroke="none" className="fill-foreground text-[22px] font-bold">
              {c.circuit}
            </text>
            <text x={x} y={BUS + 148} textAnchor="middle" stroke="none" className="fill-muted-foreground text-[14px]">
              {c.cable_mm2} mm²{c.design_A ? ` · ${c.design_A} A` : ""}
            </text>
            <text x={x} y={BUS + 178} textAnchor="middle" stroke="none" className="fill-foreground text-[15px]">
              {wrap(c.serves.replace(/\s*\(.*\)/, "")).map((l, j) => <tspan key={j} x={x} dy={j ? 20 : 0}>{l}</tspan>)}
            </text>
          </g>
        )
      })}

      {/* the priority relay senses the hob and sheds the heater and the AC through one contactor, K */}
      {shed.length ? (
        <g>
          <line x1={at.C4} y1={relayY} x2={at[shed.at(-1)!.circuit]} y2={relayY} strokeDasharray="6 6" strokeWidth={1.5} />
          <circle cx={at.C4} cy={relayY} r={4} className="fill-foreground" />
          {shed.map((c) => (
            <g key={c.circuit}>
              <rect x={at[c.circuit] - 12} y={relayY - 12} width={24} height={24} rx={4} className="fill-background" />
              <text x={at[c.circuit]} y={relayY + 6} textAnchor="middle" stroke="none" className="fill-foreground text-[14px] font-semibold">K</text>
            </g>
          ))}
        </g>
      ) : null}

      <text x={x0} y={H - 46} stroke="none" className="fill-muted-foreground text-[14px]">
        {t.peak(demand.total_A, demand.inlet_A, shed.map((c) => c.circuit).join(t.and))}
      </text>
      <text x={x0} y={H - 22} stroke="none" className="fill-muted-foreground text-[14px]">
        {t.earthing}
      </text>
    </svg>
  )
}
