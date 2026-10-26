// The compound as an illustrative plan, not a survey (D-017), drawn like a plotted CAD sheet: ink
// on paper, hatched container steel, swing arcs on the gates and doors, a title block. From the
// public road: the outer gate and sign, green parking, the rock road and the inner gate; around
// the courtyard, the joined guest block on the left, the row of two studios and the office on the
// right, and the study room behind that row. Containers are drawn to size (about 18.5 units per
// metre), so only they carry dimensions; the rest is schematic. The viewBox crops to the compound
// (x 150 to 1150); hotspot positions in copy.ts use the same frame.
const INK = "#2b2a26"
const PAPER = "#fcfbf8"

const TREES = Array.from({ length: 28 }, (_, i) => ({ x: 22 + i * 42.5, r: i % 3 === 1 ? 19 : 15 }))
const ROW = [
  { x: 505, terrace: true },
  { x: 640, terrace: true },
  { x: 775, terrace: false },
]
const SHORE = "M1200 64C1120 84 1040 58 950 74C860 90 780 64 690 80C600 96 520 70 430 84C340 98 250 74 160 88C100 97 45 86 0 92"
const ROAD = "M650 566C650 612 604 624 560 642C532 654 512 666 504 684"

// Line weights in screen pixels at any size, as a plot style sets them.
const heavy = { fill: "none", stroke: INK, strokeWidth: 1.6, vectorEffect: "non-scaling-stroke" } as const
const medium = { ...heavy, strokeWidth: 1 } as const
const thin = { ...heavy, strokeWidth: 0.6, strokeOpacity: 0.75 } as const

// A paper halo keeps the lettering readable where it crosses hatching.
const label = {
  fontFamily: "var(--font-geist-mono), ui-monospace, monospace",
  fontSize: 13,
  letterSpacing: "0.14em",
  fill: INK,
  stroke: PAPER,
  strokeWidth: 4,
  paintOrder: "stroke",
} as const
const small = { ...label, fontSize: 10.5 } as const

// A tree in plan: canopy and trunk mark; dashed where the canopy overhangs parking.
function Tree({ x, y, r, dashed }: { x: number; y: number; r: number; dashed?: boolean }) {
  return (
    <g>
      <circle cx={x} cy={y} r={r} {...thin} strokeDasharray={dashed ? "4 3" : undefined} />
      <path d={`M${x - 3} ${y}H${x + 3}M${x} ${y - 3}V${y + 3}`} {...thin} />
    </g>
  )
}

// A two-leaf gate between posts, both leaves swung open into the site.
function Gate({ left, right, y, post }: { left: number; right: number; y: number; post: number }) {
  const leaf = (right - left) / 2
  const reach = leaf * Math.SQRT1_2
  const middle = left + leaf
  return (
    <g>
      {[left - post, right].map((x) => (
        <g key={x}>
          <rect x={x} y={y - post / 2} width={post} height={post} fill="url(#cad-hatch)" />
          <rect x={x} y={y - post / 2} width={post} height={post} {...medium} />
        </g>
      ))}
      <path d={`M${left} ${y}L${left + reach} ${y - reach}M${right} ${y}L${right - reach} ${y - reach}`} {...medium} />
      <path
        d={`M${middle} ${y}A${leaf} ${leaf} 0 0 0 ${left + reach} ${y - reach}M${middle} ${y}A${leaf} ${leaf} 0 0 1 ${right - reach} ${y - reach}`}
        {...thin}
        strokeDasharray="3 3"
      />
    </g>
  )
}

// A dimension: extension lines, a dimension line with architectural ticks, and the value.
function Dimension({ x1, y1, x2, y2, offset, text }: { x1: number; y1: number; x2: number; y2: number; offset: number; text: string }) {
  const vertical = x1 === x2
  const [dx, dy] = vertical ? [offset, 0] : [0, offset]
  const [ax, ay, bx, by] = [x1 + dx, y1 + dy, x2 + dx, y2 + dy]
  const tick = (x: number, y: number) => `M${x - 4} ${y + 4}L${x + 4} ${y - 4}`
  const mx = (ax + bx) / 2
  const my = (ay + by) / 2
  return (
    <g>
      <path d={`M${x1} ${y1}L${ax + Math.sign(dx) * 6} ${ay + Math.sign(dy) * 6}M${x2} ${y2}L${bx + Math.sign(dx) * 6} ${by + Math.sign(dy) * 6}`} {...thin} />
      <path d={`M${ax} ${ay}L${bx} ${by}${tick(ax, ay)}${tick(bx, by)}`} {...thin} />
      <text
        x={vertical ? mx - 7 : mx}
        y={vertical ? my : my + 16}
        textAnchor="middle"
        transform={vertical ? `rotate(-90 ${mx - 7} ${my})` : undefined}
        style={small}
      >
        {text}
      </text>
    </g>
  )
}

