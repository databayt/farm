// The compound as an illustrative plan, not a survey (D-017): the outer gate and sign, green
// parking, the rock road and the inner gate; around the courtyard, the joined guest block on the
// left, the row of two studios and the office on the right, and the study room behind that row.
// Containers are drawn at one scale (about 18.5 units per metre); the rest is schematic. The
// viewBox crops to the compound (x 150 to 1150); hotspot positions in copy.ts use the same frame.
const TREES = Array.from({ length: 28 }, (_, i) => ({ x: 22 + i * 42.5, r: i % 3 === 1 ? 19 : 15 }))
const ROW = [
  { x: 505, fill: "#7e2f26", terrace: true },
  { x: 640, fill: "#7e2f26", terrace: true },
  { x: 775, fill: "#d9a21b", terrace: false },
]

const label = {
  fontFamily: "var(--font-geist-mono), ui-monospace, monospace",
  fontSize: 16,
  letterSpacing: "0.12em",
  fill: "#2b2a26",
  fillOpacity: 0.72,
} as const

export function SitePlanMap({ title }: { title: string }) {
  return (
    <svg viewBox="150 0 1000 800" role="img" aria-label={title} className="block h-auto w-full rounded-2xl">
      <defs>
        <pattern id="plan-pavers" width="14" height="14" patternUnits="userSpaceOnUse">
          <rect width="14" height="14" fill="#d3dfbd" />
          <rect x="1.5" y="1.5" width="11" height="11" fill="none" stroke="#b7c79d" strokeWidth="1.2" />
        </pattern>
        <pattern id="plan-setts" width="11" height="11" patternUnits="userSpaceOnUse">
          <rect width="11" height="11" fill="#cdc1aa" />
          <rect x="1.5" y="1.5" width="8" height="8" rx="2" fill="#b9ab90" />
        </pattern>
      </defs>

      {/* Ground, lake and the band of trees along the shore */}
      <rect width="1200" height="800" fill="#f1e8d8" />
      <path
        d="M0 0H1200V64C1120 84 1040 58 950 74C860 90 780 64 690 80C600 96 520 70 430 84C340 98 250 74 160 88C100 97 45 86 0 92Z"
        fill="#c9dde3"
      />
      <text x="1128" y="44" textAnchor="end" style={{ ...label, fontStyle: "italic", letterSpacing: "0.04em", fontSize: 20 }}>
        lake
      </text>
      {TREES.map((tree) => (
        <circle key={tree.x} cx={tree.x} cy={118} r={tree.r} fill="#9fb487" fillOpacity={0.85} />
      ))}

      {/* Study room: one 40 ft container (teal) with its deck facing the row */}
      <rect x="560" y="158" width="226" height="45" rx="3" fill="#3e8a86" />
      <rect x="560" y="203" width="226" height="24" fill="#c6a073" />
      <text x="800" y="186" style={label}>
        STUDY ROOM
      </text>

      {/* Two studios and the office: 20 ft containers on raised decks */}
      {ROW.map((unit) => (
        <g key={unit.x}>
          <rect x={unit.x} y="262" width="112" height="45" rx="3" fill={unit.fill} />
          {unit.terrace ? (
            <rect x={unit.x + 10} y="268" width="92" height="33" fill="none" stroke="#f1e8d8" strokeOpacity={0.7} strokeDasharray="5 4" strokeWidth="1.5" />
          ) : null}
          <rect x={unit.x} y="307" width="112" height="28" fill="#c6a073" />
        </g>
      ))}
      <text x="628" y="252" textAnchor="middle" style={label}>
        STUDIOS
      </text>
      <text x="831" y="252" textAnchor="middle" style={label}>
        OFFICE
      </text>

      {/* Guest rooms: two 40 ft containers joined side by side, three rooms, a shared veranda */}
      <rect x="250" y="262" width="90" height="226" rx="3" fill="#d9a21b" />
      <line x1="295" x2="295" y1="266" y2="484" stroke="#a87a10" strokeWidth="1.5" strokeDasharray="3 6" />
      <line x1="250" x2="340" y1="337.3" y2="337.3" stroke="#a87a10" strokeWidth="2" />
      <line x1="250" x2="340" y1="412.6" y2="412.6" stroke="#a87a10" strokeWidth="2" />
      <rect x="340" y="262" width="26" height="226" fill="#c6a073" />
      {[292, 367, 442].map((y) => (
        <rect key={y} x="335" y={y} width="6" height="18" rx="1" fill="#7e2f26" />
      ))}
      <text x="295" y="252" textAnchor="middle" style={label}>
        GUEST ROOMS
      </text>

      {/* The courtyard lawn and the stone fire pit already on site */}
      <rect x="384" y="350" width="530" height="200" rx="28" fill="#cfdcb8" />
      {[
        [392, 374],
        [430, 392],
        [470, 410],
        [512, 426],
        [556, 438],
        [600, 446],
      ].map(([x, y]) => (
        <rect key={x} x={x} y={y} width="22" height="12" rx="5" fill="#e6dccb" />
      ))}
      <circle cx="650" cy="450" r="22" fill="#b9ad99" stroke="#8c8170" strokeWidth="3" />
      <circle cx="650" cy="450" r="11" fill="#6b5a4a" />
      <circle cx="650" cy="450" r="4.5" fill="#d9a21b" />
      <text x="890" y="532" textAnchor="end" style={label}>
        COURTYARD
      </text>

      {/* Inner gate, then the rock road of stone setts down to the parking */}
      <path d="M650 566C650 612 604 624 560 642C532 654 512 666 504 684" fill="none" stroke="#b3a68d" strokeWidth="36" strokeLinecap="round" />
      <path d="M650 566C650 612 604 624 560 642C532 654 512 666 504 684" fill="none" stroke="url(#plan-setts)" strokeWidth="28" strokeLinecap="round" />
      <rect x="616" y="550" width="13" height="13" fill="#a99c86" />
      <rect x="671" y="550" width="13" height="13" fill="#a99c86" />
      <path d="M630 556L646 574M670 556L654 574" stroke="#7e2f26" strokeWidth="4" strokeLinecap="round" />
      <text x="690" y="640" style={label}>
        ROCK ROAD
      </text>

      {/* Green parking: grass pavers under shade trees */}
      <rect x="330" y="668" width="380" height="96" rx="14" fill="url(#plan-pavers)" />
      {[392, 448, 504, 560, 616].map((x) => (
        <rect key={x} x={x} y="676" width="3" height="20" fill="#9a8664" />
      ))}
      <rect x="348" y="702" width="34" height="56" rx="9" fill="#fbfaf6" stroke="#cfc6b4" strokeWidth="2" />
      <rect x="460" y="702" width="34" height="56" rx="9" fill="#d6d6d1" stroke="#bdbdb6" strokeWidth="2" />
      {[362, 474, 586, 690].map((x) => (
        <circle key={x} cx={x} cy={666} r={21} fill="#9fb487" fillOpacity={0.9} />
      ))}
      <text x="700" y="752" textAnchor="end" style={label}>
        PARKING
      </text>

      {/* Outer gate and the sign wall on the public road */}
      <rect x="496" y="768" width="12" height="12" fill="#a99c86" />
      <rect x="556" y="768" width="12" height="12" fill="#a99c86" />
      <path d="M508 774L524 760M556 774L540 760" stroke="#9aa0a3" strokeWidth="4" strokeLinecap="round" />
      <rect x="408" y="771" width="78" height="10" rx="2" fill="#a99c86" />
      <text x="447" y="762" textAnchor="middle" style={{ ...label, fontSize: 12 }}>
        DIGITAL FARM
      </text>
      <rect x="0" y="786" width="1200" height="14" fill="#dcd0bb" />
    </svg>
  )
}
