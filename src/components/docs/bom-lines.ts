import type { Locale } from "@/components/internationalization/config"
import type { Words } from "@/components/internationalization/words"
import { cablePart, type Line, MODEL_PART, pipePart } from "@/lib/bom"

// The lines every place's bill shares, built from the place's JSON in the patterns its services pages already read:
// the electrics (a board, its protection, the cable and conduit each circuit takes, every device by kind) and the
// water (each pipe by system and size, the valves and taps, an allowance for fittings), then the trades' labour.
// Lengths are estimates from the drawings' own numbers [E]: a circuit rises from its board to the ceiling, runs along
// it and drops to each point; a pipe takes its drawn runs. Each adds a tenth for bends and offcuts and half a metre a
// point for its terminations. The words are the reader's (D-058); `rw` is a machine draft.

const en = {
  electric: "Electric",
  plumbing: "Plumbing",
  labour: "Labour",
  groups: { board: "Board and protection", cable: "Cable and conduit", devices: "Lights, switches and sockets", pipe: "Pipe", fittings: "Valves, taps and fittings" },
  main: (a?: number) => `Main switch${a ? ` ${a} A` : ""}, double-pole, with a check meter`,
  spd: "Surge protection, type 2",
  rcbo: "RCBO 30 mA type A, one a circuit",
  cable: (mm2: number) => `Cable ${mm2} mm², in conduit`,
  conduit: "PVC conduit 20 mm, boxes and glands",
  pipe: (system: string, dn: number) => system === "cold" || system === "hot" ? `PP-R supply pipe PN20, ${dn} mm` : `uPVC ${system === "vent" ? "vent" : "drain"} pipe, ${dn} mm`,
  fittings: "Pipe fittings and clips (allowance)",
  trades: {
    electrician: "Electrician (RURA class A): install, tests and certificate",
    plumber: "Plumber: install and pressure tests",
    carpenter: "Carpenter: joinery and fitting out",
    builder: "Builder: groundworks and masonry",
    welder: "Welder: steelwork",
    mason: "Mason: stonework",
    gardener: "Gardener: planting",
    transport: "Transport from Kigali",
  },
  linings: "Linings and floor",
  lining: {
    foam: "Closed-cell spray foam between the battens, walls and ceiling",
    battens: "Treated battens 38 × 50, 2.4 m",
    ply: "Plywood 12 mm, 2440 × 1220, lining the walls and ceiling",
    paint: "Primer and off-white paint for the linings",
    dpm: "Polythene membrane 250 µm over the container floor",
    floorPly: "Plywood 12 mm, 2440 × 1220, for the floor",
    spc: "Oak SPC planks 5 mm with underlay",
  },
  joinery: "Joinery",
  boards: {
    ply: "Plywood 18 mm, 2440 × 1220, for the joinery",
    worktop: "Worktop blank 38 mm, 3050 × 650",
    hinge: "Cup hinge 35 mm, soft-close",
    runner: "Drawer runners 450 mm, a pair",
    handle: "Handle 128 mm centres",
    stain: "Medium-oak stain and clear matte varnish",
  },
  units: { each: "each", m: "m", m2: "m²", m3: "m³", set: "set", lot: "lot", kg: "kg", L: "L", sheet: "sheets", pair: "pairs", day: "days", bale: "bales", t: "t" } as Record<string, string>,
  // the bill on a page: how much of it is priced
  lead: (priced: number, lines: number, total: string) => priced === lines
    ? `${lines} lines, about ${total} with a 15 % contingency. Prices are placeholders until three quotes come in for each line.`
    : `${lines} lines; the ${priced} with a price come to about ${total} with a 15 % contingency. The rest are not priced yet: they wait for quotes. Prices are placeholders until three quotes come in for each line.`,
  contingency: "Contingency 15 %",
  total: "Total of the priced lines",
}

