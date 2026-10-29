import type { Metadata } from "next"
import Link from "next/link"

import { DocsSection, DrawingSection, ModelSection, PageHero, RailSection, ServiceSection } from "@/components/page/sections"
import { BuildUp } from "@/components/docs/build-up"
import { type RailItem } from "@/components/docs/item-rail"
import { PipeDiagram } from "@/components/docs/pipe-diagram"
import { TaggedFigure } from "@/components/docs/tagged-figure"
import { WiringDiagram } from "@/components/docs/wiring-diagram"
import { D, degC, frw, mm, readCsv } from "@/components/studio/data"
import { bedStock } from "@/lib/bed-stock"
import electricTags from "../../../../public/designs/studio/render/electric-tags.json"
import floorPieces from "../../../../public/designs/studio/render/floor-pieces.json"
import plumbingTags from "../../../../public/designs/studio/render/plumbing-tags.json"
import wallPieces from "../../../../public/designs/studio/render/wall-pieces.json"

// Public showcase of the container-studio design package (study/studio, D-014..D-016).
// Every number here comes from the generated package; the docs hold the evidence.

// The execution plan, then the docs pages the reference sections moved to, linked from the end of this page.
const DOCS = [
  { href: "/docs/first-90-days", title: "Execution plan", text: "The first 90 days, gate by gate and week by week, then the five-year roadmap." },
  { href: "/docs/studio-materials", title: "Bill of materials", text: "Every line one studio needs, section by section, and what the studios share with the farm." },
  { href: "/docs/studio-circuits", title: "Circuits and points", text: "The eight circuits, checked against breaker, cable and voltage drop, and every light, switch and socket." },
  { href: "/docs/studio-pipes", title: "Pipe runs and points", text: "Every run with its size, length and fall, and every valve, tap and drain." },
  { href: "/docs/studio-features", title: "Features and downloads", text: "What the studio has, how it is built the IKEA way, the drawing set and the status." },
]

export const metadata: Metadata = {
  title: "The studio · Farm",
  description:
    "A farm-stay guest studio in a 20 ft container near Kigali, built IKEA-style from flat-pack parts made in Kigali.",
}


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
      note: "Stainless single bowl with a cold tap. A drinking-water filter goes under it (RWF 80,000 estimate)." },
    { id: "hood", title: "Cooker hood", size: "600 mm wide, slim", where: "Not sourced yet", cost: est(90_000 + boardCost((id) => id === "K3-HS")),
      note: "Black, recirculating with a charcoal filter, on its own shelf under the cabinet." },
    { id: "overhead", title: "Wall cabinet", size: "1.60 × 0.50 m, 0.50 m high", where: "Built in the workshop from 18 mm board (kit K3)",
      cost: built(boardCost((id) => id.startsWith("K3-T-"))), note: "Two doors, hung on the steel rail over the galley." },
  ])
}
function bathRail() {
  return rail("bath", [
    { id: "shower", title: "Shower", size: "Tray 1,000 × 900 mm, glass screen 700 × 2,000 mm", where: HARDWARE_DISTRICT, cost: est(120_000 + 180_000),
      note: "A low tray with a 90 mm waste, a fixed 8 mm toughened glass screen, and the instant heater on the wall beside the hand shower." },
    { id: "wc", title: "WC", size: "Wall-hung, 520 mm projection", where: HARDWARE_DISTRICT, cost: est(150_000 + 220_000),
      note: "A soft-close seat, on a slim concealed cistern frame with a dual-flush plate." },
    { id: "basin", title: "Basin", size: "400 × 300 mm", where: HARDWARE_DISTRICT, cost: est(90_000),
      note: "With a cold tap and a bottle trap, outside the shower door." },
    { id: "mirror", title: "Mirror", size: "0.40 × 0.65 m", where: HARDWARE_DISTRICT, cost: est(25_000), note: "4 mm glass over the basin." },
  ])
}

