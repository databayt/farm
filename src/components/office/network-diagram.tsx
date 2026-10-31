// The farm's network from the office, drawn inline in the studio's wiring-diagram pattern: the 4G networks into
// the router, the router into the PoE switch, and a drop from the switch for every outlet and access point. The
// office is taken as the base of the IoT architecture's case A (content/docs/iot-architecture.mdx); the drops
// beyond the office are dashed, as they are planned with the other buildings, not drawn here.

import { getLocale } from "@/components/internationalization/locale"
import { words } from "@/components/office/words"

type Link = { id: string; serves: string; colour: string }
type Point = { id: string; model: string; circuit?: string; description: string }

const W = 1600
const TOP = 50
const BUS = 280

function Box({ x, y, w = 150, title, sub, dashed = false, muted = false }: {
  x: number; y: number; w?: number; title: string; sub?: string; dashed?: boolean; muted?: boolean
}) {
  return (
    <g>
      <rect x={x - w / 2} y={y - 34} width={w} height={68} rx={12} strokeDasharray={dashed ? "6 6" : undefined}
        className={muted ? "fill-muted" : undefined} />
      <text x={x} y={sub ? y - 4 : y + 6} textAnchor="middle" stroke="none" className="fill-foreground text-[17px] font-semibold">{title}</text>
      {sub ? <text x={x} y={y + 18} textAnchor="middle" stroke="none" className="fill-muted-foreground text-[14px]">{sub}</text> : null}
    </g>
  )
}

function wrap(text: string, n = 22): string[] {
  const out: string[] = []
  for (const word of text.split(" ")) {
    const last = out.at(-1)
    if (last && (last + " " + word).length <= n) out[out.length - 1] = last + " " + word
    else out.push(word)
  }
  return out
}

// `links` and `points` come in the reader's language (officeData); the diagram's own words are in words.tsx
export async function NetworkDiagram({ links, points }: { links: Link[]; points: Point[] }) {
  const t = words[await getLocale()].network.diagram
  const colour = Object.fromEntries(links.map((l) => [l.id, l.colour]))
  // the office's own drops, then the planned ones beyond it
  const drops = [
    ...points.filter((p) => p.circuit).map((p) => ({ id: p.id, text: p.description.replace(/\s*\(.*\)/, ""), colour: colour[p.circuit!], away: false })),
    { id: "AP", text: t.ap, colour: colour.N1, away: true },
    { id: "CAM", text: t.cam, colour: colour.N1, away: true },
  ]
  const x0 = 130, step = (W - 2 * x0) / (drops.length - 1)
  const net = 120, router = 470, sw = 820, gw = 1130, ups = 1400
  const H = BUS + 250
  return (
    <svg viewBox={`0 0 ${W} ${H}`} role="img" className="h-auto w-full min-w-[960px] stroke-foreground"
      strokeWidth={2} strokeLinecap="round" fill="none"
      aria-label={t.label(drops.length)}>
      <Box x={net} y={TOP} w={180} title={t.networks.title} sub={t.networks.sub} dashed />
      <line x1={net + 90} y1={TOP} x2={router - 75} y2={TOP} strokeDasharray="2 8" />
      <Box x={router} y={TOP} title={t.router.title} sub={t.router.sub} muted />
      <line x1={router + 75} y1={TOP} x2={sw - 75} y2={TOP} />
      <Box x={sw} y={TOP} title={t.switch.title} sub={t.switch.sub} muted />
      <line x1={sw + 75} y1={TOP} x2={gw - 75} y2={TOP} />
      <Box x={gw} y={TOP} title={t.gateway.title} sub={t.gateway.sub} w={210} muted />
      {/* the UPS keeps the cabinet up through a cut, on its own circuit (C3) */}
      <Box x={ups} y={TOP + 130} title={t.ups.title} sub={t.ups.sub} />
      <path d={`M ${ups} ${TOP + 96} V ${TOP + 70} H ${router} V ${TOP + 34}`} strokeDasharray="6 6" strokeWidth={1.5} />
      <line x1={sw + 40} y1={TOP + 70} x2={sw + 40} y2={TOP + 34} strokeDasharray="6 6" strokeWidth={1.5} />
      <line x1={gw} y1={TOP + 70} x2={gw} y2={TOP + 34} strokeDasharray="6 6" strokeWidth={1.5} />
      <text x={(sw + gw) / 2} y={TOP + 92} textAnchor="middle" stroke="none" className="fill-muted-foreground text-[14px]">
        {t.battery}
      </text>
      <text x={x0 - 40} y={TOP + 160} stroke="none" className="fill-muted-foreground text-[14px]">{t.cabinet}</text>

      {/* key */}
      {links.map((l, i) => (
        <g key={l.id} transform={`translate(${x0 - 40 + i * 300} ${TOP + 200})`}>
          <line x1={0} y1={0} x2={26} y2={0} strokeWidth={5} style={{ stroke: l.colour }} />
          <text x={36} y={5} stroke="none" className="fill-foreground text-[15px]">{l.id} · {l.serves}</text>
        </g>
      ))}

      {/* the switch's ports: one drop each */}
      <line x1={sw} y1={TOP + 34} x2={sw} y2={BUS} />
      <line x1={x0} y1={BUS} x2={W - x0} y2={BUS} strokeWidth={4} />
      <text x={sw + 12} y={BUS - 14} stroke="none" className="fill-muted-foreground text-[14px]">{t.ports}</text>
      {drops.map((d, i) => {
        const x = x0 + i * step
        return (
          <g key={d.id}>
            <line x1={x} y1={BUS} x2={x} y2={BUS + 50} strokeWidth={5} strokeDasharray={d.away ? "8 8" : undefined} style={{ stroke: d.colour }} />
            <text x={x} y={BUS + 84} textAnchor="middle" stroke="none" className="fill-foreground text-[22px] font-bold">{d.id}</text>
            <text x={x} y={BUS + 112} textAnchor="middle" stroke="none" className="fill-foreground text-[15px]">
              {wrap(d.text).map((l, j) => <tspan key={j} x={x} dy={j ? 20 : 0}>{l}</tspan>)}
            </text>
          </g>
        )
      })}
      <text x={x0 - 40} y={H - 46} stroke="none" className="fill-muted-foreground text-[14px]">
        {t.cable}
      </text>
      <text x={x0 - 40} y={H - 22} stroke="none" className="fill-muted-foreground text-[14px]">
        {t.signal}
      </text>
    </svg>
  )
}
