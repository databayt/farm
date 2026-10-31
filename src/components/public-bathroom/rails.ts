import { railCards } from "@/components/page/sections"
import type { RailItem } from "@/components/docs/item-rail"
import { bathData, D } from "@/components/public-bathroom/data"
import bath from "@/components/public-bathroom/public-bathroom.json"
import { runs } from "@/components/public-bathroom/services"
import { words } from "@/components/public-bathroom/words"
import type { Rail } from "@/components/docs/rail-table"
import type { Locale } from "@/components/internationalization/config"
import { dictionary } from "@/components/internationalization/dictionaries"

// The public bathroom's rails, moved off its page so that the page (/[lang]/public-bathroom) and its Materials page in the docs
// (D-059) read one list.
const mm = (m: number) => Math.round(m * 1000).toLocaleString("en-US")
const { toilets: TO, basins: BA, urinal: UR, cupboard: CU, passage: PA, towels: TW, electric: EL } = bath

// The Fixtures rail: each piece rendered on its own by public-bathroom.html?item=<id> (the 3D view's own meshes)
export function fixturesRail(lang: Locale): RailItem[] {
  const t = words[lang].rails.fixtures
  const c = TO.wc.cistern
  return railCards(`${D}/render/fixtures`, [
    { id: "wc", title: t.wc.title, size: t.wc.size(mm(c.w), mm(c.d), mm(c.h), mm(TO.wc.out), mm(TO.wc.seat)), note: t.wc.note },
    { id: "basin", title: t.basin.title, size: t.basin.size((BA.x1 - BA.x0).toFixed(2), BA.d.toFixed(2), BA.top.toFixed(2)), note: t.basin.note },
    { id: "urinal", title: t.urinal.title, size: t.urinal.size(mm(UR.w), mm(UR.rim), mm(UR.out)), note: t.urinal.note },
    { id: "mirror", title: t.mirror.title, size: t.mirror.size((BA.mirror.x1 - BA.mirror.x0).toFixed(2), (BA.mirror.y1 - BA.mirror.y0).toFixed(2)), note: t.mirror.note },
    { id: "soap", title: t.soap.title, size: t.soap.size, note: t.soap.note },
    { id: "towels", title: t.towels.title, size: t.towels.size(mm(TW.w), mm(TW.bin * 2)), note: t.towels.note },
    { id: "roll", title: t.roll.title, size: t.roll.size, note: t.roll.note(mm(TO.roll.at)) },
    { id: "cupboard", title: t.cupboard.title, size: t.cupboard.size((CU.x1 - CU.x0).toFixed(2), (PA.y1 - PA.y0).toFixed(2)), where: t.cupboard.where, note: t.cupboard.note },
  ], lang)
}

// The Plumbing rail: each fitting on its own (public-bathroom.html?item=<id>), then the pipe, its metres measured off the runs
export function plumbingRail(lang: Locale): RailItem[] {
  const t = words[lang].rails.plumbing
  const metres = (re: RegExp) => {
    const by = new Map<number, number>()
    for (const r of runs.filter((x) => re.test(x.system))) by.set(r.dn, (by.get(r.dn) ?? 0) + r.m)
    return [...by].sort((a, b) => b[0] - a[0]).map(([dn, m]) => t.metres(m.toFixed(1), dn)).join(", ")
  }
  const f = bathData(lang).fitting
  return railCards(`${D}/render/plumbing`, [
    { id: "meter", title: t.meter.title, size: t.meter.size(f.SV.size), note: `SV · ${f.SV.what}.` },
    { id: "pushtap", title: t.pushtap.title, size: t.pushtap.size, note: t.pushtap.note },
    { id: "flushvalve", title: t.flushvalve.title, size: t.flushvalve.size, note: `UV · ${f.UV.what}.` },
    { id: "floordrain", title: t.floordrain.title, size: f.FD.size, note: t.floordrain.note(f.FD.what) },
    { id: "chamber", title: t.chamber.title, size: f.IC1.size, note: `IC1 · ${f.IC1.what}.` },
    { id: "ppr", title: t.ppr.title, size: t.ppr.size(metres(/^cold$/)), note: t.ppr.note },
    { id: "upvc", title: t.upvc.title, size: metres(/^(soil|waste)$/), note: t.upvc.note },
    { id: "vent", title: t.vent.title, size: metres(/^vent$/), note: t.vent.note },
  ], lang)
}

// The Electric rail: each device on its own (public-bathroom.html?item=<id>)
export function electricRail(lang: Locale): RailItem[] {
  const t = words[lang].rails.electric
  const board = bathData(lang).board
  const n = EL.points.filter((p) => p.model === "light").length
  return railCards(`${D}/render/electric`, [
    { id: "board", title: t.board.title, size: board.size, note: `DB · ${board.what}.` },
    { id: "light", title: t.light.title(n), size: t.light.size, note: t.light.note },
    { id: "fan", title: t.fan.title, size: t.fan.size(mm(UR.fan.r * 2)), note: t.fan.note },
    { id: "socket", title: t.socket.title, size: t.socket.size, note: t.socket.note },
    { id: "walllight", title: t.walllight.title, size: t.walllight.size, note: t.walllight.note },
  ], lang)
}

// every rail, as the Materials page lists them
export function rails(lang: Locale): Rail[] {
  const t = dictionary(lang).page
  return [
    { title: words[lang].fixtures, items: fixturesRail(lang) },
    { title: t.electric, items: electricRail(lang) },
    { title: t.plumbing, items: plumbingRail(lang) },
  ]
}