// The Electric rail: one card per device, rendered on its own by room.html?item=<model> (the 3D view's own
// device), its size from points.csv, its cost from the BOM (placeholders, AS-21) and the points that use it.
// Nothing electrical is sourced yet, so no card names a shop.
const DEVICE_CARDS: { models: string[]; title: string; src?: string }[] = [
  { models: ["board"], title: "Unit board" }, { models: ["inlet"], title: "Power inlet" },
  { models: ["ceiling"], title: "Ceiling light" }, { models: ["bulkhead"], title: "IP65 light" },
  { models: ["walllamp"], title: "Wall reading lamp", src: `${D}/render/bedroom/walllamp.webp` },
  { models: ["strip"], title: "LED strip" }, { models: ["switch"], title: "Switch" },
  { models: ["switch65"], title: "Outdoor switch IP65" }, { models: ["usb"], title: "Socket + USB-C" },
  { models: ["socket2", "socket"], title: "Socket" }, { models: ["socket66"], title: "Deck socket IP66" },
  { models: ["outlet"], title: "Hob outlet" },
  { models: ["isolator"], title: "Isolator (heater and AC)" }, { models: ["wallfan"], title: "Wall fan" },
  { models: ["extract"], title: "Bathroom extract fan" }, { models: ["alarm"], title: "Smoke and heat alarms" },
  { models: ["earth"], title: "Earth rod" },
]
function electricRail(points: Record<string, string>[]): RailItem[] {
  const bom = readCsv("bom.csv")
  const price = (item: string) => Number(bom.find((r) => r.item === item)?.unit_price_rwf ?? 0)
  const sum = (re: RegExp) => bom.filter((r) => r.kit === "K8" && re.test(r.item)).reduce((n, r) => n + Number(r.total_per_unit_rwf), 0)
  return DEVICE_CARDS.map(({ models, title, src }) => {
    const pts = points.filter((p) => models.includes(p.model))
    const [w, h, d] = ["w_mm", "h_mm", "d_mm"].map((k) => Number(pts[0][k]))
    const m = pts[0].model
    const size = m === "ceiling" || m === "alarm" ? `Ø ${w} mm, ${d} mm deep`
      : m === "strip" ? `${w / 1000} m long, ${h} mm wide`
      : m === "earth" ? `${h / 1000} m rod, Ø ${w} mm, in an inspection pit`
      : models.length > 1 ? "Double 146 × 86 mm, single 86 × 86 mm"
      : `${w} × ${h} mm, ${d} mm deep`
    const each = price(pts[0].description)
    const cost = m === "board" ? `RWF ${frw(each)} the enclosure; RWF ${frw(each + sum(/^(Main breaker|Surge protection|RCBOs|Priority relay|Contactor)/))} with its breakers, surge protection and relay (estimates)`
      : m === "inlet" ? `RWF ${frw(each)}; RWF ${frw(each + sum(/^(Matching|Cable \d+ mm2 tails)/))} with its plug and tails (estimates)`
      : pts.every((p) => price(p.description) === each) ? `RWF ${frw(each)} each × ${pts.length} (estimate)`
      : `RWF ${frw(pts.reduce((n, p) => n + price(p.description), 0))} for ${pts.length} (estimate)`
    const on = [...new Set(pts.map((p) => p.circuit).filter(Boolean))]
    return {
      src: src ?? `${D}/render/electric/${m}.webp`, alt: title, title,
      note: `${pts.map((p) => p.point).join(", ")}${on.length ? ` · ${on.join(", ")}` : ""} · ${pts.length === 1 ? pts[0].description : pts.map((p) => p.description).join("; ")}`,
      details: [{ label: "Dimensions", value: size }, { label: "Where to buy", value: "Not sourced yet" }, { label: "Cost", value: cost }],
    }
  })
}

