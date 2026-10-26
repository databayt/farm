import { readFileSync } from "node:fs"
import { join } from "node:path"
import type { Metadata } from "next"
import Link from "next/link"

import { Button } from "@/components/ui/button"
import { Figure } from "@/components/docs/figure"
import { BuildUp } from "@/components/docs/build-up"
import { ItemRail } from "@/components/docs/item-rail"
import { bedStock } from "@/lib/bed-stock"
import totals from "../../../../public/designs/studio/data/totals.json"
import floorPieces from "../../../../public/designs/studio/render/floor-pieces.json"
import wallPieces from "../../../../public/designs/studio/render/wall-pieces.json"

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
  { title: "Sleep", text: "A queen bed up to 1.6 × 2.0 m against the wall, with two storage boxes underneath, a bedside table, a reading lamp and USB-C." },
  { title: "Cook", text: "A galley on the bathroom wall: under-counter fridge, two-zone induction hob, sink, drinking-water filter. No gas indoors." },
  { title: "Wash", text: "Shower, WC and basin in one row: a wall-hung WC and the shower behind a door, the basin outside it." },
  { title: "Sit", text: "A seating room: a two-seat sofa, a low wide table and two chairs, by the 3 m sliding glass wall onto the deck." },
  { title: "Roof", text: "An open roof terrace with lounge chairs behind a timber-topped rail, up a steel stair; a canopy shades the deck." },
  { title: "Stay cool", text: "The roof deck shades the steel, EPS insulation is sealed to it, a wall fan moves the air, and the AC is ready." },
]

// The Bed rail: each piece rendered on its own by scripts/studio/render/room.html?item=<id>, with what it
// measures, where it comes from and what it costs. Prices are the BOM's placeholders (AS-21) until quoted.
function bedRail() {
  const k5 = readCsv("cut-list.csv").filter((r) => r.kit === "K5")
    .reduce((a, r) => a + (Number(r.length_mm) * Number(r.width_mm)) / 1e6, 0)
  const board = (k5 / (2.44 * 1.22)) * 45_000
  const unsourced = { where: "Not sourced yet", cost: "Not in the budget yet" }
  const items = [
    { id: "bed", title: "Bed frame", size: "1.64 × 2.02 m, headboard 1.0 m, top at 0.45 m",
      where: "Built: board from Gisozi (Agakiriro), cut in a Gisozi workshop", cost: `RWF ${frw(Math.round(bedStock().total))} of stock`,
      note: "Includes the two storage boxes that roll out from under it on castors (0.60 × 0.62 × 0.29 m each)." },
    { id: "mattress", title: "Mattress", size: "160 × 200 × 20 cm", where: "Rwanda Foam Ltd, Kigali", cost: `RWF ${frw(180_000)} estimate`,
      note: "Sizes not confirmed yet; the frame takes 152 × 183 up to 160 × 200 cm." },
    { id: "sheets", title: "Bed sheets", size: "Fitted sheet, flat sheet and 2 pillowcases for 160 × 200 cm", ...unsourced },
    { id: "duvet", title: "Duvet", size: "200 × 220 cm", ...unsourced },
    { id: "pillow", title: "Pillows × 2", size: "50 × 70 cm each", ...unsourced },
    { id: "bedside", title: "Bedside table", size: "0.34 × 0.34 × 0.55 m", where: "Built with the bed from 18 mm board (kit K5)",
      cost: `RWF ${frw(Math.round(board))} of board`, note: "A thick top on four legs, each two strips glued face to face, and a lower shelf." },
    { id: "lamp", title: "Table lamp", size: "Ø 0.26 m, 0.42 m high", where: "Not sourced yet", cost: `RWF ${frw(35_000)} estimate`,
      note: "A linen drum shade and an LED E27 bulb." },
    { id: "walllamp", title: "Wall reading lamp", size: "Arm 0.24 m from the wall", where: "With the electrical kit (K8)",
      cost: `RWF ${frw(15_000)} estimate`, note: "Over the wall-side pillow." },
  ]
  return rail("bedroom", items)
}

type RailRow = { id: string; title: string; size: string; where: string; cost: string; note?: string }
function rail(dir: string, items: RailRow[]) {
  return items.map((x) => ({
    src: `${D}/render/${dir}/${x.id}.webp`, alt: x.title, title: x.title, note: x.note,
    details: [{ label: "Dimensions", value: x.size }, { label: "Where to buy", value: x.where }, { label: "Cost", value: x.cost }],
  }))
}

