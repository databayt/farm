import { getWords } from "@/components/internationalization/words"
import { Dim, HDim, Name, Note } from "@/components/drawing/dims"
import { frame, tier } from "@/components/drawing/geometry"

import camp from "./camp.json"
import { words } from "./words"

// One camp drawn in the pattern of the compound plan (src/components/home/compound-plan.tsx): thin lines, no colour,
// and its dimensions as the studio's plan sets them (src/components/drawing): across the corners and across the
// flats, the door's opening and the futon's length. The door faces down the page, toward the viewer of
// the 3D's front view, and the room is furnished as the hero shows it. Units are metres, the tent's centre at
// 0,0, y toward the door.

const { tent, rug, floorChair: chair, throw: wrap, futon, pillow, cushions, tray, lantern } = camp
const thin = { fill: "none", stroke: "currentColor", strokeWidth: 0.75, vectorEffect: "non-scaling-stroke" } as const
const medium = { ...thin, strokeWidth: 1.8 } as const
const faint = { ...thin, strokeWidth: 0.5, strokeOpacity: 0.5 } as const
const dashed = { ...thin, strokeDasharray: "4 3" } as const

const f = (n: number) => +n.toFixed(3)
// a six-sided outline, flat at the back and the front (the door's side), round the centre
const hex = (r: number) => Array.from({ length: 6 }, (_, k) => [f(r * Math.cos((k * Math.PI) / 3)), f(r * Math.sin((k * Math.PI) / 3))])
const path = (p: number[][]) => `M${p.map((q) => q.join(" ")).join("L")}Z`
const box = (cx: number, cy: number, w: number, d: number) => ({ x: f(cx - w / 2), y: f(cy - d / 2), width: f(w), height: f(d) })

const front = tent.r * Math.sin(Math.PI / 3) // the flats, back and front
// the drawing, then how far its dimensions reach past it (studio mm): the second tier above, left and below, clear of
// the poles' feet at the corners, and the name right
const { k, viewBox } = frame({ x0: -tent.r, y0: -front, x1: tent.r, y1: front }, { top: 14, right: 22, bottom: 14, left: 14 })

// `title` (the drawing's accessible name) defaults to the page's; the docs pass the guide's own.
export async function CampPlan({ title, className }: { title?: string; className?: string }) {
  const w = await getWords(words)
  const name = w.plan.labels
  title ??= w.plan.title
  const p = hex(tent.r)
  const stripes = Array.from({ length: 13 }, (_, k) => f(rug.x - rug.w / 2 + ((k + 1) * rug.w) / 14))
  const fy = (futon.y0 + futon.y1) / 2
  return (
    <svg viewBox={viewBox} role="img" aria-label={title} className={className}>
      {/* The tent: five walls drawn solid, the door side open (rolled up), the shoulder and the small top
          dashed overhead, the poles' feet at each corner */}
      <path d={`M${p[1].join(" ")}L${p[0].join(" ")}L${p[5].join(" ")}L${p[4].join(" ")}L${p[3].join(" ")}L${p[2].join(" ")}`} {...medium} />
      <line x1={p[2][0]} y1={f(front)} x2={p[1][0]} y2={f(front)} {...dashed} />
      <path d={path(hex(tent.shoulder.r))} {...faint} strokeDasharray="4 3" />
      <path d={path(hex(tent.top.r))} {...faint} strokeDasharray="4 3" />
      {p.map(([x, y]) => <circle key={`${x}${y}`} cx={f(x * 1.04)} cy={f(y * 1.04)} r={0.03} {...thin} />)}

      {/* The rug, its stripes across */}
      <rect {...box(rug.x, rug.y, rug.w, rug.d)} {...thin} />
      {stripes.map((x) => <line key={x} x1={x} x2={x} y1={f(rug.y - rug.d / 2)} y2={f(rug.y + rug.d / 2)} {...faint} />)}

      {/* Left: the floor chair facing the door, the folded throw by the door */}
      <rect {...box(chair.x, chair.y, chair.w, chair.d)} rx={0.04} {...thin} fill="var(--background)" />
      <rect {...box(chair.x, chair.y - chair.d / 2 + 0.06, chair.w, 0.12)} rx={0.03} {...thin} />
      <rect {...box(wrap.x, wrap.y, wrap.w, wrap.d)} {...thin} fill="var(--background)" />
      {Array.from({ length: 9 }, (_, k) => f(wrap.x - wrap.w / 2 + 0.03 + (k * (wrap.w - 0.06)) / 8)).map((x) => (
        <line key={x} x1={x} x2={x} y1={f(wrap.y + wrap.d / 2)} y2={f(wrap.y + wrap.d / 2 + 0.05)} {...thin} />
      ))}

      {/* Right: the futon with its tufts and the cushion standing at its back, the stacked cushions in front */}
      <rect {...box(futon.x, fy, futon.w, futon.y1 - futon.y0)} rx={0.05} {...thin} fill="var(--background)" />
      {[0.25, 0.5, 0.75].flatMap((u) => [0.3, 0.7].map((v) => [f(futon.y0 + u * (futon.y1 - futon.y0)), f(futon.x - futon.w / 2 + v * futon.w)])).map(([y, x]) => (
        <circle key={`${x}${y}`} cx={x} cy={y} r={0.012} {...thin} />
      ))}
      <rect {...box(futon.x, futon.y0 + 0.1, pillow.w, pillow.t)} rx={0.04} {...thin} />
      <rect {...box(cushions.x, cushions.y, cushions.w, cushions.d)} rx={0.05} {...thin} fill="var(--background)" />
      <rect {...box(cushions.x, cushions.y, cushions.w - 0.08, cushions.d - 0.08)} rx={0.04} {...faint} />

      {/* On the rug the tea board, a teapot and two cups; the lantern at the back */}
      <rect {...box(tray.x, tray.y, tray.w, tray.d)} rx={0.02} {...thin} fill="var(--background)" />
      <circle cx={f(tray.x + 0.1)} cy={tray.y} r={0.07} {...thin} />
      {[-0.13, -0.03].map((dx) => <circle key={dx} cx={f(tray.x + dx)} cy={f(tray.y + 0.03)} r={0.035} {...thin} />)}
      <circle cx={lantern.x} cy={lantern.y} r={0.07} {...thin} />
      <circle cx={lantern.x} cy={lantern.y} r={0.035} {...thin} />

      <Note k={k} x={chair.x} y={chair.y + 0.07}>{name.floorChair}</Note>
      <Note k={k} x={futon.x} y={fy}>{name.futon}</Note>
      <Note k={k} x={rug.x - 0.2} y={rug.y + 0.04}>{name.rug}</Note>
      <Name k={k} x={tent.r + 0.12} y={0} anchor="start">{name.tent}</Name>

      {/* Across the corners over the back, across the flats beside it, the door's opening under the front */}
      <Dim k={k} a={[-tent.r, 0]} b={[tent.r, 0]} off={-(front / k + tier(2))} />
      <Dim k={k} a={[-tent.r / 2, -front]} b={[-tent.r / 2, front]} off={tent.r / 2 / k + tier(2)} />
      <HDim k={k} x0={p[2][0]} x1={p[1][0]} y={front} side="bottom" at={2} prefix={name.doorDim} />
      {/* Inside: the futon's length along its outer side */}
      <Dim k={k} a={[futon.x + futon.w / 2 - 0.07, futon.y0]} b={[futon.x + futon.w / 2 - 0.07, futon.y1]} off={0} size={2.2} />
    </svg>
  )
}
