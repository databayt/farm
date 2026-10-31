#!/usr/bin/env node
// Measured drawings for the carpenter's guide: one simple sheet per step, every size written on it.
//
//   node scripts/studio/guide-drawings.mjs     # -> public/designs/studio/guide/<name>.<en|rw>.svg
//
// Reads the generator's own outputs (render/scene.json, data/dims.json, data/battens.csv,
// data/cut-list.csv), so run it after `pnpm studio:build`; the sizes follow the survey from then on.
// Units are millimetres. Plan views: x from the finished face of end A, y from the finished back wall.
import { mkdirSync, readFileSync, writeFileSync } from "node:fs"
import { dirname, join } from "node:path"
import { fileURLToPath } from "node:url"

import { C, Sheet } from "./sheet.mjs"

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..", "..")
const D = join(ROOT, "public", "designs", "studio")
const scene = JSON.parse(readFileSync(join(D, "render", "scene.json"), "utf8"))
const dims = JSON.parse(readFileSync(join(D, "data", "dims.json"), "utf8"))
const csv = (f) => {
  const [h, ...rows] = readFileSync(join(D, "data", f), "utf8").trim().split("\n")
  const keys = h.split(",")
  return rows.map((r) => Object.fromEntries(r.match(/("([^"]|"")*"|[^,]*)(,|$)/g).slice(0, keys.length)
    .map((c, i) => [keys[i], c.replace(/,$/, "").replace(/^"|"$/g, "").replace(/""/g, '"')])))
}
const battens = csv("battens.csv")
const parts = csv("cut-list.csv")
const OUT = join(D, "guide")
mkdirSync(OUT, { recursive: true })

const T = {
  en: {
    endA: "END A", endB: "END B", back: "BACK WALL", front: "FRONT WALL", bed: "BED", bedside: "BEDSIDE",
    sofa: "SOFA", table: "TABLE", chair: "CHAIR", kitchen: "KITCHEN", fridge: "FRIDGE", hob: "HOB", sink: "SINK",
    shower: "SHOWER", wc: "WC", bathroom: "BATHROOM", wash: "LOBBY", door: "DOOR", slidingDoor: "SLIDING DOOR", leaf: "leaf",
    slider: "SLIDING GLASS DOOR", w1: "WINDOW W1", partition: "PARTITION", fromA: "measured from the finished face of end A",
    fromAsteel: "measured from the steel of end A", fromBack: "measured from the steel of the back wall",
    length: "length", width: "width", height: "height", diag: "both diagonals: write the difference",
    level: "level: highest minus lowest corner", at1m: "1 m above the floor", sliderOpen: "slider opening: start and end",
    oldDoor: "old narrow door: start and end", write: "____ mm", steel: "steel", batten: "batten 38 + spray foam",
    ply12: "plywood 12", membrane: "membrane", cfloor: "container floor 28 (treated)", oak: "oak plank 5",
    sheet: "plywood sheet 12", wall: "WALL", floorW: "FLOOR", ceiling: "CEILING", room: "room height",
    box: "steel to steel", run1: "run 1", run2: "run 2", cut: "cut", offcut: "from the run-1 offcut",
    gaps: "3 mm between sheets · 5 mm from the steel · screws 4 × 30 every 300 × 300",
    centres: "batten centres", joint: "panel joint", screws: "winged screws 5.5 × 50: both ends + every 600",
    head: "head battens", sliderGap: "sliding door opening", ceilingB: "CEILING (seen from below)",
    panels: "lining panels, plywood 12 (ids from the cut list)", over: "over the slider", tray: "tray 1000 × 900",
    glass: "fixed glass", heater: "instant heater in the shower",
    worktop: "worktop 38", legs: "legs", overhead: "wall cabinet", hood: "chimney hood", plinth: "plinth",
    depth: "bases 600 deep · worktop 620 deep", frontView: "seen from the living room, facing the partition",
    fromBackFin: "from the finished back wall", up: "up from the finished floor", ledge: "ledge",
    wallTitle: "WALL: steel → room", floorTitle: "FLOOR: on the container floor 28 (treated)", ceilTitle: "CEILING: roof steel → room",
  },
  rw: {
    endA: "IMPERA A", endB: "IMPERA B", back: "URUKUTA RW'INYUMA", front: "URUKUTA RW'IMBERE", bed: "IGITANDA",
    bedside: "AKAMEZA", sofa: "SOFA", table: "AMEZA", chair: "INTEBE", kitchen: "IGIKONI", fridge: "FRIGO",
    hob: "AMASHYIGA", sink: "EVIYE", shower: "DOUCHE", wc: "WC", bathroom: "UBWIHERERO",
    wash: "IMBERE Y'UBWIHERERO", door: "URUGI", slidingDoor: "URUGI RUNYERERA", leaf: "urugi", slider: "URUGI RW'IKIRAHURE", w1: "IDIRISHYA W1", partition: "PARTITION",
    fromA: "bipimwe uhereye ku rukuta rurangiye rwa end A", fromAsteel: "bipimwe uhereye ku cyuma cya end A",
    fromBack: "bipimwe uhereye ku cyuma cy'urukuta rw'inyuma", length: "uburebure", width: "ubugari",
    height: "uburebure bwo hejuru", diag: "diyagonale zombi: andika itandukaniro",
    level: "level: inguni iri hejuru ukuyemo iri hasi", at1m: "m 1 hejuru ya hasi",
    sliderOpen: "urugi runyerera: aho rutangirira n'aho rurangirira", oldDoor: "urugi rwa kera: aho rutangirira n'aho rurangirira",
    write: "____ mm", steel: "icyuma", batten: "igiti 38 + spray foam", ply12: "pulayiwudi 12", membrane: "membrane",
    cfloor: "hasi ha kontineri 28 (hatewe umuti)", oak: "imbaho z'igiti 5", sheet: "urupapuro rwa pulayiwudi 12",
    wall: "URUKUTA", floorW: "HASI", ceiling: "IGISENGE", room: "uburebure bw'icyumba", box: "icyuma ku cyuma",
    run1: "umurongo 1", run2: "umurongo 2", cut: "kata", offcut: "kivuye ku gisigazwa cy'umurongo 1",
    gaps: "mm 3 hagati y'impapuro · mm 5 ku cyuma · vis 4 × 30 buri 300 × 300", centres: "hagati ya buri giti",
    joint: "aho impapuro zihurira", screws: "vis zifite amababa 5.5 × 50: ku mpera zombi + buri 600",
    head: "ibiti byo hejuru", sliderGap: "umwanya w'urugi runyerera", ceilingB: "IGISENGE (urebye uri hasi)",
    panels: "impapuro za lining, pulayiwudi 12 (nimero zo muri cut list)", over: "hejuru y'urugi runyerera",
    tray: "tray 1000 × 900", glass: "ikirahure gihamye", heater: "heater ihita ishyushya amazi, muri douche",
    worktop: "worktop 38", legs: "amaguru", overhead: "akabati ko hejuru", hood: "hotte ifite chimney", plinth: "plinth",
    depth: "ubujyakuzimu: ibice byo hasi 600 · worktop 620", frontView: "urebye uri mu cyumba, ureba partition",
    fromBackFin: "uhereye ku rukuta rurangiye rw'inyuma", up: "uhereye hasi harangiye ujya hejuru", ledge: "ledge",
    wallTitle: "URUKUTA: icyuma → icyumba", floorTitle: "HASI: hejuru ya hasi ha kontineri 28 (hatewe umuti)",
    ceilTitle: "IGISENGE: icyuma cy'igisenge → icyumba",
  },
}

