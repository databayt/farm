import camp from "./camp.json"

// One camp drawn in the pattern of the compound plan (src/components/home/compound-plan.tsx): thin lines,
// no colour, bold capitals and dimensions in millimetres. The door faces down the page, toward the viewer of
// the 3D's front view. Units are metres, the tent's centre at 0,0, y toward the door.

const { tent, deck, bed, crate, rug, porch } = camp
const thin = { fill: "none", stroke: "currentColor", strokeWidth: 0.75, vectorEffect: "non-scaling-stroke" } as const
const medium = { ...thin, strokeWidth: 1.6 } as const
const faint = { ...thin, strokeWidth: 0.5, strokeOpacity: 0.45 } as const
const dashed = { ...thin, strokeDasharray: "4 3" } as const
const label = {
  fontFamily: "var(--font-sans), ui-sans-serif, system-ui, sans-serif",
  fontSize: 0.13,
  fontWeight: 700,
  letterSpacing: "0.04em",
  fill: "currentColor",
} as const
const small = { ...label, fontSize: 0.1, fontWeight: 600 } as const

const f = (n: number) => +n.toFixed(3)
const mm = (m: number) => Math.round(m * 1000).toLocaleString("en-US")
// a six-sided outline, flat at the back and the front (the door's side), round a centre
const hex = (r: number, cy = 0) =>
  Array.from({ length: 6 }, (_, k) => [f(r * Math.cos((k * Math.PI) / 3)), f(cy + r * Math.sin((k * Math.PI) / 3))])
const path = (p: number[][]) => `M${p.map((q) => q.join(" ")).join("L")}Z`
const rect = (x0: number, y0: number, x1: number, y1: number) => ({ x: f(x0), y: f(y0), width: f(x1 - x0), height: f(y1 - y0) })

function Dimension({ x0, x1, y }: { x0: number; x1: number; y: number }) {
  const tick = 0.06
  return (
    <g>
      <line x1={x0} x2={x1} y1={y} y2={y} {...thin} />
      {[x0, x1].map((x) => <line key={x} x1={f(x - tick)} x2={f(x + tick)} y1={f(y + tick)} y2={f(y - tick)} {...thin} />)}
      <text x={f((x0 + x1) / 2)} y={f(y - 0.07)} textAnchor="middle" style={small}>{mm(x1 - x0)}</text>
    </g>
  )
}

export function CampPlan({ title, className }: { title: string; className?: string }) {
  const outer = hex(tent.r)
  const front = tent.r * Math.sin(Math.PI / 3) // the flat front wall's line
  const door = tent.door / 2
  const deckY = deck.y + deck.r * Math.sin(Math.PI / 3)
  const by1 = bed.y0 + bed.l
  // the deck's boards run across, 140 mm a board, clipped to its outline
  const boards = Array.from({ length: Math.ceil((2 * deck.r) / 0.14) }, (_, k) => f(deck.y - deck.r + k * 0.14))
  return (
    <svg viewBox="-3.3 -2.35 6.6 5.75" role="img" aria-label={title} className={className}>
      <defs>
        <clipPath id="camp-deck"><path d={path(hex(deck.r, deck.y))} /></clipPath>
      </defs>

      {/* The deck, its boards, and the tent on it: the canvas at the floor, the door open in the front wall,
          the shoulder and the small top dashed overhead */}
      <path d={path(hex(deck.r, deck.y))} {...medium} />
      <g clipPath="url(#camp-deck)">
        {boards.map((y) => <line key={y} x1={-deck.r} x2={deck.r} y1={y} y2={y} {...faint} />)}
      </g>
      <path d={path(outer)} fill="var(--background)" stroke="none" />
      <path d={`M${-door} ${f(front)}L${outer[2].join(" ")}L${outer[3].join(" ")}L${outer[4].join(" ")}L${outer[5].join(" ")}L${outer[0].join(" ")}L${outer[1].join(" ")}L${door} ${f(front)}`} {...medium} />
      <line x1={-door} x2={door} y1={f(front)} y2={f(front)} {...dashed} />
      <path d={path(hex(tent.shoulder.r))} {...dashed} />
      <path d={path(hex(tent.top.r))} {...dashed} />

      {/* Inside: the bed against the back wall with its pillows and throw, the crate with a lantern, the rug */}
      <rect {...rect(-bed.w / 2, bed.y0, bed.w / 2, by1)} {...thin} />
      {[-1, 1].map((s) => (
        <rect key={s} {...rect(s < 0 ? -bed.w / 2 + 0.08 : 0.04, bed.y0 + 0.08, s < 0 ? -0.04 : bed.w / 2 - 0.08, bed.y0 + 0.4)} rx={0.05} {...thin} />
      ))}
      <line x1={-bed.w / 2} x2={bed.w / 2} y1={f(bed.y0 + 0.55)} y2={f(bed.y0 + 0.55)} {...thin} />
      <rect {...rect(-bed.w / 2, by1 - 0.42, bed.w / 2, by1 - 0.12)} {...faint} />
      <rect {...rect(crate.x - crate.w / 2, crate.y - crate.d / 2, crate.x + crate.w / 2, crate.y + crate.d / 2)} {...thin} />
      <circle cx={crate.x} cy={crate.y} r={0.07} {...thin} />
      <rect {...rect(-rug.w / 2, rug.y - rug.d / 2, rug.w / 2, rug.y + rug.d / 2)} {...thin} />
      <rect {...rect(-rug.w / 2 + 0.05, rug.y - rug.d / 2 + 0.05, rug.w / 2 - 0.05, rug.y + rug.d / 2 - 0.05)} {...faint} />

      {/* The porch: two folding chairs either side of a small round table with a lantern */}
      {porch.chairs.map(([cx, cy]) => {
        const { w, d } = porch.chair
        return (
          <g key={cx}>
            <rect {...rect(cx - w / 2, cy - d / 2, cx + w / 2, cy + d / 2)} {...thin} />
            <line x1={f(cx - w / 2)} x2={f(cx + w / 2)} y1={f(cy - d / 2 + 0.07)} y2={f(cy - d / 2 + 0.07)} {...thin} />
          </g>
        )
      })}
      <circle cx={porch.table.x} cy={porch.table.y} r={porch.table.r} {...thin} />
      <circle cx={porch.table.x} cy={porch.table.y} r={0.06} {...thin} />

      <text x={0} y={f(by1 - 0.28)} textAnchor="middle" style={small}>BED</text>
      <text x={f(tent.r + 0.12)} y={-0.15} style={label}>TENT</text>
      <text x={f(deck.r * 0.55 + 0.12)} y={f(deckY - 0.25)} style={label}>DECK</text>
      <text x={0} y={f(porch.table.y + porch.table.r + 0.24)} textAnchor="middle" style={small}>PORCH</text>
      <Dimension x0={-tent.r} x1={tent.r} y={-1.85} />
      <Dimension x0={-deck.r} x1={deck.r} y={3.05} />
    </svg>
  )
}
