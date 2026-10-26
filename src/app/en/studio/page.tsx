import { readFileSync } from "node:fs"
import { join } from "node:path"
import type { Metadata } from "next"
import Link from "next/link"

import { Button } from "@/components/ui/button"
import { Figure } from "@/components/docs/figure"
import { StudioViewer } from "@/components/docs/studio-viewer"
import model from "../../../../public/designs/studio/model/parts.json"
import plan from "../../../../public/designs/studio/render/plan.json"
import totals from "../../../../public/designs/studio/data/totals.json"

// Public showcase of the container-studio design package (study/studio, D-014..D-016).
// Every number here comes from the generated package; the docs hold the evidence.

export const metadata: Metadata = {
  title: "The studio · Farm",
  description:
    "A farm-stay guest studio in a 20 ft container near Kigali, built IKEA-style from flat-pack parts made in Kigali.",
}

const D = "/designs/studio"
const rwf = (n: number) => `RWF ${(n / 1e6).toFixed(1)}M`

const FEATURES = [
  { title: "Sleep", text: "Queen bed up to 1.6 × 2.0 m across the quiet end, with open shelves either side of the headboard, reading lights and USB-C." },
  { title: "Cook", text: "A galley on the bathroom wall: under-counter fridge, two-zone induction hob, sink, drinking-water filter. No gas indoors." },
  { title: "Wash", text: "A 1.2 m walk-in shower, WC and basin. Hot water from an 80 L heater through a thermostatic mixer." },
  { title: "Sit", text: "A seating room: a two-seat sofa, a table and two chairs, by the 3 m sliding glass wall onto the deck." },
  { title: "Roof", text: "An open roof terrace with lounge chairs behind a timber-topped rail, up a steel stair; a canopy shades the deck." },
  { title: "Stay cool", text: "The roof deck shades the steel, EPS insulation is sealed to it, a wall fan moves the air, and the AC is ready." },
]

const STEPS = [
  { n: "1", title: "Measure", text: "Survey the container; the model regenerates every drawing from the real numbers." },
  { n: "2", title: "Cut in Kigali", text: "A Gisozi workshop rips and crosscuts sheets on a panel saw, following the cutting diagrams." },
  { n: "3", title: "Drill and number", text: "Holes on the 32 mm grid from 1:1 templates; every part labelled, like K3-H-07." },
  { n: "4", title: "Pack flat", text: "Every kit packed flat, bundles under 25 kg, hardware in bags A to L." },
  { n: "5", title: "Assemble", text: "Two people, one tool set, 27 wordless steps, from insulation to the roof terrace." },
]

// 2D: the plan first, then the sheets that explain it.
const PLANS = [
  ["a-201", "Interior elevations: back wall and front wall"],
  ["a-202", "End elevations and cross-section"],
  ["s-101", "Roof terrace, deck canopy and stair"],
  ["a-401", "Wall, roof and floor build-up"],
  ["e-101", "Electrical layout"],
  ["p-101", "Plumbing: supply and drainage"],
]

// The sheet that shows each kit best: the exploded joinery drawings, or the services and build-up sheets.
const KIT_SHEET: Record<string, string> = {
  K1: "j-101", K2: "j-102", K3: "j-103", K4: "j-104", K5: "j-105", K6: "j-106",
  K7: "j-107", K8: "e-101", K9: "p-201", K10: "a-401", K11: "j-108",
}

const MATERIAL: Record<string, string> = {
  PLY12: "12 mm ply", PLY18: "18 mm board", MPLY18: "18 mm marine ply", WTOP38: "38 mm worktop",
  STEEL: "steel", TIMBER: "hardwood", POLY: "polycarbonate", MESH: "steel mesh", STAIRFRAME: "steel",
  white: "fitting", electric: "electrical", eps: "EPS foam", tile: "tiled board", base: "steel",
}

type Kit = { id: string; name: string; trade: string; where: string; bought: number }
type Piece = { name: string; qty: number; size: string; material: string }

