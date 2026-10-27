import room from "./guest-room.json"

// One guest room drawn in the pattern of the camp plan (src/components/camp/camp-plan.tsx): thin lines, no
// colour, bold capitals and dimensions in millimetres. The door faces down the page, toward the viewer of the
// 3D's front view. Units are metres, the room's centre at 0,0, y toward the door and the veranda.

const { block, room: inner, joint, door, window: win, veranda, bed, bedsides, bench, wardrobe, desk, hooks, rug } = room
const thin = { fill: "none", stroke: "currentColor", strokeWidth: 0.75, vectorEffect: "non-scaling-stroke" } as const
const medium = { ...thin, strokeWidth: 1.6 } as const
const faint = { ...thin, strokeWidth: 0.5, strokeOpacity: 0.45 } as const
const dashed = { ...thin, strokeDasharray: "4 3" } as const
const label = {
  fontFamily: "var(--font-sans), ui-sans-serif, system-ui, sans-serif",
  fontSize: 0.15,
  fontWeight: 700,
  letterSpacing: "0.04em",
  fill: "currentColor",
} as const
const small = { ...label, fontSize: 0.11, fontWeight: 600 } as const

const f = (n: number) => +n.toFixed(3)
const mm = (m: number) => Math.round(m * 1000).toLocaleString("en-US")
const rect = (x0: number, y0: number, x1: number, y1: number) => ({ x: f(x0), y: f(y0), width: f(x1 - x0), height: f(y1 - y0) })

// the room's lines: outside the steel (O) and inside the linings (I)
const OX = block.w / 2, OY = block.d / 2, IX = inner.w / 2, IY = inner.d / 2
const V = OY + veranda.d // the veranda's edge

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
function DimensionV({ y0, y1, x }: { y0: number; y1: number; x: number }) {
  const tick = 0.06
  const cy = f((y0 + y1) / 2)
  return (
    <g>
      <line x1={x} x2={x} y1={y0} y2={y1} {...thin} />
      {[y0, y1].map((y) => <line key={y} x1={f(x - tick)} x2={f(x + tick)} y1={f(y + tick)} y2={f(y - tick)} {...thin} />)}
      <text x={f(x - 0.07)} y={cy} transform={`rotate(-90 ${f(x - 0.07)} ${cy})`} textAnchor="middle" style={small}>{mm(y1 - y0)}</text>
    </g>
  )
}

// a window across a wall's thickness: the frame lines and the glass between, at plan height
function Window({ x0, x1, y0, y1 }: { x0: number; x1: number; y0: number; y1: number }) {
  const m = (y0 + y1) / 2
  return (
    <g>
      <rect {...rect(x0, Math.min(y0, y1), x1, Math.max(y0, y1))} fill="var(--background)" stroke="none" />
      {[x0, x1].map((x) => <line key={x} x1={x} x2={x} y1={y0} y2={y1} {...thin} />)}
      <line x1={x0} x2={x1} y1={y0} y2={y0} {...thin} />
      <line x1={x0} x2={x1} y1={y1} y2={y1} {...thin} />
      <line x1={x0} x2={x1} y1={f(m)} y2={f(m)} {...thin} />
    </g>
  )
}

