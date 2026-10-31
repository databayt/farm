import type * as React from "react"

import { PointsLead, PointsTable } from "@/components/docs/points-table"
import { RailTable } from "@/components/docs/rail-table"
import { dictionary } from "@/components/internationalization/dictionaries"
import { getLocale } from "@/components/internationalization/locale"
import { netPoints } from "@/components/volleyball/data"
import { rails } from "@/components/volleyball/rails"
import { words } from "@/components/volleyball/words"

// The court's reference sections, on its docs pages (D-059: guide/volleyball/*.md embeds them; scripts/sync-docs.mjs
// renders each as <Name />). Each row's id (pt-S1, pt-N…) is where a tag on the page's net
// drawing links.

export async function VolleyballNetPoints(): Promise<React.JSX.Element> {
  const lang = await getLocale()
  const points = netPoints(lang), t = dictionary(lang).table
  return (
    <>
      <PointsLead count={points.length} href="/volleyball#net" drawing={words[lang].pointsDrawing} />
      <PointsTable columns={[{ label: t.what }, { label: t.where, muted: true }, { label: t.size }]}
        rows={points.map((p) => ({ id: p.id, colour: p.colour, cells: [p.what, p.where, p.size] }))} />
    </>
  )
}

// What to buy: every rail on the page, as one table (the Materials page)
export async function VolleyballMaterials(): Promise<React.JSX.Element> {
  return <RailTable rails={rails(await getLocale())} />
}