// The generator's CSVs: plain commas, quotes only around fields that hold one.
function readCsv(file: string): Record<string, string>[] {
  const [head, ...lines] = readFileSync(join(process.cwd(), "public/designs/studio/data", file), "utf8").trim().split("\n")
  const cells = (line: string) => [...line.matchAll(/("[^"]*"|[^,]*)(,|$)/g)].slice(0, -1).map((m) => m[1].replace(/^"|"$/g, ""))
  const keys = cells(head)
  return lines.map((l) => Object.fromEntries(cells(l).map((v, i) => [keys[i], v])))
}

function readKits(): Kit[] {
  return readCsv("kits.csv").map((r) => ({ id: r.kit, name: r.name, trade: r.trade, where: r.made_where, bought: Number(r.bought_lines) }))
}

const POINT_GROUP: Record<string, string> = {
  db: "Board and protection", light: "Lights", switch: "Switches", usb: "Sockets and outlets",
  socket: "Sockets and outlets", outlet: "Sockets and outlets", fan: "Fans",
}
const BOM_GROUPS = ["Board and protection", "Earthing and bonding", "Cable and conduit", "Lights", "Switches",
  "Sockets and outlets", "Fans", "Alarms", "Appliances", "Labour"]

type BomLine = { item: string; qty: number; unit: string; price: number; total: number; label: string }
type BomGroup = { name: string; lines: BomLine[]; total: number }

const bomLine = (r: Record<string, string>, item = r.item): BomLine => ({
  item, qty: Number(r.qty_per_unit), unit: r.unit, price: Number(r.unit_price_rwf), total: Number(r.total_per_unit_rwf), label: r.label,
})

const tally = (groups: Map<string, BomLine[]>): BomGroup[] =>
  [...groups].filter(([, l]) => l.length).map(([name, lines]) => ({ name, lines, total: lines.reduce((n, l) => n + l.total, 0) }))

// Every electrical line of the BOM, sorted into the groups an electrician buys by.
function electricalBom(points: Record<string, string>[]) {
  const kindOf = new Map(points.map((p) => [p.description, p.kind]))
  const groups = new Map<string, BomLine[]>(BOM_GROUPS.map((g) => [g, []]))
  for (const r of readCsv("bom.csv")) {
    const electrician = r.category === "labour" && r.item.startsWith("Electrician")
    if (r.trade !== "electrical" && !electrician) continue
    const kind = kindOf.get(r.item)
    const group = electrician ? "Labour"
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

const frw = (n: number) => n.toLocaleString("en-US")

const PLUMB_GROUPS = ["Sanitaryware", "Hot water", "Supply pipe", "Drain and vent pipe", "Valves and fittings",
  "Drinking water", "Labour"]

// Every plumbing line of the BOM, sorted the same way: what is fixed to the wall, then what runs behind it.
function plumbingBom() {
  const groups = new Map<string, BomLine[]>(PLUMB_GROUPS.map((g) => [g, []]))
  for (const r of readCsv("bom.csv")) {
    const plumber = r.category === "labour" && r.item.startsWith("Plumber")
    if (r.trade !== "plumbing" && !plumber) continue
    const group = plumber ? "Labour"
      : r.category === "sanitaryware" ? "Sanitaryware"
      : /heater|thermostatic/i.test(r.item) ? "Hot water"
      : /^PPR/.test(r.item) ? "Supply pipe"
      : /^uPVC/.test(r.item) ? "Drain and vent pipe"
      : /drinking/i.test(r.item) ? "Drinking water"
      : "Valves and fittings"
    groups.get(group)!.push(bomLine(r))
  }
  return tally(groups)
}

function BomTable({ groups, total, label }: { groups: BomGroup[]; total: number; label: string }) {
  return (
    <div className="mt-6 overflow-x-auto rounded-xl border">
      <table className="w-full text-sm">
        <thead className="text-muted-foreground bg-muted/40">
          <tr>
            <th className="px-3 py-2 text-start font-medium">Item</th>
            <th className="px-3 py-2 text-end font-medium">Qty</th>
            <th className="px-3 py-2 text-end font-medium whitespace-nowrap">Unit price (RWF)</th>
            <th className="px-3 py-2 text-end font-medium whitespace-nowrap">Total (RWF)</th>
          </tr>
        </thead>
        {groups.map((g) => (
          <tbody key={g.name}>
            <tr className="border-t bg-muted/20">
              <th colSpan={3} className="px-3 py-2 text-start font-semibold">{g.name}</th>
              <td className="px-3 py-2 text-end font-semibold tabular-nums">{frw(g.total)}</td>
            </tr>
            {g.lines.map((l, i) => (
              <tr key={`${l.item}-${i}`} className="border-t">
                <td className="px-3 py-2 ps-6">{l.item}</td>
                <td className="px-3 py-2 text-end whitespace-nowrap tabular-nums">{l.qty} {l.unit === "each" ? "" : l.unit}</td>
                <td className="text-muted-foreground px-3 py-2 text-end tabular-nums">{frw(l.price)}</td>
                <td className="px-3 py-2 text-end tabular-nums">{frw(l.total)}</td>
              </tr>
            ))}
          </tbody>
        ))}
        <tfoot>
          <tr className="border-t-2">
            <th colSpan={3} className="px-3 py-3 text-start font-semibold">{label}</th>
            <td className="px-3 py-3 text-end font-semibold tabular-nums">{frw(total)}</td>
          </tr>
        </tfoot>
      </table>
    </div>
  )
}

const mm = (n: number) => n.toLocaleString("en-US")

// Collapse numbered copies ("Stair tread 5", "Joist RHS 80x40x3") into one row with a count.
function piecesOf(kit: string): Piece[] {
  const rows = new Map<string, Piece>()
  for (const p of model.parts.filter((p) => p.kit === kit)) {
    const name = p.name.replace(/\s*\([^)]*\)/g, "").replace(/ \d{1,2}$/, "").trim()
    const size = [...p.size].sort((a, b) => b - a).map(mm).join(" × ")
    const row = rows.get(name)
    if (row) {
      row.qty += 1
      if (row.size !== size) row.size = "varies"
    } else {
      rows.set(name, { name, qty: 1, size, material: MATERIAL[p.material] ?? p.material })
    }
  }
  return [...rows.values()]
}

export default function StudioPage() {
  const sheets = Object.values(totals.sheets as Record<string, number>).reduce((a, b) => a + b, 0)
  const kits = readKits()
  const circuits = readCsv("circuits.csv")
  const demand = Object.fromEntries(readCsv("demand.csv").map((r) => [r.item, r.amps]))
  const points = readCsv("points.csv")
  const bom = electricalBom(points)
  const bomTotal = bom.reduce((n, g) => n + g.total, 0)
  const pipes = readCsv("pipes.csv")
  const water = Object.fromEntries(readCsv("site-water.csv").map((r) => [r.item, r.value]))
  const shared = readCsv("shared-works.csv").filter((w) => !/site board|REG/i.test(w.item))
  const plumbing = plumbingBom()
  const plumbingTotal = plumbing.reduce((n, g) => n + g.total, 0)
  const pieces = Object.fromEntries(kits.map((k) => [k.id, piecesOf(k.id)]))
  return (
    <main className="w-full flex-1">
      {/* First screen: a photoreal concept render of the finished studio (D-018), made in Nano Banana from the
          site footage and studio-exterior.jpg, the model render from studio.glb that the docs keep using. */}
      <section className="relative h-svh min-h-[520px] w-full overflow-hidden bg-[#a9c8df]">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={`${D}/render/studio-hero.jpg`} width={2400} height={1340} fetchPriority="high"
          alt="A finished container studio at golden hour: a sliding glass wall open onto a timber deck with red railings, a kitchenette and bed inside, a steel stair to lounge chairs on the roof, and eucalyptus behind."
          className="absolute inset-0 size-full object-cover object-[50%_55%]" />
        {/* D-018: an AI image is always labelled as a concept render. */}
        <span className="absolute end-4 bottom-4 z-10 rounded-full bg-black/40 px-2.5 py-1 text-xs text-white/85 backdrop-blur md:end-10">
          Concept render
        </span>
        <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/70 via-black/35 to-transparent">
          <div className="w-full px-4 pt-24 pb-10 md:px-10 md:pb-14">
            <p className="text-sm text-white/80">Digital Farm</p>
            <h1 className="mt-3 max-w-2xl text-4xl font-semibold tracking-tight text-balance text-white md:text-6xl">
              A studio in nature, with forest vibes
            </h1>
            <Button asChild className="mt-6">
              <Link href="/#enquire">Book</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* 2D, full screen: the furniture plan fills the first screen, the sheets behind it follow. */}
      <section id="plans">
        <div className="flex flex-col px-4 pt-10 pb-6 md:px-10 lg:h-svh lg:min-h-[560px]">
          <h2 className="text-3xl font-semibold tracking-tight">2D</h2>
          {/* The simplified plan (render/plan.svg, black on transparent; inverted in dark mode) and the
              few sizes that matter (render/plan.json), both written by the generator. */}
          <div className="mt-6 grid min-h-0 flex-1 items-center gap-10 lg:grid-cols-[2fr_1fr]">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={`${D}/render/plan.svg`} alt="Plan: the bed at one end, a sofa with a table and two chairs, the galley on the bathroom wall, and the bathroom with shower, WC and basin at the other end."
              className="w-full object-contain lg:max-h-full dark:invert" />
            <div className="text-sm">
            <dl className="divide-y">
              {[
                ["Inside", plan.inside],
                ["Floor", plan.floor],
                ["Ceiling", plan.height],
                ["Bed", plan.bed],
                ["Galley", plan.galley],
                ["Shower", plan.shower],
              ].map(([k, v]) => (
                <div key={k} className="flex justify-between gap-4 py-2.5">
                  <dt className="text-muted-foreground">{k}</dt>
                  <dd className="tabular-nums">{v}</dd>
                </div>
              ))}
            </dl>
            <p className="text-muted-foreground border-t pt-3">
              {plan.passed === plan.checks ? `All ${plan.checks} layout checks pass.` : `${plan.passed} of ${plan.checks} layout checks pass.`}
            </p>
            </div>
          </div>
        </div>
        <div className="px-4 pb-6 md:px-10">
          <div className="grid grid-cols-2 gap-px overflow-hidden rounded-xl border bg-border md:grid-cols-4">
            {[
              ["13.1 m²", "net floor"],
              ["11 kits", `${sheets} sheets of board`],
              [`${readCsv("drawings.csv").length} sheets`, "drawings, generated"],
              [rwf(totals.unit_with_contingency), "the studio, placeholder prices"],
            ].map(([v, l]) => (
              <div key={l} className="bg-background p-5">
                <div className="text-2xl font-semibold tracking-tight">{v}</div>
                <div className="text-muted-foreground mt-1 text-sm">{l}</div>
              </div>
            ))}
          </div>
          <div className="mt-4 grid gap-x-6 md:grid-cols-2 xl:grid-cols-3">
            {PLANS.map(([id, title]) => (
              <Figure key={id} src={`${D}/drawings/${id}.svg`} caption={`${id.toUpperCase()} · ${title}`} />
            ))}
          </div>
        </div>
      </section>

      <div className="mx-auto w-full max-w-5xl px-4 pb-12 md:px-6 md:pb-16">
      {/* 3D: the furnished cutaway, then the live model. */}
      <section id="model" className="mt-16 scroll-mt-20">
        <p className="text-muted-foreground text-sm font-medium">3D</p>
        <h2 className="mt-1 text-3xl font-semibold tracking-tight">The studio in 3D</h2>
        <p className="text-muted-foreground mt-3 max-w-3xl text-lg text-balance">
          The same model draws every sheet above. Switch layers, pull the kits apart, replay the assembly step by
          step, and tap a part to see its number.
        </p>
        <div className="mt-6 overflow-hidden rounded-xl border">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={`${D}/render/studio-cutaway.jpg`} width={1600} height={1000} loading="lazy"
            alt="Cutaway with the roof and front wall removed: queen bed, kitchen with induction hob and sink, table and stools, and the bathroom with a walk-in shower."
            className="h-auto w-full" />
        </div>
        <StudioViewer src={`${D}/model/studio.glb`} parts={`${D}/model/parts.json`} poster={`${D}/model/studio-poster.svg`}
          title="Container studio, Layout B" />
      </section>

      {/* The building blocks: the studio is eleven kits. */}
      <section id="blocks" className="mt-16 scroll-mt-20">
        <p className="text-muted-foreground text-sm font-medium">Building blocks</p>
        <h2 className="mt-1 text-3xl font-semibold tracking-tight">Eleven kits make the studio</h2>
        <p className="text-muted-foreground mt-3 max-w-3xl text-lg text-balance">
          Each kit is packed flat, labelled and handed to one trade.
        </p>
        <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {kits.map((k) => (
            <a key={k.id} href={`#${k.id.toLowerCase()}`} className="group overflow-hidden rounded-xl border transition-colors hover:border-foreground/30">
              <div className="aspect-[4/3] overflow-hidden border-b bg-white p-2">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={`${D}/drawings/${KIT_SHEET[k.id]}.svg`} alt={`${k.id} ${k.name}`} loading="lazy"
                  className="size-full object-contain" />
              </div>
              <div className="p-4">
                <div className="text-muted-foreground text-xs font-medium">{k.id}</div>
                <h3 className="mt-1 font-medium">{k.name}</h3>
                <p className="text-muted-foreground mt-1 text-sm">
                  {pieces[k.id].reduce((n, p) => n + p.qty, 0)} pieces · {k.trade} · {k.where}
                </p>
              </div>
            </a>
          ))}
        </div>
      </section>

      {/* Each block broken into its pieces, straight from the model's part list. */}
      <section id="pieces" className="mt-16 scroll-mt-20">
        <p className="text-muted-foreground text-sm font-medium">Pieces</p>
        <h2 className="mt-1 text-3xl font-semibold tracking-tight">Every kit, piece by piece</h2>
        <p className="text-muted-foreground mt-3 max-w-3xl text-lg text-balance">
          Open a kit to see what is in the box. Sizes are in millimetres, largest first.
        </p>
        <div className="mt-6 divide-y rounded-xl border">
          {kits.map((k) => (
            <details key={k.id} id={k.id.toLowerCase()} className="group scroll-mt-20">
              <summary className="flex cursor-pointer list-none items-center justify-between gap-4 p-4 hover:bg-muted/50">
                <span>
                  <span className="text-muted-foreground me-2 text-sm">{k.id}</span>
                  <span className="font-medium">{k.name}</span>
                </span>
                <span className="text-muted-foreground shrink-0 text-sm">
                  {pieces[k.id].reduce((n, p) => n + p.qty, 0)} pieces
                  <span className="ms-2 inline-block transition-transform group-open:rotate-90">›</span>
                </span>
              </summary>
              <div className="grid gap-6 px-4 pb-6 md:grid-cols-[1fr_1.2fr]">
                <div className="md:sticky md:top-16 md:self-start">
                  <Figure src={`${D}/drawings/${KIT_SHEET[k.id]}.svg`} caption={`${KIT_SHEET[k.id].toUpperCase()} · ${k.name}`} />
                </div>
                <div className="my-6 overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead className="text-muted-foreground text-start">
                      <tr className="border-b">
                        <th className="py-2 pe-3 text-start font-medium">Piece</th>
                        <th className="py-2 pe-3 text-end font-medium">Qty</th>
                        <th className="py-2 pe-3 text-start font-medium">Size</th>
                        <th className="hidden py-2 text-start font-medium sm:table-cell">Material</th>
                      </tr>
                    </thead>
                    <tbody>
                      {pieces[k.id].map((p) => (
                        <tr key={p.name} className="border-b last:border-0">
                          <td className="py-2 pe-3">{p.name}</td>
                          <td className="py-2 pe-3 text-end tabular-nums">{p.qty}</td>
                          <td className="text-muted-foreground py-2 pe-3 whitespace-nowrap tabular-nums">{p.size}</td>
                          <td className="text-muted-foreground hidden py-2 whitespace-nowrap sm:table-cell">{p.material}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                  {k.bought > 0 ? (
                    <p className="text-muted-foreground mt-3 text-sm">
                      Plus {k.bought} bought lines (fixings, fittings, cable, pipe) in the{" "}
                      <a href={`${D}/data/bom.csv`} download className="underline underline-offset-4">bill of materials</a>.
                    </p>
                  ) : null}
                </div>
              </div>
            </details>
          ))}
        </div>
      </section>

      </div>

      {/* Electrical: four full-width sections, from the supply down to every item bought. */}
      <section id="electrical" className="mt-16 scroll-mt-20 border-t bg-muted/40 py-16">
        <div className="mx-auto w-full max-w-7xl px-4 md:px-6">
          <p className="text-muted-foreground text-sm font-medium">Electrical · 1 of 4</p>
          <h2 className="mt-1 text-3xl font-semibold tracking-tight">The power, from the grid to the studio</h2>
          <p className="text-muted-foreground mt-3 max-w-3xl text-lg text-balance">
            The REG grid feeds a site board, which feeds the studio&rsquo;s own board: a 40 A main switch, surge
            protection and a 30 mA RCD over every circuit. The hob and the water heater never run together, which
            keeps the studio near {Math.round(Number(demand.total_A))} A.
          </p>
          <div className="mt-6 grid grid-cols-2 gap-px overflow-hidden rounded-xl border bg-border md:grid-cols-4">
            {[
              [`${demand.total_A} A`, "maximum demand"],
              [`${circuits.length} circuits`, "on one unit board"],
              [`${demand.feeder_mm2} mm²`, "feeder from the site board"],
              [`${demand.feeder_drop_pct} %`, "voltage drop on the feeder"],
            ].map(([v, l]) => (
              <div key={l} className="bg-background p-5">
                <div className="text-2xl font-semibold tracking-tight">{v}</div>
                <div className="text-muted-foreground mt-1 text-sm">{l}</div>
              </div>
            ))}
          </div>
          <Figure src={`${D}/drawings/e-201.svg`} caption="E-201 · Single-line diagram: site and unit board" />
        </div>
      </section>

      <section id="circuits" className="scroll-mt-20 border-t py-16">
        <div className="mx-auto w-full max-w-7xl px-4 md:px-6">
          <p className="text-muted-foreground text-sm font-medium">Electrical · 2 of 4</p>
          <h2 className="mt-1 text-3xl font-semibold tracking-tight">Eight circuits</h2>
          <p className="text-muted-foreground mt-3 max-w-3xl text-lg text-balance">
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
        </div>
      </section>

      <section id="points" className="scroll-mt-20 border-t bg-muted/40 py-16">
        <div className="mx-auto w-full max-w-7xl px-4 md:px-6">
          <p className="text-muted-foreground text-sm font-medium">Electrical · 3 of 4</p>
          <h2 className="mt-1 text-3xl font-semibold tracking-tight">Every light, switch and socket</h2>
          <p className="text-muted-foreground mt-3 max-w-3xl text-lg text-balance">
            {points.length} points on the plan. The bathroom has IP65 lights and no sockets, and its fan is switched
            from outside the door.
          </p>
          <Figure src={`${D}/drawings/e-101.svg`} caption="E-101 · Electrical layout plan" />
          <div className="overflow-x-auto rounded-xl border bg-background">
            <table className="w-full text-sm">
              <thead className="text-muted-foreground bg-muted/40">
                <tr>
                  {["Point", "What", "Type", "Circuit", "Height", "Load"].map((h) => (
                    <th key={h} className="px-3 py-2 text-start font-medium whitespace-nowrap">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {points.map((p) => (
                  <tr key={p.point} className="border-t">
                    <td className="px-3 py-2 font-medium">{p.point}</td>
                    <td className="px-3 py-2">{p.description}</td>
                    <td className="text-muted-foreground px-3 py-2">{p.kind === "usb" ? "socket + USB-C" : p.kind === "db" ? "board" : p.kind}</td>
                    <td className="px-3 py-2">{p.circuit || "–"}</td>
                    <td className="px-3 py-2 whitespace-nowrap tabular-nums">{mm(Number(p.z_mm))} mm</td>
                    <td className="px-3 py-2 whitespace-nowrap tabular-nums">{Number(p.watts) ? `${mm(Number(p.watts))} W` : "–"}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      <section id="bom" className="scroll-mt-20 border-t py-16">
        <div className="mx-auto w-full max-w-7xl px-4 md:px-6">
          <p className="text-muted-foreground text-sm font-medium">Electrical · 4 of 4</p>
          <h2 className="mt-1 text-3xl font-semibold tracking-tight">Bill of materials</h2>
          <p className="text-muted-foreground mt-3 max-w-3xl text-lg text-balance">
            Everything the electrician buys for the studio: about RWF {frw(bomTotal)}. Prices are placeholders until
            three quotes come in for each line.
          </p>
          <BomTable groups={bom} total={bomTotal} label="Electrical, the studio" />
          <p className="text-muted-foreground mt-3 text-sm">
            Full list for every trade: <a href={`${D}/data/bom.xlsx`} download className="underline underline-offset-4">bom.xlsx</a>
            {" · "}<a href={`${D}/data/circuits.csv`} download className="underline underline-offset-4">circuits.csv</a>
            {" · "}<a href={`${D}/data/points.csv`} download className="underline underline-offset-4">points.csv</a>
          </p>
        </div>
      </section>

      {/* Plumbing: four full-width sections, from the tank down to every item bought. */}
      <section id="plumbing" className="scroll-mt-20 border-t bg-muted/40 py-16">
        <div className="mx-auto w-full max-w-7xl px-4 md:px-6">
          <p className="text-muted-foreground text-sm font-medium">Plumbing · 1 of 4</p>
          <h2 className="mt-1 text-3xl font-semibold tracking-tight">Water in, water out</h2>
          <p className="text-muted-foreground mt-3 max-w-3xl text-lg text-balance">
            WASAC water, the borehole and rain from the canopies fill the farm&rsquo;s tank, and a pump sends it to the
            studio. Toilets and showers drain to the farm&rsquo;s new septic tank; kitchen sinks drain to their own grease
            trap.
          </p>
          <div className="mt-6 grid grid-cols-2 gap-px overflow-hidden rounded-xl border bg-border md:grid-cols-4">
            {[
              [`${mm(Number(water.daily_L))} L`, `a day for ${water.persons} guests`],
              [`${water.tank_m3} m³`, "storage tank, about 4 days"],
              [`${water.septic_m3} m³`, `septic tank, chambers ${water.chamber1_m3} + ${water.chamber2_m3} m³`],
              [`${water.pump_lpm} L/min`, "booster pump"],
            ].map(([v, l]) => (
              <div key={l} className="bg-background p-5">
                <div className="text-2xl font-semibold tracking-tight">{v}</div>
                <div className="text-muted-foreground mt-1 text-sm">{l}</div>
              </div>
            ))}
          </div>
          <Figure src={`${D}/drawings/p-301.svg`} caption="P-301 · Site water and sanitation schematic" />
        </div>
      </section>

      <section id="pipes" className="scroll-mt-20 border-t py-16">
        <div className="mx-auto w-full max-w-7xl px-4 md:px-6">
          <p className="text-muted-foreground text-sm font-medium">Plumbing · 2 of 4</p>
          <h2 className="mt-1 text-3xl font-semibold tracking-tight">{pipes.length} pipe runs in the studio</h2>
          <p className="text-muted-foreground mt-3 max-w-3xl text-lg text-balance">
            The sink, heater, shower, basin and WC sit within about 1.5 m of each other, so the pipes stay short. Drains
            hang under the raised floor, so the bathroom has no step.
          </p>
          <Figure src={`${D}/drawings/p-101.svg`} caption="P-101 · Plumbing layout plan (supply and drainage)" />
          <div className="overflow-x-auto rounded-xl border">
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
                    <td className="px-3 py-2 font-medium">{p.run}</td>
                    <td className="px-3 py-2">{p.system}</td>
                    <td className="px-3 py-2 whitespace-nowrap tabular-nums">DN{p.dn}</td>
                    <td className="px-3 py-2 whitespace-nowrap tabular-nums">{p.length_m} m</td>
                    <td className="px-3 py-2 tabular-nums">{p.fall || "–"}</td>
                    <td className="text-muted-foreground px-3 py-2">{p.note}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      <section id="hot-water" className="scroll-mt-20 border-t bg-muted/40 py-16">
        <div className="mx-auto w-full max-w-7xl px-4 md:px-6">
          <p className="text-muted-foreground text-sm font-medium">Plumbing · 3 of 4</p>
          <h2 className="mt-1 text-3xl font-semibold tracking-tight">The pipework in 3D</h2>
          <p className="text-muted-foreground mt-3 max-w-3xl text-lg text-balance">
            An 80 L heater in the kitchen&rsquo;s tall unit stores water at 60 °C. A thermostatic valve sends 41&ndash;44 °C to
            the shower and basin so no guest is scalded; the kitchen sink gets hot water direct. Every pipe is
            pressure-tested before the walls close.
          </p>
          <Figure src={`${D}/drawings/p-201.svg`} caption="P-201 · Pipework isometric (unit)" />
        </div>
      </section>

      <section id="plumbing-bom" className="scroll-mt-20 border-t py-16">
        <div className="mx-auto w-full max-w-7xl px-4 md:px-6">
          <p className="text-muted-foreground text-sm font-medium">Plumbing · 4 of 4</p>
          <h2 className="mt-1 text-3xl font-semibold tracking-tight">Bill of materials</h2>
          <p className="text-muted-foreground mt-3 max-w-3xl text-lg text-balance">
            Everything the plumber buys for the studio: about RWF {frw(plumbingTotal)}. Prices are placeholders until
            three quotes come in for each line.
          </p>
          <BomTable groups={plumbing} total={plumbingTotal} label="Plumbing, the studio" />
          <h3 className="mt-10 text-xl font-semibold tracking-tight">Shared with the farm</h3>
          <div className="mt-4 overflow-x-auto rounded-xl border">
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
            Full list for every trade: <a href={`${D}/data/bom.xlsx`} download className="underline underline-offset-4">bom.xlsx</a>
            {" · "}<a href={`${D}/data/pipes.csv`} download className="underline underline-offset-4">pipes.csv</a>
            {" · "}<a href={`${D}/data/site-water.csv`} download className="underline underline-offset-4">site-water.csv</a>
          </p>
        </div>
      </section>

      <div className="mx-auto w-full max-w-5xl px-4 pb-12 md:px-6 md:pb-16">
      <section className="mt-16">
        <h2 className="text-2xl font-semibold tracking-tight">What the studio has</h2>
        <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {FEATURES.map((f) => (
            <div key={f.title} className="rounded-xl border p-5">
              <h3 className="font-medium">{f.title}</h3>
              <p className="text-muted-foreground mt-2 text-sm leading-relaxed">{f.text}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="mt-16">
        <h2 className="text-2xl font-semibold tracking-tight">Built the IKEA way</h2>
        <ol className="mt-6 grid gap-4 md:grid-cols-5">
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
      </section>

      <section className="mt-16 grid gap-6 md:grid-cols-2">
        <div className="rounded-xl border p-6">
          <h2 className="text-xl font-semibold tracking-tight">Downloads</h2>
          <ul className="mt-4 space-y-2 text-sm">
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
        </div>
        <div className="rounded-xl border p-6">
          <h2 className="text-xl font-semibold tracking-tight">Status</h2>
          <p className="text-muted-foreground mt-3 text-sm leading-relaxed">
            Preliminary. Openings are scaled from a photo, so nothing is cut until the container is measured.
            Prices are placeholders until three quotes per line: about {rwf(totals.unit_with_contingency)} for the
            studio, before the farm&rsquo;s shared septic, water and power works. A structural engineer signs the
            roof terrace before guests use it.
          </p>
          <Button asChild variant="outline" className="mt-4">
            <Link href="/docs/studio-site">See the survey sheet</Link>
          </Button>
        </div>
      </section>
      </div>
    </main>
  )
}
