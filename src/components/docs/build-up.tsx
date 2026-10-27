"use client"

// A part of the studio built in fast motion as the reader scrolls (the Floor and Wall sections). The section
// is one screen tall per stage and stays pinned; reaching a stage runs its build like a time-lapse, and
// scrolling back takes it apart, last build first. Each build lays groups of pieces one after another:
// "drop" pieces fall from above (large, high and shadowed, then landing), "fix" pieces (screws) pop in
// after the matching drop lands, an "unroll" piece rolls out from its top edge behind a roll, "wipe"
// pieces are painted on one after another, each from its top edge down like a roller pass, and "spray"
// pieces fill from the bottom up behind a lumpy front, like foam sprayed on in passes. Every piece is
// cropped from its layer's transparent render (scripts/studio/render/floor.html, wall.html, which also
// write the piece rectangles), so the pieces meet exactly.
// The pieces are painted on one canvas over the base picture, from pictures decoded once, and only while
// something moves, so the browser has nothing to lay out, re-paint or re-decode per piece. One clock
// (performance.now) times every frame: the frame's own timestamp can lag it, and a step back in time once
// blinked pieces still to come into view.
import { useEffect, useRef, useState } from "react"

import { cx } from "@/lib/cx"

type Rect = number[] // [x, y, w, h] as fractions of the picture
export type Group = { src: string; rects: Rect[]; kind: "drop" | "fix" | "unroll" | "wipe" | "spray"; from: number; to: number; rise?: number }
export type Build = { secs: number; label: string; groups: Group[] }
type Stage = { title: string; text: string }
type Pic = ImageBitmap | HTMLImageElement

const DUR = 0.15 // of a build's clock, each piece's own motion
const MAX = 2400 // the renders' width: a canvas any wider gains nothing
const clamp = (v: number) => Math.min(1, Math.max(0, v))
const out = (t: number) => 1 - (1 - t) ** 3
const hash = (a: number, b: number) => { const v = Math.sin(a * 127.1 + b * 311.7) * 43758.5453; return v - Math.floor(v) }
const dims = (p: Pic) => (p instanceof HTMLImageElement ? [p.naturalWidth, p.naturalHeight] : [p.width, p.height])
// a decoded picture at the canvas's size (a phone keeps a fraction of the pixels), or as it came
const fit = (img: HTMLImageElement, w: number, h: number): Promise<Pic> =>
  w > 0 && img.naturalWidth > w && typeof createImageBitmap === "function"
    ? createImageBitmap(img, { resizeWidth: w, resizeHeight: h, resizeQuality: "high" }).catch(() => img)
    : Promise.resolve(img)

