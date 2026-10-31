"use client"

// A horizontal rail of product cards, after the products carousel on databayt.org (marketing
// products-carousel.tsx): full-bleed cards that peek past the edge, three across on a wide screen,
// paddle buttons at the end. Native scroll-snap instead of Embla keeps the island small. Each card is
// a title and a picture; the card in focus (tapped, or first in view after a scroll) shows its
// details below the rail.
import { useEffect, useRef, useState } from "react"

import { cx } from "@/lib/cx"
import { dictionary } from "@/components/internationalization/dictionaries"
import { useLocale } from "@/components/internationalization/use-locale"

export type RailItem = {
  src: string
  alt: string
  title: string
  details: { key?: string; label: string; value: string }[]
  note?: string
}

export function ItemRail({ items }: { items: RailItem[] }) {
  const ref = useRef<HTMLDivElement>(null)
  const [edge, setEdge] = useState({ start: true, end: false })
  const [active, setActive] = useState(0)
  const t = dictionary(useLocale()).rail

  useEffect(() => {
    const el = ref.current
    if (!el) return
    const onScroll = () => {
      const x = Math.abs(el.scrollLeft)
      setEdge({ start: x < 4, end: x + el.clientWidth >= el.scrollWidth - 4 })
    }
    // after a swipe, keep the focus on a card in view: the first one when the focused card left
    const onEnd = () => {
      const box = el.getBoundingClientRect()
      const cards = [...el.children] as HTMLElement[]
      const seen = (c: HTMLElement) => {
        const r = c.getBoundingClientRect()
        return r.left >= box.left - 8 && r.right <= box.right + 8
      }
      setActive((a) => (cards[a] && seen(cards[a]) ? a : Math.max(0, cards.findIndex(seen))))
    }
    onScroll()
    el.addEventListener("scroll", onScroll, { passive: true })
    el.addEventListener("scrollend", onEnd)
    window.addEventListener("resize", onScroll)
    return () => {
      el.removeEventListener("scroll", onScroll)
      el.removeEventListener("scrollend", onEnd)
      window.removeEventListener("resize", onScroll)
    }
  }, [])

  // the paddles move the focus one card and bring it into view
  const step = (dir: 1 | -1) => {
    const i = Math.min(items.length - 1, Math.max(0, active + dir))
    setActive(i)
    const card = ref.current?.children[i] as HTMLElement | undefined
    card?.scrollIntoView({ behavior: "smooth", block: "nearest", inline: "nearest" })
  }

  const it = items[active]
  return (
    <div>
      <div ref={ref}
        className="flex snap-x snap-mandatory scroll-px-4 gap-4 overflow-x-auto px-4 py-1 [scrollbar-width:none] md:scroll-px-10 md:px-10 [&::-webkit-scrollbar]:hidden">
        {items.map((x, i) => (
          <button key={x.src} type="button" onClick={() => setActive(i)} aria-pressed={i === active}
            className={cx("bg-muted/60 flex aspect-[4/3] w-[80%] shrink-0 snap-start flex-col rounded-3xl p-6 text-start transition-shadow md:w-[calc((100%-2rem)/3)]",
              "focus-visible:ring-ring focus-visible:ring-2 focus-visible:outline-none",
              i === active ? "ring-foreground ring-1" : "hover:ring-foreground/20 hover:ring-1")}>
            <span className="text-base font-medium tracking-tight">{x.title}</span>
            <span className="relative mt-2 min-h-0 flex-1">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={x.src} alt={x.alt} loading="lazy" className="absolute inset-0 size-full object-contain p-2" />
            </span>
          </button>
        ))}
      </div>
      <div className="mt-4 flex justify-end gap-3 px-4 md:px-10">
        <Paddle label={t.previous} disabled={active === 0 && edge.start} onClick={() => step(-1)} d="M15 18l-6-6 6-6" />
        <Paddle label={t.next} disabled={active === items.length - 1 && edge.end} onClick={() => step(1)} d="M9 18l6-6-6-6" />
      </div>
      <div className="px-4 md:px-10" aria-live="polite" aria-label={it.title}>
        <dl className="mt-4 grid gap-px overflow-hidden rounded-xl border bg-border sm:grid-cols-3">
          {it.details.map((d) => (
            <div key={d.label} className="bg-background p-4">
              <dt className="text-muted-foreground text-sm">{d.label}</dt>
              <dd className="mt-1 font-medium">{d.value}</dd>
            </div>
          ))}
        </dl>
        {it.note && <p className="text-muted-foreground mt-2 text-sm">{it.note}</p>}
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