const write = (name, lang, s) => writeFileSync(join(OUT, `${name}.${lang}.svg`), s.svg())
const r = Math.round
const { L, W, H } = scene
const E = scene.lining // 50: steel to the finished face
const ext = (lo, hi) => lo // readability helper (unused branch kept tiny)
void ext

// ------------------------------------------------------------------ 1. what to measure (Day 1)
function measure(t, lang) {
  const IL = dims.int_l, IW = dims.int_w
  const s = new Sheet(-900, -900, IL + 2600, IW + 3150)
  s.rect(0, 0, IL, IW, C.soft, C.steel, 30)
  for (const [x, y] of [[0, 0], [IL, 0], [0, IW], [IL, IW]]) s.rect(x - 90, y - 90, 180, 180, C.steel, C.ink, 6)
  s.text(-300, IW / 2, t.endA, { size: 110, weight: 700, rotate: -90 })
  s.text(IL + 300, IW / 2, t.endB, { size: 110, weight: 700, rotate: -90 })
  s.text(IL / 2, -330, t.back, { size: 110, weight: 700 })
  // 1 length, 2 width
  s.line(0, IW * 0.3, IL, IW * 0.3, C.dim, 10); s.badge(IL * 0.5, IW * 0.3, "1")
  s.text(IL * 0.5, IW * 0.3 + 160, `${t.length}, ${t.at1m}: ${t.write}`, { size: 105, fill: C.dim, weight: 700 })
  s.line(IL * 0.72, 0, IL * 0.72, IW, C.dim, 10); s.badge(IL * 0.72, IW * 0.62, "2")
  s.text(IL * 0.72 + 140, IW * 0.62, `${t.width}: ${t.write}`, { size: 105, fill: C.dim, weight: 700, anchor: "start" })
  // 6 diagonals
  s.line(0, 0, IL, IW, C.dim, 6, "60 50"); s.line(0, IW, IL, 0, C.dim, 6, "60 50"); s.badge(IL * 0.25, IW * 0.75, "6")
  s.text(IL * 0.25 + 140, IW * 0.75, `${t.diag}: ${t.write}`, { size: 100, fill: C.dim, weight: 700, anchor: "start" })
  // 7 level at the corners
  s.badge(-260, -260, "7"); s.text(-120, -260, `${t.level}: ${t.write}`, { size: 100, fill: C.dim, weight: 700, anchor: "start" })
  // front wall openings below: 4 slider, 5 old door, 3 height
  const fy = IW + 650
  s.text(IL / 2, IW + 260, t.front, { size: 110, weight: 700 })
  s.rect(0, fy, IL, 700, C.soft, C.steel, 20)
  const o1 = scene.o1.map((v) => v + E), o2 = scene.o2.map((v) => v + E)
  s.rect(o1[0], fy, o1[1] - o1[0], 700, C.wet, C.ink, 6); s.rect(o2[0], fy, o2[1] - o2[0], 700, C.wet, C.ink, 6)
  s.badge((o1[0] + o1[1]) / 2, fy + 350, "4"); s.badge((o2[0] + o2[1]) / 2, fy + 350, "5")
  s.text(o1[0], fy + 860, `4 · ${t.sliderOpen}: ${t.write} / ${t.write}`, { size: 95, fill: C.dim, weight: 700, anchor: "start" })
  s.text(o1[0], fy + 1010, `5 · ${t.oldDoor}: ${t.write} / ${t.write}`, { size: 95, fill: C.dim, weight: 700, anchor: "start" })
  s.line(IL * 0.06, fy, IL * 0.06, fy + 700, C.dim, 10); s.badge(IL * 0.06, fy + 350, "3")
  s.text(o1[0], fy + 1160, `3 · ${t.height}: ${t.write}`, { size: 95, fill: C.dim, weight: 700, anchor: "start" })
  s.text(0, fy + 1330, `${t.fromAsteel}`, { size: 90, anchor: "start" })
  write("measure", lang, s)
}

