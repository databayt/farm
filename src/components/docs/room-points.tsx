import type * as React from "react"

import { frw } from "@/lib/format"
import { type RailItem } from "@/components/docs/item-rail"
import { PointsTable } from "@/components/docs/points-table"
import { type RoomCircuit } from "@/components/docs/room-wiring"
import { NOT_BUDGETED, NOT_SOURCED } from "@/components/page/sections"

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

const TITLES: Record<string, string> = {
  board: "Unit board", ceiling: "Ceiling light", pendant: "Pendant light", walllamp: "Wall reading lamp",
  switch: "Switch", switch2: "Two-gang switch", wallfan: "Wall fan", usb: "Socket + USB-C", socket2: "Double socket",
  socket: "Socket", isolator: "AC isolator", alarm: "Smoke alarm", ap: "Wi-Fi access point", data: "Data outlet",
  av: "Screen wall plate", floorbox: "Floor box", rack: "Network cabinet", poe: "PoE switch", router: "4G router", gateway: "Edge gateway", ups: "UPS",
}
const ROUND = new Set(["ceiling", "alarm", "ap", "pendant"])

// one card per kind of device, rendered on its own by the page's render html (?item=<model>)
export function deviceRail(points: RoomPoint[], src: (model: string) => string, extra: Record<string, { title?: string; size?: string; where?: string; cost?: string }> = {}): RailItem[] {
  const models = [...new Set(points.map((p) => p.model))]
  return models.map((m) => {
    const pts = points.filter((p) => p.model === m)
    const [w, h, d] = pts[0].size
    const size = ROUND.has(m) ? `Ø ${w} mm, ${d} mm deep` : `${frw(w)} × ${frw(h)} mm, ${d} mm deep`
    const prices = pts.map((p) => p.rwf).filter((n): n is number => !!n)
    const cost = !prices.length ? NOT_BUDGETED
      : pts.length === 1 ? `RWF ${frw(prices[0])} (estimate)`
      : prices.every((n) => n === prices[0]) ? `RWF ${frw(prices[0])} each × ${pts.length} (estimate)`
      : `RWF ${frw(prices.reduce((a, b) => a + b, 0))} for ${pts.length} (estimate)`
    const on = [...new Set(pts.map((p) => p.circuit).filter(Boolean))]
    const x = extra[m] ?? {}
    const title = x.title ?? TITLES[m] ?? m
    return {
      src: src(m), alt: title, title,
      note: `${pts.map((p) => p.id).join(", ")}${on.length ? ` · ${on.join(", ")}` : ""} · ${pts.map((p) => p.description).join("; ")}`,
      details: [
        { label: "Dimensions", value: x.size ?? size },
        { label: "Where to buy", value: x.where ?? NOT_SOURCED },
        { label: "Cost", value: x.cost ?? cost },
      ],
    }
  })
}

// the tags' info: each point's label and its circuit's colour
export function tagInfo(points: RoomPoint[], circuits: RoomCircuit[]) {
  return Object.fromEntries(points.map((p) => [p.id, { label: p.description, colour: circuits.find((c) => c.id === p.circuit)?.colour }]))
}

// every point, its circuit and where it stands; each row is the target of its tag (#pt-<id>)
export function RoomPointsTable({ points, circuits }: { points: RoomPoint[]; circuits: RoomCircuit[] }): React.JSX.Element {
  return (
    <PointsTable
      columns={[{ label: "What and where" }, { label: "Circuit", muted: true }, { label: "Centre height", end: true }, { label: "Load", end: true }]}
      rows={points.map((p) => {
        const c = circuits.find((x) => x.id === p.circuit)
        const height = p.face === "down" ? "Ceiling" : p.face === "up" ? "Floor" : `${frw(Math.round(p.at[2] * 1000))} mm`
        return { id: p.id, colour: c?.colour, cells: [p.description, c ? `${c.id} · ${c.serves}` : "Not wired", height, p.watts ? `${p.watts} W` : ""] }
      })} />
  )
}
