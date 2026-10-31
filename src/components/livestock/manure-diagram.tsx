// The yard's loop drawn inline, in the water diagram's pattern: the litter and the manure leave the shed and the yard for
// the three compost bays by the tank, are turned from bay to bay, and go out finished to the vegetable beds and the tree
// pits; the beds' residues and the cut fodder come back to the herd in baskets. The bays and their rule come from
// src/components/livestock/livestock.json (compost); nothing is weighed yet, so the drawing carries no tonnage.

import { getWords } from "@/components/internationalization/words"

import { words } from "./words"

const W = 1600
const H = 360
const ROW = 110

function Step({ x, title, sub, muted = false, w = 230 }: { x: number; title: string; sub: string; muted?: boolean; w?: number }) {
  return (
    <g>
      <rect x={x - w / 2} y={ROW - 38} width={w} height={76} rx={10} className={muted ? "fill-muted" : "fill-background"} />
      <text x={x} y={ROW - 8} textAnchor="middle" stroke="none" className="fill-foreground text-[16px] font-semibold">{title}</text>
      <text x={x} y={ROW + 15} textAnchor="middle" stroke="none" className="fill-muted-foreground text-[13px]">{sub}</text>
    </g>
  )
}

export async function ManureDiagram({ bay, bays }: { bay: number; bays: number }) {
  const t = (await getWords(words)).manure
  const xs = [170, 470, 770, 1070, 1400]
  const arrow = (x0: number, x1: number) => <path d={`M${x0} ${ROW} H${x1}`} markerEnd="url(#manure-head)" />
  return (
    <svg viewBox={`0 0 ${W} ${H}`} role="img" className="stroke-foreground h-auto w-full min-w-[960px]"
      strokeWidth={2} strokeLinecap="round" fill="none"
      aria-label={t.label(bays)}>
      <defs>
        <marker id="manure-head" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="8" markerHeight="8" orient="auto-start-reverse">
          <path d="M0 0 L10 5 L0 10 z" className="fill-foreground" stroke="none" />
        </marker>
      </defs>
      <Step x={xs[0]} title={t.shed.title} sub={t.shed.sub} muted />
      {arrow(xs[0] + 115, xs[1] - 117)}
      <Step x={xs[1]} title={t.bay1.title} sub={t.bay1.sub(bay)} />
      {arrow(xs[1] + 115, xs[2] - 117)}
      <Step x={xs[2]} title={t.bay2.title} sub={t.bay2.sub} />
      {arrow(xs[2] + 115, xs[3] - 117)}
      <Step x={xs[3]} title={t.bay3.title} sub={t.bay3.sub} />
      {arrow(xs[3] + 115, xs[4] - 132)}
      <Step x={xs[4]} title={t.beds.title} sub={t.beds.sub} muted w={260} />
      {/* the way back: what the field leaves feeds the herd */}
      <path d={`M${xs[4]} ${ROW + 38} V${ROW + 120} H${xs[0]} V${ROW + 42}`} strokeDasharray="8 8" markerEnd="url(#manure-head)" />
      <text x={(xs[0] + xs[4]) / 2} y={ROW + 110} textAnchor="middle" stroke="none" className="fill-muted-foreground text-[14px]">
        {t.back}
      </text>
      <text x={110} y={H - 46} stroke="none" className="fill-muted-foreground text-[14px]">
        {t.notes[0]}
      </text>
      <text x={110} y={H - 22} stroke="none" className="fill-muted-foreground text-[14px]">
        {t.notes[1]}
      </text>
    </svg>
  )
}
