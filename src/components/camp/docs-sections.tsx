import type * as React from "react"

import { RailTable } from "@/components/docs/rail-table"
import { rails } from "@/components/camp/rails"
import { getLocale } from "@/components/internationalization/locale"

// The camp's reference section, on its Materials page (D-059: guide/camp/materials.md embeds it; scripts/sync-docs.mjs
// renders it as <CampMaterials />). The camp has no services, so it has no points.

// What to buy: the kit rail on the page, as one table
export async function CampMaterials(): Promise<React.JSX.Element> {
  return <RailTable rails={rails(await getLocale())} />
}