const rw: typeof en = {
  electric: "Amashanyarazi",
  plumbing: "Imiyoboro y'amazi",
  labour: "Umurimo",
  groups: { board: "Board n'uburinzi", cable: "Insinga na conduit", devices: "Amatara, switch na priza", pipe: "Amatiyo", fittings: "Valves, robine na fittings" },
  main: (a) => `Main switch${a ? ` ya ${a} A` : ""}, impande zombi, ifite mubazi yo kugenzura`,
  spd: "Uburinzi bw'umuriro mwinshi (surge), type 2",
  rcbo: "RCBO ya 30 mA type A, imwe kuri buri muzunguruko",
  cable: (mm2) => `Insinga ya ${mm2} mm², muri conduit`,
  conduit: "Conduit ya PVC ya mm 20, udusanduku na glands",
  pipe: (system, dn) => system === "cold" || system === "hot" ? `Itiyo y'amazi PP-R PN20, mm ${dn}` : `Itiyo ya uPVC ${system === "vent" ? "y'umwuka" : "y'amazi yanduye"}, mm ${dn}`,
  fittings: "Fittings z'amatiyo n'ibiyafata (amafaranga ateganyijwe)",
  trades: {
    electrician: "Umuyagankuba (RURA class A): gushyiraho, ibizamini n'icyemezo",
    plumber: "Umufundi w'amazi: gushyiraho n'ibizamini by'umuvuduko",
    carpenter: "Umubaji: imbaho n'ibikoresho by'imbere",
    builder: "Umwubatsi: imirimo y'ubutaka n'iy'ubwubatsi",
    welder: "Umusuderi: imirimo y'icyuma",
    mason: "Umufundi w'amabuye",
    gardener: "Umuhinzi w'ubusitani: gutera",
    transport: "Gutwara ibikoresho kuva i Kigali",
  },
  linings: "Ibyomekwa ku nkuta na hasi",
  lining: {
    foam: "Foam ya closed-cell isukwa hagati y'imbaho, ku nkuta no ku gisenge",
    battens: "Imbaho za battens zitunganyijwe 38 × 50, m 2.4",
    ply: "Pulayiwudi mm 12, 2440 × 1220, yomekwa ku nkuta no ku gisenge",
    paint: "Primer n'irangi ry'umweru wijimye by'ibyomekwa",
    dpm: "Polythene 250 µm hejuru y'hasi ha kontineri",
    floorPly: "Pulayiwudi mm 12, 2440 × 1220, yo hasi",
    spc: "Imbaho za SPC zisa n'igiti cya oak mm 5 n'ibiziri munsi",
  },
  joinery: "Imbaho z'ibikoresho",
  boards: {
    ply: "Pulayiwudi mm 18, 2440 × 1220, y'ibikoresho by'imbaho",
    worktop: "Igice cya worktop mm 38, 3050 × 650",
    hinge: "Hinge ya mm 35, ifunga buhoro",
    runner: "Imbangikane y'inzira z'akabati gakururwa mm 450",
    handle: "Handle ya mm 128",
    stain: "Irangi rya medium oak na varnish itabengerana",
  },
  units: { each: "each", m: "m", m2: "m²", m3: "m³", set: "iseti", lot: "byose", kg: "kg", L: "L", sheet: "impapuro", pair: "imbangikane", day: "iminsi", bale: "imiba", t: "t" },
  lead: (priced, lines, total) => priced === lines
    ? `Imirongo ${lines}, hafi ${total} hamwe n'ingoboka ya 15 %. Ibiciro ni iby'agateganyo kugeza haje ibiciro bitatu kuri buri murongo.`
    : `Imirongo ${lines}; ${priced} ifite igiciro igeze hafi ${total} hamwe n'ingoboka ya 15 %. Indi ntirahabwa igiciro: itegereje ibiciro by'abacuruzi. Ibiciro ni iby'agateganyo kugeza haje ibiciro bitatu kuri buri murongo.`,
  contingency: "Ingoboka 15 %",
  total: "Igiteranyo cy'imirongo ifite igiciro",
}

export const bomWords: Words<typeof en> = { en, rw }

type Pt = number[]
const r1 = (n: number) => Math.round(n * 10) / 10
const SLACK = 1.1, TERMINATION = 0.5

