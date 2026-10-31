#!/usr/bin/env node
// The guest-room block's Day 1 measuring sheet, in the studio's pattern (`measure` in scripts/studio/guide-drawings.mjs):
// the joined 40 ft pair from above as it stands, its front wall seen from outside, and a numbered badge for each of
// the measurements guide/guest-room/plan.md lists.
//
//   node scripts/site/guest-room-measure.mjs     # -> public/designs/guest-room/guide/measure.<en|rw>.svg
//
// Units are millimetres, x from the finished face of end A (the left end as you face the doors), y from the finished
// back wall. The inside size comes from guest-room.json. The openings stand where the photo of 2026-10-28 puts them
// [E, scaled from public/photos/2026-10-28/guest-room-block.webp] until the survey (study/guest-room/survey.csv)
// gives their true places.
import { mkdirSync, readFileSync, writeFileSync } from "node:fs"
import { dirname, join } from "node:path"
import { fileURLToPath } from "node:url"

import { C, Sheet } from "../studio/sheet.mjs"

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..", "..")
const room = JSON.parse(readFileSync(join(ROOT, "src", "components", "guest-room", "guest-room.json"), "utf8"))
const OUT = join(ROOT, "public", "designs", "guest-room", "guide")
mkdirSync(OUT, { recursive: true })

const ROOMS = 3 // the owner's brief (D-061)
const BAYS = 4 // the rooms as they stand, one door each
const IL = Math.round((ROOMS * room.room.w + (ROOMS - 1) * room.room.wall) * 1000) // inside the linings, end to end
const IW = Math.round(room.room.d * 1000) // front wall to back wall
const IH = Math.round(room.room.h * 1000)
const DOOR_H = Math.round(room.door.h * 1000)
const SILL = Math.round(room.window.front.sill * 1000), HEAD = Math.round(room.window.front.head * 1000)

// The front wall as it stands: a window left of each door, four times, and a box painted red on the outside
// between D2 and W3 [E, photo-scaled].
const FRONT = [
  { id: "W1", door: false, x: [840, 1330] }, { id: "D1", door: true, x: [1420, 2180] },
  { id: "W2", door: false, x: [3660, 4250] }, { id: "D2", door: true, x: [4270, 5080] },
  { id: "W3", door: false, x: [6650, 7270] }, { id: "D3", door: true, x: [7320, 8110] },
  { id: "W4", door: false, x: [9840, 10440] }, { id: "D4", door: true, x: [10510, 11450] },
]
const BOX = [5330, 5770]
const RED = "#b91c1c"
const NEW = Array.from({ length: ROOMS - 1 }, (_, i) => Math.round((IL * (i + 1)) / ROOMS)) // three rooms alike
const OLD = Array.from({ length: BAYS - 1 }, (_, i) => Math.round((IL * (i + 1)) / BAYS)) // the partitions today
const crossed = (o) => NEW.some((x) => x > o.x[0] && x < o.x[1])

const T = {
  en: {
    endA: "END A", endB: "END B", back: "BACK WALL", backWin: "every window: B1, B2…", front: "FRONT WALL",
    joint: "JOINT", newWall: "NEW WALL", box: ["red box"],
    legend: [
      "End A is the left end, as you stand outside facing the doors.",
      "The doors and windows are placed from the photo of 2026-10-28; the survey gives their true places.",
      "Red dashes: the new walls for three rooms alike.",
      "A door or window they cross is closed or moved (circled red).",
      "Every number in mm, from the finished face of end A.",
    ],
  },
  rw: {
    endA: "IMPERA A", endB: "IMPERA B", back: "URUKUTA RW'INYUMA", backWin: "buri dirishya: B1, B2…",
    front: "URUKUTA RW'IMBERE", joint: "AHO KONTINERI ZIHURIRA", newWall: "URUKUTA RUSHYA", box: ["agasanduku", "gatukura"],
    legend: [
      "Impera A ni iyo ibumoso, iyo uhagaze hanze ureba inzugi.",
      "Inzugi n'amadirishya byashyizwe aho ifoto yo ku wa 2026-10-28 ibyerekana; ibipimo bizatanga aho biri nyabyo.",
      "Utudomo dutukura: inkuta nshya z'ibyumba bitatu bingana.",
      "Urugi cyangwa idirishya bihuye na zo birafungwa cyangwa bikimurwa (bizengurutswe umutuku).",
      "Buri gipimo ni muri mm, uhereye ku rukuta rurangiye rwa impera A.",
    ],
  },
}

