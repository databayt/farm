#!/usr/bin/env node
// The provisional master plan: the L-shaped land, its zones and an even, forest-like tree layout.
//
//   node scripts/site/master-plan.mjs   # src/components/site/site.json -> public/designs/site/master-plan.svg
//                                        #                                 + public/designs/site/site-dims.json
//
// Everything is in true metres from site.json. Trees: a jittered triangular grid in the woodland (even
// from a distance, never in rows up close), a looser ring around the compound, a few big shade trees in
// the field, and a boundary row; each keeps `clear` metres from zones it must not shade or root into.
// The layout is provisional until the boundary comes from the land title (UPI) or a survey.
import { mkdirSync, readFileSync, writeFileSync } from "node:fs"
import { dirname, join } from "node:path"
import { fileURLToPath } from "node:url"

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..", "..")
const site = JSON.parse(readFileSync(join(ROOT, "src", "components", "site", "site.json"), "utf8"))
const OUT = join(ROOT, "public", "designs", "site")

// deterministic jitter (mulberry32), so the drawing is the same on every run
let seed = site.trees.seed
const rand = () => { seed |= 0; seed = (seed + 0x6d2b79f5) | 0; let t = Math.imul(seed ^ (seed >>> 15), 1 | seed); t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t; return ((t ^ (t >>> 14)) >>> 0) / 4294967296 }

const inPoly = ([x, y], poly) => {
  let inside = false
  for (let i = 0, j = poly.length - 1; i < poly.length; j = i++) {
    const [xi, yi] = poly[i], [xj, yj] = poly[j]
    if ((yi > y) !== (yj > y) && x < ((xj - xi) * (y - yi)) / (yj - yi) + xi) inside = !inside
  }
  return inside
}
const inRect = ([x, y], [x0, y0, x1, y1], m = 0) => x >= x0 - m && x <= x1 + m && y >= y0 - m && y <= y1 + m
const distSeg = ([px, py], [ax, ay], [bx, by]) => {
  const dx = bx - ax, dy = by - ay, t = Math.max(0, Math.min(1, ((px - ax) * dx + (py - ay) * dy) / (dx * dx + dy * dy || 1)))
  return Math.hypot(px - (ax + t * dx), py - (ay + t * dy))
}
const zone = (id) => site.zones.find((z) => z.id === id)
const B = site.boundary
const nearBoundary = (p, d) => B.some((a, i) => distSeg(p, a, B[(i + 1) % B.length]) < d)
const onPath = (p, extra) => site.paths.some((pa) => pa.points.slice(1).some((b, i) => distSeg(p, pa.points[i], b) < pa.width / 2 + extra))
const C = site.trees.clear
const blocked = (p) =>
  ["compound", "veg", "yard", "houses", "lawn"].some((id) => inRect(p, zone(id).rect, C)) ||
  site.features.some((f) => (f.rect ? inRect(p, f.rect, C) : Math.hypot(p[0] - f.circle[0], p[1] - f.circle[1]) < f.circle[2] + C)) ||
  onPath(p, C) || nearBoundary(p, site.trees.boundary.inset + 4)

