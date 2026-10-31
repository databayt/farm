import type * as React from "react"

import { type RailItem } from "@/components/docs/item-rail"

// What a place needs to buy, on its Materials page (D-059), for the places with no bill of materials yet: every
// card its page shows in a rail, rail by rail, with its size, where to buy it and what it costs, in the rail's own
// words ("Not sourced yet", "Not in the budget yet" until a quote).
export type Rail = { title: string; items: RailItem[] }

const value = (item: RailItem, label: string) => item.details.find((d) => d.label === label)?.value ?? ""

export function RailTable({ rails }: { rails: Rail[] }): React.JSX.Element {
  return (
    <div className="mt-6 overflow-x-auto rounded-xl border">
      <table className="w-full text-sm">
        <thead className="text-muted-foreground bg-muted/40">
          <tr>
            {["Item", "Size", "Where to buy", "Cost"].map((label) => (
              <th key={label} className="px-3 py-2 text-start font-medium whitespace-nowrap">{label}</th>
            ))}
          </tr>
        </thead>
        {rails.map((rail) => (
          <tbody key={rail.title}>
            <tr className="border-t">
              <th colSpan={4} className="bg-muted/20 px-3 py-2 text-start font-semibold">{rail.title}</th>
            </tr>
            {rail.items.map((item) => (
              <tr key={item.title} className="border-t">
                <td className="px-3 py-2 font-medium">{item.title}</td>
                <td className="text-muted-foreground px-3 py-2">{value(item, "Dimensions")}</td>
                <td className="px-3 py-2">{value(item, "Where to buy")}</td>
                <td className="px-3 py-2">{value(item, "Cost")}</td>
              </tr>
            ))}
          </tbody>
        ))}
      </table>
    </div>
  )
}