function measure(t, lang) {
  const fy = IW + 1250 // the front wall's top edge
  const s = new Sheet(-1300, -1450, IL + 2600, fy + IH + 2650 + 1450)
  // the block from above
  s.rect(0, 0, IL, IW, C.soft, C.steel, 50)
  for (const [x, y] of [[0, 0], [IL, 0], [0, IW], [IL, IW]]) s.rect(x - 150, y - 150, 300, 300, C.steel, C.ink, 10)
  s.text(-750, IW / 2, t.endA, { size: 300, weight: 700, rotate: -90 })
  s.text(IL + 750, IW / 2, t.endB, { size: 300, weight: 700, rotate: -90 })
  for (const [x, y] of [[-450, -450], [IL + 450, -450], [-450, IW + 450], [IL + 450, IW + 450]]) s.badge(x, y, "11", 150)
  // 6 the back wall and its windows
  const backX = IL / 2 - (500 + t.back.length * 170) / 2 // badge and label centred between the new walls
  s.badge(backX + 200, -620, "6", 200)
  s.text(backX + 500, -620, t.back, { size: 250, weight: 700, anchor: "start" })
  s.text(IL / 2, -300, t.backWin, { size: 220, fill: C.dim, weight: 700 })
  // 7 the joint: posts, the beam over it, the floor rail
  s.line(0, IW / 2, IL, IW / 2, C.steel, 40, "200 140")
  s.text(450, IW / 2 - 260, t.joint, { size: 240, weight: 700, anchor: "start" })
  s.badge(IL * 0.62, IW / 2, "7", 200)
  // 8 the partitions standing today
  for (const x of OLD) s.line(x, 0, x, IW, C.ink, 14, "90 90")
  s.badge(OLD[1], IW * 0.27, "8", 200)
  // 1 length at the back and the front, 2 depth at end A, the middle and end B
  for (const y of [650, IW - 650]) { s.line(0, y, IL, y, C.dim, 18); s.badge(IL * 0.2, y, "1", 200) }
  for (const x of [400, IL / 2 + 450, IL - 400]) s.line(x, 0, x, IW, C.dim, 18)
  s.badge(IL / 2 + 450, IW * 0.75, "2", 200)
  // 9 the lining at a broken spot, 10 each room's floor: diagonals and level
  s.badge(IL * 0.45, 300, "9", 200)
  s.line(OLD[2], 0, IL, IW, C.dim, 12, "120 90"); s.line(OLD[2], IW, IL, 0, C.dim, 12, "120 90")
  s.badge((OLD[2] + IL) / 2, IW / 2, "10", 200)
  // the front wall, seen from outside: 3 height, 4 each door, 5 each window
  s.text(IL / 2, IW + 650, t.front, { size: 270, weight: 700 })
  s.rect(0, fy, IL, IH, C.soft, C.steel, 30)
  s.rect(BOX[0], fy + 800, BOX[1] - BOX[0], 600, RED, C.ink, 10)
  t.box.forEach((line, i) => s.text((BOX[0] + BOX[1]) / 2, fy + 1650 + i * 210, line, { size: 150 }))
  for (const o of FRONT) {
    const [lo, hi] = o.door ? [IH - DOOR_H, IH] : [IH - HEAD, IH - SILL]
    const red = crossed(o)
    s.rect(o.x[0], fy + lo, o.x[1] - o.x[0], hi - lo, C.wet, red ? RED : C.ink, red ? 40 : 12)
    s.badge((o.x[0] + o.x[1]) / 2, fy + (lo + hi) / 2, o.door ? "4" : "5", 170)
    s.text((o.x[0] + o.x[1]) / 2, fy + IH + 330, o.id, { size: 240, weight: 700, fill: red ? RED : C.ink })
    if (red) s.add(`<circle cx="${(o.x[0] + o.x[1]) / 2}" cy="${fy + IH + 330}" r="260" fill="none" stroke="${RED}" stroke-width="22"/>`)
  }
  s.line(300, fy, 300, fy + IH, C.dim, 18); s.badge(300, fy + IH / 2, "3", 170)
  // the new walls for three rooms alike, through the plan and the front wall
  for (const x of NEW) {
    s.line(x, -950, x, fy + IH, C.cut, 34, "220 140")
    s.text(x, -1150, t.newWall, { size: 230, fill: C.cut, weight: 700 })
  }
  t.legend.forEach((line, i) => s.text(0, fy + IH + 850 + i * 380, line, { size: 205, anchor: "start" }))
  writeFileSync(join(OUT, `measure.${lang}.svg`), s.svg())
}

for (const lang of ["en", "rw"]) measure(T[lang], lang)
console.log(`guest-room measuring sheet -> ${OUT.slice(ROOT.length + 1)} (new walls at ${NEW.join(", ")} mm; crossed: ${FRONT.filter(crossed).map((o) => o.id).join(", ")})`)
