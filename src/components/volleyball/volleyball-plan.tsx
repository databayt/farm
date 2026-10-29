import { Dimension, DimensionUp, Player, Serve, dashed, f, faint, label, medium, mm, rect, small, thin, tone } from "./court-drawing"
import volleyball from "./volleyball.json"

// The court drawn in the pattern of the livestock plan (src/components/livestock/livestock-plan.tsx): thin lines, no
// colour, bold capitals and dimensions in millimetres. As on the master plan, the court's length runs across the
// page; the benches stand on the far side, up the page, and the open lawn and the viewer of the 3D are down it.
// Over the plan, a match the way broadcast pictures show one: the court a shade darker than its free zone, twelve
// players in their rotation order, the serve's flight and the two referees (volleyball.json match).
// Units are metres, the court's centre at 0,0, y toward the viewer.

const { court, net, posts, benches, shade, store, match } = volleyball
// rotation positions as a team faces the net, front row 4 3 2 from left to right, back row 5 6 1
const rows = [[4, 3, 2], [5, 6, 1]] as const

export function VolleyballPlan({ title, className }: { title: string; className?: string }) {
  const L = court.l / 2, W = court.w / 2, t = court.line
  const FX = L + court.free, FY = W + court.free // the free zone's edge
  const py = W + posts.out // the posts, 1 m outside the side lines
  const by = -(FY + benches.gap) // the bench row's front edge, toward the court
  const { gap: sg, l: sl } = court.service
  const ext = court.extension
  const pad = posts.d / 2 + posts.pad.t
  // where each team's six stand: s is the team's side (-1 left, serving; 1 right, receiving). Facing the net, a
  // team's left hand points up the page on the left side and down it on the right.
  const spots = (s: number) => rows.flatMap((row, r) => row.map((n, k) => ({
    n, x: s * (r === 0 ? match.front : match.back), y: (k - 1) * match.lane * -s,
  })))
  return (
    <svg viewBox="-14.6 -11 27.2 23" role="img" aria-label={title} className={className}>
      {/* The playing area: the court and its 3 m free zone, mown short, the court a shade darker as on TV */}
      <rect {...rect(-FX, -FY, FX, FY)} {...thin} {...tone.run} />
      <rect {...rect(-L, -W, L, W)} stroke="none" {...tone.court} />

      {/* The lines, 50 mm wide and inside the 18 x 9 m: side and end lines, the centre line under the net, an attack
          line each side with its rear edge 3 m out, run on past the side lines in five short dashes, and the service
          zones' short lines behind the end lines */}
      <rect {...rect(-L + t / 2, -W + t / 2, L - t / 2, W - t / 2)} {...medium} />
      <line x1={0} x2={0} y1={-W} y2={W} {...medium} />
      {[-1, 1].map((s) => <line key={s} x1={f(s * (court.attack - t / 2))} x2={f(s * (court.attack - t / 2))} y1={-W} y2={W} {...medium} />)}
      {[-1, 1].flatMap((s) => [-1, 1].flatMap((e) => Array.from({ length: ext.n }, (_, k) => {
        const y0 = W + ext.gap + k * (ext.l + ext.gap)
        return <line key={`${s}${e}${k}`} x1={f(s * (court.attack - t / 2))} x2={f(s * (court.attack - t / 2))} y1={f(e * y0)} y2={f(e * (y0 + ext.l))} {...medium} />
      })))}
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

      {/* The match: the serving team open, on the left, its position 1 out in the service zone with the ball; the
          receiving team filled; the serve's flight over the net to the seam between 1 and 6; the 1st referee on a
          stand at the near post, the 2nd by the far post */}
      <Serve from={[match.server[0] + 0.35, match.server[1] - 0.3]} to={match.land} bow={2.4} />
      {spots(-1).map((p) => p.n === 1
        ? <Player key={p.n} x={match.server[0]} y={match.server[1]} n={1} />
        : <Player key={p.n} {...p} />)}
      {spots(1).map((p) => <Player key={p.n} {...p} filled />)}
      <rect {...rect(-0.35, py + match.referee - 0.35, 0.35, py + match.referee + 0.35)} {...thin} fill="var(--background)" />
      <Player x={0} y={py + match.referee} n="R1" r={0.28} filled />
      <Player x={0} y={-(py + match.referee)} n="R2" r={0.28} filled />

      {[-1, 1].map((s) => (
        <g key={s}>
          <text x={f(s * court.attack / 2)} y={f(-W + 0.65)} textAnchor="middle" style={{ ...small, fontSize: 0.34 }}>FRONT ZONE</text>
          <text x={f(s * (court.attack + L) / 2)} y={f(-W + 0.65)} textAnchor="middle" style={{ ...small, fontSize: 0.34 }}>BACK ZONE</text>
          <text x={f(s * (L + court.free / 2))} y={-0.95} textAnchor="middle" style={small}>SERVICE</text>
          <text x={f(s * (L + court.free / 2))} y={-0.38} textAnchor="middle" style={small}>ZONE</text>
        </g>
      ))}
      <text x={-6} y={f(W + court.free / 2 + 0.15)} textAnchor="middle" style={small}>FREE ZONE</text>
      <text x={0.3} y={f(-W - 0.45)} style={small}>{`NET ${mm(net.men)} MEN · ${mm(net.women)} WOMEN`}</text>
      <text x={0.3} y={f(W + 0.45)} style={small}>ANTENNA</text>
      <text x={0.3} y={f(py + 0.15)} style={small}>POST</text>
      <text x={0.5} y={f(py + match.referee + 0.15)} style={small}>1ST REFEREE, ON A STAND</text>
      <text x={0.45} y={f(-(py + match.referee) + 0.15)} style={small}>2ND REFEREE</text>
      <text x={f(match.server[0])} y={f(match.server[1] + 0.95)} textAnchor="middle" style={small}>SERVER</text>
      <text x={-6} y={f(-W - 1.1)} textAnchor="middle" style={label}>SERVING</text>
      <text x={6} y={f(-W - 1.1)} textAnchor="middle" style={label}>RECEIVING</text>
      {benches.x.map((x) => <text key={x} x={f(x + shade.r + 0.25)} y={f(by - 0.02)} style={small}>BENCH</text>)}
      {benches.x.map((x) => <text key={x} x={x} y={f(by - benches.d - shade.behind - 0.5)} textAnchor="middle" style={small}>SHADE</text>)}
      <text x={store.x} y={f(by + 0.5)} textAnchor="middle" style={small}>BALL STORE</text>
      <text x={0} y={10.75} textAnchor="middle" style={small}>LINES 50 mm, INSIDE THE COURT · POSTS 1,000 OUTSIDE THE SIDE LINES · TOWARD THE OPEN LAWN</text>
      <text x={0} y={11.55} textAnchor="middle" style={small}>ROTATION AT THE SERVE: 4 3 2 AT THE NET, 5 6 1 BEHIND · PLAYERS LARGER THAN LIFE</text>
      {[[-FX, -L], [-L, -court.attack], [-court.attack, 0], [0, court.attack], [court.attack, L], [L, FX]].map(([x0, x1]) => (
        <Dimension key={x0} x0={x0} x1={x1} y={f(FY + 0.85)} />
      ))}
      <Dimension x0={-FX} x1={FX} y={f(FY + 1.95)} />
      {[[-FY, -W], [-W, W], [W, FY]].map(([y0, y1]) => <DimensionUp key={y0} y0={y0} y1={y1} x={f(-FX - 0.85)} />)}
      <DimensionUp y0={-FY} y1={FY} x={f(-FX - 1.95)} />
    </svg>
  )
}
