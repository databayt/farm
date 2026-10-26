"use client"

import * as React from "react"

// Marks which [data-step] child sits in the middle of the screen, as data-active on this
// wrapper. CSS does the rest (group-data-[active=n]), so the server-rendered images inside
// never re-render. Without JavaScript the first step stays active.
export function StepObserver({ children, className }: { children: React.ReactNode; className?: string }) {
  const ref = React.useRef<HTMLDivElement>(null)

  React.useEffect(() => {
    const root = ref.current
    if (!root) return
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          const step = (entry.target as HTMLElement).dataset.step
          if (entry.isIntersecting && step) root.dataset.active = step
        }
      },
      { rootMargin: "-45% 0px -45% 0px" },
    )
    root.querySelectorAll("[data-step]").forEach((step) => observer.observe(step))
    return () => observer.disconnect()
  }, [])

  return (
    <div ref={ref} data-active="0" className={className}>
      {children}
    </div>
  )
}
