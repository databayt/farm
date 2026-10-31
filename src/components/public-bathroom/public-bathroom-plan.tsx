import bath from "./public-bathroom.json"

// The public bathroom drawn in the pattern of the office plan (src/components/office/office-plan.tsx): thin lines,
// no colour, bold capitals and dimensions in millimetres. Seen from the courtyard, as the 3D's front view: the door
// and the windows face down the page (north), the west end to the left, mirrored as the homepage draws the compound.
// Units are metres, x from the west end, y toward the courtyard, the container's centre line at y = 0.

const { container: box, front, entry, partitions, toilets, passage, cupboard, lobby, basins, towels, urinal } = bath
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
const small = { ...label, fontSize: 0.1, fontWeight: 600 } as const

const f = (n: number) => +n.toFixed(3)
const mm = (m: number) => Math.round(m * 1000).toLocaleString("en-US")
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
// the same, standing: the figure reads up the page beside the line
function Rise({ y0, y1, x }: { y0: number; y1: number; x: number }) {
  const tick = 0.06, my = f((y0 + y1) / 2)
  return (
    <g>
      <line x1={x} x2={x} y1={y0} y2={y1} {...thin} />
      {[y0, y1].map((y) => <line key={y} x1={f(x - tick)} x2={f(x + tick)} y1={f(y + tick)} y2={f(y - tick)} {...thin} />)}
      <text x={f(x + 0.08)} y={my} transform={`rotate(-90 ${f(x + 0.08)} ${my})`} textAnchor="middle" style={small}>{mm(y1 - y0)}</text>
    </g>
  )
}

// a door standing open: the leaf, 40 mm thick, at right angles to its wall from the hinge, its swing faint (along:
// the way the shut leaf runs from the hinge; into: the way it opens)
function Door({ hinge: [hx, hy], along: [ax, ay], into: [ix, iy], w }: { hinge: number[]; along: number[]; into: number[]; w: number }) {
  const [lx, ly] = [f(hx + ix * w), f(hy + iy * w)]
  const leaf = 0.04
  return (
    <g>
      <rect {...rect(Math.min(hx, lx, hx + ax * leaf), Math.min(hy, ly, hy + ay * leaf), Math.max(hx, lx, hx + ax * leaf), Math.max(hy, ly, hy + ay * leaf))} {...thin} />
      <path d={`M${lx} ${ly}A${f(w)} ${f(w)} 0 0 ${ix * ay - iy * ax > 0 ? 1 : 0} ${f(hx + ax * w)} ${f(hy + ay * w)}`} {...faint} />
    </g>
  )
}

// the fittings stand in one row against the back wall (the top of the page): two toilet rooms, the urinal room, then
// the basins across from the door at the front's east end; a corridor under the windows joins them.

// a WC from above on the wall at x, facing into the room (+x): the cistern, the bowl and its seat's opening
function Wc({ x, y }: { x: number; y: number }) {
  const { out, w, cistern } = toilets.wc
  const r = w / 2, a = x + cistern.d, b = x + out - 0.2
  return (
    <g>
      <rect {...rect(x, y - cistern.w / 2, a, y + cistern.w / 2)} rx={0.03} {...thin} />
      <path d={`M${f(a)} ${f(y - r)}H${f(b)}A0.2 ${f(r)} 0 0 1 ${f(b)} ${f(y + r)}H${f(a)}`} {...thin} />
      <ellipse cx={f(b - 0.03)} cy={y} rx={0.15} ry={f(r - 0.07)} {...faint} />
    </g>
  )
}

