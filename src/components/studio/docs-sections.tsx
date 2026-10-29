import Link from "next/link"

import { Button } from "@/components/ui/button"
import { Figure } from "@/components/docs/figure"
import { D, degC, frw, mm, readCsv, rwf } from "@/components/studio/data"
import totals from "../../../public/designs/studio/data/totals.json"

// The studio's reference sections, moved off /en/studio onto its docs pages (studio-materials, studio-circuits,
// studio-pipes, studio-features; scripts/sync-docs.mjs places them under MDX headings). Every number is the
// generator's, read from public/designs/studio/data on the server.

const FEATURES = [
  { title: "Sleep", text: "A queen bed up to 1.6 × 2.0 m against the wall, with two storage boxes underneath, a bedside table, a reading lamp and USB-C." },
  { title: "Cook", text: "A galley on the bathroom wall: under-counter fridge, two-zone induction hob, sink, drinking-water filter. No gas indoors." },
  { title: "Wash", text: "Shower, WC and basin in one row: a wall-hung WC and the shower behind a door, the basin outside it." },
  { title: "Sit", text: "A seating room: a two-seat sofa, a low wide table and two chairs, by the 3 m sliding glass wall onto the deck." },
  { title: "Roof", text: "An open roof terrace with lounge chairs behind a timber-topped rail, up a steel stair; a canopy shades the deck." },
  { title: "Stay cool", text: "The roof deck shades the steel, foam is sprayed onto it inside, a wall fan moves the air, and the AC is ready." },
]

const STEPS = [
  { n: "1", title: "Measure", text: "Survey the container; the model regenerates every drawing from the real numbers." },
  { n: "2", title: "Cut in Kigali", text: "A Gisozi workshop rips and crosscuts sheets on a panel saw, following the cutting diagrams." },
  { n: "3", title: "Drill and number", text: "Holes on the 32 mm grid from 1:1 templates; every part labelled, like K3-H-07." },
  { n: "4", title: "Pack flat", text: "Every kit packed flat, bundles under 25 kg, hardware in bags A to L." },
  { n: "5", title: "Assemble", text: "Two people, one tool set, 27 wordless steps, from insulation to the roof terrace." },
]

const POINT_GROUP: Record<string, string> = {
  db: "Board and protection", light: "Lights", switch: "Switches", usb: "Sockets and outlets",
  socket: "Sockets and outlets", outlet: "Sockets and outlets", fan: "Fans", inlet: "Board and protection",
  alarm: "Alarms", earth: "Earthing and bonding",
}
const ELEC_GROUPS = ["Board and protection", "Earthing and bonding", "Cable and conduit", "Lights", "Switches",
  "Sockets and outlets", "Fans", "Alarms", "Appliances", "Labour"]

type BomLine = { item: string; qty: number; unit: string; price: number; total: number; label: string }
type BomGroup = { name: string; lines: BomLine[]; total: number }
type BomSection = { name: string; groups: BomGroup[]; total: number; lines: number }

const bomLine = (r: Record<string, string>, item = r.item): BomLine => ({
  item, qty: Number(r.qty_per_unit), unit: r.unit, price: Number(r.unit_price_rwf), total: Number(r.total_per_unit_rwf), label: r.label,
})

const tally = (groups: Map<string, BomLine[]>): BomGroup[] =>
  [...groups].filter(([, l]) => l.length).map(([name, lines]) => ({ name, lines, total: lines.reduce((n, l) => n + l.total, 0) }))