// board for the pieces the workshop cuts (cut-list.csv), priced by the share of each sheet they take
const SHEET_RWF: Record<string, number> = { PLY18: 45_000, PLY12: 35_000 }
function boardCost(keep: (id: string) => boolean) {
  return readCsv("cut-list.csv").filter((r) => keep(r.id)).reduce((n, r) =>
    n + (r.material === "WTOP38" ? 90_000 : ((Number(r.length_mm) * Number(r.width_mm)) / (2440 * 1220)) * (SHEET_RWF[r.material] ?? 0)), 0)
}
const est = (n: number) => `RWF ${frw(Math.round(n / 100) * 100)} estimate`
const built = (n: number, what = "of board") => `RWF ${frw(Math.round(n / 100) * 100)} ${what}`
const HARDWARE_DISTRICT = "Not found online yet: the hardware district"

// The Seating, Galley and Bath rails, in the Bed rail's pattern: renders from room.html?item=<id> (the room's
// own meshes, so the picture is the piece in the 3D view); sizes from render/scene.json and the BOM
function seatingRail() {
  return rail("seating", [
    { id: "sofa", title: "Sofa", size: "1.30 × 0.75 m, 0.70 m high", where: "Not sourced yet", cost: est(450_000),
      note: "A low two-seat sofa in soft dark grey, with washable covers." },
    { id: "table", title: "Table", size: "0.86 × 0.50 m, 0.55 m high", where: "Built in the workshop from 18 mm board (kit K6)",
      cost: built(boardCost((id) => /^K6-0[1-3]$/.test(id))), note: "A low wide table: the top on two legs that slot together." },
    { id: "chairs", title: "Chairs × 2", size: "0.40 × 0.40 m, seat at 0.40 m, back 0.80 m", where: "Built in the workshop from 18 mm board (kit K6)",
      cost: built(boardCost((id) => /^K6-(0[4-9]|1[01])$/.test(id)), "of board for both") },
  ])
}
function galleyRail() {
  return rail("galley", [
    { id: "units", title: "Base units", size: "1.60 m run, 0.62 m deep, worktop at 0.90 m",
      where: "Built in the workshop from 18 mm board, 38 mm worktop (kit K3)",
      cost: built(boardCost((id) => /^K3-(0|H-|S-|PL|WT)/.test(id)) + 8 * 1_500, "of board, worktop and legs"),
      note: "A fridge bay, a hob base with two drawers and a sink base with a door, on adjustable legs behind a plinth." },
    { id: "fridge", title: "Fridge", size: "About 90 L, under the counter", where: "Kanis Retail (online)", cost: `RWF ${frw(265_000)}`,
      note: "A published price (Kanis, 2026-10-26), not a placeholder." },
    { id: "hob", title: "Induction hob", size: "590 × 350 mm, two zones side by side, about 3.5 kW", where: "Not sourced yet", cost: est(250_000),
      note: "Black glass with front knobs. No gas indoors." },
    { id: "sink", title: "Sink and tap", size: "Inset bowl about 380 × 420 mm", where: HARDWARE_DISTRICT, cost: est(70_000 + 45_000),
      note: "Stainless single bowl with a mixer tap. A drinking-water filter goes under it (RWF 80,000 estimate)." },
    { id: "hood", title: "Cooker hood", size: "600 mm wide, slim", where: "Not sourced yet", cost: est(90_000 + boardCost((id) => id === "K3-HS")),
      note: "Black, recirculating with a charcoal filter, on its own shelf under the cabinet." },
    { id: "overhead", title: "Wall cabinet", size: "1.60 × 0.50 m, 0.50 m high", where: "Built in the workshop from 18 mm board (kit K3)",
      cost: built(boardCost((id) => id.startsWith("K3-T-"))), note: "Two doors, hung on the steel rail over the galley." },
  ])
}
function bathRail() {
  return rail("bath", [
    { id: "shower", title: "Shower", size: "Tray 1,000 × 900 mm, glass screen 700 × 2,000 mm", where: HARDWARE_DISTRICT, cost: est(120_000 + 180_000),
      note: "A low tray with a 90 mm waste and a fixed 8 mm toughened glass screen." },
    { id: "wc", title: "WC", size: "Wall-hung, 520 mm projection", where: HARDWARE_DISTRICT, cost: est(150_000 + 220_000),
      note: "A soft-close seat, on a slim concealed cistern frame with a dual-flush plate." },
    { id: "basin", title: "Basin", size: "400 × 300 mm", where: HARDWARE_DISTRICT, cost: est(90_000),
      note: "With a mixer and a bottle trap, outside the shower door." },
    { id: "mirror", title: "Mirror", size: "0.40 × 0.65 m", where: HARDWARE_DISTRICT, cost: est(25_000), note: "4 mm glass over the basin." },
  ])
}

