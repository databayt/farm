"use client"

// The floor, built up as the reader scrolls: the section is one screen tall per stage and the picture stays
// pinned while the scroll drives the layers on. The epoxy rolls across the ply from end A; the SPC settles
// down onto it. Each layer is its own transparent render (scripts/studio/render/floor.html), so they stack
// exactly. Styles are written straight to the layers on each frame; React re-renders only when the stage changes.
import { useEffect, useRef, useState } from "react"

import { cx } from "@/lib/cx"

type Stage = { title: string; text: string }

// 0 before a, 1 after b, eased between
const ease = (p: number, a: number, b: number) => {
  const t = Math.min(1, Math.max(0, (p - a) / (b - a)))
  return t * t * (3 - 2 * t)
}

export function FloorLayers({ base, epoxy, spc, alts, stages }: {
  base: string; epoxy: string; spc: string; alts: [string, string, string]; stages: [Stage, Stage, Stage]
}) {
  const ref = useRef<HTMLDivElement>(null)
  const epoxyRef = useRef<HTMLImageElement>(null)
  const spcRef = useRef<HTMLImageElement>(null)
  const [active, setActive] = useState(0)

  useEffect(() => {
    const still = window.matchMedia("(prefers-reduced-motion: reduce)").matches
    let frame = 0
    const draw = () => {
      frame = 0
      const el = ref.current, e = epoxyRef.current, s = spcRef.current
      if (!el || !e || !s) return
      const r = el.getBoundingClientRect()
      const p = -r.top / Math.max(1, r.height - window.innerHeight)
      let t1 = ease(p, 0.15, 0.45), t2 = ease(p, 0.55, 0.85)
      if (still) { t1 = t1 > 0 ? 1 : 0; t2 = t2 > 0 ? 1 : 0 }
      e.style.clipPath = `inset(0 ${(1 - t1) * 100}% 0 0)`
      e.style.opacity = String(Math.min(1, t1 * 4))
      s.style.transform = `translateY(${(t2 - 1) * 14}%)`
      s.style.opacity = String(t2)
      setActive(t2 > 0.5 ? 2 : t1 > 0.5 ? 1 : 0)
    }
    const onScroll = () => { frame ||= requestAnimationFrame(draw) }
    draw()
    window.addEventListener("scroll", onScroll, { passive: true })
    window.addEventListener("resize", onScroll)
    return () => {
      cancelAnimationFrame(frame)
      window.removeEventListener("scroll", onScroll)
      window.removeEventListener("resize", onScroll)
    }
  }, [])

  const img = "absolute inset-0 size-full object-contain"
  return (
    <div ref={ref} className="relative" style={{ height: "300svh" }}>
      <div className="sticky top-0 flex h-svh min-h-[520px] flex-col px-4 pt-10 pb-6 md:px-10">
        <h2 className="text-3xl font-semibold tracking-tight">Floor</h2>
        <div className="relative mt-6 min-h-0 flex-1">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={base} alt={alts[0]} width={2400} height={1350} loading="lazy" className={img} />
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img ref={epoxyRef} src={epoxy} alt={alts[1]} width={2400} height={1350} loading="lazy"
            className={img} style={{ opacity: 0, clipPath: "inset(0 100% 0 0)" }} />
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img ref={spcRef} src={spc} alt={alts[2]} width={2400} height={1350} loading="lazy"
            className={cx(img, "drop-shadow-[0_6px_6px_rgba(0,0,0,0.12)]")} style={{ opacity: 0 }} />
        </div>
        <div className="mt-4 grid gap-4 md:grid-cols-3">
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
