// A room's single-line wiring diagram, drawn inline in the studio's WiringDiagram pattern (wiring-diagram.tsx), for
// the rooms fed from the farm's site board rather than through the studio's own inlet: the supply, the room board's
// double-pole main switch with its surge protection, then one RCBO per circuit. A drop's colour is what its circuit
// feeds, the same colours as the runs in the 3D view below it. Every rating comes from the page's JSON.

import { getLocale } from "@/components/internationalization/locale"
import type { Words } from "@/components/internationalization/words"

export type RoomCircuit = { id: string; serves: string; device: string; cable_mm2: number; design_A?: number; group: string; colour: string }

const W = 1600
const TOP = 50 // the supply row
const BUS = 260 // the busbar the circuit breakers hang from
// the diagram's words (D-058); the supply, the board and the notes come from the page, already in its language
const en = {
  groups: { lights: "Lights", sockets: "Sockets", fixed: "Fixed appliances", data: "Data and Wi-Fi" } as Record<string, string>,
  main: (a: number) => `Main switch ${a} A DP`,
  spd: "SPD type 2",
  label: (supply: string, a: number, board: string, n: number) =>
    `Single-line diagram: ${supply} into a ${a} A main switch with surge protection on ${board}, then one RCBO for each of ${n} circuits`,
}
const rw: typeof en = {
  groups: { lights: "Amatara", sockets: "Priza", fixed: "Ibikoresho bifashe", data: "Data na Wi-Fi" },
  main: (a) => `Disijonkitere nkuru A ${a} DP`,
  spd: "SPD ubwoko bwa 2",
  label: (supply, a, board, n) =>
    `Igishushanyo cy'umurongo umwe: ${supply} kijya kuri disijonkitere nkuru ya A ${a} ifite uburinzi bw'umuriro mwinshi (${board}), hanyuma RCBO imwe kuri buri muzunguruko muri ${n}`,
}
const words: Words<typeof en> = { en, rw }

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

function Label({ x, y, children, sub }: { x: number; y: number; children: string; sub?: string }) {
  return (
    <text x={x} y={y} textAnchor="middle" stroke="none" className="fill-foreground text-[17px] font-semibold">
      {children}
      {sub ? <tspan x={x} dy={22} className="fill-muted-foreground text-[14px] font-normal">{sub}</tspan> : null}
    </text>
  )
}

export async function RoomWiring({ circuits, mainA, supply, board, notes }: {
  circuits: RoomCircuit[]
  mainA: number
  supply: { title: string; sub: string; cable: string }
  board: string
  notes: string[]
}) {
  const t = words[await getLocale()], GROUPS = t.groups
  const x0 = 140
  const step = circuits.length > 1 ? (W - 2 * x0) / (circuits.length - 1) : 0
  const H = BUS + 300 + notes.length * 24
  const groups = [...new Map(circuits.filter((c) => GROUPS[c.group]).map((c) => [c.group, c.colour]))]
  const src = 110, main = 560, spd = 820, feed = W - x0
  return (
    <svg viewBox={`0 0 ${W} ${H}`} role="img" className="h-auto w-full min-w-[960px] stroke-foreground"
      strokeWidth={2} strokeLinecap="round" fill="none"
      aria-label={t.label(supply.title, mainA, board, circuits.length)}>
      {/* the supply: the farm's, off the drawing */}
      <rect x={src - 90} y={TOP - 34} width={180} height={68} rx={12} strokeDasharray="6 6" />
      <text x={src} y={TOP - 4} textAnchor="middle" stroke="none" className="fill-foreground text-[17px] font-semibold">{supply.title}</text>
      <text x={src} y={TOP + 18} textAnchor="middle" stroke="none" className="fill-muted-foreground text-[14px]">{supply.sub}</text>
      <line x1={src + 90} y1={TOP} x2={main - 30} y2={TOP} />
      <text x={(src + main) / 2 + 20} y={TOP - 14} textAnchor="middle" stroke="none" className="fill-muted-foreground text-[14px]">{supply.cable}</text>

      {/* the main switch, drawn on its side */}
      <g transform={`rotate(-90 ${main} ${TOP}) translate(0 ${-30})`}><Breaker x={main} y={TOP} /></g>
      <Label x={main} y={TOP + 66} sub={board}>{t.main(mainA)}</Label>
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
        <g key={g} transform={`translate(${960 + i * 150} ${TOP + 110})`}>
          <line x1={0} y1={0} x2={26} y2={0} strokeWidth={5} style={{ stroke: colour }} />
          <text x={36} y={5} stroke="none" className="fill-foreground text-[15px]">{GROUPS[g]}</text>
        </g>
      ))}

      {/* busbar and one RCBO per circuit */}
      <line x1={circuits.length > 1 ? x0 : feed} y1={BUS} x2={feed} y2={BUS} strokeWidth={4} />
      {circuits.map((c, i) => {
        const x = circuits.length > 1 ? x0 + i * step : feed
        const spare = c.group === "spare"
        return (
          <g key={c.id} className={spare ? "opacity-50" : undefined}>
            <Breaker x={x} y={BUS} rcd={!spare} />
            <text x={x + 24} y={BUS + 36} stroke="none" className="fill-muted-foreground text-[14px]">{c.device}</text>
            <line x1={x} y1={BUS + 60} x2={x} y2={BUS + 92} strokeWidth={5} style={{ stroke: c.colour }} />
            <text x={x} y={BUS + 124} textAnchor="middle" stroke="none" className="fill-foreground text-[22px] font-bold">{c.id}</text>
            <text x={x} y={BUS + 148} textAnchor="middle" stroke="none" className="fill-muted-foreground text-[14px]">
              {c.cable_mm2} mm²{c.design_A ? ` · ${c.design_A} A` : ""}
            </text>
            <text x={x} y={BUS + 178} textAnchor="middle" stroke="none" className="fill-foreground text-[15px]">
              {wrap(c.serves).map((l, j) => <tspan key={j} x={x} dy={j ? 20 : 0}>{l}</tspan>)}
            </text>
          </g>
        )
      })}

      {notes.map((n, i) => (
        <text key={i} x={x0 - 40} y={H - 22 - (notes.length - 1 - i) * 24} stroke="none" className="fill-muted-foreground text-[14px]">{n}</text>
      ))}
    </svg>
  )
}