// ------------------------------------------------------------------ 2. the room from above, finished sizes
function plan(t, lang) {
  const s = new Sheet(-700, -1350, L + 1400, W + 2500)
  s.rect(-E, -E, L + 2 * E, W + 2 * E, C.steel, "none", 0)
  s.rect(0, 0, L, W, "#fbf8f1", C.ink, 10)
  // openings in the front wall (y = W)
  for (const [a, b] of [scene.o1, scene.o2]) { s.rect(a, W - 5, b - a, E + 10, C.wet, C.ink, 5) }
  const box = (b, fill, label, size = 95) => {
    s.rect(b[0], b[1], b[3] - b[0], b[4] - b[1], fill, C.ink, 6)
    if (label) s.text((b[0] + b[3]) / 2, (b[1] + b[4]) / 2, label, { size, weight: 700 })
  }
  box([0, scene.bed_y0, 0, scene.bed_x1, scene.bed_y1, 0], "#f3e3c9", t.bed, 130)
  box(scene.bedside, "#ead2ad", "", 70)
  s.text((scene.bedside[0] + scene.bedside[3]) / 2, scene.bedside[4] / 2, "340", { size: 80, weight: 700 })
  box(scene.sofa, "#dfe4ea", t.sofa, 110)
  box(scene.table, "#ead2ad", t.table, 80)
  for (const c of scene.chairs) box(c, "#ead2ad", "")
  const gx = scene.galley_x0
  box([gx, scene.fridge[0], 0, scene.part_x0, scene.fridge[1], 0], "#e4ecf3", t.fridge, 70)
  box([gx, scene.hob[0], 0, scene.part_x0, scene.hob[1], 0], "#e4ecf3", t.hob, 70)
  box([gx, scene.sink[0], 0, scene.part_x0, scene.sink[1], 0], "#e4ecf3", t.sink, 70)
  box([scene.part_x0, 0, 0, scene.bath_x0, scene.bdoor[0], 0], "#8d8578", "")
  box(scene.tray, C.wet, t.shower, 85)
  box(scene.wc, C.fit, t.wc, 80)
  box([scene.door[0], scene.door[1], 0, scene.door[3], scene.door[4], 0], C.oak, "")
  s.text(scene.part_x0 + scene.part_t / 2, scene.tray[4] + 120, `${t.partition} 70`, { size: 65, weight: 700, anchor: "start", rotate: 90 })
  s.rect(scene.wall_b, 0, L - scene.wall_b, W, "#d8d2c6", C.ink, 4)
  // labels outside
  s.text(-330, W / 2, t.endA, { size: 115, weight: 700, rotate: -90 })
  s.text(L + 330, W / 2, t.endB, { size: 115, weight: 700, rotate: -90 })
  s.text(L / 2, W + 330, `${t.front} · ${t.slider} · ${t.w1}`, { size: 95, weight: 700 })
  // ordinates along the top: distance from end A to each line
  const top = -260
  s.line(0, top, L, top, C.dim, 4)
  for (const x of [0, scene.bed_x1, scene.sofa[0], scene.sofa[3], gx, scene.part_x0, L]) s.ord(x, top, r(x))
  s.text(0, -1240, `${t.fromA} (mm)`, { size: 90, anchor: "start" })
  // the openings along the bottom
  const bot = W + 560
  s.line(0, bot, L, bot, C.dim, 4)
  for (const x of [...scene.o1, ...scene.o2]) s.ord(x, bot, r(x), { up: false })
  s.dimV(-480, 0, W, W, {})
  write("plan", lang, s)
}

// ------------------------------------------------------------------ 3. the layers
function layers(t, lang) {
  const s = new Sheet(0, 0, 4600, 3400)
  const k = 22 // each layer drawn 22 times its thickness, so every one is readable
  const row = (y, title, total, items) => {
    s.text(150, y - 170, title, { size: 120, weight: 700, anchor: "start" })
    let x = 150
    items.forEach(([label, mm, fill, shown], i) => {
      const w = Math.max(mm * k, 40)
      s.rect(x, y, w, 300, fill, C.ink, 6)
      const lx = x + w / 2, ly = y + 400 + i * 150
      s.line(lx, y + 300, lx, ly - 60, C.ink, 3)
      s.text(lx - 30, ly, `${label}${shown ? ` ${shown}` : ""}`, { size: 80, anchor: "start" })
      x += w
    })
    s.text(x + 120, y + 150, `= ${total}`, { size: 150, weight: 700, fill: C.dim, anchor: "start" })
  }
  row(250, t.wallTitle, 50,
    [[t.steel, 2, C.steel, ""], [t.batten, 38, C.foam, ""], [t.ply12, 12, C.ply, ""]])
  row(1250, t.floorTitle, "+ 17", [[t.membrane, 1, C.membrane, ""], [t.sheet, 12, C.ply, ""], [t.oak, 5, C.oak, ""]])
  row(2250, t.ceilTitle, 60, [[t.steel, 2, C.steel, ""], [t.batten, 48, C.foam, ""], [t.ply12, 12, C.ply, ""]])
  s.text(150, 3200, `${t.room}: ${dims.int_h} − ${dims.lining_floor} − ${dims.lining_ceil} = ${H}`, { size: 140, weight: 700, fill: C.dim, anchor: "start" })
  write("layers", lang, s)
}