const STEPS = [
  { n: "1", title: "Measure", text: "Survey the container; the model regenerates every drawing from the real numbers." },
  { n: "2", title: "Cut in Kigali", text: "A Gisozi workshop rips and crosscuts sheets on a panel saw, following the cutting diagrams." },
  { n: "3", title: "Drill and number", text: "Holes on the 32 mm grid from 1:1 templates; every part labelled, like K3-H-07." },
  { n: "4", title: "Pack flat", text: "Every kit packed flat, bundles under 25 kg, hardware in bags A to L." },
  { n: "5", title: "Assemble", text: "Two people, one tool set, 27 wordless steps, from insulation to the roof terrace." },
]

// The generator's CSVs: plain commas, quotes only around fields that hold one.
function readCsv(file: string): Record<string, string>[] {
  const [head, ...lines] = readFileSync(join(process.cwd(), "public/designs/studio/data", file), "utf8").trim().split("\n")
  const cells = (line: string) => [...line.matchAll(/("[^"]*"|[^,]*)(,|$)/g)].slice(0, -1).map((m) => m[1].replace(/^"|"$/g, ""))
  const keys = cells(head)
  return lines.map((l) => Object.fromEntries(cells(l).map((v, i) => [keys[i], v])))
}

const POINT_GROUP: Record<string, string> = {
  db: "Board and protection", light: "Lights", switch: "Switches", usb: "Sockets and outlets",
  socket: "Sockets and outlets", outlet: "Sockets and outlets", fan: "Fans", inlet: "Board and protection",
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

export default function StudioPage() {
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
  return (
    <main className="w-full flex-1">
      {/* First screen: a photoreal concept render of the finished studio (D-018), made in Gemini (2026-10-27):
          the yellow container on its red deck in the eucalyptus, the slider half open on the bed, a steel ladder up to
          the lounge chairs on the roof. Shared from Gemini at 1376 px and upscaled 4x with Real-ESRGAN (x4plus). */}
      <section className="relative h-svh min-h-[520px] w-full overflow-hidden bg-[#a9c8df]">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={`${D}/render/studio-hero.jpg`} width={2400} height={1340} fetchPriority="high"
          alt="A yellow container studio at golden hour under a dark roof canopy: the sliding glass wall half open on a bed, a sofa and two chairs, a red-railed timber deck with a bistro table and a potted plant, a steel ladder up the side to two lounge chairs on the roof, and eucalyptus behind."
          className="absolute inset-0 size-full object-cover object-[50%_55%]" />
        {/* D-018: an AI image is always labelled as a concept render. */}
        <span className="absolute end-4 bottom-4 z-10 rounded-full bg-black/40 px-2.5 py-1 text-xs text-white/85 backdrop-blur md:end-10">
          Concept render
        </span>
        <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/70 via-black/35 to-transparent">
          <div className="w-full px-4 pt-24 pb-10 md:px-10 md:pb-14">
            <p className="text-sm text-white/80">Digital Farm</p>
            <h1 className="mt-3 max-w-2xl text-4xl font-semibold tracking-tight text-balance text-white md:text-6xl">
              Studio in nature, with forest vibes
            </h1>
            <Button asChild className="mt-6">
              <Link href="/#enquire">Book it now</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* 2D, full screen: the simplified plan fills the screen; 3D follows straight after. */}
      <section id="plans">
        <div className="flex flex-col px-4 pt-10 pb-6 md:px-10 lg:h-svh lg:min-h-[560px]">
          <h2 className="text-3xl font-semibold tracking-tight">2D</h2>
          {/* The simplified plan (render/plan.svg, black on transparent; inverted in dark mode), written by
              the generator, across the full width. */}
          <div className="mt-6 flex min-h-0 flex-1 items-center">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={`${D}/render/plan.svg`} alt="Plan: the bed at one end, a sofa with a table and two chairs, the galley on the bathroom wall, and at the other end the shower and WC behind a door, with the basin outside it."
              className="w-full object-contain lg:max-h-full dark:invert" />
          </div>
        </div>
      </section>

      {/* 3D, full screen and in the 2D section's pattern: a black-and-white line drawing of the furnished
          room seen from the front (render/front-line.png, inverted in dark mode), then the same view rendered
          realistically (render/front-real.jpg). Both come from scripts/studio/render/room.html, built from
          render/scene.json. */}
      <section id="model">
        <div className="flex flex-col px-4 pt-10 pb-6 md:px-10 lg:h-svh lg:min-h-[560px]">
          <h2 className="text-3xl font-semibold tracking-tight">3D</h2>
          <div className="mt-6 flex min-h-0 flex-1 items-center justify-center">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={`${D}/render/front-line.png`} width={2400} height={1100}
              alt="Line drawing of the studio seen from the front with the front wall off: the bed against the wall with two storage boxes, a bedside table with a reading lamp, the sofa with a low table and two chairs, the galley with a wide two-zone hob under a slim hood, a sink and an overhead cabinet, and the bathroom with the shower, a wall-hung WC and the basin on its console outside the door."
              className="w-full object-contain lg:max-h-full dark:invert" />
          </div>
        </div>
        <figure className="px-4 pb-10 md:px-10">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={`${D}/render/front-real.jpg`} width={2400} height={1100} loading="lazy"
            alt="The same view rendered with materials and daylight: pine furniture in a medium-oak finish on a natural oak floor, a white bed with storage boxes and a lit bedside lamp, a grey sofa with yellow and blue cushions, a table and two chairs, the galley with a black-glass hob under a black hood, and a white marble bathroom with a glass shower screen, a wall-hung WC and a basin on a black metal console."
            className="h-auto w-full" />
          <figcaption className="text-muted-foreground mt-2 text-sm">Rendered from the design model</figcaption>
        </figure>
      </section>

      {/* Floor, pinned while it builds up in fast motion, seen from above: the empty container, then flat
          wood sheets screwed down, then the planks, then the bathroom's vinyl. Renders: scripts/studio/render/floor.html. */}
      <section id="floor">
        <BuildUp title="Floor" base={`${D}/render/floor-base.webp`} aspect={floorPieces.aspect}
          baseAlt="The container's base from straight above: worn plywood panels with rows of screws, in a red steel frame with a corner casting at each corner."
          builds={[
            { secs: 2.4, label: "Flat wood sheets laid over the whole floor and screwed down.", groups: [
              { src: `${D}/render/floor-sheets.webp`, rects: floorPieces.sheets, kind: "drop", from: 0, to: 0.75, rise: 60 },
              { src: `${D}/render/floor-screws.webp`, rects: floorPieces.sheets, kind: "fix", from: 0, to: 0.75 },
            ] },
            { secs: 3.2, label: "Oak planks laid over the living area.", groups: [
              { src: `${D}/render/floor-planks.webp`, rects: floorPieces.planks, kind: "drop", from: 0, to: 0.85, rise: 30 },
            ] },
            { secs: 1.2, label: "The bathroom end in grey safety vinyl, in one sheet.", groups: [
              { src: `${D}/render/floor-vinyl.webp`, rects: [floorPieces.vinyl], kind: "unroll", from: 0, to: 1 },
            ] },
          ]}
          stages={[
            { title: "The empty container", text: "28 mm treated hardwood ply in 1.16 × 2.4 m panels, screwed to steel cross-members every 300 mm, inside the base frame and its four corner castings." },
            { title: "Layer 1 · Flat wood", text: "2.44 × 1.22 m sheets laid wall to wall, joints staggered, and screwed down every 300 mm." },
            { title: "Layer 2 · Planks", text: "Oak planks laid row by row from the back wall over the living area, joints staggered." },
            { title: "The bathroom side", text: "Safety vinyl in one sheet with no joints, coved 100 mm up the walls." },
          ]} />
      </section>

      {/* Wall, in the floor's pattern: the back wall seen straight on, the bare corrugated steel first, then
          its lining put up in fast motion and painted off-white. Renders: scripts/studio/render/wall.html. */}
      <section id="wall">
        <BuildUp title="Wall" base={`${D}/render/wall-base.webp`} aspect={wallPieces.aspect}
          baseAlt="The container's back wall seen from inside: red corrugated steel, scuffed, with rust low down and lashing rings, framed by the rails, corner posts and corner castings."
          builds={[
            { secs: 2.4, label: "Battens up the wall with white insulation boards between them.", groups: [
              { src: `${D}/render/wall-battens.webp`, rects: wallPieces.battens, kind: "drop", from: 0, to: 0.35 },
              { src: `${D}/render/wall-eps.webp`, rects: wallPieces.eps, kind: "drop", from: 0.45, to: 0.85 },
            ] },
            { secs: 2, label: "Four numbered plywood lining panels screwed to the battens.", groups: [
              { src: `${D}/render/wall-panels.webp`, rects: wallPieces.panels, kind: "drop", from: 0, to: 0.7, rise: 60 },
              { src: `${D}/render/wall-screws.webp`, rects: wallPieces.panels, kind: "fix", from: 0, to: 0.7 },
            ] },
            { secs: 2, label: "The lining rolled in off-white satin paint.", groups: [
              { src: `${D}/render/wall-paint.webp`, rects: wallPieces.paint, kind: "wipe", from: 0, to: 0.85 },
            ] },
            { secs: 2.4, label: "The bathroom end in cement board and white marble-look tiles.", groups: [
              { src: `${D}/render/wall-cement.webp`, rects: wallPieces.cement, kind: "drop", from: 0, to: 0, rise: 60 },
              { src: `${D}/render/wall-tiles.webp`, rects: wallPieces.tiles, kind: "drop", from: 0.25, to: 0.85, rise: 24 },
            ] },
          ]}
          stages={[
            { title: "The empty container", text: "1.6 mm corrugated steel, 36 mm deep at 278 mm pitch, between the rails, corner posts and castings. Rust treated and primed first." },
            { title: "Layer 1 · Battens + insulation", text: "38 × 50 treated battens at 600 mm centres, EPS fitted between them and every joint foam-sealed." },
            { title: "Layer 2 · Lining panels", text: "12 mm plywood panels, numbered and cut in the workshop, screwed to each batten every 300 mm." },
            { title: "Layer 3 · Paint", text: "Joints and screw heads filled, a vapour-retarding primer, then off-white paint in a satin sheen, rolled on." },
            { title: "The bathroom side", text: "12 mm cement board and a waterproof membrane, then 300 × 600 tiles laid from the floor up." },
          ]} />
      </section>

      {/* Bed: the bed corner as a rail of product cards (after databayt.org's products rail); the card in focus
          shows its size, source and cost below. */}
      {[{ id: "bedroom", title: "Bed", items: bedRail() }, { id: "seating", title: "Seating", items: seatingRail() },
        { id: "galley", title: "Galley", items: galleyRail() }, { id: "bath", title: "Bath", items: bathRail() }].map((r) => (
        <section key={r.id} id={r.id} className="pt-10 pb-10">
          <h2 className="px-4 text-3xl font-semibold tracking-tight md:px-10">{r.title}</h2>
          <div className="mt-6">
            <ItemRail items={r.items} />
          </div>
        </section>
      ))}

      {/* Electrical: four full-width sections for one studio, from its inlet down to every item bought.
          Where the power comes from is a site decision; the studio only needs something to plug into its inlet. */}
      <section id="electrical" className="mt-16 scroll-mt-20 border-t bg-muted/40 py-16">
        <div className="mx-auto w-full max-w-7xl px-4 md:px-6">
          <p className="text-muted-foreground text-sm font-medium">Electrical · 1 of 4</p>
          <h2 className="mt-1 text-3xl font-semibold tracking-tight">One studio, one plug-in point</h2>
          <p className="text-muted-foreground mt-3 max-w-3xl text-lg text-balance">
            The studio is wired as a closed unit. A weatherproof {demand.inlet_A} A inlet on the outside of the back wall
            takes any 230 V supply: the grid, a site board, a generator or a solar inverter. Behind it, the
            studio&rsquo;s own board: a 40 A main switch with a kWh meter, surge protection and a 30 mA RCD over every
            circuit. The hob and the water heater never run together, which keeps the studio near{" "}
            {Math.round(Number(demand.total_A))} A.
          </p>
          <div className="mt-6 grid grid-cols-2 gap-px overflow-hidden rounded-xl border bg-border md:grid-cols-4">
            {[
              [`${demand.total_A} A`, "maximum demand"],
              [`${demand.inlet_A} A`, "inlet, IP67, 230 V"],
              [`${circuits.length} circuits`, "on one unit board"],
              [`${demand.tails_mm2} mm²`, "tails from the inlet to the board"],
            ].map(([v, l]) => (
              <div key={l} className="bg-background p-5">
                <div className="text-2xl font-semibold tracking-tight">{v}</div>
                <div className="text-muted-foreground mt-1 text-sm">{l}</div>
              </div>
            ))}
          </div>
          <Figure src={`${D}/drawings/e-201.svg`} caption="E-201 · Single-line diagram: inlet and unit board" />
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
                    <td className="text-muted-foreground px-3 py-2">{p.kind === "usb" ? "socket + USB-C" : p.kind === "db" ? "board" : p.kind === "inlet" ? "power inlet" : p.kind}</td>
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