// The electrician's lines, sorted into the groups an electrician buys by.
function electricalGroups(rows: Record<string, string>[], points: Record<string, string>[]) {
  const kindOf = new Map(points.map((p) => [p.description, p.kind]))
  const groups = new Map<string, BomLine[]>(ELEC_GROUPS.map((g) => [g, []]))
  for (const r of rows) {
    const kind = kindOf.get(r.item)
    const group = r.category === "labour" ? "Labour"
      : r.category === "appliances" ? "Appliances"
      : r.category === "safety" ? "Alarms"
      : /earth|bonding/i.test(r.item) ? "Earthing and bonding"
      : /cable|conduit/i.test(r.item) ? "Cable and conduit"
      : kind ? POINT_GROUP[kind]
      : /light|LED/i.test(r.item) ? "Lights"
      : "Board and protection"
    groups.get(group)!.push(bomLine(r, r.item.replace(/^Cable ([\d.]+) mm2 T\+E\/singles in conduit, /, "Cable $1 mm², ")))
  }
  return tally(groups)
}

const PLUMB_GROUPS = ["Sanitaryware", "Hot water", "Supply pipe", "Drain and vent pipe", "Valves and fittings",
  "Drinking water", "Labour"]

// The plumber's lines, sorted the same way: what is fixed to the wall, then what runs behind it.
function plumbingGroups(rows: Record<string, string>[]) {
  const groups = new Map<string, BomLine[]>(PLUMB_GROUPS.map((g) => [g, []]))
  for (const r of rows) {
    const group = r.category === "labour" ? "Labour"
      : r.category === "sanitaryware" ? "Sanitaryware"
      : /heater|hand-shower/i.test(r.item) ? "Hot water"
      : /^PPR/.test(r.item) ? "Supply pipe"
      : /^uPVC/.test(r.item) ? "Drain and vent pipe"
      : /drinking/i.test(r.item) ? "Drinking water"
      : "Valves and fittings"
    groups.get(group)!.push(bomLine(r, degC(r.item)))
  }
  return tally(groups)
}

// A section's lines by what they are (the BOM's categories), labour last.
function categoryGroups(rows: Record<string, string>[]) {
  const groups = new Map<string, BomLine[]>()
  for (const r of [...rows].sort((a, b) => Number(a.category === "labour") - Number(b.category === "labour"))) {
    const name = r.category === "plumbing" ? "Water" : r.category[0].toUpperCase() + r.category.slice(1)
    groups.set(name, [...(groups.get(name) ?? []), bomLine(r, degC(r.item))])
  }
  return tally(groups)
}

// The bill of materials for one studio, grouped by the sections of this page in their order: each line goes with
// the section that shows its kit. The bathroom's wet walls and vinyl go with the floor and wall lining, as the Wall
// and Floor sections build them; the frame's bonding goes with the electrics; then what no section shows (the
// boards and hardware every kit is cut from, the steel and glazing, the roof terrace) and the labour.
const SECTIONS: [string, string][] = [["lining", "Floor and wall lining"], ["bed", "Bed"], ["seating", "Seating"],
  ["galley", "Galley"], ["bath", "Bath"], ["kits", "Boards, edging and hardware"], ["electric", "Electric"],
  ["plumbing", "Plumbing"], ["steel", "Steel, window and doors"], ["roof", "Roof terrace, canopy and stair"],
  ["labour", "Labour and transport"]]
const KIT_SECTION: Record<string, string> = { K1: "lining", K2: "bath", K3: "galley", K4: "bed", K5: "bed", K6: "seating",
  K7: "kits", "K1-K7": "kits", "K2-K7": "kits", K8: "electric", K9: "plumbing", K10: "steel", K11: "roof", labour: "labour" }
const sectionOf = (r: Record<string, string>) => (r.kit === "K2" && /wet walls|timber/.test(r.category)) || /vinyl/i.test(r.item)
  ? "lining" : r.category === "electrical" ? "electric" : KIT_SECTION[r.kit] ?? "kits"
function studioBom(points: Record<string, string>[]): BomSection[] {
  const parts = new Map<string, Record<string, string>[]>(SECTIONS.map(([k]) => [k, []]))
  for (const r of readCsv("bom.csv")) parts.get(sectionOf(r))!.push(r)
  const name = Object.fromEntries(SECTIONS)
  return [...parts].filter(([, rows]) => rows.length).map(([k, rows]) => {
    const groups = k === "electric" ? electricalGroups(rows, points) : k === "plumbing" ? plumbingGroups(rows) : categoryGroups(rows)
    return { name: name[k], groups, total: groups.reduce((n, g) => n + g.total, 0), lines: rows.length }
  })
}

