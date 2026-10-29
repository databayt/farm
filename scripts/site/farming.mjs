#!/usr/bin/env node
// The vegetable field that feeds the galley: how many beds each crop needs for a full house every day,
// where they lie in the vegetable zone, when to plant them, the water and what it all costs.
//
//   node scripts/site/farming.mjs          # src/components/farming/farming.json + site.json (zone `veg`)
//                                           #   -> public/designs/farming/data/{plan.json,crops.csv,bom.csv}
//   node scripts/site/farming.mjs --check  # the same, and fails if the beds don't fit the zone, a bed grows
//                                           #   the same family two seasons running, or the plate isn't met
//
// Beds per crop: the galley's kg a week, times the weeks a bed is in the ground, over what one bed gives in
// a cycle; then more for the weeks the beds rest and for losses. Beds fill the zone in blocks of ten, the
// crops picked every day nearest the gate on the garden walk, so the cook walks least.
import { mkdirSync, readFileSync, writeFileSync } from "node:fs"
import { dirname, join } from "node:path"
import { fileURLToPath } from "node:url"

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..", "..")
const F = JSON.parse(readFileSync(join(ROOT, "src", "components", "farming", "farming.json"), "utf8"))
const site = JSON.parse(readFileSync(join(ROOT, "src", "components", "site", "site.json"), "utf8"))
const OUT = join(ROOT, "public", "designs", "farming", "data")
const CHECK = process.argv.includes("--check")

const r1 = (n) => Math.round(n * 10) / 10
const r2 = (n) => Math.round(n * 100) / 100
const { bed, people, season } = F
const bedM2 = bed.w * bed.l
// people fed a day: every guest two meals, the team one of their two
const eaters = people.guests + people.team * people.teamMealShare
const rest = 52 / season.weeks

// ------------------------------------------------------------ beds per crop
const crops = F.crops.map((c) => {
  const kgWeek = (c.g * eaters * 7) / 1000
  const cycleKg = c.yieldKgM2 * bedM2 // one bed, one planting
  const inGround = c.firstWeeks + c.harvestWeeks // weeks a planting holds its bed
  const beds = Math.ceil(((kgWeek * inGround) / cycleKg) * rest * (1 + bed.loss))
  // plant a batch every few weeks so the harvest never stops: as often as each planting's harvest lasts,
  // at most every 4 weeks
  const every = Math.max(1, Math.min(4, c.harvestWeeks))
  const batches = Math.max(1, Math.round(inGround / every))
  return {
    ...c, kgWeek: r1(kgWeek), cycleKg: r1(cycleKg), inGround, beds, every, batches, batch: Math.ceil(beds / batches),
    plantsPerBed: Math.floor(bed.l / c.plantM) * c.rows,
    averageKgWeek: r1((c.g * (people.averageGuests + people.team * people.teamMealShare) * 7) / 1000),
  }
})

