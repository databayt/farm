"use client"

import * as React from "react"

// Keeps its header out of the way: hidden at the top of the page and while scrolling down,
// slid back in as soon as the reader scrolls up. Used where a full-screen hero owns the first screen.
export function ScrollHeader({ children }: { children: React.ReactNode }) {
  const ref = React.useRef<HTMLDivElement>(null)

  React.useEffect(() => {
    const el = ref.current
    if (!el) return
    let last = window.scrollY
    let frame = 0
    const onScroll = () => {
      cancelAnimationFrame(frame)
      frame = requestAnimationFrame(() => {
        const y = window.scrollY
        if (Math.abs(y - last) < 4) return
        el.toggleAttribute("data-shown", y < last && y > 0)
        last = y
      })
    }
    window.addEventListener("scroll", onScroll, { passive: true })
    return () => {
      window.removeEventListener("scroll", onScroll)
      cancelAnimationFrame(frame)
    }
  }, [])

  return (
    <div
      ref={ref}
      className="fixed inset-x-0 top-0 z-50 -translate-y-full transition-transform duration-300 focus-within:translate-y-0 data-[shown]:translate-y-0"
    >
      {children}
    </div>
  )
}