// a circuit's route as a tree: up from the board to the ceiling, along it the width of its points, then across and
// down to each point
function treeLength(origin: Pt, points: Pt[], ceil: number, trackY: number): number {
  if (!points.length) return 0
  const xs = [origin[0], ...points.map((p) => p[0])]
  const riser = Math.max(0, ceil - origin[2]) + Math.abs(origin[1] - trackY)
  const along = Math.max(...xs) - Math.min(...xs)
  const drops = points.reduce((n, p) => n + Math.abs(p[1] - trackY) + Math.max(0, ceil - p[2]), 0)
  return (riser + along + drops) * SLACK + TERMINATION * points.length
}
const pathsLength = (paths: Pt[][]) => paths.reduce((n, path) => n + path.slice(1).reduce((m, p, i) => m + Math.hypot(...p.map((v, k) => v - path[i][k])), 0), 0)

// A place's `electric`, in whichever of the three shapes its pages draw: the galley's (bar, galley: a board block,
// tracks under the ceiling, `cable`), the rooms' (guest room, office, study room: the board is a point, `cable_mm2`)
// or the public bathroom's (each circuit's route drawn as `paths`).
type Circuit = { id?: string; circuit?: string; group?: string; cable?: number; cable_mm2?: number; paths?: Pt[][] }
type Point = { id?: string; point?: string; model: string; circuit?: string; at?: Pt | null; face?: string }
export type Electric = {
  circuits: Circuit[]; points: Point[]
  board?: { x?: number; y?: number; h?: number; hh?: number; at?: Pt }; track0?: number
  supply?: { main?: string }; main_A?: number
}

export function electricLines(lang: Locale, e: Electric, opts: {
  /** each device model's name, in the reader's words (the place's rail titles) */
  name: (model: string) => string
  /** a model whose part is not the default (MODEL_PART), or none (undefined) */
  parts?: Record<string, string | undefined>
  /** models not bought with the electrics (drawn for their position only) */
  skip?: string[]
  section?: string
}): Line[] {
  const t = bomWords[lang], section = opts.section ?? t.electric
  const pid = (c: Circuit) => c.id ?? c.circuit ?? ""
  const at = (p: Point) => p.at ?? undefined
  // the board: its block's top (the galley's shape), or its point (the rooms'), or the public bathroom's board
  const dbPoint = e.points.find((p) => p.model === "board")
  const origin: Pt = e.board?.x !== undefined ? [e.board.x, e.board.y ?? 0, (e.board.h ?? 1.6) + (e.board.hh ?? 0) / 2]
    : e.board?.at ?? at(dbPoint ?? { model: "" }) ?? [0, 0, 1.6]
  const lit = e.points.filter((p) => p.at && (p.face === "down" || /ceiling|pendant|light|batten/.test(p.model)))
  const ceil = lit.length ? Math.max(...lit.map((p) => p.at![2])) : 2.3
  // each circuit's cable, by size
  const cable = new Map<number, number>()
  let conduit = 0
  e.circuits.forEach((c, k) => {
    if (c.group === "spare") return
    const pts = e.points.filter((p) => p.circuit === pid(c) && p.at).map((p) => p.at!)
    const m = c.paths ? pathsLength(c.paths) * SLACK + TERMINATION * pts.length
      : treeLength(origin, pts, ceil, e.track0 !== undefined ? e.track0 - k * 0.06 : origin[1])
    const mm2 = c.cable ?? c.cable_mm2 ?? 2.5
    cable.set(mm2, (cable.get(mm2) ?? 0) + m)
    conduit += m
  })
  const ways = e.circuits.filter((c) => c.group !== "spare").length
  const amps = e.main_A ?? (Number(e.supply?.main?.match(/(\d+)\s*A/)?.[1]) || undefined)
  const lines: Line[] = [
    { section, group: t.groups.board, item: t.main(amps), qty: 1, unit: "set", part: "mainsw" },
    { section, group: t.groups.board, item: t.spd, qty: 1, unit: "each", part: "spd" },
    { section, group: t.groups.board, item: t.rcbo, qty: ways, unit: "each", part: "rcbo" },
    ...[...cable].sort(([a], [b]) => a - b).map(([mm2, m]): Line => ({ section, group: t.groups.cable, item: t.cable(mm2), qty: r1(m), unit: "m", part: cablePart(mm2) })),
    { section, group: t.groups.cable, item: t.conduit, qty: r1(conduit), unit: "m", part: "conduit" },
  ]
  // every device, by kind, in the order the page lists them; the board with its protection
  const models = [...new Set(e.points.map((p) => p.model))].filter((m) => !opts.skip?.includes(m))
  for (const m of models) {
    const n = e.points.filter((p) => p.model === m).length
    const part = opts.parts && m in opts.parts ? opts.parts[m] : MODEL_PART[m]
    lines.push({ section, group: m === "board" || m === "earth" ? t.groups.board : t.groups.devices, item: opts.name(m), qty: n, unit: "each", part })
  }
  lines.push({ section, group: t.labour, item: t.trades.electrician, qty: 1, unit: "lot" })
  return lines
}