export function GuestRoomPlan({ title, className }: { title: string; className?: string }) {
  const by0 = -IY, by1 = -IY + bed.l
  const sideX = bed.w / 2 + bedsides.gap
  const benchY = by1 + bench.gap
  const dy0 = IY - desk.d
  const dcx = (desk.x0 + desk.x1) / 2
  const { chair } = desk
  const hinge = door.x1, swing = door.x1 - door.x0
  // the veranda's boards run out from the wall, 140 mm a board
  const boards = Array.from({ length: Math.floor((2 * OX) / 0.14) }, (_, k) => f(-OX + 0.14 * (k + 1)))
  return (
    <svg viewBox="-2.75 -3.25 5.7 8.25" role="img" aria-label={title} className={className}>
      {/* The neighbouring rooms go on past the partitions, left and right: the block's long walls, faint */}
      {[-1, 1].map((s) => (
        <g key={s}>
          <line x1={s * OX} x2={s * (OX + 0.45)} y1={-OY} y2={-OY} {...faint} />
          <line x1={s * OX} x2={s * (OX + 0.45)} y1={OY} y2={OY} {...faint} />
          <line x1={s * OX} x2={s * (OX + 0.45)} y1={V} y2={V} {...faint} />
        </g>
      ))}

      {/* The veranda: boards out from the wall, a step down at the door, the slatted shade dashed overhead
          with its posts at the edge */}
      <rect {...rect(-OX, OY, OX, V)} {...thin} />
      {boards.map((x) => <line key={x} x1={x} x2={x} y1={OY} y2={V} {...faint} />)}
      <rect {...rect(veranda.step.x0, V, veranda.step.x1, V + veranda.step.d)} {...thin} />
      <rect {...rect(-OX + 0.04, OY + 0.04, OX - 0.04, V - 0.04)} {...dashed} />
      {[-1, 1].map((s) => <rect key={s} {...rect(s * OX - (s > 0 ? 0.12 : 0), V - 0.12, s * OX + (s < 0 ? 0.12 : 0), V)} {...thin} />)}

      {/* The walls: steel outside, linings inside; the door and the two windows cut through */}
      <path d={`M${-OX} ${-OY}H${OX}V${OY}H${door.x1}M${door.x0} ${OY}H${-OX}Z`} {...medium} />
      <path d={`M${-IX} ${-IY}H${IX}V${IY}H${door.x1}M${door.x0} ${IY}H${-IX}Z`} {...thin} />
      {[door.x0, door.x1].map((x) => <line key={x} x1={x} x2={x} y1={IY} y2={OY} {...thin} />)}
      <Window x0={win.front.x0} x1={win.front.x1} y0={IY} y1={OY} />
      <Window x0={win.back.x0} x1={win.back.x1} y0={-OY} y1={-IY} />
      {/* the door, open in against the right, and its swing */}
      <line x1={hinge} x2={hinge} y1={IY} y2={f(IY - swing)} {...medium} />
      <path d={`M${door.x0} ${IY}A${swing} ${swing} 0 0 1 ${hinge} ${f(IY - swing)}`} {...faint} />

      {/* The joint: where the two containers were joined, a beam overhead and a red steel post each side */}
      <line x1={-IX} x2={IX} y1={joint.y} y2={joint.y} {...dashed} />
      {[-1, 1].map((s) => {
        const p = joint.post
        return <rect key={s} {...rect(s < 0 ? -IX : IX - p, joint.y - p / 2, s < 0 ? -IX + p : IX, joint.y + p / 2)} {...medium} />
      })}

      {/* The rug, then the bed on it: headboard, pillows, the duvet's turn-down, the throw at the foot */}
      <rect {...rect(-rug.w / 2, rug.y - rug.d / 2, rug.w / 2, rug.y + rug.d / 2)} {...faint} />
      <rect {...rect(-rug.w / 2 + 0.06, rug.y - rug.d / 2 + 0.06, rug.w / 2 - 0.06, rug.y + rug.d / 2 - 0.06)} {...faint} />
      <rect {...rect(-bed.w / 2, by0, bed.w / 2, by1)} {...thin} fill="var(--background)" />
      <line x1={-bed.w / 2} x2={bed.w / 2} y1={f(by0 + 0.08)} y2={f(by0 + 0.08)} {...thin} />
      {[-1, 1].map((s) => (
        <rect key={s} {...rect(s < 0 ? -bed.w / 2 + 0.1 : 0.05, by0 + 0.16, s < 0 ? -0.05 : bed.w / 2 - 0.1, by0 + 0.56)} rx={0.06} {...thin} />
      ))}
      <line x1={-bed.w / 2} x2={bed.w / 2} y1={f(by0 + 0.72)} y2={f(by0 + 0.72)} {...thin} />
      <rect {...rect(-bed.w / 2, by1 - 0.5, bed.w / 2, by1 - 0.15)} {...faint} />

      {/* Bedside tables with their lamps, and the luggage bench at the foot */}
      {[-1, 1].map((s) => {
        const x0 = s < 0 ? -sideX - bedsides.w : sideX, x1 = x0 + bedsides.w
        return (
          <g key={s}>
            <rect {...rect(x0, by0, x1, by0 + bedsides.d)} {...thin} />
            <circle cx={f((x0 + x1) / 2)} cy={f(by0 + bedsides.d / 2)} r={0.11} {...thin} />
          </g>
        )
      })}
      <rect {...rect(-bench.w / 2, benchY, bench.w / 2, benchY + bench.d)} {...thin} />

      {/* The wardrobe on the left wall, its two doors; the desk under the front window and its chair */}
      <rect {...rect(wardrobe.x0, wardrobe.y0, wardrobe.x0 + wardrobe.d, wardrobe.y0 + wardrobe.w)} {...thin} />
      <line x1={f(wardrobe.x0 + wardrobe.d - 0.03)} x2={f(wardrobe.x0 + wardrobe.d - 0.03)} y1={wardrobe.y0} y2={f(wardrobe.y0 + wardrobe.w)} {...faint} />
      <line x1={f(wardrobe.x0 + wardrobe.d - 0.03)} x2={wardrobe.x0} y1={f(wardrobe.y0 + wardrobe.w / 2)} y2={f(wardrobe.y0 + wardrobe.w / 2)} {...faint} />
      <line x1={f(wardrobe.x0 + 0.06)} x2={f(wardrobe.x0 + 0.06)} y1={f(wardrobe.y0 + 0.06)} y2={f(wardrobe.y0 + wardrobe.w - 0.06)} {...dashed} />
      <rect {...rect(desk.x0, dy0, desk.x1, IY)} {...thin} />
      <rect {...rect(dcx - chair.w / 2, chair.y - chair.d / 2, dcx + chair.w / 2, chair.y + chair.d / 2)} {...thin} />
      <line x1={f(dcx - chair.w / 2)} x2={f(dcx + chair.w / 2)} y1={f(chair.y - chair.d / 2 + 0.06)} y2={f(chair.y - chair.d / 2 + 0.06)} {...thin} />

      {/* Coat hooks on the right wall */}
      <line x1={f(IX - 0.04)} x2={f(IX - 0.04)} y1={hooks.y0} y2={hooks.y1} {...medium} />

      {/* On the veranda under the window: two chairs facing out, a small round table */}
      {veranda.chairs.map(([cx, cy]) => {
        const { w, d } = veranda.chair
        return (
          <g key={cx}>
            <rect {...rect(cx - w / 2, cy - d / 2, cx + w / 2, cy + d / 2)} {...thin} fill="var(--background)" />
            <line x1={f(cx - w / 2)} x2={f(cx + w / 2)} y1={f(cy - d / 2 + 0.07)} y2={f(cy - d / 2 + 0.07)} {...thin} />
          </g>
        )
      })}
      <circle cx={veranda.table.x} cy={veranda.table.y} r={veranda.table.r} {...thin} fill="var(--background)" />

      <text x={0} y={f(by1 - 0.27)} textAnchor="middle" style={small}>BED</text>
      <text x={f(wardrobe.x0 + wardrobe.d / 2 + 0.04)} y={f(wardrobe.y0 + wardrobe.w / 2)} textAnchor="middle"
        transform={`rotate(90 ${f(wardrobe.x0 + wardrobe.d / 2 + 0.04)} ${f(wardrobe.y0 + wardrobe.w / 2)})`} style={small}>WARDROBE</text>
      <text x={f(dcx)} y={f(dy0 + 0.3)} textAnchor="middle" style={small}>DESK</text>
      <text x={f(-IX + joint.post + 0.08)} y={f(joint.y - 0.07)} style={small}>JOINT</text>
      <text x={f(IX - 0.42)} y={f(IY - 0.15)} textAnchor="middle" style={small}>DOOR</text>
      <text x={f(OX - 0.12)} y={f(OY + 0.86)} textAnchor="end" style={label}>VERANDA</text>
      <text x={0} y={f(-OY - 0.18)} textAnchor="middle" style={label}>GUEST ROOM</text>
      <Dimension x0={-OX} x1={OX} y={-OY - 0.5} />
      <DimensionV y0={-OY} y1={OY} x={-OX - 0.3} />
      <DimensionV y0={OY} y1={V} x={-OX - 0.3} />
    </svg>
  )
}