// ------------------------------------------------------------------ 4. floor sheets
function floor(t, lang) {
  const IL = dims.int_l, IW = dims.int_w, g = 3, m = 5
  const use = IL - 2 * m, w1 = 1220, w2 = IW - 2 * m - w1 - g
  const c1 = use - 2440 - g - 2440 - g, c2 = use - 1220 - g - 2440 - g
  const s = new Sheet(-700, -900, IL + 1400, IW + 1900)
  s.rect(0, 0, IL, IW, C.steel, C.ink, 12)
  const sheet = (x, y, w, h, label, cut) => {
    s.rect(x, y, w, h, C.ply, cut ? C.cut : C.ink, cut ? 14 : 8)
    s.text(x + w / 2, y + h / 2 - 60, label, { size: 120, weight: 700, fill: cut ? C.cut : C.ink })
  }
  let x = m
  sheet(x, m, 2440, w1, "2440 × 1220"); x += 2440 + g
  sheet(x, m, 2440, w1, "2440 × 1220"); x += 2440 + g
  sheet(x, m, c1, w1, `${t.cut} ${c1} × 1220`, true)
  x = m
  const y2 = m + w1 + g
  sheet(x, y2, 1220, w2, `1220 × ${w2}`); s.text(x + 610, y2 + w2 / 2 + 90, t.offcut, { size: 70 }); x += 1220 + g
  sheet(x, y2, 2440, w2, `2440 × ${w2}`, true); x += 2440 + g
  sheet(x, y2, c2, w2, `${t.cut} ${c2} × ${w2}`, true)
  s.text(-330, m + w1 / 2, t.run1, { size: 90, weight: 700, rotate: -90 })
  s.text(-330, y2 + w2 / 2, t.run2, { size: 90, weight: 700, rotate: -90 })
  s.text(IL / 2, -560, `${t.back} ↑`, { size: 100, weight: 700 })
  s.dimH(0, IL, -230, IL)
  s.dimV(IL + 330, 0, IW, IW, { left: false })
  s.text(0, IW + 330, t.gaps, { size: 95, anchor: "start" })
  s.text(0, IW + 520, `${t.endA} ←`, { size: 95, weight: 700, anchor: "start" })
  write("floor", lang, s)
}

// ------------------------------------------------------------------ 5-7. battens
const rows = (wall) => battens.filter((b) => b.wall === wall)
function battensBack(t, lang) {
  const xs = rows("back wall").map((b) => +b.centre_mm), H2 = H, end = scene.part_x0 + E
  const s = new Sheet(-500, -1000, end + 1500, H2 + 1700)
  s.rect(0, 0, end, H2, C.soft, C.steel, 16)
  // panel joints, behind
  for (const p of parts.filter((p) => p.name === "Back wall lining").map((_, i) => i)) {
    const a = E + p * 1144
    s.rect(a, 0, 1144, H2, "none", "#c9c2b4", 6, "40 30")
    s.text(a + 300, H2 * 0.12, `K1-0${p + 1}`, { size: 80, fill: "#8d8578", weight: 700 })
    s.text(a + 300, H2 * 0.12 + 110, "1144", { size: 80, fill: "#8d8578" })
  }
  for (const c of xs) {
    s.rect(c - 25, 0, 50, H2, C.batten, C.ink, 4)
    for (const z of [60, 650, 1250, 1850, H2 - 60]) s.add(`<circle cx="${c}" cy="${H2 - z}" r="16" fill="${C.ink}"/>`)
  }
  s.line(0, H2 + 260, end, H2 + 260, C.dim, 4)
  for (const c of xs) s.ord(c, H2 + 260, c, { up: false })
  s.text(-260, H2 / 2, t.endA, { size: 100, weight: 700, rotate: -90 })
  s.text(end + 250, H2 / 2, t.partition, { size: 100, weight: 700, rotate: -90 })
  s.dimV(end + 520, 0, H2, H2, { left: false })
  s.text(0, -650, `${t.back} · ${t.centres}, ${t.fromAsteel}`, { size: 95, weight: 700, anchor: "start" })
  s.text(0, -470, t.screws, { size: 90, anchor: "start" })
  write("battens-back", lang, s)
}
function battensEndFront(t, lang) {
  const endA = rows("end A").map((b) => +b.centre_mm), fr = rows("front wall").map((b) => +b.centre_mm)
  const head = rows("slider head").map((b) => b.centre_mm.split("-").map(Number))
  const IW = dims.int_w, o1 = scene.o1.map((v) => v + E), Hh = scene.o1_head
  const gap = 900, fx = IW + gap, fend = o1[1] + 150
  const s = new Sheet(-500, -1000, fx + fend + 1300, H + 1800)
  // end A
  s.rect(0, 0, IW, H, C.soft, C.steel, 16)
  for (const c of endA) s.rect(c - 25, 0, 50, H, C.batten, C.ink, 4)
  s.line(0, H + 260, IW, H + 260, C.dim, 4)
  for (const c of endA) s.ord(c, H + 260, c, { up: false })
  s.text(0, -650, t.endA, { size: 110, weight: 700, anchor: "start" })
  s.text(0, -480, t.fromBack, { size: 85, anchor: "start" })
  // front wall, left part + the slider opening + head battens
  s.rect(fx, 0, fend, H, C.soft, C.steel, 16)
  s.rect(fx + o1[0], H - Hh, o1[1] - o1[0], Hh, C.wet, C.ink, 6)
  s.text(fx + (o1[0] + o1[1]) / 2, H - Hh / 2, t.sliderGap, { size: 100, weight: 700 })
  for (const c of fr) s.rect(fx + c - 25, 0, 50, H, C.batten, C.ink, 4)
  for (const [a, b] of head) s.rect(fx + a, H - Hh - 50, b - a, 50, C.batten, C.ink, 4)
  s.line(fx, H + 260, fx + fend, H + 260, C.dim, 4)
  for (const c of fr) s.ord(fx + c, H + 260, c, { up: false })
  s.ord(fx + o1[1], H + 260, o1[1], { up: false })
  s.text(fx + (o1[0] + o1[1]) / 2, H - Hh / 2 + 150, `${o1[0]} → ${o1[1]}`, { size: 95, fill: C.dim, weight: 700 })
  s.dimV(fx + fend + 280, H - Hh, H, Hh, { left: false })
  s.text(fx, -650, `${t.front} · ${t.head} ${t.over}`, { size: 110, weight: 700, anchor: "start" })
  s.text(fx, -480, t.fromAsteel, { size: 85, anchor: "start" })
  write("battens-end-front", lang, s)
}
function battensCeiling(t, lang) {
  const xs = rows("ceiling").map((b) => +b.centre_mm), IL = dims.int_l
  const s = new Sheet(-500, -1000, IL + 1400, W + 1800)
  s.rect(0, 0, IL, W + 2 * E, C.soft, C.steel, 16)
  for (let i = 0; i < 5; i++) {
    const a = E + i * 1160
    s.rect(a, E, 1160, W, "none", "#c9c2b4", 6, "40 30")
    s.text(a + 300, W * 0.15, `K1-${11 + i}`, { size: 80, fill: "#8d8578", weight: 700 })
    s.text(a + 300, W * 0.15 + 110, "1160", { size: 80, fill: "#8d8578" })
  }
  for (const c of xs) s.rect(c - 25, E, 50, W, C.batten, C.ink, 4)
  s.line(0, W + 2 * E + 260, IL, W + 2 * E + 260, C.dim, 4)
  for (const c of xs) s.ord(c, W + 2 * E + 260, c, { up: false })
  s.dimV(IL + 280, E, W + E, W, { left: false })
  s.text(0, -650, `${t.ceilingB} · ${t.centres}, ${t.fromAsteel}`, { size: 95, weight: 700, anchor: "start" })
  write("battens-ceiling", lang, s)
}