// A place's `water`: its runs (supply and drains, as the plumbing page draws them) and its points by kind
// the water points' kinds as the catalogue's parts; a kind not here is not priced unless the place names its part
const WATER_PART: Record<string, string | undefined> = { meter: "watermeter", aav: "aav", mixer: "tap", basintap: "tap", tap: "tap", filter: "filter", anglevalve: "anglevalve" }

type Run = { id?: string; run?: string; system: string; dn: number; paths?: Pt[][] }
type WaterPoint = { item?: string; at?: Pt | null }
export type Water = { runs: Run[]; points?: WaterPoint[] }

export function waterLines(lang: Locale, w: Water, opts: {
  /** each point's kind (its `item`) named in the reader's words */
  name: (item: string) => string
  /** a kind whose part is not the default (WATER_PART), or none (undefined) */
  parts?: Record<string, string | undefined>
  /** kinds bought with something else (a machine's own feed hose) */
  skip?: string[]
  section?: string
}): Line[] {
  const t = bomWords[lang], section = opts.section ?? t.plumbing
  // each run's pipe as the size it is bought in: hot and cold take the same PP-R, and a size the catalogue has no
  // pipe for takes the next one up (a 15 mm feed is 20 mm PP-R, a 32 mm drain 40 mm uPVC)
  const pipe = new Map<string, { system: string; dn: number; m: number }>()
  for (const r of w.runs) {
    const system = r.system === "hot" ? "cold" : r.system, part = pipePart(system, r.dn)
    const dn = part ? Number(part.match(/(\d+)$/)![1]) : r.dn
    const key = `${system === "cold" ? "supply" : system === "vent" ? "vent" : "drain"}|${dn}`
    const m = r.paths ? pathsLength(r.paths) * SLACK : 0
    const was = pipe.get(key) ?? { system, dn, m: 0 }
    pipe.set(key, { ...was, m: was.m + m })
  }
  const lines: Line[] = [...pipe.values()].sort((a, b) => Number(a.system !== "cold") - Number(b.system !== "cold") || a.dn - b.dn)
    .map((p) => ({ section, group: t.groups.pipe, item: t.pipe(p.system, p.dn), qty: r1(p.m), unit: "m", part: pipePart(p.system, p.dn) }))
  const kinds = [...new Set((w.points ?? []).map((p) => p.item).filter((k): k is string => !!k))].filter((k) => !opts.skip?.includes(k))
  for (const k of kinds) {
    const part = opts.parts && k in opts.parts ? opts.parts[k] : WATER_PART[k]
    lines.push({ section, group: t.groups.fittings, item: opts.name(k), qty: (w.points ?? []).filter((p) => p.item === k).length, unit: "each", part })
  }
  lines.push({ section, group: t.groups.fittings, item: t.fittings, qty: 1, unit: "set", part: "fittings" })
  lines.push({ section, group: t.labour, item: t.trades.plumber, qty: 1, unit: "lot" })
  return lines
}

