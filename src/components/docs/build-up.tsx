"use client"

// A part of the studio built in fast motion as the reader scrolls (the Floor and Wall sections). The section
// is one screen tall per stage and stays pinned; reaching a stage runs its build like a time-lapse, and
// scrolling back takes it apart, last build first. Each build lays groups of pieces one after another:
// "drop" pieces fall from above (large, high and shadowed, then landing), "fix" pieces (screws) pop in
// after the matching drop lands, an "unroll" piece rolls out from its top edge behind a roll, and "wipe"
// pieces are painted on one after another, each from its top edge down like a roller pass. Every
// piece is cropped from its layer's transparent render (scripts/studio/render/floor.html, wall.html, which
// also write the piece rectangles), so the pieces meet exactly. Styles are written straight to the pieces
// each frame; React re-renders only when the stage changes.
import { useEffect, useRef, useState } from "react"

import { cx } from "@/lib/cx"

type Rect = number[] // [x, y, w, h] as fractions of the picture
export type Group = { src: string; rects: Rect[]; kind: "drop" | "fix" | "unroll" | "wipe"; from: number; to: number; rise?: number }
export type Build = { secs: number; label: string; groups: Group[] }
type Stage = { title: string; text: string }

const DUR = 0.15 // of a build's clock, each piece's own motion
const clamp = (v: number) => Math.min(1, Math.max(0, v))
const out = (t: number) => 1 - (1 - t) ** 3

// one piece: a window onto its layer's picture
function Piece({ src, r }: { src: string; r: Rect }) {
  const [x, y, w, h] = r
  return (
    <div data-piece className="absolute overflow-hidden" style={{ left: `${x * 100}%`, top: `${y * 100}%`, width: `${w * 100}%`, height: `${h * 100}%`, opacity: 0 }}>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src={src} alt="" loading="lazy" className="absolute max-w-none"
        style={{ width: `${100 / w}%`, height: `${100 / h}%`, left: `${(-x / w) * 100}%`, top: `${(-y / h) * 100}%` }} />
    </div>
  )
}

export function BuildUp({ title, base, baseAlt, aspect, builds, stages }: {
  title: string; base: string; baseAlt: string; aspect: number; builds: Build[]; stages: Stage[]
}) {
  const ref = useRef<HTMLDivElement>(null)
  const groupRefs = useRef<(HTMLDivElement | null)[][]>([])
  const rollRefs = useRef<(HTMLDivElement | null)[][]>([])
  const [active, setActive] = useState(0)
  const n = stages.length

  useEffect(() => {
    const still = window.matchMedia("(prefers-reduced-motion: reduce)").matches
    const pieces = builds.map((b, i) => b.groups.map((_, j) =>
      Array.from(groupRefs.current[i]?.[j]?.querySelectorAll<HTMLElement>("[data-piece]") ?? [])))
    const c = builds.map(() => 0) // each build's clock, 0 (not started) to 1 (done)
    let stage = 0, last = performance.now(), frame = 0

    const drop = (el: HTMLElement, t: number, rise: number) => {
      const e = out(t)
      el.style.opacity = String(clamp(t * 3))
      el.style.transform = t >= 1 ? "" : `translateY(${(e - 1) * rise}px) scale(${1 + 0.18 * (1 - e)})`
      el.style.boxShadow = t > 0 && t < 1 ? `0 ${14 * (1 - e)}px ${22 * (1 - e)}px rgba(0,0,0,${0.3 * (1 - e)})` : ""
      el.style.zIndex = t > 0 && t < 1 ? "1" : ""
    }
    const draw = () => builds.forEach((b, i) => b.groups.forEach((g, j) => {
      const els = pieces[i][j], span = g.to - g.from
      els.forEach((el, k) => {
        const s = g.from + (k / Math.max(1, els.length)) * span
        if (g.kind === "drop") drop(el, clamp((c[i] - s) / DUR), g.rise ?? 40)
        else if (g.kind === "fix") { // after the matching drop lands
          const u = clamp((c[i] - s - DUR) / 0.06)
          el.style.opacity = String(u); el.style.transform = u >= 1 ? "" : `scale(${1.03 - 0.03 * u})`
        } else if (g.kind === "wipe") { // a roller pass, top to bottom
          const v = out(clamp((c[i] - s) / DUR))
          el.style.opacity = v > 0 ? "1" : "0"
          el.style.clipPath = `inset(0 0 ${(1 - v) * 100}% 0)`
        } else { // unroll down from the top edge, the roll riding the front
          const v = out(clamp((c[i] - g.from) / span)), [, ry, , rh] = g.rects[k]
          el.style.opacity = c[i] > g.from ? "1" : "0"
          el.style.clipPath = `inset(0 0 ${(1 - v) * 100}% 0)`
          const roll = rollRefs.current[i]?.[j]
          if (roll) { roll.style.opacity = c[i] > g.from && v < 1 ? "1" : "0"; roll.style.top = `${(ry + rh * v) * 100}%` }
        }
      })
    }))
    const tick = (now: number) => {
      frame = 0
      const dt = Math.min(0.1, (now - last) / 1000)
      last = now
      // a build runs once its stage is reached and the one before is done; it comes off only after the next
      let moving = false
      for (let i = 0; i < c.length; i++) {
        const on = (stage > i && (i === 0 || c[i - 1] >= 1)) || (i < c.length - 1 && c[i + 1] > 0)
        const secs = builds[i].secs
        const next = still ? (on ? 1 : 0) : on ? Math.min(1, c[i] + dt / secs) : Math.max(0, c[i] - (2 * dt) / secs)
        if (next !== c[i]) moving = true
        c[i] = next
      }
      draw()
      if (moving) frame = requestAnimationFrame(tick)
    }
    const onScroll = () => {
      const el = ref.current
      if (!el) return
      const r = el.getBoundingClientRect()
      const p = -r.top / Math.max(1, r.height - window.innerHeight)
      let next = 0
      for (let k = 1; k < n; k++) if (p > (k - 0.64) / (n - 1)) next = k
      if (next !== stage) { stage = next; setActive(next) }
      if (!frame) { last = performance.now(); frame = requestAnimationFrame(tick) }
    }
    draw()
    onScroll()
    window.addEventListener("scroll", onScroll, { passive: true })
    window.addEventListener("resize", onScroll)
    return () => {
      cancelAnimationFrame(frame)
      window.removeEventListener("scroll", onScroll)
      window.removeEventListener("resize", onScroll)
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
            {builds.map((b, i) => (
              <div key={i} role="img" aria-label={b.label}>
                {b.groups.map((g, j) => (
                  <div key={j} ref={(el) => { (groupRefs.current[i] ??= [])[j] = el }}>
                    {g.rects.map((r, k) => <Piece key={k} src={g.src} r={r} />)}
                    {g.kind === "unroll" && (
                      // the sheet still on its roll: a grey cylinder across it, riding the unrolled edge
                      <div ref={(el) => { (rollRefs.current[i] ??= [])[j] = el }} aria-hidden
                        className="absolute h-[3%] -translate-y-1/2 rounded-full opacity-0 shadow-md"
                        style={{ left: `${g.rects[0][0] * 100}%`, width: `${g.rects[0][2] * 100}%`, background: "linear-gradient(#f1f2f1, #c3c5c4 55%, #9a9d9c)" }} />
                    )}
                  </div>
                ))}
              </div>
            ))}
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
