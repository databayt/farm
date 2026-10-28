import volleyball from "./volleyball.json"

// The court drawn in the pattern of the livestock plan (src/components/livestock/livestock-plan.tsx): thin lines, no
// colour, bold capitals and dimensions in millimetres. As on the master plan, the court's length runs across the
// page; the benches stand on the far side, up the page, and the open lawn and the viewer of the 3D are down it.
// Units are metres, the court's centre at 0,0, y toward the viewer.

const { court, net, posts, benches, shade, store, ball } = volleyball
const thin = { fill: "none", stroke: "currentColor", strokeWidth: 0.75, vectorEffect: "non-scaling-stroke" } as const
const medium = { ...thin, strokeWidth: 1.6 } as const
const faint = { ...thin, strokeWidth: 0.5, strokeOpacity: 0.45 } as const
const dashed = { ...thin, strokeDasharray: "4 3" } as const
const label = {
  fontFamily: "var(--font-sans), ui-sans-serif, system-ui, sans-serif",
  fontSize: 0.6,
  fontWeight: 700,
  letterSpacing: "0.04em",
  fill: "currentColor",
} as const
const small = { ...label, fontSize: 0.42, fontWeight: 600 } as const

const f = (n: number) => +n.toFixed(3)
const mm = (m: number) => Math.round(m * 1000).toLocaleString("en-US")
const rect = (x0: number, y0: number, x1: number, y1: number) => ({ x: f(x0), y: f(y0), width: f(x1 - x0), height: f(y1 - y0) })

function Dimension({ x0, x1, y }: { x0: number; x1: number; y: number }) {
  const tick = 0.17
  return (
    <g>
      <line x1={x0} x2={x1} y1={y} y2={y} {...thin} />
      {[x0, x1].map((x) => <line key={x} x1={f(x - tick)} x2={f(x + tick)} y1={f(y + tick)} y2={f(y - tick)} {...thin} />)}
      <text x={f((x0 + x1) / 2)} y={f(y - 0.2)} textAnchor="middle" style={small}>{mm(x1 - x0)}</text>
    </g>
  )
}
// the same, standing: the text turned to read up the page
function DimensionUp({ y0, y1, x }: { y0: number; y1: number; x: number }) {
  const tick = 0.17
  const cy = f((y0 + y1) / 2)
  return (
    <g>
      <line x1={x} x2={x} y1={y0} y2={y1} {...thin} />
      {[y0, y1].map((y) => <line key={y} x1={f(x - tick)} x2={f(x + tick)} y1={f(y + tick)} y2={f(y - tick)} {...thin} />)}
      <text x={f(x - 0.2)} y={cy} textAnchor="middle" transform={`rotate(-90 ${f(x - 0.2)} ${cy})`} style={small}>{mm(y1 - y0)}</text>
    </g>
  )
}