export function PublicBathroomPlan({ title, className }: { title: string; className?: string }) {
  const L = box.l, H = box.w / 2, p = box.proud
  const { x0: ix0, x1: ix1, y0: iy0, y1: iy1 } = box.inner
  const { door, windows } = front
  const [r1, r2] = toilets.rooms
  const face = toilets.y1, hall = passage.y0 // the row's front partition: its face in the rooms, the corridor's
  const u = urinal
  // the front wall's openings, west to east: the two windows, then the door; a wall's line runs round the box at y
  // and stops at each of them (office-plan's path, with three openings)
  const gaps = [...windows, [door.x0, door.x1]]
  const ring = (y: number, w: number, e: number, b: number) =>
    `M${gaps[0][0]} ${y}H${w}V${b}H${e}V${y}H${gaps[gaps.length - 1][1]}` + gaps.slice(1).map(([a], k) => `M${a} ${y}H${gaps[k][1]}`).join("")
  const { landing, step } = entry
  const ly1 = H + landing.d, sy1 = ly1 + step.d
  const doors = [r1.door, r2.door, u.door]
  // the row's three rooms, each between two partitions: their walls drawn round from the back wall to the front face
  const rooms = [[r1.x0, r1.x1], [r2.x0, r2.x1], [u.x0, u.x1]]
  return (
    <svg viewBox="-0.6 -1.95 7.45 5.2" role="img" aria-label={title} className={className}>
      {/* The plinth, a stone course 100 mm proud of the box all round; the stone landing at its height in front of
          the door and the step down to the grass */}
      <rect {...rect(-p, -H - p, L + p, H + p)} {...faint} />
      <rect {...rect(landing.x0, H + p, landing.x1, ly1)} {...thin} />
      <rect {...rect(step.x0, ly1, step.x1, sy1)} {...thin} />

      {/* The steel box with its lining: the two windows and the door in the courtyard wall, the door at the east end
          open into the lobby against the end wall */}
      <path d={ring(H, 0, L, -H)} {...medium} />
      <path d={ring(iy1, ix0, ix1, iy0)} {...thin} />
      {gaps.flat().map((x) => <line key={x} x1={x} x2={x} y1={iy1} y2={H} {...thin} />)}
      {windows.map(([a, b]) => (
        <g key={a}>
          <line x1={a} x2={b} y1={f((H + iy1) / 2)} y2={f((H + iy1) / 2)} {...medium} strokeWidth={1.1} />
          <line x1={f((a + b) / 2)} x2={f((a + b) / 2)} y1={iy1} y2={H} {...thin} />
        </g>
      ))}
      <Door hinge={[door.x1, iy1]} along={[-1, 0]} into={[0, -1]} w={door.x1 - door.x0} />

      {/* Partitions, both faces: along the front of the row with its three doors, and between the rooms from the back
          wall, the last one closing the urinal room off from the basins */}
      <path d={`M${ix0} ${hall}` + doors.map(([a, b]) => `H${a}M${b} ${hall}`).join("") + `H${u.x1 + partitions.t}V${iy0}`} {...thin} />
      {rooms.map(([a, b], k) => (
        <path key={a} d={`M${a} ${iy0}V${face}H${doors[k][0]}M${doors[k][1]} ${face}H${b}V${iy0}`} {...thin} />
      ))}
      {doors.flat().map((x) => <line key={x} x1={x} x2={x} y1={face} y2={hall} {...thin} />)}

      {/* The two toilet rooms: a WC on each west wall, the door open back against the east wall */}
      {[r1, r2].map((r) => (
        <g key={r.x0}>
          <Wc x={r.x0} y={toilets.wc.y} />
          <Door hinge={[r.door[1], face]} along={[-1, 0]} into={[0, -1]} w={r.door[1] - r.door[0]} />
          <text x={f((r.door[0] + r.x1) / 2 + 0.12)} y={f(iy0 + 0.22)} textAnchor="middle" style={small}>WC</text>
        </g>
      ))}

      {/* The urinal room: the urinal on the back wall, the extract fan over it, the door open back against the east
          wall */}
      <path d={`M${f(u.x - u.w / 2)} ${iy0}V${f(iy0 + u.out - 0.13)}A${f(u.w / 2)} 0.13 0 0 0 ${f(u.x + u.w / 2)} ${f(iy0 + u.out - 0.13)}V${iy0}`} {...thin} />
      <circle cx={u.x} cy={f(iy0 + 0.06)} r={0.1} {...dashed} />
      <Door hinge={[u.door[1], face]} along={[-1, 0]} into={[0, -1]} w={u.door[1] - u.door[0]} />

      {/* The cleaner's cupboard at the corridor's west end, its two doors opening along the corridor */}
      <rect {...rect(cupboard.x0, hall, cupboard.x1, iy1)} {...thin} />
      <Door hinge={[cupboard.x1, hall]} along={[0, 1]} into={[1, 0]} w={(iy1 - hall) / 2} />
      <Door hinge={[cupboard.x1, iy1]} along={[0, -1]} into={[1, 0]} w={(iy1 - hall) / 2} />

      {/* The lobby, across from the door: the counter with two basins and their taps on the back wall, the towels and
          the bin on the end wall, the floor drain */}
      <rect {...rect(basins.x0, iy0, basins.x1, iy0 + basins.d)} {...thin} />
      {basins.x.map((x) => (
        <g key={x}>
          <ellipse cx={x} cy={f(iy0 + basins.d / 2 + 0.03)} rx={0.2} ry={0.155} {...thin} />
          <circle cx={x} cy={f(iy0 + 0.07)} r={0.025} {...thin} />
        </g>
      ))}
      <rect {...rect(towels.x - 0.11, towels.y - towels.w / 2, towels.x, towels.y + towels.w / 2)} {...dashed} />
      <circle cx={f(towels.x - towels.bin - 0.02)} cy={towels.y} r={towels.bin} {...thin} />
      <rect {...rect(lobby.drain[0] - 0.07, lobby.drain[1] - 0.07, lobby.drain[0] + 0.07, lobby.drain[1] + 0.07)} {...thin} />
      <path d={`M${f(lobby.drain[0] - 0.07)} ${f(lobby.drain[1] - 0.07)}l0.14 0.14m0 -0.14l-0.14 0.14`} {...faint} />

      <text x={f((cupboard.x1 + lobby.x0) / 2)} y={f((hall + iy1) / 2 + 0.035)} textAnchor="middle" style={small}>CORRIDOR</text>
      <text x={f((cupboard.x0 + cupboard.x1) / 2 + 0.035)} y={f((hall + iy1) / 2)} transform={`rotate(-90 ${f((cupboard.x0 + cupboard.x1) / 2 + 0.035)} ${f((hall + iy1) / 2)})`} textAnchor="middle" style={small}>CLEANING</text>
      <text x={f((basins.x0 + basins.x1) / 2)} y={f(iy0 + basins.d + 0.14)} textAnchor="middle" style={small}>BASINS</text>
      <text x={f(towels.x - 0.06)} y={f(towels.y + towels.bin + 0.15)} textAnchor="end" style={small}>TOWELS</text>
      <text x={f((lobby.x0 + door.x0) / 2 + 0.05)} y={f(iy1 - 0.3)} textAnchor="middle" style={small}>LOBBY</text>
      <text x={u.x} y={f(face - 0.12)} textAnchor="middle" style={small}>URINAL</text>
      {windows.map(([a, b]) => <text key={a} x={f((a + b) / 2)} y={f(H + p + 0.16)} textAnchor="middle" style={small}>WINDOW</text>)}
      <text x={f((landing.x0 + landing.x1) / 2)} y={f(H + p + (landing.d - p) / 2 + 0.035)} textAnchor="middle" style={small}>LANDING</text>
      <text x={f((step.x0 + step.x1) / 2)} y={f(ly1 + step.d / 2 + 0.035)} textAnchor="middle" style={small}>STEP</text>
      <text x={0} y={f(H + 0.6)} textAnchor="start" style={label}>PUBLIC BATHROOM</text>
      <text x={f(L / 2)} y={f(sy1 + 0.62)} textAnchor="middle" style={small}>TOWARD THE COURTYARD</text>
      <Dimension x0={0} x1={L} y={f(-H - 0.5)} />
      {[...rooms, [lobby.x0, lobby.x1]].map(([a, b]) => <Dimension key={a} x0={a} x1={b} y={f(-H - 0.22)} />)}
      <Dimension x0={landing.x0} x1={landing.x1} y={f(sy1 + 0.3)} />
      <Rise y0={-H} y1={H} x={f(L + 0.4)} />
      <Rise y0={iy0} y1={face} x={-0.35} />
      <Rise y0={hall} y1={iy1} x={-0.35} />
    </svg>
  )
}