const trees = []
// woodland: jittered triangular grid
{
  const { spacing: s, jitter, canopy } = site.trees.woodland
  const [x0, y0, x1, y1] = zone("woodland").rect
  for (let row = 0, y = y0 + s / 2; y < y1; row++, y += (s * Math.sqrt(3)) / 2) {
    for (let x = x0 + (row % 2 ? s : s / 2); x < x1; x += s) {
      const p = [x + (rand() - 0.5) * 2 * jitter * s, y + (rand() - 0.5) * 2 * jitter * s]
      if (inPoly(p, B) && inRect(p, zone("woodland").rect) && !blocked(p)) trees.push({ p, kind: "woodland", r: canopy / 2 })
    }
  }
}
// compound edge: a ring at a looser spacing, 6 m outside the compound
{
  const { spacing: s, canopy } = site.trees.compound_edge
  const [x0, y0, x1, y1] = zone("compound").rect.map((v, i) => v + (i < 2 ? -6 : 6))
  const ring = []
  for (let x = x0; x <= x1; x += s) ring.push([x, y0], [x, y1])
  for (let y = y0 + s; y < y1; y += s) ring.push([x0, y], [x1, y])
  for (const p of ring)
    if (inPoly(p, B) && !nearBoundary(p, 3) && !onPath(p, 2) && !site.features.some((f) => f.rect && inRect(p, f.rect, 2)) &&
        !inRect(p, zone("lawn").rect, 1) && !trees.some((t) => Math.hypot(t.p[0] - p[0], t.p[1] - p[1]) < s * 0.6))
      trees.push({ p, kind: "compound", r: canopy / 2 })
}
// field: a few big shade trees, placed by hand in site.json
for (const p of site.trees.field) trees.push({ p, kind: "field", r: 6 })
// boundary row: every `spacing` metres along the edges, inset, skipping the arrival road
{
  const { spacing: s, inset } = site.trees.boundary
  for (let i = 0; i < B.length; i++) {
    const a = B[i], b = B[(i + 1) % B.length]
    const len = Math.hypot(b[0] - a[0], b[1] - a[1])
    // inward normal: the boundary runs clockwise on screen (y down), so the inside is to the right
    const nx = -(b[1] - a[1]) / len, ny = (b[0] - a[0]) / len
    for (let d = s / 2; d < len; d += s) {
      const p = [a[0] + ((b[0] - a[0]) * d) / len + nx * inset, a[1] + ((b[1] - a[1]) * d) / len + ny * inset]
      if (inPoly(p, B) && !onPath(p, 3)) trees.push({ p, kind: "boundary", r: 2.5 })
    }
  }
}

// ---------------------------------------------------------------- drawing (1 m = 3 px, a margin for the legend)
const S = 3, M = 30, W = 277 * S + 2 * M + 330, H = 255 * S + 2 * M + 40
const X = (v) => (M + v * S).toFixed(1), Y = (v) => (M + v * S).toFixed(1)
const esc = (t) => String(t).replace(/&/g, "&amp;").replace(/</g, "&lt;")
const FILL = { compound: "#efe7d6", veg: "#e3efd8", yard: "#ece9e2", paddock: "#f2ecd9", houses: "#e8dfcc", woodland: "#f4f7f0", lawn: "#eef4e6" }
const out = []
out.push(`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${W} ${H}" width="${W}" height="${H}" font-family="Helvetica, Arial, sans-serif">`)
out.push(`<rect width="${W}" height="${H}" fill="#ffffff"/>`)
out.push(`<polygon points="${B.map(([x, y]) => `${X(x)},${Y(y)}`).join(" ")}" fill="#fbfbf8" stroke="#2b2a26" stroke-width="2.2"/>`)
for (const z of site.zones) {
  const [x0, y0, x1, y1] = z.rect
  out.push(`<rect x="${X(x0)}" y="${Y(y0)}" width="${((x1 - x0) * S).toFixed(1)}" height="${((y1 - y0) * S).toFixed(1)}" fill="${FILL[z.id] ?? "#f4f4f0"}" stroke="#8a867c" stroke-width="0.8" stroke-dasharray="${z.id === "woodland" ? "4 3" : "none"}"/>`)
  // a strip too narrow for its label carries it vertically
  if (x1 - x0 < 20) out.push(`<text transform="translate(${X(x0 + 6)},${Y(y0 + 3)}) rotate(90)" font-size="11" font-weight="600" fill="#2b2a26">${esc(z.label)}</text>`)
  else out.push(`<text x="${X(x0 + 2)}" y="${Y(y0 + 5)}" font-size="11" font-weight="600" fill="#2b2a26">${esc(z.label)}</text>`)
}
for (const pa of site.paths)
  out.push(`<polyline points="${pa.points.map(([x, y]) => `${X(x)},${Y(y)}`).join(" ")}" fill="none" stroke="#b9a98a" stroke-width="${pa.width * S}" stroke-linecap="round" stroke-linejoin="round" opacity="0.55"/>`)