export function VolleyballPlan({ title, className }: { title: string; className?: string }) {
  const L = court.l / 2, W = court.w / 2, t = court.line
  const FX = L + court.free, FY = W + court.free // the free zone's edge
  const py = W + posts.out // the posts, 1 m outside the side lines
  const by = -(FY + benches.gap) // the bench row's front edge, toward the court
  const { gap: sg, l: sl } = court.service
  const pad = posts.d / 2 + posts.pad.t
  return (
    <svg viewBox="-14.6 -11 27.2 22" role="img" aria-label={title} className={className}>
      {/* The playing area: the court and its 3 m free zone, mown short */}
      <rect {...rect(-FX, -FY, FX, FY)} {...thin} />

      {/* The lines, 50 mm wide and inside the 18 x 9 m: side and end lines, the centre line under the net, an attack
          line each side with its rear edge 3 m out, and the service zones' short lines behind the end lines */}
      <rect {...rect(-L + t / 2, -W + t / 2, L - t / 2, W - t / 2)} {...medium} />
      <line x1={0} x2={0} y1={-W} y2={W} {...medium} />
      {[-1, 1].map((s) => <line key={s} x1={f(s * (court.attack - t / 2))} x2={f(s * (court.attack - t / 2))} y1={-W} y2={W} {...medium} />)}
      {[-1, 1].flatMap((s) => [-1, 1].map((e) => (
        <line key={`${s}${e}`} x1={f(s * (L + sg))} x2={f(s * (L + sg + sl))} y1={f(e * (W - t / 2))} y2={f(e * (W - t / 2))} {...medium} />
      )))}

      {/* The net overhead (dashed), from post to post: over the centre line, its cable and rope run on to the posts;
          an antenna over each side line, on opposite faces of the net */}
      <line x1={0} x2={0} y1={f(-py)} y2={f(py)} {...dashed} />
      {[-1, 1].map((s) => <circle key={s} cx={f(s * 0.016)} cy={f(s * (W + net.antenna.d / 2))} r={0.05} {...thin} fill="currentColor" />)}

      {/* The posts in their padding, the footings under the grass (dashed) */}
      {[-1, 1].map((s) => (
        <g key={s}>
          <circle cx={0} cy={f(s * py)} r={f(posts.d / 2)} {...thin} />
          <circle cx={0} cy={f(s * py)} r={f(pad)} {...thin} />
          <rect {...rect(-posts.footing.w / 2, s * py - posts.footing.w / 2, posts.footing.w / 2, s * py + posts.footing.w / 2)} {...dashed} />
        </g>
      ))}

      {/* The ball, by the net */}
      <circle cx={ball.x} cy={ball.y} r={ball.r} {...thin} />

      {/* Beyond the far free zone: a bench each side of the centre line under a thatched umbrella (overhead,
          dashed, its bundles faint), and the ball store at the end toward the compound */}
      {benches.x.map((x) => {
        const z0 = by - benches.d, pz = z0 - shade.behind
        return (
          <g key={x}>
            <rect {...rect(x - benches.l / 2, z0, x + benches.l / 2, by)} {...thin} fill="var(--background)" />
            {[1, 2].map((k) => <line key={k} x1={f(x - benches.l / 2)} x2={f(x + benches.l / 2)} y1={f(z0 + (k * benches.d) / 3)} y2={f(z0 + (k * benches.d) / 3)} {...faint} />)}
            <circle cx={x} cy={f(pz)} r={shade.r} {...dashed} />
            {Array.from({ length: 8 }, (_, k) => (k * Math.PI) / 4).map((a) => (
              <line key={a} x1={f(x + Math.cos(a) * 0.15)} x2={f(x + Math.cos(a) * shade.r)} y1={f(pz + Math.sin(a) * 0.15)} y2={f(pz + Math.sin(a) * shade.r)} {...faint} />
            ))}
            <circle cx={x} cy={f(pz)} r={f(shade.pole / 2)} {...thin} />
          </g>
        )
      })}
      <rect {...rect(store.x - store.l / 2, by - store.d, store.x + store.l / 2, by)} {...thin} />
      <rect {...rect(store.x - store.l / 2 + 0.06, by - store.d + 0.06, store.x + store.l / 2 - 0.06, by - 0.06)} {...faint} />

      {[-1, 1].map((s) => (
        <g key={s}>
          <text x={f(s * court.attack / 2)} y={-0.2} textAnchor="middle" style={label}>FRONT</text>
          <text x={f(s * court.attack / 2)} y={0.6} textAnchor="middle" style={label}>ZONE</text>
          <text x={f(s * (court.attack + L) / 2)} y={0.2} textAnchor="middle" style={label}>BACK ZONE</text>
          <text x={f(s * (L + court.free / 2))} y={-0.15} textAnchor="middle" style={small}>SERVICE</text>
          <text x={f(s * (L + court.free / 2))} y={0.42} textAnchor="middle" style={small}>ZONE</text>
        </g>
      ))}
      <text x={-6} y={f(W + court.free / 2 + 0.15)} textAnchor="middle" style={small}>FREE ZONE</text>
      <text x={0.3} y={f(-W - 0.45)} style={small}>{`NET ${mm(net.men)} MEN · ${mm(net.women)} WOMEN`}</text>
      <text x={0.3} y={f(W + 0.65)} style={small}>ANTENNA</text>
      <text x={0.45} y={f(py + 0.55)} style={small}>POST</text>
      <text x={f(ball.x - 0.25)} y={f(ball.y + 0.15)} textAnchor="end" style={small}>BALL</text>
      {benches.x.map((x) => <text key={x} x={f(x + shade.r + 0.25)} y={f(by - 0.02)} style={small}>BENCH</text>)}
      {benches.x.map((x) => <text key={x} x={x} y={f(by - benches.d - shade.behind - 0.5)} textAnchor="middle" style={small}>SHADE</text>)}
      <text x={store.x} y={f(by + 0.5)} textAnchor="middle" style={small}>BALL STORE</text>
      <text x={0} y={10.75} textAnchor="middle" style={small}>LINES 50 mm, INSIDE THE COURT · POSTS 1,000 OUTSIDE THE SIDE LINES · TOWARD THE OPEN LAWN</text>
      {[[-FX, -L], [-L, -court.attack], [-court.attack, 0], [0, court.attack], [court.attack, L], [L, FX]].map(([x0, x1]) => (
        <Dimension key={x0} x0={x0} x1={x1} y={f(FY + 0.85)} />
      ))}
      <Dimension x0={-FX} x1={FX} y={f(FY + 1.95)} />
      {[[-FY, -W], [-W, W], [W, FY]].map(([y0, y1]) => <DimensionUp key={y0} y0={y0} y1={y1} x={f(-FX - 0.85)} />)}
      <DimensionUp y0={-FY} y1={FY} x={f(-FX - 1.95)} />
    </svg>
  )
}
