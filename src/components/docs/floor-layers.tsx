"use client"

// The floor, built in fast motion as the reader scrolls, seen from straight above: the empty base, then the
// flat wood sheets dropped in one by one and screwed down, then the planks laid row by row from the back
// wall. The section is one screen tall per stage and stays pinned; reaching a stage runs its build like a
// time-lapse (scrolling back takes it apart). Every piece is cropped from its layer's transparent render
// (scripts/studio/render/floor.html, which also writes the piece rectangles), so the pieces meet exactly.
// Styles are written straight to the pieces each frame; React re-renders only when the stage changes.
import { useEffect, useRef, useState } from "react"

import { cx } from "@/lib/cx"

type Rect = number[] // [x, y, w, h] as fractions of the picture
type Stage = { title: string; text: string }

const SHEETS_S = 2.4, PLANKS_S = 3.2 // seconds each build takes
const clamp = (v: number) => Math.min(1, Math.max(0, v))
const out = (t: number) => 1 - (1 - t) ** 3

// one piece: a window onto its layer's picture
function Piece({ src, r, alt }: { src: string; r: Rect; alt?: string }) {
  const [x, y, w, h] = r
  return (
    <div data-piece className="absolute overflow-hidden" style={{ left: `${x * 100}%`, top: `${y * 100}%`, width: `${w * 100}%`, height: `${h * 100}%`, opacity: 0 }}>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src={src} alt={alt ?? ""} loading="lazy" className="absolute max-w-none"
        style={{ width: `${100 / w}%`, height: `${100 / h}%`, left: `${(-x / w) * 100}%`, top: `${(-y / h) * 100}%` }} />
    </div>
  )
}

export function FloorLayers({ base, sheets, screws, planks, pieces, alts, stages }: {
  base: string; sheets: string; screws: string; planks: string
  pieces: { aspect: number; sheets: Rect[]; planks: Rect[] }
  alts: [string, string, string]; stages: [Stage, Stage, Stage]
}) {
  const ref = useRef<HTMLDivElement>(null)
  const sheetsRef = useRef<HTMLDivElement>(null)
  const screwsRef = useRef<HTMLDivElement>(null)
  const planksRef = useRef<HTMLDivElement>(null)
  const [active, setActive] = useState(0)

  useEffect(() => {
    const still = window.matchMedia("(prefers-reduced-motion: reduce)").matches
    const els = (r: React.RefObject<HTMLDivElement | null>) => Array.from(r.current?.querySelectorAll<HTMLElement>("[data-piece]") ?? [])
    const S = els(sheetsRef), K = els(screwsRef), P = els(planksRef)
    let c1 = 0, c2 = 0, stage = 0, last = performance.now(), frame = 0

    // a piece drops from above: it starts large (near the eye), high and shadowed, and lands
    const drop = (el: HTMLElement, t: number, rise: number) => {
      const e = out(t)
      el.style.opacity = String(clamp(t * 3))
      el.style.transform = t >= 1 ? "" : `translateY(${(e - 1) * rise}px) scale(${1 + 0.18 * (1 - e)})`
      el.style.boxShadow = t > 0 && t < 1 ? `0 ${14 * (1 - e)}px ${22 * (1 - e)}px rgba(0,0,0,${0.3 * (1 - e)})` : ""
      el.style.zIndex = t > 0 && t < 1 ? "1" : ""
    }
    const draw = () => {
      // pieces start one after another across the first 80% of the clock, each taking 20%
      S.forEach((el, i) => {
        const s = (i / S.length) * 0.75, t = clamp((c1 - s) / 0.15)
        drop(el, t, 60)
        const k = K[i], u = clamp((c1 - s - 0.15) / 0.08) // then its screws go in
        if (k) { k.style.opacity = String(u); k.style.transform = u >= 1 ? "" : `scale(${1.03 - 0.03 * u})` }
      })
      P.forEach((el, i) => drop(el, clamp((c2 - (i / P.length) * 0.85) / 0.15), 30))
    }
    const tick = (now: number) => {
      frame = 0
      const dt = Math.min(0.1, (now - last) / 1000)
      last = now
      const step = (c: number, on: boolean, secs: number) =>
        still ? (on ? 1 : 0) : on ? Math.min(1, c + dt / secs) : Math.max(0, c - (2 * dt) / secs)
      // the planks wait for the sheets; the sheets come off only once the planks are up
      c1 = step(c1, stage >= 1 || c2 > 0, SHEETS_S)
      c2 = step(c2, stage >= 2 && c1 >= 1, PLANKS_S)
      draw()
      if (c1 !== (stage >= 1 || c2 > 0 ? 1 : 0) || c2 !== (stage >= 2 && c1 >= 1 ? 1 : 0)) frame = requestAnimationFrame(tick)
    }
    const onScroll = () => {
      const el = ref.current
      if (!el) return
      const r = el.getBoundingClientRect()
      const p = -r.top / Math.max(1, r.height - window.innerHeight)
      const next = p > 0.6 ? 2 : p > 0.2 ? 1 : 0
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
  }, [])

  return (
    <div ref={ref} className="relative" style={{ height: "300svh" }}>
      <div className="sticky top-0 flex h-svh min-h-[520px] flex-col px-4 pt-10 pb-6 md:px-10">
        <h2 className="text-3xl font-semibold tracking-tight">Floor</h2>
        <div className="flex min-h-0 flex-1 items-center justify-center py-4">
          <div className="relative" style={{ aspectRatio: pieces.aspect, width: `min(100%, calc((100svh - 260px) * ${pieces.aspect}))` }}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={base} alt={alts[0]} loading="lazy" className="absolute inset-0 size-full" />
            <div ref={sheetsRef} role="img" aria-label={alts[1]}>
              {pieces.sheets.map((r, i) => <Piece key={i} src={sheets} r={r} />)}
            </div>
            <div ref={screwsRef} aria-hidden>
              {pieces.sheets.map((r, i) => <Piece key={i} src={screws} r={r} />)}
            </div>
            <div ref={planksRef} role="img" aria-label={alts[2]}>
              {pieces.planks.map((r, i) => <Piece key={i} src={planks} r={r} />)}
            </div>
          </div>
        </div>
        <div className="grid gap-4 md:grid-cols-3">
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
