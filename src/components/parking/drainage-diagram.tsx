// Where the parking's rain goes, drawn inline in the field's water diagram's pattern so it runs full width and follows
// the theme: a long section along the lot from its open east end to the west, the pavers on their bedding and
// sub-base falling 1 in 100, the gravel trench across the west end and the soakaway pit it drains to (shown beyond the
// trench's end). Every depth and fall comes from parking.json build and drainage; heights are drawn about four times the
// length scale so the layers read. The water's colours match the 3D drawing below it.

export const DRAIN_COLOUR = { fall: "#2f7ed8", trench: "#1d4e89", pit: "#5fb0ea" }

type Build = { dig: number; subbase: number; bedding: number; paver: { h: number } }
type Drainage = { lot: number; turn: number; road: number; trench: { w: number; depth: number; pipe: number; x: number }; pit: { size: number; depth: number } }

const W = 1600
const H = 540

export function DrainageDiagram({ box, build, drainage }: { box: number[]; build: Build; drainage: Drainage }) {
  const [x0, , x1] = box
  const HS = 47, VS = 200 // px a metre along, and down (about four times)
  const left = 4.2 // the section's west end, in plan metres
  const X = (x: number) => 80 + (x - left) * HS
  const top = 170 // the lot's west end at its surface
  const S = (x: number) => top - (Math.max(x0, Math.min(x1, x)) - x0) * drainage.lot * VS // the lot's surface
  const layers: [string, number, string][] = [["Pavers, cells grassed", build.paver.h, "fill-background"],
    ["Bedding", build.bedding, "fill-muted"], ["Crushed-stone sub-base", build.subbase, "fill-muted-foreground/25"]]
  const t = drainage.trench, p = drainage.pit
  const tx0 = X(t.x - t.w / 2), tx1 = X(t.x + t.w / 2)
  const px0 = X(5.4), px1 = X(5.4 + p.size)
  const water = (d: string, w = 3.5) => <path d={d} style={{ stroke: DRAIN_COLOUR.fall }} strokeWidth={w} strokeLinejoin="round" />
  const depth = layers.map((_, i) => layers.slice(0, i).reduce((n, l) => n + l[1], 0)) // each layer's top, below the surface
  return (
    <svg viewBox={`0 0 ${W} ${H}`} role="img" className="stroke-foreground h-auto w-full min-w-[960px]"
      strokeWidth={2} strokeLinecap="round" fill="none"
      aria-label={`Drainage section along the parking: rain soaks through the grass pavers into ${Math.round(build.subbase * 1000)} mm of crushed stone; the surface falls 1 in ${Math.round(1 / drainage.lot)} to the west end, where a gravel trench ${Math.round(t.w * 1000)} mm wide and ${Math.round(t.depth * 1000)} mm deep, round a ${Math.round(t.pipe * 1000)} mm perforated pipe, takes the overflow to a soakaway pit ${p.size} m square and ${p.depth} m deep.`}>
      {/* the layers, west to east, parallel to the falling surface */}
      {layers.map(([name, h, cls], i) => {
        const a = depth[i], b = depth[i] + h
        const pts = `${X(x0)},${S(x0) + a * VS} ${X(x1)},${S(x1) + a * VS} ${X(x1)},${S(x1) + b * VS} ${X(x0)},${S(x0) + b * VS}`
        return (
          <g key={name}>
            <polygon points={pts} className={cls} strokeWidth={1.2} />
            {/* labels spread apart, each on a leader to its layer, since the thin ones are a few pixels deep */}
            <path d={`M${X(x1) + 4} ${S(x1) + ((a + b) / 2) * VS} L${X(x1) + 30} ${S(x1) + [-14, 14, 46][i]}`} strokeWidth={1} className="stroke-muted-foreground" />
            <text x={X(x1) + 36} y={S(x1) + [-14, 14, 46][i] + 5} stroke="none" className="fill-muted-foreground text-[13px]">
              <tspan className="fill-foreground font-semibold">{name}</tspan> {Math.round(h * 1000)} mm
            </text>
          </g>
        )
      })}
      {/* the fieldstone edging at each end */}
      {[x0, x1 - 0.2].map((x) => (
        <rect key={x} x={X(x)} y={S(x === x0 ? x0 : x1) - 2} width={0.2 * HS} height={build.dig * VS + 2} className="fill-foreground/70" stroke="none" />
      ))}
      {/* the ground: the lawn either side, the subsoil below */}
      <path d={`M60 ${top} H${X(x0)} M${X(x1)} ${S(x1)} H${X(x1) + 22}`} strokeWidth={2} />
      <path d={`M${X(x0)} ${S(x0) + build.dig * VS} L${X(x1)} ${S(x1) + build.dig * VS}`} strokeDasharray="2 6" strokeWidth={1.2} />

      {/* rain through the cells, then the fall to the west */}
      {[10, 13, 16, 19, 22, 25, 28].map((x) => (
        <g key={x}>{water(`M${X(x)} ${S(x) - 70} V${S(x) + (build.paver.h + build.bedding + build.subbase / 2) * VS}`, 2)}
          <path d={`M${X(x) - 6} ${S(x) - 18} L${X(x)} ${S(x) - 8} L${X(x) + 6} ${S(x) - 18}`} style={{ stroke: DRAIN_COLOUR.fall }} strokeWidth={2} /></g>
      ))}
      {water(`M${X(27)} ${S(27) - 100} L${X(12)} ${S(12) - 100}`)}
      <path d={`M${X(12) + 14} ${S(12) - 110} L${X(12)} ${S(12) - 100} L${X(12) + 14} ${S(12) - 90}`} style={{ stroke: DRAIN_COLOUR.fall }} strokeWidth={3.5} />
      <text x={X(19.5)} y={S(19.5) - 116} textAnchor="middle" stroke="none" className="fill-foreground text-[15px] font-semibold">
        F1 · the lot falls 1 in {Math.round(1 / drainage.lot)}, {Math.round((x1 - x0) * drainage.lot * 1000)} mm over its {x1 - x0} m, to the west end
      </text>
      <text x={X(19.5)} y={S(19.5) + (build.dig + 0.18) * VS} textAnchor="middle" stroke="none" className="fill-muted-foreground text-[13px]">
        <tspan className="fill-foreground font-semibold">P</tspan> the pavers and the stone are the drain: rain soaks through and is held while it seeps away
      </text>

      {/* the trench across the west end, and its pipe on to the pit */}
      <rect x={tx0} y={top} width={tx1 - tx0} height={t.depth * VS} className="fill-muted" strokeDasharray="5 4" style={{ stroke: DRAIN_COLOUR.trench }} />
      <circle cx={(tx0 + tx1) / 2} cy={top + t.depth * VS - 18} r={(t.pipe * VS) / 2} className="fill-background" style={{ stroke: DRAIN_COLOUR.trench }} strokeWidth={3} />
      <path d={`M${(tx0 + tx1) / 2} ${top + t.depth * VS - 18} H${px1}`} style={{ stroke: DRAIN_COLOUR.trench }} strokeWidth={4} />
      <text x={tx1 + 10} y={top + t.depth * VS + 26} stroke="none" className="fill-muted-foreground text-[13px]">
        <tspan className="fill-foreground font-semibold">T1</tspan> trench {Math.round(t.w * 1000)} × {Math.round(t.depth * 1000)} mm, stone in geotextile, {Math.round(t.pipe * 1000)} mm perforated pipe
      </text>

      {/* the soakaway pit, beyond the trench's end */}
      <rect x={px0} y={top} width={px1 - px0} height={p.depth * VS} className="fill-muted" style={{ stroke: DRAIN_COLOUR.pit }} strokeWidth={3} />
      <rect x={px0 - 6} y={top - 10} width={px1 - px0 + 12} height={10} className="fill-foreground/70" stroke="none" />
      <text x={(px0 + px1) / 2} y={top + p.depth * VS + 26} textAnchor="middle" stroke="none" className="fill-muted-foreground text-[13px]">
        <tspan className="fill-foreground font-semibold">SK</tspan> soakaway {p.size} × {p.size} × {p.depth} m
      </text>

      <text x={60} y={H - 46} stroke="none" className="fill-muted-foreground text-[14px]">
        Off the section: F2 · the turn of setts falls 1 in {Math.round(1 / drainage.turn)} back to the public road, so the road&rsquo;s water never runs in
        through the gate · F3 · the rock road is crowned, 1 in {Math.round(1 / drainage.road)} to its edgings and the grass
      </text>
      <text x={60} y={H - 22} stroke="none" className="fill-muted-foreground text-[14px]">
        Heights drawn about four times the length scale · the soakaway is sized again after a percolation test on site · design intent, not surveyed
      </text>
    </svg>
  )
}