// ------------------------------------------------------------------ 8. lining panels
function panels(t, lang) {
  const groups = [
    [t.back, parts.filter((p) => p.name === "Back wall lining")],
    [t.endA, parts.filter((p) => p.name === "End A lining")],
    [t.front, parts.filter((p) => p.name === "Front wall lining (end A)")],
    [t.over, parts.filter((p) => p.name === "Front head strip")],
    [t.ceiling, parts.filter((p) => p.name === "Ceiling panel")],
  ]
  const k = 0.32, s = new Sheet(-200, -300, 6400, 3500)
  let x = 0, y = 0
  for (const [g, ps] of groups) {
    if (x > 4200) { x = 0; y += 1350 }
    s.text(x, y - 120, g, { size: 95, weight: 700, anchor: "start" })
    for (const p of ps) {
      const flat = +p.width_mm < 200
      const w = (flat ? +p.length_mm : +p.width_mm) * k, h = (flat ? +p.width_mm : +p.length_mm) * k
      const py = flat ? y + ps.indexOf(p) * 260 : y
      s.rect(x, py, w, h, C.ply, C.ink, 5)
      if (flat) {
        s.text(x + w + 40, py + h / 2, `${p.id} · ${p.length_mm} × ${p.width_mm}`, { size: 65, fill: C.dim, weight: 700, anchor: "start" })
      } else {
        s.text(x + w / 2, y + h / 2 - 90, p.id, { size: 70, weight: 700 })
        s.text(x + w / 2, y + h / 2, p.width_mm, { size: 70, fill: C.dim, weight: 700 })
        s.text(x + w / 2, y + h / 2 + 90, `× ${p.length_mm}`, { size: 60, fill: C.dim, weight: 700 })
        x += w + 70
      }
    }
    if (ps.length && +ps[0].width_mm < 200) x += +ps[0].length_mm * k + 700
    x += 250
  }
  s.text(0, 3050, t.panels, { size: 90, anchor: "start" })
  write("panels", lang, s)
}

// ------------------------------------------------------------------ 9. bathroom
function bathroom(t, lang) {
  const x0 = scene.part_x0 - 300, s = new Sheet(x0 - 500, -1300, L - x0 + 2100, W + 2700)
  s.rect(x0, 0, L - x0, W, "#fbf8f1", C.ink, 10)
  // the partition, open by the front wall for the door; the leaf closed inside it, dashed where it parks open
  s.rect(scene.part_x0, 0, scene.part_t, scene.bdoor[0], "#8d8578", C.ink, 5)
  for (const y of [scene.bdoor[0], scene.bdoor[1] - 18]) s.rect(scene.part_x0, y, scene.part_t - 12, 18, "#8d8578", C.ink, 4)
  const dr = scene.door, lw = dr[4] - dr[1], lt = dr[3] - dr[0]
  s.rect(dr[0], dr[1], lt, lw, C.oak, C.ink, 5)
  s.add(`<rect x="${dr[0]}" y="${scene.bleaf[0]}" width="${lt}" height="${lw}" fill="none" stroke="${C.ink}" stroke-width="4" stroke-dasharray="30 20"/>`)
  s.text(scene.part_x0 - 120, (scene.bdoor[0] + scene.bdoor[1]) / 2, `${t.slidingDoor} ${r(scene.bdoor[1] - scene.bdoor[0] - 36)}`, { size: 70, weight: 700, rotate: -90 })
  const b = (q, fill, label, size = 80) => {
    s.rect(q[0], q[1], q[3] - q[0], q[4] - q[1], fill, C.ink, 6)
    if (label) s.text((q[0] + q[3]) / 2, (q[1] + q[4]) / 2, label, { size, weight: 700 })
  }
  b(scene.tray, C.wet, t.tray, 75)
  s.rect(scene.screen[0], scene.screen[1] - 8, scene.screen[3] - scene.screen[0], 24, C.membrane, "none", 0)
  s.text((scene.screen[0] + scene.screen[3]) / 2, scene.screen[4] + 90, t.glass, { size: 65, fill: C.membrane })
  b(scene.wc, C.fit, t.wc)
  s.rect(scene.wall_b, 0, L - scene.wall_b, W, "#d8d2c6", C.ink, 4)
  const wh = scene.fittings.find((f) => f.id === "WH"), [hw, hh, hd] = wh.size
  s.line(scene.wall_b - 10, wh.at[1] - hw / 2, scene.wall_b - 10, wh.at[1] + hw / 2, C.cut, 22)
  s.text(x0 + 40, W + 330, `${t.heater}: ${hw} × ${hh} × ${hd}`, { size: 75, anchor: "start", fill: C.cut, weight: 700 })
  s.text(x0 + 40, W + 470, `${t.wc}: 520 × 380 · ${t.glass}: ${r(scene.screen[3] - scene.screen[0])} · ${t.leaf}: ${r(lw)} × ${r(dr[5] - dr[2])}`, { size: 75, anchor: "start" })
  s.text((x0 + scene.part_x0) / 2, scene.sink[1] / 2, t.kitchen, { size: 75, weight: 700, rotate: -90 })
  s.text(x0, -1000, t.bathroom, { size: 110, weight: 700, anchor: "start" })
  s.text(L + 260, W / 2, t.endB, { size: 100, weight: 700, rotate: -90 })
  // ordinates: x from end A along the top, y from the back wall along the right
  const top = -260
  s.line(x0, top, L, top, C.dim, 4)
  for (const x of [scene.part_x0, scene.tray[0], scene.wc[0], scene.wall_b]) s.ord(x, top, r(x))
  const right = L + 620
  s.line(right, 0, right, W, C.dim, 4)
  for (const y of [scene.tray[4], (scene.wc[1] + scene.wc[4]) / 2, scene.bdoor[0], W]) {
    s.line(right - 40, y, right + 40, y, C.dim, 6)
    s.text(right + 70, y, r(y), { size: 85, fill: C.dim, weight: 700, anchor: "start" })
  }
  s.text(x0, -860, `${t.fromA} · ${t.fromBackFin}`, { size: 75, anchor: "start" })
  write("bathroom", lang, s)
}

