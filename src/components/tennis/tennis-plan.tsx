import { Dimension, DimensionUp, Player, Serve, dashed, f, faint, label, medium, mm, rect, small, thin, tone } from "@/components/volleyball/court-drawing"
import volleyball from "@/components/volleyball/volleyball.json"

import tennis from "./tennis.json"

// The tennis court the volleyball page switches to, drawn as the volleyball plan is: the length across the page,
// the net on the volleyball's net line, the same centre and the same scale of line, and over it a singles point at
// the serve. The volleyball's 24 x 15 m playing area is dashed underneath, to show how much more lawn tennis takes.
// Units are metres, the net's centre at 0,0, y toward the viewer.

const { court, space, net, posts, players } = tennis

export function TennisPlan({ title, className }: { title: string; className?: string }) {
  const L = court.l / 2, D = court.doubles / 2, S = court.singles / 2, V = court.service, t = court.line
  const FX = L + space.back, FY = D + space.side // the playing area's edge
  const py = D + net.out, sy = S + net.out // the posts and the singles sticks
  const vx = volleyball.court.l / 2 + volleyball.court.free, vy = volleyball.court.w / 2 + volleyball.court.free
  return (
    <svg viewBox="-20.2 -9.7 38.6 22.6" role="img" aria-label={title} className={className}>
      {/* The playing area: the run-back behind each baseline and the run-off beside each side line, the court a
          shade darker; the volleyball's playing area dashed over it */}
      <rect {...rect(-FX, -FY, FX, FY)} {...thin} {...tone.run} />
      <rect {...rect(-L, -D, L, D)} stroke="none" {...tone.court} />
      <rect {...rect(-vx, -vy, vx, vy)} {...faint} strokeDasharray="5 4" />

      {/* The lines, to their outside edges: the doubles side lines and the baselines (drawn heavier, as they may be
          up to 100 mm), the singles side lines, the service lines 6,400 from the net, the centre service line and a
          centre mark on each baseline */}
      <rect {...rect(-L + t / 2, -D + t / 2, L - t / 2, D - t / 2)} {...medium} />
      {[-1, 1].map((s) => <line key={s} x1={f(s * (L - court.baseline / 2))} x2={f(s * (L - court.baseline / 2))} y1={-D} y2={D} {...medium} strokeWidth={2.6} />)}
      {[-1, 1].map((s) => <line key={s} x1={-L} x2={L} y1={f(s * (S - t / 2))} y2={f(s * (S - t / 2))} {...medium} />)}
      {[-1, 1].map((s) => <line key={s} x1={f(s * (V - t / 2))} x2={f(s * (V - t / 2))} y1={-S} y2={S} {...medium} />)}
      <line x1={-V} x2={V} y1={0} y2={0} {...medium} />
      {[-1, 1].map((s) => <line key={s} x1={f(s * L)} x2={f(s * (L - court.mark - court.baseline))} y1={0} y2={0} {...medium} />)}

      {/* The net overhead (dashed) from post to post, its centre strap, the singles sticks and the posts, each post
          in a sleeve under the grass (dashed) */}
      <line x1={0} x2={0} y1={f(-py)} y2={f(py)} {...dashed} />
      <rect {...rect(-0.04, -0.25, 0.04, 0.25)} {...thin} fill="currentColor" />
      {[-1, 1].map((s) => (
        <g key={s}>
          <circle cx={0} cy={f(s * py)} r={f(posts.d / 2)} {...thin} fill="currentColor" />
          <rect {...rect(-posts.footing / 2, s * py - posts.footing / 2, posts.footing / 2, s * py + posts.footing / 2)} {...dashed} />
          <circle cx={0} cy={f(s * sy)} r={0.05} {...thin} />
        </g>
      ))}

      {/* The point: the server open, just right of the centre mark, serving across to the deuce court; the
          receiver filled, behind the far baseline */}
      <Serve from={[players.server[0] + 0.3, players.server[1] - 0.25]} to={players.land} bow={1.8} ball={0.09} />
      <Player x={players.server[0]} y={players.server[1]} />
      <Player x={players.receiver[0]} y={players.receiver[1]} filled />

      {[-1, 1].map((s) => (
        <g key={s}>
          <text x={f(s * V / 2)} y={f(-S / 2 - 0.1)} textAnchor="middle" style={small}>SERVICE BOX</text>
          <text x={f(s * V / 2)} y={f(-S / 2 + 0.5)} textAnchor="middle" style={small}>{s > 0 ? "DEUCE" : "AD"}</text>
          <text x={f(s * V / 2)} y={f(S / 2 - 0.1)} textAnchor="middle" style={small}>SERVICE BOX</text>
          <text x={f(s * V / 2)} y={f(S / 2 + 0.5)} textAnchor="middle" style={small}>{s > 0 ? "AD" : "DEUCE"}</text>
          <text x={f(s * (V + L) / 2)} y={2.4} textAnchor="middle" style={label}>BACKCOURT</text>
          <text x={f(s * (V + L) / 2)} y={f(-(S + D) / 2 + 0.15)} textAnchor="middle" style={small}>DOUBLES ALLEY</text>
          <text x={f(s * (L + FX) / 2)} y={-1.6} textAnchor="middle" style={small}>RUN-BACK</text>
        </g>
      ))}
      <text x={-6} y={f(D + space.side / 2 + 0.15)} textAnchor="middle" style={small}>RUN-OFF</text>
      <text x={f(vx - 0.3)} y={f(vy - 0.3)} textAnchor="end" style={small}>{`VOLLEYBALL'S PLAYING AREA ${mm(2 * vx)} × ${mm(2 * vy)} (DASHED)`}</text>
      <text x={0.3} y={f(-py - 0.35)} style={small}>{`NET ${mm(net.centre)} AT THE CENTRE · ${mm(net.post)} AT THE POSTS`}</text>
      <text x={0.3} y={f(sy + 0.15)} style={small}>SINGLES STICK</text>
      <text x={0.4} y={f(py + 0.15)} style={small}>POST</text>
      <text x={0.3} y={-0.35} style={small}>CENTRE STRAP</text>
      <text x={f(-L + 0.3)} y={-0.35} style={small}>CENTRE MARK</text>
      <text x={f(players.server[0])} y={f(players.server[1] + 0.95)} textAnchor="middle" style={small}>SERVER</text>
      <text x={f(players.receiver[0] + 0.6)} y={f(players.receiver[1] + 0.15)} style={small}>RECEIVER</text>
      {[[-FX, -L], [-L, -V], [-V, 0], [0, V], [V, L], [L, FX]].map(([x0, x1]) => (
        <Dimension key={x0} x0={x0} x1={x1} y={f(FY + 0.85)} />
      ))}
      <Dimension x0={-FX} x1={FX} y={f(FY + 1.95)} />
      {[[-FY, -D], [-D, -S], [-S, S], [S, D], [D, FY]].map(([y0, y1]) => <DimensionUp key={y0} y0={y0} y1={y1} x={f(-FX - 0.85)} />)}
      <DimensionUp y0={-FY} y1={FY} x={f(-FX - 1.95)} />
      <text x={0} y={f(FY + 3.15)} textAnchor="middle" style={small}>{"LINES 50 mm, BASELINES 100 mm · ON THE VOLLEYBALL'S NET LINE, ITS POSTS 900 FURTHER OUT · TOWARD THE OPEN LAWN"}</text>
      <text x={0} y={f(FY + 3.95)} textAnchor="middle" style={small}>A SINGLES POINT AT THE SERVE · PLAYERS DRAWN LARGER THAN LIFE</text>
    </svg>
  )
}
