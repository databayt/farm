"use client"

// The floor, built in fast motion as the reader scrolls, seen from straight above: the empty base, then the
// flat wood sheets dropped in one by one and screwed down, then the planks laid row by row from the back
// wall, then the bathroom end: its vinyl unrolled from the back wall in one sheet. The
// section is one screen tall per stage and stays pinned; reaching a stage runs its build like a time-lapse
// (scrolling back takes it apart, last build first). Every piece is cropped from its layer's transparent
// render (scripts/studio/render/floor.html, which also writes the piece rectangles), so the pieces meet
// exactly. Styles are written straight to the pieces each frame; React re-renders only when the stage changes.
import { useEffect, useRef, useState } from "react"

import { cx } from "@/lib/cx"

type Rect = number[] // [x, y, w, h] as fractions of the picture
type Stage = { title: string; text: string }

const SECS = [2.4, 3.2, 1.2] // seconds each build takes: sheets, planks, bathroom
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

export function FloorLayers({ src, pieces, alts, stages }: {
  src: { base: string; sheets: string; screws: string; planks: string; vinyl: string }
  pieces: { aspect: number; sheets: Rect[]; planks: Rect[]; vinyl: Rect }
  alts: [string, string, string, string]; stages: [Stage, Stage, Stage, Stage]
}) {
  const ref = useRef<HTMLDivElement>(null)
  const sheetsRef = useRef<HTMLDivElement>(null)
  const screwsRef = useRef<HTMLDivElement>(null)
  const planksRef = useRef<HTMLDivElement>(null)
  const bathRef = useRef<HTMLDivElement>(null)
  const rollRef = useRef<HTMLDivElement>(null)
  const [active, setActive] = useState(0)

  useEffect(() => {
    const still = window.matchMedia("(prefers-reduced-motion: reduce)").matches
    const els = (r: React.RefObject<HTMLDivElement | null>) => Array.from(r.current?.querySelectorAll<HTMLElement>("[data-piece]") ?? [])
    const S = els(sheetsRef), K = els(screwsRef), P = els(planksRef), [V] = els(bathRef), roll = rollRef.current
    const c = [0, 0, 0] // each build's clock, 0 (not started) to 1 (done)
    let stage = 0, last = performance.now(), frame = 0

    // a piece drops from above: it starts large (near the eye), high and shadowed, and lands
    const drop = (el: HTMLElement, t: number, rise: number) => {
      const e = out(t)
      el.style.opacity = String(clamp(t * 3))
      el.style.transform = t >= 1 ? "" : `translateY(${(e - 1) * rise}px) scale(${1 + 0.18 * (1 - e)})`
      el.style.boxShadow = t > 0 && t < 1 ? `0 ${14 * (1 - e)}px ${22 * (1 - e)}px rgba(0,0,0,${0.3 * (1 - e)})` : ""
      el.style.zIndex = t > 0 && t < 1 ? "1" : ""
    }
    const draw = () => {
      // pieces start one after another across most of the clock, each taking a slice of it
      S.forEach((el, i) => {
        const s = (i / S.length) * 0.75, t = clamp((c[0] - s) / 0.15)
        drop(el, t, 60)
        const k = K[i], u = clamp((c[0] - s - 0.15) / 0.08) // then its screws go in
        if (k) { k.style.opacity = String(u); k.style.transform = u >= 1 ? "" : `scale(${1.03 - 0.03 * u})` }
      })
      P.forEach((el, i) => drop(el, clamp((c[1] - (i / P.length) * 0.85) / 0.15), 30))
      // the vinyl unrolls from the back wall, the roll riding its front edge
      const v = out(c[2])
      if (V) { V.style.opacity = c[2] > 0 ? "1" : "0"; V.style.clipPath = `inset(0 0 ${(1 - v) * 100}% 0)` }
      if (roll) { roll.style.opacity = c[2] > 0 && v < 1 ? "1" : "0"; roll.style.top = `${(pieces.vinyl[1] + pieces.vinyl[3] * v) * 100}%` }
    }
    const tick = (now: number) => {
      frame = 0
      const dt = Math.min(0.1, (now - last) / 1000)
      last = now
      // a build runs once its stage is reached and the one before is done; it comes off only after the next
      let moving = false
      for (let i = 0; i < 3; i++) {
        const on = (stage > i && (i === 0 || c[i - 1] >= 1)) || (i < 2 && c[i + 1] > 0)
        const next = still ? (on ? 1 : 0) : on ? Math.min(1, c[i] + dt / SECS[i]) : Math.max(0, c[i] - (2 * dt) / SECS[i])
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
      const next = p > 0.72 ? 3 : p > 0.42 ? 2 : p > 0.12 ? 1 : 0
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
  }, [pieces.vinyl])

  const [vx, , vw] = pieces.vinyl
  return (
    <div ref={ref} className="relative" style={{ height: "400svh" }}>
      <div className="sticky top-0 flex h-svh min-h-[520px] flex-col px-4 pt-10 pb-6 md:px-10">
        <h2 className="text-3xl font-semibold tracking-tight">Floor</h2>
        <div className="flex min-h-0 flex-1 items-center justify-center py-4">
          <div className="relative" style={{ aspectRatio: pieces.aspect, width: `min(100%, calc((100svh - 260px) * ${pieces.aspect}))` }}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={src.base} alt={alts[0]} loading="lazy" className="absolute inset-0 size-full" />
            <div ref={sheetsRef} role="img" aria-label={alts[1]}>
              {pieces.sheets.map((r, i) => <Piece key={i} src={src.sheets} r={r} />)}
            </div>
            <div ref={screwsRef} aria-hidden>
              {pieces.sheets.map((r, i) => <Piece key={i} src={src.screws} r={r} />)}
            </div>
            <div ref={planksRef} role="img" aria-label={alts[2]}>
              {pieces.planks.map((r, i) => <Piece key={i} src={src.planks} r={r} />)}
            </div>
            <div ref={bathRef} role="img" aria-label={alts[3]}>
              <Piece src={src.vinyl} r={pieces.vinyl} />
            </div>
            {/* the vinyl still on its roll: a grey cylinder across the bathroom, riding the unrolled edge */}
            <div ref={rollRef} aria-hidden className="absolute h-[3%] -translate-y-1/2 rounded-full opacity-0 shadow-md"
              style={{ left: `${vx * 100}%`, width: `${vw * 100}%`, background: "linear-gradient(#f1f2f1, #c3c5c4 55%, #9a9d9c)" }} />
          </div>
        </div>
        <div className="grid gap-4 md:grid-cols-4">
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
