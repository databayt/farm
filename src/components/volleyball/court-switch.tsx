"use client"

import { useState } from "react"

import { cn } from "@/lib/utils"

// The 2D's switch between the two games the lawn can take: both plans render on the server and arrive as props,
// so the switch only chooses which one shows.
export function CourtSwitch({ courts }: { courts: { id: string; label: string; plan: React.ReactNode }[] }) {
  const [active, setActive] = useState(courts[0].id)
  return (
    <div className="flex size-full min-h-0 flex-col items-center gap-4 self-stretch">
      <div role="group" aria-label="Court" className="bg-muted/60 inline-flex rounded-full p-1 text-sm font-medium">
        {courts.map((c) => (
          <button key={c.id} type="button" onClick={() => setActive(c.id)} aria-pressed={c.id === active}
            className={cn("rounded-full px-4 py-1.5 transition-colors focus-visible:ring-ring focus-visible:ring-2 focus-visible:outline-none",
              c.id === active ? "bg-background text-foreground shadow-sm" : "text-muted-foreground hover:text-foreground")}>
            {c.label}
          </button>
        ))}
      </div>
      {courts.map((c) => (
        <div key={c.id} hidden={c.id !== active} className="min-h-0 w-full flex-1 items-center justify-center [&:not([hidden])]:flex">
          {c.plan}
        </div>
      ))}
    </div>
  )
}
