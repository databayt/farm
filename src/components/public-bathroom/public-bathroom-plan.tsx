import { getWords } from "@/components/internationalization/words"
import { Chain, Dim, HDim, Note, VDim } from "@/components/drawing/dims"
import { frame } from "@/components/drawing/geometry"

import bath from "./public-bathroom.json"
import { words } from "./words"

// The public bathroom drawn in the pattern of the office plan (src/components/office/office-plan.tsx): thin lines,
// no colour, and its dimensions as the studio's plan sets them (src/components/drawing): the row along the back wall
// named room by room with its partitions, then the length; the windows and the door along the front past the step,
// then the landing; the rooms' depth, the partition and the corridor at the west end, then the width; a WC door. Seen from the courtyard, as the 3D's front view: the door
// and the windows face down the page (north), the west end to the left, mirrored as the homepage draws the compound.
// Units are metres, x from the west end, y toward the courtyard, the container's centre line at y = 0.

const { container: box, front, entry, partitions, toilets, passage, cupboard, lobby, basins, towels, urinal } = bath
const thin = { fill: "none", stroke: "currentColor", strokeWidth: 0.75, vectorEffect: "non-scaling-stroke" } as const
const medium = { ...thin, strokeWidth: 1.6 } as const
const faint = { ...thin, strokeWidth: 0.5, strokeOpacity: 0.45 } as const
const dashed = { ...thin, strokeDasharray: "4 3" } as const

const f = (n: number) => +n.toFixed(3)
const rect = (x0: number, y0: number, x1: number, y1: number) => ({ x: f(x0), y: f(y0), width: f(x1 - x0), height: f(y1 - y0) })

const H0 = box.w / 2, sy0 = H0 + entry.landing.d + entry.step.d // the step's outer edge
// the drawing, then its dimensions' reach (studio mm): the names and the length over the back wall, the names and the
// landing past the step, two tiers at the west end
const { k, viewBox } = frame({ x0: -box.proud, y0: -H0 - box.proud, x1: box.l + box.proud, y1: sy0 }, { top: 19, right: 2, bottom: 19, left: 13 })
const pastStep = (sy0 - H0) / k // from the front wall to the step's edge, in studio mm

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

// a WC from above on the back wall at y, centred on x, facing into the room (+y): the cistern, the bowl and its
// seat's opening
function Wc({ x, y }: { x: number; y: number }) {
  const { out, w, cistern } = toilets.wc
  const r = w / 2, a = y + cistern.d, b = y + out - 0.2
  return (
    <g>
      <rect {...rect(x - cistern.w / 2, y, x + cistern.w / 2, a)} rx={0.03} {...thin} />
      <path d={`M${f(x + r)} ${f(a)}V${f(b)}A${f(r)} 0.2 0 0 1 ${f(x - r)} ${f(b)}V${f(a)}`} {...thin} />
      <ellipse cx={x} cy={f(b - 0.03)} rx={f(r - 0.07)} ry={0.15} {...faint} />
    </g>
  )
}

// `title` (the drawing's accessible name) defaults to the page's; the docs pass the guide's own.
export async function PublicBathroomPlan({ title, className }: { title?: string; className?: string }) {
  const w = await getWords(words)
  const name = w.plan.labels
  title ??= w.plan.title
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
    <svg viewBox={viewBox} role="img" aria-label={title} className={className}>
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

      {/* The two toilet rooms: a WC on each back wall, facing the door, the door open back against the east wall */}
      {[r1, r2].map((r) => (
        <g key={r.x0}>
          <Wc x={f(r.x0 + toilets.wc.x)} y={iy0} />
          <Door hinge={[r.door[1], face]} along={[-1, 0]} into={[0, -1]} w={r.door[1] - r.door[0]} />
          <Note k={k} x={r.x0 + toilets.wc.x} y={face - 0.14}>{name.wc}</Note>
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

      <Note k={k} x={(cupboard.x1 + lobby.x0) / 2} y={(hall + iy1) / 2}>{name.corridor}</Note>
      <Note k={k} x={(cupboard.x0 + cupboard.x1) / 2} y={(hall + iy1) / 2} rotate={-90}>{name.cleaning}</Note>
      <Note k={k} x={(basins.x0 + basins.x1) / 2} y={iy0 + basins.d + 0.13}>{name.basins}</Note>
      <Note k={k} x={towels.x - 0.06} y={towels.y + towels.bin + 0.14} anchor="end">{name.towels}</Note>
      <Note k={k} x={(lobby.x0 + door.x0) / 2 + 0.05} y={iy1 - 0.3}>{name.lobby}</Note>
      <Note k={k} x={u.x} y={face - 0.14}>{name.urinal}</Note>
      <Note k={k} x={(landing.x0 + landing.x1) / 2} y={H + p + (landing.d - p) / 2}>{name.landing}</Note>
      <Note k={k} x={(step.x0 + step.x1) / 2} y={ly1 + step.d / 2}>{name.step}</Note>

      {/* The back wall: the row, room by room with its partitions, named; then the length */}
      <Chain k={k} along="x" at={[ix0, r1.x1, r2.x0, r2.x1, u.x0, u.x1, lobby.x0, ix1]} edge={-H} side="top"
        names={[name.wc, null, name.wc, null, name.urinal, null, name.basins]} />
      <HDim k={k} x0={0} x1={L} y={-H} side="top" at={3} />
      {/* The front, past the step: the windows and the door, named, then the landing */}
      <Chain k={k} along="x" at={[0, ...windows.flat(), door.x0, door.x1, L]} edge={H} side="bottom" base={pastStep}
        names={[null, name.window, null, name.window, null, name.door, null]} />
      <HDim k={k} x0={landing.x0} x1={landing.x1} y={H} side="bottom" base={pastStep} at={3} prefix={name.landing.toLowerCase()} />
      {/* The west end: the rooms' depth, the partition, the corridor; then the width */}
      <Chain k={k} along="y" at={[iy0, face, hall, iy1]} edge={0} side="left" />
      <VDim k={k} y0={-H} y1={H} x={0} side="left" at={2} />
      {/* Inside: a toilet room's door, clear */}
      <Dim k={k} a={[r1.door[0], hall + 0.16]} b={[r1.door[1], hall + 0.16]} off={0} size={2.2} />
    </svg>
  )
}