// The Plumbing rail, in the Electric rail's pattern: each fitting rendered where it stands by room.html?item=<model>
// (the 3D view's own piece), then the pipe; sizes from fittings.csv and the BOM's lengths, costs from the BOM
// (placeholders, AS-21), and a shop where the sourcing notes name one.
const PIPE_SHOPS = "Pro Water Rwanda (Gatsata) or Build Mart (Kicukiro)"
function plumbingRail(fittings: Record<string, string>[]): RailItem[] {
  const bom = readCsv("bom.csv").filter((r) => r.trade === "plumbing")
  const lines = (re: RegExp) => bom.filter((r) => re.test(r.item))
  const cost = (re: RegExp) => `RWF ${frw(lines(re).reduce((n, r) => n + Number(r.total_per_unit_rwf), 0))} (estimate)`
  const metres = (re: RegExp) => {
    const by = new Map<string, number>()
    for (const r of lines(re)) { const dn = r.item.match(/DN\d+/)![0]; by.set(dn, (by.get(dn) ?? 0) + Number(r.qty_per_unit)) }
    return [...by].map(([dn, m]) => `${+m.toFixed(1)} m of ${dn}`).join(", ")
  }
  const f = Object.fromEntries(fittings.map((x) => [x.model, x]))
  const each = (model: string) => est(Number(bom.find((r) => r.item === f[model].item)?.total_per_unit_rwf ?? 0))
  const card = (model: string, title: string, size: string, where: string, cost: string, note?: string): RailItem => ({
    src: `${D}/render/plumbing/${model}.webp`, alt: title, title,
    note: note ?? `${f[model].point} · ${f[model].description}`,
    details: [{ label: "Dimensions", value: size }, { label: "Where to buy", value: where }, { label: "Cost", value: cost }],
  })
  const valves = lines(/^Angle valves/)[0]
  return [
    card("meter", "Stop valve, filter and meter", `DN25, in line on the main, about ${f.meter.h_mm} mm`, "Not sourced yet", each("meter")),
    card("heater", "Instant shower heater", `${f.heater.w_mm} × ${f.heater.h_mm} × ${f.heater.d_mm} mm, ${degC(f.heater.rating)}, IPX4, no tank`,
      "Not sourced yet", each("heater"), "Heats the water as it flows, set on its own display; hot goes only to the shower, through the hand shower's hose."),
    card("kitchentap", "Kitchen tap", `Cold, ${f.kitchentap.rating}, one angle valve under the sink`, HARDWARE_DISTRICT, each("kitchentap")),
    card("filter", "Drinking-water filter", `Twin canisters ${f.filter.w_mm} × ${f.filter.h_mm} mm, its own faucet by the tap`,
      "Not sourced yet", each("filter")),
    card("showerset", "Slide rail and hand shower", `${Number(f.showerset.h_mm) / 1000} m rail; the hand shower and hose come with the heater`,
      HARDWARE_DISTRICT, each("showerset")),
    card("cistern", "Concealed cistern", `Frame ${f.cistern.w_mm} × ${mm(Number(f.cistern.h_mm))} × ${f.cistern.d_mm} mm, dual-flush plate`,
      HARDWARE_DISTRICT, each("cistern")),
    card("basintap", "Basin tap", "A tall cold tap for the vessel basin, one angle valve under the console", HARDWARE_DISTRICT,
      `RWF ${frw(Number(bom.find((r) => r.item === f.basintap.item)?.total_per_unit_rwf ?? 0))} for the basin, its tap and bottle trap (estimate)`),
    card("anglevalve", `Angle valves × ${valves.qty_per_unit}`, "With a filter: one under the sink, one under the basin, one at the cistern, one at the heater",
      HARDWARE_DISTRICT, `RWF ${frw(Number(valves.unit_price_rwf))} each × ${valves.qty_per_unit} (estimate)`,
      "Each tap and the cistern can be shut off on its own, without the main."),
    card("ppr", "PP-R supply pipe", `${metres(/^PPR/)}, PN20, welded joints`, PIPE_SHOPS, cost(/^PPR/),
      "Cold water inside the units and walls, then straight up to each outlet."),
    card("upvc", "uPVC drain pipe", metres(/^uPVC (soil|waste)/), PIPE_SHOPS, cost(/^uPVC (soil|waste)/),
      "Under the floor, each run falling at least 1:40 to IC1 or the grease trap."),
    card("vent", "Vent and air admittance valve", `${metres(/^uPVC vent/)}, a spare 110 mm AAV, rodding eyes`, PIPE_SHOPS,
      cost(/^(uPVC vent|Air admittance)/), "V1 rises up end B to 900 mm above the roof guardrail; the AAV stands in if it cannot."),
  ]
}

// a fitting's tag takes the colour of the water it gives: hot over cold, so the heater reads as hot; drains and the
// vent for the points that only take those
const WARMTH = ["tempered", "hot", "cold", "soil", "waste", "vent"]
function fittingColour(f: Record<string, string>, pipes: Record<string, string>[]) {
  const runs = pipes.filter((p) => f.runs.split(" ").includes(p.run))
  return runs.sort((a, b) => WARMTH.indexOf(a.system) - WARMTH.indexOf(b.system))[0]?.colour
}