// ------------------------------------------------------------ the layout
// Blocks of ten beds in the zone; beds run along x (10 m), side by side down y. A 2 m main path crosses the
// field where the garden walk arrives from the galley (east), with the blocks above and below it.
const zone = site.zones.find((z) => z.id === "veg").rect
const yard = site.zones.find((z) => z.id === "yard").rect
const walk = site.paths.find((p) => p.id === "kitchen-walk")
const blockW = bed.l, blockH = bed.perBlock * bed.w + (bed.perBlock - 1) * bed.path
const MAIN = 2
// the start: only the rows of blocks nearest the gate (D-050); the zone holds more
const cols = Math.min(F.start.rows, Math.floor((zone[2] - zone[0] - bed.aisle) / (blockW + bed.aisle)))
const fits = Math.floor((zone[3] - zone[1] - bed.aisle - MAIN) / (blockH + bed.aisle))
const rowsAbove = Math.ceil(fits / 2), rowsBelow = fits - rowsAbove
// the main path centred on the walk where the rows fit, else as near as they allow
const lo = zone[1] + bed.aisle + rowsAbove * blockH + (rowsAbove - 1) * bed.aisle + MAIN / 2
const hi = zone[3] - bed.aisle - rowsBelow * blockH - (rowsBelow - 1) * bed.aisle - MAIN / 2
const mainY = r2(Math.min(hi, Math.max(lo, walk.points[0][1])))
const x0 = zone[2] - bed.aisle - cols * blockW - (cols - 1) * bed.aisle // flush to the gate side
const blocks = []
for (let r = 0; r < fits; r++) {
  const above = r < rowsAbove
  const k = above ? rowsAbove - 1 - r : r - rowsAbove // 0 = beside the main path
  const y = above ? mainY - MAIN / 2 - (k + 1) * blockH - k * bed.aisle : mainY + MAIN / 2 + k * (blockH + bed.aisle)
  for (let c = 0; c < cols; c++) blocks.push({ id: `${String.fromCharCode(65 + r)}${c + 1}`, x: r2(x0 + c * (blockW + bed.aisle)), y: r2(y), w: blockW, h: r2(blockH) })
}
const gate = [zone[2], mainY]
const beds = blocks.flatMap((b) => Array.from({ length: bed.perBlock }, (_, i) => ({
  id: `${b.id}-${String(i + 1).padStart(2, "0")}`, block: b.id, x: b.x, y: r2(b.y + i * (bed.w + bed.path)), w: bed.l, h: bed.w,
})))
// nearest the gate first, counted along the paths: across to the main path, then along it
const walkTo = (b) => Math.abs(b.y + b.h / 2 - mainY) + (gate[0] - (b.x + b.w))
beds.sort((a, b) => walkTo(a) - walkTo(b) || a.id.localeCompare(b.id))
// the crops picked daily nearest, then the rest by family so a family keeps its beds together
const ORDER = ["herbs", "chilli", "amaranth", "kale", "spinach", "tomato", "pepper", "eggplant", "cucumber", "beans", "cabbage", "carrot", "onion", "potato"]
// a full house needs `needed` beds; a smaller start gives every crop its share, at least one bed each
const full = crops.reduce((n, c) => n + c.beds, 0)
const share = Math.min(1, beds.length / full)
for (const c of crops) {
  c.planted = Math.max(1, Math.floor(c.beds * share))
  c.batch = Math.ceil(c.planted / c.batches) // the start's batches, from its own beds
}
let next = 0
for (const id of ORDER) {
  const c = crops.find((x) => x.id === id)
  for (let i = 0; i < c.planted && next < beds.length; i++) beds[next++].crop = id
}
const needed = crops.reduce((n, c) => n + c.planted, 0)
for (; next < beds.length; next++) beds[next].crop = "rest"
beds.sort((a, b) => a.id.localeCompare(b.id))

// next season each family moves on to the beds of the family after it (nightshades -> brassicas -> ...),
// so no bed grows the same family twice running
const famOf = (id) => (id === "rest" ? "rest" : crops.find((c) => c.id === id).family)
const FAMILIES = [...new Set(ORDER.map(famOf))]
const rotation = Object.fromEntries(FAMILIES.map((f, i) => [f, FAMILIES[(i + 1) % FAMILIES.length]]))

// ------------------------------------------------------------ water, fence, nursery
const plantedM2 = needed * bedM2
const water = { dryLow: r1((plantedM2 * 4.1) / 1000), dryHigh: r1((plantedM2 * 5.3) / 1000), wet: r1((plantedM2 * 1.5) / 1000) }
const fx0 = x0 - bed.aisle / 2, fy0 = Math.min(...blocks.map((b) => b.y)) - bed.aisle / 2
const fx1 = zone[2], fy1 = Math.max(...blocks.map((b) => b.y + b.h)) + bed.aisle / 2
const fenceM = r1(2 * (fx1 - fx0 + fy1 - fy0))
const nursery = { x: r2(yard[0] + 1), y: r2(fy0 + 1), w: F.nursery.w, h: F.nursery.l }
// the fruit row along the field's back fence, outside it: banana mats and fruit trees in turn, 3 m apart (D-052)
const fruit = Array.from({ length: Math.floor((fy1 - fy0 - F.fruit.spacing) / F.fruit.spacing) + 1 }, (_, k) => {
  const kind = F.fruit.pattern[k % F.fruit.pattern.length]
  return { kind, x: r2(fx0 - F.fruit.offset), y: r2(fy0 + F.fruit.spacing / 2 + k * F.fruit.spacing), r: F.fruit.kinds[kind].r }
})