export function BuildUp({ title, base, baseAlt, aspect, builds, stages }: {
  title: string; base: string; baseAlt: string; aspect: number; builds: Build[]; stages: Stage[]
}) {
  const ref = useRef<HTMLDivElement>(null)
  const canvas = useRef<HTMLCanvasElement>(null)
  const [active, setActive] = useState(0)
  const n = stages.length

  useEffect(() => {
    const box = ref.current, cv = canvas.current, ctx = cv?.getContext("2d")
    if (!box || !cv || !ctx) return
    const still = window.matchMedia("(prefers-reduced-motion: reduce)").matches
    const srcs = [...new Set(builds.flatMap((b) => b.groups.map((g) => g.src)))]
    const imgs = new Map<string, HTMLImageElement>(), pics = new Map<string, Pic>()
    const c = builds.map(() => 0) // each build's clock, 0 (not started) to 1 (done)
    let stage = 0, last = 0, frame = 0, W = 0, H = 0, px = 1, made = 0, seen = false, gone = false

    // a piece's rectangle on the canvas, its edges on whole pixels so neighbours meet without a seam, and
    // the same rectangle of its picture
    const place = (r: Rect, p: Pic) => {
      const [pw, ph] = dims(p), x0 = Math.round(r[0] * W), y0 = Math.round(r[1] * H)
      const w = Math.round((r[0] + r[2]) * W) - x0, h = Math.round((r[1] + r[3]) * H) - y0
      return { x0, y0, w, h, sx: (x0 / W) * pw, sy: (y0 / H) * ph, sw: (w / W) * pw, sh: (h / H) * ph }
    }
    const shade = (a = 0, blur = 0, y = 0) => {
      ctx.shadowColor = `rgba(0,0,0,${a})`; ctx.shadowBlur = blur * px; ctx.shadowOffsetY = y * px
    }
    // the sheet still on its roll, riding the unrolled edge: a grey cylinder across it
    const roll = (x: number, y: number, w: number) => {
      const r = H * 0.015, g = ctx.createLinearGradient(0, y - r, 0, y + r)
      g.addColorStop(0, "#f1f2f1"); g.addColorStop(0.55, "#c3c5c4"); g.addColorStop(1, "#9a9d9c")
      ctx.fillStyle = g
      shade(0.18, 6, 3)
      ctx.beginPath(); ctx.arc(x + r, y, r, Math.PI / 2, -Math.PI / 2); ctx.arc(x + w - r, y, r, -Math.PI / 2, Math.PI / 2); ctx.fill()
      shade()
    }

    const draw = () => {
      ctx.clearRect(0, 0, W, H)
      const air: (() => void)[] = [] // pieces still falling, drawn over the ones laid
      builds.forEach((b, i) => b.groups.forEach((g) => {
        const p = pics.get(g.src), span = g.to - g.from
        if (!p || c[i] <= 0) return
        g.rects.forEach((r, k) => {
          const s = g.from + (k / g.rects.length) * span, { x0, y0, w, h, sx, sy, sw, sh } = place(r, p)
          const lay = (v = 1) => { if (v > 0) ctx.drawImage(p, sx, sy, sw, sh * v, x0, y0, w, h * v) } // its top v
          if (g.kind === "drop") {
            const t = clamp((c[i] - s) / DUR)
            if (t >= 1) lay()
            else if (t > 0) air.push(() => {
              const e = out(t), z = 1 + 0.18 * (1 - e)
              ctx.globalAlpha = clamp(t * 3)
              shade(0.3 * (1 - e), 22 * (1 - e), 14 * (1 - e))
              ctx.drawImage(p, sx, sy, sw, sh, x0 + (w * (1 - z)) / 2, y0 + (h * (1 - z)) / 2 + (e - 1) * (g.rise ?? 40) * px, w * z, h * z)
              ctx.globalAlpha = 1
              shade()
            })
          } else if (g.kind === "fix") { // after the matching drop lands
            const u = clamp((c[i] - s - DUR) / 0.06), z = 1.03 - 0.03 * u
            if (u >= 1) lay()
            else if (u > 0) {
              ctx.globalAlpha = u
              ctx.drawImage(p, sx, sy, sw, sh, x0 + (w * (1 - z)) / 2, y0 + (h * (1 - z)) / 2, w * z, h * z)
              ctx.globalAlpha = 1
            }
          } else if (g.kind === "wipe") lay(out(clamp((c[i] - s) / DUR))) // a roller pass, top to bottom
          else if (g.kind === "spray") { // rising from the bottom behind a lumpy front, the same lumps every frame
            const q = clamp((c[i] - s) / DUR)
            if (q >= 1) lay()
            else if (q > 0) {
              const a = Math.min(w / 4, H * 0.02), m = Math.max(2, Math.round(w / (3 * a)))
              const y = y0 + h - (h + a) * out(q) // the front's troughs; its crests stand up to a above them
              ctx.save()
              ctx.beginPath(); ctx.moveTo(x0, y0 + h); ctx.lineTo(x0, y)
              for (let j = 0; j < m; j++) ctx.quadraticCurveTo(x0 + (w * (j + 0.5)) / m, y - a * (1 + hash(k, j)), x0 + (w * (j + 1)) / m, y)
              ctx.lineTo(x0 + w, y0 + h); ctx.closePath(); ctx.clip()
              lay()
              ctx.restore()
            }
          } else if (c[i] > g.from) { // unroll down from the top edge, the roll riding the front
            const v = out(clamp((c[i] - g.from) / span))
            lay(v)
            if (v < 1) roll(x0, y0 + h * v, w)
          }
        })
      }))
      air.forEach((f) => f())
    }

    const tick = () => {
      frame = 0
      const now = performance.now(), dt = Math.min(0.1, Math.max(0, (now - last) / 1000))
      last = now
      // a build runs once its stage is reached, the one before is done and its pictures are in; it comes off
      // only after the next. Off screen, or for a reader who asked for less motion, it is just done or undone
      let moving = false
      for (let i = 0; i < c.length; i++) {
        const on = (stage > i && (i === 0 || c[i - 1] >= 1) && builds[i].groups.every((g) => pics.has(g.src))) || (i < c.length - 1 && c[i + 1] > 0)
        const step = still || !seen ? 1 : dt / builds[i].secs
        const next = on ? Math.min(1, c[i] + step) : Math.max(0, c[i] - 2 * step)
        // on until it is where it is going: a frame with no time in it (two at one timestamp) moves nothing
        if (next !== c[i] || (on ? next < 1 : next > 0)) moving = true
        c[i] = next
      }
      draw()
      if (moving) frame = requestAnimationFrame(tick)
    }
    const kick = () => { if (!frame) { last = performance.now(); frame = requestAnimationFrame(tick) } }

    const onScroll = () => {
      const r = box.getBoundingClientRect()
      const p = -r.top / Math.max(1, r.height - window.innerHeight)
      seen = r.top < window.innerHeight && r.bottom > 0 // now, not when the observer next reports: a jump in runs the build
      let next = 0
      for (let k = 1; k < n; k++) if (p > (k - 0.64) / (n - 1)) next = k
      if (next !== stage) { stage = next; setActive(next); kick() }
    }
    // the canvas at the screen's resolution, up to the renders' own; pictures made for a smaller one are remade
    const size = () => {
      const { width, height } = cv.getBoundingClientRect()
      if (!width) return
      px = Math.min(window.devicePixelRatio || 1, MAX / width)
      const w = Math.round(width * px), h = Math.round(height * px)
      if (w === W && h === H) return
      W = cv.width = w; H = cv.height = h
      if (made && W > made) {
        const at = (made = W)
        imgs.forEach((img, s) => fit(img, W, H).then((p) => {
          if (gone || made !== at) return
          const old = pics.get(s)
          pics.set(s, p)
          if (old && old !== p && "close" in old) old.close()
          draw()
        }))
      }
      draw()
    }
    const load = () => {
      made = W
      srcs.forEach((s) => {
        const img = new Image()
        img.src = s
        img.decode().then(() => fit(img, W, H)).then((p) => {
          if (gone) return
          imgs.set(s, img); pics.set(s, p)
          kick()
        }, () => {})
      })
    }

    // the pictures come in a screen before the section; the clocks only run while it is on screen
    const near = new IntersectionObserver((es) => { if (es.some((e) => e.isIntersecting)) { near.disconnect(); load() } }, { rootMargin: "100% 0px" })
    const view = new IntersectionObserver((es) => { seen = es[es.length - 1].isIntersecting; kick() })
    const ro = new ResizeObserver(size)
    near.observe(box); view.observe(box); ro.observe(cv)
    size()
    onScroll()
    window.addEventListener("scroll", onScroll, { passive: true })
    window.addEventListener("resize", onScroll)
    return () => {
      gone = true
      cancelAnimationFrame(frame)
      near.disconnect(); view.disconnect(); ro.disconnect()
      window.removeEventListener("scroll", onScroll)
      window.removeEventListener("resize", onScroll)
      pics.forEach((p) => { if ("close" in p) p.close() })
    }
  }, [builds, n])

  return (
    <div ref={ref} className="relative" style={{ height: `${n * 100}svh` }}>
      <div className="sticky top-0 flex h-svh min-h-[520px] flex-col px-4 pt-10 pb-6 md:px-10">
        <h2 className="text-3xl font-semibold tracking-tight">{title}</h2>
        <div className="flex min-h-0 flex-1 items-center justify-center py-4">
          <div className="relative" style={{ aspectRatio: aspect, width: `min(100%, calc((100svh - 260px) * ${aspect}))` }}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={base} alt={baseAlt} loading="lazy" className="absolute inset-0 size-full" />
            <canvas ref={canvas} role="img" aria-label={builds.map((b) => b.label).join(" ")} className="absolute inset-0 size-full" />
          </div>
        </div>
        <div className={cx("grid gap-4", { 3: "md:grid-cols-3", 4: "md:grid-cols-4", 5: "md:grid-cols-5" }[n])}>
          {stages.map((s, i) => (
            <div key={s.title} className={cx("border-t-2 pt-3 transition-opacity duration-500",
              i === active ? "border-foreground opacity-100" : "border-border hidden opacity-40 md:block")}>
              <p className="text-sm font-medium">{s.title}</p>
              <p className="text-muted-foreground mt-1 text-sm">{s.text}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
