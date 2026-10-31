import { getWords } from "@/components/internationalization/words"
import { Chain, Dim, HDim, Name, Note, VDim } from "@/components/drawing/dims"
import { frame, mm, tier } from "@/components/drawing/geometry"

import office from "./office.json"
import { words } from "./words"

// The office drawn in the pattern of the camp plan (src/components/camp/camp-plan.tsx): thin lines, no colour, and
// its dimensions as the studio's plan sets them (src/components/drawing): the back wall's chain (sofa, the open floor,
// desk), the glazing, the stair and the overall length under the deck, the box and the deck at the far end, and the
// free floor in front of the sofa. Seen from the deck, as the 3D's front view: the deck
// and the glazing face down the page (north), the stair end to the left. Units are metres, x from the stair
// end, y toward the deck, the container's centre line at y = 0.

const { container: box, glazing, deck, workstation: ws, sofa, cafe } = office
const thin = { fill: "none", stroke: "currentColor", strokeWidth: 0.75, vectorEffect: "non-scaling-stroke" } as const
const medium = { ...thin, strokeWidth: 1.6 } as const
const faint = { ...thin, strokeWidth: 0.5, strokeOpacity: 0.45 } as const
const dashed = { ...thin, strokeDasharray: "4 3" } as const

const f = (n: number) => +n.toFixed(3)
const rect = (x0: number, y0: number, x1: number, y1: number) => ({ x: f(x0), y: f(y0), width: f(x1 - x0), height: f(y1 - y0) })

const L = box.l, H = box.w / 2
const edge = H + deck.d // the deck's outer edge
const sx = -(deck.stair.risers - 1) * deck.stair.tread // the stair's foot
// the drawing, then how far its dimensions reach past it (studio mm): the names over the back wall's chain, two
// tiers under the deck and at the far end, the stair's width beside it
const { k, viewBox } = frame({ x0: sx, y0: -H, x1: L, y1: edge }, { top: 14, right: 13, bottom: 13, left: 7 })
const under = deck.d / k // from the front wall down to the deck's edge, in studio mm

// an office chair from above: a seat, its back to one side (toward: the way the sitter faces)
function Chair({ x, y, toward, s = 0.5 }: { x: number; y: number; toward: "up" | "down" | "left" | "right"; s?: number }) {
  const h = s / 2, b = 0.08
  const back = { up: rect(x - h, y + h - b, x + h, y + h), down: rect(x - h, y - h, x + h, y - h + b),
    left: rect(x + h - b, y - h, x + h, y + h), right: rect(x - h, y - h, x - h + b, y + h) }[toward]
  return (
    <g>
      <rect {...rect(x - h, y - h, x + h, y + h)} rx={0.06} {...thin} />
      <rect {...back} {...thin} />
    </g>
  )
}

