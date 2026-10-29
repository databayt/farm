// The net system drawn inline, in the studio's service diagrams' pattern so it runs full width and follows the theme:
// an elevation along the net line, seen from behind one end line, with the ground cut away under the two posts to show
// their footings and sleeves. Every size comes from volleyball.json (net, posts, court); the footings in the 3D drawing
// below are the same orange.

export const FOOTING_COLOUR = "#d9822b"

type Net = { men: number; women: number; d: number; l: number; top: number; band: { w: number; h: number }; antenna: { l: number; above: number } }
type Posts = { out: number; h: number; d: number; pad: { t: number; h: number }; winch: number; footing: { w: number; depth: number } }

const W = 1600
const H = 640

export function NetDiagram({ net, posts, courtW }: { net: Net; posts: Posts; courtW: number }) {
  const S = 100 // px a metre
  const cx = W / 2, g = 430 // the centre line and the grass, in px
  const X = (m: number) => cx + m * S, Y = (m: number) => g - m * S
  const half = courtW / 2, pz = half + posts.out
  const mm = (m: number) => Math.round(m * 1000).toLocaleString("en-US")
  const nb = net.men - net.d
  const dim = (x: number, y0: number, y1: number, text: string, side: 1 | -1 = 1) => (
    <g>
      <path d={`M${x} ${Y(y0)} V${Y(y1)} M${x - 6} ${Y(y0)} H${x + 6} M${x - 6} ${Y(y1)} H${x + 6}`} strokeWidth={1.2} className="stroke-muted-foreground" />
      <text x={x + side * 10} y={(Y(y0) + Y(y1)) / 2 + 5} textAnchor={side > 0 ? "start" : "end"} stroke="none" className="fill-muted-foreground text-[13px]">{text}</text>
    </g>
  )
  const label = (id: string, sub: string, x: number, y: number, anchor: "start" | "middle" | "end" = "start") => (
    <text x={x} y={y} textAnchor={anchor} stroke="none" className="fill-muted-foreground text-[13px]">
      <tspan className="fill-foreground font-semibold">{id}</tspan> {sub}
    </text>
  )
  return (
    <svg viewBox={`0 0 ${W} ${H}`} role="img" className="stroke-foreground h-auto w-full min-w-[960px]"
      strokeWidth={2} strokeLinecap="round" fill="none"
      aria-label={`Net system, seen along the net line: two steel posts ${mm(posts.h)} mm high, ${mm(posts.out)} mm outside the side lines, padded to ${mm(posts.pad.h)} mm, each dropped into a steel sleeve cast in a concrete footing ${mm(posts.footing.w)} mm square and ${mm(posts.footing.depth)} mm deep, its top flush with the grass; the net ${mm(net.l)} mm long and ${mm(net.d)} mm deep, its top ${mm(net.men)} mm above the court for men and ${mm(net.women)} mm for women, a side band and an antenna over each side line, the top cable to a winch on the near post at ${mm(posts.winch)} mm.`}>
      {/* the grass, and the ground cut open under each post */}
      <path d={`M60 ${g} H${W - 60}`} strokeWidth={2.5} />
      {[-1, 1].map((s) => {
        const f = posts.footing.w / 2
        return (
          <g key={s}>
            <rect x={X(s * pz - f)} y={g} width={posts.footing.w * S} height={posts.footing.depth * S} rx={2}
              className="fill-muted" style={{ stroke: FOOTING_COLOUR }} strokeWidth={3} />
            <rect x={X(s * pz) - (posts.d / 2) * S - 3} y={g} width={posts.d * S + 6} height={(posts.footing.depth - 0.1) * S}
              className="fill-background" style={{ stroke: FOOTING_COLOUR }} strokeWidth={2} />
          </g>
        )
      })}

      {/* the posts, the pads, the winch */}
      {[-1, 1].map((s) => (
        <g key={s}>
          <rect x={X(s * pz) - (posts.d / 2) * S} y={Y(posts.h)} width={posts.d * S} height={(posts.h + posts.footing.depth - 0.15) * S} className="fill-background" />
          <rect x={X(s * pz) - (posts.d / 2 + posts.pad.t) * S} y={Y(posts.pad.h)} width={(posts.d + 2 * posts.pad.t) * S} height={posts.pad.h * S}
            className="fill-muted" strokeWidth={1.5} />
        </g>
      ))}
      <rect x={X(pz + posts.d / 2 + posts.pad.t)} y={Y(posts.winch) - 10} width={14} height={20} className="fill-foreground" stroke="none" />

      {/* the net: the mesh between its bands, the cables on to the posts, the side bands and the antennae */}
      <rect x={X(-net.l / 2)} y={Y(net.men)} width={net.l * S} height={net.d * S} strokeWidth={1} className="stroke-muted-foreground" strokeDasharray="1 9" />
      {Array.from({ length: Math.round(net.l / 0.25) + 1 }, (_, k) => (
        <path key={k} d={`M${X(-net.l / 2 + k * 0.25)} ${Y(net.men)} V${Y(nb)}`} strokeWidth={0.6} className="stroke-muted-foreground" />
      ))}
      {Array.from({ length: 4 }, (_, k) => (
        <path key={k} d={`M${X(-net.l / 2)} ${Y(nb + (k + 1) * 0.2)} H${X(net.l / 2)}`} strokeWidth={0.6} className="stroke-muted-foreground" />
      ))}
      <rect x={X(-net.l / 2)} y={Y(net.men)} width={net.l * S} height={net.top * S} className="fill-background" strokeWidth={1.5} />
      <path d={`M${X(-pz)} ${Y(net.men - net.top / 2)} H${X(pz)} M${X(-pz)} ${Y(nb + 0.03)} H${X(pz)}`} strokeWidth={1.2} />
      {[-1, 1].map((s) => (
        <g key={s}>
          <rect x={X(s * half) - (s > 0 ? net.band.w * S : 0)} y={Y(net.men)} width={net.band.w * S} height={net.band.h * S} className="fill-background" strokeWidth={1.2} />
          {Array.from({ length: Math.round(net.antenna.l / 0.1) }, (_, k) => (
            <rect key={k} x={X(s * half) - 2} y={Y(net.men + net.antenna.above - (k + 1) * 0.1)} width={4} height={0.1 * S}
              stroke="none" className={k < net.antenna.above / 0.1 && k % 2 === 0 ? "fill-destructive" : "fill-muted-foreground"} />
          ))}
        </g>
      ))}

      {/* heights and widths */}
      <path d={`M${X(-net.l / 2) - 30} ${Y(net.women)} H${X(net.l / 2) + 30}`} strokeDasharray="6 6" strokeWidth={1.2} className="stroke-muted-foreground" />
      {dim(X(-pz) - 60, 0, posts.h, `${mm(posts.h)} post`, -1)}
      {dim(X(-1.2), 0, net.men, `${mm(net.men)} men`, 1)}
      {dim(X(1.2), 0, net.women, `${mm(net.women)} women`, 1)}
      {dim(X(pz) - 40, 0, posts.pad.h, `${mm(posts.pad.h)} pad`, -1)}
      {dim(X(pz) + 70, -posts.footing.depth, 0, `${mm(posts.footing.depth)} deep`, 1)}
      <path d={`M${X(-half)} ${g + 30} H${X(half)} M${X(-half)} ${g + 22} V${g + 38} M${X(half)} ${g + 22} V${g + 38}`} strokeWidth={1.2} className="stroke-muted-foreground" />
      <text x={cx} y={g + 54} textAnchor="middle" stroke="none" className="fill-muted-foreground text-[13px]">{mm(courtW)} between the side lines · posts {mm(posts.out)} outside them</text>

      {label("N", `net ${mm(net.l)} × ${mm(net.d)}, 100 mm mesh`, X(-3.2), Y(net.men) - 22, "middle")}
      {label("A1, A2", `antennae ${mm(net.antenna.l)}, ${mm(net.antenna.above)} above the net`, X(half) + 16, Y(net.men + net.antenna.above) + 10)}
      {label("W", "winch, near post", X(pz) + 40, Y(posts.winch) + 5)}
      {label("P1, P2", "steel posts in sleeves", X(-pz) - 10, Y(posts.h) - 16)}
      {label("S1, S2", `footing ${mm(posts.footing.w)} square, sleeve cast in, top flush`, X(-pz) - posts.footing.w * S, g + posts.footing.depth * S + 30)}

      <text x={60} y={H - 22} stroke="none" className="fill-muted-foreground text-[14px]">
        No guy wires: the posts stand in their sleeves and lift out to mow or for the rains, a cap closing each sleeve · design intent until a builder sees the soil
      </text>
    </svg>
  )
}