// ------------------------------------------------------------------ 10. kitchen (elevation)
function kitchen(t, lang) {
  const run = scene.sink[1], top = 900, leg = 100, oz0 = scene.overhead[0][2], oz1 = scene.overhead[0][5]
  const hz0 = scene.hood[2], hz1 = scene.hood[5], Z = (z) => H - z
  const s = new Sheet(-900, -700, W + 2100, H + 1500)
  s.rect(0, 0, W, H, C.soft, C.steel, 12)
  const unit = (a, b, label) => {
    s.rect(a, Z(top - 38), b - a, top - 38 - leg, "#e4ecf3", C.ink, 6)
    s.text((a + b) / 2, Z((top + leg) / 2), label, { size: 90, weight: 700 })
    s.dimH(a, b, Z(0) + 230, r(b - a), { below: true })
  }
  unit(scene.fridge[0], scene.fridge[1], t.fridge); unit(scene.hob[0], scene.hob[1], t.hob); unit(scene.sink[0], scene.sink[1], t.sink)
  s.rect(0, Z(top), run, 38, C.oak, C.ink, 6)
  s.text(run + 60, Z(top - 19), t.worktop, { size: 75, anchor: "start" })
  s.rect(0, Z(leg), run, leg, "#cfc7b8", C.ink, 4)
  s.text(run + 60, Z(leg / 2), `${t.legs} / ${t.plinth}`, { size: 70, anchor: "start" })
  // two wall cabinets either side of the hob, and the chimney hood between them up to the ceiling
  for (const o of scene.overhead) {
    s.rect(o[1], Z(oz1), o[4] - o[1], oz1 - oz0, "#e4ecf3", C.ink, 6)
    s.dimH(o[1], o[4], Z(oz1) - 90, r(o[4] - o[1]))
  }
  s.text((scene.overhead[0][1] + scene.overhead[0][4]) / 2, Z((oz0 + oz1) / 2), t.overhead, { size: 70, weight: 700 })
  s.text((scene.overhead[1][1] + scene.overhead[1][4]) / 2, Z((oz0 + oz1) / 2), t.overhead, { size: 70, weight: 700 })
  const ch = scene.chimney
  s.rect(ch[1], Z(ch[5]), ch[4] - ch[1], ch[5] - ch[2], "#3b3b3b", C.ink, 4)
  s.add(`<path d="M ${scene.hood[1]} ${Z(hz0)} H ${scene.hood[4]} L ${ch[4]} ${Z(hz1)} H ${ch[1]} Z" fill="#3b3b3b" stroke="${C.ink}" stroke-width="4"/>`)
  s.text((scene.hood[1] + scene.hood[4]) / 2, Z(hz0) + 90, t.hood, { size: 70 })
  // heights on the left
  for (const z of [leg, top, hz0, oz0, oz1]) {
    s.line(-120, Z(z), 0, Z(z), C.dim, 4)
    s.text(-160, Z(z), r(z), { size: 90, fill: C.dim, weight: 700, anchor: "end" })
  }
  s.dimH(0, run, Z(0) + 520, r(run), { below: true })
  s.text(0, -480, t.frontView, { size: 85, anchor: "start" })
  s.text(0, -330, `${t.depth} · ${t.up}`, { size: 80, anchor: "start" })
  s.text(-120, Z(0) + 60, t.back, { size: 60, anchor: "end" })
  write("kitchen", lang, s)
}