// `title` (the drawing's accessible name) defaults to the page's; the docs pass the guide's own.
export async function OfficePlan({ title, className }: { title?: string; className?: string }) {
  const w = await getWords(words)
  const name = w.plan.labels
  title ??= w.plan.title
  const { x0: ix0, x1: ix1, y0: iy0, y1: iy1 } = box.inner
  const front = H, rail = edge - 0.04
  const st = deck.stair, steps = st.risers - 1
  const { x0: g0, x1: g1, panels } = glazing
  const pw = (g1 - g0) / panels
  const boards = Array.from({ length: Math.ceil(L / 0.146) }, (_, k) => f(k * 0.146))
  return (
    <svg viewBox={viewBox} role="img" aria-label={title} className={className}>
      {/* The steel box with its lining, the glazing open in the front wall, the cargo doors at the stair end */}
      <path d={`M${g0} ${front}H0V${-H}H${L}V${front}H${g1}`} {...medium} />
      <path d={`M${g0} ${iy1}H${ix0}V${iy0}H${ix1}V${iy1}H${g1}`} {...thin} />
      {[g0, g1].map((x) => <line key={x} x1={x} x2={x} y1={iy1} y2={front} {...thin} />)}
      {/* four sliding panels on two tracks; the middle two slid open behind the outer ones */}
      {Array.from({ length: panels }, (_, k) => {
        const x = k === 1 ? g0 + pw * 0.15 : k === 2 ? g1 - pw * 1.15 : g0 + k * pw
        const y = k === 0 || k === 3 ? front - 0.03 : front - 0.08
        return <line key={k} x1={f(x)} x2={f(x + pw)} y1={f(y)} y2={f(y)} {...medium} strokeWidth={1.1} />
      })}
      <line x1={0.04} x2={0.04} y1={-H + 0.25} y2={H - 0.25} {...dashed} />

      {/* The deck on its frame: boards across the front, the railings round its three open sides, the stair
          down off the front corner at the cargo-door end */}
      <rect {...rect(0, front, L, edge)} {...medium} />
      {boards.map((x) => <line key={x} x1={x} x2={x} y1={f(front)} y2={f(edge)} {...faint} />)}
      <path d={`M0.04 ${f(front)}V${f(edge - st.w)}M0.04 ${f(rail)}H${f(L - 0.04)}V${f(front)}`} {...dashed} />
      <rect {...rect(sx, edge - st.w, 0, edge)} {...thin} />
      {Array.from({ length: steps - 1 }, (_, k) => <line key={k} x1={f(sx + (k + 1) * st.tread)} x2={f(sx + (k + 1) * st.tread)} y1={f(edge - st.w)} y2={f(edge)} {...thin} />)}

      {/* The big desk across the whole far end wall: the Studio Display centred on its stand, the Mac Studio beside
          it, the keyboard and mouse, the gaming chair facing the wall */}
      <rect {...rect(ix1 - ws.d, iy0, ix1, iy1)} {...thin} />
      <rect {...rect(ix1 - 0.07 - ws.display.foot, -0.09, ix1 - 0.07, 0.09)} rx={0.02} {...faint} />
      <rect {...rect(ix1 - 0.12 - ws.display.t, -ws.display.w / 2, ix1 - 0.12, ws.display.w / 2)} rx={0.01} {...thin} />
      <rect {...rect(ix1 - 0.08 - ws.mac.w, ws.mac.y - ws.mac.w / 2, ix1 - 0.08, ws.mac.y + ws.mac.w / 2)} rx={0.03} {...thin} />
      <circle cx={f(ix1 - 0.08 - ws.mac.w / 2)} cy={ws.mac.y} r={0.05} {...faint} />
      <rect {...rect(ix1 - ws.d + 0.12, -0.22, ix1 - ws.d + 0.25, 0.22)} rx={0.02} {...thin} />
      <rect {...rect(ix1 - ws.d + 0.15, 0.32, ix1 - ws.d + 0.25, 0.38)} rx={0.03} {...thin} />
      <Chair x={ws.chair[0]} y={ws.chair[1]} toward="right" s={0.62} />

      {/* The L sofa in one piece: its short leg across the whole cargo-door end, its long leg down the back wall,
          the backrest round the inside of the L, an arm at each free end, the corner seat and the cushions */}
      <path d={`M${ix0} ${iy0}H${sofa.x1}V${f(iy0 + sofa.d)}H${f(ix0 + sofa.d)}V${iy1}H${ix0}Z`} {...thin} />
      <path d={`M${f(sofa.x1 - sofa.arm)} ${f(iy0 + sofa.d)}V${f(iy0 + sofa.rest)}H${f(ix0 + sofa.rest)}V${f(iy1 - sofa.arm)}H${f(ix0 + sofa.d)}`} {...thin} />
      {[
        ...Array.from({ length: sofa.seats.wall }, (_, k) => {
          const x = ix0 + sofa.d + (k * (sofa.x1 - sofa.arm - ix0 - sofa.d)) / sofa.seats.wall
          return `M${f(x)} ${f(iy0 + sofa.rest)}V${f(iy0 + sofa.d)}`
        }),
        ...Array.from({ length: sofa.seats.end }, (_, k) => {
          const y = iy0 + sofa.d + (k * (iy1 - sofa.arm - iy0 - sofa.d)) / sofa.seats.end
          return `M${f(ix0 + sofa.rest)} ${f(y)}H${f(ix0 + sofa.d)}`
        }),
      ].map((d) => <path key={d} d={d} {...faint} />)}
      <rect {...rect(sofa.table.x0, sofa.table.y0, sofa.table.x1, sofa.table.y1)} rx={0.04} {...thin} />

      <Note k={k} x={ix1 - ws.d / 2} y={iy1 - 0.15}>{name.desk}</Note>
      <Note k={k} x={ix1 - 0.08 - ws.mac.w / 2} y={ws.mac.y - ws.mac.w / 2 - 0.08}>{name.mac}</Note>
      <Note k={k} x={ix1 - 0.27} y={0} rotate={90}>{name.display}</Note>
      <Note k={k} x={(ix0 + sofa.d + sofa.x1 - sofa.arm) / 2} y={iy0 + (sofa.rest + sofa.d) / 2}>{name.sofa}</Note>
      <Note k={k} x={(sofa.table.x0 + sofa.table.x1) / 2} y={(sofa.table.y0 + sofa.table.y1) / 2}>{name.table}</Note>
      {/* The ahwa set on the deck: the round marble table on its pedestal, a chair either side, both looking out over the garden */}
      <circle cx={cafe.table.x} cy={cafe.table.y} r={cafe.table.r} {...thin} />
      <circle cx={cafe.table.x} cy={cafe.table.y} r={0.08} {...faint} />
      {cafe.chairs.map(([x, y]) => <Chair key={x} x={x} y={y} s={cafe.chair.w} toward="down" />)}
      <Note k={k} x={cafe.table.x} y={cafe.table.y + cafe.table.r + 0.14}>{name.cafe}</Note>
      <Note k={k} x={(g0 + g1) / 2} y={front - 0.16}>{name.glazing}</Note>
      <Name k={k} x={L / 2 - 0.6} y={edge - 0.5}>{name.deck}</Name>
      <Note k={k} x={sx / 2} y={edge - st.w - 0.12}>{name.stair}</Note>
      <Note k={k} x={-0.12} y={-0.32} anchor="end">{name.cargo}</Note>
      <Note k={k} x={-0.12} y={-0.18} anchor="end">{name.doors}</Note>

      {/* The back wall: the sofa's long leg, the open floor, the desk across the far end */}
      <Chain k={k} along="x" at={[ix0, sofa.x1, ix1 - ws.d, ix1]} edge={-H} side="top" names={[name.sofa, null, name.desk]} />
      {/* Under the deck: the stair's run and the glazing, then the overall length */}
      <HDim k={k} x0={sx} x1={0} y={edge} side="bottom" prefix={name.stairDim} />
      <Dim k={k} a={[g0, front]} b={[g1, front]} off={under + tier(1)} label={`${name.glazingDim} ${mm(g1 - g0)}`} />
      <Dim k={k} a={[0, front]} b={[L, front]} off={under + tier(2)} />
      {/* The far end: the box and the deck, then both; the stair's width beside it */}
      <Chain k={k} along="y" at={[-H, front, edge]} edge={L} side="right" overall />
      <VDim k={k} y0={edge - st.w} y1={edge} x={sx} side="left" />
      {/* Inside: the free floor between the sofa's long leg and the front wall */}
      <Dim k={k} a={[(sofa.table.x1 + sofa.x1) / 2, iy0 + sofa.d]} b={[(sofa.table.x1 + sofa.x1) / 2, iy1]} off={0} size={2.2} />
    </svg>
  )
}