// A row per section with its total, opening onto its lines; then the contingency and the studio's total, the
// generator's own (bom-summary.csv). Native <details>, so it needs no script.
function BomTable({ sections, contingency, total }: { sections: BomSection[]; contingency: { label: string; rwf: number }; total: number }) {
  return (
    <div className="mt-6 overflow-hidden rounded-xl border">
      {sections.map((t) => (
        <details key={t.name} className="group border-b">
          <summary className="hover:bg-muted/40 flex cursor-pointer list-none items-center gap-3 px-4 py-3 [&::-webkit-details-marker]:hidden">
            <svg viewBox="0 0 24 24" className="text-muted-foreground size-4 shrink-0 transition-transform group-open:rotate-90 rtl:-scale-x-100"
              fill="none" stroke="currentColor" strokeWidth={2.25} strokeLinecap="round" strokeLinejoin="round" aria-hidden>
              <path d="M9 18l6-6-6-6" />
            </svg>
            <span className="font-semibold">{t.name}</span>
            <span className="text-muted-foreground text-sm">{t.lines} {t.lines === 1 ? "line" : "lines"}</span>
            <span className="ms-auto font-semibold tabular-nums">{frw(t.total)}</span>
          </summary>
          <div className="overflow-x-auto border-t">
            <table className="w-full text-sm">
              <thead className="text-muted-foreground bg-muted/40">
                <tr>
                  <th className="px-3 py-2 ps-11 text-start font-medium">Item</th>
                  <th className="px-3 py-2 text-end font-medium">Qty</th>
                  <th className="px-3 py-2 text-end font-medium whitespace-nowrap">Unit price (RWF)</th>
                  <th className="px-4 py-2 text-end font-medium whitespace-nowrap">Total (RWF)</th>
                </tr>
              </thead>
              {t.groups.map((g) => (
                <tbody key={g.name}>
                  {t.groups.length > 1 ? (
                    <tr className="border-t bg-muted/20">
                      <th colSpan={3} className="px-3 py-2 ps-11 text-start font-medium">{g.name}</th>
                      <td className="text-muted-foreground px-4 py-2 text-end tabular-nums">{frw(g.total)}</td>
                    </tr>
                  ) : null}
                  {g.lines.map((l, i) => (
                    <tr key={`${l.item}-${i}`} className="border-t">
                      <td className="px-3 py-2 ps-11">{l.item}</td>
                      <td className="px-3 py-2 text-end whitespace-nowrap tabular-nums">{l.qty} {l.unit === "each" ? "" : l.unit}</td>
                      <td className="text-muted-foreground px-3 py-2 text-end tabular-nums">{frw(l.price)}</td>
                      <td className="px-4 py-2 text-end tabular-nums">{frw(l.total)}</td>
                    </tr>
                  ))}
                </tbody>
              ))}
            </table>
          </div>
        </details>
      ))}
      <div className="bg-muted/20 flex px-4 py-2.5 text-sm">
        <span>Materials and labour</span>
        <span className="ms-auto tabular-nums">{frw(sections.reduce((n, t) => n + t.total, 0))}</span>
      </div>
      <div className="flex border-t px-4 py-2.5 text-sm">
        <span>{contingency.label}</span>
        <span className="ms-auto tabular-nums">{frw(contingency.rwf)}</span>
      </div>
      <div className="flex border-t-2 px-4 py-3 font-semibold">
        <span>One studio</span>
        <span className="ms-auto tabular-nums">{frw(total)}</span>
      </div>
    </div>
  )
}

const KIND: Record<string, string> = { usb: "socket + USB-C", db: "board", inlet: "power inlet", earth: "earth rod" }
const FIT_KIND: Record<string, string> = { wc: "WC", site: "on the site" }