// ------------------------------------------------------------ the drip installation
// The farm's tank and pump (site.json) feed a 40 mm main down to the garden walk and along it to the gate. Inside, a
// 32 mm supply runs along the main path to the middle aisle, and up and down the gate-side end of each column of
// blocks; every block has its own valve where its header leaves the supply, and its header runs across the
// block's end, feeding two drip lines down each planted bed. The disc filter stands at the tank. Positions in
// site metres; the 3D, the water diagram and the points table all read them from here.
const [tx, ty] = site.features.find((f) => f.id === "tank").circle
const colX = [...new Set(blocks.map((b) => b.x))].map((x) => r2(x + blockW + bed.aisle * 0.35)) // each column's end, in the aisle
const near = (b) => (b.y + b.h <= mainY ? b.y + b.h : b.y) // the block's end toward the main path
const len = (pts) => pts.slice(1).reduce((n, p, i) => n + Math.hypot(p[0] - pts[i][0], p[1] - pts[i][1]), 0)
const runs = [{ id: "M1", kind: "main", dn: 40, path: [[tx, ty], [tx, mainY], gate] }]
runs.push({ id: "S1", kind: "supply", dn: 32, path: [gate, [colX[0], mainY]] })
colX.forEach((x) => {
  const col = blocks.filter((b) => r2(b.x + blockW + bed.aisle * 0.35) === x)
  for (const b of col) {
    const y = near(b), off = Math.abs(y - mainY) > MAIN ? 0.15 : 0 // a block away from the path takes its own line past its neighbour
    if (y !== mainY) runs.push({ id: `S-${b.id}`, kind: "supply", dn: 32, path: [[x + off, mainY], [x + off, y]] })
    runs.push({ id: `H-${b.id}`, kind: "header", dn: 32, block: b.id, path: [[x + off, b.y], [x + off, b.y + b.h]] })
  }
})
const metres = (kind) => r1(runs.filter((r) => r.kind === kind).reduce((n, r) => n + len(r.path), 0))
const drip = beds.filter((b) => b.crop !== "rest")
const irrigation = {
  tank: [tx, ty], filter: [tx, ty + 2], main: { dn: 40, m: Math.ceil(metres("main") * 1.05) },
  pipe32m: Math.ceil((metres("supply") + metres("header")) * 1.05), dripM: drip.length * 2 * bed.l, lines: drip.length * 2,
  runs: runs.map((r) => ({ ...r, m: r1(len(r.path)) })),
  valves: blocks.map((b) => {
    const x = r2(b.x + blockW + bed.aisle * 0.35) + (Math.abs(near(b) - mainY) > MAIN ? 0.15 : 0)
    return { id: `V${b.id}`, block: b.id, at: [r2(x), r2(near(b))], beds: beds.filter((d) => d.block === b.id && d.crop !== "rest").length }
  }),
}

// ------------------------------------------------------------ bill of materials
const per = { once: 1, bed: needed, block: Math.ceil(needed / bed.perBlock), m: fenceM, main: irrigation.main.m, pipe32: irrigation.pipe32m }
const bom = F.bom.lines.map((l) => {
  const qty = r1(l.qty * per[l.per])
  return { section: l.section, item: l.item, qty, unit: l.unit, rwf: l.rwf, total: Math.round(qty * l.rwf) }
})
const subtotal = bom.reduce((n, l) => n + l.total, 0)
const contingency = Math.round(subtotal * F.bom.contingency)

