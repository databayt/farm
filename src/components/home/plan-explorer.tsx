"use client"

import * as React from "react"

import { cx } from "@/lib/cx"

type Spot = { id: string; n: string; title: string; x: number; y: number }

// Numbered places over the site plan. Choosing one shows its card; the cards are rendered on
// the server and only shown or hidden here. Starts on the courtyard.
export function PlanExplorer({
  spots,
  cards,
  map,
  note,
  initial,
}: {
  spots: Spot[]
  cards: React.ReactNode[]
  map: React.ReactNode
  note: string
  initial: number
}) {
  const [selected, setSelected] = React.useState(initial)

  return (
    <div className="grid gap-10 lg:grid-cols-[1.5fr_1fr] lg:items-start lg:gap-12">
      <div>
        <div className="relative">
          {map}
          {spots.map((spot, i) => (
            <button
              key={spot.id}
              type="button"
              aria-pressed={selected === i}
              aria-controls="plan-card"
              onClick={() => setSelected(i)}
              className={cx(
                "absolute grid size-8 -translate-x-1/2 -translate-y-1/2 place-items-center rounded-full font-mono text-xs font-medium shadow-md ring-2 transition-[scale,background-color,color] duration-200 md:size-9",
                "focus-visible:ring-lake focus-visible:outline-none",
                selected === i ? "bg-soil text-chalk ring-chalk scale-110" : "bg-chalk text-soil ring-soil/15 hover:scale-110",
              )}
              style={{ left: `${spot.x}%`, top: `${spot.y}%` }}
            >
              <span aria-hidden>{spot.n}</span>
              <span className="sr-only">{spot.title}</span>
            </button>
          ))}
        </div>
        <p className="text-muted-foreground mt-3 font-mono text-[11px] tracking-[0.18em] uppercase">{note}</p>
      </div>
      <div id="plan-card" aria-live="polite" className="lg:sticky lg:top-[calc(var(--header-height)+2rem)]">
        {cards.map((card, i) => (
          <div key={spots[i].id} hidden={selected !== i}>
            {card}
          </div>
        ))}
      </div>
    </div>
  )
}
