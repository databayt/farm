import { copy } from "./copy"
import { SectionHead } from "./section-head"

const display = { fontFamily: "var(--font-sans), ui-sans-serif, system-ui, sans-serif" }
const mono = {
  fontFamily: "var(--font-geist-mono), ui-monospace, monospace",
  fontSize: 12,
  letterSpacing: "0.14em",
  fill: "#2b2a26",
  fillOpacity: 0.7,
} as const

// Stylised on purpose: the farm's exact place stays private until the founder chooses to share
// it (study/brand/brand.md §11.9), so the map shows a sector, not a pin.
function RouteMap() {
  const { map } = copy.location
  return (
    <svg viewBox="0 0 800 520" role="img" aria-label={map.label} className="block h-auto w-full rounded-2xl">
      <rect width="800" height="520" fill="#ece8de" />
      {[0, 1, 2, 3, 4].map((i) => (
        <path
          key={i}
          d={`M-20 ${90 + i * 95}C150 ${40 + i * 95} 300 ${150 + i * 95} 470 ${95 + i * 95}S720 ${60 + i * 95} 830 ${120 + i * 95}`}
          fill="none"
          stroke="#e0d8c6"
          strokeWidth="1.5"
        />
      ))}
      <path
        d="M362 250C420 214 522 224 604 242C692 260 762 302 772 362C782 432 722 490 620 500C518 510 420 488 370 440C330 400 322 290 362 250Z"
        fill="#e4dac4"
        stroke="#c9b998"
        strokeDasharray="4 6"
        strokeWidth="1.5"
      />
      <text x="760" y="292" textAnchor="end" style={mono}>
        {map.district.toUpperCase()}
      </text>
      <path d="M612 400C640 384 682 392 688 414C694 438 660 452 630 446C602 440 590 414 612 400Z" fill="#bfd5dc" />
      <path d="M484 452C504 440 538 446 540 462C542 478 516 488 494 482C474 476 468 462 484 452Z" fill="#bfd5dc" />
      <path d="M690 338C704 330 724 334 726 346C728 358 712 364 698 360C684 356 680 344 690 338Z" fill="#bfd5dc" />
      <text x="646" y="473" textAnchor="middle" style={{ ...display, fontSize: 18, fill: "#2e6f8e" }}>
        {map.lake}
      </text>

      <path
        id="route"
        d="M188 128C232 210 330 202 382 262C424 312 470 332 546 372"
        fill="none"
        stroke="#3f6b3a"
        strokeWidth="3"
        strokeDasharray="1 9"
        strokeLinecap="round"
      />
      {/* The drive time rides along the route, just above the line. */}
      <text dy="-12" style={mono}>
        <textPath href="#route" startOffset="16%">
          {map.drive.toUpperCase()}
        </textPath>
      </text>

      <circle cx="180" cy="120" r="26" fill="#2b2a26" fillOpacity="0.07" />
      <circle cx="180" cy="120" r="6" fill="#2b2a26" />
      <text x="216" y="112" style={{ ...display, fontSize: 32, fill: "#2b2a26" }}>
        {map.kigali}
      </text>

      <circle cx="560" cy="380" r="36" fill="#d9a21b" fillOpacity="0.2" stroke="#d9a21b" strokeOpacity="0.55" />
      <circle cx="560" cy="380" r="6" fill="#7e2f26" />
      <text x="512" y="414" textAnchor="end" style={{ ...display, fontSize: 32, fill: "#2b2a26" }}>
        {map.gashora}
      </text>
    </svg>
  )
}

export function Location() {
  const { eyebrow, title, text, directions, facts } = copy.location
  return (
    <section id="location" aria-labelledby="location-title" className="bg-background py-24 md:py-32">
      <SectionHead id="location-title" eyebrow={eyebrow} title={title} />
      <div className="mx-auto mt-14 grid max-w-7xl gap-10 px-4 md:mt-20 md:px-8 lg:grid-cols-12 lg:items-center lg:gap-8">
        <div className="farm-reveal lg:col-span-7">
          <RouteMap />
        </div>
        <div className="farm-reveal flex flex-col gap-6 lg:col-span-5">
          <p className="text-xl text-pretty">{text}</p>
          <dl className="divide-y border-y">
            {facts.map(([term, value]) => (
              <div key={term} className="grid grid-cols-[8rem_1fr] items-baseline gap-4 py-3">
                <dt className="text-muted-foreground font-mono text-[11px] tracking-[0.18em] uppercase">{term}</dt>
                <dd className="font-display text-xl">{value}</dd>
              </div>
            ))}
          </dl>
          <p className="text-muted-foreground">{directions}</p>
        </div>
      </div>
    </section>
  )
}
