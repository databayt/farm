import type * as React from "react"

import { type RailItem } from "@/components/docs/item-rail"
import { getDictionary } from "@/components/internationalization/dictionaries"
import { getLocale } from "@/components/internationalization/locale"

// What a place needs to buy, on its Materials page (D-059), for the places with no bill of materials yet: every
// card its page shows in a rail, rail by rail, with its size, where to buy it and what it costs, in the rail's own
// words ("Not sourced yet", "Not in the budget yet" until a quote).
export type Rail = { title: string; items: RailItem[] }

// a card's detail by its key (size, where, cost), whatever language labels it; a card built without keys lists them
// in that order
const KEYS = ["size", "where", "cost"]
const value = (item: RailItem, key: string) =>
  (item.details.find((d) => d.key === key) ?? (item.details.some((d) => d.key) ? undefined : item.details[KEYS.indexOf(key)]))?.value ?? ""

export async function RailTable({ rails }: { rails: Rail[] }): Promise<React.JSX.Element> {
  const t = (await getDictionary(await getLocale())).rail
  return (
    <div className="mt-6 overflow-x-auto rounded-xl border">
      <table className="w-full text-sm">
        <thead className="text-muted-foreground bg-muted/40">
          <tr>
            {[t.item, t.size, t.whereToBuy, t.cost].map((label) => (
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
                <td className="text-muted-foreground px-3 py-2">{value(item, "size")}</td>
                <td className="px-3 py-2">{value(item, "where")}</td>
                <td className="px-3 py-2">{value(item, "cost")}</td>
              </tr>
            ))}
          </tbody>
        ))}
      </table>
    </div>
  )
}