// each feature gets its short name beside it; the legend keeps the full label
const short = (f) => f.label.split(/ \(| ≥| [0-9]/)[0]
for (const f of site.features) {
  if (f.rect) {
    const [x0, y0, x1, y1] = f.rect
    out.push(`<rect x="${X(x0)}" y="${Y(y0)}" width="${((x1 - x0) * S).toFixed(1)}" height="${((y1 - y0) * S).toFixed(1)}" fill="none" stroke="#2b2a26" stroke-width="1.2"/>`)
    out.push(`<text x="${X(x0)}" y="${Y(y1 + 4)}" font-size="9.5" fill="#2b2a26">${esc(short(f))}</text>`)
  } else {
    const [x, y, r] = f.circle
    out.push(`<circle cx="${X(x)}" cy="${Y(y)}" r="${(r * S).toFixed(1)}" fill="none" stroke="#2b2a26" stroke-width="1.2"/>`)
    out.push(`<text x="${X(x + r + 1)}" y="${Y(y + 1)}" font-size="9.5" fill="#2b2a26">${esc(short(f))}</text>`)
  }
}
const TREE = { woodland: "#5f8a52", compound: "#7aa36a", field: "#4d7a43", boundary: "#93ad84" }
for (const t of trees)
  out.push(`<circle cx="${X(t.p[0])}" cy="${Y(t.p[1])}" r="${(t.r * S * 0.62).toFixed(1)}" fill="${TREE[t.kind]}" fill-opacity="0.55" stroke="${TREE[t.kind]}" stroke-width="0.6"/>`)
// legend
const lx = M + 277 * S + 30
let ly = M + 10
const line = (t, size = 12, weight = 400) => { out.push(`<text x="${lx}" y="${ly}" font-size="${size}" font-weight="${weight}" fill="#2b2a26">${esc(t)}</text>`); ly += size + 8 }
line("MASTER PLAN · PROVISIONAL", 15, 700)
line("Scaled from the founder's sketch to 5 ha.", 11)
line("North not fixed; orientation as sketched.", 11)
line("Replace with the land-title plan (UPI).", 11)
line("Two grounds in the footage (2026-10-25):", 11)
line("a mown lawn, and a laterite hill above", 11)
line("the compound whose runoff reaches it.", 11)
line("The hill's extent and a cut-off swale are", 11)
line("drawn once a slope reading or the pin exists.", 11)
ly += 8
const counts = { woodland: 0, compound: 0, field: 0, boundary: 0 }
for (const t of trees) counts[t.kind]++
line("Trees", 13, 700)
line(`${counts.woodland} woodland, 12 m loose grid`, 11)
line(`${counts.compound} around the compound, 14 m`, 11)
line(`${counts.field} big shade trees in the field`, 11)
line(`${counts.boundary} on the boundary, 8 m`, 11)
ly += 8
line("Features", 13, 700)
for (const f of site.features) line(f.label, 11)
for (const pa of site.paths) line(pa.label, 11)
// scale bar 0-50 m
const sy = M + 255 * S + 24
out.push(`<rect x="${X(0)}" y="${sy}" width="${50 * S}" height="5" fill="#2b2a26"/><rect x="${X(10)}" y="${sy}" width="${10 * S}" height="5" fill="#ffffff"/><rect x="${X(30)}" y="${sy}" width="${10 * S}" height="5" fill="#ffffff"/>`)
out.push(`<text x="${X(0)}" y="${sy + 18}" font-size="10" fill="#2b2a26">0</text><text x="${X(50) - 14}" y="${sy + 18}" font-size="10" fill="#2b2a26">50 m</text>`)
out.push("</svg>")

mkdirSync(OUT, { recursive: true })
writeFileSync(join(OUT, "master-plan.svg"), out.join("\n") + "\n")
const area = (r) => Math.round((r[2] - r[0]) * (r[3] - r[1]))
let a = 0
for (let i = 0; i < B.length; i++) { const [x1, y1] = B[i], [x2, y2] = B[(i + 1) % B.length]; a += x1 * y2 - x2 * y1 }
const dims = {
  area_m2: Math.round(Math.abs(a) / 2), area_ha: +(Math.abs(a) / 2 / 10000).toFixed(2),
  width_m: 277, depth_m: 255, block_w_m: 147, arm_depth_m: 98,
  veg_m2: area(zone("veg").rect), paddock_m2: area(zone("paddock").rect), houses_m2: area(zone("houses").rect),
  woodland_m2: area(zone("woodland").rect), compound_m2: area(zone("compound").rect),
  trees: trees.length, trees_woodland: counts.woodland, trees_compound: counts.compound, trees_field: counts.field, trees_boundary: counts.boundary,
}
writeFileSync(join(OUT, "site-dims.json"), JSON.stringify(dims, null, 1) + "\n")
console.log(`master-plan.svg: ${trees.length} trees (${JSON.stringify(counts)}); boundary ${dims.area_ha} ha`)
