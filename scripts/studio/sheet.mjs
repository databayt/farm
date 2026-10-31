// The drawing kit for the measured guide sheets (mm units). The studio's (scripts/studio/guide-drawings.mjs) and the
// guest room's (scripts/site/guest-room-measure.mjs) draw with it, so every sheet a tradesman reads looks the same.
export const C = { ink: "#1f2328", dim: "#1d4ed8", cut: "#c2410c", steel: "#9aa1a9", wood: "#e7cfa2", batten: "#b9874c",
  foam: "#f2d36b", oak: "#c9935a", ply: "#ead8b4", wet: "#cfe3f2", soft: "#f4efe6", fit: "#ffffff", membrane: "#2563eb" }
export class Sheet {
  constructor(x0, y0, w, h) { this.vb = [x0, y0, w, h]; this.out = [] }
  add(s) { this.out.push(s); return this }
  rect(x, y, w, h, fill = "none", stroke = C.ink, sw = 8, dash = "") {
    return this.add(`<rect x="${x}" y="${y}" width="${w}" height="${h}" fill="${fill}" stroke="${stroke}" stroke-width="${sw}"${dash ? ` stroke-dasharray="${dash}"` : ""}/>`)
  }
  line(x1, y1, x2, y2, stroke = C.ink, sw = 6, dash = "") {
    return this.add(`<line x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}" stroke="${stroke}" stroke-width="${sw}"${dash ? ` stroke-dasharray="${dash}"` : ""}/>`)
  }
  text(x, y, t, { size = 110, fill = C.ink, anchor = "middle", weight = 400, rotate = 0 } = {}) {
    const tr = rotate ? ` transform="rotate(${rotate} ${x} ${y})"` : ""
    return this.add(`<text x="${x}" y="${y}" font-size="${size}" font-weight="${weight}" fill="${fill}" text-anchor="${anchor}" dominant-baseline="middle"${tr}>${String(t).replace(/&/g, "&amp;").replace(/</g, "&lt;")}</text>`)
  }
  // a horizontal dimension: line at y from x1 to x2, ticks, the number above it
  dimH(x1, x2, y, label = Math.round(x2 - x1), { ext = [], size = 120, color = C.dim, below = false } = {}) {
    for (const [ex, ey] of ext) this.line(ex, ey, ex, y + (ey < y ? 40 : -40), color, 3)
    this.line(x1, y, x2, y, color, 5)
    for (const x of [x1, x2]) this.line(x - 30, y + 30, x + 30, y - 30, color, 7)
    return this.text((x1 + x2) / 2, y + (below ? 95 : -85), label, { size, fill: color, weight: 700 })
  }
  dimV(x, y1, y2, label = Math.round(y2 - y1), { ext = [], size = 120, color = C.dim, left = true } = {}) {
    for (const [ex, ey] of ext) this.line(ex, ey, x + (ex < x ? 40 : -40), ey, color, 3)
    this.line(x, y1, x, y2, color, 5)
    for (const y of [y1, y2]) this.line(x - 30, y + 30, x + 30, y - 30, color, 7)
    return this.text(x + (left ? -95 : 95), (y1 + y2) / 2, label, { size, fill: color, weight: 700, rotate: -90 })
  }
  // ordinate: a tick at x and its distance from the origin, the number standing up
  ord(x, y, label, { size = 105, color = C.dim, up = true } = {}) {
    this.line(x, y - 40, x, y + 40, color, 6)
    return this.text(x, up ? y - 70 : y + 70, label, { size, fill: color, weight: 700, rotate: -90, anchor: up ? "start" : "end" })
  }
  badge(x, y, n, r = 85) {
    this.add(`<circle cx="${x}" cy="${y}" r="${r}" fill="${C.dim}"/>`)
    return this.text(x, y + 4, n, { size: r * 1.25, fill: "#ffffff", weight: 700 })
  }
  svg() {
    const [x0, y0, w, h] = this.vb
    return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="${x0} ${y0} ${w} ${h}" width="${Math.round(w / 6)}" height="${Math.round(h / 6)}" font-family="Helvetica, Arial, sans-serif">\n<rect x="${x0}" y="${y0}" width="${w}" height="${h}" fill="#ffffff"/>\n${this.out.join("\n")}\n</svg>\n`
  }
}