const SHEET = 2.44 * 1.22
const sheets = (m2: number, waste: number) => Math.ceil((m2 * waste) / SHEET)

/** A container's linings and floor, as the studio builds them (D-021, its materials page): closed-cell foam between
 *  treated battens on the walls and the ceiling, 12 mm ply over it, primed and painted; on the floor a membrane,
 *  12 mm ply and SPC planks. `l`, `w` and `h` are the inside's; `ends` the end walls lined (a cargo-door end used as
 *  the way in is not); `open` the openings' area cut from the walls. */
export function liningLines(lang: Locale, box: { l: number; w: number; h: number; ends: number; open?: number }, section?: string): Line[] {
  const t = bomWords[lang], sec = section ?? t.linings
  const walls = 2 * box.l * box.h + box.ends * box.w * box.h - (box.open ?? 0)
  const lined = walls + box.l * box.w, floor = box.l * box.w
  return [
    { section: sec, item: t.lining.foam, qty: r1(lined), unit: "m2", part: "sprayfoam" },
    { section: sec, item: t.lining.battens, qty: Math.ceil((lined * 1.8 * 1.1) / 2.4), unit: "each", part: "batten" },
    { section: sec, item: t.lining.ply, qty: sheets(lined, 1.15), unit: "sheet", part: "sheet_PLY12" },
    { section: sec, item: t.lining.paint, qty: Math.ceil((lined * 2) / 10), unit: "L", part: "varnish" },
    { section: sec, item: t.lining.dpm, qty: r1(floor * 1.15), unit: "m2", part: "dpm" },
    { section: sec, item: t.lining.floorPly, qty: sheets(floor, 1.1), unit: "sheet", part: "sheet_PLY12" },
    { section: sec, item: t.lining.spc, qty: r1(floor * 1.08), unit: "m2", part: "spc" },
  ]
}

/** A run of cabinets as the area of 18 mm board it takes [E]: an end every `unit` metres plus one, a bottom, a back
 *  and the fronts; open shelves pass `fronts: false`. */
export function carcassArea(run: { l: number; d: number; h: number; unit?: number; back?: boolean; fronts?: boolean }): number {
  const n = Math.max(1, Math.round(run.l / (run.unit ?? 0.6)))
  return (n + 1) * run.d * run.h + run.l * run.d + (run.back === false ? 0 : run.l * run.h) + (run.fronts === false ? 0 : run.l * run.h)
}

/** The joinery's materials: the board for its pieces (`m2`, from carcassArea), the worktop blanks for `worktop`
 *  metres of top, the hinges, runners and handles, and the finish. The pieces themselves are the carpenter's to quote. */
export function boardLines(lang: Locale, j: { m2: number; worktop?: number; hinges?: number; runners?: number; handles?: number }, section?: string): Line[] {
  const t = bomWords[lang], sec = section ?? t.joinery
  return [
    { section: sec, item: t.boards.ply, qty: sheets(j.m2, 1.2), unit: "sheet", part: "sheet_PLY18" },
    { section: sec, item: t.boards.worktop, qty: Math.ceil((j.worktop ?? 0) / 3.0), unit: "each", part: "sheet_WTOP38" },
    { section: sec, item: t.boards.hinge, qty: j.hinges ?? 0, unit: "each", part: "hinge" },
    { section: sec, item: t.boards.runner, qty: j.runners ?? 0, unit: "pair", part: "runner" },
    { section: sec, item: t.boards.handle, qty: j.handles ?? 0, unit: "each", part: "handle" },
    { section: sec, item: t.boards.stain, qty: Math.ceil((j.m2 * 2) / 12), unit: "L", part: "stain" },
  ]
}

/** A trade's labour as a lot, not priced: the place's own quote, as the studio prices its trades. */
export const labourLine = (lang: Locale, trade: keyof typeof en.trades, section?: string): Line =>
  ({ section: section ?? bomWords[lang].labour, item: bomWords[lang].trades[trade], qty: 1, unit: "lot" })
