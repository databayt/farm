"use client"

// The floor, built up as the reader scrolls: the section is one screen tall per stage, the picture
// stays pinned, and each screen of scroll swaps in the next layer (renders from scripts/studio/render/floor.html).
import { useEffect, useRef, useState } from "react"

import { cx } from "@/lib/cx"

type Stage = { src: string; alt: string; title: string; text: string }

export function FloorLayers({ stages }: { stages: Stage[] }) {
  const ref = useRef<HTMLDivElement>(null)
  const [active, setActive] = useState(0)

  useEffect(() => {
    const onScroll = () => {
      const el = ref.current
      if (!el) return
      const r = el.getBoundingClientRect()
      const progress = -r.top / Math.max(1, r.height - window.innerHeight)
      setActive(Math.min(stages.length - 1, Math.max(0, Math.floor(progress * stages.length))))
    }
    onScroll()
    window.addEventListener("scroll", onScroll, { passive: true })
    window.addEventListener("resize", onScroll)
    return () => {
      window.removeEventListener("scroll", onScroll)
      window.removeEventListener("resize", onScroll)
    }
  }, [stages.length])

  return (
    <div ref={ref} className="relative" style={{ height: `${stages.length * 100}svh` }}>
      <div className="sticky top-0 flex h-svh min-h-[520px] flex-col px-4 pt-10 pb-6 md:px-10">
        <h2 className="text-3xl font-semibold tracking-tight">Floor</h2>
        <div className="relative mt-6 min-h-0 flex-1">
          {stages.map((s, i) => (
            // eslint-disable-next-line @next/next/no-img-element
            <img key={s.src} src={s.src} alt={s.alt} width={2400} height={1350} loading="lazy"
              className={cx("absolute inset-0 size-full object-contain transition-opacity duration-700",
                i === active ? "opacity-100" : "opacity-0")} />
          ))}
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
