"use client"

// A horizontal rail of product cards, after the products carousel on databayt.org (marketing
// products-carousel.tsx): full-bleed cards that peek past the edge, three across on a wide screen,
// paddle buttons at the end. Native scroll-snap instead of Embla keeps the island small.
import { useEffect, useRef, useState } from "react"

import { cx } from "@/lib/cx"

export type RailItem = { src: string; alt: string; category: string; title: string; text: string }

export function ItemRail({ items }: { items: RailItem[] }) {
  const ref = useRef<HTMLDivElement>(null)
  const [edge, setEdge] = useState({ start: true, end: false })

  useEffect(() => {
    const el = ref.current
    if (!el) return
    const onScroll = () => {
      const x = Math.abs(el.scrollLeft)
      setEdge({ start: x < 4, end: x + el.clientWidth >= el.scrollWidth - 4 })
    }
    onScroll()
    el.addEventListener("scroll", onScroll, { passive: true })
    window.addEventListener("resize", onScroll)
    return () => {
      el.removeEventListener("scroll", onScroll)
      window.removeEventListener("resize", onScroll)
    }
  }, [])

  // one card per press: the card width plus the gap
  const step = (dir: 1 | -1) => {
    const el = ref.current
    const card = el?.firstElementChild as HTMLElement | null
    if (!el || !card) return
    const rtl = getComputedStyle(el).direction === "rtl" ? -1 : 1
    el.scrollBy({ left: dir * rtl * (card.offsetWidth + 16), behavior: "smooth" })
  }

  return (
    <div>
      <div ref={ref}
        className="flex snap-x snap-mandatory scroll-px-4 gap-4 overflow-x-auto px-4 pb-2 [scrollbar-width:none] md:scroll-px-10 md:px-10 [&::-webkit-scrollbar]:hidden">
        {items.map((it) => (
          <article key={it.src}
            className="bg-muted/60 flex min-h-[460px] w-[85%] shrink-0 snap-start flex-col rounded-3xl p-8 md:w-[calc((100%-2rem)/3)] md:p-10">
            <p className="text-foreground/80 mb-1 text-sm font-medium tracking-tight">{it.category}</p>
            <h3 className="text-2xl leading-[1.1] font-semibold tracking-tight md:text-3xl">{it.title}</h3>
            <p className="text-foreground/70 mt-3 line-clamp-3 min-h-[4.125rem] max-w-sm leading-snug">{it.text}</p>
            <div className="flex flex-1 items-center justify-center py-6">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={it.src} alt={it.alt} loading="lazy" className="max-h-56 w-auto max-w-full object-contain" />
            </div>
          </article>
        ))}
      </div>
      <div className="mt-6 flex justify-end gap-3 px-4 md:px-10">
        <Paddle label="Previous" disabled={edge.start} onClick={() => step(-1)} d="M15 18l-6-6 6-6" />
        <Paddle label="Next" disabled={edge.end} onClick={() => step(1)} d="M9 18l6-6-6-6" />
      </div>
    </div>
  )
}

function Paddle({ label, disabled, onClick, d }: { label: string; disabled: boolean; onClick: () => void; d: string }) {
  return (
    <button type="button" aria-label={label} disabled={disabled} onClick={onClick}
      className={cx("bg-muted text-foreground/70 flex size-9 items-center justify-center rounded-full transition-colors",
        "hover:bg-muted-foreground/20 hover:text-foreground focus-visible:ring-ring focus-visible:ring-2 focus-visible:outline-none",
        "disabled:pointer-events-none disabled:opacity-40")}>
      <svg viewBox="0 0 24 24" className="size-5 rtl:-scale-x-100" fill="none" stroke="currentColor" strokeWidth={2.25}
        strokeLinecap="round" strokeLinejoin="round" aria-hidden><path d={d} /></svg>
    </button>
  )
}
