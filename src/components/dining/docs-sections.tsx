import type * as React from "react"

import { RailTable } from "@/components/docs/rail-table"
import { rails } from "@/components/dining/rails"
import { getLocale } from "@/components/internationalization/locale"

// The dining area's reference section, on its Materials page (D-059: guide/dining/materials.md embeds it;
// scripts/sync-docs.mjs renders it as <DiningMaterials />). Its lamps' power is not designed yet, so it has no points.

// What to buy: the page's two rails, as one table
export async function DiningMaterials(): Promise<React.JSX.Element> {
  return <RailTable rails={rails(await getLocale())} />
}