export default function StudioPage() {
  const circuits = readCsv("circuits.csv")
  const demand = Object.fromEntries(readCsv("demand.csv").map((r) => [r.item, r.amps]))
  const points = readCsv("points.csv")
  const pipes = readCsv("pipes.csv")
  const fittings = readCsv("fittings.csv")
  const water = Object.fromEntries(readCsv("site-water.csv").map((r) => [r.item, r.value]))
  return (
    <main className="w-full flex-1">
      {/* First screen: a photoreal concept render of the finished studio (D-018), made in Gemini (2026-10-27):
          the yellow container on its red deck in the eucalyptus, the slider half open on the bed, a steel ladder up to
          the lounge chairs on the roof. Shared from Gemini at 1376 px and upscaled 4x with Real-ESRGAN (x4plus).
          No "Concept render" badge on it: the founder took it off (2026-10-27), an exception to D-018's label. */}
      <PageHero src={`${D}/render/studio-hero.jpg`} width={2400} height={1340} className="bg-[#a9c8df]" imgClassName="object-[50%_55%]"
        title="Studio in nature, with forest vibes"
        alt="A yellow container studio at golden hour under a dark roof canopy: the sliding glass wall half open on a bed, a sofa and two chairs, a red-railed timber deck with a bistro table and a potted plant, a steel ladder up the side to two lounge chairs on the roof, and eucalyptus behind." />

      {/* 2D, full screen: the simplified plan fills the screen; 3D follows straight after. */}
      <DrawingSection id="plans" title="2D">
        {/* The simplified plan (render/plan.svg, black on transparent; inverted in dark mode), written by
            the generator, across the full width. */}
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={`${D}/render/plan.svg`} alt="Plan: the bed at one end, a sofa with a table and two chairs, the galley on the bathroom wall, and at the other end the shower and WC behind a door, with the basin outside it."
          className="w-full object-contain lg:max-h-full dark:invert" />
      </DrawingSection>

      {/* 3D, full screen and in the 2D section's pattern: a black-and-white line drawing of the furnished
          room seen from the front (render/front-line.png, inverted in dark mode), then the same view rendered
          realistically (render/front-real.jpg). Both come from scripts/studio/render/room.html, built from
          render/scene.json. */}
      <ModelSection line={`${D}/render/front-line.png`} real={`${D}/render/front-real.jpg`} width={2400} height={1100}
        lineAlt="Line drawing of the studio seen from the front with the front wall off: the bed against the wall with two storage boxes, a bedside table with a reading lamp, the sofa with a low table and two chairs, the galley with a wide two-zone hob under a slim hood, a sink and an overhead cabinet, and the bathroom with the shower, a wall-hung WC and the basin on its console outside the door."
        realAlt="The same view rendered with materials and daylight: pine furniture in a medium-oak finish on a natural oak floor, a white bed with storage boxes and a lit bedside lamp, a grey sofa with yellow and blue cushions, a table and two chairs, the galley with a black-glass hob under a black hood, and a white marble bathroom with a glass shower screen, a wall-hung WC and a basin on a black metal console." />

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
          baseAlt="The container's back wall seen from inside: red corrugated steel, scuffed, with rust low down and lashing rings, framed by a channel rail below, a square tube above and pressed corner posts, their paint chipped to bare steel, and the corner castings."
          builds={[
            { secs: 2.8, label: "Battens up the wall, then foam sprayed onto the steel between them.", groups: [
              { src: `${D}/render/wall-battens.webp`, rects: wallPieces.battens, kind: "drop", from: 0, to: 0.35 },
              { src: `${D}/render/wall-foam.webp`, rects: wallPieces.foam, kind: "spray", from: 0.45, to: 0.85 },
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
            { title: "Layer 1 · Battens + insulation", text: "38 × 50 treated battens at 600 mm centres, then foam sprayed onto the steel between them, filling the corrugations without a joint." },
            { title: "Layer 2 · Lining panels", text: "12 mm plywood panels, numbered and cut in the workshop, screwed to each batten every 300 mm." },
            { title: "Layer 3 · Paint", text: "Joints and screw heads filled, a vapour-retarding primer, then off-white paint in a satin sheen, rolled on." },
            { title: "The bathroom side", text: "12 mm cement board and a waterproof membrane, then 300 × 600 tiles laid from the floor up." },
          ]} />
      </section>

      {/* Bed: the bed corner as a rail of product cards (after databayt.org's products rail); the card in focus
          shows its size, source and cost below. */}
      <RailSection id="bedroom" title="Bed" items={bedRail()} />
      <RailSection id="seating" title="Seating" items={seatingRail()} />
      <RailSection id="galley" title="Galley" items={galleyRail()} />
      <RailSection id="bath" title="Bath" items={bathRail()} />

      {/* Electric: a plain title, then the studio's wiring drawn full width from its inlet to every circuit. Where the
          power comes from is a site decision; the studio only needs a supply in its inlet. Below it the installation in
          the 3D view's camera (render/electric-line.png, every run in its circuit's colour and every point tagged), the
          finished room (render/electric-real.jpg), then each device on its own. All three come from
          scripts/studio/render/room.html?view=electric, built from render/scene.json. */}
      <ServiceSection id="electrical" title="Electric"
        diagram={<WiringDiagram circuits={circuits} demand={demand} />}
        figure={<TaggedFigure table="/docs/studio-circuits" src={`${D}/render/electric-line.png`} aspect={electricTags.aspect} tags={electricTags.tags}
          alt="Line drawing of the studio from the front with every electrical point and conduit run: the unit board on the back wall by the galley with seven circuits leaving its top, cables along the ceiling edge and straight down to each light, switch and socket, in blue for lights, orange for sockets and green for fixed appliances."
          info={Object.fromEntries(points.map((p) => [p.point, { label: p.description,
            colour: circuits.find((c) => c.circuit === p.circuit)?.colour }]))} />}
        note={<>
          Every run goes up into the ceiling void, along it and straight down to its device. Each tag opens its row
          in the <Link href="/docs/studio-circuits#points" className="underline underline-offset-4">points table</Link>.
          Outside the drawing: C6 leaves through the front wall at the bed end for{" "}
          {points.filter((p) => p.circuit === "C6" && !electricTags.tags.some((t) => t.id === p.point)).map((p) => p.point).join(", ")}{" "}
          on the deck, the stair and the roof. The inlet (PI) is behind the board, and the earth rod (E1) is in a pit
          below it.
        </>}
        real={{ src: `${D}/render/electric-real.jpg`, width: 2400, height: 1100, caption: "Rendered from the design model",
          alt: "The same view rendered as finished: the white unit board with smoked windows on the back wall by the galley, sockets with USB-C over the headboard, the bedside table and the sofa arm, double sockets on the galley wall, a wall fan and the red AC isolator high on the back wall, and slim ceiling lights and alarms." }}
        rail={electricRail(points)} />

      {/* Plumbing, in the Electric section's pattern: the studio's water drawn full width, from the farm's supply
          through the stop valve to every outlet and on to the drains. Below it the installation in the 3D view's camera
          with the sink base cut open and the bathroom's wet walls stripped to the foam (render/plumbing-line.png: every
          run in its system's colour, dashed where a wall or the floor still hides it, every fitting tagged), the
          finished room (render/plumbing-real.jpg), then each fitting on its own. All three come from
          scripts/studio/render/room.html?view=plumbing, built from render/scene.json. */}
      <ServiceSection id="plumbing" title="Plumbing"
        diagram={<PipeDiagram pipes={pipes} fittings={fittings} water={water} />}
        figure={<TaggedFigure table="/docs/studio-pipes" src={`${D}/render/plumbing-line.png`} aspect={plumbingTags.aspect} tags={plumbingTags.tags}
          alt="Line drawing of the studio from the front with the sink base cut open, the bathroom's wet walls stripped to the foam and every pipe run: the stop valve, filter and meter on the main in the sink base, cold in blue along the back wall and up end wall B to every outlet and to the instant heater in the shower, its hose in red to the hand shower, and the drains in brown dropping through the floor."
          info={Object.fromEntries(fittings.map((f) => [f.point, { label: f.description, colour: fittingColour(f, pipes) }]))} />}
        note={<>
          Supplies run inside the units and the walls, then straight up to each outlet; drains drop through the floor and
          hang under it. The sink base and the bathroom&rsquo;s wet walls are drawn open; a run is dashed where a wall or
          the floor still hides it. Each tag opens its row in the{" "}
          <Link href="/docs/studio-pipes#points" className="underline underline-offset-4">points table</Link>. Outside
          the drawing: the main comes in under end B from the farm; D1, D2 and D3 leave for the inspection chamber (IC1)
          and the septic tank, D4 for the grease trap (GT); the vent rises up end B to its terminal (VT), 900 mm above
          the roof guardrail.
        </>}
        real={{ src: `${D}/render/plumbing-real.jpg`, width: 2400, height: 1100,
          caption: <>Rendered from the design model, the sink base and the bathroom&rsquo;s wet walls opened</>,
          alt: "The same view rendered as finished with the sink base cut open and the bathroom's wet walls stripped to the yellow foam: in the sink base the twin drinking-water filters, the blue meter with its brass valve and filter, the angle valves and the trap; in the bathroom the small white instant heater in the shower beside the hand shower on its rail, the pipes along the back wall and up end wall B, the cistern frame behind the flush plate, and the basin's valves and trap under its console." }}
        rail={plumbingRail(fittings)} />

      {/* The reference sections live in the docs (scripts/sync-docs.mjs, src/components/studio/docs-sections.tsx):
          the bill of materials, the circuit and pipe schedules with their points, and the studio's features and
          downloads. A card each, after the execution plan's. */}
      <DocsSection cards={DOCS} />
    </main>
  )
}