export function SitePlanMap({ title }: { title: string }) {
  return (
    <svg viewBox="150 0 1000 800" role="img" aria-label={title} className="block h-auto w-full rounded-2xl">
      <defs>
        <clipPath id="cad-sheet">
          <rect x="160" y="10" width="980" height="780" />
        </clipPath>
        {/* ANSI31, the hatch for steel: every container */}
        <pattern id="cad-hatch" width="7" height="7" patternUnits="userSpaceOnUse" patternTransform="rotate(45)">
          <line x1="0" y1="0" x2="0" y2="7" stroke={INK} strokeOpacity={0.34} strokeWidth="0.8" />
        </pattern>
        <pattern id="cad-boards" width="6" height="6" patternUnits="userSpaceOnUse">
          <line x1="0" y1="0.5" x2="6" y2="0.5" stroke={INK} strokeOpacity={0.3} strokeWidth="0.7" />
        </pattern>
        <pattern id="cad-boards-across" width="6" height="6" patternUnits="userSpaceOnUse">
          <line x1="0.5" y1="0" x2="0.5" y2="6" stroke={INK} strokeOpacity={0.3} strokeWidth="0.7" />
        </pattern>
        <pattern id="cad-setts" width="8" height="8" patternUnits="userSpaceOnUse">
          <path d="M0 0.4H8M0.4 0V8" stroke={INK} strokeOpacity={0.28} strokeWidth="0.7" />
        </pattern>
        <pattern id="cad-pavers" width="12" height="12" patternUnits="userSpaceOnUse">
          <rect x="2.5" y="2.5" width="7" height="7" fill="none" stroke={INK} strokeOpacity={0.2} strokeWidth="0.7" />
        </pattern>
        <pattern id="cad-water" width="44" height="14" patternUnits="userSpaceOnUse">
          <path d="M3 4H19M25 11H41" stroke={INK} strokeOpacity={0.3} strokeWidth="0.8" />
        </pattern>
      </defs>

      <rect x="150" width="1000" height="800" fill={PAPER} />
      <g clipPath="url(#cad-sheet)">
        {/* The lake and the band of trees along the shore */}
        <path d={`M0 0H1200V64${SHORE.slice(SHORE.indexOf("C"))}Z`} fill="url(#cad-water)" />
        <path d={SHORE} {...medium} />
        <text x="1124" y="42" textAnchor="end" style={{ ...label, fontStyle: "italic", letterSpacing: "0.3em" }}>
          LAKE
        </text>
        {TREES.map((tree) => (
          <Tree key={tree.x} x={tree.x} y={118} r={tree.r} />
        ))}

        {/* Study room: one 40 ft container, glazed along the side that faces its deck */}
        <rect x="560" y="158" width="226" height="45" fill="url(#cad-hatch)" />
        <rect x="560" y="158" width="226" height="45" {...heavy} />
        <path d="M574 199.5H772" {...thin} />
        <rect x="560" y="203" width="226" height="24" fill="url(#cad-boards-across)" />
        <rect x="560" y="203" width="226" height="24" {...medium} />
        <text x="800" y="186" style={label}>
          STUDY ROOM
        </text>

        {/* Two studios and the office: 20 ft containers on raised decks; dashed, the roof terraces */}
        {ROW.map((unit) => (
          <g key={unit.x}>
            <rect x={unit.x} y="262" width="112" height="45" fill="url(#cad-hatch)" />
            <rect x={unit.x} y="262" width="112" height="45" {...heavy} />
            {unit.terrace ? (
              <rect x={unit.x + 9} y="267" width="94" height="35" {...thin} fill={PAPER} strokeDasharray="6 4" />
            ) : null}
            <rect x={unit.x} y="307" width="112" height="28" fill="url(#cad-boards)" />
            <rect x={unit.x} y="307" width="112" height="28" {...medium} />
          </g>
        ))}
        <text x="628" y="252" textAnchor="middle" style={label}>
          STUDIOS
        </text>
        <text x="831" y="252" textAnchor="middle" style={label}>
          OFFICE
        </text>

        {/* Guest rooms: two 40 ft containers joined side by side, three rooms, a shared veranda */}
        <rect x="250" y="262" width="90" height="226" fill="url(#cad-hatch)" />
        <rect x="250" y="262" width="90" height="226" {...heavy} />
        <line x1="295" x2="295" y1="262" y2="488" {...thin} strokeDasharray="14 4 2 4" />
        <line x1="250" x2="340" y1="337.3" y2="337.3" {...medium} />
        <line x1="250" x2="340" y1="412.6" y2="412.6" {...medium} />
        <rect x="340" y="262" width="26" height="226" fill="url(#cad-boards)" />
        <rect x="340" y="262" width="26" height="226" {...medium} />
        {[292, 367, 442].map((y) => (
          <g key={y}>
            <rect x="337.5" y={y} width="5" height="18" fill={PAPER} />
            <path d={`M340 ${y}H358`} {...medium} />
            <path d={`M358 ${y}A18 18 0 0 1 340 ${y + 18}`} {...thin} strokeDasharray="3 3" />
          </g>
        ))}
        <text x="295" y="252" textAnchor="middle" style={label}>
          GUEST ROOMS
        </text>
        <Dimension x1={250} y1={262} x2={250} y2={488} offset={-24} text="12.2 m" />
        <Dimension x1={250} y1={488} x2={340} y2={488} offset={22} text="4.9 m" />

        {/* The courtyard lawn and the stone fire pit already on site */}
        <rect x="384" y="350" width="530" height="200" rx="28" {...thin} strokeDasharray="10 5" />
        {[
          [392, 374],
          [430, 392],
          [470, 410],
          [512, 426],
          [556, 438],
          [600, 446],
        ].map(([x, y]) => (
          <rect key={x} x={x} y={y} width="22" height="12" rx="5" {...thin} />
        ))}
        <circle cx="650" cy="450" r="22" {...medium} />
        <circle cx="650" cy="450" r="13" {...thin} />
        <text x="650" y="492" textAnchor="middle" style={small}>
          FIRE PIT
        </text>
        <text x="890" y="532" textAnchor="end" style={label}>
          COURTYARD
        </text>

        {/* Green parking: grass pavers, bays and the shade trees over them */}
        <rect x="330" y="668" width="380" height="96" rx="6" fill="url(#cad-pavers)" />
        <rect x="330" y="668" width="380" height="96" rx="6" {...medium} />
        {[392, 448, 504, 560, 616].map((x) => (
          <line key={x} x1={x} x2={x} y1="694" y2="764" {...thin} />
        ))}
        {[348, 460].map((x) => (
          <g key={x}>
            <rect x={x} y="702" width="34" height="56" rx="7" {...medium} fill={PAPER} />
            <path d={`M${x + 4} 716H${x + 30}M${x + 4} 744H${x + 30}`} {...thin} />
          </g>
        ))}
        {[362, 474, 586, 690].map((x) => (
          <Tree key={x} x={x} y={666} r={21} dashed />
        ))}
        <text x="700" y="752" textAnchor="end" style={label}>
          PARKING
        </text>

        {/* The rock road of stone setts, from the parking up to the inner gate */}
        <path d={ROAD} fill="none" stroke={INK} strokeWidth="30" />
        <path d={ROAD} fill="none" stroke={PAPER} strokeWidth="27.6" />
        <path d={ROAD} fill="none" stroke="url(#cad-setts)" strokeWidth="27.6" />
        <path d={ROAD} {...thin} strokeDasharray="14 5 3 5" />
        <text x="690" y="640" style={label}>
          ROCK ROAD
        </text>
        <Gate left={629} right={671} y={556} post={13} />

        {/* The outer gate and the sign wall on the public road */}
        <Gate left={508} right={556} y={774} post={12} />
        <rect x="408" y="771" width="78" height="10" fill="url(#cad-hatch)" />
        <rect x="408" y="771" width="78" height="10" {...medium} />
        <text x="447" y="762" textAnchor="middle" style={small}>
          DIGITAL FARM
        </text>
        <line x1="150" x2="1150" y1="786" y2="786" {...medium} />
        <text x="174" y="778" style={small}>
          PUBLIC ROAD
        </text>

        {/* Title block */}
        <rect x="916" y="690" width="224" height="90" {...medium} fill={PAPER} />
        <path d="M916 720H1140M916 750H1140M1086 750V780" {...thin} />
        <text x="928" y="711" style={{ ...label, fontSize: 14, letterSpacing: "0.2em" }}>
          DIGITAL FARM
        </text>
        <text x="928" y="740" style={small}>
          SITE PLAN · ILLUSTRATIVE
        </text>
        <text x="928" y="770" style={small}>
          GASHORA · BUGESERA
        </text>
        <text x="1113" y="770" textAnchor="middle" style={small}>
          NTS
        </text>
      </g>
      <rect x="160" y="10" width="980" height="780" {...medium} />
    </svg>
  )
}
