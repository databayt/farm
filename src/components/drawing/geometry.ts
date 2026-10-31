// A dimension drawn the way the studio's plan draws one (scripts/studio/draw.py `dim`, scripts/studio/sheets.py
// `plan_bw`): extension lines from the measured points to a little past the dimension line, a 45° slash at each end,
// and the figure in millimetres set into a break in the line and turned with it, so that a vertical figure reads
// down the page. Pure geometry, no React, so the Node scripts can draw the same dimension.
//
// The studio's plan is drawn in paper millimetres at 1:25 on a 271.92 mm sheet. A place's plan is drawn in metres at
// whatever width it needs, so every studio measure here is multiplied by k, the plan's metres per studio millimetre:
// at that k the figures come out the same share of the drawing as the studio's.

export type Pt = readonly [number, number]

/** The studio plan's measures, in its paper millimetres (draw.py `dim`, sheets.py `plan_bw`). */
export const STUDIO = {
  width: 271.92, // the plan's viewBox width
  figure: 2.4, // a dimension's figure
  inner: 2.2, // a figure inside the room
  name: 2.6, // a zone's name over its chain
  tick: 1, // half a slash
  over: 0.15, // the extension line runs on past the dimension line by this share of the offset
  gap: 1, // the extension line starts this far off the measured point
  first: 4, // the first tier of dimensions off the object
  step: 6, // each further tier
  names: 7, // a chain's names beyond its dimension line
} as const

/** The 2D's frame on a large screen is about 1.75 times as wide as it is tall: a tall plan fills the frame's height,
 *  so it is scaled by its height times that, and its figures still come out the size of the studio's. */
export const FRAME = 1.75
export const scaleFor = (w: number, h: number): number => Math.max(w, h * FRAME) / STUDIO.width

/** Metres to millimetres with a thousands comma, as the studio's figures: 5.798 → "5,798". */
export const mm = (m: number): string => Math.round(m * 1000).toLocaleString("en-US")

/** The distance of tier n (1, 2, 3 …) off the object, in studio millimetres. */
export const tier = (n = 1): number => STUDIO.first + (n - 1) * STUDIO.step

/**
 * The viewBox round a plan's drawing and its dimensions: `box` is what the plan draws, in its own units, and `margin`
 * how far its dimensions reach past each side, in studio millimetres. k depends on the frame and the frame on k, so
 * they are settled together.
 */
export function frame(box: { x0: number; y0: number; x1: number; y1: number },
  margin: { top: number; right: number; bottom: number; left: number }): { k: number; viewBox: string } {
  const w0 = box.x1 - box.x0, h0 = box.y1 - box.y0
  let k = scaleFor(w0, h0)
  for (let i = 0; i < 8; i++) k = scaleFor(w0 + (margin.left + margin.right) * k, h0 + (margin.top + margin.bottom) * k)
  const x = box.x0 - margin.left * k, y = box.y0 - margin.top * k
  const w = w0 + (margin.left + margin.right) * k, h = h0 + (margin.top + margin.bottom) * k
  return { k, viewBox: [x, y, w, h].map((n) => +n.toFixed(3)).join(" ") }
}

export type Segment = readonly [Pt, Pt]
export type DimGeom = {
  ext: Segment[]
  line: Segment[]
  ticks: Segment[]
  text: { at: Pt; angle: number; size: number; inline: boolean }
}

const r = (n: number) => +n.toFixed(4)
const pt = (x: number, y: number): Pt => [r(x), r(y)]

/**
 * The dimension from a to b, its line `off` studio millimetres to the left of a→b (negative: to the right; for a
 * left-to-right horizontal that is below, as SVG's y runs down), the figure `size` studio millimetres high.
 * When the figure does not fit in a break in the line, it sits beside the line, on the side away from the object.
 */
export function dimension(a: Pt, b: Pt, off: number, k: number, label: string, size: number = STUDIO.figure): DimGeom {
  const dx = b[0] - a[0], dy = b[1] - a[1]
  const L = Math.hypot(dx, dy) || 1
  const ux = dx / L, uy = dy / L
  const nx = -uy, ny = ux // the unit normal to the left of a→b
  const o = off * k, g = Math.sign(off) * STUDIO.gap * k
  const A = pt(a[0] + nx * o, a[1] + ny * o), B = pt(b[0] + nx * o, b[1] + ny * o)
  const past = o * (1 + STUDIO.over)
  const ext: Segment[] = [
    [pt(a[0] + nx * g, a[1] + ny * g), pt(a[0] + nx * past, a[1] + ny * past)],
    [pt(b[0] + nx * g, b[1] + ny * g), pt(b[0] + nx * past, b[1] + ny * past)],
  ]
  let angle = (Math.atan2(dy, dx) * 180) / Math.PI
  if (angle > 90 || angle <= -90) angle += 180
  const t = STUDIO.tick * k
  const ticks: Segment[] = [A, B].map((p) => [pt(p[0] - t, p[1] + t), pt(p[0] + t, p[1] - t)] as Segment)
  const mx = (A[0] + B[0]) / 2, my = (A[1] + B[1]) / 2
  const half = (label.length * size * 0.3 + size * 0.5) * k // the gap round the figure (draw.py)
  if (L > 2 * half + 2 * t) {
    return {
      ext, ticks,
      line: [[A, pt(mx - ux * half, my - uy * half)], [pt(mx + ux * half, my + uy * half), B]],
      text: { at: pt(mx, my), angle: r(angle), size: r(size * k), inline: true },
    }
  }
  const s = Math.sign(off) || 1, d = size * 0.8 * k
  return { ext, ticks, line: [[A, B]], text: { at: pt(mx + nx * s * d, my + ny * s * d), angle: r(angle), size: r(size * k), inline: false } }
}
