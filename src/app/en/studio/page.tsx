import { readFileSync } from "node:fs"
import { join } from "node:path"
import type { Metadata } from "next"
import Link from "next/link"

import { Button } from "@/components/ui/button"
import { Figure } from "@/components/docs/figure"
import { StudioViewer } from "@/components/docs/studio-viewer"
import model from "../../../../public/designs/studio/model/parts.json"
import totals from "../../../../public/designs/studio/data/totals.json"

// Public showcase of the container-studio design package (study/studio, D-014..D-016).
// Every number here comes from the generated package; the docs hold the evidence.

export const metadata: Metadata = {
  title: "Container studios · Farm",
  description:
    "Three identical farm-stay guest studios in 20 ft containers near Kigali, built IKEA-style from flat-pack parts made in Kigali.",
}

const D = "/designs/studio"
const rwf = (n: number) => `RWF ${(n / 1e6).toFixed(1)}M`

const FEATURES = [
  { title: "Sleep", text: "Queen bed up to 1.6 × 2.0 m across the quiet end, with drawers, a headboard shelf, reading lights and USB-C." },
  { title: "Cook", text: "A 2.17 m kitchen: under-counter fridge, two-zone induction hob, sink, drinking-water filter. No gas indoors." },
  { title: "Wash", text: "A 1.2 m walk-in shower, WC and basin. Hot water from an 80 L heater through a thermostatic mixer." },
  { title: "Live", text: "Table and stools by the 3 m sliding glass wall that opens onto the deck. Wall fan, split-AC ready." },
  { title: "Roof", text: "A roof terrace with lounge chairs under a tinted transparent canopy, and a second canopy over the deck." },
  { title: "Stay cool", text: "Ventilated double roof, EPS insulation sealed to the steel, insect mesh on every opening." },
]

const STEPS = [
  { n: "1", title: "Measure", text: "Survey all three containers; the model regenerates every drawing from the real numbers." },
  { n: "2", title: "Cut in Kigali", text: "A Gisozi workshop rips and crosscuts sheets on a panel saw, following the cutting diagrams." },
  { n: "3", title: "Drill and number", text: "Holes on the 32 mm grid from 1:1 templates; every part labelled, like K3-H-07." },
  { n: "4", title: "Pack flat", text: "One kit per studio, bundles under 25 kg, hardware in bags A to L." },
  { n: "5", title: "Assemble", text: "Two people, one tool set, 27 wordless steps, from insulation to the roof terrace." },
]

// 2D: the plan first, then the sheets that explain it.
const PLANS = [
  ["a-201", "Interior elevations: back wall and front wall"],
  ["a-202", "End elevations and cross-section"],
  ["s-101", "Roof terrace, canopies and stair"],
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
    groups.get(group)!.push({
      item: r.item.replace(/^Cable ([\d.]+) mm2 T\+E\/singles in conduit, /, "Cable $1 mm², "),
      qty: Number(r.qty_per_unit), unit: r.unit, price: Number(r.unit_price_rwf), total: Number(r.total_per_unit_rwf), label: r.label,
    })
  }
  return [...groups].filter(([, l]) => l.length).map(([name, lines]) => ({ name, lines, total: lines.reduce((n, l) => n + l.total, 0) }))
}

