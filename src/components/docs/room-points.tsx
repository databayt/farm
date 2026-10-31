import type * as React from "react"

import { frw } from "@/lib/format"
import { type RailItem } from "@/components/docs/item-rail"
import { PointsTable } from "@/components/docs/points-table"
import { type RoomCircuit } from "@/components/docs/room-wiring"
import type { Locale } from "@/components/internationalization/config"
import { dictionary } from "@/components/internationalization/dictionaries"
import { getLocale } from "@/components/internationalization/locale"
import type { Words } from "@/components/internationalization/words"

// The services of a room page (guest room, office, study room), in the studio's Electric pattern: the circuits with
// their design currents, a rail card for each kind of device and the points table on the room's docs page, where the
// tagged figure links. The numbers come from the page's JSON (`electric`, `network`); rwf is the studio BOM's
// placeholder (AS-21), never a quote.

export type RoomPoint = {
  id: string; model: string; circuit?: string; description: string
  at: number[]; face: string; size: number[]; watts?: number; rwf?: number; untagged?: boolean
}

// a lighting circuit's design current is its watts at 230 V; the others carry the JSON's design load
export function withLoads(circuits: RoomCircuit[], points: RoomPoint[]): RoomCircuit[] {
  return circuits.map((c) => {
    if (c.design_A || c.group === "spare" || c.group === "data") return c
    const w = points.filter((p) => p.circuit === c.id).reduce((n, p) => n + (p.watts ?? 0), 0)
    return w ? { ...c, design_A: Math.max(0.1, Math.round((w / 230) * 10) / 10) } : c
  })
}

// the rooms' shared words (D-058): each kind of device, a card's size and cost around its numbers, the points table
const en = {
  titles: {
    board: "Unit board", ceiling: "Ceiling light", pendant: "Pendant light", walllamp: "Wall reading lamp",
    switch: "Switch", switch2: "Two-gang switch", wallfan: "Wall fan", usb: "Socket + USB-C", socket2: "Double socket",
    socket: "Socket", isolator: "AC isolator", heater: "Instant shower heater", alarm: "Smoke alarm", ap: "Wi-Fi access point", data: "Data outlet",
    av: "Screen wall plate", floorbox: "Floor box", rack: "Network cabinet", poe: "PoE switch", router: "4G router", gateway: "Edge gateway", ups: "UPS",
  } as Record<string, string>,
  round: (w: number, d: number) => `Ø ${w} mm, ${d} mm deep`,
  box: (w: string, h: string, d: number) => `${w} × ${h} mm, ${d} mm deep`,
  one: (n: string) => `RWF ${n} (estimate)`,
  each: (n: string, k: number) => `RWF ${n} each × ${k} (estimate)`,
  all: (n: string, k: number) => `RWF ${n} for ${k} (estimate)`,
  table: { what: "What and where", height: "Centre height", load: "Load", ceiling: "Ceiling", floor: "Floor", notWired: "Not wired" },
}
const rw: typeof en = {
  titles: {
    board: "Ikibaho cy'amashanyarazi", ceiling: "Itara ryo ku gisenge", pendant: "Itara rimanitse", walllamp: "Itara ryo gusomeraho ku rukuta",
    switch: "Switch", switch2: "Switch y'imfunguzo ebyiri", wallfan: "Fani yo ku rukuta", usb: "Priza + USB-C", socket2: "Priza ebyiri",
    socket: "Priza", isolator: "Isolator ya AC", heater: "Icyuma gishyushya amazi ya douche ako kanya", alarm: "Icyuma kimenyesha umwotsi",
    ap: "Access point ya Wi-Fi", data: "Priza ya data", av: "Plaque ya ecran ku rukuta", floorbox: "Agasanduku ko hasi", rack: "Akabati ka network",
    poe: "Switch ya PoE", router: "Router ya 4G", gateway: "Edge gateway", ups: "UPS",
  },
  round: (w, d) => `Ø mm ${w}, ubujyakuzimu mm ${d}`,
  box: (w, h, d) => `mm ${w} × ${h}, ubujyakuzimu mm ${d}`,
  one: (n) => `RWF ${n} (igereranya)`,
  each: (n, k) => `RWF ${n} kuri kimwe × ${k} (igereranya)`,
  all: (n, k) => `RWF ${n} kuri ${k} (igereranya)`,
  table: { what: "Icyo ari cyo n'aho kiri", height: "Uburebure bw'hagati", load: "Ingufu", ceiling: "Igisenge", floor: "Hasi", notWired: "Ntihujwe" },
}
const words: Words<typeof en> = { en, rw }
const ROUND = new Set(["ceiling", "alarm", "ap", "pendant"])

// one card per kind of device, rendered on its own by the page's render html (?item=<model>), labelled in `lang`
// (the points' descriptions and `extra` come already in it)
export function deviceRail(points: RoomPoint[], src: (model: string) => string, extra: Record<string, { title?: string; size?: string; where?: string; cost?: string }> = {}, lang: Locale = "en"): RailItem[] {
  const t = words[lang], r = dictionary(lang).rail
  const models = [...new Set(points.map((p) => p.model))]
  return models.map((m) => {
    const pts = points.filter((p) => p.model === m)
    const [w, h, d] = pts[0].size
    const size = ROUND.has(m) ? t.round(w, d) : t.box(frw(w), frw(h), d)
    const prices = pts.map((p) => p.rwf).filter((n): n is number => !!n)
    const cost = !prices.length ? r.notBudgeted
      : pts.length === 1 ? t.one(frw(prices[0]))
      : prices.every((n) => n === prices[0]) ? t.each(frw(prices[0]), pts.length)
      : t.all(frw(prices.reduce((a, b) => a + b, 0)), pts.length)
    const on = [...new Set(pts.map((p) => p.circuit).filter(Boolean))]
    const x = extra[m] ?? {}
    const title = x.title ?? t.titles[m] ?? m
    return {
      src: src(m), alt: title, title,
      note: `${pts.map((p) => p.id).join(", ")}${on.length ? ` · ${on.join(", ")}` : ""} · ${pts.map((p) => p.description).join("; ")}`,
      details: [
        { key: "size", label: r.dimensions, value: x.size ?? size },
        { key: "where", label: r.whereToBuy, value: x.where ?? r.notSourced },
        { key: "cost", label: r.cost, value: x.cost ?? cost },
      ],
    }
  })
}

// the tags' info: each point's label and its circuit's colour
export function tagInfo(points: RoomPoint[], circuits: RoomCircuit[]) {
  return Object.fromEntries(points.map((p) => [p.id, { label: p.description, colour: circuits.find((c) => c.id === p.circuit)?.colour }]))
}

// every point, its circuit and where it stands; each row is the target of its tag (#pt-<id>)
export async function RoomPointsTable({ points, circuits }: { points: RoomPoint[]; circuits: RoomCircuit[] }): Promise<React.JSX.Element> {
  const lang = await getLocale()
  const t = words[lang].table
  return (
    <PointsTable
      columns={[{ label: t.what }, { label: dictionary(lang).table.circuit, muted: true }, { label: t.height, end: true }, { label: t.load, end: true }]}
      rows={points.map((p) => {
        const c = circuits.find((x) => x.id === p.circuit)
        const height = p.face === "down" ? t.ceiling : p.face === "up" ? t.floor : `${frw(Math.round(p.at[2] * 1000))} mm`
        return { id: p.id, colour: c?.colour, cells: [p.description, c ? `${c.id} · ${c.serves}` : t.notWired, height, p.watts ? `${p.watts} W` : ""] }
      })} />
  )
}