// ------------------------------------------------------------ checks
const errors = []
if (needed > beds.length) errors.push(`the start plants ${needed} beds but holds ${beds.length}`)
const inZone = (b) => b.x >= zone[0] && b.y >= zone[1] && b.x + b.w <= zone[2] && b.y + b.h <= zone[3]
for (const b of blocks) if (!inZone(b)) errors.push(`block ${b.id} leaves the zone`)
for (const b of beds) if (b.crop !== "rest" && rotation[famOf(b.crop)] === famOf(b.crop)) errors.push(`bed ${b.id} repeats its family`)
const kgWeek = crops.reduce((n, c) => n + c.kgWeek, 0)
const grown = crops.reduce((n, c) => n + (c.planted * c.cycleKg * 52) / c.inGround / rest / (1 + bed.loss) / 52, 0)
const averageKg = crops.reduce((n, c) => n + c.averageKgWeek, 0)
if (grown < averageKg) errors.push(`the beds give ${r1(grown)} kg a week, under an average week's ${r1(averageKg)}`)

// ------------------------------------------------------------ write
mkdirSync(OUT, { recursive: true })
const plan = {
  _: "Generated by scripts/site/farming.mjs from src/components/farming/farming.json and site.json; do not edit.",
  eaters, kgWeek: r1(kgWeek), averageKgWeek: r1(crops.reduce((n, c) => n + c.averageKgWeek, 0)),
  bedsNeeded: needed, bedsFull: full, grownKgWeek: r1(grown), coverFull: Math.round((grown / kgWeek) * 100), bedsTotal: beds.length, bedM2, plantedM2, water, fenceM,
  zone, yard, mainY, main: MAIN, gate, fence: [r2(fx0), r2(fy0), r2(fx1), r2(fy1)], nursery,
  walk: [[zone[2], mainY], [walk.points.at(-1)[0], mainY]], fruit,
  blocks, beds, rotation, irrigation,
  crops: crops.map(({ id, name, family, g, spacing, rows, plantM, nursery, firstWeeks, harvestWeeks, yieldKgM2, yieldNote, watch, plantHeight, colour, kgWeek, averageKgWeek, cycleKg, inGround, beds, planted, every, batch, plantsPerBed }) =>
    ({ id, name, family, g, spacing, rows, plantM, nursery, firstWeeks, harvestWeeks, yieldKgM2, yieldNote, watch, plantHeight, colour, kgWeek, averageKgWeek, cycleKg, inGround, beds, planted, every, batch, plantsPerBed })),
  bom, subtotal, contingency, total: subtotal + contingency,
}
writeFileSync(join(OUT, "plan.json"), JSON.stringify(plan, null, 1) + "\n")
const csv = (rows) => [Object.keys(rows[0]).join(","), ...rows.map((r) => Object.values(r).map((v) => (/[",]/.test(String(v)) ? `"${String(v).replace(/"/g, '""')}"` : v)).join(","))].join("\n") + "\n"
writeFileSync(join(OUT, "crops.csv"), csv(plan.crops.map(({ id, name, g, kgWeek, averageKgWeek, beds, every, batch, spacing, firstWeeks, harvestWeeks, yieldKgM2, watch }) =>
  ({ id, name, grams_per_guest_day: g, galley_kg_week_full: kgWeek, galley_kg_week_average: averageKgWeek, beds, plant_every_weeks: every, beds_per_planting: batch, spacing_cm: spacing, weeks_to_first_harvest: firstWeeks, harvest_weeks: harvestWeeks, yield_kg_m2: yieldKgM2, watch }))))
writeFileSync(join(OUT, "bom.csv"), csv(bom))

console.log(`${needed} of ${beds.length} beds planted (${full} for a full house), ${r1(grown)} of ${r1(kgWeek)} kg a week for ${eaters} people a day; water ${water.dryLow}-${water.dryHigh} m3/day dry; RWF ${(plan.total / 1e6).toFixed(2)}M to start`)
for (const c of crops) console.log(`  ${c.id.padEnd(9)} ${String(c.kgWeek).padStart(5)} kg/wk  ${String(c.planted).padStart(3)} beds (${c.beds} full)  plant ${c.batch} every ${c.every} wk`)
if (errors.length) {
  for (const e of errors) console.error(`  ✗ ${e}`)
  if (CHECK) process.exit(1)
}