const frw = (n: number) => n.toLocaleString("en-US")

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
  const pieces = Object.fromEntries(kits.map((k) => [k.id, piecesOf(k.id)]))
  return (
    <main className="w-full flex-1">
      {/* First screen: a photoreal concept render of the finished studio (D-018), made in Nano Banana from the
          site footage and studio-exterior.jpg, the model render from studio.glb that the docs keep using. */}
      <section className="relative h-[calc(100svh-var(--header-height))] min-h-[520px] w-full overflow-hidden bg-[#a9c8df]">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={`${D}/render/studio-hero.jpg`} width={2400} height={1340} fetchPriority="high"
          alt="A finished container studio at golden hour: a sliding glass wall open onto a timber deck with red railings, a kitchenette and bed inside, a steel stair to lounge chairs on the roof, and eucalyptus behind."
          className="absolute inset-0 size-full object-cover object-[50%_55%]" />
        <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/70 via-black/35 to-transparent">
          <div className="w-full px-4 pt-24 pb-10 md:px-10 md:pb-14">
            <p className="text-sm text-white/80">Concept render</p>
            <h1 className="mt-3 max-w-2xl text-4xl font-semibold tracking-tight text-balance text-white md:text-6xl">
              Three studios, built flat-pack
            </h1>
            <Button asChild className="mt-6">
              <a href="#plans">See the plans</a>
            </Button>
          </div>
        </div>
      </section>

      <div className="mx-auto w-full max-w-5xl px-4 pb-12 md:px-6 md:pb-16">
      {/* 2D: the furniture plan, then the sheets behind it. */}
      <section id="plans" className="mt-14 scroll-mt-20">
        <p className="text-muted-foreground text-sm font-medium">2D</p>
        <h2 className="mt-1 text-3xl font-semibold tracking-tight text-balance">Everything a guest needs in 13 m²</h2>
        <p className="text-muted-foreground mt-3 max-w-3xl text-lg text-balance">
          Three 20 ft containers already on the farm become identical farm-stay studios: bed, kitchen,
          shower and a roof terrace. One set of drawings serves all three.
        </p>
        <Figure src={`${D}/drawings/a-103.svg`} caption="A-103 · Furniture and dimension plan" />
        <div className="grid grid-cols-2 gap-px overflow-hidden rounded-xl border bg-border md:grid-cols-4">
          {[
            ["13.1 m²", "net floor per studio"],
            ["11 kits", `${sheets} sheets per studio`],
            ["56 sheets", "drawings, generated"],
            [rwf(totals.unit_with_contingency), "per studio, placeholder prices"],
          ].map(([v, l]) => (
            <div key={l} className="bg-background p-5">
              <div className="text-2xl font-semibold tracking-tight">{v}</div>
              <div className="text-muted-foreground mt-1 text-sm">{l}</div>
            </div>
          ))}
        </div>
        <div className="mt-4 grid gap-x-6 md:grid-cols-2">
          {PLANS.map(([id, title]) => (
            <Figure key={id} src={`${D}/drawings/${id}.svg`} caption={`${id.toUpperCase()} · ${title}`} />
          ))}
        </div>
      </section>

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
          title="Container studio, Layout A" />
      </section>

      {/* The building blocks: one studio is eleven kits. */}
      <section id="blocks" className="mt-16 scroll-mt-20">
        <p className="text-muted-foreground text-sm font-medium">Building blocks</p>
        <h2 className="mt-1 text-3xl font-semibold tracking-tight">Eleven kits make one studio</h2>
        <p className="text-muted-foreground mt-3 max-w-3xl text-lg text-balance">
          Each kit is packed flat, labelled and handed to one trade. The same eleven kits are made three times.
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
            The REG grid feeds a site board, which feeds a board in each studio: a 40 A main switch, surge
            protection and a 30 mA RCD over every circuit. The hob and the water heater never run together, which
            keeps one studio near {Math.round(Number(demand.total_A))} A.
          </p>
          <div className="mt-6 grid grid-cols-2 gap-px overflow-hidden rounded-xl border bg-border md:grid-cols-4">
            {[
              [`${demand.total_A} A`, "maximum demand per studio"],
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
            Everything the electrician buys for one studio: about RWF {frw(bomTotal)}. Prices are placeholders until
            three quotes come in for each line.
          </p>
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
              {bom.map((g) => (
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
                  <th colSpan={3} className="px-3 py-3 text-start font-semibold">Electrical, one studio</th>
                  <td className="px-3 py-3 text-end font-semibold tabular-nums">{frw(bomTotal)}</td>
                </tr>
              </tfoot>
            </table>
          </div>
          <p className="text-muted-foreground mt-3 text-sm">
            Full list for every trade: <a href={`${D}/data/bom.xlsx`} download className="underline underline-offset-4">bom.xlsx</a>
            {" · "}<a href={`${D}/data/circuits.csv`} download className="underline underline-offset-4">circuits.csv</a>
            {" · "}<a href={`${D}/data/points.csv`} download className="underline underline-offset-4">points.csv</a>
          </p>
        </div>
      </section>

      <div className="mx-auto w-full max-w-5xl px-4 pb-12 md:px-6 md:pb-16">
      <section className="mt-16">
        <h2 className="text-2xl font-semibold tracking-tight">What each studio has</h2>
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
            Preliminary. Openings are scaled from a photo, so nothing is cut until all three containers are
            measured. Prices are placeholders until three quotes per line: about {rwf(totals.three_units_total)} for
            all three studios with the shared septic, water and power works. A structural engineer signs the roof
            terrace before guests use it.
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
