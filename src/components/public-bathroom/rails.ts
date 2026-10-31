import { railCards } from "@/components/page/sections"
import { D } from "@/components/public-bathroom/data"
import bath from "@/components/public-bathroom/public-bathroom.json"
import { runs } from "@/components/public-bathroom/services"
import type { Rail } from "@/components/docs/rail-table"

// The public bathroom's rails, moved off its page so that the page (/[lang]/public-bathroom) and its Materials page in the docs
// (D-059) read one list.
const mm = (m: number) => Math.round(m * 1000).toLocaleString("en-US")
const { toilets: TO, basins: BA, urinal: UR, cupboard: CU, passage: PA, towels: TW, plumbing: PL, electric: EL } = bath

// The Fixtures rail: each piece rendered on its own by public-bathroom.html?item=<id> (the 3D view's own meshes)
export function fixturesRail() {
  const c = TO.wc.cistern
  return railCards(`${D}/render/fixtures`, [
    { id: "wc", title: "WCs × 2", size: `Floor-standing, close-coupled cistern ${mm(c.w)} × ${mm(c.d)} mm, ${mm(c.h)} mm high; ${mm(TO.wc.out)} mm into the room, seat at ${mm(TO.wc.seat)} mm`,
      note: "One against each toilet room's back wall, facing the door, with a soft-close seat and a dual-flush button." },
    { id: "basin", title: "Basin counter", size: `${(BA.x1 - BA.x0).toFixed(2)} × ${BA.d.toFixed(2)} m, top at ${BA.top.toFixed(2)} m; two bowls`,
      note: "Two white bowls on a Medium Oak counter on black steel brackets, open below so the floor washes clean; a push tap behind each bowl." },
    { id: "urinal", title: "Urinal", size: `${mm(UR.w)} mm wide, rim at ${mm(UR.rim)} mm, ${mm(UR.out)} mm from the wall`,
      note: "In its own room in the row, between the toilet rooms and the basins, its flush valve above it, so nobody at the basins sees it." },
    { id: "mirror", title: "Mirror", size: `${(BA.mirror.x1 - BA.mirror.x0).toFixed(2)} × ${(BA.mirror.y1 - BA.mirror.y0).toFixed(2)} m`,
      note: "Over the counter, in a thin black frame." },
    { id: "soap", title: "Soap dispenser", size: "About 100 × 80 × 170 mm", note: "One between the two bowls." },
    { id: "towels", title: "Paper towels and bin", size: `Dispenser ${mm(TW.w)} mm wide; lidded bin Ø ${mm(TW.bin * 2)} mm, 0.5 m high`,
      note: "On the east end wall beside the counter." },
    { id: "roll", title: "Roll holders × 2", size: "One roll, on the wall beside each WC", note: `About ${mm(TO.roll.at)} mm above the floor.` },
    { id: "cupboard", title: "Cleaner's cupboard", size: `${(CU.x1 - CU.x0).toFixed(2)} × ${(PA.y1 - PA.y0).toFixed(2)} m, floor to ceiling`,
      where: "Built in the workshop, like the studio's units", note: "At the corridor's end: a mop and bucket below, shelves of paper, soap and cleaning things above, the stop valve and meter low inside." },
  ])
}

// The Plumbing rail: each fitting on its own (public-bathroom.html?item=<id>), then the pipe, its metres measured off the runs
export function plumbingRail() {
  const metres = (re: RegExp) => {
    const by = new Map<number, number>()
    for (const r of runs.filter((x) => re.test(x.system))) by.set(r.dn, (by.get(r.dn) ?? 0) + r.m)
    return [...by].sort((a, b) => b[0] - a[0]).map(([dn, m]) => `${m.toFixed(1)} m of DN${dn}`).join(", ")
  }
  const f = Object.fromEntries(PL.fittings.map((x) => [x.point, x]))
  return railCards(`${D}/render/plumbing`, [
    { id: "meter", title: "Stop valve, filter and meter", size: `${f.SV.size}, on the main`, note: `SV · ${f.SV.what}.` },
    { id: "pushtap", title: "Push taps × 2", size: "Cold, a push button that closes itself", note: "BT1, BT2 · so no tap is left running." },
    { id: "flushvalve", title: "Urinal flush valve", size: "A timed push button on a 15 mm feed", note: `UV · ${f.UV.what}.` },
    { id: "floordrain", title: "Floor drain", size: f.FD.size, note: `FD · ${f.FD.what}, so the lobby can be washed down.` },
    { id: "chamber", title: "Inspection chamber", size: f.IC1.size, note: `IC1 · ${f.IC1.what}.` },
    { id: "ppr", title: "PP-R supply pipe", size: `${metres(/^cold$/)}, PN20, welded joints`, note: "In the linings 300 mm above the floor, then straight up to each outlet." },
    { id: "upvc", title: "uPVC drain pipe", size: metres(/^(soil|waste)$/), note: "Under the floor and through the plinth, each run falling at least 1:40, a rodding eye at every bend." },
    { id: "vent", title: "Vent and its cage", size: metres(/^vent$/), note: "V1 · up the back wall outside, to 900 mm above the roof." },
  ])
}

// The Electric rail: each device on its own (public-bathroom.html?item=<id>)
export function electricRail() {
  const n = EL.points.filter((p) => p.model === "light").length
  return railCards(`${D}/render/electric`, [
    { id: "board", title: "Unit board", size: EL.board.size, note: `DB · ${EL.board.what}.` },
    { id: "light", title: `Ceiling lights × ${n}`, size: "Ø 300 mm, a motion sensor in the middle", note: "L1–L5 · each room lights when someone walks in and goes dark a few minutes after." },
    { id: "fan", title: "Extract fan", size: `Ø ${mm(UR.fan.r * 2)} mm grille`, note: "F1 · in the urinal room, which has no window; it runs with the light and 15 minutes after." },
    { id: "socket", title: "Socket", size: "Double, 146 × 86 mm", note: "P1 · for the cleaner, by the cupboard." },
    { id: "walllight", title: "Light over the door", size: "About 180 × 140 mm, IP65", note: "L6 · outside, on with the path lights from 18:00." },
  ])
}

// every rail, as the Materials page lists them
export const rails: Rail[] = [
  { title: "Fixtures", items: fixturesRail() },
  { title: "Electric", items: electricRail() },
  { title: "Plumbing", items: plumbingRail() },
]