const points = () => readCsv("points.csv")

export function StudioBom(): React.JSX.Element {
  const summary = readCsv("bom-summary.csv")
  const extra = summary.find((r) => r.category.startsWith("contingency"))!
  const contingency = { label: extra.category[0].toUpperCase() + extra.category.slice(1), rwf: Number(extra.per_unit_rwf) }
  const total = Number(summary.find((r) => r.category === "TOTAL")!.per_unit_rwf)
  return (
    <>
      <p className="text-muted-foreground">
        About {rwf(total)} with a 15 % contingency, in the order of the studio page. Open a section for its lines.
        Prices are placeholders until three quotes come in for each line.
      </p>
      <BomTable sections={studioBom(points())} contingency={contingency} total={total} />
    </>
  )
}

export function StudioShared(): React.JSX.Element {
  const water = Object.fromEntries(readCsv("site-water.csv").map((r) => [r.item, r.value]))
  const shared = readCsv("shared-works.csv").filter((w) => !/site board|REG/i.test(w.item))
  return (
    <>
      <p className="text-muted-foreground">
        WASAC water, the borehole and rain from the canopies fill the farm&rsquo;s {water.tank_m3} m³ tank, about four
        days at {mm(Number(water.daily_L))} L a day for {water.persons} guests, and a booster pump sends{" "}
        {water.pump_lpm} L/min to the studios. WCs, showers and basins drain to a new {water.septic_m3} m³ septic tank
        in two chambers ({water.chamber1_m3} + {water.chamber2_m3} m³); kitchen sinks drain to their own grease trap.
      </p>
      <Figure src={`${D}/drawings/p-301.svg`} caption="P-301 · Site water and sanitation schematic" />
      <div className="overflow-x-auto rounded-xl border">
        <table className="w-full text-sm">
          <tbody>
            {shared.map((w) => (
              <tr key={w.item} className="border-t first:border-0">
                <td className="px-3 py-2">{w.item}</td>
                <td className="px-3 py-2 text-end tabular-nums">{frw(Number(w.rwf))}</td>
              </tr>
            ))}
          </tbody>
          <tfoot>
            <tr className="border-t-2">
              <th className="px-3 py-3 text-start font-semibold">Water and sanitation, once for the site</th>
              <td className="px-3 py-3 text-end font-semibold tabular-nums">
                {frw(shared.reduce((n, w) => n + Number(w.rwf), 0))}
              </td>
            </tr>
          </tfoot>
        </table>
      </div>
      <p className="text-muted-foreground mt-3 text-sm">
        Full list: <a href={`${D}/data/bom.xlsx`} download className="underline underline-offset-4">bom.xlsx</a>
        {["bom.csv", "circuits.csv", "points.csv", "pipes.csv", "fittings.csv", "site-water.csv"].map((f) => (
          <span key={f}>{" · "}<a href={`${D}/data/${f}`} download className="underline underline-offset-4">{f}</a></span>
        ))}
      </p>
    </>
  )
}

