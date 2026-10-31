import type * as React from "react"

import { barBom } from "@/components/bar/bom"
import type { Locale } from "@/components/internationalization/config"
import { dictionary } from "@/components/internationalization/dictionaries"
import { LocaleLink as Link } from "@/components/internationalization/locale-link"
import { getLocale } from "@/components/internationalization/locale"
import type { Words } from "@/components/internationalization/words"
import { parkingBom } from "@/components/parking/bom"
import site from "@/components/site/places.json"
import { readCsv } from "@/components/studio/data"
import { bill, CONTINGENCY, type Line } from "@/lib/bom"
import { frw, rwf } from "@/lib/format"
import plan from "../../../public/designs/farming/data/plan.json"

// The farm's reference sections, on its docs pages (guide/farm/*.md embeds them; scripts/sync-docs.mjs renders each as
// <Name />). The whole first build's bill (the plan of 2026-10-31): a row for each place in the founder's order, its
// bill's lines, how many carry a price and their total with the contingency, then the farm's shared works and the sum.
// The studios and the field come from their generators (public/designs/studio/data, public/designs/farming/data), the
// other places from their bom.ts (src/lib/bom.ts); a place with no bill yet says so.

const en = {
  lead: (total: string, priced: number, lines: number) => `The whole first build, place by place: about ${total} for the ${priced} of ${lines} lines that carry a price, each with a 15 % contingency. The rest wait for quotes. Open a place for its bill.`,
  head: { place: "Place", lines: "Lines", priced: "Priced", total: "Total (RWF)" },
  studios: (n: number) => `Studios (${n})`,
  shared: "Shared works: septic, water storage and booster, site board",
  pending: (id: string): string => id === "guest-room" ? "Its bill comes with the block's rebuild" : "No bill yet",
  sum: "The first build",
}
const rw: typeof en = {
  lead: (total, priced, lines) => `Ibyubakwa byose bya mbere, ahantu ku hantu: hafi ${total} ku mirongo ${priced} muri ${lines} ifite igiciro, buri hantu hamwe n'ingoboka ya 15 %. Indi itegereje ibiciro by'abacuruzi. Fungura ahantu urebe urutonde rwaho.`,
  head: { place: "Ahantu", lines: "Imirongo", priced: "Ifite igiciro", total: "Igiteranyo (RWF)" },
  studios: (n) => `Sitidiyo (${n})`,
  shared: "Imirimo ihuriweho: septic, ikigega cy'amazi na pompe, board y'ikibanza",
  pending: (id) => id === "guest-room" ? "Urutonde rwayo ruzaza hamwe no kongera kubaka inzu" : "Nta rutonde rurabaho",
  sum: "Ibyubakwa bya mbere",
}
const words: Words<typeof en> = { en, rw }

// each place's bill, by its id in places.json; a place not here has no bill yet
const BILLS: Record<string, (lang: Locale) => Line[]> = { bar: barBom, parking: parkingBom }

type Row = { id: string; name: string; href?: string; lines?: number; priced?: number; total?: number }

function rows(lang: Locale): Row[] {
  const t = words[lang], places = dictionary(lang).places as Record<string, string>
  const summary = readCsv("bom-summary.csv")
  const studioLines = readCsv("bom.csv").length
  const labour = summary.find((r) => r.category === "labour")!
  const units = Math.round(Number(labour.all_units_rwf) / Number(labour.per_unit_rwf))
  const perUnit = Number(summary.find((r) => r.category === "TOTAL")!.per_unit_rwf)
  const shared = readCsv("shared-works.csv").reduce((n, r) => n + Number(r.rwf), 0)
  const out: Row[] = site.places.map((id) => {
    const name = places[id] ?? id, href = `/docs/${id}/materials`
    if (id === "studio") return { id, name: t.studios(units), href, lines: studioLines, priced: studioLines, total: perUnit * units }
    if (id === "farming") return { id, name, href, lines: plan.bom.length, priced: plan.bom.length, total: plan.total }
    const lines = BILLS[id]?.(lang)
    if (!lines) return { id, name }
    const b = bill(lines)
    return { id, name, href, lines: b.lines, priced: b.priced, total: b.total }
  })
  return [...out, { id: "shared", name: t.shared, lines: readCsv("shared-works.csv").length,
    priced: readCsv("shared-works.csv").length, total: Math.round(shared * (1 + CONTINGENCY)) }]
}

export async function FarmBom(): Promise<React.JSX.Element> {
  const lang = await getLocale()
  const t = words[lang], all = rows(lang)
  const sum = (k: "lines" | "priced" | "total") => all.reduce((n, r) => n + (r[k] ?? 0), 0)
  return (
    <>
      <p className="text-muted-foreground">{t.lead(rwf(sum("total")), sum("priced"), sum("lines"))}</p>
      <div className="mt-6 overflow-x-auto rounded-xl border">
        <table className="w-full text-sm">
          <thead className="text-muted-foreground bg-muted/40">
            <tr>
              <th className="px-4 py-2 text-start font-medium">{t.head.place}</th>
              <th className="px-3 py-2 text-end font-medium">{t.head.lines}</th>
              <th className="px-3 py-2 text-end font-medium">{t.head.priced}</th>
              <th className="px-4 py-2 text-end font-medium">{t.head.total}</th>
            </tr>
          </thead>
          <tbody>
            {all.map((r) => (
              <tr key={r.id} className="border-t">
                <td className="px-4 py-2">{r.href ? <Link href={r.href} className="underline underline-offset-4">{r.name}</Link> : r.name}</td>
                {r.lines === undefined ? (
                  <td colSpan={3} className="text-muted-foreground px-4 py-2 text-end">{t.pending(r.id)}</td>
                ) : (
                  <>
                    <td className="px-3 py-2 text-end tabular-nums">{r.lines}</td>
                    <td className="text-muted-foreground px-3 py-2 text-end tabular-nums">{r.priced}</td>
                    <td className="px-4 py-2 text-end tabular-nums">{frw(r.total ?? 0)}</td>
                  </>
                )}
              </tr>
            ))}
          </tbody>
          <tfoot>
            <tr className="border-t-2 font-semibold">
              <td className="px-4 py-3">{t.sum}</td>
              <td className="px-3 py-3 text-end tabular-nums">{sum("lines")}</td>
              <td className="px-3 py-3 text-end tabular-nums">{sum("priced")}</td>
              <td className="px-4 py-3 text-end tabular-nums">{frw(sum("total"))}</td>
            </tr>
          </tfoot>
        </table>
      </div>
    </>
  )
}
