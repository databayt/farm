"use client"

import * as React from "react"
import { ChevronsLeftRight } from "lucide-react"

import { cx } from "@/lib/cx"

// Before and after: the photograph of today on the left of the line, the plan on the right.
// A native range input lies over the whole picture, so dragging, clicking and the arrow keys
// all work and screen readers hear a slider. Both pictures are rendered on the server.
export function Compare({
  before,
  after,
  label,
  beforeLabel,
  afterLabel,
  className,
}: {
  before: React.ReactNode
  after: React.ReactNode
  label: string
  beforeLabel: string
  afterLabel: string
  className?: string
}) {
  const [position, setPosition] = React.useState(50)

  return (
    <div
      className={cx("relative isolate overflow-hidden rounded-2xl select-none", className)}
      style={{ "--pos": `${position}%` } as React.CSSProperties}
    >
      <div className="absolute inset-0">{after}</div>
      <div className="absolute inset-0 [clip-path:inset(0_calc(100%_-_var(--pos))_0_0)]">{before}</div>
      <input
        type="range"
        min={0}
        max={100}
        value={position}
        onChange={(e) => setPosition(Number(e.target.value))}
        aria-label={label}
        aria-valuetext={`${position}% ${beforeLabel}, ${100 - position}% ${afterLabel}`}
        className="peer absolute inset-0 z-10 size-full cursor-ew-resize opacity-0"
      />
      <div aria-hidden className="bg-chalk pointer-events-none absolute inset-y-0 left-(--pos) w-0.5 -translate-x-1/2 shadow-[0_0_14px_rgb(0_0_0/0.35)]" />
      <span
        aria-hidden
        className="bg-chalk text-soil peer-focus-visible:ring-lake pointer-events-none absolute top-1/2 left-(--pos) grid size-11 -translate-x-1/2 -translate-y-1/2 place-items-center rounded-full shadow-lg ring-offset-2 peer-focus-visible:ring-4"
      >
        <ChevronsLeftRight className="size-5" />
      </span>
      <span aria-hidden className="bg-soil/70 text-chalk pointer-events-none absolute top-3 left-3 rounded-full px-2.5 py-1 font-mono text-[10px] tracking-[0.18em] uppercase backdrop-blur-sm">
        {beforeLabel}
      </span>
      <span aria-hidden className="bg-soil/70 text-chalk pointer-events-none absolute top-3 right-3 rounded-full px-2.5 py-1 font-mono text-[10px] tracking-[0.18em] uppercase backdrop-blur-sm">
        {afterLabel}
      </span>
    </div>
  )
}