// ------------------------------------------------------------------ 11. the four zones, every size (D-068)
// One sheet per zone: the plan on top (from above, the back wall at the top), and below it the elevation seen from
// the glass side (end A on the left, heights from the finished floor). Every piece carries its width, its depth and
// its height; the clearances between them are dimensioned too. Boxes are [x0, y0, z0, x1, y1, z1].
const Z_WORDS = {
  en: { above: "FROM ABOVE", side: "FROM THE GLASS SIDE", endB: "FROM THE ROOM, FACING END B", mattress: "MATTRESS", boxes: "STORAGE BOX", headboard: "HEADBOARD",
    lamp: "LAMP", worktop: "WORKTOP", walk: "walk", pull: "pull-out 600", leaf: "LEAF (open)", w1: "W1 (front wall)",
    screen: "GLASS", heater: "HEATER", zone: { bed: "BED", seating: "SEATING", galley: "GALLEY", bath: "BATH" } },
  rw: { above: "UREBYE UVA HEJURU", side: "UREBYE UTURUTSE KU KIRAHURE", endB: "UREBYE URI MU CYUMBA, UREBA END B", mattress: "MATELA", boxes: "AGASANDUKU",
    headboard: "IKIBAHO CY'UMUTWE", lamp: "ITARA", worktop: "WORKTOP", walk: "inzira", pull: "gisohoka 600",
    leaf: "URUGI (rufunguye)", w1: "W1 (urukuta rw'imbere)", screen: "IKIRAHURE", heater: "HEATER",
    zone: { bed: "IGITANDA", seating: "KWICARA", galley: "IGIKONI", bath: "UBWIHERERO" } },
}
function zoneSheets(t, lang) {
  const z = Z_WORDS[lang], S = scene, ZT = 450, TOP = 900, LEG = 100
  const wt = [S.part_x0 - 620, 0, TOP - 38, S.part_x0, S.sink[1] + 12, TOP]
  const base = (y, label) => ({ b: [S.galley_x0, y[0], LEG, S.part_x0, y[1], TOP - 38], fill: "#e4ecf3", label })
  const wh = S.fittings.find((f) => f.id === "WH"), [hw, hh, hd] = wh.size
  const zones = {
    bed: { x: [0, S.bedside[3]], items: [
      { b: [0, 0, 0, S.bed_x1, S.bed_y0, 1000], fill: "#c9935a", label: z.headboard, plan: false },
      { b: [0, S.bed_y0, 0, S.bed_x1, S.bed_y1, ZT], fill: "#f3e3c9", label: t.bed },
      { b: [20, S.bed_y0 + 28, ZT, S.bed_x1 - 20, S.bed_y1 - 10, ZT + 200], fill: "#ffffff", label: z.mattress, plan: false },
      ...S.drawers.map(([a, b]) => ({ b: [S.bed_x1 - 618, a, 62, S.bed_x1, b, ZT - 98], fill: "none", dash: true, label: z.boxes, side: false })),
      { b: S.bedside, fill: "#ead2ad", label: t.bedside },
      { b: S.lamp, fill: "#fff7e0", label: z.lamp, plan: false },
    ], gaps: [["y", S.bed_x1 + 60, S.bed_y1, S.W, z.walk]] },
    seating: { x: [S.bedside[3], S.galley_x0 - 20], items: [
      { b: S.sofa, fill: "#dfe4ea", label: t.sofa },
      { b: S.table, fill: "#ead2ad", label: t.table },
      ...S.chairs.map((c) => ({ b: c, fill: "#ead2ad", label: t.chair })),
    ], gaps: [["x", S.sofa[1] + 300, S.sofa[3], S.part_x0 - 620, z.walk], ["y", S.table[0] + 60, S.sofa[4], S.table[1], ""],
      ["y", (S.table[0] + S.table[3]) / 2, S.chairs[0][4], S.W, z.walk]] },
    galley: { x: [S.part_x0 - 620 - 400, S.part_x0], view: "y", items: [
      base(S.fridge, t.fridge), base(S.hob, t.hob), base(S.sink, t.sink),
      { b: wt, fill: "#c9935a", label: z.worktop, plan: false },
      ...S.overhead.map((o) => ({ b: o, fill: "#e4ecf3", label: t.overhead, plan: false })),
      { b: S.hood, fill: "#3b3b3b", label: t.hood, plan: false, ink: "#ffffff" },
      { b: S.chimney, fill: "#3b3b3b", label: "", plan: false },
    ], gaps: [["y", S.part_x0 - 300, S.sink[1] + 12, S.W, `${z.walk}`]] },
    bath: { x: [S.part_x0, S.L], view: "y", items: [
      { b: [S.part_x0, 0, 0, S.bath_x0, S.bdoor[0], H], fill: "#8d8578", label: "", side: false },
      { b: S.tray, fill: C.wet, label: t.shower },
      { b: S.screen, fill: "none", label: z.screen, plan: false },
      { b: S.wc, fill: C.fit, label: t.wc },
      { b: [S.door[0], S.bleaf[0], S.door[2], S.door[3], S.bleaf[1], S.door[5]], fill: "none", dash: true, label: z.leaf },
      { b: [S.wall_b - hd, wh.at[1] - hw / 2, wh.at[2] - hh / 2, S.wall_b, wh.at[1] + hw / 2, wh.at[2] + hh / 2], fill: "#ffffff", label: z.heater, plan: false },
    ], gaps: [["y", S.bath_x0 + 150, S.bdoor[0] + 18, S.W - 18, t.door], ["x", S.tray[4] + 120, S.bath_x0, S.wc[0], ""]] },
  }
  for (const [name, zd] of Object.entries(zones)) {
    const [x0, x1] = zd.x, w = x1 - x0, gap = zd.view === "y" ? 2100 : 1500, EY = W + gap // the elevation's floor sits at EY + H
    const Z = (v) => EY + H - v
    const plans = zd.items.filter((i) => i.plan !== false), sides = zd.items.filter((i) => i.side !== false)
    const nx = new Set(plans.map((i) => `${r(i.b[0])}-${r(i.b[3])}`)).size
    const s = new Sheet(x0 - 1300, -700 - nx * 230, Math.max(w + 2700 + 260 * plans.length, W + 2000), W + gap + H + 2100 + nx * 230)
    // plan: the room's strip, the walls, then the pieces
    s.rect(x0, 0, w, W, "#fbf8f1", C.ink, 10)
    s.rect(x0, -E, w, E, C.steel, "none", 0); s.rect(x0, W, w, E, C.steel, "none", 0)
    for (const [a, b] of [S.o1, S.o2]) if (b > x0 && a < x1) s.rect(Math.max(a, x0), W - 5, Math.min(b, x1) - Math.max(a, x0), E + 10, C.wet, C.ink, 5)
    if (x0 === 0) s.rect(-E, -E, E, W + 2 * E, C.steel, "none", 0)
    if (x1 === S.L) s.rect(S.wall_b, 0, S.L - S.wall_b, W, "#d8d2c6", C.ink, 4)
    for (const i of plans) {
      const [a, b, , c, d] = i.b
      s.rect(a, b, c - a, d - b, i.fill, C.ink, 6, i.dash ? "30 20" : "")
      if (i.label) s.text((a + c) / 2, (b + d) / 2, i.label, { size: 70, weight: 700 })
    }
    s.text(x0, -480 - nx * 230, `${z.zone[name]} · ${z.above}`, { size: 110, weight: 700, anchor: "start" })
    // widths along the top, one row per distinct span, nearest the plan first
    const seen = new Set(); let row = 0
    for (const i of [...plans].sort((p, q) => (p.b[3] - p.b[0]) - (q.b[3] - q.b[0]))) {
      const k = `${r(i.b[0])}-${r(i.b[3])}`
      if (seen.has(k)) continue
      seen.add(k); s.dimH(i.b[0], i.b[3], -230 - row++ * 230, r(i.b[3] - i.b[0]), { size: 85 })
    }
    // depths on the right, one column per piece, and the zone's span and the room's width
    plans.forEach((i, n) => s.dimV(x1 + 300 + n * 260, i.b[1], i.b[4], r(i.b[4] - i.b[1]), { size: 80, left: false }))
    s.dimV(x0 - 450, 0, W, W, { size: 90 })
    s.dimH(x0, x1, W + 450, r(w), { size: 90, below: true })
    // where the zone starts and ends, from end A
    s.text(x0, W + 800, `${t.fromA}: ${r(x0)} → ${r(x1)}`, { size: 75, anchor: "start" })
    for (const [axis, at, a, b, label] of zd.gaps) {
      if (axis === "y") s.dimV(at, a, b, `${label ? `${label} ` : ""}${r(b - a)}`, { size: 75, color: C.cut, left: false })
      else s.dimH(a, b, at, `${label ? `${label} ` : ""}${r(b - a)}`, { size: 75, color: C.cut })
    }
    // elevation: the far pieces first, so the nearer ones draw over them. Seen from the glass side the run is along x;
    // the galley and the bath run across the width, so they are seen from the room facing end B (y across, the back
    // wall on the left). A label is left off where a nearer piece covers it.
    const byY = zd.view === "y", ew = byY ? W : w, hx = (v) => (byY ? x0 + v : v)
    let eb = Z(0), et = Z(H) // the elevation's dimension rows, below and above
    s.text(x0, EY - 250 - (byY ? 600 : 0), `${z.zone[name]} · ${byY ? z.endB : z.side}`, { size: 110, weight: 700, anchor: "start" })
    s.rect(x0, Z(H), ew, H, C.soft, C.steel, 8)
    const order = [...sides].sort((p, q) => (byY ? q.b[0] - p.b[0] : p.b[1] - q.b[1]))
    const span = (i) => (byY ? [i.b[1], i.b[4]] : [i.b[0], i.b[3]])
    order.forEach((i) => {
      const [a, c] = span(i)
      s.rect(hx(a), Z(i.b[5]), c - a, i.b[5] - i.b[2], i.fill, C.ink, 6, i.dash ? "30 20" : "")
    })
    order.forEach((i, n) => {
      const [a, c] = span(i), cx = (a + c) / 2, cz = (i.b[2] + i.b[5]) / 2
      const hidden = order.slice(n + 1).some((j) => j.fill !== "none" && span(j)[0] < cx && cx < span(j)[1] && j.b[2] < cz && cz < j.b[5])
      if (i.label && i.b[5] - i.b[2] > 120 && !hidden) s.text(hx(cx), Z(cz), i.label, { size: 60, weight: 700, fill: i.ink ?? C.ink })
    })
    // across the width: each piece's width, low pieces below the floor line and high ones above the ceiling, in rows
    // so that no two overlap
    if (byY) {
      const rowsBy = { low: [], high: [] }
      for (const i of order.filter((j) => j.fill !== "none" && j.b[4] - j.b[1] > 60)) {
        const k = i.b[2] < 1000 ? "low" : "high", rs = rowsBy[k], a = i.b[1], c = i.b[4]
        let n = rs.findIndex((row) => row.every(([p, q]) => c <= p + 1 || a >= q - 1))
        if (n < 0) { n = rs.length; rs.push([]) }
        rs[n].push([a, c])
        const y = k === "low" ? Z(0) + 160 + n * 200 : Z(H) - 160 - n * 200
        s.dimH(hx(a), hx(c), y, r(c - a), { size: 70, below: k === "low" })
      }
      eb = Z(0) + 160 + rowsBy.low.length * 200; et = Z(H) - 160 - rowsBy.high.length * 200
    }
    // heights: every piece's top and bottom (off the floor), as ordinates on the left
    const zs = [...new Set(sides.flatMap((i) => [i.b[2], i.b[5]]).map(r))].filter((v) => v > 0 && v < H).sort((a, b) => a - b)
    let ly = Infinity // labels close together step apart, each with a leader to its own tick
    for (const v of zs) {
      const y = Math.min(Z(v), ly - 90); ly = y
      s.line(x0 - 100, Z(v), x0, Z(v), C.dim, 4); s.line(x0 - 150, y, x0 - 100, Z(v), C.dim, 3)
      s.text(x0 - 170, y, v, { size: 75, fill: C.dim, weight: 700, anchor: "end" })
    }
    s.dimV(x0 + ew + 300, Z(H), Z(0), H, { size: 90, left: false })
    if (byY) { s.text(x0, et - 60, t.back, { size: 60, anchor: "start" }); s.text(x0 + ew, et - 60, t.front, { size: 60, anchor: "end" }) }
    s.text(x0, eb + 200, t.up, { size: 75, anchor: "start" })
    write(`zone-${name}`, lang, s)
  }
}

for (const lang of ["en", "rw"]) {
  const t = T[lang]
  measure(t, lang); plan(t, lang); layers(t, lang); floor(t, lang)
  battensBack(t, lang); battensEndFront(t, lang); battensCeiling(t, lang)
  panels(t, lang); bathroom(t, lang); kitchen(t, lang); zoneSheets(t, lang)
}
console.log("guide drawings ->", OUT.slice(ROOT.length + 1))