export function StudioCircuits(): React.JSX.Element {
  const circuits = readCsv("circuits.csv")
  return (
    <>
      <p className="text-muted-foreground">
        Each circuit is checked by the model: its current fits the breaker, the breaker fits the cable, and the
        voltage drop stays under 3 % for lights and 5 % for the rest.
      </p>
      <div className="mt-6 overflow-x-auto rounded-xl border">
        <table className="w-full text-sm">
          <thead className="text-muted-foreground bg-muted/40">
            <tr>
              {["Circuit", "Serves", "Breaker", "Cable", "Design current", "Run", "Voltage drop", "Points"].map((h) => (
                <th key={h} className="px-3 py-2 text-start font-medium whitespace-nowrap">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {circuits.map((c) => (
              <tr key={c.circuit} className="border-t">
                <td className="px-3 py-2 font-medium">{c.circuit}</td>
                <td className="px-3 py-2">{c.serves}</td>
                <td className="px-3 py-2 tabular-nums">{c.device}</td>
                <td className="px-3 py-2 whitespace-nowrap tabular-nums">{c.cable_mm2} mm²</td>
                <td className="px-3 py-2 tabular-nums">{c.design_A ? `${c.design_A} A` : "–"}</td>
                <td className="px-3 py-2 tabular-nums">{c.run_m ? `${c.run_m} m` : "–"}</td>
                <td className="px-3 py-2 tabular-nums">{c.drop_pct ? `${c.drop_pct} %` : "–"}</td>
                <td className="text-muted-foreground px-3 py-2">{c.points || "spare"}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <Figure src={`${D}/drawings/e-202.svg`} caption="E-202 · Circuit schedule, earthing and bonding" />
    </>
  )
}

// Each row's id (pt-L1, pt-S1…) is where a tag on /en/studio's electrical drawing links.
export function StudioElectricPoints(): React.JSX.Element {
  const pts = points()
  return (
    <>
      <p className="text-muted-foreground">
        {pts.length} points on the plan. The bathroom has an IP65 light, an IPX4 extract fan and no sockets,
        switched from outside the door.
      </p>
      <Figure src={`${D}/drawings/e-101.svg`} caption="E-101 · Electrical layout plan" />
      <div className="overflow-x-auto rounded-xl border">
        <table className="w-full text-sm">
          <thead className="text-muted-foreground bg-muted/40">
            <tr>
              {["Point", "What", "Type", "Circuit", "Height", "Load"].map((h) => (
                <th key={h} className="px-3 py-2 text-start font-medium whitespace-nowrap">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {pts.map((p) => (
              <tr key={p.point} id={`pt-${p.point}`} className="target:bg-muted scroll-mt-24 border-t">
                <td className="px-3 py-2 font-medium">{p.point}</td>
                <td className="px-3 py-2">{p.description}</td>
                <td className="text-muted-foreground px-3 py-2">{KIND[p.kind] ?? p.kind}</td>
                <td className="px-3 py-2">{p.circuit || "–"}</td>
                <td className="px-3 py-2 whitespace-nowrap tabular-nums">{mm(Number(p.z_mm))} mm</td>
                <td className="px-3 py-2 whitespace-nowrap tabular-nums">{Number(p.watts) ? `${mm(Number(p.watts))} W` : "–"}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  )
}

export function StudioPipes(): React.JSX.Element {
  const pipes = readCsv("pipes.csv")
  return (
    <>
      <p className="text-muted-foreground">
        Each run is checked by the model: every leg runs along a wall or straight up or down, each drain falls at least
        1:40.
      </p>
      <div className="mt-6 overflow-x-auto rounded-xl border">
        <table className="w-full text-sm">
          <thead className="text-muted-foreground bg-muted/40">
            <tr>
              {["Run", "System", "Size", "Length", "Fall", "What it does"].map((h) => (
                <th key={h} className="px-3 py-2 text-start font-medium whitespace-nowrap">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {pipes.map((p) => (
              <tr key={p.run} className="border-t">
                <td className="px-3 py-2 font-medium whitespace-nowrap">
                  <span className="me-2 inline-block size-2 rounded-full" style={{ background: p.colour }} />{p.run}
                </td>
                <td className="px-3 py-2">{p.system}</td>
                <td className="px-3 py-2 whitespace-nowrap tabular-nums">DN{p.dn}</td>
                <td className="px-3 py-2 whitespace-nowrap tabular-nums">{p.length_m} m</td>
                <td className="px-3 py-2 tabular-nums">{p.fall || "–"}</td>
                <td className="text-muted-foreground px-3 py-2">{degC(p.note)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <Figure src={`${D}/drawings/p-201.svg`} caption="P-201 · Pipework isometric (unit)" />
    </>
  )
}

// Each row's id (pt-SV, pt-WH…) is where a tag on /en/studio's plumbing drawing links.
export function StudioFittings(): React.JSX.Element {
  const fittings = readCsv("fittings.csv")
  return (
    <>
      <p className="text-muted-foreground">
        {fittings.length} points, from the stop valve on the main to the vent above the roof. The sink, the heater, the
        shower, the WC and the basin sit within about 1.5 m of each other, so the pipes stay short.
      </p>
      <Figure src={`${D}/drawings/p-101.svg`} caption="P-101 · Plumbing layout plan (supply and drainage)" />
      <div className="overflow-x-auto rounded-xl border">
        <table className="w-full text-sm">
          <thead className="text-muted-foreground bg-muted/40">
            <tr>
              {["Point", "What", "Type", "Pipes", "Height", "Rating"].map((h) => (
                <th key={h} className="px-3 py-2 text-start font-medium whitespace-nowrap">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {fittings.map((f) => (
              <tr key={f.point} id={`pt-${f.point}`} className="target:bg-muted scroll-mt-24 border-t">
                <td className="px-3 py-2 font-medium">{f.point}</td>
                <td className="px-3 py-2">{f.description}</td>
                <td className="text-muted-foreground px-3 py-2">{FIT_KIND[f.kind] ?? f.kind}</td>
                <td className="px-3 py-2 whitespace-nowrap">{f.runs}</td>
                <td className="px-3 py-2 whitespace-nowrap tabular-nums">{mm(Number(f.z_mm)).replace("-", "−")} mm</td>
                <td className="px-3 py-2 whitespace-nowrap">{degC(f.rating)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  )
}

export function StudioFeatures(): React.JSX.Element {
  return (
    <div className="mt-6 grid gap-4 sm:grid-cols-2">
      {FEATURES.map((f) => (
        <div key={f.title} className="rounded-xl border p-5">
          <h3 className="font-medium">{f.title}</h3>
          <p className="text-muted-foreground mt-2 text-sm leading-relaxed">{f.text}</p>
        </div>
      ))}
    </div>
  )
}

export function StudioSteps(): React.JSX.Element {
  return (
    <ol className="mt-6 grid gap-4 sm:grid-cols-2">
      {STEPS.map((s) => (
        <li key={s.n} className="rounded-xl border p-4">
          <div className="bg-primary text-primary-foreground flex size-8 items-center justify-center rounded-full text-sm font-semibold">
            {s.n}
          </div>
          <h3 className="mt-3 font-medium">{s.title}</h3>
          <p className="text-muted-foreground mt-1 text-sm leading-relaxed">{s.text}</p>
        </li>
      ))}
    </ol>
  )
}

export function StudioDownloads(): React.JSX.Element {
  return (
    <ul className="mt-4 space-y-2">
      {[
        ["A3 drawing set (PDF)", `${D}/pdf/studio-drawing-set-A3.pdf`],
        ["A4 assembly manual (PDF)", `${D}/pdf/studio-assembly-manual-A4.pdf`],
        ["1:1 drilling templates (PDF)", `${D}/pdf/studio-drilling-templates-1to1.pdf`],
        ["Bill of materials (XLSX)", `${D}/data/bom.xlsx`],
        ["Cut list (CSV)", `${D}/data/cut-list.csv`],
        ["3D model (GLB)", `${D}/model/studio.glb`],
      ].map(([l, h]) => (
        <li key={h}>
          <a href={h} download className="font-medium underline underline-offset-4">{l}</a>
        </li>
      ))}
    </ul>
  )
}

export function StudioStatus(): React.JSX.Element {
  return (
    <>
      <p className="text-muted-foreground">
        Preliminary. Openings are scaled from a photo, so nothing is cut until the container is measured.
        Prices are placeholders until three quotes per line: about {rwf(totals.unit_with_contingency)} for the
        studio, before the farm&rsquo;s shared septic, water and power works. A structural engineer signs the
        roof terrace before guests use it.
      </p>
      <Button asChild variant="outline" className="mt-4">
        <Link href="/docs/studio-site">See the survey sheet</Link>
      </Button>
    </>
  )
}
